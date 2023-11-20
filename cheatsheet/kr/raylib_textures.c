
    // 이미지를 불러오는 함수
    // 메모: 이 함수들은 GPU의 허가를 필요로 하지 않습니다
    Image LoadImage(const char *fileName);                                                             // 파일에서 CPU 메모리로 이미지를 불러온다 (램)
    Image LoadImageRaw(const char *fileName, int width, int height, int format, int headerSize);       // RAW 파일 데이터로부터 이미지를 불러온다
    Image LoadImageAnim(const char *fileName, int *frames);                                            // 파일로부터 이미지 순서를 불러온다 (frames appended to image.data)
    Image LoadImageFromMemory(const char *fileType, const unsigned char *fileData, int dataSize);      // 메모리 버퍼로부터 이미지를 불러온다, 파일의 타입은 확장자에 기반한다: 예시. '.png'
    Image LoadImageFromTexture(Texture2D texture);                                                     // GPU 텍스쳐 데이터로부터 이미지를 불러온다
    Image LoadImageFromScreen(void);                                                                   // 스크린 버퍼와 (스크린샷)으로부터 이미지를 불러온다
    bool IsImageReady(Image image);                                                                    // 이미지가 준비가 되었는지 확인한다
    void UnloadImage(Image image);                                                                     // CPU 메모리에 불러왔던 이미지의 할당을 해제한다 (램)
    bool ExportImage(Image image, const char *fileName);                                               // 이미지 데이터보낸다,를 파일로 내 성공 시 참을 반환한다
    bool ExportImageAsCode(Image image, const char *fileName);                                         // 이미지를 바이트 행렬로 정의된 코드 파일로 내보낸다, 성공 시 참을 반환한다

    // 이미지 생성 함수
    Image GenImageColor(int width, int height, Color color);                                           // 이미지 생성: plain color
    Image GenImageGradientLinear(int width, int height, int direction, Color start, Color end);        // 이미지 생성: linear gradient, direction in degrees [0..360], 0=Vertical gradient
    Image GenImageGradientRadial(int width, int height, float density, Color inner, Color outer);      // 이미지 생성: radial gradient
    Image GenImageGradientSquare(int width, int height, float density, Color inner, Color outer);      // 이미지 생성: square gradient
    Image GenImageChecked(int width, int height, int checksX, int checksY, Color col1, Color col2);    // 이미지 생성: checked
    Image GenImageWhiteNoise(int width, int height, float factor);                                     // 이미지 생성: white noise
    Image GenImagePerlinNoise(int width, int height, int offsetX, int offsetY, float scale);           // 이미지 생성: perlin noise
    Image GenImageCellular(int width, int height, int tileSize);                                       // 이미지 생성: cellular algorithm, bigger tileSize means bigger cells
    Image GenImageText(int width, int height, const char *text);                                       // 이미지 생성: grayscale image from text data

    // 이미지 공작 함수
    Image ImageCopy(Image image);                                                                      // Create an image duplicate (useful for transformations)
    Image ImageFromImage(Image image, Rectangle rec);                                                  // 다른 이미지 조각을 이용해 이미지를 생성한다
    Image ImageText(const char *text, int fontSize, Color color);                                      // 텍스트를 이용해 이미지를 생성한다 (기본 글꼴)
    Image ImageTextEx(Font font, const char *text, float fontSize, float spacing, Color tint);         // 텍스트를 이용해 이미지를 생성한다 (커스텀 스프라이트 글꼴)
    void ImageFormat(Image *image, int newFormat);                                                     // 이미지 데이터를 제공된 형태로 변환한다
    void ImageToPOT(Image *image, Color fill);                                                         // 이미지를 POT로 변환한다 (power-of-two)
    void ImageCrop(Image *image, Rectangle crop);                                                      // Crop an image to a defined rectangle
    void ImageAlphaCrop(Image *image, float threshold);                                                // Crop image depending on alpha value
    void ImageAlphaClear(Image *image, Color color, float threshold);                                  // Clear alpha channel to desired color
    void ImageAlphaMask(Image *image, Image alphaMask);                                                // Apply alpha mask to image
    void ImageAlphaPremultiply(Image *image);                                                          // Premultiply alpha channel
    void ImageBlurGaussian(Image *image, int blurSize);                                                // Apply Gaussian blur using a box blur approximation
    void ImageResize(Image *image, int newWidth, int newHeight);                                       // 이미지의 크기를 조절한다 (Bicubic scaling algorithm)
    void ImageResizeNN(Image *image, int newWidth,int newHeight);                                      // 이미지의 크기를 조절한다 (Nearest-Neighbor scaling algorithm)
    void ImageResizeCanvas(Image *image, int newWidth, int newHeight, int offsetX, int offsetY, Color fill);  // 캔버스의 크기를 조절하고 색상을 채운다
    void ImageMipmaps(Image *image);                                                                   // 제공된 이미지를 위해 모든 밉맵 레벨을 계산한다
    void ImageDither(Image *image, int rBpp, int gBpp, int bBpp, int aBpp);                            // Dither image data to 16bpp or lower (Floyd-Steinberg dithering)
    void ImageFlipVertical(Image *image);                                                              // 이미지를 수직 방향으로 뒤집는다
    void ImageFlipHorizontal(Image *image);                                                            // 이미지를 수평 방향으로 뒤집는다
    void ImageRotate(Image *image, int degrees);                                                       // 입력받은 각도에 맞추어 이미지를 회전시킨다 (-359 에서 359 까지) 
    void ImageRotateCW(Image *image);                                                                  // 시계 방향으로 90도의 각도로 이미지를 회전시킨다
    void ImageRotateCCW(Image *image);                                                                 // 반시계 방향으로 90도의 각도로 이미지를 회전시킨다
    void ImageColorTint(Image *image, Color color);                                                    // 이미지 색상 변형: 틴트
    void ImageColorInvert(Image *image);                                                               // 이미지 색상 변형: invert
    void ImageColorGrayscale(Image *image);                                                            // 이미지 색상 변형: grayscale
    void ImageColorContrast(Image *image, float contrast);                                             // 이미지 색상 변형: contrast (-100 to 100)
    void ImageColorBrightness(Image *image, int brightness);                                           // 이미지 색상 변형: 밝기 (-255 to 255)
    void ImageColorReplace(Image *image, Color color, Color replace);                                  // 이미지 색상 변형: replace color
    Color *LoadImageColors(Image image);                                                               // Load color data from image as a Color array (RGBA - 32bit)
    Color *LoadImagePalette(Image image, int maxPaletteSize, int *colorCount);                         // Load colors palette from image as a Color array (RGBA - 32bit)
    void UnloadImageColors(Color *colors);                                                             // Unload color data loaded with LoadImageColors()
    void UnloadImagePalette(Color *colors);                                                            // Unload colors palette loaded with LoadImagePalette()
    Rectangle GetImageAlphaBorder(Image image, float threshold);                                       // 이미지 알파 경계 직사각형을 얻는다
    Color GetImageColor(Image image, int x, int y);                                                    // 이미지 픽셀 (x, y) 위치의 색상을 얻는다

    // 이미지 그리기 함수
    // 메모: 소프트웨어적-렌더링 이미지 함수 (CPU)
    void ImageClearBackground(Image *dst, Color color);                                                // 주어진 색상으로 이미지의 백그라운드를 도배한다
    void ImageDrawPixel(Image *dst, int posX, int posY, Color color);                                  // 이미지 내에 픽셀을 그린다
    void ImageDrawPixelV(Image *dst, Vector2 position, Color color);                                   // 이미지 내에 픽셀을 그린다 (벡터 버전)
    void ImageDrawLine(Image *dst, int startPosX, int startPosY, int endPosX, int endPosY, Color color); // 이미지 내에 선을 그린다
    void ImageDrawLineV(Image *dst, Vector2 start, Vector2 end, Color color);                          // 이미지 내에 선을 그린다 (벡터 버전)
    void ImageDrawCircle(Image *dst, int centerX, int centerY, int radius, Color color);               // 이미지 내에 채워진 원을 그린다
    void ImageDrawCircleV(Image *dst, Vector2 center, int radius, Color color);                        // 이미지 내에 채워진 원을 그린다 (벡터 버전)
    void ImageDrawCircleLines(Image *dst, int centerX, int centerY, int radius, Color color);          // 이미지 내에 비워있는 원을 그린다
    void ImageDrawCircleLinesV(Image *dst, Vector2 center, int radius, Color color);                   // 이미지 내에 비워있는 원을 그린다 (벡터 버전)
    void ImageDrawRectangle(Image *dst, int posX, int posY, int width, int height, Color color);       // 이미지 내에 직사각형을 그린다
    void ImageDrawRectangleV(Image *dst, Vector2 position, Vector2 size, Color color);                 // 이미지 내에 직사각형을 그린다 (벡터 버전)
    void ImageDrawRectangleRec(Image *dst, Rectangle rec, Color color);                                // 이미지 내에 직사각형을 그린다
    void ImageDrawRectangleLines(Image *dst, Rectangle rec, int thick, Color color);                   // 이미지 내에 직사각형의 선을 그린다
    void ImageDraw(Image *dst, Image src, Rectangle srcRec, Rectangle dstRec, Color tint);             // 대상 이미지 내에 원본 이미지를 그린다 (원본에 틴트 적용)
    void ImageDrawText(Image *dst, const char *text, int posX, int posY, int fontSize, Color color);   // 대상 이미지 내에 텍스트를 그린다 (기본 글꼴 사용)
    void ImageDrawTextEx(Image *dst, Font font, const char *text, Vector2 position, float fontSize, float spacing, Color tint); // 대상 이미지 내에 텍스트를 그린다(커스텀 스프라이트 글꼴)

    // 텍스쳐를 불러오는 함수
    // 메모: 이 함수들은 GPU의 허가가 필요합니다
    Texture2D LoadTexture(const char *fileName);                                                       // 파일에서 GPU 메모리로 텍스쳐를 불러온다 (비디오램)
    Texture2D LoadTextureFromImage(Image image);                                                       // 이미지 데이터로부터 텍스쳐를 불러온다
    TextureCubemap LoadTextureCubemap(Image image, int layout);                                        // 이미지로부터 큐브맵을 로드한다, 다수의 이미지 큐브맵 레이아웃이 지원됨
    RenderTexture2D LoadRenderTexture(int width, int height);                                          // 렌더링을 위해 텍스쳐를 불러온다 (프레임버퍼)
    bool IsTextureReady(Texture2D texture);                                                            // 텍스쳐가 준비되었는지 확인한다
    void UnloadTexture(Texture2D texture);                                                             // GPU 메모리에 할당된 텍스쳐를 해제한다 (비디오램)
    bool IsRenderTextureReady(RenderTexture2D target);                                                 // 렌더 텍스쳐가 준비되었는지 확인한다
    void UnloadRenderTexture(RenderTexture2D target);                                                  // GPU 메모리에 할당된 렌더 텍스쳐를 해제한다 (비디오램)
    void UpdateTexture(Texture2D texture, const void *pixels);                                         // GPU 텍스쳐를 새 데이터로 갱신한다
    void UpdateTextureRec(Texture2D texture, Rectangle rec, const void *pixels);                       // 직사각형 GPU 텍스쳐를 새 데이터로 갱신한다

    // 텍스쳐 구성 함수
    void GenTextureMipmaps(Texture2D *texture);                                                        // 텍스쳐를 위해 GPU 밉맵을 생성한다
    void SetTextureFilter(Texture2D texture, int filter);                                              // 텍스쳐를 스케일링 필터모드로 한다 Set texture scaling filter mode
    void SetTextureWrap(Texture2D texture, int wrap);                                                  // 텍스쳐를 랩핑모드로 설정한다 Set texture wrapping mode

    // 텍스쳐 그리기 함수
    void DrawTexture(Texture2D texture, int posX, int posY, Color tint);                               // 2D 텍스쳐를 그린다
    void DrawTextureV(Texture2D texture, Vector2 position, Color tint);                                // 이차원 벡터에 정의된 위치를 기반으로 2D 텍스쳐를 그린다
    void DrawTextureEx(Texture2D texture, Vector2 position, float rotation, float scale, Color tint);  // 추가된 매개변수를 기반으로 2D 텍스쳐를 그린다
    void DrawTextureRec(Texture2D texture, Rectangle source, Vector2 position, Color tint);            // Draw a part of a texture defined by a rectangle
    void DrawTexturePro(Texture2D texture, Rectangle source, Rectangle dest, Vector2 origin, float rotation, Color tint); // Draw a part of a texture defined by a rectangle with 'pro' parameters
    void DrawTextureNPatch(Texture2D texture, NPatchInfo nPatchInfo, Rectangle dest, Vector2 origin, float rotation, Color tint); // Draws a texture (or part of it) that stretches or shrinks nicely

    // 색상/픽셀 기반 함수
    Color Fade(Color color, float alpha);                                 // Get color with alpha applied, alpha goes from 0.0f to 1.0f
    int ColorToInt(Color color);                                          // Get hexadecimal value for a Color
    Vector4 ColorNormalize(Color color);                                  // Get Color normalized as float [0..1]
    Color ColorFromNormalized(Vector4 normalized);                        // Get Color from normalized values [0..1]
    Vector3 ColorToHSV(Color color);                                      // 색상을 위해 HSV 값을 얻는다, hue [0..360], saturation/value [0..1]
    Color ColorFromHSV(float hue, float saturation, float value);         // HSV 값을 위해 색상을 얻는다, hue [0..360], saturation/value [0..1]
    Color ColorTint(Color color, Color tint);                             // Get color multiplied with another color
    Color ColorBrightness(Color color, float factor);                     // Get color with brightness correction, brightness factor goes from -1.0f to 1.0f
    Color ColorContrast(Color color, float contrast);                     // Get color with contrast correction, contrast values between -1.0f and 1.0f
    Color ColorAlpha(Color color, float alpha);                           // Get color with alpha applied, alpha goes from 0.0f to 1.0f
    Color ColorAlphaBlend(Color dst, Color src, Color tint);              // Get src alpha-blended into dst color with tint
    Color GetColor(unsigned int hexValue);                                // Get Color structure from hexadecimal value
    Color GetPixelColor(void *srcPtr, int format);                        // Get Color from a source pixel pointer of certain format
    void SetPixelColor(void *dstPtr, Color color, int format);            // Set color formatted into destination pixel pointer
    int GetPixelDataSize(int width, int height, int format);              // Get pixel data size in bytes for certain format

