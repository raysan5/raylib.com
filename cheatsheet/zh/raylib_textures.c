
   
    //模块：rtextures
    //Image加载功能
    //注意：此功能不需要GPU访问
    Image LoadImage(const char *fileName);                                      //将图像从文件加载到CPU内存(RAM)
    Image LoadImageRaw(const char *fileName, int width, int height, int format, int headerSize); //从RAW文件数据加载图像
    Image LoadImageAnim(const char *fileName, int *frames);                     //从文件加载图像序列(附加到图像.data的帧)
    Image LoadImageFromMemory(const char *fileType, const unsigned char*fileData, int dataSize); //从内存缓冲区加载图像, fileType引用扩展名：即'。png'
    Image LoadImageFromTexture(Texture2D texture);                               //从GPUTexture数据加载图像
    Image LoadImageFromScreen(void);                                            //从屏幕缓冲区加载图像(屏幕截图)
    void UnLoadImage(Image Image);                                              //从CPU内存(RAM)卸载图像
    bool ExportImage(Image Image, const char*fileName);                         //将图像数据导出到文件, 成功时返回true
    bool ExportImageAsCode(Image Image, constchar*fileName);                    //将图像导出为定义字节数组的代码文件, 成功时返回true
    
    //Image生成功能
    Image GenImageColor(int width, int height, Color Color);                    //生成图像：纯色
    Image GenImageGradientV(int width, int height, Color top, Color bottom);    //生成图像：垂直渐变
    Image GenImageGradientH(int width, int height, Color left, Color right);    //生成图像：水平渐变
    Image GenImageGradientRadial(int width, int height, float density, Color inner, Color outer); //生成图像：径向渐变
    Image GenImageChecked(int width, int height, int checksX, int checks Y, Color col1, Color col2); //生成图像：选中
    Image GenImageWhiteNoise(int width, int height, float factor);              //生成图像：白噪声
    Image GenImageCellular(int width, int height, int tileSize);                //生成图像：细胞算法, 更大的tileSize意味着更大的细胞
    
    //Image处理功能
    Image ImageCopy(Image Image);                                               //创建图像副本(用于变换)
    Image ImageFromImage(Image Image, Rectangle记录);                            //从其他图像片段创建图像
    Image ImageText(const char *text, int fontSize, Color Color);               //从文本创建图像(默认字体)
    Image ImageTextEx(Font, const char *text/*文本*/, float Fontsize, float间距, 颜色色调);      //从文本创建图像，我猜可能是将字绘制成Image然后返回(使用自定义的字体)
    void ImageFormat(Image *Image, int newFormat);                              //将图像数据转换为所需格式
    void ImageToPOT(Image *Image, Color fill/*填充*/);                                      //将图像转换为POT(2的幂)
    void ImageCrop(Image *Image, Rectangle Crop);                                 //将图像裁剪为定义的Rectangle
    void ImageAlphaCrop(Image *Image, float 阈值);                                //根据alpha值裁剪图像
    void ImageAlphaClear(Image *Image, Color color, float 阈值);                  //将alpha通道清除为所需颜色
    void ImageAlphaMask(Image *Image, Image alphaMask);                         //对图像应用alpha遮罩
    void ImageAlphaPremultiply(Image *Image);                                   //预乘alpha通道
    void ImageResize(Image *Image, int newWidth, int newHeight);                //调整图像大小(双三次缩放算法)
    void ImageResizeNN(Image *Image, int newWidth, int newHeight);              //调整图像大小(最近邻缩放算法)
    void ImageResizeCanvas(Image *Image, int newWidth, int newHeight, int offsetX, int offset Y, 颜色填充); //调整画布大小并填充颜色
    void ImageMipmaps(Image *Image);                                            //计算所提供图像的所有mipmap级别
    void ImageDither(Image *Image, int rBpp, int gBpp, intbBpp, IntaBpp);       //抖动图像数据至16bpp或更低(Floyd Steinberg抖动)
    void ImageFlipVertical(Image *Image);                                       //垂直翻转图像
    void ImageFlipHorizontal(Image *Image);                                     //水平翻转图像
    void ImageRotateCW(Image *Image);                                           //顺时针旋转图像 90度
    void ImageRotateCW(Image *Image);                                           //逆时针旋转图像 90度
    void ImageColorTint(Image *Image, Color color);                             //修改图像颜色：色调
    void ImageColorInvert(Image *Image);                                        //修改图像颜色：反转
    void ImageColorGrayscale(Image *Image);                                     //修改图像颜色：灰度
    void ImageColorContrast(Image *Image, float对比度);                          //修改图像颜色：对比度(-100到100)
    void ImageColorBrightness(Image *Image, int亮度);                            //修改图像颜色：亮度(-255到255)
    void ImageColorReplace(Image *Image, Color color, Color replace);           //修改图像颜色：替换颜色
    Color *LoadImageColors(Image Image);                                        //将图像中的颜色数据加载为颜色阵列(RGBA-32位)
    Color *LoadImagePalette(Image Image, int maxPaletteSize, int *colorCount);  //从图像 Load调色板作为颜色阵列(RGBA-32位)
    void UnloadImageColors(Color *colors);                                      //卸载用加载图像Colors()加载的颜色数据
    void UnloadImagePalette(Color *colors);                                     //卸载用加载图像Palette()加载的调色板
    Rectangle GetImageAlphaBorder(Image Image, float阈值);                       //获取图像 alpha边框Rectangle
    Color GetImageColor(Image Image, int x, int y);                             //获取(x, y)位置的图像像素颜色
    
    //Image绘制功能
    //注：Image软件渲染功能(CPU)
    void ImageClearBackground(Image *dst, Color color);                         //具有给定颜色的清晰图像背景
    void ImageDrawPixel(Image *dst, int posX, int posY, Color color);           //在图像中绘制像素
    void ImageDrawPixelV(Image *dst, Vector2位置, Color color);                  //在图像中绘制像素(矢量版本)
    void ImageDrawLine(Image *dst, int startPosX, int startPosY, int endPosX, intendPosY, Color color); //在图像中绘制线条
    void ImageDrawLineV(Image *dst, Vector2开始, Vector2结束, Color color);       //在图像中绘制线条(矢量版本)
    void ImageDrawCircle(Image *dst, int centerX, int center Y, int radius, Color color); //在图像中绘制圆
    void ImageDrawCircleV(Image *dst, Vector2中心, int半径, Color color);         //在图像中绘制圆(矢量版本)
    void ImageDrawRectangle(Image *dst, int posX, int posY, int width, int height, Color Color); //在图像中绘制Rectangle
    void ImageDrawRectangleV(Image *dst, Vector2位置, Vector2大小, Color color);  //在图像中绘制Rectangle(矢量版本)
    void ImageDrawRectangleRec(Image *dst, Rectangle记录, Color color);          //在图像中绘制Rectangle
    void ImageDrawRectangleLines(Image *dst, Rectangle rec, int thick, Color color);        //在图像中绘制Rectangle线
    void ImageDraw(Image *dst, Image src, Rectangle srcRec, Rectangle dstRec, Color color); //在目标图像中绘制源图像(应用于源的色调)
    void ImageDrawText(Image *dst, constchar *text, int posX, int posY, int fontSize, Color color); //在图像(目标)中绘制文本(使用默认字体)
    void ImageDrawTextEx(Image *dst, Font, const char *文本, Vector2位置, float Font大小, float间距, Color color); //在图像(目标)中绘制文本(自定义精灵字体)
    
    //Texture加载功能
    //注意：这些功能需要GPU访问
    Texture2D LoadTexture(const char *fileName);                                //将Texture从文件加载到GPU内存(VRAM)
    Texture2D LoadTextureFromImage(Image Image);                                //从图像数据加载Texture
    TextureCubemap LoadTextureCubemap(Image Image, int布局);                     //从图像 Load立方体贴图, 支持多个图像立方体贴图布局
    RenderTexture2D LoadRenderTexture(int宽度, int高度);                          //加载用于渲染的Texture(帧缓冲区)
    void UnloadTexture(Texture2D texture);                                      //从GPU内存(VRAM)卸载Texture
    void UnloadRenderTexture(RenderTexture2D target);                               //从GPU内存(VRAM)卸载渲染Texture
    void UpdateTexture(Texture2D texture, const void *像素/*pixel*/);                     //使用新数据更新GPUTexture
    void UpdateTextureRec(Texture2D texture, Rectangle rec, const void *像素);   //使用新数据更新GPUTextureRectangle
    
    //Texture配置功能
    void GenTextureMipmaps(Texture2D *texture);                                 //为Texture生成GPU mipmap
    void SetTextureFilter(Texture2D texture, int 过滤器);                         //设置Texture缩放过滤器模式
    void SetTextureWrap(Texture2D texture, int wrap);                           //设置Texture包裹模式
    
    //Texture绘制功能,部分可能涉及rlgl以及更底层的知识
    void DrawTexture(Texture2D texture, int posX, int posY, Color tint);            //绘制Texture2D
    void DrawTextureV(Texture2D texture, Vector2位置, Color tint);                   //绘制位置定义为Vector2的Texture2D
    void DrawTextureEx(Texture2D texture, Vector2位置, float旋转, float比例, Color tint);  //使用扩展参数绘制Texture2D
    void DrawTextureRec(Texture2D texture, Rectangle source, Vector2位置, Color tint);     //绘制由Rectangle 定义的Texture的一部分
    void DrawTextureQuad(Texture2D texture, Vector2 平铺, Vector2偏移, Rectangle四边形, Color tint); //使用平铺和偏移参数绘制Texture四边形
    void DrawTextureTiled(Texture2D texture, Rectangle source, Rectangle目标, Vector2原点, float旋转, float比例, Color tint); //绘制Texture的一部分(由Rectangle 定义), 旋转并缩放平铺到dest。
    void DrawTexturePro(Texture2D texture, Rectangle source, Rectangle目标, Vector2原点, float旋转, Color tint); //使用“pro”参数绘制由Rectangle 定义的Texture的一部分
    void DrawTextureNPatch(Texture2D texture, NPatchInfo NPatchInfo, Rectangle 目标, Vector2原点, float旋转, Color tint); //绘制可以很好地拉伸或收缩的Texture(或其一部分)
    void DrawTexturePoly(Texture2D texture, Vector2中心, Vector2 *点, Vector2 *Texture坐标, int pointCount, Color tint); //绘制Texture多边形
    
    //颜色/像素相关功能
    Color Fade(Color color, float alpha);                   //使用alpha获取颜色, alpha从0.0f变为1.0f
    int ColorToInt(Color color);                            //获取颜色的十六进制值
    Vector4 ColorNormalize(Color color);                    //获取标准化为float的颜色[0..1]
    Color ColorFromNormalized(Vector4 规格化);                 //从规格化值[0..1]获取颜色
    Vector3 ColorToHSV(Color color);                        //获取颜色, 色调[0..360], 饱和度/值[0..1]的HSV值
    Color ColorFromHSV(float色调, float饱和度, float值);         //从HSV值, 色调[0..360], 饱和度/值[0..1]获取颜色
    Color ColorAlpha(Color color, float alpha);             //使用alpha获取颜色, alpha从0.0f变为1.0f
    Color AlphaBlend(Color dst, Color src, Color tint);       //将src alpha混合到带有色调的dst颜色中
    Color GetColor(unsigned int hexValue);                  //从十六进制值获取颜色struct
    Color GetPixelColor(void *srcPtr, int 格式/*format*/);              //从特定格式的源像素指针获取颜色
    void SetPixelColor(void *dstPtr, Color coloe, int 格式/*format*/);  //设置格式化为目标像素指针的颜色
    int GetPixelDataSize(int 宽度, int 高度, int 格式/*format*/);             //获取特定格式的像素数据大小(字节)
