#include <stdio.h>
#include <limits.h>
#include <stdlib.h>
#include <stdbool.h>
#include <sys/param.h>
#include <dirent.h>
#include <string.h>
#include <assert.h>

#include "stb_c_lexer.h"
#include "raylib_parser.c"

#define MAX_FUNCS_TO_PARSE    1024 // Maximum number of functions to parse
#define MAX_FUNCS_PER_EXAMPLE 1024 // Maximum number of usages per function per file

typedef struct {
    char filename[256];
    // TODO: Track where function usage was found and display it?
} FunctionUsage;

typedef struct {
    int from, to; // [from, to) - from inclusive, to exclusive
} LineRange;

static bool StartsWith(char *text, int textSize, char *prefix, int prefixSize)
{
    return textSize >= prefixSize && !strncmp(text, prefix, prefixSize);
}

static bool EndsSith(char *text, int textSize, char *suffix, int suffixSize)
{
    return textSize >= suffixSize && !strncmp(text+textSize-suffixSize, suffix, suffixSize);
}

static bool GetNextLine(LineRange *line, char *text, int textSize, int from)
{
    for (int i = from; i < textSize; i++) {
        if (text[i] == '\n') {
            line->from = from;
            line->to = i;
            return true;
        }
    }
    return false;
}

static int GetFunctionFromIdentifier(char *id, FunctionInfo *functions, int functionCount)
{
    int idSize = strlen(id);

    for (int i = 0; i < functionCount; i++) {
        FunctionInfo *function = &functions[i];
        if (idSize > sizeof(function->name)) continue;
        if (!strcmp(id, function->name)) {
            return i;
        }
    }
    return -1;
}

static bool ParseFunctionUsagesFromFile(char *directory, char *filePath, FunctionUsage *usages[], int *usageCounts, FunctionInfo *functions, int functionCount)
{
    char fullPath[PATH_MAX] = { 0 };
    snprintf(fullPath, sizeof(fullPath), "%s/%s", directory, filePath);

    int fileSize = 0;
    char *exampleCode = LoadFileText(fullPath, &fileSize);
    if (exampleCode == NULL) {
        return false;
    }

    stb_lexer lexer;
    char stringStore[512];
    stb_c_lexer_init(&lexer, exampleCode, exampleCode+fileSize, stringStore, sizeof(stringStore));

    while (stb_c_lexer_get_token(&lexer)) {
        if (lexer.token != CLEX_id) continue;

        int functionIndex = GetFunctionFromIdentifier(lexer.string, functions, functionCount);
        if (functionIndex != -1) {
            int *usageCount = &usageCounts[functionIndex];
            assert(*usageCount < MAX_FUNCS_PER_EXAMPLE);
            FunctionUsage *usage = &usages[functionIndex][*usageCount];
            strncpy(usage->filename, filePath, strlen(filePath));
            (*usageCount)++;
        }
    }

    free(exampleCode);

    return true;
}

static void ParseFunctionsUsagesFromFolder(char *cwd, char *dir, FunctionUsage *usages[], int *usageCounts, FunctionInfo *functions, int functionCount)
{
    char dirPath[PATH_MAX];
    snprintf(dirPath, sizeof(dirPath), "%s/%s", cwd, dir);
    DIR *dirp = opendir(dirPath);
    if (dirp == NULL) {
        fprintf(stderr, "Failed to open directory '%s'\n", dirPath);
        return;
    }

    struct dirent *entry;
    while ((entry = readdir(dirp)) != NULL) {
        if (entry->d_type != DT_REG) continue;

        char *extension = strrchr(entry->d_name, '.');
        if (!strcmp(extension, ".c")) {
            char filePath[PATH_MAX];
            snprintf(filePath, sizeof(filePath), "%s/%s", dir, entry->d_name);
            ParseFunctionUsagesFromFile(cwd, filePath, usages, usageCounts, functions, functionCount);
        }
    }

    closedir(dirp);
}

// Checks if the line is in the format "#if defined(*_IMPLEMENTATION)"
static bool IsLineImplementationIfdef(char *line, int line_size) {
    char *prefix = "#if defined(";
    char *suffix = "_IMPLEMENTATION)";
    return StartsWith(line, line_size, prefix, strlen(prefix)) &&
            EndsSith(line, line_size, suffix, strlen(suffix));
}

static int ParseFunctionsDefinitionsFromHeader(char *path, FunctionInfo *functions, int maxFunctions)
{
    int fileSize;
    char *contents = LoadFileText(path, &fileSize);

    int count = 0;

    int nextLineFrom = 0;
    LineRange curr = { 0 };
    while (GetNextLine(&curr, contents, fileSize, nextLineFrom)) {
        int lineSize = curr.to - curr.from;
        char line[512] = { 0 };
        strncpy(line, &contents[curr.from], lineSize); // `raylib_parser.c` expects lines to be null-terminated
        if (IsLineImplementationIfdef(line, lineSize)) break;

        if (IsLineAPIFunction(line, lineSize)) {
            ParseAPIFunctionInfo(line, lineSize, &functions[count]);
            count++;
            if (count == maxFunctions) break;
        }

        nextLineFrom = curr.to+1;
    }

    free(contents);

    return count;
}

static int ParseFunctionsDefinitionsFromFolder(char *dir, FunctionInfo *functions, int maxFunctions)
{
    DIR *dirp = opendir(dir);
    if (dirp == NULL) {
        fprintf(stderr, "Failed to open directory '%s'\n", dir);
        return -1;
    }

    int count = 0;
    struct dirent *entry;
    while ((entry = readdir(dirp)) != NULL) {
        if (entry->d_type != DT_REG) continue;

        char *fileExtension = strrchr(entry->d_name, '.');
        if (fileExtension == NULL) continue;
        if (strcmp(fileExtension, ".h")) continue;

        char path[256];
        snprintf(path, sizeof(path), "%s/%s", dir, entry->d_name);
        count += ParseFunctionsDefinitionsFromHeader(path, functions + count, maxFunctions - count);
    }
    closedir(dirp);

    return count;
}

static int GetUniqueFilenames(FunctionUsage *usages, int usageCount, char *uniqueFilenames[])
{
    int count = 0;

    for (int i = 0; i < usageCount; i++) {
        FunctionUsage *usage = &usages[i];

        bool found = false;
        for (int j = 0; j < count; j++) {
            if (!strcmp(uniqueFilenames[j], usage->filename)) {
                found = true;
                break;
            }
        }

        if (!found) {
            uniqueFilenames[count] = strdup(usage->filename);
            count++;
        }
    }

    return count;
}

static int OutputFunctionUsagesJSON(char *output, FunctionInfo *functions, int functionCount, FunctionUsage **usages, int *usageCounts)
{
    FILE *outputFile = fopen(output, "w");
    if (outputFile == NULL) {
        fprintf(stderr, "Failed to open file '%s\n'", output);
        return -1;
    }

    fwrite("{", sizeof(char), 1, outputFile);
    for (int functionIndex = 0; functionIndex < functionCount; functionIndex++) {
        FunctionInfo *info = &functions[functionIndex];

        fwrite("\"", sizeof(char), 1, outputFile);
        fwrite(info->name, sizeof(char), strlen(info->name), outputFile);
        fwrite("\":[", sizeof(char), 3, outputFile);

        int usageCount = usageCounts[functionIndex];
        if (usageCount > 0) {
            char *uniqueFilenames[usageCount];
            int uniqueCount = GetUniqueFilenames(usages[functionIndex], usageCount, uniqueFilenames);

            for (int i = 0; i < uniqueCount; i++) {
                char *filename = uniqueFilenames[i];
                char *example_name = strchr(filename, '/')+1;
                int example_name_size = strchr(filename, '.') - example_name;

                fwrite("\"", sizeof(char), 1, outputFile);
                fwrite(example_name, sizeof(char), example_name_size, outputFile);
                fwrite("\"", sizeof(char), 1, outputFile);
                if (i < uniqueCount-1) {
                    fwrite(",", sizeof(char), 1, outputFile);
                }
            }

            for (int i = 0; i < uniqueCount; i++) {
                free(uniqueFilenames[i]);
            }
        }

        fwrite("]", sizeof(char), 1, outputFile);
        if (functionIndex < functionCount-1) {
            fwrite(",", sizeof(char), 1, outputFile);
        }
    }

    fwrite("}", sizeof(char), 1, outputFile);
    fclose(outputFile);

    return 0;
}

int main(int argc, char **argv)
{
    if (argc != 4) {
        printf("Usage: %s <raylib-src-dir> <examples-dir> <output-file>\n", argv[0]);
        return -1;
    }

    char *raylibSrc = argv[1];
    char *raylibExamplesPath = argv[2];
    char *outputPath = argv[3];

    FunctionInfo functions[MAX_FUNCS_TO_PARSE];
    int functionCount = ParseFunctionsDefinitionsFromFolder(raylibSrc, functions, MAX_FUNCS_TO_PARSE);
    if (functionCount < 0) {
        return -1;
    }

    FunctionUsage *usages[MAX_FUNCS_TO_PARSE] = { 0 };
    for (int i = 0; i < functionCount; i++) {
        usages[i] = malloc(MAX_FUNCS_PER_EXAMPLE * sizeof(FunctionUsage));
    }
    int usageCounts[MAX_FUNCS_TO_PARSE] = { 0 };

    { // Collect function usages from examples
        DIR *dirp = opendir(raylibExamplesPath);
        if (dirp == NULL) {
            fprintf(stderr, "Failed to open directory '%s'\n", raylibExamplesPath);
            return -1;
        }
        struct dirent *entry;
        while ((entry = readdir(dirp)) != NULL) {
            if (entry->d_type != DT_DIR) continue;
            if (entry->d_name[0] == '.') continue;

            ParseFunctionsUsagesFromFolder(raylibExamplesPath, entry->d_name, usages, usageCounts, functions, functionCount);
        }
        closedir(dirp);
    }

    // Output function usages
    OutputFunctionUsagesJSON(outputPath, functions, functionCount, usages, usageCounts);

    for (int i = 0; i < functionCount; i++) {
        free(usages[i]);
    }

    return 0;
}
