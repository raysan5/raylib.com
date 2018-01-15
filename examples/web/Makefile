#**************************************************************************************************
#
#   raylib makefile for Desktop platforms, Raspberry Pi, Android and HTML5
#
#   Copyright (c) 2013-2018 Ramon Santamaria (@raysan5)
#
#   This software is provided "as-is", without any express or implied warranty. In no event
#   will the authors be held liable for any damages arising from the use of this software.
#
#   Permission is granted to anyone to use this software for any purpose, including commercial
#   applications, and to alter it and redistribute it freely, subject to the following restrictions:
#
#     1. The origin of this software must not be misrepresented; you must not claim that you
#     wrote the original software. If you use this software in a product, an acknowledgment
#     in the product documentation would be appreciated but is not required.
#
#     2. Altered source versions must be plainly marked as such, and must not be misrepresented
#     as being the original software.
#
#     3. This notice may not be removed or altered from any source distribution.
#
#**************************************************************************************************

.PHONY: all clean

# Define required raylib variables
# WARNING: To compile to HTML5, code must be redesigned to use emscripten.h and emscripten_set_main_loop()
PLATFORM ?= PLATFORM_DESKTOP
RAYLIB_PATH = C:/GitHub/raylib
PROJECT_NAME ?= raylib_example

# Default path for raylib on Raspberry Pi, if installed in different path, update it!
ifeq ($(PLATFORM),PLATFORM_RPI)
    RAYLIB_PATH ?= /home/pi/raylib
endif

# Library type used for raylib: STATIC (.a) or SHARED (.so/.dll)
RAYLIB_LIBTYPE ?= STATIC

# Use external GLFW library instead of rglfw module
USE_EXTERNAL_GLFW ?= FALSE

# Use Wayland display server protocol on Linux desktop
# by default it uses X11 windowing system
USE_WAYLAND_DISPLAY ?= FALSE

# NOTE: On PLATFORM_WEB OpenAL Soft backend is used by default (check raylib/src/Makefile)


# Determine PLATFORM_OS in case PLATFORM_DESKTOP selected
ifeq ($(PLATFORM),PLATFORM_DESKTOP)
    # No uname.exe on MinGW!, but OS=Windows_NT on Windows!
    # ifeq ($(UNAME),Msys) -> Windows
    ifeq ($(OS),Windows_NT)
        PLATFORM_OS=WINDOWS
    else
        UNAMEOS=$(shell uname)
        ifeq ($(UNAMEOS),Linux)
            PLATFORM_OS=LINUX
        endif
        ifeq ($(UNAMEOS),FreeBSD)
            PLATFORM_OS=FREEBSD
        endif
        ifeq ($(UNAMEOS),Darwin)
            PLATFORM_OS=OSX
        endif
    endif
endif
ifeq ($(PLATFORM),PLATFORM_RPI)
    UNAMEOS=$(shell uname)
    ifeq ($(UNAMEOS),Linux)
        PLATFORM_OS=LINUX
    endif
endif

ifeq ($(PLATFORM),PLATFORM_WEB)
    # Emscripten required variables
    EMSDK_PATH = C:/emsdk
    EMSCRIPTEN_VERSION = 1.37.28
    CLANG_VERSION=e1.37.28_64bit
    PYTHON_VERSION=2.7.5.3_64bit
    NODE_VERSION=4.1.1_64bit
    export PATH=$(EMSDK_PATH);$(EMSDK_PATH)\clang\$(CLANG_VERSION);$(EMSDK_PATH)\node\$(NODE_VERSION)\bin;$(EMSDK_PATH)\python\$(PYTHON_VERSION);$(EMSDK_PATH)\emscripten\$(EMSCRIPTEN_VERSION);C:\raylib\MinGW\bin:$$(PATH)
    EMSCRIPTEN=$(EMSDK_PATH)\emscripten\$(EMSCRIPTEN_VERSION)
endif

RAYLIB_RELEASE_PATH ?= $(RAYLIB_PATH)/release/libs

# Define raylib release directory for compiled library
ifeq ($(PLATFORM),PLATFORM_DESKTOP)
    ifeq ($(PLATFORM_OS),WINDOWS)
        RAYLIB_RELEASE_PATH = $(RAYLIB_PATH)/release/libs/win32/mingw32
    endif
    ifeq ($(PLATFORM_OS),LINUX)
        RAYLIB_RELEASE_PATH = $(RAYLIB_PATH)/release/libs/linux
    endif
    ifeq ($(PLATFORM_OS),OSX)
        RAYLIB_RELEASE_PATH = $(RAYLIB_PATH)/release/libs/osx
    endif
    ifeq ($(PLATFORM_OS),FREEBSD)
        RAYLIB_RELEASE_PATH = $(RAYLIB_PATH)/release/libs/freebsd
    endif
endif
ifeq ($(PLATFORM),PLATFORM_RPI)
    RAYLIB_RELEASE_PATH = $(RAYLIB_PATH)/release/libs/rpi
endif
ifeq ($(PLATFORM),PLATFORM_WEB)
    RAYLIB_RELEASE_PATH = $(RAYLIB_PATH)/release/libs/html5
endif

# Define default C compiler: gcc
# NOTE: define g++ compiler if using C++
CC = gcc

ifeq ($(PLATFORM),PLATFORM_DESKTOP)
    ifeq ($(PLATFORM_OS),OSX)
        # OSX default compiler
        CC = clang
    endif
    ifeq ($(PLATFORM_OS),FREEBSD)
        # FreeBSD default compiler
        CC = clang
    endif
endif
ifeq ($(PLATFORM),PLATFORM_RPI)
    ifeq ($(USE_RPI_CROSS_COMPILER),TRUE)
        # Define RPI cross-compiler
        #CC = armv6j-hardfloat-linux-gnueabi-gcc
        CC = $(RPI_TOOLCHAIN)/bin/arm-linux-gnueabihf-gcc
    endif
endif
ifeq ($(PLATFORM),PLATFORM_WEB)
    # HTML5 emscripten compiler
    CC = emcc
endif

# Define default make program: Mingw32-make
MAKE = mingw32-make

ifeq ($(PLATFORM),PLATFORM_DESKTOP)
    ifeq ($(PLATFORM_OS),LINUX)
        MAKE = make
    endif
endif

# Define compiler flags:
#  -O1                  defines optimization level
#  -g                   enable debugging
#  -s                   strip unnecessary data from build
#  -Wall                turns on most, but not all, compiler warnings
#  -std=c99             defines C language mode (standard C from 1999 revision)
#  -std=gnu99           defines C language mode (GNU C from 1999 revision)
#  -fgnu89-inline       declaring inline functions support (GCC optimized)
#  -Wno-missing-braces  ignore invalid warning (GCC bug 53119)
#  -D_DEFAULT_SOURCE    use with -std=c99 on Linux and PLATFORM_WEB, required for timespec
CFLAGS += -O1 -s -Wall -std=c99 -D_DEFAULT_SOURCE -fgnu89-inline -Wno-missing-braces

# Additional flags for compiler (if desired)
#CFLAGS += -Wextra -Wmissing-prototypes -Wstrict-prototypes
ifeq ($(PLATFORM),PLATFORM_DESKTOP)
    ifeq ($(PLATFORM_OS),WINDOWS)
        # resources file contains windows exe icon
        # -Wl,--subsystem,windows hides the console window
        CFLAGS += $(RAYLIB_PATH)/src/resources -Wl,--subsystem,windows
    endif
    ifeq ($(PLATFORM_OS),LINUX)
        CFLAGS += -no-pie -D_DEFAULT_SOURCE
    endif
endif
ifeq ($(PLATFORM),PLATFORM_RPI)
    CFLAGS += -std=gnu99
endif
ifeq ($(PLATFORM),PLATFORM_WEB)
    # -O2                        # if used, also set --memory-init-file 0
    # --memory-init-file 0       # to avoid an external memory initialization code file (.mem)
    # -s ALLOW_MEMORY_GROWTH=1   # to allow memory resizing
    # -s TOTAL_MEMORY=16777216   # to specify heap memory size (default = 16MB)
    # -s USE_PTHREADS=1          # multithreading support
    # -s WASM=1                  # support Web Assembly (https://github.com/kripken/emscripten/wiki/WebAssembly)
    # --preload-file resources   # specify a resources folder for data compilation
    CFLAGS += -s USE_GLFW=3 -s ASSERTIONS=1 -s WASM=1 --profiling --preload-file resources
    
    # Define a custom shell .html and output extension
    CFLAGS += --shell-file $(RAYLIB_PATH)\templates\web_shell\shell.html
    EXT = .html
endif

# Define include paths for required headers
# NOTE: Several external required libraries (stb and others)
INCLUDE_PATHS = -I. -I$(RAYLIB_PATH)/release/include -I$(RAYLIB_PATH)/src -I$(RAYLIB_PATH)/src/external

# Define additional directories containing required header files
ifeq ($(PLATFORM),PLATFORM_RPI)
    # RPI requried libraries
    INCLUDE_PATHS += -I/opt/vc/include
    INCLUDE_PATHS += -I/opt/vc/include/interface/vmcs_host/linux
    INCLUDE_PATHS += -I/opt/vc/include/interface/vcos/pthreads
endif

# Define library paths containing required libs
LDFLAGS = -L. -L$(RAYLIB_RELEASE_PATH) -L$(RAYLIB_PATH)/src 

ifeq ($(PLATFORM),PLATFORM_DESKTOP)
    ifeq ($(PLATFORM_OS),FREEBSD)
        INCLUDE_PATHS += -I/usr/local/include
        LDFLAGS += -L. -Lsrc -L/usr/local/lib
    endif
endif

ifeq ($(PLATFORM),PLATFORM_RPI)
    LDFLAGS += -L/opt/vc/lib
endif

# Define any libraries required on linking
# if you want to link libraries (libname.so or libname.a), use the -lname
ifeq ($(PLATFORM),PLATFORM_DESKTOP)
    ifeq ($(PLATFORM_OS),WINDOWS)
        # Libraries for Windows desktop compilation
        LDLIBS = -lraylib -lopengl32 -lgdi32
        
        # Required for physac examples
        LDLIBS += -static -lpthread
    endif
    ifeq ($(PLATFORM_OS),LINUX)
        # Libraries for Debian GNU/Linux desktop compiling
        # NOTE: Required packages: libegl1-mesa-dev
        LDLIBS = -lraylib -lGL -lm -lpthread -ldl -lrt
        
        # On X11 requires also below libraries
        LDLIBS += -lX11
        # NOTE: It seems additional libraries are not required any more, latest GLFW just dlopen them
        #LDLIBS += -lXrandr -lXinerama -lXi -lXxf86vm -lXcursor
        
        # On Wayland windowing system, additional libraries requires
        ifeq ($(USE_WAYLAND_DISPLAY),TRUE)
            LDLIBS += -lwayland-client -lwayland-cursor -lwayland-egl -lxkbcommon
        endif
    endif
    ifeq ($(PLATFORM_OS),OSX)
        # Libraries for OSX 10.9 desktop compiling
        # NOTE: Required packages: libopenal-dev libegl1-mesa-dev
        LDLIBS = -lraylib -framework OpenGL -framework OpenAL -framework Cocoa
    endif
    ifeq ($(PLATFORM_OS),FREEBSD)
        # Libraries for FreeBSD desktop compiling
        # NOTE: Required packages: mesa-libs
        LDLIBS = -lraylib -lGL -lpthread -lm

        # On XWindow requires also below libraries
        LDLIBS += -lX11 -lXrandr -lXinerama -lXi -lXxf86vm -lXcursor
    endif
    ifeq ($(USE_EXTERNAL_GLFW),TRUE)
        # NOTE: It could require additional packages installed: libglfw3-dev
        LDLIBS += -lglfw
    endif
endif
ifeq ($(PLATFORM),PLATFORM_RPI)
    # Libraries for Raspberry Pi compiling
    # NOTE: Required packages: libasound2-dev (ALSA)
    LDLIBS = -lraylib -lbrcmGLESv2 -lbrcmEGL -lpthread -lrt -lm -lbcm_host -ldl
endif
ifeq ($(PLATFORM),PLATFORM_WEB)
    # Libraries for web (HTML5) compiling
    LDLIBS = $(RAYLIB_RELEASE_PATH)/libraylib.bc
endif

# Define all object files required
EXAMPLES = \
    core/core_basic_window \
    core/core_input_keys \
    core/core_input_mouse \
    core/core_mouse_wheel \
    core/core_input_gamepad \
    core/core_random_values \
    core/core_color_select \
    core/core_drop_files \
    core/core_storage_values \
    core/core_gestures_detection \
    core/core_3d_mode \
    core/core_3d_picking \
    core/core_3d_camera_free \
    core/core_3d_camera_first_person \
    core/core_2d_camera \
    core/core_world_screen \
    core/core_vr_simulator \
    shapes/shapes_logo_raylib \
    shapes/shapes_basic_shapes \
    shapes/shapes_colors_palette \
    shapes/shapes_logo_raylib_anim \
    shapes/shapes_lines_bezier \
    textures/textures_logo_raylib \
    textures/textures_image_loading \
    textures/textures_rectangle \
    textures/textures_srcrec_dstrec \
    textures/textures_to_image \
    textures/textures_raw_data \
    textures/textures_particles_blending \
    textures/textures_image_processing \
    textures/textures_image_drawing \
    textures/textures_image_generation \
    textures/textures_image_text \
    text/text_sprite_fonts \
    text/text_bmfont_ttf \
    text/text_raylib_fonts \
    text/text_format_text \
    text/text_writing_anim \
    text/text_ttf_loading \
    text/text_bmfont_unordered \
    text/text_input_box \
    models/models_geometric_shapes \
    models/models_box_collisions \
    models/models_billboard \
    models/models_obj_loading \
    models/models_heightmap \
    models/models_cubicmap \
    models/models_mesh_picking \
    models/models_mesh_generation \
    models/models_material_pbr \
    models/models_skybox \
    models/models_yaw_pitch_roll \
    shaders/shaders_model_shader \
    shaders/shaders_shapes_textures \
    shaders/shaders_custom_uniform \
    shaders/shaders_postprocessing \
    audio/audio_sound_loading \
    audio/audio_music_stream \
    audio/audio_module_playing \
    audio/audio_raw_stream \
    physac/physics_demo \
    physac/physics_friction \
    physac/physics_movement \
    physac/physics_restitution \
    physac/physics_shatter \


# Default target entry
all: $(EXAMPLES)

# compile [core] example - basic window
core/core_basic_window: core/core_basic_window.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM)

# compile [core] example - keyboard input
core/core_input_keys: core/core_input_keys.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM)

# compile [core] example - mouse input
core/core_input_mouse: core/core_input_mouse.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM)

# compile [core] example - mouse wheel
core/core_mouse_wheel: core/core_mouse_wheel.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM)

# compile [core] example - gamepad input
core/core_input_gamepad: core/core_input_gamepad.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM) \
    --preload-file core/resources/ps3.png@resources/ps3.png \
    --preload-file core/resources/xbox.png@resources/xbox.png

# compile [core] example - generate random values
core/core_random_values: core/core_random_values.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM)

# compile [core] example - color selection (collision detection)
core/core_color_select: core/core_color_select.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM)

# compile [core] example - drop files
core/core_drop_files: core/core_drop_files.c
ifeq ($(PLATFORM),PLATFORM_DESKTOP)
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM)
else
	@echo core_drop_files: Example not supported on PLATFORM_ANDROID or PLATFORM_WEB or PLATFORM_RPI
endif

# compile [core] example - storage values
core/core_storage_values: core/core_storage_values.c
ifeq ($(PLATFORM), $(filter $(PLATFORM),PLATFORM_DESKTOP PLATFORM_RPI))
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM)
else
	@echo core_storage_values: Example not supported on PLATFORM_ANDROID or PLATFORM_WEB
endif

# compile [core] example - gestures detection
core/core_gestures_detection: core/core_gestures_detection.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM)

# compile [core] example - 3d mode
core/core_3d_mode: core/core_3d_mode.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM)

# compile [core] example - 3d picking
core/core_3d_picking: core/core_3d_picking.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM)

# compile [core] example - 3d camera free
core/core_3d_camera_free: core/core_3d_camera_free.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM)

# compile [core] example - 3d camera first person
core/core_3d_camera_first_person: core/core_3d_camera_first_person.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM)

# compile [core] example - 2d camera
core/core_2d_camera: core/core_2d_camera.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM)

# compile [core] example - world screen
core/core_world_screen: core/core_world_screen.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM)

# compile [core] example - vr simulator
core/core_vr_simulator: core/core_vr_simulator.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM)

# compile [shapes] example - raylib logo (with basic shapes)
shapes/shapes_logo_raylib: shapes/shapes_logo_raylib.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM)

# compile [shapes] example - basic shapes usage (rectangle, circle, ...)
shapes/shapes_basic_shapes: shapes/shapes_basic_shapes.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM)

# compile [shapes] example - raylib color palette
shapes/shapes_colors_palette: shapes/shapes_colors_palette.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM)

# compile [shapes] example - raylib logo animation
shapes/shapes_logo_raylib_anim: shapes/shapes_logo_raylib_anim.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM)
    
# compile [shapes] example - lines bezier
shapes/shapes_lines_bezier: shapes/shapes_lines_bezier.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM)

# compile [textures] example - raylib logo texture loading
textures/textures_logo_raylib: textures/textures_logo_raylib.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM) \
    --preload-file textures/resources/raylib_logo.png@resources/raylib_logo.png

# compile [textures] example - image loading and conversion to texture
textures/textures_image_loading: textures/textures_image_loading.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM) \
    --preload-file textures/resources/raylib_logo.png@resources/raylib_logo.png

# compile [textures] example - texture rectangle drawing
textures/textures_rectangle: textures/textures_rectangle.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM) \
    --preload-file textures/resources/scarfy.png@resources/scarfy.png

# compile [textures] example - texture source and destination rectangles
textures/textures_srcrec_dstrec: textures/textures_srcrec_dstrec.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM) \
    --preload-file textures/resources/scarfy.png@resources/scarfy.png

# compile [textures] example - texture to image
textures/textures_to_image: textures/textures_to_image.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM) \
    --preload-file textures/resources/raylib_logo.png@resources/raylib_logo.png
    
# compile [textures] example - texture raw data
textures/textures_raw_data: textures/textures_raw_data.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM) \
    --preload-file textures/resources/fudesumi.raw@resources/fudesumi.raw
    
# compile [textures] example - texture particles blending
textures/textures_particles_blending: textures/textures_particles_blending.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM) \
    --preload-file textures/resources/smoke.png@resources/smoke.png

# compile [textures] example - texture image processing
textures/textures_image_processing: textures/textures_image_processing.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM) \
    --preload-file textures/resources/parrots.png@resources/parrots.png
    
# compile [textures] example - texture image drawing
textures/textures_image_drawing: textures/textures_image_drawing.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM) \
    --preload-file textures/resources/parrots.png@resources/parrots.png \
    --preload-file textures/resources/cat.png@resources/cat.png
    
# compile [textures] example - texture image generation
textures/textures_image_generation: textures/textures_image_generation.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM) -s ALLOW_MEMORY_GROWTH=1
    
# compile [text] example - sprite fonts loading
text/text_sprite_fonts: text/text_sprite_fonts.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM) \
    --preload-file text/resources/custom_mecha.png@resources/custom_mecha.png \
    --preload-file text/resources/custom_alagard.png@resources/custom_alagard.png \
    --preload-file text/resources/custom_jupiter_crash.png@resources/custom_jupiter_crash.png

# compile [text] example - bmfonts and ttf loading
text/text_bmfont_ttf: text/text_bmfont_ttf.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM) -s TOTAL_MEMORY=67108864 \
    --preload-file text/resources/bmfont.fnt@resources/bmfont.fnt \
    --preload-file text/resources/bmfont.png@resources/bmfont.png \
    --preload-file text/resources/pixantiqua.ttf@resources/pixantiqua.ttf

# compile [text] example - raylib fonts
text/text_raylib_fonts: text/text_raylib_fonts.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM) \
    --preload-file text/resources/fonts/alagard.png@resources/fonts/alagard.png \
    --preload-file text/resources/fonts/pixelplay.png@resources/fonts/pixelplay.png \
    --preload-file text/resources/fonts/mecha.png@resources/fonts/mecha.png \
    --preload-file text/resources/fonts/setback.png@resources/fonts/setback.png \
    --preload-file text/resources/fonts/romulus.png@resources/fonts/romulus.png \
    --preload-file text/resources/fonts/pixantiqua.png@resources/fonts/pixantiqua.png \
    --preload-file text/resources/fonts/alpha_beta.png@resources/fonts/alpha_beta.png \
    --preload-file text/resources/fonts/jupiter_crash.png@resources/fonts/jupiter_crash.png

# compile [text] example - text formatting
text/text_format_text: text/text_format_text.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM)

# compile [text] example - text writing animation
text/text_writing_anim: text/text_writing_anim.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM)

# compile [text] example - text ttf loading
text/text_ttf_loading: text/text_ttf_loading.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM) -s TOTAL_MEMORY=67108864 \
    --preload-file text/resources/KAISG.ttf@resources/KAISG.ttf

# compile [text] example - text bmfont unordered
text/text_bmfont_unordered: text/text_bmfont_unordered.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM) \
    --preload-file text/resources/pixantiqua.fnt@resources/pixantiqua.fnt \
    --preload-file text/resources/pixantiqua_0.png@resources/pixantiqua_0.png

# compile [text] example - text input box
text/text_input_box: text/text_input_box.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM)

# compile [models] example - basic geometric 3d shapes
models/models_geometric_shapes: models/models_geometric_shapes.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM)

# compile [models] example - box collisions
models/models_box_collisions: models/models_box_collisions.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM)

# compile [models] example - basic window
models/models_planes: models/models_planes.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM)

# compile [models] example - billboard usage
models/models_billboard: models/models_billboard.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM) \
    --preload-file models/resources/billboard.png@resources/billboard.png

# compile [models] example - OBJ model loading
models/models_obj_loading: models/models_obj_loading.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM) -s TOTAL_MEMORY=67108864 \
    --preload-file models/resources/model/dwarf.obj@resources/model/dwarf.obj \
    --preload-file models/resources/model/dwarf_diffuse.png@resources/model/dwarf_diffuse.png

# compile [models] example - heightmap loading
models/models_heightmap: models/models_heightmap.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM) \
    --preload-file models/resources/heightmap.png@resources/heightmap.png

# compile [models] example - cubesmap loading
models/models_cubicmap: models/models_cubicmap.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM) \
    --preload-file models/resources/cubicmap.png@resources/cubicmap.png \
    --preload-file models/resources/cubicmap_atlas.png@resources/cubicmap_atlas.png

# compile [models] example - model mesh picking
models/models_mesh_picking: models/models_mesh_picking.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM) \
    --preload-file models/resources/tower.obj@resources/tower.obj \
    --preload-file models/resources/tower.png@resources/tower.png
    
# compile [models] example - models mesh generation
models/models_mesh_generation: models/models_mesh_generation.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM)

# compile [models] example - models material pbr
models/models_material_pbr: models/models_material_pbr.c
ifeq ($(PLATFORM), $(filter $(PLATFORM),PLATFORM_DESKTOP))
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM)
else
	@echo models_material_pbr: Example not supported on PLATFORM_ANDROID, PLATFORM_WEB or PLATFORM_RPI
endif

# compile [models] example - models skybox
models/models_skybox: models/models_skybox.c
ifeq ($(PLATFORM), $(filter $(PLATFORM),PLATFORM_DESKTOP))
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM)
else
	@echo models_skybox: Example not supported on PLATFORM_ANDROID, PLATFORM_WEB or PLATFORM_RPI
endif

# compile [models] example - models yaw pitch roll
models/models_yaw_pitch_roll: models/models_yaw_pitch_roll.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM) -s TOTAL_MEMORY=67108864 \
    --preload-file models/resources/plane.obj@resources/plane.obj \
    --preload-file models/resources/plane_diffuse.png@resources/plane_diffuse.png \
    --preload-file models/resources/plane.png@resources/plane.png \
    --preload-file models/resources/pitch.png@resources/pitch.png \
    --preload-file models/resources/background.png@resources/background.png \
    --preload-file models/resources/angle_gauge.png@resources/angle_gauge.png \   
 
# compile [shaders] example - model shader
shaders/shaders_model_shader: shaders/shaders_model_shader.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM) -s TOTAL_MEMORY=67108864 \
    --preload-file shaders/resources/model/dwarf.obj@resources/model/dwarf.obj \
    --preload-file shaders/resources/model/dwarf_diffuse.png@resources/model/dwarf_diffuse.png \
    --preload-file shaders/resources/shaders/glsl100/base.vs@resources/shaders/glsl100/base.vs \
    --preload-file shaders/resources/shaders/glsl100/grayscale.fs@resources/shaders/glsl100/grayscale.fs

# compile [shaders] example - shapes texture shader
shaders/shaders_shapes_textures: shaders/shaders_shapes_textures.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM) \
    --preload-file shaders/resources/fudesumi.png@resources/fudesumi.png \
    --preload-file shaders/resources/shaders/glsl100/base.vs@resources/shaders/glsl100/base.vs \
    --preload-file shaders/resources/shaders/glsl100/grayscale.fs@resources/shaders/glsl100/grayscale.fs

# compile [shaders] example - custom uniform in shader
shaders/shaders_custom_uniform: shaders/shaders_custom_uniform.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM) -s TOTAL_MEMORY=67108864 \
    --preload-file shaders/resources/model/dwarf.obj@resources/model/dwarf.obj \
    --preload-file shaders/resources/model/dwarf_diffuse.png@resources/model/dwarf_diffuse.png \
    --preload-file shaders/resources/shaders/glsl100/base.vs@resources/shaders/glsl100/base.vs \
    --preload-file shaders/resources/shaders/glsl100/swirl.fs@resources/shaders/glsl100/swirl.fs

# compile [shaders] example - postprocessing shader
shaders/shaders_postprocessing: shaders/shaders_postprocessing.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM) -s TOTAL_MEMORY=67108864 \
    --preload-file shaders/resources/model/dwarf.obj@resources/model/dwarf.obj \
    --preload-file shaders/resources/model/dwarf_diffuse.png@resources/model/dwarf_diffuse.png \
    --preload-file shaders/resources/shaders/glsl100@resources/shaders/glsl100

# compile [audio] example - sound loading and playing (WAV and OGG)
audio/audio_sound_loading: audio/audio_sound_loading.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM) \
    --preload-file audio/resources/weird.wav@resources/weird.wav \
    --preload-file audio/resources/tanatana.ogg@resources/tanatana.ogg

# compile [audio] example - music stream playing (OGG)
audio/audio_music_stream: audio/audio_music_stream.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM) \
    --preload-file audio/resources/guitar_noodling.ogg@resources/guitar_noodling.ogg

# compile [audio] example - module playing (XM)
audio/audio_module_playing: audio/audio_module_playing.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM) \
    --preload-file audio/resources/mini1111.xm@resources/mini1111.xm

# compile [audio] example - raw audio streaming
audio/audio_raw_stream: audio/audio_raw_stream.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM) -s TOTAL_MEMORY=67108864

# compile [physac] example - physics demo
physac/physics_demo: physac/physics_demo.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -static -lpthread -D$(PLATFORM) -s USE_PTHREADS=1

# compile [physac] example - physics friction
physac/physics_friction: physac/physics_friction.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -static -lpthread -D$(PLATFORM) -s USE_PTHREADS=1

# compile [physac] example - physics movement
physac/physics_movement: physac/physics_movement.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -static -lpthread -D$(PLATFORM) -s USE_PTHREADS=1

# compile [physac] example - physics restitution
physac/physics_restitution: physac/physics_restitution.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -static -lpthread -D$(PLATFORM) -s USE_PTHREADS=1

# compile [physac] example - physics shatter
physac/physics_shatter: physac/physics_shatter.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -static -lpthread -D$(PLATFORM) -s USE_PTHREADS=1

# fix dylib install path name for each executable (MAC)
fix_dylib:
ifeq ($(PLATFORM_OS),OSX)
	find . -type f -perm +ugo+x -print0 | xargs -t -0 -R 1 -I file install_name_tool -change libglfw.3.0.dylib ../external/glfw3/lib/osx/libglfw.3.0.dylib file
endif

# Clean everything
clean:
ifeq ($(PLATFORM),PLATFORM_DESKTOP)
    ifeq ($(PLATFORM_OS),WINDOWS)
		del *.o *.exe /s
    endif
    ifeq ($(PLATFORM_OS),LINUX)
		find -type f -executable | xargs file -i | grep -E 'x-object|x-archive|x-sharedlib|x-executable' | rev | cut -d ':' -f 2- | rev | xargs rm -f
    endif
    ifeq ($(PLATFORM_OS),OSX)
		find . -type f -perm +ugo+x -delete
		rm -f *.o
    endif
endif
ifeq ($(PLATFORM),PLATFORM_RPI)
	find . -type f -executable -delete
	rm -f *.o
endif
ifeq ($(PLATFORM),PLATFORM_WEB)
    # TODO: Remove all generated files in all folders... avoid deleting loader.html!
	del *.o *.html *.js *.data
endif
	@echo Cleaning done

