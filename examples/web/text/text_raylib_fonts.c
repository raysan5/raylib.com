/*******************************************************************************************
*
*   raylib [core] example - raylib bitmap font (rbmf) loading and usage (adapted for HTML5 platform)
*
*   This example has been created using raylib 1.3 (www.raylib.com)
*   raylib is licensed under an unmodified zlib/libpng license (View raylib.h for details)
*
*   Copyright (c) 2015 Ramon Santamaria (@raysan5)
*
********************************************************************************************/

#include "raylib.h"

#if defined(PLATFORM_WEB)
    #include <emscripten/emscripten.h>
#endif

#define MAX_FONTS   8

//----------------------------------------------------------------------------------
// Global Variables Definition
//----------------------------------------------------------------------------------
const int screenWidth = 800;
const int screenHeight = 450;

Font fonts[MAX_FONTS] = { 0 };
const int spacings[MAX_FONTS] = { 2, 4, 8, 4, 3, 4, 4, 1 };
Vector2 positions[MAX_FONTS] = { 0 };

Color colors[MAX_FONTS] = { MAROON, ORANGE, DARKGREEN, DARKBLUE, DARKPURPLE, LIME, GOLD, RED };

const char *messages[MAX_FONTS] = { 
   "ALAGARD FONT designed by Hewett Tsoi",
   "PIXELPLAY FONT designed by Aleksander Shevchuk",
   "MECHA FONT designed by Captain Falcon",
   "SETBACK FONT designed by Brian Kent (AEnigma)",
   "ROMULUS FONT designed by Hewett Tsoi",
   "PIXANTIQUA FONT designed by Gerhard Grossmann",
   "ALPHA_BETA FONT designed by Brian Kent (AEnigma)",
   "JUPITER_CRASH FONT designed by Brian Kent (AEnigma)" 
};

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
    InitWindow(screenWidth, screenHeight, "raylib [text] example - raylib fonts");

    fonts[0] = LoadFont("resources/fonts/alagard.png");
    fonts[1] = LoadFont("resources/fonts/pixelplay.png");
    fonts[2] = LoadFont("resources/fonts/mecha.png");
    fonts[3] = LoadFont("resources/fonts/setback.png");
    fonts[4] = LoadFont("resources/fonts/romulus.png");
    fonts[5] = LoadFont("resources/fonts/pixantiqua.png");
    fonts[6] = LoadFont("resources/fonts/alpha_beta.png");
    fonts[7] = LoadFont("resources/fonts/jupiter_crash.png");

    for (int i = 0; i < MAX_FONTS; i++)
    {
        positions[i].x = screenWidth/2 - MeasureTextEx(fonts[i], messages[i], fonts[i].baseSize*2, spacings[i]).x/2;
        positions[i].y = 60 + fonts[i].baseSize + 45*i;
    }

    // Small Y position corrections
    positions[3].y += 8;
    positions[4].y += 2;
    positions[7].y -= 8;

#if defined(PLATFORM_WEB)
    emscripten_set_main_loop(UpdateDrawFrame, 60, 1);
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
    for (int i = 0; i < MAX_FONTS; i++) UnloadFont(fonts[i]);   // Fonts unloading

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
    // TODO: Update your variables here
    //----------------------------------------------------------------------------------

    // Draw
    //----------------------------------------------------------------------------------
    BeginDrawing();

        ClearBackground(RAYWHITE);

        DrawText("free fonts included with raylib", 250, 20, 20, DARKGRAY);
        DrawLine(220, 50, 590, 50, DARKGRAY);

        for (int i = 0; i < MAX_FONTS; i++)
        {
            DrawTextEx(fonts[i], messages[i], positions[i], fonts[i].baseSize*2, spacings[i], colors[i]);
        }

    EndDrawing();
    //----------------------------------------------------------------------------------
}