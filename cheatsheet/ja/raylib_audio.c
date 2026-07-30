    // オーディオデバイスの管理関数
    void InitAudioDevice(void);                                     // オーディオデバイスとコンテキストを初期化する
    void CloseAudioDevice(void);                                    // オーディオデバイスとコンテキストを閉じる
    bool IsAudioDeviceReady(void);                                  // オーディオデバイスが正常に初期化されたか確認する
    void SetMasterVolume(float volume);                             // マスター音量（リスナー）を設定する
    float GetMasterVolume(void);                                    // マスター音量（リスナー）を取得する

    // Wave／Soundの読み込み／アンロード関数
    Wave LoadWave(const char *fileName);                            // ファイルからWaveデータを読み込む
    Wave LoadWaveFromMemory(const char *fileType, const unsigned char *fileData, int dataSize); // メモリバッファからWaveを読み込む。fileTypeには'.wav'などの拡張子を指定する
    bool IsWaveValid(Wave wave);                                    // Waveデータが有効か確認する（データが読み込み済みで、パラメーターが有効）
    Sound LoadSound(const char *fileName);                          // ファイルからSoundを読み込む
    Sound LoadSoundFromWave(Wave wave);                             // WaveデータからSoundを読み込む
    Sound LoadSoundAlias(Sound source);                             // 転送元Soundと同じサンプルデータを共有し、サウンドデータを所有しない新しいSoundを作成する
    bool IsSoundValid(Sound sound);                                 // Soundが有効か確認する（データが読み込み済みで、バッファーが初期化済み）
    void UpdateSound(Sound sound, const void *data, int sampleCount); // 新しいデータでSoundバッファーを更新する（デフォルトのデータ形式: 32ビットfloat、ステレオ）
    void UnloadWave(Wave wave);                                     // Waveデータをアンロードする
    void UnloadSound(Sound sound);                                  // 音をアンロードする
    void UnloadSoundAlias(Sound alias);                             // 音のエイリアスをアンロードする（サンプルデータは解放しない）
    bool ExportWave(Wave wave, const char *fileName);               // Waveデータをファイルへエクスポートし、成功した場合はtrueを返す
    bool ExportWaveAsCode(Wave wave, const char *fileName);         // Waveのサンプルデータをコード（.h）へエクスポートし、成功した場合はtrueを返す

    // Wave／Soundの管理関数
    void PlaySound(Sound sound);                                    // サウンドを再生する
    void StopSound(Sound sound);                                    // サウンドの再生を停止する
    void PauseSound(Sound sound);                                   // サウンドを一時停止する
    void ResumeSound(Sound sound);                                  // 一時停止した音の再生を再開する
    bool IsSoundPlaying(Sound sound);                               // サウンドが現在再生中か確認する
    void SetSoundVolume(Sound sound, float volume);                 // サウンドの音量を設定する（1.0が最大）
    void SetSoundPitch(Sound sound, float pitch);                   // サウンドのピッチを設定する（1.0が基準）
    void SetSoundPan(Sound sound, float pan);                       // サウンドのパンを設定する（-1.0が左、0.0が中央、1.0が右）
    Wave WaveCopy(Wave wave);                                       // Waveを新しいWaveへコピーする
    void WaveCrop(Wave *wave, int initFrame, int finalFrame);       // 指定したフレーム範囲でWaveを切り詰める
    void WaveFormat(Wave *wave, int sampleRate, int sampleSize, int channels); // Waveデータを指定した形式へ変換する
    float *LoadWaveSamples(Wave wave);                              // Waveからサンプルデータを32ビットfloat配列として読み込む
    void UnloadWaveSamples(float *samples);                         // LoadWaveSamples()で読み込んだサンプルデータをアンロードする

    // Musicの管理関数
    Music LoadMusicStream(const char *fileName);                    // ファイルからMusicストリームを読み込む
    Music LoadMusicStreamFromMemory(const char *fileType, const unsigned char *data, int dataSize); // データからMusicストリームを読み込む
    bool IsMusicValid(Music music);                                 // Musicストリームが有効か確認する（コンテキストとバッファーが初期化済み）
    void UnloadMusicStream(Music music);                            // Musicストリームをアンロードする
    void PlayMusicStream(Music music);                              // Musicの再生を開始する
    bool IsMusicStreamPlaying(Music music);                         // Musicが再生中か確認する
    void UpdateMusicStream(Music music);                            // Musicストリーミング用のバッファーを更新する
    void StopMusicStream(Music music);                              // Musicの再生を停止する
    void PauseMusicStream(Music music);                             // Musicの再生を一時停止する
    void ResumeMusicStream(Music music);                            // 一時停止したMusicの再生を再開する
    void SeekMusicStream(Music music, float position);              // Musicを指定位置へシークする（秒単位）
    void SetMusicVolume(Music music, float volume);                 // Musicの音量を設定する（1.0が最大）
    void SetMusicPitch(Music music, float pitch);                   // Musicのピッチを設定する（1.0が基準）
    void SetMusicPan(Music music, float pan);                       // Musicのパンを設定する（-1.0が左、0.0が中央、1.0が右）
    float GetMusicTimeLength(Music music);                          // Musicの長さを秒単位で取得する
    float GetMusicTimePlayed(Music music);                          // Musicの現在の再生時間を秒単位で取得する

    // AudioStreamの管理関数
    AudioStream LoadAudioStream(unsigned int sampleRate, unsigned int sampleSize, unsigned int channels); // 生のオーディオPCMデータをストリーミングするためにAudioStreamを読み込む
    bool IsAudioStreamValid(AudioStream stream);                    // AudioStreamが有効か確認する（バッファーが初期化済み）
    void UnloadAudioStream(AudioStream stream);                     // AudioStreamをアンロードしてメモリを解放する
    void UpdateAudioStream(AudioStream stream, const void *data, int frameCount); // データでAudioStreamのバッファーを更新する
    bool IsAudioStreamProcessed(AudioStream stream);                // 補充が必要なAudioStreamバッファーがあるか確認する
    void PlayAudioStream(AudioStream stream);                       // AudioStreamを再生する
    void PauseAudioStream(AudioStream stream);                      // AudioStreamを一時停止する
    void ResumeAudioStream(AudioStream stream);                     // AudioStreamの再生を再開する
    bool IsAudioStreamPlaying(AudioStream stream);                  // AudioStreamが再生中か確認する
    void StopAudioStream(AudioStream stream);                       // AudioStreamを停止する
    void SetAudioStreamVolume(AudioStream stream, float volume);    // AudioStreamの音量を設定する（1.0が最大）
    void SetAudioStreamPitch(AudioStream stream, float pitch);      // AudioStreamのピッチを設定する（1.0が基準）
    void SetAudioStreamPan(AudioStream stream, float pan);          // AudioStreamのパンを設定する（範囲は-1.0～1.0、0.0が中央）
    void SetAudioStreamBufferSizeDefault(int size);                 // 新しいAudioStreamのデフォルトバッファーサイズを設定する
    void SetAudioStreamCallback(AudioStream stream, AudioCallback callback); // 新しいデータを要求するオーディオスレッドのコールバックを設定する

    void AttachAudioStreamProcessor(AudioStream stream, AudioCallback processor); // AudioStreamプロセッサーをストリームに接続する。フレーム数×2個のサンプルをfloat（ステレオ）として受け取る
    void DetachAudioStreamProcessor(AudioStream stream, AudioCallback processor); // AudioStreamプロセッサーをストリームから切り離す

    void AttachAudioMixedProcessor(AudioCallback processor); // AudioStreamプロセッサーをオーディオパイプライン全体に接続する。フレーム数×2個のサンプルをfloat（ステレオ）として受け取る
    void DetachAudioMixedProcessor(AudioCallback processor); // AudioStreamプロセッサーをオーディオパイプライン全体から切り離す
