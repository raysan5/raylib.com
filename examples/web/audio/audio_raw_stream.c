/*******************************************************************************************
*
*   raylib [audio] example - Raw audio streaming
*
*   NOTE: This example requires OpenAL Soft library installed
*
*   This example has been created using raylib 1.6 (www.raylib.com)
*   raylib is licensed under an unmodified zlib/libpng license (View raylib.h for details)
*
*   Copyright (c) 2015 Ramon Santamaria (@raysan5)
*
********************************************************************************************/

#include "raylib.h"

#if defined(PLATFORM_WEB)
    #include <emscripten/emscripten.h>
#endif

#include <stdlib.h>         // Required for: malloc(), free()
#include <math.h>           // Required for: sinf()
#include <string.h>         // Required for: memcpy()

#define MAX_SAMPLES               512
#define MAX_SAMPLES_PER_UPDATE   4096

//----------------------------------------------------------------------------------
// Global Variables Definition
//----------------------------------------------------------------------------------
const int screenWidth = 800;
const int screenHeight = 450;

AudioStream stream = { 0 };
short *data;
short *writeBuf;

Vector2 mousePosition = { -100.0f, -100.0f };
float frequency = 440.0f;
float oldFrequency = 1.0f;
int readCursor = 0;
int waveLength = 1;
Vector2 position = { 0, 0 };

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
    InitWindow(screenWidth, screenHeight, "raylib [audio] example - raw audio streaming");

    InitAudioDevice();              // Initialize audio device

    // Init raw audio stream (sample rate: 22050, sample size: 16bit-short, channels: 1-mono)
    stream = InitAudioStream(22050, 16, 1);

    // Buffer for the single cycle waveform we are synthesizing
    data = (short *)malloc(sizeof(short)*MAX_SAMPLES);

    // Frame buffer, describing the waveform when repeated over the course of a frame
    writeBuf = (short *)malloc(sizeof(short)*MAX_SAMPLES_PER_UPDATE);

    PlayAudioStream(stream);        // Start processing stream buffer (no data loaded currently)

#if defined(PLATFORM_WEB)
    emscripten_set_main_loop(UpdateDrawFrame, 0, 1);
#else
    SetTargetFPS(30);               // Set our game to run at 30 frames-per-second
    //--------------------------------------------------------------------------------------

    // Main game loop
    while (!WindowShouldClose())    // Detect window close button or ESC key
    {
        UpdateDrawFrame();
    }
#endif

    // De-Initialization
    //--------------------------------------------------------------------------------------
    free(data);                 // Unload sine wave data
    free(writeBuf);             // Unload write buffer

    CloseAudioStream(stream);   // Close raw audio stream and delete buffers from RAM
    CloseAudioDevice();         // Close audio device (music streaming is automatically stopped)

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
    mousePosition = GetMousePosition();

    if (IsMouseButtonDown(MOUSE_LEFT_BUTTON))
    {
        float fp = (float)(mousePosition.y);
        frequency = 40.0f + (float)(fp);
    }

    // Rewrite the sine wave.
    // Compute two cycles to allow the buffer padding, simplifying any modulation, resampling, etc.
    if (frequency != oldFrequency)
    {
        // Compute wavelength. Limit size in both directions.
        int oldWavelength = waveLength;
        waveLength = (int)(22050/frequency);
        if (waveLength > MAX_SAMPLES/2) waveLength = MAX_SAMPLES/2;
        if (waveLength < 1) waveLength = 1;

        // Write sine wave.
        for (int i = 0; i < waveLength*2; i++)
        {
            data[i] = (short)(sinf(((2*PI*(float)i/waveLength)))*32000);
        }

        // Scale read cursor's position to minimize transition artifacts
        readCursor = (int)(readCursor * ((float)waveLength / (float)oldWavelength));
        oldFrequency = frequency;
    }

    // Refill audio stream if required
    if (IsAudioStreamProcessed(stream))
    {
        // Synthesize a buffer that is exactly the requested size
        int writeCursor = 0;

        while (writeCursor < MAX_SAMPLES_PER_UPDATE)
        {
            // Start by trying to write the whole chunk at once
            int writeLength = MAX_SAMPLES_PER_UPDATE-writeCursor;

            // Limit to the maximum readable size
            int readLength = waveLength-readCursor;

            if (writeLength > readLength) writeLength = readLength;

            // Write the slice
            memcpy(writeBuf + writeCursor, data + readCursor, writeLength*sizeof(short));

            // Update cursors and loop audio
            readCursor = (readCursor + writeLength) % waveLength;

            writeCursor += writeLength;
        }

        // Copy finished frame to audio stream
        UpdateAudioStream(stream, writeBuf, MAX_SAMPLES_PER_UPDATE);
    }
    //----------------------------------------------------------------------------------

    // Draw
    //----------------------------------------------------------------------------------
    BeginDrawing();

        ClearBackground(RAYWHITE);

        DrawText(FormatText("sine frequency: %i",(int)frequency), GetScreenWidth() - 220, 10, 20, RED);
        DrawText("click mouse button to change frequency", 10, 10, 20, DARKGRAY);

        // Draw the current buffer state proportionate to the screen
        for (int i = 0; i < screenWidth; i++)
        {
            position.x = i;
            position.y = 250 + 50*data[i*MAX_SAMPLES/screenWidth]/32000;

            DrawPixelV(position, RED);
        }

    EndDrawing();
    //----------------------------------------------------------------------------------
}