
    // ウィンドウ関連の関数
    void InitWindow(int width, int height, const char *title);  // ウィンドウとOpenGLコンテキストを初期化する
    void CloseWindow(void);                                     // ウィンドウを閉じてOpenGLコンテキストをアンロードする
    bool WindowShouldClose(void);                               // アプリケーションを終了すべきか確認する（KEY_ESCAPEが押された、またはウィンドウの閉じるアイコンがクリックされた場合）
    bool IsWindowReady(void);                                   // ウィンドウが正常に初期化されたか確認する
    bool IsWindowFullscreen(void);                              // ウィンドウが現在フルスクリーンか確認する
    bool IsWindowHidden(void);                                  // ウィンドウが現在非表示か確認する
    bool IsWindowMinimized(void);                               // ウィンドウが現在最小化されているか確認する
    bool IsWindowMaximized(void);                               // ウィンドウが現在最大化されているか確認する
    bool IsWindowFocused(void);                                 // ウィンドウが現在フォーカスされているか確認する
    bool IsWindowResized(void);                                 // 直前のフレームでウィンドウのサイズが変更されたか確認する
    bool IsWindowState(unsigned int flag);                      // 指定したウィンドウフラグが有効か確認する
    void SetWindowState(unsigned int flags);                    // フラグを使用してウィンドウの設定状態を指定する
    void ClearWindowState(unsigned int flags);                  // ウィンドウの設定状態フラグを解除する
    void ToggleFullscreen(void);                                // ウィンドウの状態をフルスクリーン／ウィンドウ表示に切り替え、モニターをウィンドウの解像度に合わせてサイズ変更する
    void ToggleBorderlessWindowed(void);                        // ウィンドウの状態をボーダーレスウィンドウ表示に切り替え、ウィンドウをモニターの解像度に合わせてサイズ変更する
    void MaximizeWindow(void);                                  // サイズ変更可能な場合、ウィンドウを最大化する
    void MinimizeWindow(void);                                  // サイズ変更可能な場合、ウィンドウを最小化する
    void RestoreWindow(void);                                   // 最小化または最大化されたウィンドウを元に戻す
    void SetWindowIcon(Image image);                            // ウィンドウのアイコンを設定する（単一画像、32ビットRGBA）
    void SetWindowIcons(Image *images, int count);              // ウィンドウのアイコンを設定する（複数画像、32ビットRGBA）
    void SetWindowTitle(const char *title);                     // ウィンドウのタイトルを設定する
    void SetWindowPosition(int x, int y);                       // 画面上のウィンドウ位置を設定する
    void SetWindowMonitor(int monitor);                         // 現在のウィンドウを表示するモニターを設定する
    void SetWindowMinSize(int width, int height);               // ウィンドウの最小サイズを設定する（FLAG_WINDOW_RESIZABLE用）
    void SetWindowMaxSize(int width, int height);               // ウィンドウの最大サイズを設定する（FLAG_WINDOW_RESIZABLE用）
    void SetWindowSize(int width, int height);                  // ウィンドウのサイズを設定する
    void SetWindowOpacity(float opacity);                       // ウィンドウの不透明度を設定する [0.0f..1.0f]
    void SetWindowFocused(void);                                // ウィンドウにフォーカスを設定する
    void *GetWindowHandle(void);                                // ネイティブウィンドウハンドルを取得する
    int GetScreenWidth(void);                                   // 現在の画面幅を取得する
    int GetScreenHeight(void);                                  // 現在の画面高さを取得する
    int GetRenderWidth(void);                                   // 現在の描画幅を取得する（HiDPIを考慮）
    int GetRenderHeight(void);                                  // 現在の描画高さを取得する（HiDPIを考慮）
    int GetMonitorCount(void);                                  // 接続されているモニター数を取得する
    int GetCurrentMonitor(void);                                // ウィンドウが配置されている現在のモニターを取得する
    Vector2 GetMonitorPosition(int monitor);                    // 指定したモニターの位置を取得する
    int GetMonitorWidth(int monitor);                           // 指定したモニターの幅を取得する（モニターで使用中のビデオモード）
    int GetMonitorHeight(int monitor);                          // 指定したモニターの高さを取得する（モニターで使用中のビデオモード）
    int GetMonitorPhysicalWidth(int monitor);                   // 指定したモニターの物理的な幅をミリメートル単位で取得する
    int GetMonitorPhysicalHeight(int monitor);                  // 指定したモニターの物理的な高さをミリメートル単位で取得する
    int GetMonitorRefreshRate(int monitor);                     // 指定したモニターのリフレッシュレートを取得する
    Vector2 GetWindowPosition(void);                            // モニター上のウィンドウのXY位置を取得する
    Vector2 GetWindowScaleDPI(void);                            // ウィンドウのDPIスケール係数を取得する
    const char *GetMonitorName(int monitor);                    // 指定したモニターの人が読めるUTF-8エンコード名を取得する
    void SetClipboardText(const char *text);                    // クリップボードのテキスト内容を設定する
    const char *GetClipboardText(void);                         // クリップボードのテキスト内容を取得する
    Image GetClipboardImage(void);                              // クリップボードの画像内容を取得する
    void EnableEventWaiting(void);                              // EndDrawing()でイベント待機を有効にし、自動イベントポーリングを無効にする
    void DisableEventWaiting(void);                             // EndDrawing()でイベント待機を無効にし、自動イベントポーリングを有効にする

    // カーソル関連の関数
    void ShowCursor(void);                                      // カーソルを表示する
    void HideCursor(void);                                      // カーソルを非表示にする
    bool IsCursorHidden(void);                                  // カーソルが非表示か確認する
    void EnableCursor(void);                                    // カーソルを有効化する（ロックを解除）
    void DisableCursor(void);                                   // カーソルを無効化する（ロックする）
    bool IsCursorOnScreen(void);                                // カーソルが画面内にあるか確認する

    // 描画関連の関数
    void ClearBackground(Color color);                          // 背景色（フレームバッファのクリア色）を設定する
    void BeginDrawing(void);                                    // 描画を開始するためにキャンバス（フレームバッファ）を準備する
    void EndDrawing(void);                                      // キャンバスへの描画を終了し、バッファを入れ替える（ダブルバッファリング）
    void BeginMode2D(Camera2D camera);                          // カスタムカメラで2Dモードを開始する
    void EndMode2D(void);                                       // カスタムカメラによる2Dモードを終了する
    void BeginMode3D(Camera3D camera);                          // カスタムカメラで3Dモードを開始する
    void EndMode3D(void);                                       // 3Dモードを終了し、デフォルトの2D正投影モードに戻す
    void BeginTextureMode(RenderTexture2D target);              // レンダーテクスチャへの描画を開始する
    void EndTextureMode(void);                                  // レンダーテクスチャへの描画を終了する
    void BeginShaderMode(Shader shader);                        // カスタムシェーダーによる描画を開始する
    void EndShaderMode(void);                                   // カスタムシェーダーによる描画を終了する（デフォルトシェーダーを使用）
    void BeginBlendMode(int mode);                              // ブレンドモードを開始する（アルファ、加算、乗算、減算、カスタム）
    void EndBlendMode(void);                                    // ブレンドモードを終了する（デフォルトのアルファブレンドに戻す）
    void BeginScissorMode(int x, int y, int width, int height); // シザーモードを開始する（以降の描画領域を画面上に定義）
    void EndScissorMode(void);                                  // シザーモードを終了する
    void BeginVrStereoMode(VrStereoConfig config);              // ステレオレンダリングを開始する（VRシミュレーターが必要）
    void EndVrStereoMode(void);                                 // ステレオレンダリングを終了する（VRシミュレーターが必要）

    // VRシミュレーター用のVRステレオ設定関数
    VrStereoConfig LoadVrStereoConfig(VrDeviceInfo device);     // VRシミュレーターデバイスのパラメーターからVRステレオ設定を読み込む
    void UnloadVrStereoConfig(VrStereoConfig config);           // VRステレオ設定をアンロードする

    // シェーダー管理関数
    // 注意: OpenGL 1.1ではシェーダー機能を使用できない
    Shader LoadShader(const char *vsFileName, const char *fsFileName);   // ファイルからシェーダーを読み込み、デフォルトロケーションを関連付ける
    Shader LoadShaderFromMemory(const char *vsCode, const char *fsCode); // コード文字列からシェーダーを読み込み、デフォルトロケーションを関連付ける
    bool IsShaderValid(Shader shader);                                   // シェーダーが有効か確認する（GPUに読み込み済み）
    int GetShaderLocation(Shader shader, const char *uniformName);       // シェーダーのuniformロケーションを取得する
    int GetShaderLocationAttrib(Shader shader, const char *attribName);  // シェーダーの頂点属性ロケーションを取得する
    void SetShaderValue(Shader shader, int locIndex, const void *value, int uniformType); // シェーダーのuniform値を設定する
    void SetShaderValueV(Shader shader, int locIndex, const void *value, int uniformType, int count); // シェーダーのuniform値ベクトルを設定する
    void SetShaderValueMatrix(Shader shader, int locIndex, Matrix mat);  // シェーダーのuniform値を設定する（4x4行列）
    void SetShaderValueTexture(Shader shader, int locIndex, Texture2D texture); // シェーダーのuniform値を設定し、テクスチャを関連付ける（sampler2D）
    void UnloadShader(Shader shader);                                    // シェーダーをGPUメモリ（VRAM）からアンロードする

    // スクリーン空間関連の関数
    Ray GetScreenToWorldRay(Vector2 position, Camera camera);         // 画面位置（マウスなど）からワールド空間へのレイを取得する
    Ray GetScreenToWorldRayEx(Vector2 position, Camera camera, int width, int height); // ビューポート内の画面位置（マウスなど）からワールド空間へのレイを取得する
    Vector2 GetWorldToScreen(Vector3 position, Camera camera);        // 3Dワールド空間の位置に対応するスクリーン空間の位置を取得する
    Vector2 GetWorldToScreenEx(Vector3 position, Camera camera, int width, int height); // 3Dワールド空間の位置に対応するスクリーン空間の位置を取得する
    Vector2 GetWorldToScreen2D(Vector2 position, Camera2D camera);    // 2Dカメラのワールド空間位置に対応するスクリーン空間の位置を取得する
    Vector2 GetScreenToWorld2D(Vector2 position, Camera2D camera);    // 2Dカメラのスクリーン空間位置に対応するワールド空間の位置を取得する
    Matrix GetCameraMatrix(Camera camera);                            // カメラ変換行列（ビュー行列）を取得する
    Matrix GetCameraMatrix2D(Camera2D camera);                        // 2Dカメラの変換行列を取得する

    // 時間関連の関数
    void SetTargetFPS(int fps);                       // 目標FPS（最大値）を設定する
    float GetFrameTime(void);                         // 直前に描画したフレームの所要時間（デルタタイム）を秒単位で取得する
    double GetTime(void);                             // InitWindow()からの経過時間を秒単位で取得する
    int GetFPS(void);                                 // 現在のFPSを取得する

    // カスタムフレーム制御関数
    // 注意: これらの関数はフレーム処理を完全に制御したい上級者向け
    // デフォルトではEndDrawing()が、すべてを描画 + SwapScreenBuffer() + フレームタイミングを管理 + PollInputEvents()を実行する
    // この動作を避けてフレーム処理を手動で制御するには、config.hでSUPPORT_CUSTOM_FRAME_CONTROLを有効にする
    void SwapScreenBuffer(void);                      // バックバッファとフロントバッファを入れ替える（画面描画）
    void PollInputEvents(void);                       // すべての入力イベントを登録する
    void WaitTime(double seconds);                    // 指定時間待機する（プログラムの実行を停止）

    // 乱数生成関数
    void SetRandomSeed(unsigned int seed);            // 乱数生成器のシードを設定する
    int GetRandomValue(int min, int max);             // minからmaxまでの乱数値を取得する（両端を含む）
    int *LoadRandomSequence(unsigned int count, int min, int max); // 重複のない乱数列を読み込む
    void UnloadRandomSequence(int *sequence);         // 乱数列をアンロードする

    // その他の関数
    void TakeScreenshot(const char *fileName);                // 現在の画面のスクリーンショットを撮る（ファイル名の拡張子で形式を指定）
    void SetConfigFlags(unsigned int flags);                  // 初期化時の設定フラグを指定する（FLAGSを参照）
    void OpenURL(const char *url);                            // デフォルトのシステムブラウザーでURLを開く（利用可能な場合）

    // ログシステム
    void SetTraceLogLevel(int logLevel);                      // 現在のしきい値となる最小ログレベルを設定する
    void TraceLog(int logLevel, const char *text, ...);       // トレースログメッセージを表示する（LOG_DEBUG、LOG_INFO、LOG_WARNING、LOG_ERRORなど）
    void SetTraceLogCallback(TraceLogCallback callback);      // カスタムトレースログを設定する

    // 内部アロケーターを使用したメモリ管理
    void *MemAlloc(unsigned int size);                        // 内部メモリアロケーター
    void *MemRealloc(void *ptr, unsigned int size);           // 内部メモリ再割り当て
    void MemFree(void *ptr);                                  // 内部メモリ解放

    // ファイルシステム管理関数
    unsigned char *LoadFileData(const char *fileName, int *dataSize); // ファイルデータをバイト配列として読み込む
    void UnloadFileData(unsigned char *data);                     // LoadFileData()で割り当てたファイルデータをアンロードする
    bool SaveFileData(const char *fileName, void *data, int dataSize); // バイト配列をファイルに保存し、成功した場合はtrueを返す
    bool ExportDataAsCode(const unsigned char *data, int dataSize, const char *fileName); // データをコード（.h）としてエクスポートし、成功した場合はtrueを返す
    char *LoadFileText(const char *fileName);                     // テキストデータをファイルから読み込み、'\0'終端文字列を返す
    void UnloadFileText(char *text);                              // LoadFileText()で割り当てたテキストデータをアンロードする
    bool SaveFileText(const char *fileName, const char *text);    // '\0'終端文字列をファイルに保存し、成功した場合はtrueを返す

    // ファイルアクセス用カスタムコールバック
    // 警告: コールバックの設定は上級者向け
    void SetLoadFileDataCallback(LoadFileDataCallback callback);  // カスタムのバイナリファイルデータローダーを設定する
    void SetSaveFileDataCallback(SaveFileDataCallback callback);  // カスタムのバイナリファイルデータセーバーを設定する
    void SetLoadFileTextCallback(LoadFileTextCallback callback);  // カスタムのテキストファイルデータローダーを設定する
    void SetSaveFileTextCallback(SaveFileTextCallback callback);  // カスタムのテキストファイルデータセーバーを設定する

    int FileRename(const char *fileName, const char *fileRename); // ファイルが存在する場合、名前を変更する
    int FileRemove(const char *fileName);                         // ファイルが存在する場合、削除する
    int FileCopy(const char *srcPath, const char *dstPath);       // ファイルを別のパスへコピーし、存在しない場合はdstPathを作成する
    int FileMove(const char *srcPath, const char *dstPath);       // ファイルを別のディレクトリへ移動し、存在しない場合はdstPathを作成する
    int FileTextReplace(const char *fileName, const char *search, const char *replacement); // 既存ファイル内のテキストを置換する
    int FileTextFindIndex(const char *fileName, const char *search); // 既存ファイル内のテキストを検索する
    bool FileExists(const char *fileName);                        // ファイルが存在するか確認する
    bool DirectoryExists(const char *dirPath);                    // ディレクトリパスが存在するか確認する
    bool IsFileExtension(const char *fileName, const char *ext);  // ファイルの拡張子を確認する（.png、.wavのようにドットを含めることを推奨）
    int GetFileLength(const char *fileName);                      // ファイルサイズをバイト単位で取得する（注意: GetFileSize()はwindows.hと競合する）
    long GetFileModTime(const char *fileName);                    // ファイルの更新時刻（最終書き込み時刻）を取得する
    const char *GetFileExtension(const char *fileName);           // ファイル名文字列の拡張子を指すポインターを取得する（'.png'のようにドットを含む）
    const char *GetFileName(const char *filePath);                // パス文字列内のファイル名を指すポインターを取得する
    const char *GetFileNameWithoutExt(const char *filePath);      // 拡張子を除いたファイル名文字列を取得する（静的文字列を使用）
    const char *GetDirectoryPath(const char *filePath);           // パスを含むfileNameから完全なディレクトリパスを取得する（静的文字列を使用）
    const char *GetPrevDirectoryPath(const char *dirPath);        // 指定したパスの1つ上のディレクトリパスを取得する（静的文字列を使用）
    const char *GetWorkingDirectory(void);                        // 現在の作業ディレクトリを取得する（静的文字列を使用）
    const char *GetApplicationDirectory(void);                    // 実行中のアプリケーションのディレクトリを取得する（静的文字列を使用）
    int MakeDirectory(const char *dirPath);                       // 指定された完全なパスを含むディレクトリを作成し、成功した場合は0を返す
    bool ChangeDirectory(const char *dirPath);                    // 作業ディレクトリを変更し、成功した場合はtrueを返す
    bool IsPathFile(const char *path);                            // 指定したパスがファイルかディレクトリか確認する
    bool IsFileNameValid(const char *fileName);                   // fileNameが対象プラットフォーム／OSで有効か確認する
    FilePathList LoadDirectoryFiles(const char *dirPath);         // ディレクトリ内のファイルとディレクトリのパスを読み込む（サブディレクトリは走査しない）
    FilePathList LoadDirectoryFilesEx(const char *basePath, const char *filter, bool scanSubdirs); // 拡張子フィルターとサブディレクトリ走査を指定してディレクトリ内のパスを読み込む（使用可能なフィルター例: "*.*"、"FILES*"、"DIRS*"）
    void UnloadDirectoryFiles(FilePathList files);                // ファイルパス一覧をアンロードする
    bool IsFileDropped(void);                                     // ウィンドウにファイルがドロップされたか確認する
    FilePathList LoadDroppedFiles(void);                          // ドロップされたファイルのパス一覧を読み込む
    void UnloadDroppedFiles(FilePathList files);                  // ドロップされたファイルのパス一覧をアンロードする
    unsigned int GetDirectoryFileCount(const char *dirPath);      // ディレクトリ内のファイル数を取得する
    unsigned int GetDirectoryFileCountEx(const char *basePath, const char *filter, bool scanSubdirs); // 拡張子フィルターと再帰的ディレクトリ走査を指定してディレクトリ内のファイル数を取得する（結果にディレクトリを含めるにはフィルター文字列で'DIR'を使用）

    // 圧縮／エンコード機能
    unsigned char *CompressData(const unsigned char *data, int dataSize, int *compDataSize);        // データを圧縮する（DEFLATEアルゴリズム）。メモリはMemFree()で解放する必要がある
    unsigned char *DecompressData(const unsigned char *compData, int compDataSize, int *dataSize);  // データを展開する（DEFLATEアルゴリズム）。メモリはMemFree()で解放する必要がある
    char *EncodeDataBase64(const unsigned char *data, int dataSize, int *outputSize);               // データをBase64文字列にエンコードする（NULL終端文字を含む）。メモリはMemFree()で解放する必要がある
    unsigned char *DecodeDataBase64(const char *text, int *outputSize);                             // NULL終端を想定したBase64文字列をデコードする。メモリはMemFree()で解放する必要がある
    unsigned int ComputeCRC32(unsigned char *data, int dataSize); // CRC32ハッシュコードを計算する
    unsigned int *ComputeMD5(unsigned char *data, int dataSize);  // MD5ハッシュコードを計算し、静的なint[4]（16バイト）を返す
    unsigned int *ComputeSHA1(unsigned char *data, int dataSize); // SHA1ハッシュコードを計算し、静的なint[5]（20バイト）を返す
    unsigned int *ComputeSHA256(unsigned char *data, int dataSize); // SHA256ハッシュコードを計算し、静的なint[8]（32バイト）を返す

    // オートメーションイベント機能
    AutomationEventList LoadAutomationEventList(const char *fileName); // ファイルからオートメーションイベント一覧を読み込む（NULLなら空の一覧、容量はMAX_AUTOMATION_EVENTS）
    void UnloadAutomationEventList(AutomationEventList list);   // ファイルから読み込んだオートメーションイベント一覧をアンロードする
    bool ExportAutomationEventList(AutomationEventList list, const char *fileName); // オートメーションイベント一覧をテキストファイルとしてエクスポートする
    void SetAutomationEventList(AutomationEventList *list);     // 記録先のオートメーションイベント一覧を設定する
    void SetAutomationEventBaseFrame(int frame);                // 記録開始時のオートメーションイベント内部基準フレームを設定する
    void StartAutomationEventRecording(void);                   // オートメーションイベントの記録を開始する（AutomationEventListの設定が必要）
    void StopAutomationEventRecording(void);                    // オートメーションイベントの記録を停止する
    void PlayAutomationEvent(AutomationEvent event);            // 記録済みのオートメーションイベントを再生する

    //------------------------------------------------------------------------------------
    // 入力処理関数（モジュール: core）
    //------------------------------------------------------------------------------------

    // 入力関連の関数: キーボード
    bool IsKeyPressed(int key);                             // キーが1回押されたか確認する
    bool IsKeyPressedRepeat(int key);                       // キーリピートによりキーが再度押されたか確認する
    bool IsKeyDown(int key);                                // キーが押されているか確認する
    bool IsKeyReleased(int key);                            // キーが1回離されたか確認する
    bool IsKeyUp(int key);                                  // キーが押されていないか確認する
    int GetKeyPressed(void);                                // 押されたキーのキーコードを取得する。キュー内のキーは複数回呼び出して取得し、キューが空の場合は0を返す
    int GetCharPressed(void);                               // 入力された文字のUnicode値を取得する。キュー内の文字は複数回呼び出して取得し、キューが空の場合は0を返す
    const char *GetKeyName(int key);                        // 現在のキーボード配列におけるQWERTYキーの名前を取得する（例: AZERTYキーボードでKEY_Aを指定すると文字列'q'を返す）
    void SetExitKey(int key);                               // プログラムを終了するカスタムキーを設定する（デフォルトはESC）

    // 入力関連の関数: ゲームパッド
    bool IsGamepadAvailable(int gamepad);                   // ゲームパッドが利用可能か確認する
    const char *GetGamepadName(int gamepad);                // ゲームパッドの内部名IDを取得する
    bool IsGamepadButtonPressed(int gamepad, int button);   // ゲームパッドのボタンが1回押されたか確認する
    bool IsGamepadButtonDown(int gamepad, int button);      // ゲームパッドのボタンが押されているか確認する
    bool IsGamepadButtonReleased(int gamepad, int button);  // ゲームパッドのボタンが1回離されたか確認する
    bool IsGamepadButtonUp(int gamepad, int button);        // ゲームパッドのボタンが押されていないか確認する
    int GetGamepadButtonPressed(void);                      // 最後に押されたゲームパッドのボタンを取得する
    int GetGamepadAxisCount(int gamepad);                   // ゲームパッドの軸数を取得する
    float GetGamepadAxisMovement(int gamepad, int axis);    // ゲームパッドの軸の移動量を取得する
    int SetGamepadMappings(const char *mappings);           // 内部ゲームパッドマッピングを設定する（SDL_GameControllerDB）
    void SetGamepadVibration(int gamepad, float leftMotor, float rightMotor, float duration); // ゲームパッドの両モーターの振動を設定する（持続時間は秒単位）

    // 入力関連の関数: マウス
    bool IsMouseButtonPressed(int button);                  // マウスボタンが1回押されたか確認する
    bool IsMouseButtonDown(int button);                     // マウスボタンが押されているか確認する
    bool IsMouseButtonReleased(int button);                 // マウスボタンが1回離されたか確認する
    bool IsMouseButtonUp(int button);                       // マウスボタンが押されていないか確認する
    int GetMouseX(void);                                    // マウスのX座標を取得する
    int GetMouseY(void);                                    // マウスのY座標を取得する
    Vector2 GetMousePosition(void);                         // マウスのXY座標を取得する
    Vector2 GetMouseDelta(void);                            // フレーム間のマウス移動量を取得する
    void SetMousePosition(int x, int y);                    // マウスのXY座標を設定する
    void SetMouseOffset(int offsetX, int offsetY);          // マウスのオフセットを設定する
    void SetMouseScale(float scaleX, float scaleY);         // マウスのスケールを設定する
    float GetMouseWheelMove(void);                          // マウスホイールのXまたはYのうち、移動量が大きい方を取得する
    Vector2 GetMouseWheelMoveV(void);                       // マウスホイールのXとY両方の移動量を取得する
    void SetMouseCursor(int cursor);                        // マウスカーソルを設定する

    // 入力関連の関数: タッチ
    int GetTouchX(void);                                    // タッチポイント0のX座標を取得する（画面サイズに対する相対座標）
    int GetTouchY(void);                                    // タッチポイント0のY座標を取得する（画面サイズに対する相対座標）
    Vector2 GetTouchPosition(int index);                    // 指定したインデックスのタッチポイントのXY座標を取得する（画面サイズに対する相対座標）
    int GetTouchPointId(int index);                         // 指定したインデックスのタッチポイント識別子を取得する
    int GetTouchPointCount(void);                           // タッチポイント数を取得する

    //------------------------------------------------------------------------------------
    // ジェスチャーとタッチの処理関数（モジュール: rgestures）
    //------------------------------------------------------------------------------------
    void SetGesturesEnabled(unsigned int flags);            // フラグを使用して一連のジェスチャーを有効にする
    bool IsGestureDetected(unsigned int gesture);           // ジェスチャーが検出されたか確認する
    int GetGestureDetected(void);                           // 最後に検出されたジェスチャーを取得する
    float GetGestureHoldDuration(void);                     // ジェスチャーの長押し時間を秒単位で取得する
    Vector2 GetGestureDragVector(void);                     // ジェスチャーのドラッグベクトルを取得する
    float GetGestureDragAngle(void);                        // ジェスチャーのドラッグ角度を取得する
    Vector2 GetGesturePinchVector(void);                    // ジェスチャーのピンチ移動量を取得する
    float GetGesturePinchAngle(void);                       // ジェスチャーのピンチ角度を取得する

    //------------------------------------------------------------------------------------
    // カメラシステム関数（モジュール: rcamera）
    //------------------------------------------------------------------------------------
    void UpdateCamera(Camera *camera, int mode);            // 選択したモードに合わせてカメラ位置を更新する
    void UpdateCameraPro(Camera *camera, Vector3 movement, Vector3 rotation, float zoom); // カメラの移動／回転を更新する

