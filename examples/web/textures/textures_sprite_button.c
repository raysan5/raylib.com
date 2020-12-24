/*******************************************************************************************
*
*   raylib [textures] example - sprite button
*
*   This example has been created using raylib 2.5 (www.raylib.com)
*   raylib is licensed under an unmodified zlib/libpng license (View raylib.h for details)
*
*   Copyright (c) 2019 Ramon Santamaria (@raysan5)
*
********************************************************************************************/

#include "raylib.h"

#if defined(PLATFORM_WEB)
    #include <emscripten/emscripten.h>
#endif

#define NUM_FRAMES  3       // Number of frames (rectangles) for the button sprite texture

//----------------------------------------------------------------------------------
// Global Variables Definition
//----------------------------------------------------------------------------------
const int screenWidth = 800;
const int screenHeight = 450;

// NOTE: Textures MUST be loaded after Window initialization (OpenGL context is required)

Sound fxButton = { 0 };
Texture2D button = { 0 };

// Define frame rectangle for drawing
int frameHeight = 0;
Rectangle sourceRec = { 0 };

// Define button bounds on screen
Rectangle btnBounds = { 0 };

int btnState = 0;               // Button state: 0-NORMAL, 1-MOUSE_HOVER, 2-PRESSED
bool btnAction = false;         // Button action should be activated

Vector2 mousePoint = { 0.0f, 0.0f };

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
    InitWindow(screenWidth, screenHeight, "raylib [textures] example - sprite button");

    InitAudioDevice();      // Initialize audio device

    fxButton = LoadSound("resources/buttonfx.wav");   // Load button sound
    button = LoadTexture("resources/button.png"); // Load button texture

    // Define frame rectangle for drawing
    frameHeight = button.height/NUM_FRAMES;
    sourceRec = (Rectangle){ 0, 0, button.width, frameHeight };

    // Define button bounds on screen
    btnBounds = (Rectangle){ screenWidth/2 - button.width/2, screenHeight/2 - button.height/NUM_FRAMES/2, button.width, frameHeight };

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
    UnloadTexture(button);  // Unload button texture
    UnloadSound(fxButton);  // Unload sound

    CloseAudioDevice();     // Close audio device

    CloseWindow();          // Close window and OpenGL context
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
    mousePoint = GetMousePosition();
    btnAction = false;

    // Check button state
    if (CheckCollisionPointRec(mousePoint, btnBounds))
    {
        if (IsMouseButtonDown(MOUSE_LEFT_BUTTON)) btnState = 2;
        else btnState = 1;

        if (IsMouseButtonReleased(MOUSE_LEFT_BUTTON)) btnAction = true;
    }
    else btnState = 0;

    if (btnAction)
    {
        PlaySound(fxButton);

        // TODO: Any desired action
    }

    // Calculate button frame rectangle to draw depending on button state
    sourceRec.y = btnState*frameHeight;
    //----------------------------------------------------------------------------------

    // Draw
    //----------------------------------------------------------------------------------
    BeginDrawing();

        ClearBackground(RAYWHITE);

        DrawTextureRec(button, sourceRec, (Vector2){ btnBounds.x, btnBounds.y }, WHITE); // Draw button frame

    EndDrawing();
    //----------------------------------------------------------------------------------
}
