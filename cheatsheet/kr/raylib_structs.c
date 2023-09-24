    struct Vector2;                // Vector2, 2 components
    struct Vector3;                // Vector3, 3 components
    struct Vector4;                // Vector4, 4 components
    struct Matrix;                 // Matrix, 4x4 components, column major, OpenGL style, right handed
    struct Color;                  // Color, 4 components, R8G8B8A8 (32bit)
    struct Rectangle;              // Rectangle, 4 components

    struct Image;                  // Image, pixel data stored in CPU memory (RAM)
    struct Texture;                // Texture, tex data stored in GPU memory (VRAM)
    struct RenderTexture;          // RenderTexture, fbo for texture rendering
    struct NPatchInfo;             // NPatchInfo, n-patch layout info
    struct GlyphInfo;              // GlyphInfo, font characters glyphs info
    struct Font;                   // Font, font texture and GlyphInfo array data

    struct Camera3D;               // Camera, defines position/orientation in 3d space

    struct Camera2D;               // Camera2D, defines position/orientation in 2d space
    struct Mesh;                   // Mesh, vertex data and vao/vbo
    struct Shader;                 // Shader
    struct MaterialMap;            // MaterialMap
    struct Material;               // Material, includes shader and maps
    struct Transform;              // Transform, vectex transformation data
    struct BoneInfo;               // Bone, skeletal animation bone
    struct Model;                  // Model, meshes, materials and animation data
    struct ModelAnimation;         // ModelAnimation
    struct Ray;                    // Ray, ray for raycasting
    struct RayCollision;           // RayCollision, ray hit information
    struct BoundingBox;            // BoundingBox

    struct Wave;                   // Wave, audio wave data
    struct AudioStream;            // AudioStream, custom audio stream
    struct Sound;                  // Sound
    struct Music;                  // Music, audio stream, anything longer than ~10 seconds should be streamed

    struct VrDeviceInfo;           // VrDeviceInfo, Head-Mounted-Display device parameters
    struct VrStereoConfig;         // VrStereoConfig, VR stereo rendering configuration for simulator

    struct FilePathList;           // File path list
