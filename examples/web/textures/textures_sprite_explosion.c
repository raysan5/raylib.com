/*******************************************************************************************
*
*   raylib [textures] example - sprite explosion
*
*   This example has been created using raylib 2.5 (www.raylib.com)
*   raylib is licensed under an unmodified zlib/libpng license (View raylib.h for details)
*
*   Copyright (c) 2019 Anata and Ramon Santamaria (@raysan5)
*
********************************************************************************************/

#include "raylib.h"

#if defined(PLATFORM_WEB)
    #include <emscripten/emscripten.h>
#endif

#define NUM_FRAMES_PER_LINE     5
#define NUM_LINES               5

//----------------------------------------------------------------------------------
// Global Variables Definition
//----------------------------------------------------------------------------------
const int screenWidth = 800;
const int screenHeight = 450;

// NOTE: Textures MUST be loaded after Window initialization (OpenGL context is required)

// Load explosion sound
Sound fxBoom = { 0 };

// Load explosion texture
Texture2D explosion = { 0 };

// Init variables for animation
int frameWidth = 0;
int frameHeight = 0;
int currentFrame = 0;
int currentLine = 0;

Rectangle frameRec = { 0 };
Vector2 position = { 0.0f, 0.0f };

bool active = false;
int framesCounter = 0;

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
    InitWindow(screenWidth, screenHeight, "raylib [textures] example - sprite explosion");

    InitAudioDevice();

    // Load explosion sound
    fxBoom = LoadSound("resources/boom.wav");

    // Load explosion texture
    explosion = LoadTexture("resources/explosion.png");

    // Init variables for animation
    frameWidth = explosion.width/NUM_FRAMES_PER_LINE;   // Sprite one frame rectangle width
    frameHeight = explosion.height/NUM_LINES;   		// Sprite one frame rectangle height

    frameRec = (Rectangle){ 0, 0, frameWidth, frameHeight };

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
    UnloadTexture(explosion);   // Unload texture
    UnloadSound(fxBoom);          // Unload sound

    CloseAudioDevice();

    CloseWindow();              // Close window and OpenGL context
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

    // Check for mouse button pressed and activate explosion (if not active)
    if (IsMouseButtonPressed(MOUSE_LEFT_BUTTON) && !active)
    {
        position = GetMousePosition();
        active = true;

        position.x -= frameWidth/2;
        position.y -= frameHeight/2;

        PlaySound(fxBoom);
    }

    // Compute explosion animation frames
    if (active)
    {
        framesCounter++;

        if (framesCounter > 2)
        {
            currentFrame++;

            if (currentFrame >= NUM_FRAMES_PER_LINE)
            {
                currentFrame = 0;
                currentLine++;

                if (currentLine >= NUM_LINES)
                {
                    currentLine = 0;
                    active = false;
                }
            }

            framesCounter = 0;
        }
    }

    frameRec.x = frameWidth*currentFrame;
    frameRec.y = frameHeight*currentLine;
    //----------------------------------------------------------------------------------

    // Draw
    //----------------------------------------------------------------------------------
    BeginDrawing();

        ClearBackground(RAYWHITE);

        // Draw explosion required frame rectangle
        if (active) DrawTextureRec(explosion, frameRec, position, WHITE);

    EndDrawing();
    //----------------------------------------------------------------------------------
}
