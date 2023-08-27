
    //窗口相关功能
    void InitWindow(int width, int height, const char *title);  //初始化窗口和OpenGL上下文
    bool WindowShouldClose(void);                               //检查是否按下了KEY_ESCAPE或关闭图标
    void CloseWindow(void);                                     //关闭窗口并卸载OpenGL上下文
    bool IsWindowReady(void);                                   //检查窗口是否已成功初始化
    bool IsWindowFullscreen(void);                              //检查窗口当前是否为全屏
    bool IsWindowHidden(void);                                  //检查窗口当前是否隐藏(仅PLATFORM_DESKTOP)
    bool IsWindowMinimized(void);                               //检查窗口当前是否最小化(仅限PLATFORM_DESKTOP)
    bool IsWindowMaximized(void);                               //检查窗口当前是否最大化(仅PLATFORM_DESKTOP)
    bool IsWindowFocused(void);                                 //检查窗口当前是否聚焦(仅PLATFORM_DESKTOP)
    bool IsWindowResized(void);                                 //检查窗口是否已调整最后一帧的大小
    bool IsWindowState(unsigned int flag);                      //检查是否启用了一个特定窗口标志
    void SetWindowState(unsigned int flag);                     //使用标志设置窗口配置状态(仅限PLATFORM_DESKTOP)
    void ClearWindowState(unsigned int flag);                   //清除窗口配置状态标志
    void ToggleFullscreen(void);                                //切换窗口状态：全屏/窗口(仅PLATFORM_DESKTOP)
    void MaximizeWindow(void);                                  //设置窗口状态：最大化, 如果可调整大小(仅PLATFORM_DESKTOP)
    void MinimizeWindow(void);                                  //设置窗口状态：最小化, 如果可调整大小(仅PLATFORM_DESKTOP)
    void RestoreWindow(void);                                   //设置窗口状态：未最小化/最大化(仅PLATFORM_DESKTOP)
    void SetWindowIcon(Image image);                            //设置窗口图标(仅PLATFORM_DESKTOP)
    void SetWindowTitle(const char *title);                     //设置窗口标题(仅限PLATFORM_DESKTOP)
    void SetWindowPosition(int x, int y);                       //在屏幕上设置窗口位置(仅限PLATFORM_DESKTOP)
    void SetWindowMonitor(int monitor);                         //为当前窗口设置显示器（硬件设备）(全屏模式)
    void SetWindowMinSize(int width, int height);               //设置窗口最小尺寸(对于FLAG_window_RESIZABLE)
    void SetWindowSize(int width, int height);                  //设置窗口尺寸
    void SetWindowOpacity(float opacity);                       //设置窗口不透明度[0.0f..1.0f](仅限PLATFORM_DESKTOP)
    void*GetWindowHandle(void);                                 //获取本机窗口句柄
    int GetScreenWidth(void);                                   //获取当前屏幕宽度
    int GetScreenHeight(void);                                  //获取当前屏幕高度
    int GetRenderWidth(void);                                   //获取当前渲染宽度(它考虑HiDPI)
    int GetRenderHeight(void);                                  //获取当前渲染高度(它考虑HiDPI)
    int GetMonitorCount(void);                                  //获取连接的显示器（硬件设备）数量
    int GetCurrentMonitor(void);                                //获取当前连接的显示器（硬件设备）
    Vector2 GetMonitorPosition(int monitor);                    //获取指定的显示器（硬件设备）位置
    int GetMonitorWidth(int monitor);                           //获取指定的显示器（硬件设备）宽度(显示器（硬件设备）使用的当前视频模式)
    int GetMonitorHeight(int monitor);                          //获取指定的显示器（硬件设备）高度(显示器（硬件设备）使用的当前视频模式)
    int GetMonitorPhysicalWidth(int monitor);                   //获取指定的显示器（硬件设备）物理宽度(毫米)
    int GetMonitorPhysicalHeight(int monitor);                  //获取指定的显示器（硬件设备）物理高度(毫米)
    int GetMonitorRefreshRate(int monitor);                     //获取指定的显示器（硬件设备）刷新率
    Vector2 GetWindowPosition(void);                            //获取显示器（硬件设备）上的窗口位置XY
    Vector2 GetWindowScaleDPI(void);                            //获取窗口比例DPI因子
    const char*GetMonitorName(int monitor);                     //获取主显示器（硬件设备）的可读UTF-8编码名称
    void SetClipboardText(const char *text);                    //设置剪贴板文本内容
    const char*GetClipboardText(void);                          //获取剪贴板文本内容
    void EnableEventWaiting(void);                              //启用等待EndDrawing()上的事件, 无自动事件轮询
    void DisableEventWaiting(void);                             //禁用等待EndDrawing()上的事件, 自动事件轮询
    
    //自定义框架控制功能
    //注：这些功能适用于希望完全控制帧处理的高级用户
    //默认情况下, EndDrawing()完成以下任务：绘制所有内容+SwapScreenBuffer()+管理帧计时+PollInputEvents()
    //要避免这种行为并手动控制帧进程, 请在config.h中启用：SUPPORT_CUSTOM_FRAME_CONTROL
    void SwapScreenBuffer(void);                                //用前缓冲区交换后缓冲区(屏幕绘图)
    void PollInputEvents(void);                                 //注册所有输入事件
    void WaitTime(double second);                                  //等待一段时间(停止程序执行)
    
    //鼠标光标相关功能
    void ShowCursor(void);                                      //显示鼠标光标
    void HideCursor(void);                                      //隐藏鼠标光标
    bool IsCursorHidden(void);                                  //检查鼠标光标是否不可见
    void EnableCursor(void);                                    //启用鼠标光标(解锁鼠标光标)
    void DisableCursor(void);                                   //禁用鼠标光标(锁定鼠标光标)
    bool IsCursorOnScreen(void);                                //检查鼠标光标是否在屏幕上
    
    //绘图相关功能
    void ClearBackground(Color color);                          //设置背景色(帧缓冲区透明色)
    void BeginDrawing(void);                                    //设置画布(帧缓冲区)以开始绘制
    void EndDrawing(void);                                      //结束画布绘制和交换缓冲区(双缓冲)
    void BeginMode2D(Camera2D camera);                              //使用自定义相机开始2D模式(2D)
    void EndMode2D(void);                                       //使用自定义相机结束2D模式
    void BeginMode3D(Camera3D camera);                              //使用自定义相机开始3D模式(3D)
    void EndMode3D(void);                                       //结束三维模式并返回默认的二维正交模式
    void BeginTextureMode(RenderTexture2D camera);                  //开始绘制以渲染Texture
    void EndTextureMode(void);                                  //结束绘制以渲染Texture
    void BeginShaderMode(Shader shader);                        //开始自定义着色器绘图
    void EndShaderMode(void);                                   //结束自定义着色器绘图(使用默认着色器)
    void BeginBlendMode(int mode);                                //开始混合模式(alpha, 加法, 乘法, 减法, 自定义)
    void EndBlendMode(void);                                    //结束混合模式(重置为默认值：alpha混合)
    void BeginScissorMode(int x, int y, int width, int height); //开始剪式模式(定义下图的屏幕区域)
    void EndScissorMode(void);                                  //末端剪式模式
    void BeginVrStereoMode(VrStereoConfig config);              //开始立体渲染(需要VR模拟器)
    void EndVrStereoMode(void);                                 //结束立体渲染(需要VR模拟器)
    
    //VR模拟器的VR立体配置功能
    VrStereoConfig LoadVrStereo Config(VrDeviceInfo device);    //为VR模拟器设备参数加载VR立体声配置
    void UnloadVrStereoConfig(VrStereoConfig config);           //卸载VR立体声配置
    
    //着色器管理功能
    //注意：OpenGL 1.1上不提供着色器功能
    Shader LoadShader(const char *vsFileName, const char *fsFileName);      //从文件加载着色器并绑定默认位置
    Shader LoadShaderFromMemory(const char *vsCode, const char *fsCode);    //从代码字符串加载着色器并绑定默认位置
    int GetShaderLocation(Shader shader, const char *uniformName);          //获取着色器统一位置
    int GetShaderLocationAttrib(Shader shader, const char *attribName);     //获取着色器属性位置
    void SetShaderValue(Shader shader, int locIndex, const void *value, int uniformType);   //设置着色器统一值
    void SetShaderValueV(Shader shader, int locIndex, const void *value, int uniformType, int count); //设置着色器统一值向量
    void SetShaderValueMatrix(Shader shader, int locIndex, Matrix mat);     //设置着色器统一值(矩阵4x4)
    void SetShaderValueTexture(Shader shader, int locIndex, Texture2D texture); //为Texture设置着色器统一值(sampler2d)
    void UnloadShader(Shader shader);   //从GPU内存(VRAM)卸载着色器
    
    //屏幕空间相关功能
    Ray GetMouseRay(Vector2 mousePosition, Camera camera);        //从鼠标位置获取光线跟踪
    Matrix GetCameraMatrix(Camera camera);                     //获取相机变换矩阵(视图矩阵)
    Matrix GetCameraMatrix2D(Camera2D camera);                     //获取相机二维变换矩阵
    Vector2 GetWorldToScreen(Vector3 position/*坐标*/, Camera camera);               //获取三维世界空间位置的屏幕空间位置
    Vector2 GetScreenToWorld2D(Vector2 position/*坐标*/, Camera2D camera);       //获取2d相机屏幕空间位置的世界空间位置
    Vector2 GetWorldToScreenEx(Vector3 position/*坐标*/,  Camera camera, int宽度, int高度); //获取三维世界空间位置的大小位置
    Vector2 GetWorldToScreen2D(Vector2 position/*坐标*/, Camera2D camera);       //获取2d相机世界空间位置的屏幕空间位置
    
    //定时相关功能
    void SetTargetFPS(int fps);//设置目标FPS(最大值)
    int GetFPS(void);           //获取当前FPS
    float GetFrameTime(void);   //获取绘制的最后一帧的时间(以秒为单位)(增量时间)
    double GetTime(void);       //获取自InitWindow()以来的运行时间(秒)
    
    //其他。功能
    int GetRandomValue(int最小值, int最大值);         //获取最小值和最大值之间的随机值(包括两者)
    void SetRandomSeed(unsigned int seed);           //设置随机数生成器的种子
    void TakeScreenshot(const char *fileName);     //拍摄当前屏幕的屏幕截图(文件扩展名定义格式)
    void SetConfigFlags(unsigned int flag);        //设置初始化配置标志(查看flags)
    void TraceLog(int logLevel, const char *text, …); //显示跟踪日志消息(log_DEBUG, log_INFO, log_WARNING, log_ERROR…)
    void SetTraceLogLevel(int logLevel);           //设置当前阈值(最小)日志级别
    void *MemAlloc(int size);                      //内部内存分配器
    void *MemRealloc(void *ptr, int size);         //内部内存重新定位程序
    void MemFree(void *ptr);                       //内部内存可用
    void OpenURL(const char*url);                  //使用默认系统浏览器打开URL(如果可用)
    
    //设置自定义回调
    //警告：回调（callback）设置适用于高级用户
    void SetTraceLogCallback(TraceLogCallback回调); //设置自定义跟踪日志
    void SetLoadFileDataCallback(LoadFileData回调); //设置自定义文件二进制数据加载器
    void SetSaveFileDataCallback(SaveFileData回调); //设置自定义文件二进制数据保护程序
    void SetLoadFileTextCallback(LoadFileText回调); //设置自定义文件文本数据加载器
    void SetSaveFileTextCallback(SaveFileText回调); //设置自定义文件文本数据保护程序
    
    //文件管理功能
    unsigned char*LoadFileData(const char *fileName, unsigned int *bytesRead); //将文件数据加载为字节数组(读取)
    void UnloadFileData(unsigned char *data);               //卸载LoadFileData()分配的文件数据
    bool SaveFileData(const char *fileName, void*data, unsigned int bytesToWrite); //将数据从字节数组保存到文件(写入), 成功时返回true
    bool ExportDataAsCode(const char *data, unsigned int size, const char *fileName); //将数据导出到代码(.h), 成功时返回true
    char*LoadFileText(constchar *fileName);                 //从文件加载文本数据(读取), 返回以“\0”结尾的字符串
    void UnloadFileText(char *text);                        //卸载LoadFileText()分配的文件文本数据
    bool SaveFileText(const char *fileName, char *text);    //将文本数据保存到文件(写入), 字符串必须以“\0”结尾, 成功时返回true
    bool FileExists(const char *fileName);                  //检查文件是否存在
    bool DirectoryExists(const char *dirPath);              //检查目录路径是否存在
    bool IsFileExtension(const char *fileName, const char *ext); //检查文件扩展名(包括点：.png, .wav)
    int GetFileLength(const char *fileName);                //获取以字节为单位的文件长度(注意：GetFileSize()与windows冲突。小时)
    const char*GetFileExtension(const char *fileName);      //获取指向文件名字符串扩展名的指针(包括点：“.png”)
    const char*GetFileName(const char *filePath);           //获取路径字符串的文件名指针
    const char*GetFileNameWithoutExt(const char *filePath); //获取不带扩展名的文件名字符串(使用静态字符串)
    const char*GetDirectoryPath(const char *filePath);      //获取带有路径的给定fileName的完整路径(使用静态字符串)
    const char*GetPrevDirectoryPath(const char *dirPath);   //获取给定路径的上一个目录路径(使用静态字符串)
    const char*GetWorkingDirectory(void);                   //获取当前工作目录(使用静态字符串)
    const char*GetApplicationDirectory(void);               //如果正在运行的应用程序(使用静态字符串), 则获取目录
    bool ChangeDirectory(const char *dir);                  //更改工作目录, 成功时返回true
    bool IsPathFile(const char *path);                      //检查给定路径是文件还是目录
    FilePathList LoadDirectoryFiles(const char *dirPath);   //加载目录文件路径
    FilePathList LoadDirectoryFilesEx(const char *basePath, const char *filter, bool scanSubdir); //使用扩展筛选和递归目录扫描加载目录文件路径
    void UnloadDirectoryFiles(FilePathList files);             //卸载文件路径
    bool IsFileDropped(void);                               //检查文件是否已放入窗口
    FilePathList LoadDroppedFiles(void);                    //加载删除的文件路径
    void UnloadDroppedFiles(FilePathList files);            //卸载删除的文件路径
    long GetFileModTime(const char *fileName);              //获取文件修改时间(上次写入时间)
    
    //压缩/编码功能
    unsigned char *CompressData(const unsigned char *data, int dataSize, int *compDataSize);       //压缩数据(DEFLATE算法), 内存必须为MemFree()
    unsigned char *DecompressData(const unsigned char *compData, int compDataSize, int *dataSize); //解压缩数据(DEFLATE算法), 内存必须为MemFree()
    char *EncodeDataBase64(const unsigned char *data, int dataSize, int *outputSize);              //将数据编码为Base64字符串, 内存必须为MemFree()
    unsigned char *DecodeDataBase64(const unsigned char *data, int *outputSize);                   //解码Base64字符串数据, 内存必须为MemFree()
    
    //------------------------------------------------------------------------------------
    //输入处理功能(模块：key)
    //------------------------------------------------------------------------------------
    
    //输入相关功能：键盘
    bool IsKeyPressed(int key );                                //检查是否按下了一次键
    bool IsKeyDown(int key);                                   //检查是否按下了键
    bool IsKeyReleased(int key);                            //检查按键是否已释放一次
    bool IsKeyUp(int key);                                  //检查是否未按下按键
    void SetExitKey(int key);                               //设置自定义键以退出程序(默认为ESC)
    int GetKeyPressed(void);                                //按下按键(keycode), 对排队的按键多次调用, 当队列为空时返回0
    int GetCharPressed(void);                               //获取已按下的字符(unicode), 对已排队的字符多次调用, 当队列为空时返回0
    
    //输入相关功能：Gamepads
    bool IsGamepadAvailable(int gamepad);                   //检查游戏机是否可用
    const char*GetGamepadName(int gamepad);                 //获取游戏机内部名称id
    bool IsGamepadButtonPressed(intGamepads, int按钮);       //检查游戏机按钮是否已按下一次
    bool IsGamepadButtonDown(intGamepads, int按钮);          //检查是否按下了游戏机按钮
    bool IsGamepadButtonReleased(intGamepads, int按钮);      //检查游戏机按钮是否已释放一次
    bool IsGamepadButtonUp(intGamepads, int按钮);            //检查是否未按下游戏机按钮
    int GetGamepadButtonPressed(void);                      //按下最后一个游戏机按钮
    int GetGamepadAxisCount(intGamepads);                   //获取游戏机的游戏机轴计数
    float GetGamepadAxisMovement(intGamepads, int轴);       //获取游戏机轴的轴移动值
    int SetGamepadMappings(const char *映射);                //设置内部游戏机映射(SDL_GameControllerDB)
    
    //输入相关功能：鼠标
    bool IsMouseButtonPressed(int按钮);                     //检查是否按下了一次鼠标按钮
    bool IsMouseButtonDown(int按钮);                        //检查是否按下了鼠标按钮
    bool IsMouseButtonRelease(int按钮);                     //检查鼠标按钮是否已释放一次
    bool IsMouseButtonUp(int按钮);                          //检查是否未按下鼠标按钮
    int GetMouseX(void);                                   //获取鼠标位置X
    int GetMouseY(void);                                   //获取鼠标位置Y
    Vector2 GetMousePosition(void);                        //获取鼠标位置XY
    Vector2 GetMouseDelta(void);                           //获取帧之间的鼠标增量
    void SetMousePosition(int x, int y);                   //设置鼠标位置XY
    void SetMouseOffset(int offsetX, int offsetY);         //设置鼠标偏移
    void SetMouseScale(float scaleX,float scaleY);         //设置鼠标缩放
    float GetMouseWheelMove(void);                         //获取X或Y的鼠标滚轮移动, 以较大者为准
    Vector2 GetMouseWheelMoveV(void);                      //获取X和Y方向的鼠标滚轮移动
    void SetMouseCursor(int 鼠标光标);                     //设置鼠标光标，用于更改屏幕上的光标图像(如：当鼠标放在文本上时会变成另一种图案)
    
    //输入相关功能：触摸
    int GetTouchX(void);                                   //获取触摸点0的触摸位置X(相对于屏幕大小)
    int GetTouchY(void);                                   //获取触摸点0的触摸位置Y(相对于屏幕大小)
    Vector2 GetTouchPosition(int index);                   //获取触摸点索引的触摸位置XY(相对于屏幕大小)
    int GetTouchPointId(int index);                        //获取给定索引的接触点标识符
    int GetTouchPointCount(void);                          //获取接触点数量
    
    //------------------------------------------------------------------------------------
    //手势和触摸处理功能(模块：手势)
    //------------------------------------------------------------------------------------
    void SetGesturesEnabled(unsigned int flag);            //使用标志启用一组手势
    bool IsGestureDetected(int gesture);                    //检查是否检测到手势
    int GetGestureDetected(void);                          //获取最新检测到的手势
    float GetGestureHoldDuration(void);                    //获取手势保持时间(毫秒)
    Vector2 GetGestureDragVector(void);                    //获取手势拖动矢量
    float GetGestureDragAngle(void);                       //获取手势拖动角度
    Vector2 GetGesturePinchVector(void);                   //获取手势捏三角
    float GetGesturePinchAngle(void);                      //获取手势捏角
    
   //------------------------------------------------------------------------------------
    //摄像头系统功能（模块：rcamera）
    //------------------------------------------------------------------------------------
    void UpdateCamera(Camera*Camera，int mode);              //更新所选模式的相机位置,mode参数需要填入一个raylib自带的预制摄像机模式，这会让使用摄像机变得更加方便
    void UpdateCameraPro(Camera* camera，Vector3 movement，Vector2 rotation/*旋转*/，float zoom/*缩放大小*/)                                  //更新相机移动/旋转


    
