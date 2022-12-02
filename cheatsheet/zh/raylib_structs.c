   
    //结构体
    struct Vector2;         //Vector2类型
    struct Vector3;         //Vector3类型
    struct Vector4;         //Vector4类型
    struct Quaternion;      //四元数类型
    struct Matrix;          //矩阵类型（OpenGL风格4x4）
    struct Color;           //颜色类型，RGBA（32位）
    struct Rectangle;       //Rectangle类型（矩阵类型）
    
    struct Image;           //图像类型（支持多种像素格式）
                            //注：数据存储在CPU内存（RAM）中
    struct Texture;         //Texture类型（支持多种内部格式）
                            //注：存储在GPU内存（VRAM）中的数据，可以直接被绘制到屏幕上
    struct RenderTexture;   //RenderTexture型，用于Texture渲染
    struct NPatchInfo;      //N-补丁布局信息
    struct GlyphInfo;       //字体字符字形信息
    struct Font;            //字体类型，包括Texture和字符数据
    
    struct Camera;          //相机类型，定义三维相机位置/方向
    struct Camera2D;        //Camera2D类型，定义 2d相机
    struct Mesh;            //定义 Mesh的顶点数据
    struct Shader;          //着色器类型（常规着色器）
    struct MaterialMap;     //材质Texture贴图
    struct Material;        //材料类型
    struct Model;           //基本三维Model类型
    struct Transform;       //变换（用于骨骼）
    struct BoneInfo;        //骨骼信息
    struct ModelAnimation;  //Model动画数据（骨骼和帧）
    struct Ray;             //光线类型（用于光线投射）
    struct RayCollision;    //光线投射命中信息
    struct BoundingBox;     //三维Mesh的边界框类型
    
    struct Wave;            //Wave类型，定义音频Wave数据
    struct Sound;           //基本声源和缓冲区
    struct Music;           //音乐类型（来自内存的文件流）
    struct AudioStream;     //原始音频流类型
    
    struct VrDeviceInfo;    //VR设备参数
    struct VrStereoConfig;  //模拟器的VR立体渲染配置
    
    struct FilePathList;    //文件路径列表
    
