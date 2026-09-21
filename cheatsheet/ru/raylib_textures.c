    // Функции загрузки изображений
    // ПРИМЕЧАНИЕ: Эти функции не требуют доступа к GPU
    Image LoadImage(const char *fileName);                                                             // Загрузить изображение из файла в память CPU (ОЗУ)
    Image LoadImageRaw(const char *fileName, int width, int height, int format, int headerSize);       // Загрузить изображение из сырых (RAW) данных файла
    Image LoadImageAnim(const char *fileName, int *frames);                                            // Загрузить последовательность изображений из файла (кадры добавляются в image.data)
    Image LoadImageAnimFromMemory(const char *fileType, const unsigned char *fileData, int dataSize, int *frames); // Загрузить последовательность изображений из буфера в памяти
    Image LoadImageFromMemory(const char *fileType, const unsigned char *fileData, int dataSize);      // Загрузить изображение из буфера в памяти, fileType указывает на расширение: например, '.png'
    Image LoadImageFromTexture(Texture2D texture);                                                     // Загрузить изображение из данных текстуры GPU
    Image LoadImageFromScreen(void);                                                                   // Загрузить изображение из буфера экрана (скриншот)
    bool IsImageValid(Image image);                                                                    // Проверить, корректно ли изображение (данные и параметры)
    void UnloadImage(Image image);                                                                     // Выгрузить изображение из памяти CPU (ОЗУ)
    bool ExportImage(Image image, const char *fileName);                                               // Экспортировать данные изображения в файл, возвращает true в случае успеха
    unsigned char *ExportImageToMemory(Image image, const char *fileType, int *fileSize);              // Экспортировать изображение в буфер в памяти, память необходимо освободить через MemFree()
    bool ExportImageAsCode(Image image, const char *fileName);                                         // Экспортировать изображение в виде файла кода, определяющего массив байтов, возвращает true в случае успеха


    // Функции генерации изображений
    Image GenImageColor(int width, int height, Color color);                                           // Сгенерировать изображение: однотонный цвет
    Image GenImageGradientLinear(int width, int height, int direction, Color start, Color end);        // Сгенерировать изображение: линейный градиент, направление в градусах [0..360], 0=Вертикальный градиент
    Image GenImageGradientRadial(int width, int height, float density, Color inner, Color outer);      // Сгенерировать изображение: радиальный градиент
    Image GenImageGradientSquare(int width, int height, float density, Color inner, Color outer);      // Сгенерировать изображение: квадратный градиент
    Image GenImageChecked(int width, int height, int checksX, int checksY, Color col1, Color col2);    // Сгенерировать изображение: шахматная текстура
    Image GenImageWhiteNoise(int width, int height, float factor);                                     // Сгенерировать изображение: белый шум
    Image GenImagePerlinNoise(int width, int height, int offsetX, int offsetY, float scale);           // Сгенерировать изображение: шум Перлина
    Image GenImageCellular(int width, int height, int tileSize);                                       // Сгенерировать изображение: ячеистый алгоритм, чем больше tileSize, тем крупнее ячейки
    Image GenImageText(int width, int height, const char *text);                                       // Сгенерировать изображение: полутоновое изображение из текстовых данных


    // Функции манипуляции с изображениями
    Image ImageCopy(Image image);                                                                      // Создать дубликат изображения (полезно для преобразований)
    Image ImageFromImage(Image image, Rectangle rec);                                                  // Создать изображение из фрагмента другого изображения
    Image ImageFromChannel(Image image, int selectedChannel);                                          // Создать изображение из выбранного канала другого изображения (GRAYSCALE)
    Image ImageText(const char *text, int fontSize, Color color);                                      // Создать изображение из текста (шрифт по умолчанию)
    Image ImageTextEx(Font font, const char *text, float fontSize, float spacing, Color tint);         // Создать изображение из текста (кастомный спрайтовый шрифт)
    void ImageFormat(Image *image, int newFormat);                                                     // Преобразовать данные изображения в желаемый формат
    void ImageToPOT(Image *image, Color fill);                                                         // Преобразовать изображение к размеру POT (степень двойки)
    void ImageCrop(Image *image, Rectangle crop);                                                      // Обрезать изображение до определенного прямоугольника
    void ImageAlphaCrop(Image *image, float threshold);                                                // Обрезать изображение в зависимости от значения альфа-канала
    void ImageAlphaClear(Image *image, Color color, float threshold);                                  // Очистить альфа-канал до желаемого цвета
    void ImageAlphaMask(Image *image, Image alphaMask);                                                // Применить альфа-маску к изображению
    void ImageAlphaPremultiply(Image *image);                                                          // Предумножить альфа-канал
    void ImageBlurGaussian(Image *image, int blurSize);                                                // Применить размытие по Гауссу, используя аппроксимацию блочного размытия
    void ImageKernelConvolution(Image *image, const float *kernel, int kernelSize);                    // Применить к изображению кастомное квадратное ядро свертки
    void ImageResize(Image *image, int newWidth, int newHeight);                                       // Изменить размер изображения (алгоритм бикубического масштабирования)
    void ImageResizeNN(Image *image, int newWidth, int newHeight);                                     // Изменить размер изображения (алгоритм масштабирования по ближайшему соседу)
    void ImageResizeCanvas(Image *image, int newWidth, int newHeight, int offsetX, int offsetY, Color fill); // Изменить размер холста и залить цветом
    void ImageMipmaps(Image *image);                                                                   // Вычислить все уровни мипмап для предоставленного изображения
    void ImageDither(Image *image, int rBpp, int gBpp, int bBpp, int aBpp);                            // Дизеринг данных изображения до 16bpp или ниже (дизеринг Флойда-Стейнберга)
    void ImageFlipVertical(Image *image);                                                              // Отразить изображение по вертикали
    void ImageFlipHorizontal(Image *image);                                                            // Отразить изображение по горизонтали
    void ImageRotate(Image *image, int degrees);                                                       // Повернуть изображение на заданный угол в градусах (от -359 до 359)
    void ImageRotateCW(Image *image);                                                                  // Повернуть изображение по часовой стрелке на 90 градусов
    void ImageRotateCCW(Image *image);                                                                 // Повернуть изображение против часовой стрелки на 90 градусов
    void ImageColorTint(Image *image, Color color);                                                    // Изменить цвет изображения: тонирование
    void ImageColorInvert(Image *image);                                                               // Изменить цвет изображения: инверсия
    void ImageColorGrayscale(Image *image);                                                            // Изменить цвет изображения: оттенки серого
    void ImageColorContrast(Image *image, float contrast);                                             // Изменить цвет изображения: контраст (от -100 до 100)
    void ImageColorBrightness(Image *image, int brightness);                                           // Изменить цвет изображения: яркость (от -255 до 255)
    void ImageColorReplace(Image *image, Color color, Color replace);                                  // Изменить цвет изображения: замена цвета
    Color *LoadImageColors(Image image);                                                               // Загрузить данные о цветах из изображения в виде массива структур Color (RGBA - 32 бит)
    Color *LoadImagePalette(Image image, int maxPaletteSize, int *colorCount);                         // Загрузить палитру цветов из изображения в виде массива структур Color (RGBA - 32 бит)
    void UnloadImageColors(Color *colors);                                                             // Выгрузить данные о цветах, загруженные с помощью LoadImageColors()
    void UnloadImagePalette(Color *colors);                                                            // Выгрузить палитру цветов, загруженную с помощью LoadImagePalette()
    Rectangle GetImageAlphaBorder(Image image, float threshold);                                       // Получить прямоугольник прозрачной границы изображения
    Color GetImageColor(Image image, int x, int y);                                                    // Получить цвет пикселя изображения в позиции (x, y)

    // Функции рисования на изображениях
    // ПРИМЕЧАНИЕ: Функции программного рендеринга изображений (CPU)
    void ImageClearBackground(Image *dst, Color color);                                                // Очистить фон изображения заданным цветом
    void ImageDrawPixel(Image *dst, int posX, int posY, Color color);                                  // Нарисовать пиксель внутри изображения
    void ImageDrawPixelV(Image *dst, Vector2 position, Color color);                                   // Нарисовать пиксель внутри изображения (векторная версия)
    void ImageDrawLine(Image *dst, int startPosX, int startPosY, int endPosX, int endPosY, Color color); // Нарисовать линию внутри изображения
    void ImageDrawLineV(Image *dst, Vector2 start, Vector2 end, Color color);                          // Нарисовать линию внутри изображения (векторная версия)
    void ImageDrawLineEx(Image *dst, Vector2 start, Vector2 end, int thick, Color color);              // Нарисовать линию с заданной толщиной внутри изображения
    void ImageDrawCircle(Image *dst, int centerX, int centerY, int radius, Color color);               // Нарисовать закрашенный круг внутри изображения
    void ImageDrawCircleV(Image *dst, Vector2 center, int radius, Color color);                        // Нарисовать закрашенный круг внутри изображения (векторная версия)
    void ImageDrawCircleLines(Image *dst, int centerX, int centerY, int radius, Color color);          // Нарисовать контур круга внутри изображения
    void ImageDrawCircleLinesV(Image *dst, Vector2 center, int radius, Color color);                   // Нарисовать контур круга внутри изображения (векторная версия)
    void ImageDrawRectangle(Image *dst, int posX, int posY, int width, int height, Color color);       // Нарисовать прямоугольник внутри изображения
    void ImageDrawRectangleV(Image *dst, Vector2 position, Vector2 size, Color color);                 // Нарисовать прямоугольник внутри изображения (векторная версия)
    void ImageDrawRectangleRec(Image *dst, Rectangle rec, Color color);                                // Нарисовать прямоугольник внутри изображения
    void ImageDrawRectangleLines(Image *dst, Rectangle rec, int thick, Color color);                   // Нарисовать контур прямоугольника внутри изображения
    void ImageDrawTriangle(Image *dst, Vector2 v1, Vector2 v2, Vector2 v3, Color color);               // Нарисовать треугольник внутри изображения
    void ImageDrawTriangleEx(Image *dst, Vector2 v1, Vector2 v2, Vector2 v3, Color c1, Color c2, Color c3); // Нарисовать треугольник с интерполированными цветами внутри изображения
    void ImageDrawTriangleLines(Image *dst, Vector2 v1, Vector2 v2, Vector2 v3, Color color);          // Нарисовать контур треугольника внутри изображения
    void ImageDrawTriangleFan(Image *dst, const Vector2 *points, int pointCount, Color color);         // Нарисовать веер треугольников (triangle fan) по точкам внутри изображения (первая вершина — центр)
    void ImageDrawTriangleStrip(Image *dst, const Vector2 *points, int pointCount, Color color);       // Нарисовать полосу треугольников (triangle strip) по точкам внутри изображения
    void ImageDraw(Image *dst, Image src, Rectangle srcRec, Rectangle dstRec, Color tint);             // Нарисовать исходное изображение внутри целевого изображения (к исходному применяется тонирование)
    void ImageDrawText(Image *dst, const char *text, int posX, int posY, int fontSize, Color color);   // Нарисовать текст (шрифтом по умолчанию) внутри изображения (целевого)
    void ImageDrawTextEx(Image *dst, Font font, const char *text, Vector2 position, float fontSize, float spacing, Color tint); // Нарисовать текст (кастомным спрайтовым шрифтом) внутри изображения (целевого)

    // Функции загрузки текстур
    // ПРИМЕЧАНИЕ: Эти функции требуют доступа к GPU
    Texture2D LoadTexture(const char *fileName);                                                       // Загрузить текстуру из файла в память GPU (видеопамять / VRAM)
    Texture2D LoadTextureFromImage(Image image);                                                       // Загрузить текстуру из данных изображения
    TextureCubemap LoadTextureCubemap(Image image, int layout);                                        // Загрузить кубическую карту (cubemap) из изображения, поддерживаются различные макеты кубических карт
    RenderTexture2D LoadRenderTexture(int width, int height);                                          // Загрузить текстуру для рендеринга (буфер кадра / framebuffer)
    bool IsTextureValid(Texture2D texture);                                                            // Проверить, корректна ли текстура (загружена ли в GPU)
    void UnloadTexture(Texture2D texture);                                                             // Выгрузить текстуру из памяти GPU (видеопамяти / VRAM)
    bool IsRenderTextureValid(RenderTexture2D target);                                                 // Проверить, корректна ли текстура рендеринга (загружена ли в GPU)
    void UnloadRenderTexture(RenderTexture2D target);                                                  // Выгрузить текстуру рендеринга из памяти GPU (видеопамяти / VRAM)
    void UpdateTexture(Texture2D texture, const void *pixels);                                         // Обновить текстуру на GPU новыми данными (пиксели должны полностью заполнять текстуру)
    void UpdateTextureRec(Texture2D texture, Rectangle rec, const void *pixels);                       // Обновить прямоугольную область текстуры на GPU новыми данными (пиксели и область должны соответствовать текстуре)

    // Функции конфигурации текстур
    void GenTextureMipmaps(Texture2D *texture);                                                        // Сгенерировать мипмапы на GPU для текстуры
    void SetTextureFilter(Texture2D texture, int filter);                                              // Установить режим фильтрации масштабирования текстуры
    void SetTextureWrap(Texture2D texture, int wrap);                                                  // Установить режим повторения (wrap) текстуры

    // Функции рисования текстур
    void DrawTexture(Texture2D texture, int posX, int posY, Color tint);                               // Нарисовать текстуру Texture2D
    void DrawTextureV(Texture2D texture, Vector2 position, Color tint);                                // Нарисовать текстуру Texture2D с позицией, заданной в виде Vector2
    void DrawTextureEx(Texture2D texture, Vector2 position, float rotation, float scale, Color tint);  // Нарисовать текстуру Texture2D с расширенными параметрами
    void DrawTextureRec(Texture2D texture, Rectangle source, Vector2 position, Color tint);            // Нарисовать часть текстуры, определенную прямоугольником
    void DrawTexturePro(Texture2D texture, Rectangle source, Rectangle dest, Vector2 origin, float rotation, Color tint); // Нарисовать часть текстуры, определенную прямоугольником, с «профессиональными» параметрами
    void DrawTextureNPatch(Texture2D texture, NPatchInfo nPatchInfo, Rectangle dest, Vector2 origin, float rotation, Color tint); // Нарисовать текстуру (или ее часть), которая красиво растягивается или сжимается (9-patch)

    // Функции работы с цветом и пикселями
    bool ColorIsEqual(Color col1, Color col2);                            // Проверить, равны ли два цвета
    Color Fade(Color color, float alpha);                                 // Получить цвет с примененной прозрачностью, альфа от 0.0f до 1.0f
    int ColorToInt(Color color);                                          // Получить шестнадцатеричное значение цвета (0xRRGGBBAA)
    Vector4 ColorNormalize(Color color);                                  // Получить нормализованный цвет в виде float [0..1]
    Color ColorFromNormalized(Vector4 normalized);                        // Получить цвет из нормализованных значений [0..1]
    Vector3 ColorToHSV(Color color);                                      // Получить значения HSV для цвета (hue [0..360], saturation/value [0..1])
    Color ColorFromHSV(float hue, float saturation, float value);         // Получить цвет из значений HSV (hue [0..360], saturation/value [0..1])
    Color ColorTint(Color color, Color tint);                             // Получить цвет, умноженный на другой цвет (тонированный)
    Color ColorBrightness(Color color, float factor);                     // Получить цвет с коррекцией яркости, коэффициент от -1.0f до 1.0f
    Color ColorContrast(Color color, float contrast);                     // Получить цвет с коррекцией контраста, значения от -1.0f до 1.0f
    Color ColorAlpha(Color color, float alpha);                           // Получить цвет с примененной прозрачностью, альфа от 0.0f до 1.0f
    Color ColorAlphaBlend(Color dst, Color src, Color tint);              // Смешать исходный цвет (src) с целевым (dst) по альфа-каналу с учетом тонирования
    Color ColorLerp(Color color1, Color color2, float factor);            // Получить цвет путем линейной интерполяции между двумя цветами, коэффициент [0.0f..1.0f]
    Color GetColor(unsigned int hexValue);                                // Получить структуру Color из шестнадцатеричного значения
    Color GetPixelColor(void *srcPtr, int format);                        // Получить цвет из указателя на исходный пиксель определенного формата
    void SetPixelColor(void *dstPtr, Color color, int format);            // Записать отформатированный цвет по указателю на целевой пиксель
    int GetPixelDataSize(int width, int height, int format);              // Получить размер данных пикселей в байтах для определенного формата


