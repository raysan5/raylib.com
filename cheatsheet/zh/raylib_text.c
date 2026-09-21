    //字体 Load/卸载功能
    Font GetFontDefault(void);                                                              //获取默认字体
    Font LoadFont(const char *fileName);                                                    //将字体从文件加载到GPU内存(VRAM)
    Font LoadFontEx(const char *fileName, int fontSize, const int *codepoints, int codepointCount); //使用扩展参数从文件中LoadFont, fontChars使用NULL, glyphCount使用0来加载默认字符集
    Font LoadFontFromImage(Image image, Color key, int firstChar);                          //从图像 LoadFont(XNA样式)
    Font LoadFontFromMemory(const char *fileType, const unsigned char *fileData, int dataSize, int fontSize, const int *codepoints, int codepointCount); //从内存缓冲区LoadFont, fileType引用扩展名：即'。ttf'
    bool IsFontValid(Font font);                                                            // Check if a font is valid (font data loaded, WARNING: GPU texture not checked)
    GlyphInfo *LoadFontData(const unsigned char *fileData, int dataSize, int fontSize, const int *codepoints, int codepointCount, int type, int *glyphCount); //LoadFont数据以供进一步使用
    Image GenImageFontAtlas(const GlyphInfo *glyphs, Rectangle **glyphRecs, int glyphCount, int fontSize, int padding, int packMethod); //使用字符信息生成图像 字体图集
    void UnloadFontData(GlyphInfo *glyphs, int glyphCount);                                 //卸载字体字符信息数据(RAM)
    void UnloadFont(Font font);                                                             //从GPU内存(VRAM)卸载字体
    bool ExportFontAsCode(Font font, const char *fileName);                                 //将字体导出为代码文件, 成功时返回true
    
    //文本绘图功能
    void DrawFPS(int posX, int posY);                                                       //绘制当前FPS
    void DrawText(const char *text, int posX, int posY, int fontSize, Color color);         //绘制文本(使用默认字体)
    void DrawTextEx(Font font, const char *text, Vector2 position, float fontSize, float spacing, Color tint);   //使用Font和其他参数绘制文本
    void DrawTextPro(Font font, const char *text, Vector2 position, Vector2 origin, float rotation, float fontSize, float spacing, Color tint); //使用字体和pro参数绘制文本(旋转)
    void DrawTextCodepoint(Font font, int codepoint, Vector2 position, float fontSize, Color tint);    //绘制一个字符(代码点)
    void DrawTextCodepoints(Font font, const int *codepoints, int codepointCount, Vector2 position, float fontSize, float spacing, Color tint); //绘制多个字符(代码点)
    
    //文本字体信息功能
    void SetTextLineSpacing(int spacing);                                                   // Set vertical line spacing when drawing with line-breaks
    int MeasureText(const char *text, int fontSize);                                        //测量默认字体font的字符串宽度
    Vector2 MeasureTextEx(Font font, const char *text, float fontSize, float spacing);      //测量字体的字符串大小
    Vector2 MeasureTextCodepoints(Font font, const int *codepoints, int length, float fontSize, float spacing); // Measure string size for an existing array of codepoints for Font
    int GetGlyphIndex(Font font, int codepoint);                                            //获取代码点(unicode字符)Font中的字形索引位置, 回退到“？”如果未找到
    GlyphInfo GetGlyphInfo(Font font, int codepoint);                                       //获取代码点(unicode字符)的字形字体信息数据, 回退到“？”如果未找到
    Rectangle GetGlyphAtlasRec(Font font, int codepoint);                                   //获取代码点(unicode字符)字体图集中的字形Rectangle, 回退到“？”如果未找到
    
    //文本代码点管理功能(unicode字符)
    char *LoadUTF8(const int *codepoints, int length);                                      //将文本作为代码点数组编码为UTF-8文本字符串(警告：必须释放内存！)
    void UnloadUTF8(char *text);                                                            // Unload UTF-8 text encoded from codepoints array
    int *LoadCodepoints(const char *text, int *count);                                      //从UTF-8文本字符串加载所有代码点, 参数返回代码点计数
    void UnloadCodepoints(int *codepoints);                                                 //从内存中卸载代码点数据
    int GetCodepointCount(const char *text);                                                //获取UTF-8编码字符串中的代码点总数
    int GetCodepoint(const char *text, int *codepointSize);                                 //获取UTF-8编码字符串中的下一个代码点, 失败时返回0x3f(“？”)
    int GetCodepointNext(const char *text, int *codepointSize);                             // Get next codepoint in a UTF-8 encoded string, 0x3f('?') is returned on failure
    int GetCodepointPrevious(const char *text, int *codepointSize);                         // Get previous codepoint in a UTF-8 encoded string, 0x3f('?') is returned on failure
    const char *CodepointToUTF8(int codepoint, int *utf8Size);                              //将一个代码点编码为UTF-8字节数组(数组长度作为参数返回)

    //文本字符串管理功能(没有UTF-8字符串, 只有字节字符)
    //注意：有些字符串在内部为返回的字符串分配内存, 请小心！
    char **LoadTextLines(const char *text, int *count);                                     // Load text as separate lines ('\n')
    void UnloadTextLines(char **text, int lineCount);                                       // Unload text lines
    int TextCopy(char *dst, const char *src);                                               //将一个字符串复制到另一个字符串, 返回复制的字节
    bool TextIsEqual(const char *text1, const char *text2);                                 //检查两个文本字符串是否相等
    unsigned int TextLength(const char *text);                                              //获取文本长度, 检查“\0”结尾
    const char *TextFormat(const char *text, ...);                                          //带变量的文本格式(sprintf()样式)
    const char *TextSubtext(const char *text, int position, int length);                    //获取一段文本字符串
    const char *TextRemoveSpaces(const char *text);                                         // Remove text spaces, concat words
    char *GetTextBetween(const char *text, const char *begin, const char *end);             // Get text between two strings
    char *TextReplace(const char *text, const char *search, const char *replacement);       //替换文本字符串(警告：必须释放内存！)
    char *TextReplaceAlloc(const char *text, const char *search, const char *replacement);  // Replace text string with new string, memory must be MemFree()
    char *TextReplaceBetween(const char *text, const char *begin, const char *end, const char *replacement); // Replace text between two specific strings
    char *TextReplaceBetweenAlloc(const char *text, const char *begin, const char *end, const char *replacement); // Replace text between two specific strings, memory must be MemFree()
    char *TextInsert(const char *text, const char *insert, int position);                   //在某个位置插入文本(警告：必须释放内存！)
    char *TextInsertAlloc(const char *text, const char *insert, int position);              // Insert text in a defined byte position, memory must be MemFree()
    char *TextJoin(char **textList, int count, const char *delimiter);                      //使用分隔符连接文本字符串
    char **TextSplit(const char *text, char delimiter, int *count);                         //将文本拆分为多个字符串
    void TextAppend(char *text, const char *append, int *position);                         //在特定位置附加文本并移动鼠标光标！
    int TextFindIndex(const char *text, const char *search);                                //查找字符串中出现的第一个文本
    char *TextToUpper(const char *text);                                                    //获取所提供字符串的大写版本
    char *TextToLower(const char *text);                                                    //获取所提供字符串的小写版本
    char *TextToPascal(const char *text);                                                   //获取所提供字符串的Pascal大小写符号版本
    char *TextToSnake(const char *text);                                                    // Get Snake case notation version of provided string
    char *TextToCamel(const char *text);                                                    // Get Camel case notation version of provided string
    int TextToInteger(const char *text);                                                    //从文本中获取整数值(不支持负值)
    float TextToFloat(const char *text);                                                    // Get float value from text
    
