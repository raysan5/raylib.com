/*******************************************************************************************
*
*   raylib [audio] example - Module playing (streaming)
*
*   NOTE: This example requires OpenAL Soft library installed
*
*   This example has been created using raylib 1.5 (www.raylib.com)
*   raylib is licensed under an unmodified zlib/libpng license (View raylib.h for details)
*
*   Copyright (c) 2016 Ramon Santamaria (@raysan5)
*
********************************************************************************************/

#include "raylib.h"

#if defined(PLATFORM_WEB)
    #include <emscripten/emscripten.h>
#endif

#define MAX_CIRCLES  64

//----------------------------------------------------------------------------------
// Types and Structures Definition
//----------------------------------------------------------------------------------
typedef struct {
    Vector2 position;
    float radius;
    float alpha;
    float speed;
    Color color;
} CircleWave;

//----------------------------------------------------------------------------------
// Global Variables Definition
//----------------------------------------------------------------------------------
const int screenWidth = 800;
const int screenHeight = 450;

Color colors[14] = { ORANGE, RED, GOLD, LIME, BLUE, VIOLET, BROWN, LIGHTGRAY, PINK,
                     YELLOW, GREEN, SKYBLUE, PURPLE, BEIGE };

// Creates ome circles for visual effect
CircleWave circles[MAX_CIRCLES];

Music music = { 0 };

float timePlayed = 0.0f;
static bool pause = false;
float pitch = 1.0f;

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
    InitWindow(screenWidth, screenHeight, "raylib [audio] example - module playing (streaming)");

    InitAudioDevice();              // Initialize audio device

    for (int i = MAX_CIRCLES - 1; i >= 0; i--)
    {
        circles[i].alpha = 0.0f;
        circles[i].radius = GetRandomValue(10, 40);
        circles[i].position.x = GetRandomValue(circles[i].radius, screenWidth - circles[i].radius);
        circles[i].position.y = GetRandomValue(circles[i].radius, screenHeight - circles[i].radius);
        circles[i].speed = (float)GetRandomValue(1, 100)/2000.0f;
        circles[i].color = colors[GetRandomValue(0, 13)];
    }

    music = LoadMusicStream("resources/mini1111.xm");
    music.looping = false;

    PlayMusicStream(music);

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
    UnloadMusicStream(music);          // Unload music stream buffers from RAM

    CloseAudioDevice();             // Close audio device (music streaming is automatically stopped)

    CloseWindow();                  // Close window and OpenGL context
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
    UpdateMusicStream(music);        // Update music buffer with new stream data

    // Restart music playing (stop and play)
    if (IsKeyPressed(KEY_SPACE))
    {
        StopMusicStream(music);
        PlayMusicStream(music);
    }

    // Pause/Resume music playing
    if (IsKeyPressed(KEY_P))
    {
        pause = !pause;

        if (pause) PauseMusicStream(music);
        else ResumeMusicStream(music);
    }

    if (IsKeyDown(KEY_DOWN)) pitch -= 0.01f;
    else if (IsKeyDown(KEY_UP)) pitch += 0.01f;
        
    SetMusicPitch(music, pitch);

    // Get timePlayed scaled to bar dimensions
    timePlayed = GetMusicTimePlayed(music)/GetMusicTimeLength(music)*(screenWidth - 40);

    // Color circles animation
    for (int i = MAX_CIRCLES - 1; (i >= 0) && !pause; i--)
    {
        circles[i].alpha += circles[i].speed;
        circles[i].radius += circles[i].speed*10.0f;

        if (circles[i].alpha > 1.0f) circles[i].speed *= -1;

        if (circles[i].alpha <= 0.0f)
        {
            circles[i].alpha = 0.0f;
            circles[i].radius = GetRandomValue(10, 40);
            circles[i].position.x = GetRandomValue(circles[i].radius, screenWidth - circles[i].radius);
            circles[i].position.y = GetRandomValue(circles[i].radius, screenHeight - circles[i].radius);
            circles[i].color = colors[GetRandomValue(0, 13)];
            circles[i].speed = (float)GetRandomValue(1, 100)/2000.0f;
        }
    }
    //----------------------------------------------------------------------------------

    // Draw
    //----------------------------------------------------------------------------------
    BeginDrawing();

        ClearBackground(RAYWHITE);

        for (int i = MAX_CIRCLES - 1; i >= 0; i--)
        {
            DrawCircleV(circles[i].position, circles[i].radius, Fade(circles[i].color, circles[i].alpha));
        }

        // Draw time bar
        DrawRectangle(20, screenHeight - 20 - 12, screenWidth - 40, 12, LIGHTGRAY);
        DrawRectangle(20, screenHeight - 20 - 12, (int)timePlayed, 12, MAROON);
        DrawRectangleLines(20, screenHeight - 20 - 12, screenWidth - 40, 12, GRAY);

    EndDrawing();
    //----------------------------------------------------------------------------------
}