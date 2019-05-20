/*******************************************************************************************
*
*   raylib [shapes] example - collision area
*
*   This example has been created using raylib 2.5 (www.raylib.com)
*   raylib is licensed under an unmodified zlib/libpng license (View raylib.h for details)
*
*   Copyright (c) 2013-2019 Ramon Santamaria (@raysan5)
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

// NOTE: Textures MUST be loaded after Window initialization (OpenGL context is required)

Rectangle boxA = { 0 };
Rectangle boxB = { 0 };

int boxASpeedX = 4;

Rectangle boxCollision = { 0 };       // Collision rectangle

int screenUpperLimit = 40;      // Top menu limits

static bool pause = false;             // Movement pause
bool collision = false;         // Collision detection

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
    //---------------------------------------------------------
    InitWindow(screenWidth, screenHeight, "raylib [shapes] example - collision area");

    // Box A: Moving box
    boxA = (Rectangle){ 10, GetScreenHeight()/2 - 50, 200, 100 };

    // Box B: Mouse moved box
    boxB = (Rectangle){ GetScreenWidth()/2 - 30, GetScreenHeight()/2 - 30, 60, 60 };

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
    //---------------------------------------------------------
    CloseWindow();        // Close window and OpenGL context
    //----------------------------------------------------------

    return 0;
}

//----------------------------------------------------------------------------------
// Module Functions Definition
//----------------------------------------------------------------------------------
void UpdateDrawFrame(void)
{
    // Update
    //-----------------------------------------------------
    // Move box if not paused
    if (!pause) boxA.x += boxASpeedX;

    // Bounce box on x screen limits
    if (((boxA.x + boxA.width) >= GetScreenWidth()) || (boxA.x <= 0)) boxASpeedX *= -1;

    // Update player-controlled-box (box02)
    boxB.x = GetMouseX() - boxB.width/2;
    boxB.y = GetMouseY() - boxB.height/2;

    // Make sure Box B does not go out of move area limits
    if ((boxB.x + boxB.width) >= GetScreenWidth()) boxB.x = GetScreenWidth() - boxB.width;
    else if (boxB.x <= 0) boxB.x = 0;

    if ((boxB.y + boxB.height) >= GetScreenHeight()) boxB.y = GetScreenHeight() - boxB.height;
    else if (boxB.y <= screenUpperLimit) boxB.y = screenUpperLimit;

    // Check boxes collision
    collision = CheckCollisionRecs(boxA, boxB);

    // Get collision rectangle (only on collision)
    if (collision) boxCollision = GetCollisionRec(boxA, boxB);

    // Pause Box A movement
    if (IsKeyPressed(KEY_SPACE)) pause = !pause;
    //-----------------------------------------------------

    // Draw
    //-----------------------------------------------------
    BeginDrawing();

        ClearBackground(RAYWHITE);

        DrawRectangle(0, 0, screenWidth, screenUpperLimit, collision? RED : BLACK);

        DrawRectangleRec(boxA, GOLD);
        DrawRectangleRec(boxB, BLUE);

        if (collision)
        {
            // Draw collision area
            DrawRectangleRec(boxCollision, LIME);

            // Draw collision message
            DrawText("COLLISION!", GetScreenWidth()/2 - MeasureText("COLLISION!", 20)/2, screenUpperLimit/2 - 10, 20, BLACK);

            // Draw collision area
            DrawText(FormatText("Collision Area: %i", (int)boxCollision.width*(int)boxCollision.height), GetScreenWidth()/2 - 100, screenUpperLimit + 10, 20, BLACK);
        }

        DrawFPS(10, 10);

    EndDrawing();
    //-----------------------------------------------------
}
