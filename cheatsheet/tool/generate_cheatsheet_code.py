import os
import sys
import argparse
from contextlib import contextmanager

def parseColors(inp, outp, modules):
    previous_line = ""
    data = []
    indicator = "CLITERAL(Color)"
    for line in inp.readlines():
        if indicator in line or indicator in previous_line:
            data.append(previous_line.strip())
        previous_line = line

    for d in data:
        print(f"    {d.replace('CLITERAL', '').replace('NOTE: ', '')}".rstrip(), file=outp)


def parseStructs(inp, outp, modules):
    struct_section_starters = ["Image", "Camera", "Wave", "VrDeviceInfo", "FilePathList"]
    start_section = "// Structures Definition\n"
    end_section = "// Enumerators Definition\n"
    data = []
    comment = []
    for line in inp.readlines():
        if line == start_section:
            data = []
            comment = []
        elif line == end_section:
            break
        elif line.startswith("//--"):
            pass
        elif line.startswith("//"):
            comment.append(line.strip())
        elif line.strip().startswith("typedef struct"):
            if line[len("typedef struct") + 1].isupper():
                data.append((line.strip(" {\n"), comment))
            comment = []
        elif line.strip().startswith("typedef"):
            comment = []  # ignore non structs, just like the current cheatsheet

    for d in data:
        struct = d[0].replace("CLITERAL", "").replace("typedef ", "") + ";"
        for s in struct_section_starters:
            if s in struct:
                print(file=outp)
        comments = ("\n" + (35 * " ")).join(d[1])
        print(f"    {struct:30} {comments}", file=outp)


def parseMathFile(inp, outp, modules):
    tag = "RMAPI"
    data = []
    comments = []
    for line in inp.readlines():
        if line.startswith("// Module Functions Definition"):
            data.append((line[len("// Module Functions Definition - "):-1],))
        elif line.startswith("//------"):
            pass
        elif line.startswith("//"):
            comments.append(line.strip("\n /"))
        elif line.startswith(tag):
            data.append((line[len(tag)+1:].strip(), comments))
            comments = []

    for d in data:
        if len(d) == 2:
            print(f"    {d[0]:75} {'//' if len(d[1]) > 0 else ''} {' '.join(d[1])}", file=outp)
        elif len(d) == 1:
            print(f"\n    // {d[0]}", file=outp)


def parseFile(inp, outp, modules):
    tag = "RLAPI"
    data = []
    current_module = ""
    moduleHeader = "(Module: "
    for line in inp.readlines():
        if moduleHeader in line:
            idx = line.index(moduleHeader) + len(moduleHeader)
            idx_end = line.index(")", idx)
            wasnt_in = False
            if not (current_module in modules):
                data = []
                wasnt_in = True
            current_module = line[idx:idx_end]
            if not wasnt_in and not current_module in modules:
                break
        if current_module in modules:
            if line.startswith("//"):
                data.append(line.strip())
            elif line.startswith("\n"):
                data.append(line.strip())
            elif line.startswith(tag):
                data.append(line[len(tag):].strip())

    # 3 and onwards to skip first module declaration
    for d in data[3:-1]:
        print(f"    {d}".rstrip(), file=outp)


@contextmanager
def fileorstd(filepath, data=''):
    if isinstance(filepath, str):
        fil = open(filepath, data)
        try:
            yield fil
        finally:
            fil.close()
    else:  # is stdin or stdout
        yield filepath


def performModule(module, mathin, libin, outp):
    with fileorstd(mathin if module == ["math"] else libin, "r") as sin, \
         fileorstd(outp, "w+") as sout:
        fn = parseFile
        if module == ["math"]:
            fn = parseMathFile
        if module == ["structs"]:
            fn = parseStructs
        if module == ["colors"]:
            fn = parseColors
        fn(sin, sout, module)


def main():
    all_modules = ["core", "rgestures", "rcamera", "shapes", "textures", "text", "models", "audio", "math"]
    modules = {
        "core": ["core", "rgestures", "rcamera"],
        "shapes": ["shapes"],
        "textures": ["textures"],
        "text": ["text"],
        "models": ["models"],
        "audio": ["audio"],
        "math": ["math"],
        "structs": ["structs"],
        "colors": ["colors"],
    }
    parser = argparse.ArgumentParser(description="Generator for cheatsheet c files for raylib.com",
                                     epilog="Example: python generate_cheatsheet_code.py -r raylib/src/raylib.h -m raylib/src/raymath.h -o raylib.com/cheatsheet/ # this generates all files")
    parser.add_argument("module", nargs="?", type=str, help="the name of the module to generate. If not specified, generates all. Must be one of " + ", ".join(modules.keys()))
    parser.add_argument("-r", "--raylib", dest="inlib", default=sys.stdin, type=str, help="path to the raylib.h header file. If not specified uses stdin")
    parser.add_argument("-m", "--raymath", dest="inmath", default=sys.stdin, type=str, help="path to the raymath.h header file. If not specified uses stdin")
    parser.add_argument("-o", "--output", dest="out", default=sys.stdout, type=str, help="the file to generate, or folder if generating all modules")
    args = parser.parse_args()

    if args.module is not None:
        module = []
        try:
            module = modules[args.module]
        except KeyError:
            parser.print_help()
            print(f"Error: {args.module} is not a valid module")
        performModule(module, args.inmath, args.inlib, args.out)
    else:
        is_stdout = args.out is sys.stdout
        if not is_stdout and not os.path.exists(args.out):
            os.mkdir(args.out)

        for mod, modules in modules.items():
            outp = args.out
            if not is_stdout:
                outp += f"/raylib_{mod}.c"
            performModule(modules, args.inmath, args.inlib, outp)


if __name__ == "__main__":
    main()
