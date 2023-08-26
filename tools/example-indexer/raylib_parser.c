/**********************************************************************************************

    raylib API parser

    This parser scans raylib.h to get API information about defines, structs, aliases, enums, callbacks and functions.
    All data is divided into pieces, usually as strings. The following types are used for data:

     - struct DefineInfo
     - struct StructInfo
     - struct AliasInfo
     - struct EnumInfo
     - struct FunctionInfo

    CONSTRAINTS:

    This parser is specifically designed to work with raylib.h, so, it has some constraints:

     - Functions are expected as a single line with the following structure:

       <retType> <name>(<paramType[0]> <paramName[0]>, <paramType[1]> <paramName[1]>);  <desc>

       Be careful with functions broken into several lines, it breaks the process!

     - Structures are expected as several lines with the following form:

       <desc>
       typedef struct <name> {
           <fieldType[0]> <fieldName[0]>;  <fieldDesc[0]>
           <fieldType[1]> <fieldName[1]>;  <fieldDesc[1]>
           <fieldType[2]> <fieldName[2]>;  <fieldDesc[2]>
       } <name>;

     - Enums are expected as several lines with the following form:

       <desc>
       typedef enum {
           <valueName[0]> = <valueInteger[0]>, <valueDesc[0]>
           <valueName[1]>,
           <valueName[2]>, <valueDesc[2]>
           <valueName[3]>  <valueDesc[3]>
       } <name>;

       NOTE: Multiple options are supported for enums:
          - If value is not provided, (<valueInteger[i -1]> + 1) is assigned
          - Value description can be provided or not

    OTHER NOTES:

     - This parser could work with other C header files if mentioned constraints are followed.
     - This parser does not require <string.h> library, all data is parsed directly from char buffers.
     - This is a modified/stripped down version of the original parser
       Done so to make it usable as a library, and not a CLI tool.
       This does not implement a function for every type to parse

    LICENSE: zlib/libpng

    raylib-parser is licensed under an unmodified zlib/libpng license, which is an OSI-certified,
    BSD-like license that allows static linking with closed source software:

    Copyright (c) 2021-2023 Ramon Santamaria (@raysan5)

**********************************************************************************************/


#define _CRT_SECURE_NO_WARNINGS

#include <stdlib.h>             // Required for: malloc(), calloc(), realloc(), free(), atoi(), strtol()
#include <stdio.h>              // Required for: printf(), fopen(), fseek(), ftell(), fread(), fclose()
#include <stdbool.h>            // Required for: bool
#include <ctype.h>              // Required for: isdigit()

#define MAX_LINE_LENGTH          512    // Maximum length of one line (including comments)

#define MAX_STRUCT_FIELDS         64    // Maximum number of struct fields
#define MAX_ENUM_VALUES          512    // Maximum number of enum values
#define MAX_FUNCTION_PARAMETERS   12    // Maximum number of function parameters

//----------------------------------------------------------------------------------
// Types and Structures Definition
//----------------------------------------------------------------------------------

// Type of parsed define
typedef enum {
    UNKNOWN = 0,
    MACRO,
    GUARD,
    INT,
    INT_MATH,
    LONG,
    LONG_MATH,
    FLOAT,
    FLOAT_MATH,
    DOUBLE,
    DOUBLE_MATH,
    CHAR,
    STRING,
    COLOR
} DefineType;

// Define info data
typedef struct DefineInfo {
    char name[64];              // Define name
    int type;                   // Define type
    char value[256];            // Define value
    char desc[128];             // Define description
    bool isHex;                 // Define is hex number (for types INT, LONG)
} DefineInfo;

// Struct info data
typedef struct StructInfo {
    char name[64];              // Struct name
    char desc[128];             // Struct type description
    int fieldCount;             // Number of fields in the struct
    char fieldType[MAX_STRUCT_FIELDS][64];     // Field type
    char fieldName[MAX_STRUCT_FIELDS][64];     // Field name
    char fieldDesc[MAX_STRUCT_FIELDS][128];    // Field description
} StructInfo;

// Alias info data
typedef struct AliasInfo {
    char type[64];              // Alias type
    char name[64];              // Alias name
    char desc[128];             // Alias description
} AliasInfo;

// Enum info data
typedef struct EnumInfo {
    char name[64];              // Enum name
    char desc[128];             // Enum description
    int valueCount;             // Number of values in enumerator
    char valueName[MAX_ENUM_VALUES][64];    // Value name definition
    int valueInteger[MAX_ENUM_VALUES];      // Value integer
    char valueDesc[MAX_ENUM_VALUES][128];   // Value description
} EnumInfo;

// Function info data
typedef struct FunctionInfo {
    char name[64];              // Function name
    char desc[128];             // Function description (comment at the end)
    char retType[32];           // Return value type
    int paramCount;             // Number of function parameters
    char paramType[MAX_FUNCTION_PARAMETERS][32];   // Parameters type
    char paramName[MAX_FUNCTION_PARAMETERS][32];   // Parameters name
    char paramDesc[MAX_FUNCTION_PARAMETERS][128];  // Parameters description
} FunctionInfo;

//----------------------------------------------------------------------------------
// Global Variables Definition
//----------------------------------------------------------------------------------

#ifndef RAYLIB_API_DEFINE
    #define RAYLIB_API_DEFINE "RLAPI"
#endif

//----------------------------------------------------------------------------------
// Module Functions Declaration
//----------------------------------------------------------------------------------

static bool IsLineAPIFunction(char *line, int lineSize);
static void ParseAPIFunctionInfo(char *linePtr, int lineSize, FunctionInfo *functionInfo);

static char *LoadFileText(const char *fileName, int *length);
static char **GetTextLines(const char *buffer, int length, int *linesCount);
static void GetDataTypeAndName(const char *typeName, int typeNameLen, char *type, char *name);
static void GetDescription(const char *source, char *description);
static void MoveArraySize(char *name, char *type);          // Move array size from name to type
static unsigned int TextLength(const char *text);           // Get text length in bytes, check for \0 character
static bool IsTextEqual(const char *text1, const char *text2, unsigned int count);
static int TextFindIndex(const char *text, const char *find); // Find first text occurrence within a string
static void MemoryCopy(void *dest, const void *src, unsigned int count);
static char *EscapeBackslashes(char *text);                 // Replace '\' by "\\" when exporting to JSON and XML
static const char *StrDefineType(DefineType type);          // Get string of define type

//----------------------------------------------------------------------------------
// Additional functions for use as a library
//----------------------------------------------------------------------------------

static bool IsLineAPIFunction(char *line, int lineSize)
{
    int apiDefineSize = TextLength(RAYLIB_API_DEFINE);

    // Read function line (starting with `define`, i.e. for raylib.h "RLAPI")
    return lineSize >= apiDefineSize && IsTextEqual(line, RAYLIB_API_DEFINE, apiDefineSize);
}

// Assumes that `func_info` is zero initialized
static void ParseAPIFunctionInfo(char *linePtr, int lineSize, FunctionInfo *functionInfo)
{
    int funcParamsStart = 0;
    int funcEnd = 0;

    // Get return type and function name from func line
    for (int c = 0; c < lineSize; c++)
    {
        if (linePtr[c] == '(')     // Starts function parameters
        {
            funcParamsStart = c + 1;

            // At this point we have function return type and function name
            char funcRetTypeName[128] = { 0 };
            int dc = TextLength(RAYLIB_API_DEFINE) + 1;
            int funcRetTypeNameLen = c - dc;     // Substract `define` ("RLAPI " for raylib.h)
            MemoryCopy(funcRetTypeName, &linePtr[dc], funcRetTypeNameLen);

            GetDataTypeAndName(funcRetTypeName, funcRetTypeNameLen, functionInfo->retType, functionInfo->name);
            break;
        }
    }

    // Get parameters from func line
    for (int c = funcParamsStart; c < lineSize; c++)
    {
        int paramIndex = functionInfo->paramCount;

        if (linePtr[c] == ',')     // Starts function parameters
        {
            // Get parameter type + name, extract info
            char funcParamTypeName[128] = { 0 };
            int funcParamTypeNameLen = c - funcParamsStart;
            MemoryCopy(funcParamTypeName, &linePtr[funcParamsStart], funcParamTypeNameLen);

            GetDataTypeAndName(funcParamTypeName, funcParamTypeNameLen, functionInfo->paramType[paramIndex], functionInfo->paramName[paramIndex]);

            funcParamsStart = c + 1;
            if (linePtr[c + 1] == ' ') funcParamsStart += 1;
            functionInfo->paramCount++;      // Move to next parameter
        }
        else if (linePtr[c] == ')')
        {
            funcEnd = c + 2;

            // Check if previous word is void
            if ((linePtr[c - 4] == 'v') && (linePtr[c - 3] == 'o') && (linePtr[c - 2] == 'i') && (linePtr[c - 1] == 'd')) break;

            // Get parameter type + name, extract info
            char funcParamTypeName[128] = { 0 };
            int funcParamTypeNameLen = c - funcParamsStart;
            MemoryCopy(funcParamTypeName, &linePtr[funcParamsStart], funcParamTypeNameLen);

            GetDataTypeAndName(funcParamTypeName, funcParamTypeNameLen, functionInfo->paramType[paramIndex], functionInfo->paramName[paramIndex]);

            functionInfo->paramCount++;      // Move to next parameter
            break;
        }
    }

    // Get function description
    GetDescription(&linePtr[funcEnd], functionInfo->desc);

    // Move array sizes from name to type
    for (int j = 0; j < functionInfo->paramCount; j++)
    {
        MoveArraySize(functionInfo->paramName[j], functionInfo->paramType[j]);
    }
}

//----------------------------------------------------------------------------------
// Module Functions Definition
//----------------------------------------------------------------------------------

// Load text data from file, returns a '\0' terminated string
// NOTE: text chars array should be freed manually
static char *LoadFileText(const char *fileName, int *length)
{
    char *text = NULL;

    if (fileName != NULL)
    {
        FILE *file = fopen(fileName, "rt");

        if (file != NULL)
        {
            // WARNING: When reading a file as 'text' file,
            // text mode causes carriage return-linefeed translation...
            // ...but using fseek() should return correct byte-offset
            fseek(file, 0, SEEK_END);
            int size = ftell(file);
            fseek(file, 0, SEEK_SET);

            if (size > 0)
            {
                text = (char *)calloc((size + 1), sizeof(char));
                unsigned int count = (unsigned int)fread(text, sizeof(char), size, file);

                // WARNING: \r\n is converted to \n on reading, so,
                // read bytes count gets reduced by the number of lines
                if (count < (unsigned int)size)
                {
                    text = realloc(text, count + 1);
                    *length = count;
                }
                else *length = size;

                // Zero-terminate the string
                text[count] = '\0';
            }

            fclose(file);
        }
    }

    return text;
}

// Get all lines from a text buffer (expecting lines ending with '\n')
static char **GetTextLines(const char *buffer, int length, int *linesCount)
{
    // Get the number of lines in the text
    int count = 0;
    for (int i = 0; i < length; i++) if (buffer[i] == '\n') count++;

    printf("Number of text lines in buffer: %i\n", count);

    // Allocate as many pointers as lines
    char **lines = (char **)malloc(count*sizeof(char **));

    char *bufferPtr = (char *)buffer;

    for (int i = 0; (i < count) || (bufferPtr[0] != '\0'); i++)
    {
        lines[i] = (char *)calloc(MAX_LINE_LENGTH, sizeof(char));

        // Remove line leading spaces
        // Find last index of space/tab character
        int index = 0;
        while ((bufferPtr[index] == ' ') || (bufferPtr[index] == '\t')) index++;

        int j = 0;
        while (bufferPtr[index + j] != '\n')
        {
            lines[i][j] = bufferPtr[index + j];
            j++;
        }

        bufferPtr += (index + j + 1);
    }

    *linesCount = count;
    return lines;
}

// Get data type and name from a string containing both
// NOTE: Useful to parse function parameters and struct fields
static void GetDataTypeAndName(const char *typeName, int typeNameLen, char *type, char *name)
{
    for (int k = typeNameLen; k > 0; k--)
    {
        if ((typeName[k] == ' ') && (typeName[k - 1] != ','))
        {
            // Function name starts at this point (and ret type finishes at this point)
            MemoryCopy(type, typeName, k);
            MemoryCopy(name, typeName + k + 1, typeNameLen - k - 1);
            break;
        }
        else if (typeName[k] == '*')
        {
            MemoryCopy(type, typeName, k + 1);
            MemoryCopy(name, typeName + k + 1, typeNameLen - k - 1);
            break;
        }
        else if ((typeName[k] == '.') && (typeNameLen == 3)) // Handle varargs ...);
        {
            MemoryCopy(type, "...", 3);
            MemoryCopy(name, "args", 4);
            break;
        }
    }
}

// Get comment from a line, do nothing if no comment in line
static void GetDescription(const char *line, char *description)
{
    int c = 0;
    int descStart = -1;
    int lastSlash = -2;
    bool isValid = false;
    while (line[c] != '\0')
    {
        if (isValid && (descStart == -1) && (line[c] != ' ')) descStart = c;
        else if (line[c] == '/')
        {
            if (lastSlash == c - 1) isValid = true;
            lastSlash = c;
        }
        c++;
    }
    if (descStart != -1) MemoryCopy(description, &line[descStart], c - descStart);
}

// Move array size from name to type
static void MoveArraySize(char *name, char *type)
{
    int nameLength = TextLength(name);
    if (name[nameLength - 1] == ']')
    {
        for (int k = nameLength; k > 0; k--)
        {
            if (name[k] == '[')
            {
                int sizeLength = nameLength - k;
                MemoryCopy(&type[TextLength(type)], &name[k], sizeLength);
                name[k] = '\0';
            }
        }
    }
}

// Get text length in bytes, check for \0 character
static unsigned int TextLength(const char *text)
{
    unsigned int length = 0;

    if (text != NULL) while (*text++) length++;

    return length;
}

// Compare two text strings, requires number of characters to compare
static bool IsTextEqual(const char *text1, const char *text2, unsigned int count)
{
    bool result = true;

    for (unsigned int i = 0; i < count; i++)
    {
        if (text1[i] != text2[i])
        {
            result = false;
            break;
        }
    }

    return result;
}

// Find first text occurrence within a string
int TextFindIndex(const char *text, const char *find)
{
    int textLen = TextLength(text);
    int findLen = TextLength(find);

    for (int i = 0; i <= textLen - findLen; i++)
    {
        if (IsTextEqual(&text[i], find, findLen)) return i;
    }

    return -1;
}

// Custom memcpy() to avoid <string.h>
static void MemoryCopy(void *dest, const void *src, unsigned int count)
{
    char *srcPtr = (char *)src;
    char *destPtr = (char *)dest;

    for (unsigned int i = 0; i < count; i++) destPtr[i] = srcPtr[i];
}

// Escape backslashes in a string, writing the escaped string into a static buffer
static char *EscapeBackslashes(char *text)
{
    static char buffer[256] = { 0 };

    int count = 0;

    for (int i = 0; (text[i] != '\0') && (i < 255); i++, count++)
    {
        buffer[count] = text[i];

        if (text[i] == '\\')
        {
            buffer[count + 1] = '\\';
            count++;
        }
    }

    buffer[count] = '\0';

    return buffer;
}

// Get string of define type
static const char *StrDefineType(DefineType type)
{
    switch (type)
    {
        case UNKNOWN:     return "UNKNOWN";
        case GUARD:       return "GUARD";
        case MACRO:       return "MACRO";
        case INT:         return "INT";
        case INT_MATH:    return "INT_MATH";
        case LONG:        return "LONG";
        case LONG_MATH:   return "LONG_MATH";
        case FLOAT:       return "FLOAT";
        case FLOAT_MATH:  return "FLOAT_MATH";
        case DOUBLE:      return "DOUBLE";
        case DOUBLE_MATH: return "DOUBLE_MATH";
        case CHAR:        return "CHAR";
        case STRING:      return "STRING";
        case COLOR:       return "COLOR";
    }
    return "";
}
