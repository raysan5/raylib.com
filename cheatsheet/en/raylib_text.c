    // Font loading/unloading functions
    Font GetFontDefault(void);                                                            // Get the default Font
    Font LoadFont(const char *fileName);                                                  // Load font from file into GPU memory (VRAM)
    Font LoadFontEx(const char *fileName, int fontSize, const int *codepoints, int codepointCount); // Load font from file with extended parameters, use NULL for codepoints and 0 for codepointCount to load the default character set, font size is provided in pixels height
    Font LoadFontFromImage(Image image, Color key, int firstChar);                        // Load font from Image (XNA style)
    Font LoadFontFromMemory(const char *fileType, const unsigned char *fileData, int dataSize, int fontSize, const int *codepoints, int codepointCount); // Load font from memory buffer, fileType refers to extension: i.e. '.ttf'
    bool IsFontValid(Font font);                                                          // Check if a font is valid (font data loaded, WARNING: GPU texture not checked)
    GlyphInfo *LoadFontData(const unsigned char *fileData, int dataSize, int fontSize, const int *codepoints, int codepointCount, int type, int *glyphCount); // Load font data for further use
    Image GenImageFontAtlas(const GlyphInfo *glyphs, Rectangle **glyphRecs, int glyphCount, int fontSize, int padding, int packMethod); // Generate image font atlas using chars info
    void UnloadFontData(GlyphInfo *glyphs, int glyphCount);                               // Unload font chars info data (RAM)
    void UnloadFont(Font font);                                                           // Unload font from GPU memory (VRAM)
    bool ExportFontAsCode(Font font, const char *fileName);                               // Export font as code file, returns true on success

    // Text drawing functions
    void DrawFPS(int posX, int posY);                                                     // Draw current FPS
    void DrawText(const char *text, int posX, int posY, int fontSize, Color color);       // Draw text (using default font)
    void DrawTextEx(Font font, const char *text, Vector2 position, float fontSize, float spacing, Color tint); // Draw text using font and additional parameters
    void DrawTextPro(Font font, const char *text, Vector2 position, Vector2 origin, float rotation, float fontSize, float spacing, Color tint); // Draw text using Font and pro parameters (rotation)
    void DrawTextCodepoint(Font font, int codepoint, Vector2 position, float fontSize, Color tint); // Draw one character (codepoint)
    void DrawTextCodepoints(Font font, const int *codepoints, int codepointCount, Vector2 position, float fontSize, float spacing, Color tint); // Draw multiple character (codepoint)

    // Text font info functions
    void SetTextLineSpacing(int spacing);                                                 // Set vertical line spacing when drawing with line-breaks
    int MeasureText(const char *text, int fontSize);                                      // Measure string width for default font
    Vector2 MeasureTextEx(Font font, const char *text, float fontSize, float spacing);    // Measure string size for Font
    Vector2 MeasureTextCodepoints(Font font, const int *codepoints, int length, float fontSize, float spacing); // Measure string size for an existing array of codepoints for Font
    int GetGlyphIndex(Font font, int codepoint);                                          // Get glyph index position in font for a codepoint (unicode character), fallback to '?' if not found
    GlyphInfo GetGlyphInfo(Font font, int codepoint);                                     // Get glyph font info data for a codepoint (unicode character), fallback to '?' if not found
    Rectangle GetGlyphAtlasRec(Font font, int codepoint);                                 // Get glyph rectangle in font atlas for a codepoint (unicode character), fallback to '?' if not found

    // Text codepoints management functions (unicode characters)
    char *LoadUTF8(const int *codepoints, int length);                                    // Load UTF-8 text encoded from codepoints array
    void UnloadUTF8(char *text);                                                          // Unload UTF-8 text encoded from codepoints array
    int *LoadCodepoints(const char *text, int *count);                                    // Load all codepoints from a UTF-8 text string, codepoints count returned by parameter
    void UnloadCodepoints(int *codepoints);                                               // Unload codepoints data from memory
    int GetCodepointCount(const char *text);                                              // Get total number of codepoints in a UTF-8 encoded string
    int GetCodepoint(const char *text, int *codepointSize);                               // Get next codepoint in a UTF-8 encoded string, 0x3f('?') is returned on failure
    int GetCodepointNext(const char *text, int *codepointSize);                           // Get next codepoint in a UTF-8 encoded string, 0x3f('?') is returned on failure
    int GetCodepointPrevious(const char *text, int *codepointSize);                       // Get previous codepoint in a UTF-8 encoded string, 0x3f('?') is returned on failure
    const char *CodepointToUTF8(int codepoint, int *utf8Size);                            // Encode one codepoint into UTF-8 byte array (array length returned as parameter)

    // Text strings management functions (no UTF-8 strings, only byte chars)
    // WARNING 1: Most of these functions use internal static buffers[], it's recommended to store returned data on user-side for re-use
    // WARNING 2: Some functions allocate memory internally for the returned strings, those strings must be freed by user using MemFree()
    char **LoadTextLines(const char *text, int *count);                                   // Load text as separate lines ('\n')
    void UnloadTextLines(char **text, int lineCount);                                     // Unload text lines
    int TextCopy(char *dst, const char *src);                                             // Copy one string to another, returns bytes copied
    bool TextIsEqual(const char *text1, const char *text2);                               // Check if two text string are equal
    unsigned int TextLength(const char *text);                                            // Get text length, checks for '\0' ending
    const char *TextFormat(const char *text, ...);                                        // Text formatting with variables (sprintf() style)
    const char *TextSubtext(const char *text, int position, int length);                  // Get a piece of a text string
    const char *TextRemoveSpaces(const char *text);                                       // Remove text spaces, concat words
    char *GetTextBetween(const char *text, const char *begin, const char *end);           // Get text between two strings
    char *TextReplace(const char *text, const char *search, const char *replacement);     // Replace text string with new string
    char *TextReplaceAlloc(const char *text, const char *search, const char *replacement); // Replace text string with new string, memory must be MemFree()
    char *TextReplaceBetween(const char *text, const char *begin, const char *end, const char *replacement); // Replace text between two specific strings
    char *TextReplaceBetweenAlloc(const char *text, const char *begin, const char *end, const char *replacement); // Replace text between two specific strings, memory must be MemFree()
    char *TextInsert(const char *text, const char *insert, int position);                 // Insert text in a defined byte position
    char *TextInsertAlloc(const char *text, const char *insert, int position);            // Insert text in a defined byte position, memory must be MemFree()
    char *TextJoin(char **textList, int count, const char *delimiter);                    // Join text strings with delimiter
    char **TextSplit(const char *text, char delimiter, int *count);                       // Split text into multiple strings, using MAX_TEXTSPLIT_COUNT static strings
    void TextAppend(char *text, const char *append, int *position);                       // Append text at specific position and move cursor
    int TextFindIndex(const char *text, const char *search);                              // Find first text occurrence within a string, -1 if not found
    char *TextToUpper(const char *text);                                                  // Get upper case version of provided string
    char *TextToLower(const char *text);                                                  // Get lower case version of provided string
    char *TextToPascal(const char *text);                                                 // Get Pascal case notation version of provided string
    char *TextToSnake(const char *text);                                                  // Get Snake case notation version of provided string
    char *TextToCamel(const char *text);                                                  // Get Camel case notation version of provided string
    int TextToInteger(const char *text);                                                  // Get integer value from text
    float TextToFloat(const char *text);                                                  // Get float value from text

