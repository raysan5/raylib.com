/*******************************************************************************************
*
*   raylib [shapes] example - rectangle scaling by mouse
*
*   This example has been created using raylib 2.5 (www.raylib.com)
*   raylib is licensed under an unmodified zlib/libpng license (View raylib.h for details)
*
*   Example contributed by Vlad Adrian (@demizdor) and reviewed by Ramon Santamaria (@raysan5)
*
*   Copyright (c) 2018 Vlad Adrian (@demizdor) and Ramon Santamaria (@raysan5)
*
********************************************************************************************/

#include "raylib.h"

#if defined(PLATFORM_WEB)
    #include <emscripten/emscripten.h>
#endif

#define MOUSE_SCALE_MARK_SIZE   20

//----------------------------------------------------------------------------------
// Global Variables Definition
//----------------------------------------------------------------------------------
const int screenWidth = 800;
const int screenHeight = 450;

// NOTE: Textures MUST be loaded after Window initialization (OpenGL context is required)

Rectangle rec = { 0.0f };

Vector2 mousePosition = { 0.0f };

bool mouseScaleReady = false;
bool mouseScaleMode = false;

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
    InitWindow(screenWidth, screenHeight, "raylib [shapes] example - rectangle scaling mouse");

    rec = (Rectangle){ 100, 100, 200, 80 };

#if defined(PLATFORM_WEB)
    emscripten_set_main_loop(UpdateDrawFrame, 0, 1);
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
    mousePosition = GetMousePosition();

    if (CheckCollisionPointRec(mousePosition, rec) &&
        CheckCollisionPointRec(mousePosition, (Rectangle){ rec.x + rec.width - MOUSE_SCALE_MARK_SIZE, rec.y + rec.height - MOUSE_SCALE_MARK_SIZE, MOUSE_SCALE_MARK_SIZE, MOUSE_SCALE_MARK_SIZE }))
    {
        mouseScaleReady = true;
        if (IsMouseButtonPressed(MOUSE_LEFT_BUTTON)) mouseScaleMode = true;
    }
    else mouseScaleReady = false;

    if (mouseScaleMode)
    {
        mouseScaleReady = true;

        rec.width = (mousePosition.x - rec.x);
        rec.height = (mousePosition.y - rec.y);

        if (rec.width < MOUSE_SCALE_MARK_SIZE) rec.width = MOUSE_SCALE_MARK_SIZE;
        if (rec.height < MOUSE_SCALE_MARK_SIZE) rec.height = MOUSE_SCALE_MARK_SIZE;

        if (IsMouseButtonReleased(MOUSE_LEFT_BUTTON)) mouseScaleMode = false;
    }
    //----------------------------------------------------------------------------------

    // Draw
    //----------------------------------------------------------------------------------
    BeginDrawing();

        ClearBackground(RAYWHITE);

        DrawText("Scale rectangle dragging from bottom-right corner!", 10, 10, 20, GRAY);

        DrawRectangleRec(rec, Fade(GREEN, 0.5f));

        if (mouseScaleReady)
        {
            DrawRectangleLinesEx(rec, 1, RED);
            DrawTriangle((Vector2){ rec.x + rec.width - MOUSE_SCALE_MARK_SIZE, rec.y + rec.height },
                         (Vector2){ rec.x + rec.width, rec.y + rec.height },
                         (Vector2){ rec.x + rec.width, rec.y + rec.height - MOUSE_SCALE_MARK_SIZE }, RED);
        }

    EndDrawing();
    //----------------------------------------------------------------------------------
}
