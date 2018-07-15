
    // Font loading/unloading functions
    Font GetFontDefault(void);                                                                        // Get the default Font
    Font LoadFont(const char *fileName);                                                              // Load font from file into GPU memory (VRAM)
    Font LoadFontEx(const char *fileName, int fontSize, int charsCount, int *fontChars);              // Load font from file with extended parameters
    CharInfo *LoadFontData(const char *fileName, int fontSize, int *fontChars, int charsCount, bool sdf); // Load font data for further use
    Image GenImageFontAtlas(CharInfo *chars, int fontSize, int charsCount, int padding, int packMethod);  // Generate image font atlas using chars info
    void UnloadFont(Font font);                                                                       // Unload Font from GPU memory (VRAM)

    // Text drawing functions
    void DrawFPS(int posX, int posY);                                                                 // Shows current FPS
    void DrawText(const char *text, int posX, int posY, int fontSize, Color color);                   // Draw text (using default font)
    void DrawTextEx(Font font, const char* text, Vector2 position, float fontSize, float spacing, Color tint); // Draw text using font and additional parameters

    // Text misc. functions
    int MeasureText(const char *text, int fontSize);                                                  // Measure string width for default font
    Vector2 MeasureTextEx(Font font, const char *text, float fontSize, float spacing);                // Measure string size for Font
    const char *FormatText(const char *text, ...);                                                    // Formatting of text with variables to 'embed'
    const char *SubText(const char *text, int position, int length);                                  // Get a piece of a text string
    int GetGlyphIndex(Font font, int character);                                                      // Get index position for a unicode character on font

