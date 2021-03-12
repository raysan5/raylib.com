/*******************************************************************************************
*
*   raylib [shapes] example - draw ring (with gui options)
*
*   This example has been created using raylib 2.6 (www.raylib.com)
*   raylib is licensed under an unmodified zlib/libpng license (View raylib.h for details)
*
*   Example contributed by Vlad Adrian (@demizdor) and reviewed by Ramon Santamaria (@raysan5)
*
*   Copyright (c) 2018-2020 Vlad Adrian (@demizdor) and Ramon Santamaria (@raysan5)
*
********************************************************************************************/

#include <raylib.h>

#define RAYGUI_IMPLEMENTATION
#define RAYGUI_SUPPORT_ICONS
#include "raygui.h"                 // Required for GUI controls

#if defined(PLATFORM_WEB)
    #include <emscripten/emscripten.h>
#endif

//----------------------------------------------------------------------------------
// Global Variables Definition
//----------------------------------------------------------------------------------
const int screenWidth = 800;
const int screenHeight = 450;

// NOTE: Textures MUST be loaded after Window initialization (OpenGL context is required)

Vector2 center = { 0 };

float innerRadius = 80.0f;
float outerRadius = 190.0f;

int startAngle = 0;
int endAngle = 360;
int segments = 0;

bool drawRing = true;
bool drawRingLines = false;
bool drawCircleLines = false;

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
    InitWindow(screenWidth, screenHeight, "raylib [shapes] example - draw ring");

    center = (Vector2){ (GetScreenWidth() - 300)/2, GetScreenHeight()/2 };

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
    // NOTE: All variables update happens inside GUI control functions
    //----------------------------------------------------------------------------------

    // Draw
    //----------------------------------------------------------------------------------
    BeginDrawing();

        ClearBackground(RAYWHITE);

        DrawLine(500, 0, 500, GetScreenHeight(), Fade(LIGHTGRAY, 0.6f));
        DrawRectangle(500, 0, GetScreenWidth() - 500, GetScreenHeight(), Fade(LIGHTGRAY, 0.3f));

        if (drawRing) DrawRing(center, innerRadius, outerRadius, startAngle, endAngle, segments, Fade(MAROON, 0.3));
        if (drawRingLines) DrawRingLines(center, innerRadius, outerRadius, startAngle, endAngle, segments, Fade(BLACK, 0.4));
        if (drawCircleLines) DrawCircleSectorLines(center, outerRadius, startAngle, endAngle, segments, Fade(BLACK, 0.4));

        // Draw GUI controls
        //------------------------------------------------------------------------------
        startAngle = GuiSliderBar((Rectangle){ 600, 40, 120, 20 }, "StartAngle", NULL, startAngle, -450, 450);
        endAngle = GuiSliderBar((Rectangle){ 600, 70, 120, 20 }, "EndAngle", NULL, endAngle, -450, 450);

        innerRadius = GuiSliderBar((Rectangle){ 600, 140, 120, 20 }, "InnerRadius", NULL, innerRadius, 0, 100);
        outerRadius = GuiSliderBar((Rectangle){ 600, 170, 120, 20 }, "OuterRadius", NULL, outerRadius, 0, 200);

        segments = GuiSliderBar((Rectangle){ 600, 240, 120, 20 }, "Segments", NULL, segments, 0, 100);

        drawRing = GuiCheckBox((Rectangle){ 600, 320, 20, 20 }, "Draw Ring", drawRing);
        drawRingLines = GuiCheckBox((Rectangle){ 600, 350, 20, 20 }, "Draw RingLines", drawRingLines);
        drawCircleLines = GuiCheckBox((Rectangle){ 600, 380, 20, 20 }, "Draw CircleLines", drawCircleLines);
        //------------------------------------------------------------------------------

        DrawText(TextFormat("MODE: %s", (segments >= 4)? "MANUAL" : "AUTO"), 600, 270, 10, (segments >= 4)? MAROON : DARKGRAY);

        DrawFPS(10, 10);

    EndDrawing();
    //----------------------------------------------------------------------------------
}
