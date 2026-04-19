    // Vector2, 2 components
    struct Vector2 {
        float x;                   // Vector x component
        float y;                   // Vector y component
    };
    // Vector3, 3 components
    struct Vector3 {
        float x;                   // Vector x component
        float y;                   // Vector y component
        float z;                   // Vector z component
    };
    // Vector4, 4 components
    struct Vector4 {
        float x;                   // Vector x component
        float y;                   // Vector y component
        float z;                   // Vector z component
        float w;                   // Vector w component
    };
    // Matrix, 4x4 components, column major, OpenGL style, right-handed
    struct Matrix {
        float m0, m4, m8, m12;     // Matrix first row (4 components)
        float m1, m5, m9, m13;     // Matrix second row (4 components)
        float m2, m6, m10, m14;    // Matrix third row (4 components)
        float m3, m7, m11, m15;    // Matrix fourth row (4 components)
    };
    // Color, 4 components, R8G8B8A8 (32bit)
    struct Color {
        unsigned char r;           // Color red value
        unsigned char g;           // Color green value
        unsigned char b;           // Color blue value
        unsigned char a;           // Color alpha value
    };
    // Rectangle, 4 components
    struct Rectangle {
        float x;                   // Rectangle top-left corner position x
        float y;                   // Rectangle top-left corner position y
        float width;               // Rectangle width
        float height;              // Rectangle height
    };

    // Image, pixel data stored in CPU memory (RAM)
    struct Image {
        void *data;                // Image raw data
        int width;                 // Image base width
        int height;                // Image base height
        int mipmaps;               // Mipmap levels, 1 by default
        int format;                // Data format (PixelFormat type)
    };
    // Texture, tex data stored in GPU memory (VRAM)
    struct Texture {
        unsigned int id;           // OpenGL texture id
        int width;                 // Texture base width
        int height;                // Texture base height
        int mipmaps;               // Mipmap levels, 1 by default
        int format;                // Data format (PixelFormat type)
    };
    // RenderTexture, fbo for texture rendering
    struct RenderTexture {
        unsigned int id;           // OpenGL framebuffer object id
        Texture texture;           // Color buffer attachment texture
        Texture depth;             // Depth buffer attachment texture
    };
    // NPatchInfo, n-patch layout info
    struct NPatchInfo {
        Rectangle source;          // Texture source rectangle
        int left;                  // Left border offset
        int top;                   // Top border offset
        int right;                 // Right border offset
        int bottom;                // Bottom border offset
        int layout;                // Layout of the n-patch: 3x3, 1x3 or 3x1
    };
    // GlyphInfo, font characters glyphs info
    struct GlyphInfo {
        int value;                 // Character value (Unicode)
        int offsetX;               // Character offset X when drawing
        int offsetY;               // Character offset Y when drawing
        int advanceX;              // Character advance position X
        Image image;               // Character image data
    };
    // Font, font texture and GlyphInfo array data
    struct Font {
        int baseSize;              // Base size (default chars height)
        int glyphCount;            // Number of glyph characters
        int glyphPadding;          // Padding around the glyph characters
        Texture2D texture;         // Texture atlas containing the glyphs
        Rectangle *recs;           // Rectangles in texture for the glyphs
        GlyphInfo *glyphs;         // Glyphs info data
    };

    // Camera, defines position/orientation in 3d space
    struct Camera3D {
        Vector3 position;          // Camera position
        Vector3 target;            // Camera target it looks-at
        Vector3 up;                // Camera up vector (rotation over its axis)
        float fovy;                // Camera field-of-view aperture in Y (degrees) in perspective, used as near plane width in orthographic
        int projection;            // Camera projection: CAMERA_PERSPECTIVE or CAMERA_ORTHOGRAPHIC
    };

    // Camera2D, defines position/orientation in 2d space
    struct Camera2D {
        Vector2 offset;            // Camera offset (displacement from target)
        Vector2 target;            // Camera target (rotation and zoom origin)
        float rotation;            // Camera rotation in degrees
        float zoom;                // Camera zoom (scaling), should be 1.0f by default
    };
    // Mesh, vertex data and vao/vbo
    struct Mesh {
        int vertexCount;           // Number of vertices stored in arrays
        int triangleCount;         // Number of triangles stored (indexed or not)
                                   // Vertex attributes data
        float *vertices;           // Vertex position (XYZ - 3 components per vertex) (shader-location = 0)
        float *texcoords;          // Vertex texture coordinates (UV - 2 components per vertex) (shader-location = 1)
        float *texcoords2;         // Vertex texture second coordinates (UV - 2 components per vertex) (shader-location = 5)
        float *normals;            // Vertex normals (XYZ - 3 components per vertex) (shader-location = 2)
        float *tangents;           // Vertex tangents (XYZW - 4 components per vertex) (shader-location = 4)
        unsigned char *colors;     // Vertex colors (RGBA - 4 components per vertex) (shader-location = 3)
        unsigned short *indices;   // Vertex indices (in case vertex data comes indexed)
                                   // Animation vertex data
        float *animVertices;       // Animated vertex positions (after bones transformations)
        float *animNormals;        // Animated normals (after bones transformations)
        unsigned char *boneIds;    // Vertex bone ids, max 255 bone ids, up to 4 bones influence by vertex (skinning)
        float *boneWeights;        // Vertex bone weight, up to 4 bones influence by vertex (skinning)
                                   // OpenGL identifiers
        unsigned int vaoId;        // OpenGL Vertex Array Object id
        unsigned int *vboId;       // OpenGL Vertex Buffer Objects id (default vertex data)
    };
    // Shader
    struct Shader {
        unsigned int id;           // Shader program id
        int *locs;                 // Shader locations array (RL_MAX_SHADER_LOCATIONS)
    };
    // MaterialMap
    struct MaterialMap {
        Texture2D texture;         // Material map texture
        Color color;               // Material map color
        float value;               // Material map value
    };
    // Material, includes shader and maps
    struct Material {
        Shader shader;             // Material shader
        MaterialMap *maps;         // Material maps array (MAX_MATERIAL_MAPS)
        float params[4];           // Material generic parameters (if required)
    };
    // Transform, vertex transformation data
    struct Transform {
        Vector3 translation;       // Translation
        Quaternion rotation;       // Rotation
        Vector3 scale;             // Scale
    };
    // Bone, skeletal animation bone
    struct BoneInfo {
        char name[32];             // Bone name
        int parent;                // Bone parent
    };
    // Model, meshes, materials and animation data
    struct Model {
        Matrix transform;          // Local transform matrix
        int meshCount;             // Number of meshes
        int materialCount;         // Number of materials
        Mesh *meshes;              // Meshes array
        Material *materials;       // Materials array
        int *meshMaterial;         // Mesh material number
                                   // Animation data
        int boneCount;             // Number of bones
        BoneInfo *bones;           // Bones information (skeleton)
        Transform *bindPose;       // Bones base transformation (pose)
    };
    // ModelAnimation
    struct ModelAnimation {
        int boneCount;             // Number of bones
        int frameCount;            // Number of animation frames
        BoneInfo *bones;           // Bones information (skeleton)
        Transform **framePoses;    // Poses array by frame
        char name[32];             // Animation name
    };
    // Ray, ray for raycasting
    struct Ray {
        Vector3 position;          // Ray position (origin)
        Vector3 direction;         // Ray direction
    };
    // RayCollision, ray hit information
    struct RayCollision {
        bool hit;                  // Did the ray hit something?
        float distance;            // Distance to the nearest hit
        Vector3 point;             // Point of the nearest hit
        Vector3 normal;            // Surface normal of hit
    };
    // BoundingBox
    struct BoundingBox {
        Vector3 min;               // Minimum vertex box-corner
        Vector3 max;               // Maximum vertex box-corner
    };

    // Wave, audio wave data
    struct Wave {
        unsigned int frameCount;   // Total number of frames (considering channels)
        unsigned int sampleRate;   // Frequency (samples per second)
        unsigned int sampleSize;   // Bit depth (bits per sample): 8, 16, 32 (24 not supported)
        unsigned int channels;     // Number of channels (1-mono, 2-stereo, ...)
        void *data;                // Buffer data pointer
    };
    // AudioStream, custom audio stream
    struct AudioStream {
        rAudioBuffer *buffer;      // Pointer to internal data used by the audio system
        rAudioProcessor *processor; // Pointer to internal data processor, useful for audio effects
        unsigned int sampleRate;   // Frequency (samples per second)
        unsigned int sampleSize;   // Bit depth (bits per sample): 8, 16, 32 (24 not supported)
        unsigned int channels;     // Number of channels (1-mono, 2-stereo, ...)
    };
    // Sound
    struct Sound {
        AudioStream stream;        // Audio stream
        unsigned int frameCount;   // Total number of frames (considering channels)
    };
    // Music, audio stream, anything longer than ~10 seconds should be streamed
    struct Music {
        AudioStream stream;        // Audio stream
        unsigned int frameCount;   // Total number of frames (considering channels)
        bool looping;              // Music looping enable
        int ctxType;               // Type of music context (audio filetype)
        void *ctxData;             // Audio context data, depends on type
    };

    // VrDeviceInfo, Head-Mounted-Display device parameters
    struct VrDeviceInfo {
        int hResolution;           // Horizontal resolution in pixels
        int vResolution;           // Vertical resolution in pixels
        float hScreenSize;         // Horizontal size in meters
        float vScreenSize;         // Vertical size in meters
        float vScreenCenter;       // Screen center in meters
        float eyeToScreenDistance; // Distance between eye and display in meters
        float lensSeparationDistance; // Lens separation distance in meters
        float interpupillaryDistance; // IPD (distance between pupils) in meters
        float lensDistortionValues[4]; // Lens distortion constant parameters
        float chromaAbCorrection[4]; // Chromatic aberration correction parameters
    };
    // VrStereoConfig, VR stereo rendering configuration for simulator
    struct VrStereoConfig {
        Matrix projection[2];      // VR projection matrices (per eye)
        Matrix viewOffset[2];      // VR view offset matrices (per eye)
        float leftLensCenter[2];   // VR left lens center
        float rightLensCenter[2];  // VR right lens center
        float leftScreenCenter[2]; // VR left screen center
        float rightScreenCenter[2]; // VR right screen center
        float scale[2];            // VR distortion scale
        float scaleIn[2];          // VR distortion scale in
    };

    // File path list
    struct FilePathList {
        unsigned int capacity;     // Filepaths max entries
        unsigned int count;        // Filepaths entries count
        char **paths;              // Filepaths entries
    };
    // Automation event
    struct AutomationEvent {
        unsigned int frame;        // Event frame
        unsigned int type;         // Event type (AutomationEventType)
        int params[4];             // Event parameters (if required)
    };
    // Automation event list
    struct AutomationEventList {
        unsigned int capacity;     // Events max entries (MAX_AUTOMATION_EVENTS)
        unsigned int count;        // Events entries count
        AutomationEvent *events;   // Events entries
    };
