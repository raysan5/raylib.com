    // 画像の読み込み関数
    // 注意: これらの関数はGPUへのアクセスを必要としません
    Image LoadImage(const char *fileName);                                                             // ファイルからCPUメモリ（RAM）へ画像を読み込む
    Image LoadImageRaw(const char *fileName, int width, int height, int format, int headerSize);       // RAWファイルデータから画像を読み込む
    Image LoadImageAnim(const char *fileName, int *frames);                                            // ファイルから画像シーケンスを読み込む（各フレームはimage.dataに追加される）
    Image LoadImageAnimFromMemory(const char *fileType, const unsigned char *fileData, int dataSize, int *frames); // メモリバッファから画像シーケンス(アニメーション)を読み込む
    Image LoadImageFromMemory(const char *fileType, const unsigned char *fileData, int dataSize);      // メモリバッファから画像を読み込む。fileTypeには'.png'などの拡張子を指定する
    Image LoadImageFromTexture(Texture2D texture);                                                     // GPUのテクスチャデータから画像を読み込む
    Image LoadImageFromScreen(void);                                                                   // 画面バッファから画像（スクリーンショット）を読み込む
    bool IsImageValid(Image image);                                                                    // 画像が有効か確認する（データとパラメーター）
    void UnloadImage(Image image);                                                                     // CPUメモリ（RAM）から画像をアンロード(解放処理)する
    bool ExportImage(Image image, const char *fileName);                                               // 画像データをファイルへエクスポートし、成功した場合はtrueを返す
    unsigned char *ExportImageToMemory(Image image, const char *fileType, int *fileSize);              // 画像をメモリバッファへエクスポートする。メモリはMemFree()で解放する必要がある
    bool ExportImageAsCode(Image image, const char *fileName);                                         // 画像をバイト配列として定義したコードファイルへエクスポートし、成功した場合はtrueを返す

    // 画像の生成関数
    Image GenImageColor(int width, int height, Color color);                                           // 単色の画像を生成する
    Image GenImageGradientLinear(int width, int height, int direction, Color start, Color end);        // 線形グラデーション画像を生成する。方向は角度[0..360]で指定し、0は垂直グラデーション
    Image GenImageGradientRadial(int width, int height, float density, Color inner, Color outer);      // 放射状グラデーション画像を生成する
    Image GenImageGradientSquare(int width, int height, float density, Color inner, Color outer);      // 四角形グラデーション画像を生成する
    Image GenImageChecked(int width, int height, int checksX, int checksY, Color col1, Color col2);    // 市松模様の画像を生成する
    Image GenImageWhiteNoise(int width, int height, float factor);                                     // ホワイトノイズ画像を生成する
    Image GenImagePerlinNoise(int width, int height, int offsetX, int offsetY, float scale);           // パーリンノイズ画像を生成する
    Image GenImageCellular(int width, int height, int tileSize);                                       // セルラーアルゴリズムで画像を生成する。tileSizeが大きいほどセルも大きくなる
    Image GenImageText(int width, int height, const char *text);                                       // テキストデータからグレースケール画像を生成する

    // 画像の操作関数
    Image ImageCopy(Image image);                                                                      // 画像の複製を作成する（変換処理に有用）
    Image ImageFromImage(Image image, Rectangle rec);                                                  // 別の画像から切り出した部分を使って画像を作成する
    Image ImageFromChannel(Image image, int selectedChannel);                                          // 別の画像から選択したチャンネルを使って画像を作成する（グレースケール）
    Image ImageText(const char *text, int fontSize, Color color);                                      // テキストから画像を作成する（デフォルトフォント）
    Image ImageTextEx(Font font, const char *text, float fontSize, float spacing, Color tint);         // テキストから画像を作成する（カスタムスプライトフォント）
    void ImageFormat(Image *image, int newFormat);                                                     // 画像データを指定した形式へ変換する
    void ImageToPOT(Image *image, Color fill);                                                         // 画像をPOT（2のべき乗）サイズへ変換する
    void ImageCrop(Image *image, Rectangle crop);                                                      // 指定した矩形で画像を切り抜く
    void ImageAlphaCrop(Image *image, float threshold);                                                // アルファ値に応じて画像を切り抜く
    void ImageAlphaClear(Image *image, Color color, float threshold);                                  // アルファチャンネルを指定した色でクリアする
    void ImageAlphaMask(Image *image, Image alphaMask);                                                // 画像にアルファマスクを適用する
    void ImageAlphaPremultiply(Image *image);                                                          // アルファチャンネルを事前乗算する
    void ImageBlurGaussian(Image *image, int blurSize);                                                // ボックスブラーによる近似を使用してガウシアンブラーを適用する
    void ImageKernelConvolution(Image *image, const float *kernel, int kernelSize);                    // カスタムの正方形畳み込みカーネルを画像に適用する
    void ImageResize(Image *image, int newWidth, int newHeight);                                       // 画像のサイズを変更する（バイキュービック補間）
    void ImageResizeNN(Image *image, int newWidth, int newHeight);                                     // 画像のサイズを変更する（最近傍補間）
    void ImageResizeCanvas(Image *image, int newWidth, int newHeight, int offsetX, int offsetY, Color fill); // キャンバスのサイズを変更し、指定した色で塗りつぶす
    void ImageMipmaps(Image *image);                                                                   // 指定した画像のすべてのミップマップレベルを計算する
    void ImageDither(Image *image, int rBpp, int gBpp, int bBpp, int aBpp);                            // 画像データを16bpp以下へディザリングする（Floyd-Steinbergディザリング）
    void ImageFlipVertical(Image *image);                                                              // 画像を垂直方向に反転する
    void ImageFlipHorizontal(Image *image);                                                            // 画像を水平方向に反転する
    void ImageRotate(Image *image, int degrees);                                                       // 指定した角度（-359～359度）で画像を回転する
    void ImageRotateCW(Image *image);                                                                  // 画像を時計回りに90度回転する
    void ImageRotateCCW(Image *image);                                                                 // 画像を反時計回りに90度回転する
    void ImageColorTint(Image *image, Color color);                                                    // 画像の色を変更する: 色合い
    void ImageColorInvert(Image *image);                                                               // 画像の色を変更する: 反転
    void ImageColorGrayscale(Image *image);                                                            // 画像の色を変更する: グレースケール
    void ImageColorContrast(Image *image, float contrast);                                             // 画像の色を変更する: コントラスト（-100～100）
    void ImageColorBrightness(Image *image, int brightness);                                           // 画像の色を変更する: 明るさ（-255～255）
    void ImageColorReplace(Image *image, Color color, Color replace);                                  // 画像の色を変更する: 色の置換
    Color *LoadImageColors(Image image);                                                               // 画像の色データをColor配列として読み込む（32ビットRGBA）
    Color *LoadImagePalette(Image image, int maxPaletteSize, int *colorCount);                         // 画像のカラーパレットをColor配列として読み込む（32ビットRGBA）
    void UnloadImageColors(Color *colors);                                                             // LoadImageColors()で読み込んだ色データをアンロードする
    void UnloadImagePalette(Color *colors);                                                            // LoadImagePalette()で読み込んだカラーパレットをアンロードする
    Rectangle GetImageAlphaBorder(Image image, float threshold);                                       // 画像のアルファ境界を表す矩形を取得する
    Color GetImageColor(Image image, int x, int y);                                                    // 画像内の座標(x, y)にあるピクセルの色を取得する

    // 画像への描画関数
    // 注意: CPUによる画像のソフトウェアレンダリング関数
    void ImageClearBackground(Image *dst, Color color);                                                // 指定した色で画像の背景をクリアする
    void ImageDrawPixel(Image *dst, int posX, int posY, Color color);                                  // 画像内にピクセルを描画する
    void ImageDrawPixelV(Image *dst, Vector2 position, Color color);                                   // 画像内にピクセルを描画する（Vector版）
    void ImageDrawLine(Image *dst, int startPosX, int startPosY, int endPosX, int endPosY, Color color); // 画像内に線を描画する
    void ImageDrawLineV(Image *dst, Vector2 start, Vector2 end, Color color);                          // 画像内に線を描画する（Vector版）
    void ImageDrawLineEx(Image *dst, Vector2 start, Vector2 end, int thick, Color color);              // 太さを指定して画像内に線を描画する
    void ImageDrawCircle(Image *dst, int centerX, int centerY, int radius, Color color);               // 画像内に塗りつぶした円を描画する
    void ImageDrawCircleV(Image *dst, Vector2 center, int radius, Color color);                        // 画像内に塗りつぶした円を描画する（Vector版）
    void ImageDrawCircleLines(Image *dst, int centerX, int centerY, int radius, Color color);          // 画像内に円の輪郭を描画する
    void ImageDrawCircleLinesV(Image *dst, Vector2 center, int radius, Color color);                   // 画像内に円の輪郭を描画する（Vector版）
    void ImageDrawRectangle(Image *dst, int posX, int posY, int width, int height, Color color);       // 画像内に矩形を描画する
    void ImageDrawRectangleV(Image *dst, Vector2 position, Vector2 size, Color color);                 // 画像内に矩形を描画する（Vector版）
    void ImageDrawRectangleRec(Image *dst, Rectangle rec, Color color);                                // 画像内に矩形を描画する
    void ImageDrawRectangleLines(Image *dst, Rectangle rec, int thick, Color color);                   // 画像内に矩形の線を描画する
    void ImageDrawTriangle(Image *dst, Vector2 v1, Vector2 v2, Vector2 v3, Color color);               // 画像内に三角形を描画する
    void ImageDrawTriangleEx(Image *dst, Vector2 v1, Vector2 v2, Vector2 v3, Color c1, Color c2, Color c3); // 補間された色で画像内に三角形を描画する
    void ImageDrawTriangleLines(Image *dst, Vector2 v1, Vector2 v2, Vector2 v3, Color color);          // 画像内に三角形の輪郭を描画する
    void ImageDrawTriangleFan(Image *dst, const Vector2 *points, int pointCount, Color color);         // 画像内に点で定義された三角形ファンを描画する（最初の頂点が中心）
    void ImageDrawTriangleStrip(Image *dst, const Vector2 *points, int pointCount, Color color);       // 画像内に点で定義された三角形ストリップを描画する
    void ImageDraw(Image *dst, Image src, Rectangle srcRec, Rectangle dstRec, Color tint);             // 転送元画像を転送先画像内に描画する（転送元に色合いを適用）
    void ImageDrawText(Image *dst, const char *text, int posX, int posY, int fontSize, Color color);   // 転送先画像内にテキストを描画する（デフォルトフォントを使用）
    void ImageDrawTextEx(Image *dst, Font font, const char *text, Vector2 position, float fontSize, float spacing, Color tint); // 転送先画像内にテキストを描画する（カスタムスプライトフォント）

    // テクスチャの読み込み関数
    // 注意: これらの関数はGPUへのアクセスを必要とする
    Texture2D LoadTexture(const char *fileName);                                                       // ファイルからGPUメモリ（VRAM）へテクスチャを読み込む
    Texture2D LoadTextureFromImage(Image image);                                                       // 画像データからテクスチャを読み込む
    TextureCubemap LoadTextureCubemap(Image image, int layout);                                        // 画像からキューブマップを読み込む（複数の画像キューブマップレイアウトに対応）
    RenderTexture2D LoadRenderTexture(int width, int height);                                          // 描画用のテクスチャ（フレームバッファ）を読み込む
    bool IsTextureValid(Texture2D texture);                                                            // テクスチャが有効か確認する（GPUに読み込み済み）
    void UnloadTexture(Texture2D texture);                                                             // GPUメモリ（VRAM）からテクスチャをアンロードする
    bool IsRenderTextureValid(RenderTexture2D target);                                                 // レンダーテクスチャが有効か確認する（GPUに読み込み済み）
    void UnloadRenderTexture(RenderTexture2D target);                                                  // GPUメモリ（VRAM）からレンダーテクスチャをアンロードする
    void UpdateTexture(Texture2D texture, const void *pixels);                                         // 新しいデータでGPUテクスチャを更新する（ピクセルデータはテクスチャ全体を埋められる必要がある）
    void UpdateTextureRec(Texture2D texture, Rectangle rec, const void *pixels);                       // 新しいデータでGPUテクスチャの矩形領域を更新する（ピクセルデータと矩形はテクスチャ内に収まる必要がある）

    // テクスチャの設定関数
    void GenTextureMipmaps(Texture2D *texture);                                                        // テクスチャのGPUミップマップを生成する
    void SetTextureFilter(Texture2D texture, int filter);                                              // テクスチャの拡大縮小フィルターモードを設定する
    void SetTextureWrap(Texture2D texture, int wrap);                                                  // テクスチャのラップモードを設定する

    // テクスチャの描画関数
    void DrawTexture(Texture2D texture, int posX, int posY, Color tint);                               // Texture2Dを描画する
    void DrawTextureV(Texture2D texture, Vector2 position, Color tint);                                // Vector2で位置を指定してTexture2Dを描画する
    void DrawTextureEx(Texture2D texture, Vector2 position, float rotation, float scale, Color tint);  // 拡張パラメーターを指定してTexture2Dを描画する
    void DrawTextureRec(Texture2D texture, Rectangle source, Vector2 position, Color tint);            // 矩形で指定したテクスチャの一部を描画する
    void DrawTexturePro(Texture2D texture, Rectangle source, Rectangle dest, Vector2 origin, float rotation, Color tint); // 高度なパラメーターを指定して、矩形で定義したテクスチャの一部を描画する
    void DrawTextureNPatch(Texture2D texture, NPatchInfo nPatchInfo, Rectangle dest, Vector2 origin, float rotation, Color tint); // 自然に伸縮するテクスチャまたはその一部を描画する

    // 色 / ピクセル関連の関数
    bool ColorIsEqual(Color col1, Color col2);                            // 2つの色が等しいか確認する
    Color Fade(Color color, float alpha);                                 // アルファ値を適用した色を取得する。alphaの範囲は0.0f～1.0f
    int ColorToInt(Color color);                                          // Colorの16進数値（0xRRGGBBAA）を取得する
    Vector4 ColorNormalize(Color color);                                  // Colorをfloat値[0..1]に正規化して取得する
    Color ColorFromNormalized(Vector4 normalized);                        // 正規化された値[0..1]からColorを取得する
    Vector3 ColorToHSV(Color color);                                      // ColorのHSV値を取得する。色相[0..360]、彩度／明度[0..1]
    Color ColorFromHSV(float hue, float saturation, float value);         // HSV値からColorを取得する。色相[0..360]、彩度／明度[0..1]
    Color ColorTint(Color color, Color tint);                             // 別の色を乗算した色を取得する
    Color ColorBrightness(Color color, float factor);                     // 明るさを補正した色を取得する。明るさ係数の範囲は-1.0f～1.0f
    Color ColorContrast(Color color, float contrast);                     // コントラストを補正した色を取得する。contrastの範囲は-1.0f～1.0f
    Color ColorAlpha(Color color, float alpha);                           // アルファ値を適用した色を取得する。alphaの範囲は0.0f～1.0f
    Color ColorAlphaBlend(Color dst, Color src, Color tint);              // 色合いを適用したsrcをdstへアルファブレンドした色を取得する
    Color ColorLerp(Color color1, Color color2, float factor);            // 2つの色を線形補間した色を取得する。factorの範囲は[0.0f..1.0f]
    Color GetColor(unsigned int hexValue);                                // 16進数値からColor構造体を取得する
    Color GetPixelColor(void *srcPtr, int format);                        // 指定形式の転送元ピクセルポインターからColorを取得する
    void SetPixelColor(void *dstPtr, Color color, int format);            // 指定形式に変換した色を転送先ピクセルポインターへ設定する
    int GetPixelDataSize(int width, int height, int format);              // 指定形式のピクセルデータサイズをバイト単位で取得する
