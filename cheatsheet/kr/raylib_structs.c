    struct Vector2;                // Vector2, 2개의 성분을 가진 벡터
    struct Vector3;                // Vector3, 3개의 성분을 가진 벡터
    struct Vector4;                // Vector4, 4개의 성분을 가진 벡터
    struct Matrix;                 // Matrix, 4행 4열의 행렬, 열-우선 (column-major) 저장 방식, OpenGL 스타일, 오른손 (right-handed) 좌표계
    struct Color;                  // Color, 4개의 채널로 구성된 R8G8B8A8 (32비트) 형식의 색상 정보
    struct Rectangle;              // Rectangle, 시작점의 x좌표와 y좌표, 너비와 높이로 이루어진 직사각형

    struct Image;                  // Image, CPU 메모리 (RAM)에 저장된 픽셀 데이터
    struct Texture;                // Texture, GPU 메모리 (VRAM)에 저장된 텍스처 데이터
    struct RenderTexture;          // RenderTexture, 텍스처 렌더링을 위한 프레임버퍼 객체 (framebuffer object, FBO)
    struct NPatchInfo;             // NPatchInfo, n-패치 (n-patch) 레이아웃 정보
    struct GlyphInfo;              // GlyphInfo, 글꼴 (font)에 포함된 문자 (glyph) 표현을 위한 정보
    struct Font;                   // Font, 글꼴의 텍스처 데이터와 GlyphInfo 배열

    struct Camera3D;               // Camera, 위치와 방향 정보를 포함한 3차원 카메라 시점

    struct Camera2D;               // Camera2D, 위치와 방향 정보를 포함한 2차원 카메라 시점
    struct Mesh;                   // Mesh, VAO (Vertex Array Object)와 VBO (Vertex Buffer Object) 등의 정점 (vertex) 데이터
    struct Shader;                 // Shader, 셰이더
    struct MaterialMap;            // MaterialMap
    struct Material;               // Material, 셰이더와 재질 맵 (material map)
    struct Transform;              // Transform, 정점 변환 (vertex transformation) 데이터
    struct BoneInfo;               // Bone, 모델 애니메이션에 사용되는 뼈 (bone)
    struct Model;                  // Model, 메쉬 (mesh)와 재질 (material), 애니메이션 데이터
    struct ModelAnimation;         // ModelAnimation
    struct Ray;                    // Ray, 광선 투사 (raycasting) 연산에 사용되는 광선
    struct RayCollision;           // RayCollision, 광선 투사 연산의 결과
    struct BoundingBox;            // BoundingBox

    struct Wave;                   // Wave, 오디오 파형 (audio wave) 데이터
    struct AudioStream;            // AudioStream, 사용자 정의 오디오 스트림 (custom audio stream)
    struct Sound;                  // Sound, 10초 미만의 짧은 음원
    struct Music;                  // Music, 오디오 스트림, 10초 이상의 긴 음원에 사용 권장

    struct VrDeviceInfo;           // VrDeviceInfo, 헤드 마운티드 디스플레이 (Head-Mounted-Display, HMD) 장치의 매개 변수
    struct VrStereoConfig;         // VrStereoConfig, VR 스테레오 렌더링 (stereo rendering) 설정

    struct FilePathList;           // FilePathList, 파일 경로 목록

    struct AutomationEvent;        // AutomationEvent, 매크로와 리플레이 등의 자동화 기능 (automation)을 위한 이벤트
    struct AutomationEventList;    // AutomationEventList, 자동화할 이벤트 목록
