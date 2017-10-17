
    // Basic geometric 3D shapes drawing functions
    void DrawLine3D(Vector3 startPos, Vector3 endPos, Color color);                                     // Draw a line in 3D world space
    void DrawCircle3D(Vector3 center, float radius, Vector3 rotationAxis, 
                      float rotationAngle, Color color);                                                // Draw a circle in 3D world space
    void DrawCube(Vector3 position, float width, float height, float length, Color color);              // Draw cube
    void DrawCubeV(Vector3 position, Vector3 size, Color color);                                        // Draw cube (Vector version)
    void DrawCubeWires(Vector3 position, float width, float height, float length, Color color);         // Draw cube wires
    void DrawCubeTexture(Texture2D texture, Vector3 position, float width, 
                         float height, float length, Color color);                                      // Draw cube textured
    void DrawSphere(Vector3 centerPos, float radius, Color color);                                      // Draw sphere
    void DrawSphereEx(Vector3 centerPos, float radius, int rings, int slices, Color color);             // Draw sphere with extended parameters
    void DrawSphereWires(Vector3 centerPos, float radius, int rings, int slices, Color color);          // Draw sphere wires
    void DrawCylinder(Vector3 position, float radiusTop, float radiusBottom, 
                      float height, int slices, Color color);                                           // Draw a cylinder/cone
    void DrawCylinderWires(Vector3 position, float radiusTop, float radiusBottom, 
                           float height, int slices, Color color);                                      // Draw a cylinder/cone wires
    void DrawPlane(Vector3 centerPos, Vector2 size, Color color);                                       // Draw a plane XZ
    void DrawRay(Ray ray, Color color);                                                                 // Draw a ray line
    void DrawGrid(int slices, float spacing);                                                           // Draw a grid (centered at (0, 0, 0))
    void DrawGizmo(Vector3 position);                                                                   // Draw simple gizmo

    // Model loading/unloading functions
    Model LoadModel(const char *fileName);                                                              // Load model from files (mesh and material)
    Model LoadModelFromMesh(Mesh mesh);                                                                 // Load model from generated mesh
    void UnloadModel(Model model);                                                                      // Unload model from memory (RAM and/or VRAM)

    // Mesh loading/unloading functions
    Mesh LoadMesh(const char *fileName);                                                                // Load mesh from file
    void UnloadMesh(Mesh *mesh);                                                                        // Unload mesh from memory (RAM and/or VRAM)

    // Mesh generation functions
    Mesh GenMeshPlane(float width, float length, int resX, int resZ);                                   // Generate plane mesh (with subdivisions)
    Mesh GenMeshCube(float width, float height, float length);                                          // Generate cuboid mesh
    Mesh GenMeshSphere(float radius, int rings, int slices);                                            // Generate sphere mesh (standard sphere)
    Mesh GenMeshHemiSphere(float radius, int rings, int slices);                                        // Generate half-sphere mesh (no bottom cap)
    Mesh GenMeshCylinder(float radius, float height, int slices);                                       // Generate cylinder mesh
    Mesh GenMeshTorus(float radius, float size, int radSeg, int sides);                                 // Generate torus mesh
    Mesh GenMeshKnot(float radius, float size, int radSeg, int sides);                                  // Generate trefoil knot mesh
    Mesh GenMeshHeightmap(Image heightmap, Vector3 size);                                               // Generate heightmap mesh from image data
    Mesh GenMeshCubicmap(Image cubicmap, Vector3 cubeSize);                                             // Generate cubes-based map mesh from image data

    // Material loading/unloading functions
    Material LoadMaterial(const char *fileName);                                                        // Load material from file
    Material LoadMaterialDefault(void);                                                                 // Load default material (Supports: DIFFUSE, SPECULAR, NORMAL maps)
    void UnloadMaterial(Material material);                                                             // Unload material from GPU memory (VRAM)

    // Model drawing functions
    void DrawModel(Model model, Vector3 position, float scale, Color tint);                             // Draw a model (with texture if set)
    void DrawModelEx(Model model, Vector3 position, Vector3 rotationAxis, 
                     float rotationAngle, Vector3 scale, Color tint);                                   // Draw a model with extended parameters
    void DrawModelWires(Model model, Vector3 position, float scale, Color tint);                        // Draw a model wires (with texture if set)
    void DrawModelWiresEx(Model model, Vector3 position, Vector3 rotationAxis, 
                          float rotationAngle, Vector3 scale, Color tint);                              // Draw a model wires
    void DrawBoundingBox(BoundingBox box, Color color);                                                 // Draw bounding box (wires)
    void DrawBillboard(Camera camera, Texture2D texture, Vector3 center, float size, Color tint);       // Draw a billboard texture
    void DrawBillboardRec(Camera camera, Texture2D texture, Rectangle sourceRec, 
                          Vector3 center, float size, Color tint);                                      // Draw a billboard texture defined by sourceRec

    // Collision detection functions
    bool CheckCollisionSpheres(Vector3 centerA, float radiusA, Vector3 centerB, float radiusB);                     // Detect collision between two spheres
    bool CheckCollisionBoxes(Vector3 minBBox1, Vector3 maxBBox1, Vector3 minBBox2, Vector3 maxBBox2);               // Detect collision between two boxes
    bool CheckCollisionBoxSphere(Vector3 minBBox, Vector3 maxBBox, Vector3 centerSphere, float radiusSphere);       // Detect collision between box and sphere
    bool CheckCollisionRaySphere(Ray ray, Vector3 spherePosition, float sphereRadius);                              // Detect collision between ray and sphere
    bool CheckCollisionRaySphereEx(Ray ray, Vector3 spherePosition, float sphereRadius, Vector3 *collisionPoint);   // Detect collision between ray and sphere ex.
    bool CheckCollisionRayBox(Ray ray, Vector3 minBBox, Vector3 maxBBox);                                           // Detect collision between ray and box
    BoundingBox CalculateBoundingBox(Mesh mesh);                                                                    // Calculate mesh bounding box limits
    RayHitInfo GetCollisionRayMesh(Ray ray, Mesh *mesh);                                                // Get collision info between ray and mesh
    RayHitInfo GetCollisionRayTriangle(Ray ray, Vector3 p1, Vector3 p2, Vector3 p3);                    // Get collision info between ray and triangle
    RayHitInfo GetCollisionRayGround(Ray ray, float groundHeight);                                      // Get collision info between ray and ground plane (Y-normal plane)
    
