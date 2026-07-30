    // フォントの読み込み／アンロード関数
    Font GetFontDefault(void);                                                            // デフォルトフォントを取得する
    Font LoadFont(const char *fileName);                                                  // ファイルからGPUメモリ（VRAM）へフォントを読み込む
    Font LoadFontEx(const char *fileName, int fontSize, const int *codepoints, int codepointCount); // 拡張パラメーターを指定してファイルからフォントを読み込む。デフォルト文字セットを読み込むにはcodepointsにNULL、codepointCountに0を指定し、フォントサイズはピクセル単位の高さで指定する
    Font LoadFontFromImage(Image image, Color key, int firstChar);                        // Imageからフォントを読み込む（XNA形式）
    Font LoadFontFromMemory(const char *fileType, const unsigned char *fileData, int dataSize, int fontSize, const int *codepoints, int codepointCount); // メモリバッファからフォントを読み込む。fileTypeには'.ttf'などの拡張子を指定する
    bool IsFontValid(Font font);                                                          // フォントが有効か確認する（フォントデータは読み込み済み。警告: GPUテクスチャは確認しない）
    GlyphInfo *LoadFontData(const unsigned char *fileData, int dataSize, int fontSize, const int *codepoints, int codepointCount, int type, int *glyphCount); // 後で使用するためにフォントデータを読み込む
    Image GenImageFontAtlas(const GlyphInfo *glyphs, Rectangle **glyphRecs, int glyphCount, int fontSize, int padding, int packMethod); // 文字情報を使用してフォントアトラス画像を生成する
    void UnloadFontData(GlyphInfo *glyphs, int glyphCount);                               // フォントの文字情報データをRAMからアンロードする
    void UnloadFont(Font font);                                                           // GPUメモリ（VRAM）からフォントをアンロードする
    bool ExportFontAsCode(Font font, const char *fileName);                               // フォントをコードファイルとしてエクスポートし、成功した場合はtrueを返す

    // テキストの描画関数
    void DrawFPS(int posX, int posY);                                                     // 現在のFPS(フレームレート)を描画する
    void DrawText(const char *text, int posX, int posY, int fontSize, Color color);       // テキストを描画する（デフォルトフォントを使用）
    void DrawTextEx(Font font, const char *text, Vector2 position, float fontSize, float spacing, Color tint); // フォントと追加パラメーターを指定してテキストを描画する
    void DrawTextPro(Font font, const char *text, Vector2 position, Vector2 origin, float rotation, float fontSize, float spacing, Color tint); // フォントと高度なパラメーター（回転）を指定してテキストを描画する
    void DrawTextCodepoint(Font font, int codepoint, Vector2 position, float fontSize, Color tint); // 1文字（コードポイント）を描画する
    void DrawTextCodepoints(Font font, const int *codepoints, int codepointCount, Vector2 position, float fontSize, float spacing, Color tint); // 複数の文字（コードポイント）を描画する

    // テキストのフォント情報関数
    void SetTextLineSpacing(int spacing);                                                 // 改行を含むテキストを描画するときの垂直行間を設定する
    int MeasureText(const char *text, int fontSize);                                      // デフォルトフォントでの文字列の幅を測定する
    Vector2 MeasureTextEx(Font font, const char *text, float fontSize, float spacing);    // 指定したフォントでの文字列のサイズを測定する
    Vector2 MeasureTextCodepoints(Font font, const int *codepoints, int length, float fontSize, float spacing); // 指定したフォントで既存のコードポイント配列の文字列サイズを測定する
    int GetGlyphIndex(Font font, int codepoint);                                          // コードポイント（Unicode文字）に対応するフォント内のグリフインデックスを取得し、見つからない場合は'?'へフォールバックする
    GlyphInfo GetGlyphInfo(Font font, int codepoint);                                     // コードポイント（Unicode文字）に対応するグリフのフォント情報を取得し、見つからない場合は'?'へフォールバックする
    Rectangle GetGlyphAtlasRec(Font font, int codepoint);                                 // コードポイント（Unicode文字）に対応するフォントアトラス内のグリフ矩形を取得し、見つからない場合は'?'へフォールバックする

    // テキストのコードポイント管理関数（Unicode文字）
    char *LoadUTF8(const int *codepoints, int length);                                    // コードポイント配列をエンコードしたUTF-8テキストを読み込む
    void UnloadUTF8(char *text);                                                          // コードポイント配列からエンコードしたUTF-8テキストをアンロードする
    int *LoadCodepoints(const char *text, int *count);                                    // UTF-8テキスト文字列からすべてのコードポイントを読み込み、コードポイント数を引数で返す
    void UnloadCodepoints(int *codepoints);                                               // コードポイントデータをメモリからアンロードする
    int GetCodepointCount(const char *text);                                              // UTF-8エンコード文字列内のコードポイント総数を取得する
    int GetCodepoint(const char *text, int *codepointSize);                               // UTF-8エンコード文字列内の次のコードポイントを取得し、失敗した場合は0x3f（'?'）を返す
    int GetCodepointNext(const char *text, int *codepointSize);                           // UTF-8エンコード文字列内の次のコードポイントを取得し、失敗した場合は0x3f（'?'）を返す
    int GetCodepointPrevious(const char *text, int *codepointSize);                       // UTF-8エンコード文字列内の前のコードポイントを取得し、失敗した場合は0x3f（'?'）を返す
    const char *CodepointToUTF8(int codepoint, int *utf8Size);                            // 1つのコードポイントをUTF-8バイト配列へエンコードし、配列長を引数で返す

    // テキスト文字列の管理関数（UTF-8文字列ではなく、バイト文字のみ）
    // 警告1: これらの関数の大半は内部の静的バッファー[]を使用するため、再利用する戻り値はユーザー側で保存することを推奨
    // 警告2: 一部の関数は戻り値の文字列用メモリを内部で割り当てるため、ユーザーがMemFree()で解放する必要がある
    char **LoadTextLines(const char *text, int *count);                                   // テキストを個別の行（'\n'）として読み込む
    void UnloadTextLines(char **text, int lineCount);                                     // テキスト行をアンロードする
    int TextCopy(char *dst, const char *src);                                             // 文字列を別の文字列へコピーし、コピーしたバイト数を返す
    bool TextIsEqual(const char *text1, const char *text2);                               // 2つのテキスト文字列が等しいか確認する
    unsigned int TextLength(const char *text);                                            // '\0'終端を確認してテキストの長さを取得する
    const char *TextFormat(const char *text, ...);                                        // 変数を使用してテキストを整形する（sprintf()形式）
    const char *TextSubtext(const char *text, int position, int length);                  // テキスト文字列の一部を取得する
    const char *TextRemoveSpaces(const char *text);                                       // テキスト内の空白を削除して単語を連結する
    char *GetTextBetween(const char *text, const char *begin, const char *end);           // 2つの文字列の間にあるテキストを取得する
    char *TextReplace(const char *text, const char *search, const char *replacement);     // テキスト文字列を新しい文字列に置換する
    char *TextReplaceAlloc(const char *text, const char *search, const char *replacement); // テキスト文字列を新しい文字列に置換する。メモリはMemFree()で解放する必要がある
    char *TextReplaceBetween(const char *text, const char *begin, const char *end, const char *replacement); // 指定した2つの文字列の間にあるテキストを置換する
    char *TextReplaceBetweenAlloc(const char *text, const char *begin, const char *end, const char *replacement); // 指定した2つの文字列の間にあるテキストを置換する。メモリはMemFree()で解放する必要がある
    char *TextInsert(const char *text, const char *insert, int position);                 // 指定したバイト位置にテキストを挿入する
    char *TextInsertAlloc(const char *text, const char *insert, int position);            // 指定したバイト位置にテキストを挿入する。メモリはMemFree()で解放する必要がある
    char *TextJoin(char **textList, int count, const char *delimiter);                    // 区切り文字列を使ってテキスト文字列を結合する
    char **TextSplit(const char *text, char delimiter, int *count);                       // テキストを複数の文字列に分割し、MAX_TEXTSPLIT_COUNT個の静的文字列を使用する
    void TextAppend(char *text, const char *append, int *position);                       // 指定位置にテキストを追加してカーソルを移動する
    int TextFindIndex(const char *text, const char *search);                              // 文字列内でテキストが最初に出現する位置を検索し、見つからない場合は-1を返す
    char *TextToUpper(const char *text);                                                  // 指定した文字列を大文字に変換したものを取得する
    char *TextToLower(const char *text);                                                  // 指定した文字列を小文字に変換したものを取得する
    char *TextToPascal(const char *text);                                                 // 指定した文字列をパスカルケース表記に変換したものを取得する
    char *TextToSnake(const char *text);                                                  // 指定した文字列をスネークケース表記に変換したものを取得する
    char *TextToCamel(const char *text);                                                  // 指定した文字列をキャメルケース表記に変換したものを取得する
    int TextToInteger(const char *text);                                                  // テキストから整数値を取得する
    float TextToFloat(const char *text);                                                  // テキストから浮動小数点値を取得する
