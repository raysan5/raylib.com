    // Функции загрузки/выгрузки шрифтов
    Font GetFontDefault(void);                                                            // Получить шрифт по умолчанию
    Font LoadFont(const char *fileName);                                                  // Загрузить шрифт из файла в память GPU (видеопамять / VRAM)
    Font LoadFontEx(const char *fileName, int fontSize, const int *codepoints, int codepointCount); // Загрузить шрифт из файла с расширенными параметрами (используйте NULL для codepoints и 0 для codepointCount, чтобы загрузить набор символов по умолчанию; размер шрифта задается в пикселях по высоте)
    Font LoadFontFromImage(Image image, Color key, int firstChar);                        // Загрузить шрифт из изображения (в стиле XNA)
    Font LoadFontFromMemory(const char *fileType, const unsigned char *fileData, int dataSize, int fontSize, const int *codepoints, int codepointCount); // Загрузить шрифт из буфера в памяти, fileType указывает на расширение: например, '.ttf'
    bool IsFontValid(Font font);                                                          // Проверить, корректен ли шрифт (данные шрифта загружены, ВНИМАНИЕ: текстура GPU не проверяется)
    GlyphInfo *LoadFontData(const unsigned char *fileData, int dataSize, int fontSize, const int *codepoints, int codepointCount, int type, int *glyphCount); // Загрузить данные шрифта для дальнейшего использования
    Image GenImageFontAtlas(const GlyphInfo *glyphs, Rectangle **glyphRecs, int glyphCount, int fontSize, int padding, int packMethod); // Сгенерировать изображение атласа шрифта, используя информацию о символах
    void UnloadFontData(GlyphInfo *glyphs, int glyphCount);                               // Выгрузить данные о символах шрифта из памяти (ОЗУ / RAM)
    void UnloadFont(Font font);                                                           // Выгрузить шрифт из памяти GPU (видеопамяти / VRAM)
    bool ExportFontAsCode(Font font, const char *fileName);                               // Экспортировать шрифт в виде файла кода, возвращает true в случае успеха

    // Функции рисования текста
    void DrawFPS(int posX, int posY);                                                     // Нарисовать текущее количество кадров в секунду (FPS)
    void DrawText(const char *text, int posX, int posY, int fontSize, Color color);       // Нарисовать текст (используя шрифт по умолчанию)
    void DrawTextEx(Font font, const char *text, Vector2 position, float fontSize, float spacing, Color tint); // Нарисовать текст, используя шрифт и дополнительные параметры
    void DrawTextPro(Font font, const char *text, Vector2 position, Vector2 origin, float rotation, float fontSize, float spacing, Color tint); // Нарисовать текст, используя шрифт и расширенные параметры (вращение)
    void DrawTextCodepoint(Font font, int codepoint, Vector2 position, float fontSize, Color tint); // Нарисовать один символ (кодовую точку)
    void DrawTextCodepoints(Font font, const int *codepoints, int codepointCount, Vector2 position, float fontSize, float spacing, Color tint); // Нарисовать несколько символов (кодовых точек)

    // Функции получения информации о тексте/шрифте
    void SetTextLineSpacing(int spacing);                                                 // Установить вертикальный межстрочный интервал для рисования с переносами строк
    int MeasureText(const char *text, int fontSize);                                      // Измерить ширину строки для шрифта по умолчанию
    Vector2 MeasureTextEx(Font font, const char *text, float fontSize, float spacing);    // Измерить размер строки для заданного шрифта
    Vector2 MeasureTextCodepoints(Font font, const int *codepoints, int length, float fontSize, float spacing); // Измерить размер строки для существующего массива кодовых точек для заданного шрифта
    int GetGlyphIndex(Font font, int codepoint);                                          // Получить индекс глифа в шрифте для кодовой точки (символа Юникода), возвращает '?' в случае неудачи
    GlyphInfo GetGlyphInfo(Font font, int codepoint);                                     // Получить данные информации о глифе для кодовой точки (символа Юникода), возвращает '?' в случае неудачи
    Rectangle GetGlyphAtlasRec(Font font, int codepoint);                                 // Получить прямоугольник глифа в атласе шрифта для кодовой точки (символа Юникода), возвращает '?' в случае неудачи

    // Функции управления кодовыми точками текста (символы Юникода)
    char *LoadUTF8(const int *codepoints, int length);                                    // Закодировать текст в UTF-8 из массива кодовых точек
    void UnloadUTF8(char *text);                                                          // Выгрузить текст в кодировке UTF-8, созданный из массива кодовых точек
    int *LoadCodepoints(const char *text, int *count);                                    // Загрузить все кодовые точки из текстовой строки UTF-8, количество возвращается через параметр
    void UnloadCodepoints(int *codepoints);                                               // Выгрузить данные кодовых точек из памяти
    int GetCodepointCount(const char *text);                                              // Получить общее количество кодовых точек в строке в кодировке UTF-8
    int GetCodepoint(const char *text, int *codepointSize);                               // Получить следующую кодовую точку в строке UTF-8, возвращает 0x3f('?') в случае ошибки
    int GetCodepointNext(const char *text, int *codepointSize);                           // Получить следующую кодовую точку в строке UTF-8, возвращает 0x3f('?') в случае ошибки
    int GetCodepointPrevious(const char *text, int *codepointSize);                       // Получить предыдущую кодовую точку в строке UTF-8, возвращает 0x3f('?') в случае ошибки
    const char *CodepointToUTF8(int codepoint, int *utf8Size);                            // Декодировать одну кодовую точку в массив байтов UTF-8 (длина массива возвращается через параметр)

    // Функции управления текстовыми строками (не UTF-8 строки, только однобайтовые символы)
    // ВНИМАНИЕ 1: Большинство этих функций используют внутренние статические буферы[], рекомендуется сохранять возвращаемые данные на стороне пользователя для повторного использования
    // ВНИМАНИЕ 2: Некоторые функции выделяют память внутри для возвращаемых строк, эти строки должны быть освобождены пользователем с помощью MemFree()
    char **LoadTextLines(const char *text, int *count);                                   // Разбить текст на отдельные строки по символу ('\n')
    void UnloadTextLines(char **text, int lineCount);                                     // Выгрузить строки текста
    int TextCopy(char *dst, const char *src);                                             // Скопировать одну строку в другую, возвращает количество скопированных байтов
    bool TextIsEqual(const char *text1, const char *text2);                               // Проверить, равны ли две текстовые строки
    unsigned int TextLength(const char *text);                                            // Получить длину текста, проверяет завершающий символ '\0'
    const char *TextFormat(const char *text, ...);                                        // Форматирование текста с переменными (в стиле sprintf())
    const char *TextSubtext(const char *text, int position, int length);                  // Получить подстроку из текстовой строки
    const char *TextRemoveSpaces(const char *text);                                       // Удалить пробелы из текста, объединяя слова
    char *GetTextBetween(const char *text, const char *begin, const char *end);           // Получить текст, находящийся между двумя строками
    char *TextReplace(const char *text, const char *search, const char *replacement);     // Заменить подстроку в тексте на новую строку
    char *TextReplaceAlloc(const char *text, const char *search, const char *replacement); // Заменить подстроку в тексте на новую строку, память необходимо освободить через MemFree()
    char *TextReplaceBetween(const char *text, const char *begin, const char *end, const char *replacement); // Заменить текст между двумя конкретными строками
    char *TextReplaceBetweenAlloc(const char *text, const char *begin, const char *end, const char *replacement); // Заменить текст между двумя конкретными строками, память необходимо освободить через MemFree()
    char *TextInsert(const char *text, const char *insert, int position);                 // Вставить текст в определенную позицию по байтам
    char *TextInsertAlloc(const char *text, const char *insert, int position);            // Вставить текст в определенную позицию по байтам, память необходимо освободить через MemFree()
    char *TextJoin(char **textList, int count, const char *delimiter);                    // Объединить текстовые строки с использованием разделителя
    char **TextSplit(const char *text, char delimiter, int *count);                       // Разбить текст на несколько строк, используя внутренний статический массив строк размера MAX_TEXTSPLIT_COUNT
    void TextAppend(char *text, const char *append, int *position);                       // Добавить текст в определенную позицию и переместить курсор
    int TextFindIndex(const char *text, const char *search);                              // Найти первое вхождение подстроки в тексте, возвращает -1, если не найдено
    char *TextToUpper(const char *text);                                                  // Получить версию строки в верхнем регистре (заглавные буквы)
    char *TextToLower(const char *text);                                                  // Получить версию строки в нижнем регистре (строчные буквы)
    char *TextToPascal(const char *text);                                                 // Получить строку в стиле PascalCase
    char *TextToSnake(const char *text);                                                  // Получить строку в стиле snake_case
    char *TextToCamel(const char *text);                                                  // Получить строку в стиле camelCase
    int TextToInteger(const char *text);                                                  // Получить целочисленное значение (int) из текста
    float TextToFloat(const char *text);                                                  // Получить значение с плавающей запятой (float) из текста

