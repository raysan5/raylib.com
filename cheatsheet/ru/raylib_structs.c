    struct Vector2;                // Vector2, 2 компонента
    struct Vector3;                // Vector3, 3 компонента
    struct Vector4;                // Vector4, 4 компонента
    struct Matrix;                 // Matrix, 4x4 компонента, column-major (по столбцам), в стиле OpenGL, правосторонняя
    struct Color;                  // Color, 4 компонента, R8G8B8A8 (32 бит)
    struct Rectangle;              // Rectangle, 4 компонента

    struct Image;                  // Image, данные пикселей хранятся в памяти CPU (ОЗУ / RAM)
    struct Texture;                // Texture, данные текстуры хранятся в памяти GPU (видеопамять / VRAM)
    struct RenderTexture;          // RenderTexture, fbo (объект буфера кадра) для рендеринга в текстуру
    struct NPatchInfo;             // NPatchInfo, информация о макете n-patch (9-patch)
    struct GlyphInfo;              // GlyphInfo, информация о глифах символов шрифта
    struct Font;                   // Font, текстура шрифта и массив данных GlyphInfo

    struct Camera3D;               // Camera, определяет позицию/ориентацию в 3D-пространстве

    struct Camera2D;               // Camera2D, определяет позицию/ориентацию в 2D-пространстве
    struct Mesh;                   // Mesh, вершинные данные и vao/vbo
    struct Shader;                 // Shader, шейдер
    struct MaterialMap;            // MaterialMap, карта материала
    struct Material;               // Material, включает шейдер и карты материалов
    struct Transform;              // Transform, данные преобразования вершин
    struct BoneInfo;               // Bone, кость скелетной анимации
    struct ModelSkeleton;          // Skeleton, иерархия костей анимации
    struct Model;                  // Model, меши, материалы и данные анимации
    struct ModelAnimation;         // ModelAnimation, содержит полную последовательность анимации
    struct Ray;                    // Ray, луч для трассировки лучей (raycasting)
    struct RayCollision;           // RayCollision, информация о попадании луча
    struct BoundingBox;            // BoundingBox, ограничивающий контейнер (AABB)

    struct Wave;                   // Wave, аудиоданные звуковой волны
    struct AudioStream;            // AudioStream, кастомный аудиопоток
    struct Sound;                  // Sound, звук
    struct Music;                  // Music, музыкальный поток (всё, что длиннее ~10 секунд, должно проигрываться потоком)

    struct VrDeviceInfo;           // VrDeviceInfo, параметры устройства HMD (виртуального шлема)
    struct VrStereoConfig;         // VrStereoConfig, конфигурация стереорендеринга VR для симулятора

    struct FilePathList;           // FilePathList, список путей к файлам
    struct AutomationEvent;        // AutomationEvent, событие автоматизации
    struct AutomationEventList;    // AutomationEventList, список событий автоматизации
