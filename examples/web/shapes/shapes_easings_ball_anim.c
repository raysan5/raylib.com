/*******************************************************************************************
*
*   raylib [shapes] example - easings ball anim
*
*   This example has been created using raylib 2.5 (www.raylib.com)
*   raylib is licensed under an unmodified zlib/libpng license (View raylib.h for details)
*
*   Copyright (c) 2014-2019 Ramon Santamaria (@raysan5)
*
********************************************************************************************/

#include "raylib.h"

#include "easings.h"            // Required for easing functions

#if defined(PLATFORM_WEB)
    #include <emscripten/emscripten.h>
#endif

//----------------------------------------------------------------------------------
// Global Variables Definition
//----------------------------------------------------------------------------------
const int screenWidth = 800;
const int screenHeight = 450;

// NOTE: Textures MUST be loaded after Window initialization (OpenGL context is required)

// Ball variable value to be animated with easings
int ballPositionX = -100;
int ballRadius = 20;
float ballAlpha = 0.0f;

int state = 0;
int framesCounter = 0;

//----------------------------------------------------------------------------------
// Module Functions Declaration
//----------------------------------------------------------------------------------
void UpdateDrawFrame(void);     // Update and Draw one frame

//----------------------------------------------------------------------------------
// Main Enry Point
//----------------------------------------------------------------------------------
int main()
{
    // Initialization
    //--------------------------------------------------------------------------------------
    InitWindow(screenWidth, screenHeight, "raylib [shapes] example - easings ball anim");
       
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
    if (state == 0)             // Move ball position X with easing
    {
        framesCounter++;
        ballPositionX = EaseElasticOut(framesCounter, -100, screenWidth/2 + 100, 120);
        
        if (framesCounter >= 120)
        {
            framesCounter = 0;
            state = 1;
        }
    }
    else if (state == 1)        // Increase ball radius with easing
    {
        framesCounter++;
        ballRadius = EaseElasticIn(framesCounter, 20, 500, 200);
        
        if (framesCounter >= 200)
        {
            framesCounter = 0;
            state = 2;
        }
    }
    else if (state == 2)        // Change ball alpha with easing (background color blending)
    {
        framesCounter++;
        ballAlpha = EaseCubicOut(framesCounter, 0.0f, 1.0f, 200);
        
        if (framesCounter >= 200)
        {
            framesCounter = 0;
            state = 3;
        }
    }
    else if (state == 3)        // Reset state to play again
    {
        if (IsKeyPressed(KEY_ENTER)) 
        {
            // Reset required variables to play again
            ballPositionX = -100;
            ballRadius = 20;
            ballAlpha = 0.0f;
            state = 0;
        }
    }
    
    if (IsKeyPressed(KEY_R)) framesCounter = 0;
    //----------------------------------------------------------------------------------

    // Draw
    //----------------------------------------------------------------------------------
    BeginDrawing();

        ClearBackground(RAYWHITE);

        if (state >= 2) DrawRectangle(0, 0, screenWidth, screenHeight, GREEN);
        DrawCircle(ballPositionX, 200, ballRadius, Fade(RED, 1.0f - ballAlpha));
        
        if (state == 3) DrawText("PRESS [ENTER] TO PLAY AGAIN!", 240, 200, 20, BLACK);
        
    EndDrawing();
    //----------------------------------------------------------------------------------
}
