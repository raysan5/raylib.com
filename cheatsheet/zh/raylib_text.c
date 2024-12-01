
    //模块：rtext
    //字体 Load/卸载功能
    Font GetFontDefault(void);                                                              //获取默认字体
    Font LoadFont(const char *fileName);                                                    //将字体从文件加载到GPU内存(VRAM)
    Font LoadFontEx(const char *fileName, int fontSize, int *fontChars, int glyphCount);    //使用扩展参数从文件中LoadFont, fontChars使用NULL, glyphCount使用0来加载默认字符集
    Font LoadFontFromImage(Image Image, Color key, int firstChar);                          //从图像 LoadFont(XNA样式)
    Font LoadFontFromMemory(const char *fileType, const unsigned char *fileData, int dataSize, int fontSize, int *fontChars, int glyphCount); //从内存缓冲区LoadFont, fileType引用扩展名：即'。ttf'
    GlyphInfo *LoadFontData(const unsigned char *fileData, int dataSize, int fontSize, int *fontChars, int glyphCount, int type); //LoadFont数据以供进一步使用
    Image GenImageFontAtlas(const GlyphInfo *char, Rectangle **recs, int glyphCount, int fontSize, int padding, int packMethod); //使用字符信息生成图像 字体图集
    void UnloadFontData(GlyphInfo *字符, int glyphCount);                                    //卸载字体字符信息数据(RAM)
    void UnloadFont(Font 字体);                                                              //从GPU内存(VRAM)卸载字体
    bool ExportFontAsCode(Font, const char *fileName);                                      //将字体导出为代码文件, 成功时返回true
    
    //文本绘图功能
    void DrawFPS(int posX, int posY);                                                       //绘制当前FPS
    void DrawText(const char *text, int posX, int posY, int fontSize, Color Color);         //绘制文本(使用默认字体)
    void DrawTextEx(Font Font, const char *文本, Vector2位置, float Font大小, float间距, Color Color);   //使用Font和其他参数绘制文本
    void DrawTextPro(Font Font, const char *文本, Vector2位置, Vector2原点, float旋转, float Font大小, float间距, Color Color); //使用字体和pro参数绘制文本(旋转)
    void DrawTextCodepoint(Font Font, int代码点, Vector2位置, float Font大小, Color Color);    //绘制一个字符(代码点)
    void DrawTextCodepoints(Font Font, constint *代码点, int计数, Vector2位置, float Font大小, float间距, Color Color); //绘制多个字符(代码点)
    
    //文本字体信息功能
    int MeasureText(const char *text, int fontSize);                                        //测量默认字体font的字符串宽度
    Vector2 MeasureTextEx(Font, const char *文本, float Font大小, float间距);                    //测量字体的字符串大小
    int GetGlyphIndex(Font, int代码点);                                                      //获取代码点(unicode字符)Font中的字形索引位置, 回退到“？”如果未找到
    GlyphInfo GetGlyphInfo(Font, int码点);                                                  //获取代码点(unicode字符)的字形字体信息数据, 回退到“？”如果未找到
    Rectangle GetGlyphAtlasRec(Font, int代码点);                                             //获取代码点(unicode字符)字体图集中的字形Rectangle, 回退到“？”如果未找到
    
    //文本代码点管理功能(unicode字符)
    int *LoadCodepoints(const char *text, int *count);                                     //从UTF-8文本字符串加载所有代码点, 参数返回代码点计数
    void UnloadCodepoints(int *代码点);                                                     //从内存中卸载代码点数据
    int GetCodepointCount(const char *text);                                               //获取UTF-8编码字符串中的代码点总数
    int GetCodepoint(const char *text, int *bytesProcessed);                               //获取UTF-8编码字符串中的下一个代码点, 失败时返回0x3f(“？”)
    const char *CodepointToUTF8(int码点, int *字节大小);                                     //将一个代码点编码为UTF-8字节数组(数组长度作为参数返回)
    char *TextCodepointsToUTF8(constint *码点, int长度);                                    //将文本作为代码点数组编码为UTF-8文本字符串(警告：必须释放内存！)
    
    //文本字符串管理功能(没有UTF-8字符串, 只有字节字符)
    //注意：有些字符串在内部为返回的字符串分配内存, 请小心！
    int TextCopy(char *dst, const char *src);                                       //将一个字符串复制到另一个字符串, 返回复制的字节
    bool TextIsEqual(const char *text1, const char *text2);                         //检查两个文本字符串是否相等
    unsigned int TextLength(const char *text);                                      //获取文本长度, 检查“\0”结尾
    const char *TextFormat(const char *text, …);                                    //带变量的文本格式(sprintf()样式)
    const char *TextSubtext(const char *text, int位置, int长度);                      //获取一段文本字符串
    char *TextReplace(char *文本, constchar *替换, constchar *by);                    //替换文本字符串(警告：必须释放内存！)
    char *TextInsert(const char *文本, const char *insert, int位置);                  //在某个位置插入文本(警告：必须释放内存！)
    const char *TextJoin(const char * *textList, int count, const char *分隔符);      //使用分隔符连接文本字符串
    const char * *TextSplit(const char *文本, 字符分隔符, int *计数);                    //将文本拆分为多个字符串
    void TextAppend(char *text, const char *append, int *position);                 //在特定位置附加文本并移动鼠标光标！
    int TextFindIndex(const char *text, const char *find);                          //查找字符串中出现的第一个文本
    const char *TextToUpper(const char *text);                                      //获取所提供字符串的大写版本
    const char *TextToLower(const char *text);                                      //获取所提供字符串的小写版本
    const char *TextToPascal(const char *文本);                                      //获取所提供字符串的Pascal大小写符号版本
    int TextToInteger(const char *文本);                                             //从文本中获取整数值(不支持负值)
    
