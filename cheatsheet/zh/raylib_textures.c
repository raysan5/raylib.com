    //Image加载功能
    //注意：此功能不需要GPU访问
    Image LoadImage(const char *fileName);                                                      //将图像从文件加载到CPU内存(RAM)
    Image LoadImageRaw(const char *fileName, int width, int height, int format, int headerSize); //从RAW文件数据加载图像
    Image LoadImageAnim(const char *fileName, int *frames);                                     //从文件加载图像序列(附加到图像.data的帧)
    Image LoadImageAnimFromMemory(const char *fileType, const unsigned char *fileData, int dataSize, int *frames); // Load image sequence from memory buffer
    Image LoadImageFromMemory(const char *fileType, const unsigned char*fileData, int dataSize); //从内存缓冲区加载图像, fileType引用扩展名：即'。png'
    Image LoadImageFromTexture(Texture2D texture);                                              //从GPUTexture数据加载图像
    Image LoadImageFromScreen(void);                                                            //从屏幕缓冲区加载图像(屏幕截图)
    bool IsImageValid(Image image);                                                             // Check if an image is valid (data and parameters)
    void UnloadImage(Image image);                                                              //从CPU内存(RAM)卸载图像
    bool ExportImage(Image image, const char*fileName);                                         //将图像数据导出到文件, 成功时返回true
    unsigned char *ExportImageToMemory(Image image, const char *fileType, int *fileSize);       // Export image to memory buffer, memory must be MemFree()
    bool ExportImageAsCode(Image image, const char*fileName);                                   //将图像导出为定义字节数组的代码文件, 成功时返回true
    
    //Image生成功能
    Image GenImageColor(int width, int height, Color color);                                    //生成图像：纯色
    Image GenImageGradientLinear(int width, int height, int direction, Color start, Color end); // Generate image: linear gradient, direction in degrees [0..360], 0=Vertical gradient
    Image GenImageGradientRadial(int width, int height, float density, Color inner, Color outer); //生成图像：径向渐变
    Image GenImageGradientSquare(int width, int height, float density, Color inner, Color outer); // Generate image: square gradient
    Image GenImageChecked(int width, int height, int checksX, int checksY, Color col1, Color col2); //生成图像：选中
    Image GenImageWhiteNoise(int width, int height, float factor);                              //生成图像：白噪声
    Image GenImagePerlinNoise(int width, int height, int offsetX, int offsetY, float scale);    // Generate image: perlin noise
    Image GenImageCellular(int width, int height, int tileSize);                                //生成图像：细胞算法, 更大的tileSize意味着更大的细胞
    Image GenImageText(int width, int height, const char *text);                                // Generate image: grayscale image from text data
    
    //Image处理功能
    Image ImageCopy(Image image);                                                               //创建图像副本(用于变换)
    Image ImageFromImage(Image image, Rectangle rec);                                           //从其他图像片段创建图像
    Image ImageFromChannel(Image image, int selectedChannel);                                   // Create an image from a selected channel of another image (GRAYSCALE)
    Image ImageText(const char *text, int fontSize, Color color);                               //从文本创建图像(默认字体)
    Image ImageTextEx(Font font, const char *text, float fontSize, float spacing, Color tint);  //从文本创建图像，我猜可能是将字绘制成Image然后返回(使用自定义的字体)
    void ImageFormat(Image *image, int newFormat);                                              //将图像数据转换为所需格式
    void ImageToPOT(Image *image, Color fill);                                                  //将图像转换为POT(2的幂)
    void ImageCrop(Image *image, Rectangle crop);                                               //将图像裁剪为定义的Rectangle
    void ImageAlphaCrop(Image *image, float threshold);                                         //根据alpha值裁剪图像
    void ImageAlphaClear(Image *image, Color color, float threshold);                           //将alpha通道清除为所需颜色
    void ImageAlphaMask(Image *image, Image alphaMask);                                         //对图像应用alpha遮罩
    void ImageAlphaPremultiply(Image *image);                                                   //预乘alpha通道
    void ImageBlurGaussian(Image *image, int blurSize);                                         // Apply Gaussian blur using a box blur approximation
    void ImageKernelConvolution(Image *image, const float *kernel, int kernelSize);             // Apply custom square convolution kernel to image
    void ImageResize(Image *image, int newWidth, int newHeight);                                //调整图像大小(双三次缩放算法)
    void ImageResizeNN(Image *image, int newWidth, int newHeight);                              //调整图像大小(最近邻缩放算法)
    void ImageResizeCanvas(Image *image, int newWidth, int newHeight, int offsetX, int offsetY, Color fill); //调整画布大小并填充颜色
    void ImageMipmaps(Image *image);                                                            //计算所提供图像的所有mipmap级别
    void ImageDither(Image *image, int rBpp, int gBpp, int bBpp, int aBpp);                     //抖动图像数据至16bpp或更低(Floyd Steinberg抖动)
    void ImageFlipVertical(Image *image);                                                       //垂直翻转图像
    void ImageFlipHorizontal(Image *image);                                                     //水平翻转图像
    void ImageRotate(Image *image, int degrees);                                                // Rotate image by input angle in degrees (-359 to 359)
    void ImageRotateCW(Image *image);                                                           //顺时针旋转图像 90度
    void ImageRotateCCW(Image *image);                                                          //逆时针旋转图像 90度
    void ImageColorTint(Image *image, Color color);                                             //修改图像颜色：色调
    void ImageColorInvert(Image *image);                                                        //修改图像颜色：反转
    void ImageColorGrayscale(Image *image);                                                     //修改图像颜色：灰度
    void ImageColorContrast(Image *image, float contrast);                                      //修改图像颜色：对比度(-100到100)
    void ImageColorBrightness(Image *image, int brightness);                                    //修改图像颜色：亮度(-255到255)
    void ImageColorReplace(Image *image, Color color, Color replace);                           //修改图像颜色：替换颜色
    Color *LoadImageColors(Image image);                                                        //将图像中的颜色数据加载为颜色阵列(RGBA-32位)
    Color *LoadImagePalette(Image image, int maxPaletteSize, int *colorCount);                  //从图像 Load调色板作为颜色阵列(RGBA-32位)
    void UnloadImageColors(Color *colors);                                                      //卸载用加载图像Colors()加载的颜色数据
    void UnloadImagePalette(Color *colors);                                                     //卸载用加载图像Palette()加载的调色板
    Rectangle GetImageAlphaBorder(Image image, float threshold);                                //获取图像 alpha边框Rectangle
    Color GetImageColor(Image image, int x, int y);                                             //获取(x, y)位置的图像像素颜色
    
    //Image绘制功能
    //注：Image软件渲染功能(CPU)
    void ImageClearBackground(Image *dst, Color color);                                         //具有给定颜色的清晰图像背景
    void ImageDrawPixel(Image *dst, int posX, int posY, Color color);                           //在图像中绘制像素
    void ImageDrawPixelV(Image *dst, Vector2 position, Color color);                            //在图像中绘制像素(矢量版本)
    void ImageDrawLine(Image *dst, int startPosX, int startPosY, int endPosX, int endPosY, Color color); //在图像中绘制线条
    void ImageDrawLineV(Image *dst, Vector2 start, Vector2 end, Color color);                   //在图像中绘制线条(矢量版本)
    void ImageDrawLineEx(Image *dst, Vector2 start, Vector2 end, int thick, Color color);       // Draw a line defining thickness within an image
    void ImageDrawCircle(Image *dst, int centerX, int centerY, int radius, Color color);        //在图像中绘制圆
    void ImageDrawCircleV(Image *dst, Vector2 center, int radius, Color color);                 //在图像中绘制圆(矢量版本)
    void ImageDrawCircleLines(Image *dst, int centerX, int centerY, int radius, Color color);   // Draw circle outline within an image
    void ImageDrawCircleLinesV(Image *dst, Vector2 center, int radius, Color color);            // Draw circle outline within an image (Vector version)
    void ImageDrawRectangle(Image *dst, int posX, int posY, int width, int height, Color color); //在图像中绘制Rectangle
    void ImageDrawRectangleV(Image *dst, Vector2 position, Vector2 size, Color color);          //在图像中绘制Rectangle(矢量版本)
    void ImageDrawRectangleRec(Image *dst, Rectangle rec, Color color);                         //在图像中绘制Rectangle
    void ImageDrawRectangleLines(Image *dst, Rectangle rec, int thick, Color color);            //在图像中绘制Rectangle线
    void ImageDrawTriangle(Image *dst, Vector2 v1, Vector2 v2, Vector2 v3, Color color);        // Draw triangle within an image
    void ImageDrawTriangleEx(Image *dst, Vector2 v1, Vector2 v2, Vector2 v3, Color c1, Color c2, Color c3); // Draw triangle with interpolated colors within an image
    void ImageDrawTriangleLines(Image *dst, Vector2 v1, Vector2 v2, Vector2 v3, Color color);   // Draw triangle outline within an image
    void ImageDrawTriangleFan(Image *dst, const Vector2 *points, int pointCount, Color color);  // Draw a triangle fan defined by points within an image (first vertex is the center)
    void ImageDrawTriangleStrip(Image *dst, const Vector2 *points, int pointCount, Color color); // Draw a triangle strip defined by points within an image
    void ImageDraw(Image *dst, Image src, Rectangle srcRec, Rectangle dstRec, Color tint); //在目标图像中绘制源图像(应用于源的色调)
    void ImageDrawText(Image *dst, const char *text, int posX, int posY, int fontSize, Color color); //在图像(目标)中绘制文本(使用默认字体)
    void ImageDrawTextEx(Image *dst, Font font, const char *text, Vector2 position, float fontSize, float spacing, Color tint); //在图像(目标)中绘制文本(自定义精灵字体)
    
    //Texture加载功能
    //注意：这些功能需要GPU访问
    Texture2D LoadTexture(const char *fileName);                                                //将Texture从文件加载到GPU内存(VRAM)
    Texture2D LoadTextureFromImage(Image image);                                                //从图像数据加载Texture
    TextureCubemap LoadTextureCubemap(Image image, int layout);                                 //从图像 Load立方体贴图, 支持多个图像立方体贴图布局
    RenderTexture2D LoadRenderTexture(int width, int height);                                   //加载用于渲染的Texture(帧缓冲区)
    bool IsTextureValid(Texture2D texture);                                                     // Check if a texture is valid (loaded in GPU)
    void UnloadTexture(Texture2D texture);                                                      //从GPU内存(VRAM)卸载Texture
    bool IsRenderTextureValid(RenderTexture2D target);                                          // Check if a render texture is valid (loaded in GPU)
    void UnloadRenderTexture(RenderTexture2D target);                                           //从GPU内存(VRAM)卸载渲染Texture
    void UpdateTexture(Texture2D texture, const void *pixels);                                  //使用新数据更新GPUTexture
    void UpdateTextureRec(Texture2D texture, Rectangle rec, const void *pixels);                //使用新数据更新GPUTextureRectangle
    
    //Texture配置功能
    void GenTextureMipmaps(Texture2D *texture);                                                 //为Texture生成GPU mipmap
    void SetTextureFilter(Texture2D texture, int filter);                                       //设置Texture缩放过滤器模式
    void SetTextureWrap(Texture2D texture, int wrap);                                           //设置Texture包裹模式
    
    //Texture绘制功能,部分可能涉及rlgl以及更底层的知识
    void DrawTexture(Texture2D texture, int posX, int posY, Color tint);                        //绘制Texture2D
    void DrawTextureV(Texture2D texture, Vector2 position, Color tint);                         //绘制位置定义为Vector2的Texture2D
    void DrawTextureEx(Texture2D texture, Vector2 position, float rotation, float scale, Color tint); //使用扩展参数绘制Texture2D
    void DrawTextureRec(Texture2D texture, Rectangle source, Vector2 position, Color tint);     //绘制由Rectangle 定义的Texture的一部分
    void DrawTexturePro(Texture2D texture, Rectangle source, Rectangle dest, Vector2 origin, float rotation, Color tint); //使用“pro”参数绘制由Rectangle 定义的Texture的一部分
    void DrawTextureNPatch(Texture2D texture, NPatchInfo nPatchInfo, Rectangle dest, Vector2 origin, float rotation, Color tint); //绘制可以很好地拉伸或收缩的Texture(或其一部分)
    
    //颜色/像素相关功能
    bool ColorIsEqual(Color col1, Color col2);                            // Check if two colors are equal
    Color Fade(Color color, float alpha);                                 //使用alpha获取颜色, alpha从0.0f变为1.0f
    int ColorToInt(Color color);                                          //获取颜色的十六进制值
    Vector4 ColorNormalize(Color color);                                  //获取标准化为float的颜色[0..1]
    Color ColorFromNormalized(Vector4 normalized);                        //从规格化值[0..1]获取颜色
    Vector3 ColorToHSV(Color color);                                      //获取颜色, 色调[0..360], 饱和度/值[0..1]的HSV值
    Color ColorFromHSV(float hue, float saturation, float value);         //从HSV值, 色调[0..360], 饱和度/值[0..1]获取颜色
    Color ColorTint(Color color, Color tint);                             // Get color multiplied with another color
    Color ColorBrightness(Color color, float factor);                     // Get color with brightness correction, brightness factor goes from -1.0f to 1.0f
    Color ColorContrast(Color color, float contrast);                     // Get color with contrast correction, contrast values between -1.0f and 1.0f
    Color ColorAlpha(Color color, float alpha);                           //使用alpha获取颜色, alpha从0.0f变为1.0f
    Color ColorAlphaBlend(Color dst, Color src, Color tint);              //将src alpha混合到带有色调的dst颜色中
    Color ColorLerp(Color color1, Color color2, float factor);            // Get color lerp interpolation between two colors, factor [0.0f..1.0f]
    Color GetColor(unsigned int hexValue);                                //从十六进制值获取颜色struct
    Color GetPixelColor(void *srcPtr, int format);                        //从特定格式的源像素指针获取颜色
    void SetPixelColor(void *dstPtr, Color color, int format);            //设置格式化为目标像素指针的颜色
    int GetPixelDataSize(int width, int height, int format);              //获取特定格式的像素数据大小(字节)
