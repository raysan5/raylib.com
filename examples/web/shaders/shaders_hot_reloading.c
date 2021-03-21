/*******************************************************************************************
*
*   raylib [shaders] example - Hot reloading
*
*   NOTE: This example requires raylib OpenGL 3.3 for shaders support and only #version 330
*         is currently supported. OpenGL ES 2.0 platforms are not supported at the moment.
*
*   This example has been created using raylib 3.0 (www.raylib.com)
*   raylib is licensed under an unmodified zlib/libpng license (View raylib.h for details)
*
*   Copyright (c) 2020 Ramon Santamaria (@raysan5)
*
********************************************************************************************/

#include "raylib.h"
#include "rlgl.h"

#include <time.h>       // Required for: localtime(), asctime()

#if defined(PLATFORM_WEB)
    #include <emscripten/emscripten.h>
#endif

#if defined(PLATFORM_DESKTOP)
    #define GLSL_VERSION            330
#else   // PLATFORM_RPI, PLATFORM_ANDROID, PLATFORM_WEB
    #define GLSL_VERSION            100
#endif

//----------------------------------------------------------------------------------
// Global Variables Definition
//----------------------------------------------------------------------------------
static const int screenWidth = 800;
static const int screenHeight = 450;

static char fragShaderFileName[256] = { 0 };
static long fragShaderFileModTime = 0;

static Shader shader = { 0 };

// Shader locations for required uniforms
static int resolutionLoc = 0;
static int mouseLoc = 0;
static int timeLoc = 0;

static float resolution[2] = { 0 };

static float totalTime = 0.0f;
static bool shaderAutoReloading = false;

//----------------------------------------------------------------------------------
// Module Functions Declaration
//----------------------------------------------------------------------------------
void UpdateDrawFrame(void);     // Update and Draw one frame

//----------------------------------------------------------------------------------
// Program Main Entry Point
//----------------------------------------------------------------------------------
int main(void)
{
    // Initialization
    //--------------------------------------------------------------------------------------
    int screenWidth = 800;
    int screenHeight = 450;

    InitWindow(screenWidth, screenHeight, "raylib [shaders] example - hot reloading");

    TextCopy(fragShaderFileName, TextFormat("resources/shaders/glsl%i/reload.fs", GLSL_VERSION));
    fragShaderFileModTime = GetFileModTime(TextFormat(fragShaderFileName, GLSL_VERSION));

    // Load shader
    // NOTE: Defining 0 (NULL) for vertex shader forces usage of internal default vertex shader
    shader = LoadShader(0, TextFormat(fragShaderFileName, GLSL_VERSION));

    // Get shader locations for required uniforms
    resolutionLoc = GetShaderLocation(shader, "resolution");
    mouseLoc = GetShaderLocation(shader, "mouse");
    timeLoc = GetShaderLocation(shader, "time");

    resolution[0] = (float)screenWidth;
    resolution[1] = (float)screenHeight;
    SetShaderValue(shader, resolutionLoc, resolution, SHADER_UNIFORM_VEC2);
    
#if defined(PLATFORM_WEB)
    emscripten_set_main_loop(UpdateDrawFrame, 60, 1);
#else
    SetTargetFPS(60);               // Set our game to run at 60 frames-per-second
    //--------------------------------------------------------------------------------------

    // Main game loop
    while (!WindowShouldClose())    // Detect window close button or ESC key
    {
        UpdateDrawFrame();
    }
#endif

    // De-Initialization
    //--------------------------------------------------------------------------------------
    UnloadShader(shader);           // Unload shader

    CloseWindow();                  // Close window and OpenGL context
    //--------------------------------------------------------------------------------------

    return 0;
}

//----------------------------------------------------------------------------------
// Module Functions Definitions
//----------------------------------------------------------------------------------
void UpdateDrawFrame(void)
{
    // Update
    //----------------------------------------------------------------------------------
    totalTime += GetFrameTime();
    Vector2 mouse = GetMousePosition();
    float mousePos[2] = { mouse.x, mouse.y };

    // Set shader required uniform values
    SetShaderValue(shader, timeLoc, &totalTime, SHADER_UNIFORM_FLOAT);
    SetShaderValue(shader, mouseLoc, mousePos, SHADER_UNIFORM_VEC2);
    
    // Hot shader reloading
    if (shaderAutoReloading || (IsMouseButtonPressed(MOUSE_LEFT_BUTTON)))
    {
        long currentFragShaderModTime = GetFileModTime(TextFormat(fragShaderFileName, GLSL_VERSION));
        
        // Check if shader file has been modified
        if (currentFragShaderModTime != fragShaderFileModTime)
        {
            // Try reloading updated shader
            Shader updatedShader = LoadShader(0, TextFormat(fragShaderFileName, GLSL_VERSION));
            
            if (updatedShader.id != rlGetShaderDefault().id)      // It was correctly loaded
            {
                UnloadShader(shader);
                shader = updatedShader;
                
                // Get shader locations for required uniforms
                resolutionLoc = GetShaderLocation(shader, "resolution");
                mouseLoc = GetShaderLocation(shader, "mouse");
                timeLoc = GetShaderLocation(shader, "time");
                
                // Reset required uniforms
                SetShaderValue(shader, resolutionLoc, resolution, SHADER_UNIFORM_VEC2);
            }
            
            fragShaderFileModTime = currentFragShaderModTime;
        }
    }
    
    if (IsKeyPressed(KEY_A)) shaderAutoReloading = !shaderAutoReloading;
    //----------------------------------------------------------------------------------

    // Draw
    //----------------------------------------------------------------------------------
    BeginDrawing();

        ClearBackground(RAYWHITE);

        // We only draw a white full-screen rectangle, frame is generated in shader
        BeginShaderMode(shader);
            DrawRectangle(0, 0, screenWidth, screenHeight, WHITE);
        EndShaderMode();

        DrawText(TextFormat("PRESS [A] to TOGGLE SHADER AUTOLOADING: %s", 
                 shaderAutoReloading? "AUTO" : "MANUAL"), 10, 10, 10, shaderAutoReloading? RED : BLACK);
        if (!shaderAutoReloading) DrawText("MOUSE CLICK to SHADER RE-LOADING", 10, 30, 10, BLACK);
        
        DrawText(TextFormat("Shader last modification: %s", asctime(localtime(&fragShaderFileModTime))), 10, 430, 10, BLACK);

    EndDrawing();
    //----------------------------------------------------------------------------------
}
