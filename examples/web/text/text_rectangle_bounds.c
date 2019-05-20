/*******************************************************************************************
*
*   raylib [text] example - Draw text inside a rectangle
*
*   This example has been created using raylib 2.3 (www.raylib.com)
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

//----------------------------------------------------------------------------------
// Global Variables Definition
//----------------------------------------------------------------------------------
const int screenWidth = 800;
const int screenHeight = 450;

// NOTE: Textures MUST be loaded after Window initialization (OpenGL context is required)

char text[] = "Text cannot escape\tthis container\t...word wrap also works when active so here's\
a long text for testing.\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod\
tempor incididunt ut labore et dolore magna aliqua. Nec ullamcorper sit amet risus nullam eget felis eget.";

bool resizing = false;
bool wordWrap = true;

Rectangle container = { 0 };
Rectangle resizer = { 0 };

// Minimum width and heigh for the container rectangle
int minWidth = 60;
int minHeight = 60;
int maxWidth = 0;
int maxHeight = 0;

Vector2 lastMouse = { 0, 0 };   // Stores last mouse coordinates
Color borderColor = MAROON;     // Container border color
Font font = { 0 };

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
    InitWindow(screenWidth, screenHeight, "raylib [text] example - draw text inside a rectangle");

    container = (Rectangle){ 25, 25, screenWidth - 50, screenHeight - 250};
    resizer = (Rectangle){ container.x + container.width - 17, container.y + container.height - 17, 14, 14 };

    maxWidth = screenWidth - 50;
    maxHeight = screenHeight - 160;

    font = GetFontDefault();   // Get default system font

#if defined(PLATFORM_WEB)
    emscripten_set_main_loop(UpdateDrawFrame, 0, 1);
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
    if (IsKeyPressed(KEY_SPACE)) wordWrap = !wordWrap;

    Vector2 mouse = GetMousePosition();

    // Check if the mouse is inside the container and toggle border color
    if (CheckCollisionPointRec(mouse, container)) borderColor = Fade(MAROON, 0.4f);
    else if (!resizing) borderColor = MAROON;

    // Container resizing logic
    if (resizing)
    {
        if (IsMouseButtonReleased(MOUSE_LEFT_BUTTON)) resizing = false;

        int width = container.width + (mouse.x - lastMouse.x);
        container.width = (width > minWidth)? ((width < maxWidth)? width : maxWidth) : minWidth;

        int height = container.height + (mouse.y - lastMouse.y);
        container.height = (height > minHeight)? ((height < maxHeight)? height : maxHeight) : minHeight;
    }
    else
    {
        // Check if we're resizing
        if (IsMouseButtonDown(MOUSE_LEFT_BUTTON) && CheckCollisionPointRec(mouse, resizer)) resizing = true;
    }

    // Move resizer rectangle properly
    resizer.x = container.x + container.width - 17;
    resizer.y = container.y + container.height - 17;

    lastMouse = mouse; // Update mouse
    //----------------------------------------------------------------------------------

    // Draw
    //----------------------------------------------------------------------------------
    BeginDrawing();

        ClearBackground(RAYWHITE);

        DrawRectangleLinesEx(container, 3, borderColor); // Draw container border

        // Draw text in container (add some padding)
        DrawTextRec(font, text,
                   (Rectangle){ container.x + 4, container.y + 4, container.width - 4, container.height - 4 },
                   20.0f, 2.0f, wordWrap, GRAY);

        DrawRectangleRec(resizer, borderColor);         // Draw the resize box

        // Draw info
        DrawText("Word Wrap: ", 313, screenHeight-115, 20, BLACK);
        if (wordWrap) DrawText("ON", 447, screenHeight - 115, 20, RED);
        else DrawText("OFF", 447, screenHeight - 115, 20, BLACK);
        DrawText("Press [SPACE] to toggle word wrap", 218, screenHeight - 91, 20, GRAY);

        DrawRectangle(0, screenHeight - 54, screenWidth, 54, GRAY);
        DrawText("Click hold & drag the    to resize the container", 155, screenHeight - 38, 20, RAYWHITE);
        DrawRectangleRec((Rectangle){ 382, screenHeight - 34, 12, 12 }, MAROON);

    EndDrawing();
    //----------------------------------------------------------------------------------
}
