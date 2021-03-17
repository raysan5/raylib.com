/*******************************************************************************************
*
*   raylib [shaders] example - Multiple sample2D with default batch system
*
*   NOTE: This example requires raylib OpenGL 3.3 or ES2 versions for shaders support,
*         OpenGL 1.1 does not support shaders, recompile raylib to OpenGL 3.3 version.
*
*   NOTE: Shaders used in this example are #version 330 (OpenGL 3.3), to test this example
*         on OpenGL ES 2.0 platforms (Android, Raspberry Pi, HTML5), use #version 100 shaders
*         raylib comes with shaders ready for both versions, check raylib/shaders install folder
*
*   This example has been created using raylib 3.5 (www.raylib.com)
*   raylib is licensed under an unmodified zlib/libpng license (View raylib.h for details)
*
*   Copyright (c) 2020 Ramon Santamaria (@raysan5)
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

static Texture texRed = { 0 };
static Texture texBlue = { 0 };

static Shader shader = { 0 };
static int texBlueLoc = 0;
static int dividerLoc = 0;
static float dividerValue = 0.5f;

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
    InitWindow(screenWidth, screenHeight, "raylib - multiple sample2D");

    Image imRed = GenImageColor(800, 450, (Color){ 255, 0, 0, 255 });
    texRed = LoadTextureFromImage(imRed);
    UnloadImage(imRed);

    Image imBlue = GenImageColor(800, 450, (Color){ 0, 0, 255, 255 });
    texBlue = LoadTextureFromImage(imBlue);
    UnloadImage(imBlue);

    shader = LoadShader(0, TextFormat("resources/shaders/glsl%i/color_mix.fs", GLSL_VERSION));
    
    // Get an additional sampler2D location to be enabled on drawing
    texBlueLoc = GetShaderLocation(shader, "texture1");
    
    // Get shader uniform for divider
    dividerLoc = GetShaderLocation(shader, "divider");

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
    UnloadShader(shader);       // Unload shader
    UnloadTexture(texRed);      // Unload texture
    UnloadTexture(texBlue);     // Unload texture

    CloseWindow();              // Close window and OpenGL context
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
    if (IsKeyDown(KEY_RIGHT)) dividerValue += 0.01f;
    else if (IsKeyDown(KEY_LEFT)) dividerValue -= 0.01f;
    
    if (dividerValue < 0.0f) dividerValue = 0.0f;
    else if (dividerValue > 1.0f) dividerValue = 1.0f;
    
    SetShaderValue(shader, dividerLoc, &dividerValue, SHADER_UNIFORM_FLOAT);
    //----------------------------------------------------------------------------------
    
    // Draw
    //----------------------------------------------------------------------------------
    BeginDrawing();
    
        ClearBackground(RAYWHITE);

        BeginShaderMode(shader);
        
            // WARNING: Additional samplers are enabled for all draw calls in the batch,
            // EndShaderMode() forces batch drawing and consequently resets active textures
            // to let other sampler2D to be activated on consequent drawings (if required)
            SetShaderValueTexture(shader, texBlueLoc, texBlue);
        
            // We are drawing texRed using default sampler2D texture0 but
            // an additional texture units is enabled for texBlue (sampler2D texture1)
            DrawTexture(texRed, 0, 0, WHITE);
            
        EndShaderMode();
        
        DrawText("Use KEY_LEFT/KEY_RIGHT to move texture mixing in shader!", 80, GetScreenHeight() - 40, 20, RAYWHITE);
        
    EndDrawing();
    //----------------------------------------------------------------------------------
}