/*******************************************************************************************
*
*   raylib [models] example - first person maze
*
*   This example has been created using raylib 2.5 (www.raylib.com)
*   raylib is licensed under an unmodified zlib/libpng license (View raylib.h for details)
*
*   Copyright (c) 2019 Ramon Santamaria (@raysan5)
*
********************************************************************************************/

#include "raylib.h"

#include <stdlib.h>           // Required for: free()

#if defined(PLATFORM_WEB)
    #include <emscripten/emscripten.h>
#endif

//----------------------------------------------------------------------------------
// Global Variables Definition
//----------------------------------------------------------------------------------
const int screenWidth = 800;
const int screenHeight = 450;

// NOTE: Textures MUST be loaded after Window initialization (OpenGL context is required)

Camera camera = { 0 };

Model model = { 0 };
Texture2D cubicmap = { 0 };
Texture2D texture = { 0 };

Color *mapPixels = NULL;

Vector3 mapPosition = { -16.0f, 0.0f, -8.0f };  // Set model position
Vector3 playerPosition = { 0 };

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
    InitWindow(screenWidth, screenHeight, "raylib [models] example - first person maze");

    // Define the camera to look into our 3d world
    camera = (Camera){{ 0.2f, 0.4f, 0.2f }, { 0.0f, 0.0f, 0.0f }, { 0.0f, 1.0f, 0.0f }, 45.0f, 0 };

    Image imMap = LoadImage("resources/cubicmap.png");  // Load cubicmap image (RAM)
    cubicmap = LoadTextureFromImage(imMap);             // Convert image to texture to display (VRAM)
    Mesh mesh = GenMeshCubicmap(imMap, (Vector3){ 1.0f, 1.0f, 1.0f });
    model = LoadModelFromMesh(mesh);

    // NOTE: By default each cube is mapped to one part of texture atlas
    texture = LoadTexture("resources/cubicmap_atlas.png");    // Load map texture
    model.materials[0].maps[MAP_DIFFUSE].texture = texture;             // Set map diffuse texture

    // Get map image data to be used for collision detection
    mapPixels = GetImageData(imMap);
    UnloadImage(imMap);             // Unload image from RAM

    playerPosition = camera.position;               // Set player position

    SetCameraMode(camera, CAMERA_FIRST_PERSON);     // Set camera mode

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
    free(mapPixels);            // Unload color array

    UnloadTexture(cubicmap);    // Unload cubicmap texture
    UnloadTexture(texture);     // Unload map texture
    UnloadModel(model);         // Unload map model

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
    Vector3 oldCamPos = camera.position;    // Store old camera position

    UpdateCamera(&camera);      // Update camera

    // Check player collision (we simplify to 2D collision detection)
    Vector2 playerPos = { camera.position.x, camera.position.z };
    float playerRadius = 0.1f;  // Collision radius (player is modelled as a cilinder for collision)

    int playerCellX = (int)(playerPos.x - mapPosition.x + 0.5f);
    int playerCellY = (int)(playerPos.y - mapPosition.z + 0.5f);

    // Out-of-limits security check
    if (playerCellX < 0) playerCellX = 0;
    else if (playerCellX >= cubicmap.width) playerCellX = cubicmap.width - 1;

    if (playerCellY < 0) playerCellY = 0;
    else if (playerCellY >= cubicmap.height) playerCellY = cubicmap.height - 1;

    // Check map collisions using image data and player position
    // TODO: Improvement: Just check player surrounding cells for collision
    for (int y = 0; y < cubicmap.height; y++)
    {
        for (int x = 0; x < cubicmap.width; x++)
        {
            if ((mapPixels[y*cubicmap.width + x].r == 255) &&       // Collision: white pixel, only check R channel
                (CheckCollisionCircleRec(playerPos, playerRadius,
                (Rectangle){ mapPosition.x - 0.5f + x*1.0f, mapPosition.z - 0.5f + y*1.0f, 1.0f, 1.0f })))
            {
                // Collision detected, reset camera position
                camera.position = oldCamPos;
            }
        }
    }
    //----------------------------------------------------------------------------------

    // Draw
    //----------------------------------------------------------------------------------
    BeginDrawing();

        ClearBackground(RAYWHITE);

        BeginMode3D(camera);

            DrawModel(model, mapPosition, 1.0f, WHITE);                     // Draw maze map
            //DrawCubeV(playerPosition, (Vector3){ 0.2f, 0.4f, 0.2f }, RED);  // Draw player

        EndMode3D();

        DrawTextureEx(cubicmap, (Vector2){ GetScreenWidth() - cubicmap.width*4 - 20, 20 }, 0.0f, 4.0f, WHITE);
        DrawRectangleLines(GetScreenWidth() - cubicmap.width*4 - 20, 20, cubicmap.width*4, cubicmap.height*4, GREEN);

        // Draw player position radar
        DrawRectangle(GetScreenWidth() - cubicmap.width*4 - 20 + playerCellX*4, 20 + playerCellY*4, 4, 4, RED);

        DrawFPS(10, 10);

    EndDrawing();
    //----------------------------------------------------------------------------------
}
