#**************************************************************************************************
#
#   raylib makefile for Desktop platforms, Raspberry Pi, Android and HTML5
#
#   Copyright (c) 2013-2020 Ramon Santamaria (@raysan5)
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
PROJECT_NAME       ?= raylib_examples
RAYLIB_VERSION     ?= 2.5.0
RAYLIB_API_VERSION ?= 2
RAYLIB_PATH        ?= C:\GitHub\raylib

# Define default options

# One of PLATFORM_DESKTOP, PLATFORM_RPI, PLATFORM_ANDROID, PLATFORM_WEB
PLATFORM           ?= PLATFORM_DESKTOP

# Locations of your newly installed library and associated headers. See ../src/Makefile
# On Linux, if you have installed raylib but cannot compile the examples, check that
# the *_INSTALL_PATH values here are the same as those in src/Makefile or point to known locations.
# To enable system-wide compile-time and runtime linking to libraylib.so, run ../src/$ sudo make install RAYLIB_LIBTYPE_SHARED.
# To enable compile-time linking to a special version of libraylib.so, change these variables here.
# To enable runtime linking to a special version of libraylib.so, see EXAMPLE_RUNTIME_PATH below.
# If there is a libraylib in both EXAMPLE_RUNTIME_PATH and RAYLIB_INSTALL_PATH, at runtime,
# the library at EXAMPLE_RUNTIME_PATH, if present, will take precedence over the one at RAYLIB_INSTALL_PATH.
# RAYLIB_INSTALL_PATH should be the desired full path to libraylib. No relative paths.
DESTDIR ?= /usr/local
RAYLIB_INSTALL_PATH ?= $(DESTDIR)/lib
# RAYLIB_H_INSTALL_PATH locates the installed raylib header and associated source files.
RAYLIB_H_INSTALL_PATH ?= $(DESTDIR)/include

# Library type used for raylib: STATIC (.a) or SHARED (.so/.dll)
RAYLIB_LIBTYPE        ?= STATIC

# Build mode for project: DEBUG or RELEASE
BUILD_MODE            ?= RELEASE

# Use external GLFW library instead of rglfw module
# TODO: Review usage on Linux. Target version of choice. Switch on -lglfw or -lglfw3
USE_EXTERNAL_GLFW     ?= FALSE

# Use Wayland display server protocol on Linux desktop
# by default it uses X11 windowing system
USE_WAYLAND_DISPLAY   ?= FALSE

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
            PLATFORM_OS=BSD
        endif
        ifeq ($(UNAMEOS),OpenBSD)
            PLATFORM_OS=BSD
        endif
        ifeq ($(UNAMEOS),NetBSD)
            PLATFORM_OS=BSD
        endif
        ifeq ($(UNAMEOS),DragonFly)
            PLATFORM_OS=BSD
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

# RAYLIB_PATH adjustment for different platforms.
# If using GNU make, we can get the full path to the top of the tree. Windows? BSD?
# Required for ldconfig or other tools that do not perform path expansion.
ifeq ($(PLATFORM),PLATFORM_DESKTOP)
    ifeq ($(PLATFORM_OS),LINUX)
        RAYLIB_PREFIX ?= ..
        RAYLIB_PATH    = $(realpath $(RAYLIB_PREFIX))
    endif
endif
# Default path for raylib on Raspberry Pi, if installed in different path, update it!
# This is not currently used by src/Makefile. Not sure of its origin or usage. Refer to wiki.
# TODO: update install: target in src/Makefile for RPI, consider relation to LINUX.
ifeq ($(PLATFORM),PLATFORM_RPI)
    RAYLIB_PATH       ?= /home/pi/raylib
endif

ifeq ($(PLATFORM),PLATFORM_WEB)
    # Emscripten required variables
    EMSDK_PATH         ?= C:/emsdk
    EMSCRIPTEN_PATH    ?= $(EMSDK_PATH)/fastcomp/emscripten
    CLANG_PATH          = $(EMSDK_PATH)/fastcomp/bin
    PYTHON_PATH         = $(EMSDK_PATH)/python/2.7.13.1_64bit/python-2.7.13.amd64
    NODE_PATH           = $(EMSDK_PATH)/node/12.9.1_64bit/bin
    export PATH         = $(EMSDK_PATH);$(EMSCRIPTEN_PATH);$(CLANG_PATH);$(NODE_PATH);$(PYTHON_PATH);C:\raylib\MinGW\bin:$$(PATH)
endif

# Define raylib release directory for compiled library.
# RAYLIB_RELEASE_PATH points to provided binaries or your freshly built version
RAYLIB_RELEASE_PATH 	?= $(RAYLIB_PATH)/src

# EXAMPLE_RUNTIME_PATH embeds a custom runtime location of libraylib.so or other desired libraries
# into each example binary compiled with RAYLIB_LIBTYPE=SHARED. It defaults to RAYLIB_RELEASE_PATH
# so that these examples link at runtime with your version of libraylib.so in ../release/libs/linux
# without formal installation from ../src/Makefile. It aids portability and is useful if you have
# multiple versions of raylib, have raylib installed to a non-standard location, or want to
# bundle libraylib.so with your game. Change it to your liking.
# NOTE: If, at runtime, there is a libraylib.so at both EXAMPLE_RUNTIME_PATH and RAYLIB_INSTALL_PATH,
# The library at EXAMPLE_RUNTIME_PATH, if present, will take precedence over RAYLIB_INSTALL_PATH,
# Implemented for LINUX below with CFLAGS += -Wl,-rpath,$(EXAMPLE_RUNTIME_PATH)
# To see the result, run readelf -d core/core_basic_window; looking at the RPATH or RUNPATH attribute.
# To see which libraries a built example is linking to, ldd core/core_basic_window;
# Look for libraylib.so.1 => $(RAYLIB_INSTALL_PATH)/libraylib.so.1 or similar listing.
EXAMPLE_RUNTIME_PATH   ?= $(RAYLIB_RELEASE_PATH)

# Define default C compiler: gcc
# NOTE: define g++ compiler if using C++
CC = gcc

ifeq ($(PLATFORM),PLATFORM_DESKTOP)
    ifeq ($(PLATFORM_OS),OSX)
        # OSX default compiler
        CC = clang
    endif
    ifeq ($(PLATFORM_OS),BSD)
        # FreeBSD, OpenBSD, NetBSD, DragonFly default compiler
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
    # WARNING: To compile to HTML5, code must be redesigned
    # to use emscripten.h and emscripten_set_main_loop()
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
#  -g                   include debug information on compilation
#  -s                   strip unnecessary data from build
#  -Wall                turns on most, but not all, compiler warnings
#  -std=c99             defines C language mode (standard C from 1999 revision)
#  -std=gnu99           defines C language mode (GNU C from 1999 revision)
#  -Wno-missing-braces  ignore invalid warning (GCC bug 53119)
#  -D_DEFAULT_SOURCE    use with -std=c99 on Linux and PLATFORM_WEB, required for timespec
CFLAGS += -Wall -std=c99 -D_DEFAULT_SOURCE -Wno-missing-braces

ifeq ($(BUILD_MODE),DEBUG)
    CFLAGS += -g
    ifeq ($(PLATFORM),PLATFORM_WEB)
        CFLAGS += -s ASSERTIONS=1 --profiling
    endif
else
    ifeq ($(PLATFORM),PLATFORM_WEB)
        CFLAGS += -Os
    else
        CFLAGS += -s -O1
    endif
endif

# Additional flags for compiler (if desired)
#CFLAGS += -Wextra -Wmissing-prototypes -Wstrict-prototypes
ifeq ($(PLATFORM),PLATFORM_DESKTOP)
    ifeq ($(PLATFORM_OS),WINDOWS)
        # resource file contains windows executable icon and properties
        # -Wl,--subsystem,windows hides the console window
        CFLAGS += $(RAYLIB_PATH)/src/raylib.rc.data -Wl,--subsystem,windows
    endif
    ifeq ($(PLATFORM_OS),LINUX)
        ifeq ($(RAYLIB_LIBTYPE),STATIC)
            CFLAGS += -D_DEFAULT_SOURCE
        endif
        ifeq ($(RAYLIB_LIBTYPE),SHARED)
            # Explicitly enable runtime link to libraylib.so
            CFLAGS += -Wl,-rpath,$(EXAMPLE_RUNTIME_PATH)
        endif
    endif
endif
ifeq ($(PLATFORM),PLATFORM_RPI)
    CFLAGS += -std=gnu99
endif
ifeq ($(PLATFORM),PLATFORM_WEB)
    # -Os                        # size optimization
    # -O2                        # optimization level 2, if used, also set --memory-init-file 0
    # -s USE_GLFW=3              # Use glfw3 library (context/input management)
    # -s ALLOW_MEMORY_GROWTH=1   # to allow memory resizing -> WARNING: Audio buffers could FAIL!
    # -s TOTAL_MEMORY=16777216   # to specify heap memory size (default = 16MB)
    # -s USE_PTHREADS=1          # multithreading support
    # -s WASM=0                  # disable Web Assembly, emitted by default
    # -s EMTERPRETIFY=1          # enable emscripten code interpreter (very slow)
    # -s EMTERPRETIFY_ASYNC=1    # support synchronous loops by emterpreter
    # -s FORCE_FILESYSTEM=1      # force filesystem to load/save files data
    # -s ASSERTIONS=1            # enable runtime checks for common memory allocation errors (-O1 and above turn it off)
    # --profiling                # include information for code profiling
    # --memory-init-file 0       # to avoid an external memory initialization code file (.mem)
    # --preload-file resources   # specify a resources folder for data compilation
    CFLAGS += -s USE_GLFW=3

    # NOTE: On PLATFORM_WEB, every example requires its own flags

    # Define a custom shell .html and output extension
    CFLAGS += --shell-file $(RAYLIB_PATH)/src/shell.html
    EXT = .html
endif

# Define include paths for required headers
# NOTE: Several external required libraries (stb and others)
INCLUDE_PATHS = -I. -I$(RAYLIB_PATH)/src -I$(RAYLIB_PATH)/src/external

# Define additional directories containing required header files
ifeq ($(PLATFORM),PLATFORM_RPI)
    # RPI required libraries
    INCLUDE_PATHS += -I/opt/vc/include
    INCLUDE_PATHS += -I/opt/vc/include/interface/vmcs_host/linux
    INCLUDE_PATHS += -I/opt/vc/include/interface/vcos/pthreads
endif
ifeq ($(PLATFORM),PLATFORM_DESKTOP)
    ifeq ($(PLATFORM_OS),BSD)
        # Consider -L$(RAYLIB_H_INSTALL_PATH)
        INCLUDE_PATHS += -I/usr/local/include
    endif
    ifeq ($(PLATFORM_OS),LINUX)
        # Reset everything.
        # Precedence: immediately local, installed version, raysan5 provided libs -I$(RAYLIB_H_INSTALL_PATH) -I$(RAYLIB_PATH)/release/include
        INCLUDE_PATHS = -I$(RAYLIB_H_INSTALL_PATH) -isystem. -isystem$(RAYLIB_PATH)/src -isystem$(RAYLIB_PATH)/release/include -isystem$(RAYLIB_PATH)/src/external
    endif
endif

# Define library paths containing required libs.
LDFLAGS = -L. -L$(RAYLIB_RELEASE_PATH) -L$(RAYLIB_PATH)/src

ifeq ($(PLATFORM),PLATFORM_DESKTOP)
    ifeq ($(PLATFORM_OS),BSD)
        # Consider -L$(RAYLIB_INSTALL_PATH)
        LDFLAGS += -L. -Lsrc -L/usr/local/lib
    endif
    ifeq ($(PLATFORM_OS),LINUX)
        # Reset everything.
        # Precedence: immediately local, installed version, raysan5 provided libs
        LDFLAGS = -L. -L$(RAYLIB_INSTALL_PATH) -L$(RAYLIB_RELEASE_PATH)
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
        # NOTE: WinMM library required to set high-res timer resolution
        LDLIBS = -lraylib -lopengl32 -lgdi32 -lwinmm
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
        # Explicit link to libc
        ifeq ($(RAYLIB_LIBTYPE),SHARED)
            LDLIBS += -lc
        endif
    endif
    ifeq ($(PLATFORM_OS),OSX)
        # Libraries for OSX 10.9 desktop compiling
        # NOTE: Required packages: libopenal-dev libegl1-mesa-dev
        LDLIBS = -lraylib -framework OpenGL -framework Cocoa -framework IOKit -framework CoreAudio -framework CoreVideo 
    endif
    ifeq ($(PLATFORM_OS),BSD)
        # Libraries for FreeBSD, OpenBSD, NetBSD, DragonFly desktop compiling
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
CORE = \
    core/core_basic_window \
    core/core_input_keys \
    core/core_input_mouse \
    core/core_input_mouse_wheel \
    core/core_input_gamepad \
    core/core_input_multitouch \
    core/core_input_gestures \
    core/core_2d_camera \
    core/core_2d_camera_platformer \
    core/core_3d_camera_mode \
    core/core_3d_camera_free \
    core/core_3d_camera_first_person \
    core/core_3d_picking \
    core/core_world_screen \
    core/core_custom_logging \
    core/core_window_letterbox \
    core/core_drop_files \
    core/core_random_values \
    core/core_scissor_test \
    core/core_storage_values \
    core/core_vr_simulator \
    core/core_loading_thread

SHAPES = \
    shapes/shapes_basic_shapes \
    shapes/shapes_bouncing_ball \
    shapes/shapes_colors_palette \
    shapes/shapes_logo_raylib \
    shapes/shapes_logo_raylib_anim \
    shapes/shapes_rectangle_scaling \
    shapes/shapes_lines_bezier \
    shapes/shapes_collision_area \
    shapes/shapes_following_eyes \
    shapes/shapes_easings_ball_anim \
    shapes/shapes_easings_box_anim \
    shapes/shapes_easings_rectangle_array \
    shapes/shapes_draw_ring \
    shapes/shapes_draw_circle_sector \
    shapes/shapes_draw_rectangle_rounded
    
TEXTURES = \
    textures/textures_logo_raylib \
    textures/textures_mouse_painting \
    textures/textures_rectangle \
    textures/textures_srcrec_dstrec \
    textures/textures_image_drawing \
    textures/textures_image_generation \
    textures/textures_image_loading \
    textures/textures_image_processing \
    textures/textures_image_text \
    textures/textures_to_image \
    textures/textures_raw_data \
    textures/textures_particles_blending \
    textures/textures_npatch_drawing \
    textures/textures_background_scrolling \
    textures/textures_sprite_button \
    textures/textures_sprite_explosion \
    textures/textures_bunnymark
    
TEXT = \
    text/text_raylib_fonts \
    text/text_font_spritefont \
    text/text_font_loading \
    text/text_font_filters \
    text/text_font_sdf \
    text/text_format_text \
    text/text_input_box \
    text/text_writing_anim \
    text/text_rectangle_bounds \
    text/text_unicode
    
MODELS = \
    models/models_animation \
    models/models_billboard \
    models/models_box_collisions \
    models/models_cubicmap \
    models/models_first_person_maze \
    models/models_geometric_shapes \
    models/models_material_pbr \
    models/models_mesh_generation \
    models/models_mesh_picking \
    models/models_loading \
    models/models_orthographic_projection \
    models/models_rlgl_solar_system \
    models/models_skybox \
    models/models_yaw_pitch_roll \
    models/models_heightmap \
    models/models_waving_cubes
    
SHADERS = \
    shaders/shaders_model_shader \
    shaders/shaders_shapes_textures \
    shaders/shaders_custom_uniform \
    shaders/shaders_postprocessing \
    shaders/shaders_palette_switch \
    shaders/shaders_raymarching \
    shaders/shaders_texture_drawing \
    shaders/shaders_texture_waves \
    shaders/shaders_julia_set \
    shaders/shaders_eratosthenes \
    shaders/shaders_basic_lighting \
    shaders/shaders_fog \
    shaders/shaders_simple_mask
    
AUDIO = \
    audio/audio_module_playing \
    audio/audio_music_stream \
    audio/audio_raw_stream \
    audio/audio_sound_loading \
    audio/audio_multichannel_sound
    
PHYSICS = \
    physics/physics_demo \
    physics/physics_friction \
    physics/physics_movement \
    physics/physics_restitution \
    physics/physics_shatter


CURRENT_MAKEFILE = $(lastword $(MAKEFILE_LIST))

# Default target entry
all: $(CORE) $(SHAPES) $(TEXT) $(TEXTURES) $(MODELS) $(SHADERS) $(AUDIO) $(PHYSICS)

core: $(CORE)
shapes: $(SHAPES)
textures: $(TEXTURES)
text: $(TEXT)
models: $(MODELS)
shaders: $(SHADERS)
audio: $(AUDIO)
physics: $(PHYSICS)

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
core/core_input_mouse_wheel: core/core_input_mouse_wheel.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM)

# compile [core] example - gamepad input
core/core_input_gamepad: core/core_input_gamepad.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM) \
    --preload-file core/resources/ps3.png@resources/ps3.png \
    --preload-file core/resources/xbox.png@resources/xbox.png

# compile [core] example - input multitouch
core/core_input_multitouch: core/core_input_multitouch.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM)

# compile [core] example - gestures detection
core/core_input_gestures: core/core_input_gestures.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM)

# compile [core] example - 2d camera
core/core_2d_camera: core/core_2d_camera.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM)

# compile [core] example - 2d camera paltformer
core/core_2d_camera_platformer: core/core_2d_camera_platformer.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM)

# compile [core] example - 3d camera mode
core/core_3d_camera_mode: core/core_3d_camera_mode.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM)
    
# compile [core] example - 3d camera free
core/core_3d_camera_free: core/core_3d_camera_free.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM)

# compile [core] example - 3d camera first person
core/core_3d_camera_first_person: core/core_3d_camera_first_person.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM)

# compile [core] example - 3d picking
core/core_3d_picking: core/core_3d_picking.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM)

# compile [core] example - world screen
core/core_world_screen: core/core_world_screen.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM)

core/core_custom_logging: core/core_custom_logging.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM)

# compile [core] example - window letterbox
core/core_window_letterbox: core/core_window_letterbox.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM)

# compile [core] example - drop files
# NOTE: File drop not supported on PLATFORM_ANDROID and PLATFORM_RPI (native)
core/core_drop_files: core/core_drop_files.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM) -s TOTAL_MEMORY=67108864 -s FORCE_FILESYSTEM=1
    
# compile [core] example - generate random values
core/core_random_values: core/core_random_values.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM)

# compile [core] example - scissor test
core/core_scissor_test: core/core_scissor_test.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM)

# compile [core] example - storage values
core/core_storage_values: core/core_storage_values.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM) -s FORCE_FILESYSTEM=1

# compile [core] example - vr simulator
core/core_vr_simulator: core/core_vr_simulator.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM) \
    --preload-file core/resources/distortion100.fs@resources/distortion100.fs

# compile [core] example - loading thread
core/core_loading_thread: core/core_loading_thread.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -lpthread -D$(PLATFORM) -s USE_PTHREADS=1
   
# compile [shapes] example - basic shapes usage (rectangle, circle, ...)
shapes/shapes_basic_shapes: shapes/shapes_basic_shapes.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM)

# compile [shapes] example - bouncing ball
shapes/shapes_bouncing_ball: shapes/shapes_bouncing_ball.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM)

# compile [shapes] example - raylib color palette
shapes/shapes_colors_palette: shapes/shapes_colors_palette.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM)
    
# compile [shapes] example - raylib logo (with basic shapes)
shapes/shapes_logo_raylib: shapes/shapes_logo_raylib.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM)

# compile [shapes] example - raylib logo animation
shapes/shapes_logo_raylib_anim: shapes/shapes_logo_raylib_anim.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM)

shapes/shapes_rectangle_scaling: shapes/shapes_rectangle_scaling.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM)

# compile [shapes] example - lines bezier
shapes/shapes_lines_bezier: shapes/shapes_lines_bezier.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM)
    
shapes/shapes_collision_area: shapes/shapes_collision_area.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM)
    
shapes/shapes_following_eyes: shapes/shapes_following_eyes.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM)
    
shapes/shapes_easings_ball_anim: shapes/shapes_easings_ball_anim.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM)
    
shapes/shapes_easings_box_anim: shapes/shapes_easings_box_anim.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM)
    
shapes/shapes_easings_rectangle_array: shapes/shapes_easings_rectangle_array.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM)
    
shapes/shapes_draw_ring: shapes/shapes_draw_ring.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM)
    
shapes/shapes_draw_circle_sector: shapes/shapes_draw_circle_sector.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM)
    
shapes/shapes_draw_rectangle_rounded: shapes/shapes_draw_rectangle_rounded.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM)

# compile [textures] example - raylib logo texture loading
textures/textures_logo_raylib: textures/textures_logo_raylib.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM) \
    --preload-file textures/resources/raylib_logo.png@resources/raylib_logo.png

textures/textures_mouse_painting: textures/textures_mouse_painting.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM)

# compile [textures] example - texture rectangle drawing
textures/textures_rectangle: textures/textures_rectangle.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM) \
    --preload-file textures/resources/scarfy.png@resources/scarfy.png

# compile [textures] example - texture source and destination rectangles
textures/textures_srcrec_dstrec: textures/textures_srcrec_dstrec.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM) \
    --preload-file textures/resources/scarfy.png@resources/scarfy.png
    
# compile [textures] example - image loading and conversion to texture
textures/textures_image_loading: textures/textures_image_loading.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM) \
    --preload-file textures/resources/raylib_logo.png@resources/raylib_logo.png

# compile [textures] example - texture image drawing
textures/textures_image_drawing: textures/textures_image_drawing.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM) \
    --preload-file textures/resources/parrots.png@resources/parrots.png \
    --preload-file textures/resources/cat.png@resources/cat.png
    
# compile [textures] example - texture image generation
textures/textures_image_generation: textures/textures_image_generation.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM) -s TOTAL_MEMORY=67108864
    
# compile [textures] example - texture image processing
textures/textures_image_processing: textures/textures_image_processing.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM) \
    --preload-file textures/resources/parrots.png@resources/parrots.png
    
textures/textures_image_text: textures/textures_image_text.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM) -s TOTAL_MEMORY=67108864 \
    --preload-file textures/resources/parrots.png@resources/parrots.png \
    --preload-file textures/resources/KAISG.ttf@resources/KAISG.ttf

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

textures/textures_npatch_drawing: textures/textures_npatch_drawing.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM) \
    --preload-file textures/resources/ninepatch_button.png@resources/ninepatch_button.png
    
textures/textures_background_scrolling: textures/textures_background_scrolling.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM) \
    --preload-file textures/resources/cyberpunk_street_background.png@resources/cyberpunk_street_background.png \
    --preload-file textures/resources/cyberpunk_street_midground.png@resources/cyberpunk_street_midground.png \
    --preload-file textures/resources/cyberpunk_street_foreground.png@resources/cyberpunk_street_foreground.png
    
textures/textures_sprite_button: textures/textures_sprite_button.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM) \
    --preload-file textures/resources/button.png@resources/button.png \
    --preload-file textures/resources/buttonfx.wav@resources/buttonfx.wav
    
textures/textures_sprite_explosion: textures/textures_sprite_explosion.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM) \
    --preload-file textures/resources/explosion.png@resources/explosion.png \
    --preload-file textures/resources/boom.wav@resources/boom.wav
    
textures/textures_bunnymark: textures/textures_bunnymark.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM) \
    --preload-file textures/resources/wabbit_alpha.png@resources/wabbit_alpha.png
    
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

# compile [text] example - font spritefont
text/text_font_spritefont: text/text_font_spritefont.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM) \
    --preload-file text/resources/custom_mecha.png@resources/custom_mecha.png \
    --preload-file text/resources/custom_alagard.png@resources/custom_alagard.png \
    --preload-file text/resources/custom_jupiter_crash.png@resources/custom_jupiter_crash.png

# compile [text] example - font loading
text/text_font_loading: text/text_font_loading.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM) -s TOTAL_MEMORY=67108864 \
    --preload-file text/resources/KAISG.ttf@resources/KAISG.ttf

# compile [text] example - font filters
text/text_font_filters: text/text_font_filters.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM) -s TOTAL_MEMORY=67108864 \
    --preload-file text/resources/pixantiqua.fnt@resources/pixantiqua.fnt \
    --preload-file text/resources/pixantiqua.png@resources/pixantiqua.png \
    --preload-file text/resources/pixantiqua.ttf@resources/pixantiqua.ttf  

text/text_font_sdf: text/text_font_sdf.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM) -s TOTAL_MEMORY=67108864 \
    --preload-file text/resources/AnonymousPro-Bold.ttf@resources/AnonymousPro-Bold.ttf \
    --preload-file text/resources/shaders/glsl100/sdf.fs@resources/shaders/glsl100/sdf.fs
    
# compile [text] example - text formatting
text/text_format_text: text/text_format_text.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM)

# compile [text] example - text input box
text/text_input_box: text/text_input_box.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM)

# compile [text] example - text writing animation
text/text_writing_anim: text/text_writing_anim.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM)

text/text_rectangle_bounds: text/text_rectangle_bounds.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM)

text/text_unicode: text/text_unicode.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM) -s TOTAL_MEMORY=67108864 \
    --preload-file text/resources/dejavu.fnt@resources/dejavu.fnt \
    --preload-file text/resources/dejavu.png@resources/dejavu.png \
    --preload-file text/resources/notoCJK.fnt@resources/notoCJK.fnt \
    --preload-file text/resources/notoCJK.png@resources/notoCJK.png \
    --preload-file text/resources/emoji.fnt@resources/emoji.fnt \
    --preload-file text/resources/emoji.png@resources/emoji.png

models/models_animation: models/models_animation.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM) -s TOTAL_MEMORY=67108864 \
    --preload-file models/resources/guy/guy.iqm@resources/guy/guy.iqm \
    --preload-file models/resources/guy/guytex.png@resources/guy/guytex.png \
    --preload-file models/resources/guy/guyanim.iqm@resources/guy/guyanim.iqm

# compile [models] example - billboard usage
models/models_billboard: models/models_billboard.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM) \
    --preload-file models/resources/billboard.png@resources/billboard.png
    
# compile [models] example - box collisions
models/models_box_collisions: models/models_box_collisions.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM)
    
# compile [models] example - cubicmap loading
models/models_cubicmap: models/models_cubicmap.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM) \
    --preload-file models/resources/cubicmap.png@resources/cubicmap.png \
    --preload-file models/resources/cubicmap_atlas.png@resources/cubicmap_atlas.png

models/models_first_person_maze: models/models_first_person_maze.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM) \
    --preload-file models/resources/cubicmap.png@resources/cubicmap.png \
    --preload-file models/resources/cubicmap_atlas.png@resources/cubicmap_atlas.png

# compile [models] example - basic geometric 3d shapes
models/models_geometric_shapes: models/models_geometric_shapes.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM)

# compile [models] example - models material pbr
models/models_material_pbr: models/models_material_pbr.c
ifeq ($(PLATFORM), $(filter $(PLATFORM),PLATFORM_DESKTOP))
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM)
else
	@echo models_material_pbr: Example not supported on PLATFORM_ANDROID, PLATFORM_WEB or PLATFORM_RPI
endif

# compile [models] example - models mesh generation
models/models_mesh_generation: models/models_mesh_generation.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM)
    
# compile [models] example - model mesh picking
models/models_mesh_picking: models/models_mesh_picking.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM) \
    --preload-file models/resources/models/turret.obj@resources/models/turret.obj \
    --preload-file models/resources/models/turret_diffuse.png@resources/models/turret_diffuse.png

# compile [models] example - model loading
models/models_loading: models/models_loading.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM) -s TOTAL_MEMORY=67108864 \
    --preload-file models/resources/models/castle.obj@resources/models/castle.obj \
    --preload-file models/resources/models/castle_diffuse.png@resources/models/castle_diffuse.png

models/models_orthographic_projection: models/models_orthographic_projection.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM)

models/models_rlgl_solar_system: models/models_rlgl_solar_system.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM)

# compile [models] example - models skybox
models/models_skybox: models/models_skybox.c
ifeq ($(PLATFORM), $(filter $(PLATFORM),PLATFORM_DESKTOP))
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM) \
    --preload-file models/resources/dresden_square.hdr@resources/dresden_square.hdr
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
    --preload-file models/resources/angle_gauge.png@resources/angle_gauge.png  
     
# compile [models] example - heightmap loading
models/models_heightmap: models/models_heightmap.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM) \
    --preload-file models/resources/heightmap.png@resources/heightmap.png

models/models_waving_cubes: models/models_waving_cubes.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM)

# compile [shaders] example - model shader
shaders/shaders_model_shader: shaders/shaders_model_shader.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM) -s TOTAL_MEMORY=67108864 \
    --preload-file shaders/resources/models/watermill.obj@resources/models/watermill.obj \
    --preload-file shaders/resources/models/watermill_diffuse.png@resources/models/watermill_diffuse.png \
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
    --preload-file shaders/resources/models/barracks.obj@resources/models/barracks.obj \
    --preload-file shaders/resources/models/barracks_diffuse.png@resources/models/barracks_diffuse.png \
    --preload-file shaders/resources/shaders/glsl100/swirl.fs@resources/shaders/glsl100/swirl.fs

# compile [shaders] example - postprocessing shader
shaders/shaders_postprocessing: shaders/shaders_postprocessing.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM) -s TOTAL_MEMORY=67108864 \
    --preload-file shaders/resources/models/church.obj@resources/models/church.obj \
    --preload-file shaders/resources/models/church_diffuse.png@resources/models/church_diffuse.png \
    --preload-file shaders/resources/shaders/glsl100@resources/shaders/glsl100

shaders/shaders_palette_switch: shaders/shaders_palette_switch.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM) \
    --preload-file shaders/resources/shaders/glsl100/palette_switch.fs@resources/shaders/glsl100/palette_switch.fs
    
shaders/shaders_raymarching: shaders/shaders_raymarching.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM) \
    --preload-file shaders/resources/shaders/glsl100/raymarching.fs@resources/shaders/glsl100/raymarching.fs
    
shaders/shaders_texture_drawing: shaders/shaders_texture_drawing.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM) \
    --preload-file shaders/resources/shaders/glsl100/cubes_panning.fs@resources/shaders/glsl100/cubes_panning.fs
    
shaders/shaders_texture_waves: shaders/shaders_texture_waves.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM) \
    --preload-file shaders/resources/space.png@resources/space.png \
    --preload-file shaders/resources/shaders/glsl100/wave.fs@resources/shaders/glsl100/wave.fs

shaders/shaders_julia_set: shaders/shaders_julia_set.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM) \
    --preload-file shaders/resources/shaders/glsl100/julia_set.fs@resources/shaders/glsl100/julia_set.fs

shaders/shaders_eratosthenes: shaders/shaders_eratosthenes.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM) \
    --preload-file shaders/resources/shaders/glsl100/eratosthenes.fs@resources/shaders/glsl100/eratosthenes.fs

shaders/shaders_basic_lighting: shaders/shaders_basic_lighting.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM) \
    --preload-file shaders/resources/texel_checker.png@resources/texel_checker.png \
    --preload-file shaders/resources/shaders/glsl100/basic_lighting.fs@resources/shaders/glsl100/basic_lighting.fs \
    --preload-file shaders/resources/shaders/glsl100/basic_lighting.vs@resources/shaders/glsl100/basic_lighting.vs

shaders/shaders_fog: shaders/shaders_fog.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM) \
    --preload-file shaders/resources/texel_checker.png@resources/texel_checker.png \
    --preload-file shaders/resources/shaders/glsl100/fog.fs@resources/shaders/glsl100/fog.fs \
    --preload-file shaders/resources/shaders/glsl100/fog.vs@resources/shaders/glsl100/fog.vs

shaders/shaders_simple_mask: shaders/shaders_simple_mask.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM) \
    --preload-file shaders/resources/plasma.png@resources/plasma.png \
    --preload-file shaders/resources/mask.png@resources/mask.png \
    --preload-file shaders/resources/shaders/glsl100/mask.fs@resources/shaders/glsl100/mask.fs \
    --preload-file shaders/resources/shaders/glsl100/mask.vs@resources/shaders/glsl100/mask.vs

# compile [audio] example - module playing (XM)
audio/audio_module_playing: audio/audio_module_playing.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM) \
    --preload-file audio/resources/mini1111.xm@resources/mini1111.xm

# compile [audio] example - music stream playing (OGG)
audio/audio_music_stream: audio/audio_music_stream.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM) -s TOTAL_MEMORY=67108864 \
    --preload-file audio/resources/guitar_noodling.ogg@resources/guitar_noodling.ogg

# compile [audio] example - raw audio streaming
audio/audio_raw_stream: audio/audio_raw_stream.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM) -s TOTAL_MEMORY=67108864

# compile [audio] example - sound loading and playing (WAV and OGG)
audio/audio_sound_loading: audio/audio_sound_loading.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM) \
    --preload-file audio/resources/weird.wav@resources/weird.wav \
    --preload-file audio/resources/tanatana.ogg@resources/tanatana.ogg

audio/audio_multichannel_sound: audio/audio_multichannel_sound.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -D$(PLATFORM) \
    --preload-file audio/resources/weird.wav@resources/weird.wav \
    --preload-file audio/resources/tanatana.ogg@resources/tanatana.ogg

# compile [physac] example - physics demo
physics/physics_demo: physics/physics_demo.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -static -lpthread -D$(PLATFORM) -s USE_PTHREADS=1

# compile [physac] example - physics friction
physics/physics_friction: physics/physics_friction.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -static -lpthread -D$(PLATFORM) -s USE_PTHREADS=1

# compile [physac] example - physics movement
physics/physics_movement: physics/physics_movement.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -static -lpthread -D$(PLATFORM) -s USE_PTHREADS=1

# compile [physac] example - physics restitution
physics/physics_restitution: physics/physics_restitution.c
	$(CC) -o $@$(EXT) $< $(CFLAGS) $(INCLUDE_PATHS) $(LDFLAGS) $(LDLIBS) -static -lpthread -D$(PLATFORM) -s USE_PTHREADS=1

# compile [physac] example - physics shatter
physics/physics_shatter: physics/physics_shatter.c
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
	find -type f -executable | xargs file -i | grep -E 'x-object|x-archive|x-sharedlib|x-executable|x-pie-executable' | rev | cut -d ':' -f 2- | rev | xargs rm -fv
    endif
    ifeq ($(PLATFORM_OS),OSX)
		find . -type f -perm +ugo+x -delete
		rm -f *.o
    endif
endif
ifeq ($(PLATFORM),PLATFORM_RPI)
	find . -type f -executable -delete
	rm -fv *.o
endif
ifeq ($(PLATFORM),PLATFORM_WEB)
	del *.o *.html *.js
endif
	@echo Cleaning done

