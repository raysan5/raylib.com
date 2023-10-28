
    // 글꼴 로딩/언로딩 함수
    Font GetFontDefault(void);                                                            // 기본 글꼴를 얻는다
    Font LoadFont(const char *fileName);                                                  // 글꼴를 GPU 메모리 내 파일로부터 불러온다 (비디오램)
    Font LoadFontEx(const char *fileName, int fontSize, int *fontChars, int glyphCount);  // 추가적인 매개변수와 함께 파일로부터 글꼴을 로드한다, 기본 문자 설정을 불러오기 위해 글꼴 문자열에는 NULL, 글자 수 에는 0을 사용한다
    Font LoadFontFromImage(Image image, Color key, int firstChar);                        // 이미지로부터 글꼴을 로드한다 (XNA 스타일)
    Font LoadFontFromMemory(const char *fileType, const unsigned char *fileData, int dataSize, int fontSize, int *fontChars, int glyphCount); // 메모리 버퍼에서 글꼴을 불러온다, 파일 형식은 확장자에 기반한다: 예시. '.ttf'
    bool IsFontReady(Font font);                                                          // 글꼴가 준비되었는지 확인한다
    GlyphInfo *LoadFontData(const unsigned char *fileData, int dataSize, int fontSize, int *fontChars, int glyphCount, int type); // 나중에 사용할 글꼴 데이터를 로드한다
    Image GenImageFontAtlas(const GlyphInfo *chars, Rectangle **recs, int glyphCount, int fontSize, int padding, int packMethod); // 문자 정보를 사용해 글꼴 아틀라스 이미지를 생성한다
    void UnloadFontData(GlyphInfo *chars, int glyphCount);                                // 글꼴 문자 정보 데이터를 언로드한다 (램)
    void UnloadFont(Font font);                                                           // 글꼴를 GPU 메모리에서 언로드한다 (비디오램)
    bool ExportFontAsCode(Font font, const char *fileName);                               // 글꼴를 코드 파일로 추출한다, 성공 시 참을 반환한다

    // 텍스트 그리기 함수
    void DrawFPS(int posX, int posY);                                                     // 현재 FPS를 그린다
    void DrawText(const char *text, int posX, int posY, int fontSize, Color color);       // 텍스트를 그린다 (기본 글꼴 사용)
    void DrawTextEx(Font font, const char *text, Vector2 position, float fontSize, float spacing, Color tint); // 글꼴를 비롯한 추가적인 매개변수를 사용해 텍스트를 그린다
    void DrawTextPro(Font font, const char *text, Vector2 position, Vector2 origin, float rotation, float fontSize, float spacing, Color tint); // 글꼴를 비롯한 전문적인 매개변수를 사용해 텍스트를 그린다 (회전각도)
    void DrawTextCodepoint(Font font, int codepoint, Vector2 position, float fontSize, Color tint); // 문자 한 개를 그린다 (코드포인트)
    void DrawTextCodepoints(Font font, const int *codepoints, int count, Vector2 position, float fontSize, float spacing, Color tint); // 여러 개의 문자를 그린다 (코드포인트)

    // 텍스트 글꼴 정보 함수
    int MeasureText(const char *text, int fontSize);                                      // 기본 글꼴를 위해 문자열의 폭(길이)을 측정한다
    Vector2 MeasureTextEx(Font font, const char *text, float fontSize, float spacing);    // 글꼴를 위해 문자열의 사이즈를 측정한다
    int GetGlyphIndex(Font font, int codepoint);                                          // 코드포인트를 위해 글꼴 안의 글자 인덱스 위치를 얻는다 (유니코드 문자), 만약 찾지 못할 경우 '?'를 반환한다
    GlyphInfo GetGlyphInfo(Font font, int codepoint);                                     // 코드포인트를 위해 글자 글꼴 정보 데이터를 얻는다 (유니코드 문자), 만약 찾지 못할 경우 '?'를 반환한다
    Rectangle GetGlyphAtlasRec(Font font, int codepoint);                                 // 코드포인트를 위해 글꼴 아틀라스에서 글자 (아틀라스 내 글자 이미지 위칫값을 가진)직사각형을 얻는다 (유니코드 문자), 만약 찾지 못할 경우 '?'를 반환한다

    // 텍스트 코드포인트 관리 함수 (유니코드 문자)
    char *LoadUTF8(const int *codepoints, int length);                // 코드포인트 배열로부터 인코딩된 UTF-8 문자를 불러온다
    void UnloadUTF8(char *text);                                      // 코드포인트 배열로부터 불러왔던 인코딩된 UTF-8 문자의 동적할당을 해제한다
    int *LoadCodepoints(const char *text, int *count);                // UTF-8 문자열로부터 모든 코드포인트를 불러온다, 매개변수에 의해 코드포인트의 개수가 반환된다
    void UnloadCodepoints(int *codepoints);                           // 메모리로부터 코드포인트 정보의 동적할당을 해제한다
    int GetCodepointCount(const char *text);                          // UTF-8로 인코딩된 문자열에서 코드포인트의 전체 개수를 얻는다
    int GetCodepoint(const char *text, int *codepointSize);           // UTF-8로 인코딩된 문자열에서 다음 코드포인트를 얻는다, 실패 시 0x3f('?') 를 반환한다
    int GetCodepointNext(const char *text, int *codepointSize);       // UTF-8로 인코딩된 문자열에서 다음 코드포인트를 얻는다, 실패 시 0x3f('?') 를 반환한다
    int GetCodepointPrevious(const char *text, int *codepointSize);   // UTF-8로 인코딩된 문자열에서 이전 코드포인트를 얻는다, 실패 시 0x3f('?') 를 반환한다
    const char *CodepointToUTF8(int codepoint, int *utf8Size);        // 하나의 코드포인트를 UTF-8 바이트 배열로 인코딩한다 (매개변수를 통해 배열의 길이가 반환된다)

    // 텍스트 문자열 관리 함수 (UTF-8 배열이 아닌 오직 바이트 문자)
    // 메모: 내부적으로 문자열을 반환받기 위해서는 몇몇 문자열들은 동적할당을 해야합니다, 조심해주세요! 
    int TextCopy(char *dst, const char *src);                                             // 하나의 문자열을 다른 문자열에 복사한다, 복사된 바이트를 반환한다
    bool TextIsEqual(const char *text1, const char *text2);                               // 두 문자열이 같은지 확인한다
    unsigned int TextLength(const char *text);                                            // 문자의 길이를 얻는다, 끝의 '\0'를 확인한다
    const char *TextFormat(const char *text, ...);                                        // 문자 서식 with variables (sprintf() style)
    const char *TextSubtext(const char *text, int position, int length);                  // 입력받은 인덱스를 이용해 문자열의 일부를 얻는다
    char *TextReplace(char *text, const char *replace, const char *by);                   // 문자열의 문자를 바꾼다 (경고: 동적 할당을 해제해야 합니다!)
    char *TextInsert(const char *text, const char *insert, int position);                 // 입력받은 위치에 문자를 삽입한다 (경고: 동적 할당을 해제해야 합니다!)
    const char *TextJoin(const char **textList, int count, const char *delimiter);        // Join text strings with delimiter
    const char **TextSplit(const char *text, char delimiter, int *count);                 // 문자열을 여러 개의 문자열로 나눈다
    void TextAppend(char *text, const char *append, int *position);                       // 특정한 위치에 문자를 추가하고 커서를 이동한다
    int TextFindIndex(const char *text, const char *find);                                // 문자열 내에서 찾고 있는 문자의 위치를 찾는다
    const char *TextToUpper(const char *text);                      // 제공된 문자열의 대문자 버전을 얻는다
    const char *TextToLower(const char *text);                      // 제공된 문자열의 소문자 버전을 얻는다
    const char *TextToPascal(const char *text);                     // 제공된 문자열의 파스칼 표기 버전을 얻는다
    int TextToInteger(const char *text);                            // 텍스트로부터 정수값을 얻는다 (옳지 않은 값은 지원하지 않는다)

