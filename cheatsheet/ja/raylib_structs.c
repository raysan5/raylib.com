    struct Vector2;                // Vector2、2要素(float)
    struct Vector3;                // Vector3、3要素(float)
    struct Vector4;                // Vector4、4要素(float)
    struct Matrix;                 // Matrix、4x4要素、列優先、OpenGL形式、右手系
    struct Color;                  // Color、4要素、R8G8B8A8（32ビット）
    struct Rectangle;              // Rectangle、4要素

    struct Image;                  // Image、CPUメモリ（RAM）に保存されるピクセルデータ
    struct Texture;                // Texture、GPUメモリ（VRAM）に保存されるテクスチャデータ
    struct RenderTexture;          // RenderTexture、テクスチャ描画用のFBO
    struct NPatchInfo;             // NPatchInfo、Nパッチのレイアウト情報
    struct GlyphInfo;              // GlyphInfo、フォント文字のグリフ情報
    struct Font;                   // Font、フォントテクスチャとGlyphInfo配列データ

    struct Camera3D;               // Camera、3D空間内の位置と向きを定義する

    struct Camera2D;               // Camera2D、2D空間内の位置と向きを定義する
    struct Mesh;                   // Mesh、頂点データとVAO／VBO
    struct Shader;                 // シェーダー
    struct MaterialMap;            // マテリアルマップ
    struct Material;               // Material、シェーダーとマップを含む
    struct Transform;              // Transform、頂点変換データ
    struct BoneInfo;               // Bone、スケルタルアニメーションのボーン
    struct ModelSkeleton;          // Skeleton、アニメーションボーンの階層
    struct Model;                  // Model、メッシュ、マテリアル、アニメーションデータ
    struct ModelAnimation;         // ModelAnimation、完全なアニメーションシーケンスを含む
    struct Ray;                    // Ray、レイキャスティング用のレイ
    struct RayCollision;           // RayCollision、レイの衝突情報
    struct BoundingBox;            // バウンディングボックス

    struct Wave;                   // Wave、オーディオ波形データ
    struct AudioStream;            // AudioStream、カスタムオーディオストリーム
    struct Sound;                  // サウンド
    struct Music;                  // Music、オーディオストリーム、約10秒を超えるものはストリーミングすることを推奨

    struct VrDeviceInfo;           // VrDeviceInfo、ヘッドマウントディスプレイのデバイスパラメーター
    struct VrStereoConfig;         // VrStereoConfig、シミュレーター用VRステレオレンダリング設定

    struct FilePathList;           // ファイルパス一覧
    struct AutomationEvent;        // オートメーションイベント
    struct AutomationEventList;    // オートメーションイベント一覧
