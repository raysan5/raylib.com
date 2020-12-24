/*******************************************************************************************
*
*   raylib [models] example - Skybox loading and drawing
*
*   This example has been created using raylib 1.8 (www.raylib.com)
*   raylib is licensed under an unmodified zlib/libpng license (View raylib.h for details)
*
*   Copyright (c) 2017 Ramon Santamaria (@raysan5)
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

// Define the camera to look into our 3d world
Camera camera = {{ 1.0f, 1.0f, 1.0f }, { 0.0f, 0.0f, 0.0f }, { 0.0f, 1.0f, 0.0f }, 45.0f };

Model skybox = { 0 };
Shader shdrCubemap = { 0 };
Texture2D panorama = { 0 };

char panoFileName[256] = { 0 };

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
    InitWindow(screenWidth, screenHeight, "raylib [models] example - skybox loading and drawing");

    // Load skybox model
    Mesh cube = GenMeshCube(1.0f, 1.0f, 1.0f);
    skybox = LoadModelFromMesh(cube);

    // Load skybox shader and set required locations
    // NOTE: Some locations are automatically set at shader loading
#if defined(PLATFORM_DESKTOP)
    skybox.materials[0].shader = LoadShader("resources/shaders/glsl330/skybox.vs", "resources/shaders/glsl330/skybox.fs");
#else   // PLATFORM_RPI, PLATFORM_ANDROID, PLATFORM_WEB
    skybox.materials[0].shader = LoadShader("resources/shaders/glsl100/skybox.vs", "resources/shaders/glsl100/skybox.fs");
#endif
    SetShaderValue(skybox.materials[0].shader, GetShaderLocation(skybox.materials[0].shader, "environmentMap"), (int[1]){ MAP_CUBEMAP }, UNIFORM_INT);
    SetShaderValue(skybox.materials[0].shader, GetShaderLocation(skybox.materials[0].shader, "vflipped"), (int[1]){ 1 }, UNIFORM_INT);

    // Load cubemap shader and setup required shader locations
#if defined(PLATFORM_DESKTOP)
    shdrCubemap = LoadShader("resources/shaders/glsl330/cubemap.vs", "resources/shaders/glsl330/cubemap.fs");
#else   // PLATFORM_RPI, PLATFORM_ANDROID, PLATFORM_WEB
    shdrCubemap = LoadShader("resources/shaders/glsl100/cubemap.vs", "resources/shaders/glsl100/cubemap.fs");
#endif
    SetShaderValue(shdrCubemap, GetShaderLocation(shdrCubemap, "equirectangularMap"), (int[1]){ 0 }, UNIFORM_INT);

    // Load HDR panorama (sphere) texture
    TextCopy(panoFileName, "resources/dresden_square_2k.hdr");
    panorama = LoadTexture(panoFileName);

    // Generate cubemap (texture with 6 quads-cube-mapping) from panorama HDR texture
    // NOTE 1: New texture is generated rendering to texture, shader calculates the sphere->cube coordinates mapping
    // NOTE 2: It seems on some Android devices WebGL, fbo does not properly support a FLOAT-based attachment,
    // despite texture can be successfully created.. so using UNCOMPRESSED_R8G8B8A8 instead of UNCOMPRESSED_R32G32B32A32
    skybox.materials[0].maps[MAP_CUBEMAP].texture = GenTextureCubemap(shdrCubemap, panorama, 1024, UNCOMPRESSED_R8G8B8A8);

    UnloadTexture(panorama);    // Texture not required anymore, cubemap already generated

    SetCameraMode(camera, CAMERA_FIRST_PERSON);  // Set a first person camera mode

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
    UnloadModel(skybox);        // Unload skybox model

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
    UpdateCamera(&camera);              // Update camera
	
    // Load new cubemap texture on drag&drop
    if (IsFileDropped())
    {
        int count = 0;
        char **droppedFiles = GetDroppedFiles(&count);

        if (count == 1)         // Only support one file dropped
        {
            if (IsFileExtension(droppedFiles[0], ".png;.jpg;.hdr;.bmp;.tga"))
            {
                // Unload current cubemap texture and load new one
                UnloadTexture(skybox.materials[0].maps[MAP_CUBEMAP].texture);
                panorama = LoadTexture(droppedFiles[0]);
                TextCopy(panoFileName, droppedFiles[0]);
                    
                // Generate cubemap from panorama texture
                skybox.materials[0].maps[MAP_CUBEMAP].texture = GenTextureCubemap(shdrCubemap, panorama, 1024, UNCOMPRESSED_R8G8B8A8);
                UnloadTexture(panorama);
            }
        }

        ClearDroppedFiles();    // Clear internal buffers
    }
    //----------------------------------------------------------------------------------

    // Draw
    //----------------------------------------------------------------------------------
    BeginDrawing();

        ClearBackground(RAYWHITE);

        BeginMode3D(camera);
            DrawModel(skybox, (Vector3){0, 0, 0}, 1.0f, WHITE);
            DrawGrid(10, 1.0f);
        EndMode3D();

        DrawText(TextFormat("Panorama image from hdrihaven.com: %s", GetFileName(panoFileName)), 10, GetScreenHeight() - 20, 10, BLACK);
        DrawFPS(10, 10);

    EndDrawing();
    //----------------------------------------------------------------------------------
}
