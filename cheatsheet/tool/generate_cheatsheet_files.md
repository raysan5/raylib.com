## Usage info to generate cheatsheet files automatically

NOTE: It requries latest `raylib.h` and optionally `raymath.h` placed in same directory of script or path provided by command line argument

  > python generate_cheatsheet_code.py -h

```
    usage: generate_cheatsheet_code.py [-h] [-r INLIB] [-m INMATH] [-o OUT] [module]

    Generator for cheatsheet c files for raylib.com

    positional arguments:
      module                the name of the module to generate. If not specified, generates all. Must be one of
                            core, shapes, textures, text, models, audio, math, structs, colors

    options:
      -h, --help            show this help message and exit
      -r INLIB, --raylib INLIB
                            path to the raylib.h header file. If not specified uses stdin
      -m INMATH, --raymath INMATH
                            path to the raymath.h header file. If not specified uses stdin
      -o OUT, --output OUT  the file to generate, or folder if generating all modules

    Example: python generate_cheatsheet_code.py -r raylib/src/raylib.h -m raylib/src/raymath.h -o raylib.com/cheatsheet/ # this generates all files
```

### Generation command (for all modules)

  > python generate_cheatsheet_code.py -r ./raylib.h -m ./raymath.h -o ./output
  

