
    // Font loading/unloading functions
    Font GetFontDefault(void);                                                                        // Get the default Font
    Font LoadFont(const char *fileName);                                                              // Load font from file into GPU memory (VRAM)
    Font LoadFontEx(const char *fileName, int fontSize, int *fontChars, int charsCount);              // Load font from file with extended parameters
    Font LoadFontFromImage(Image image, Color key, int firstChar);                                    // Load font from Image (XNA style)
    CharInfo *LoadFontData(const char *fileName, int fontSize, int *fontChars, int charsCount, int type); // Load font data for further use
    Image GenImageFontAtlas(const CharInfo *chars, Rectangle **recs, int charsCount, int fontSize, int padding, int packMethod);  // Generate image font atlas using chars info
    void UnloadFont(Font font);                                                                       // Unload Font from GPU memory (VRAM)
    
    // Text drawing functions
    void DrawFPS(int posX, int posY);                                                                 // Shows current FPS
    void DrawText(const char *text, int posX, int posY, int fontSize, Color color);                   // Draw text (using default font)
    void DrawTextEx(Font font, const char *text, Vector2 position, float fontSize, float spacing, Color tint);                // Draw text using font and additional parameters
    void DrawTextRec(Font font, const char *text, Rectangle rec, float fontSize, float spacing, bool wordWrap, Color tint);   // Draw text using font inside rectangle limits
    void DrawTextRecEx(Font font, const char *text, Rectangle rec, float fontSize, float spacing, bool wordWrap, Color tint,
                    int selectStart, int selectLength, Color selectTint, Color selectBackTint);       // Draw text using font inside rectangle limits with support for text selection
    void DrawTextCodepoint(Font font, int codepoint, Vector2 position, float scale, Color tint);      // Draw one character (codepoint)
    
    // Text misc. functions
    int MeasureText(const char *text, int fontSize);                                                  // Measure string width for default font
    Vector2 MeasureTextEx(Font font, const char *text, float fontSize, float spacing);                // Measure string size for Font
    int GetGlyphIndex(Font font, int codepoint);                                                      // Get index position for a unicode character on font
    
    // Text strings management functions (no utf8 strings, only byte chars)
    // NOTE: Some strings allocate memory internally for returned strings, just be careful!
    int TextCopy(char *dst, const char *src);                                                         // Copy one string to another, returns bytes copied
    bool TextIsEqual(const char *text1, const char *text2);                                           // Check if two text string are equal
    unsigned int TextLength(const char *text);                                                        // Get text length, checks for '\0' ending
    const char *TextFormat(const char *text, ...);                                                    // Text formatting with variables (sprintf style)
    const char *TextSubtext(const char *text, int position, int length);                              // Get a piece of a text string
    char *TextReplace(char *text, const char *replace, const char *by);                               // Replace text string (memory must be freed!)
    char *TextInsert(const char *text, const char *insert, int position);                             // Insert text in a position (memory must be freed!)
    const char *TextJoin(const char **textList, int count, const char *delimiter);                    // Join text strings with delimiter
    const char **TextSplit(const char *text, char delimiter, int *count);                             // Split text into multiple strings
    void TextAppend(char *text, const char *append, int *position);                                   // Append text at specific position and move cursor!
    int TextFindIndex(const char *text, const char *find);                                            // Find first text occurrence within a string
    const char *TextToUpper(const char *text);                                                        // Get upper case version of provided string
    const char *TextToLower(const char *text);                                                        // Get lower case version of provided string
    const char *TextToPascal(const char *text);                                                       // Get Pascal case notation version of provided string
    int TextToInteger(const char *text);                                                              // Get integer value from text (negative values not supported)
    char *TextToUtf8(int *codepoints, int length);                                                    // Encode text codepoint into utf8 text (memory must be freed!)
                                                                                                      
    // UTF8 text strings management functions                                                         
    int *GetCodepoints(const char *text, int *count);                                                 // Get all codepoints in a string, codepoints count returned by parameters
    int GetCodepointsCount(const char *text);                                                         // Get total number of characters (codepoints) in a UTF8 encoded string
    int GetNextCodepoint(const char *text, int *bytesProcessed);                                      // Returns next codepoint in a UTF8 encoded string; 0x3f('?') is returned on failure
    const char *CodepointToUtf8(int codepoint, int *byteLength);                                      // Encode codepoint into utf8 text (char array length returned as parameter)

