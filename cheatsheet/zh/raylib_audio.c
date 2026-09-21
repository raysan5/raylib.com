    //音频设备管理功能
    void InitAudioDevice(void);                                     //初始化音频设备和上下文
    void CloseAudioDevice(void);                                    //关闭音频设备和上下文
    bool IsAudioDeviceReady(void);                                  //检查音频设备是否已成功初始化
    void SetMasterVolume(float volume);                             //设置主音量(侦听器)
    float GetMasterVolume(void);                                    // Get master volume (listener)
    
    //Wave wave/Sound Load/卸载功能
    Wave LoadWave(const char *fileName);                            //从文件加载Wave wave数据
    Wave LoadWaveFromMemory(const char *fileType, const unsigned char *fileData, int dataSize); //从内存缓冲区加载Wave, fileType引用扩展名：即'。瓦夫
    bool IsWaveValid(Wave wave);                                    // Checks if wave data is valid (data loaded and parameters)
    Sound LoadSound(const char *fileName);                          //从文件加载音频
    Sound LoadSoundFromWave(Wave wave);                             //从Wave数据加载音频
    Sound LoadSoundAlias(Sound source);                             // Create a new sound that shares the same sample data as the source sound, does not own the sound data
    bool IsSoundValid(Sound sound);                                 // Checks if a sound is valid (data loaded and buffers initialized)
    void UpdateSound(Sound sound, const void *data, int sampleCount); //用新数据更新音频缓冲区
    void UnloadWave(Wave wave);                                     //卸载Wave数据
    void UnloadSound(Sound sound);                                  //卸载音频
    void UnloadSoundAlias(Sound alias);                             // Unload a sound alias (does not deallocate sample data)
    bool ExportWave(Wave wave, const char *fileName);               //将波数据导出到文件, 成功时返回true
    bool ExportWaveAsCode(Wave wave, const char *fileName);         //将波样本数据导出到代码(.h), 成功时返回true
    
    //Wave/Sound管理功能
    void PlaySound(Sound sound);                                    //播放音频
    void StopSound(Sound sound);                                    //停止播放音频
    void PauseSound(Sound sound);                                   //暂停音频
    void ResumeSound(Sound sound);                                  //恢复暂停的音频
    bool IsSoundPlaying(Sound sound);                               //检查当前是否正在播放音频
    void SetSoundVolume(Sound sound, float volume);                 //设置音频音量(1.0为最大音量)
    void SetSoundPitch(Sound sound, float pitch);                   //设置音频的音调(1.0为基本音量)
    void SetSoundPan(Sound sound, float pan);                       //为音频设置平移(0.5为中心)
    Wave WaveCopy(Wave wave);                                       //将波复制到新波
    void WaveCrop(Wave *wave, int initFrame, int finalFrame);       //将波裁剪到定义的采样范围
    void WaveFormat(Wave *wave, int sampleRate, int sampleSize, int channels); //将波数据转换为所需格式
    float *LoadWaveSamples(Wave wave);                              //将波采样数据加载为32位float数据数组
    void UnloadWaveSamples(float *samples);                         //卸载使用加LoadWaveSamples()加载的样本数据
    
    //Music管理功能
    Music LoadMusicStream(const char *fileName);                    //从文件加载音乐流
    Music LoadMusicStreamFromMemory(const char *fileType, const unsigned char *data, int dataSize); //从数据加载音乐流
    bool IsMusicValid(Music music);                                 // Checks if a music stream is valid (context and buffers initialized)
    void UnloadMusicStream(Music music);                            //卸载音乐流
    void PlayMusicStream(Music music);                              //开始播放音乐
    bool IsMusicStreamPlaying(Music music);                         //检查是否正在播放音乐
    void UpdateMusicStream(Music music);                            //更新音乐流的缓冲区
    void StopMusicStream(Music music);                              //停止音乐播放
    void PauseMusicStream(Music music);                             //暂停音乐播放
    void ResumeMusicStream(Music music);                            //继续播放暂停的音乐
    void SeekMusicStream(Music music, float position);              //将音乐搜索到某个位置，我猜测应该是类似于进度条定位(以秒为单位)
    void SetMusicVolume(Music music, float volume);                 //设置音乐音量(1.0为最大音量)
    void SetMusicPitch(Music music, float pitch);                   //设置音乐的音高(1.0为基本级别)
    void SetMusicPan(Music music, float pan);                       //为音乐设置平移(0.5为中心)
    float GetMusicTimeLength(Music music);                          //获取音乐时间长度(秒)
    float GetMusicTimePlayed(Music music);                          //获取当前播放的音乐时间(秒)
    
    //AudioStream管理功能
    AudioStream  LoadAudioStream(unsigned int sampleRate, unsigned int sampleSize, unsigned int channels); //加载音频流(以流式传输原始音频pcm数据)
    bool IsAudioStreamValid(AudioStream stream);                    // Checks if an audio stream is valid (buffers initialized)
    void UnloadAudioStream(AudioStream stream);                     //卸载音频流并释放内存
    void UpdateAudioStream(AudioStream stream, const void *data, int frameCount); //使用数据更新音频流缓冲区
    bool IsAudioStreamProcessed(AudioStream stream);                //检查是否有音频流缓冲区需要重新填充
    void PlayAudioStream(AudioStream stream);                       //播放音频流
    void PauseAudioStream(AudioStream stream);                      //暂停音频流
    void ResumeAudioStream(AudioStream stream);                     //恢复音频流
    bool IsAudioStreamPlaying(AudioStream stream);                  //检查是否正在播放音频流
    void StopAudioStream(AudioStream stream);                       //停止音频流
    void SetAudioStreamVolume(AudioStream stream, float volume);    //设置音频流的音量(1.0为最大音量)
    void SetAudioStreamPitch(AudioStream stream, float pitch);      //设置音频流的音调(1.0为基本级别)
    void SetAudioStreamPan(AudioStream stream, float pan);          //设置音频流的平移(0.0居中)
    void SetAudioStreamBufferSizeDefault(int size);                 //新音频流的默认大小
    void SetAudioStreamCallback(AudioStream stream, AudioCallback callback); //音频线程回调以请求新数据

    void AttachAudioStreamProcessor(AudioStream stream, AudioCallback processor); //将音频流处理器连接到流
    void DetachAudioStreamProcessor(AudioStream stream, AudioCallback processor); //从流中分离音频流处理器
    
    void AttachAudioMixedProcessor(AudioCallback processor); // Attach audio stream processor to the entire audio pipeline, receives frames x 2 samples as 'float' (stereo)
    void DetachAudioMixedProcessor(AudioCallback processor); // Detach audio stream processor from the entire audio pipeline
    
