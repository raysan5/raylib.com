    struct Vector2;                // 2차원 벡터, 2개의 성분을 가짐
    struct Vector3;                // 3차원 벡터, 3개의 성분을 구성
    struct Vector4;                // 4차원 벡터, 4개의 성분을 구성
    struct Matrix;                 // 행렬, 4행 4열, 열의 구성 요소, OpenGL 스타일, 오른손 좌표계
    struct Color;                  // 색상, 4 16진수 색깔 코드 4개로 구성, R8G8B8A8 (32bit)
    struct Rectangle;              // 직사각형, 좌측 상단 x좌표, y좌표, 너비, 높이로 구성

    struct Image;                  // 이미지, CPU 메모리에 저장되는 픽셀 데이터 (RAM) 
    struct Texture;                // 텍스쳐, GPU 메모리에 저장되는 텍스처 데이터 (VRAM) 
    struct RenderTexture;          // 렌더텍스쳐, 텍스쳐 렌더링을 위한 프레임 버퍼 오브젝트 
    struct NPatchInfo;             // N패치정보, n-패치 레이아웃 정보
    struct GlyphInfo;              // 글자정보, 글꼴의 글자 정보
    struct Font;                   // 글꼴, 글자 텍스쳐와 글자정보에 대한 배열 데이터

    struct Camera3D;               // 카메라, 3차원 공간에서의 카메라의 위치와 방향에 대한 정의

    struct Camera2D;               // Camera2D, 2차원 공간에서의 카메라의 위치와 방향에 대한 정의
    struct Mesh;                   // 매쉬, 꼭지점 데이터 와 꼭짓점 배열 객체/꼭짓점 버퍼 객체
    struct Shader;                 // 쉐이더
    struct MaterialMap;            // 재질 맵
    struct Material;               // 재질, 쉐이더와 재질 맵을 포함
    struct Transform;              // 변형, 꼭짓점의 변형 데이터
    struct BoneInfo;               // Bone, skeletal animation bone 골격 애니메이션 
    struct Model;                  // 모델, 매쉬들과 재질 그리고 애니메이션 데이터로 구성
    struct ModelAnimation;         // 모델애니메이션
    struct Ray;                    // 광선, 광선투사을 위한 광선
    struct RayCollision;           // 광선충돌, 광선이 충돌했을 떄의 정보
    struct BoundingBox;            // 바운딩 박스 (물체를 완전히 감싸는 직육면체)

    struct Wave;                   // 파형, 오디오 파형 데이터
    struct AudioStream;            // 오디오스트림, 사용자 정의 오디오 스트림
    struct Sound;                  // 소리
    struct Music;                  // 음악, 오디오 스트림, 10초 이상의 모든 음악은 실행될 수 있음

    struct VrDeviceInfo;           // Vr기기정보, 헤드 마운드 디스플레이 장치 매개변수
    struct VrStereoConfig;         // VR스트레오설정, 시뮬레이터를 위한 VR 스테레오 렌더링 설정

    struct FilePathList;           // 파일 경로의 동적 배열
