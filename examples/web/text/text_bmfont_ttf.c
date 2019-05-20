/*******************************************************************************************
*
*   raylib [text] example - BMFont and TTF Fonts loading (adapted for HTML5 platform)
*
*   This example has been created using raylib 1.4 (www.raylib.com)
*   raylib is licensed under an unmodified zlib/libpng license (View raylib.h for details)
*
*   Copyright (c) 2016 Ramon Santamaria (@raysan5)
*
********************************************************************************************/

#include "raylib.h"

#if defined(PLATFORM_WEB)
    #include <emscripten/emscripten.h>
#endif

//----------------------------------------------------------------------------------
// Global Variables Definition
//----------------------------------------------------------------------------------
const int screenWidth = 800;
const int screenHeight = 450;

// Define characters to draw
// NOTE: raylib supports UTF-8 encoding, following list is actually codified as UTF8 internally
const char msg[256] = "!\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHI\nJKLMNOPQRSTUVWXYZ[]^_`abcdefghijklmn\nopqrstuvwxyz{|}~¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓ\nÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷\nøùúûüýþÿ";

// NOTE: Textures/Fonts MUST be loaded after Window initialization (OpenGL context is required)
Font fontBm = { 0 };      // BMFont (AngelCode)
Font fontTtf = { 0 };     // TTF font

Vector2 fontPosition = { 0.0f };

bool useTtf = false;

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
    InitWindow(screenWidth, screenHeight, "raylib [text] example - bmfont and ttf sprite fonts loading");

    // BMFont (AngelCode) : Font data and image atlas have been generated using external program
    fontBm = LoadFont("resources/pixantiqua.fnt");

    // TTF font : Font data and atlas are generated directly from TTF
    // NOTE: We define a font base size of 32 pixels tall and up-to 250 characters
    fontTtf = LoadFontEx("resources/pixantiqua.ttf", 32, 0, 250);

    fontPosition.x = screenWidth/2 - MeasureTextEx(fontBm, msg, fontBm.baseSize, 0).x/2;
    fontPosition.y = screenHeight/2 - fontBm.baseSize/2 - 80;

#if defined(PLATFORM_WEB)
    emscripten_set_main_loop(UpdateDrawFrame, 0, 1);
#else
    SetTargetFPS(60);   // Set our game to run at 60 frames-per-second
    //--------------------------------------------------------------------------------------

    // Main game loop
    while (!WindowShouldClose())    // Detect window close button or ESC key
    {
        UpdateDrawFrame();
    }
#endif

    // De-Initialization
    //--------------------------------------------------------------------------------------
    UnloadFont(fontBm);     // AngelCode Font unloading
    UnloadFont(fontTtf);    // TTF Font unloading

    CloseWindow();        // Close window and OpenGL context
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
    if (IsKeyDown(KEY_S)) useTtf = true;
    else useTtf = false;
    //----------------------------------------------------------------------------------

    // Draw
    //----------------------------------------------------------------------------------
    BeginDrawing();

        ClearBackground(RAYWHITE);

        DrawText("Press S KEY to use TTF generated font", 20, 20, 20, LIGHTGRAY);

        if (!useTtf)
        {
            DrawTextEx(fontBm, msg, (Vector2){ 20.0f, 100.0f }, fontBm.baseSize, 2, MAROON);
            DrawText("Using BMFont (Angelcode) imported", 20, GetScreenHeight() - 30, 20, GRAY);
        }
        else
        {
            DrawTextEx(fontTtf, msg, (Vector2){ 20.0f, 100.0f }, fontTtf.baseSize, 2, LIME);
            DrawText("Using TTF font generated", 20, GetScreenHeight() - 30, 20, GRAY);
        }

    EndDrawing();
    //----------------------------------------------------------------------------------
}