    // 글꼴 로딩/언로딩 관련 함수
    Font GetFontDefault(void);                                                            // raylib의 기본 글꼴을 반환한다
    Font LoadFont(const char *fileName);                                                  // 글꼴 파일을 GPU 메모리 (VRAM)로 불러온다
    Font LoadFontEx(const char *fileName, int fontSize, int *codepoints, int codepointCount);  // 추가 매개 변수를 이용해 파일로부터 글꼴 데이터를 불러온다 (codepoints가 NULL이고 codepointCount가 0인 경우, 기본 문자 집합 (default character set)에 해당하는 데이터만을 로드함)
    Font LoadFontFromImage(Image image, Color key, int firstChar);                        // XNA 스타일의 글꼴 이미지 파일로부터 글꼴 데이터를 불러온다
    Font LoadFontFromMemory(const char *fileType, const unsigned char *fileData, int dataSize, int fontSize, int *codepoints, int codepointCount); // 메모리 버퍼로부터 글꼴 데이터를 불러온다 (이때 fileType은 '.ttf' 등의 글꼴 파일 확장자를 가리킴)
    bool IsFontReady(Font font);                                                          // 글꼴이 사용 가능한지 확인한다
    GlyphInfo *LoadFontData(const unsigned char *fileData, int dataSize, int fontSize, int *codepoints, int codepointCount, int type); // Load font data for further use
    Image GenImageFontAtlas(const GlyphInfo *glyphs, Rectangle **glyphRecs, int glyphCount, int fontSize, int padding, int packMethod); // Generate image font atlas using chars info
    void UnloadFontData(GlyphInfo *glyphs, int glyphCount);                               // Unload font chars info data (RAM)
    void UnloadFont(Font font);                                                           // Unload font from GPU memory (VRAM)
    bool ExportFontAsCode(Font font, const char *fileName);                               // 주어진 글꼴을 C 코드 파일 형태로 내보낸다 (성공 시에 true를 반환함)

    // 문자열 출력 함수 (게임 화면에 문자열 그리기)
    void DrawFPS(int posX, int posY);                                                     // 게임의 현재 FPS를 출력한다
    void DrawText(const char *text, int posX, int posY, int fontSize, Color color);       // raylib의 기본 글꼴을 이용하여 문자열을 출력한다
    void DrawTextEx(Font font, const char *text, Vector2 position, float fontSize, float spacing, Color tint); // 사용자 지정 글꼴과 추가 매개 변수를 이용해 문자열을 출력한다
    void DrawTextPro(Font font, const char *text, Vector2 position, Vector2 origin, float rotation, float fontSize, float spacing, Color tint); // 사용자 지정 글꼴과 고급 매개 변수 (회전 각도 등)를 이용해 문자열을 출력한다
    void DrawTextCodepoint(Font font, int codepoint, Vector2 position, float fontSize, Color tint); // 1개의 유니코드 문자 (코드 포인트)를 출력한다
    void DrawTextCodepoints(Font font, const int *codepoints, int codepointCount, Vector2 position, float fontSize, float spacing, Color tint); // 여러 개의 유니코드 문자 (코드 포인트)를 출력한다

    // 문자열 및 글꼴 정보를 제공하는 함수
    void SetTextLineSpacing(int spacing);                                                 // 여러 줄의 문자열 (개행 문자 이용) 출력 시에 사용할 줄 간격을 설정한다
    int MeasureText(const char *text, int fontSize);                                      // raylib 기본 글꼴로 출력할 문자열의 전체 너비 (픽셀 개수)를 반환한다
    Vector2 MeasureTextEx(Font font, const char *text, float fontSize, float spacing);    // 사용자 지정 글꼴로 출력할 문자열의 전체 너비 (픽셀 개수)를 반환한다
    int GetGlyphIndex(Font font, int codepoint);                                          // Get glyph index position in font for a codepoint (unicode character), fallback to '?' if not found
    GlyphInfo GetGlyphInfo(Font font, int codepoint);                                     // Get glyph font info data for a codepoint (unicode character), fallback to '?' if not found
    Rectangle GetGlyphAtlasRec(Font font, int codepoint);                                 // Get glyph rectangle in font atlas for a codepoint (unicode character), fallback to '?' if not found

    // 유니코드 문자열 (unicode characters)의 코드 포인트 (codepoint) 관련 함수
    char *LoadUTF8(const int *codepoints, int length);                // Load UTF-8 text encoded from codepoints array
    void UnloadUTF8(char *text);                                      // Unload UTF-8 text encoded from codepoints array
    int *LoadCodepoints(const char *text, int *count);                // Load all codepoints from a UTF-8 text string, codepoints count returned by parameter
    void UnloadCodepoints(int *codepoints);                           // Unload codepoints data from memory
    int GetCodepointCount(const char *text);                          // Get total number of codepoints in a UTF-8 encoded string
    int GetCodepoint(const char *text, int *codepointSize);           // Get next codepoint in a UTF-8 encoded string, 0x3f('?') is returned on failure
    int GetCodepointNext(const char *text, int *codepointSize);       // Get next codepoint in a UTF-8 encoded string, 0x3f('?') is returned on failure
    int GetCodepointPrevious(const char *text, int *codepointSize);   // Get previous codepoint in a UTF-8 encoded string, 0x3f('?') is returned on failure
    const char *CodepointToUTF8(int codepoint, int *utf8Size);        // Encode one codepoint into UTF-8 byte array (array length returned as parameter)

    // 일반 문자열 (UTF-8 문자열이 아닌 바이트 문자열 (byte chars)) 관련 함수
    // 주의: 일부 함수는 내부적으로 동적 할당을 이용해 결과 문자열을 생성하므로, 사용 시에 주의해주세요!
    int TextCopy(char *dst, const char *src);                                             // 주어진 문자열을 다른 메모리 영역에 복사하고, 복사한 바이트 수를 반환한다
    bool TextIsEqual(const char *text1, const char *text2);                               // 두 문자열이 서로 같은지 확인한다
    unsigned int TextLength(const char *text);                                            // 문자열의 길이 (문자열에서 '\0' 문자가 첫 번째로 등장할 때까지의 문자 개수)를 반환한다
    const char *TextFormat(const char *text, ...);                                        // sprintf()처럼 형식화된 문자열을 반환한다
    const char *TextSubtext(const char *text, int position, int length);                  // 문자열의 일부분을 반환한다
    char *TextReplace(char *text, const char *replace, const char *by);                   // Replace text string (WARNING: memory must be freed!)
    char *TextInsert(const char *text, const char *insert, int position);                 // Insert text in a position (WARNING: memory must be freed!)
    const char *TextJoin(const char **textList, int count, const char *delimiter);        // 구분 문자 (delimiter)를 이용해 여러 개의 문자열을 하나로 합친다
    const char **TextSplit(const char *text, char delimiter, int *count);                 // 문자열을 여러 개의 부분 문자열로 나눈다
    void TextAppend(char *text, const char *append, int *position);                       // Append text at specific position and move cursor!
    int TextFindIndex(const char *text, const char *find);                                // 주어진 문자열에서 찾고자 하는 문자열이 첫 번째로 나타나는 위치를 반환한다
    const char *TextToUpper(const char *text);                      // 주어진 문자열의 모든 문자를 대문자로 변환한다
    const char *TextToLower(const char *text);                      // 주어진 문자열의 모든 문자를 소문자로 변환한다
    const char *TextToPascal(const char *text);                     // 주어진 문자열을 파스칼 표기법 (Pascal case notation)에 맞게 변환한다
    int TextToInteger(const char *text);                            // 문자열에서 0 이상의 정수 (integer) 값을 추출한다 (음수는 지원하지 않음)

