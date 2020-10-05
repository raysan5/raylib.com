/*******************************************************************************************
*
*   raylib [shapes] example - following eyes
*
*   This example has been created using raylib 2.5 (www.raylib.com)
*   raylib is licensed under an unmodified zlib/libpng license (View raylib.h for details)
*
*   Copyright (c) 2013-2019 Ramon Santamaria (@raysan5)
*
********************************************************************************************/

#include "raylib.h"

#include <math.h>       // Required for: atan2f()

#if defined(PLATFORM_WEB)
    #include <emscripten/emscripten.h>
#endif

//----------------------------------------------------------------------------------
// Global Variables Definition
//----------------------------------------------------------------------------------
const int screenWidth = 800;
const int screenHeight = 450;

// NOTE: Textures MUST be loaded after Window initialization (OpenGL context is required)

Vector2 scleraLeftPosition = { 0 };
Vector2 scleraRightPosition = { 0 };
float scleraRadius = 80;

Vector2 irisLeftPosition = { 0 };
Vector2 irisRightPosition = { 0 };
float irisRadius = 24;

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
    InitWindow(screenWidth, screenHeight, "raylib [shapes] example - following eyes");

    scleraLeftPosition = (Vector2){ GetScreenWidth()/2 - 100, GetScreenHeight()/2 };
    scleraRightPosition = (Vector2){ GetScreenWidth()/2 + 100, GetScreenHeight()/2 };

    irisLeftPosition = (Vector2){ GetScreenWidth()/2 - 100, GetScreenHeight()/2 };
    irisRightPosition = (Vector2){ GetScreenWidth()/2 + 100, GetScreenHeight()/2};

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
    irisLeftPosition = GetMousePosition();
    irisRightPosition = GetMousePosition();

    float angle = 0.0f;
    float dx, dy, dxx, dyy;

    // Check not inside the left eye sclera
    if (!CheckCollisionPointCircle(irisLeftPosition, scleraLeftPosition, scleraRadius - 20))
    {
        dx = irisLeftPosition.x - scleraLeftPosition.x;
        dy = irisLeftPosition.y - scleraLeftPosition.y;

        angle = atan2f(dy, dx);

        dxx = (scleraRadius - irisRadius)*cosf(angle);
        dyy = (scleraRadius - irisRadius)*sinf(angle);

        irisLeftPosition.x = scleraLeftPosition.x + dxx;
        irisLeftPosition.y = scleraLeftPosition.y + dyy;
    }

    // Check not inside the right eye sclera
    if (!CheckCollisionPointCircle(irisRightPosition, scleraRightPosition, scleraRadius - 20))
    {
        dx = irisRightPosition.x - scleraRightPosition.x;
        dy = irisRightPosition.y - scleraRightPosition.y;

        angle = atan2f(dy, dx);

        dxx = (scleraRadius - irisRadius)*cosf(angle);
        dyy = (scleraRadius - irisRadius)*sinf(angle);

        irisRightPosition.x = scleraRightPosition.x + dxx;
        irisRightPosition.y = scleraRightPosition.y + dyy;
    }
    //----------------------------------------------------------------------------------

    // Draw
    //----------------------------------------------------------------------------------
    BeginDrawing();

        ClearBackground(RAYWHITE);

        DrawCircleV(scleraLeftPosition, scleraRadius, LIGHTGRAY);
        DrawCircleV(irisLeftPosition, irisRadius, BROWN);
        DrawCircleV(irisLeftPosition, 10, BLACK);

        DrawCircleV(scleraRightPosition, scleraRadius, LIGHTGRAY);
        DrawCircleV(irisRightPosition, irisRadius, DARKGREEN);
        DrawCircleV(irisRightPosition, 10, BLACK);

        DrawFPS(10, 10);

    EndDrawing();
    //----------------------------------------------------------------------------------
}
