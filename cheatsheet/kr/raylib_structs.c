    struct Vector2;                // 2차원 벡터, 2개의 성분
    struct Vector3;                // 3차원 벡터, 3개의 성분
    struct Vector4;                // 4차원 벡터, 4개의 성분
    struct Matrix;                 // 행렬, 4행 4열, 열-우선 (column-major) 저장 방식, OpenGL 스타일, 오른손 좌표계
    struct Color;                  // 색상, 4개의 성분, R8G8B8A8 (32비트)
    struct Rectangle;              // 직사각형, 좌측 상단 점의 x좌표와 y좌표, 그리고 너비와 높이로 구성

    struct Image;                  // 이미지, 주기억장치 (RAM)에 저장되는 픽셀 데이터
    struct Texture;                // 텍스처, 그래픽카드 메모리 (VRAM)에 저장되는 텍스처 데이터
    struct RenderTexture;          // 렌더 텍스처, 텍스처 렌더링을 위한 프레임버퍼 오브젝트 (FBO)
    struct NPatchInfo;             // n-패치 정보, n-패치 레이아웃 정보
    struct GlyphInfo;              // 글자 정보, 글꼴의 글자 정보
    struct Font;                   // 글꼴, 글자 텍스처와 글자 정보에 대한 배열 데이터

    struct Camera3D;               // 3D 카메라, 3차원 공간에서의 카메라 위치와 방향 정의

    struct Camera2D;               // 2D 카메라, 2차원 공간에서의 카메라 위치와 방향 정의
    struct Mesh;                   // 메쉬, 꼭짓점 데이터와 꼭짓점 배열 객체 (VAO) 또는 꼭짓점 버퍼 객체 (VBO)로 구성
    struct Shader;                 // 셰이더
    struct MaterialMap;            // 재질 맵
    struct Material;               // 재질, 셰이더와 재질 맵을 포함
    struct Transform;              // 트랜스폼, 꼭짓점에 대한 위치, 회전 및 크기 정보
    struct BoneInfo;               // 골격 정보, 골격 애니메이션에 사용되는 구조체
    struct Model;                  // 모델, 메쉬와 재질 그리고 애니메이션 데이터로 구성
    struct ModelAnimation;         // 모델 애니메이션
    struct Ray;                    // 광선, 광선 투사 (raycasting)에 사용되는 구조체
    struct RayCollision;           // 광선충돌, 광선 투사 정보
    struct BoundingBox;            // 바운딩 박스, 모든 변이 축과 평행하면서 물체를 감싸는 직육면체

    struct Wave;                   // 파형, 오디오 파형 데이터
    struct AudioStream;            // 오디오 스트림
    struct Sound;                  // 소리
    struct Music;                  // 음악, 10초 이상의 오디오 스트림을 위한 구조체

    struct VrDeviceInfo;           // VR 기기 정보, 헤드 마운드 디스플레이 장치 매개변수
    struct VrStereoConfig;         // VR 스테레오 설정, 시뮬레이터를 위한 VR 스테레오 렌더링 설정

    struct FilePathList;           // 파일 경로 배열
