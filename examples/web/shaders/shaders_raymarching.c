/*******************************************************************************************
*
*   raylib [shaders] example - Raymarching shapes generation
*
*   NOTE: This example requires raylib OpenGL 3.3 or ES2 versions for shaders support,
*         OpenGL 1.1 does not support shaders, recompile raylib to OpenGL 3.3 version.
*
*   NOTE: Shaders used in this example are #version 330 (OpenGL 3.3), to test this example
*         on OpenGL ES 2.0 platforms (Android, Raspberry Pi, HTML5), use #version 100 shaders
*         raylib comes with shaders ready for both versions, check raylib/shaders install folder
*
*   This example has been created using raylib 2.0 (www.raylib.com)
*   raylib is licensed under an unmodified zlib/libpng license (View raylib.h for details)
*
*   Copyright (c) 2018 Ramon Santamaria (@raysan5)
*
********************************************************************************************/

#include "raylib.h"

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
const int screenWidth = 800;
const int screenHeight = 450;

// NOTE: Textures MUST be loaded after Window initialization (OpenGL context is required)

Camera camera = { 0 };
Shader shader = { 0 };

// Shader locations for required uniforms
int viewEyeLoc = 0;
int viewCenterLoc = 0;
int viewUpLoc = 0;
int deltaTimeLoc = 0;
int runTimeLoc = 0;
int resolutionLoc = 0;

float runTime = 0.0f;

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
    const int screenWidth = 800;
    const int screenHeight = 450;

    InitWindow(screenWidth, screenHeight, "raylib [shaders] example - raymarching shapes");

    camera.position = (Vector3){ 2.5f, 2.5f, 3.0f };    // Camera position
    camera.target = (Vector3){ 0.0f, 0.0f, 0.7f };      // Camera looking at point
    camera.up = (Vector3){ 0.0f, 1.0f, 0.0f };          // Camera up vector (rotation towards target)
    camera.fovy = 65.0f;                                // Camera field-of-view Y

    SetCameraMode(camera, CAMERA_FREE);                 // Set camera mode

    // Load raymarching shader
    // NOTE: Defining 0 (NULL) for vertex shader forces usage of internal default vertex shader
    shader = LoadShader(0, TextFormat("resources/shaders/glsl%i/raymarching.fs", GLSL_VERSION));

    // Get shader locations for required uniforms
    viewEyeLoc = GetShaderLocation(shader, "viewEye");
    viewCenterLoc = GetShaderLocation(shader, "viewCenter");
    viewUpLoc = GetShaderLocation(shader, "viewUp");
    deltaTimeLoc = GetShaderLocation(shader, "deltaTime");
    runTimeLoc = GetShaderLocation(shader, "runTime");
    resolutionLoc = GetShaderLocation(shader, "resolution");

    float resolution[2] = { screenWidth, screenHeight };
    SetShaderValue(shader, resolutionLoc, resolution, UNIFORM_VEC2);

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
// Module Functions Definition
//----------------------------------------------------------------------------------
void UpdateDrawFrame(void)
{
    // Update
    //----------------------------------------------------------------------------------
    UpdateCamera(&camera);              // Update camera

    float cameraPos[3] = { camera.position.x, camera.position.y, camera.position.z };
    float cameraTarget[3] = { camera.target.x, camera.target.y, camera.target.z };
    float cameraUp[3] = { camera.up.x, camera.up.y, camera.up.z };

    float deltaTime = GetFrameTime();
    runTime += deltaTime;

    // Set shader required uniform values
    SetShaderValue(shader, viewEyeLoc, cameraPos, UNIFORM_VEC3);
    SetShaderValue(shader, viewCenterLoc, cameraTarget, UNIFORM_VEC3);
    SetShaderValue(shader, viewUpLoc, cameraUp, UNIFORM_VEC3);
    SetShaderValue(shader, deltaTimeLoc, &deltaTime, UNIFORM_FLOAT);
    SetShaderValue(shader, runTimeLoc, &runTime, UNIFORM_FLOAT);
    //----------------------------------------------------------------------------------

    // Draw
    //----------------------------------------------------------------------------------
    BeginDrawing();

        ClearBackground(RAYWHITE);

        // We only draw a white full-screen rectangle,
        // frame is generated in shader using raymarching
        BeginShaderMode(shader);
            DrawRectangle(0, 0, screenWidth, screenHeight, WHITE);
        EndShaderMode();

        DrawText("(c) Raymarching shader by Iñigo Quilez. MIT License.", screenWidth - 280, screenHeight - 20, 10, GRAY);

    EndDrawing();
    //----------------------------------------------------------------------------------
}
