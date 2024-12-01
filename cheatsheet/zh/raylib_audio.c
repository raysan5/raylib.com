
    //模块：raudio
    //音频设备管理功能
    void InitAudioDevice(void);                                     //初始化音频设备和上下文
    void CloseAudioDevice(void);                                    //关闭音频设备和上下文
    bool IsAudioDeviceReady(void);                                  //检查音频设备是否已成功初始化
    void SetMasterVolume(float体积);                                 //设置主音量(侦听器)
    
    //Wave wave/Sound Load/卸载功能
    Wave LoadWave(const char *fileName);                            //从文件加载Wave wave数据
    Wave LoadWaveFromMemory(const char *fileType, const unsigned char *fileData, int dataSize); //从内存缓冲区加载Wave, fileType引用扩展名：即'。瓦夫
    Sound LoadSound(const char *fileName);                          //从文件加载音频
    Sound LoadSoundFromWave(Wave wave);                             //从Wave数据加载音频
    void UpdateSound(Sound, constvoid *data, int sampleCount);      //用新数据更新音频缓冲区
    void UnloadWave(Wave wave);                                     //卸载Wave数据
    void UnloadSound(Sound);                                        //卸载音频
    bool ExportWave(Wave, const char *fileName);                    //将波数据导出到文件, 成功时返回true
    bool ExportWaveAsCode(Wave, const char *fileName);              //将波样本数据导出到代码(.h), 成功时返回true
    
    //Wave/Sound管理功能
    void PlaySound(Sound sound);                                    //播放音频
    void StopSound(Sound sound);                                    //停止播放音频
    void PauseSound(Sound sound);                                   //暂停音频
    void ResumeSound(Sound sound);                                  //恢复暂停的音频
    void PlaySoundMulti(Sound sound);                               //播放音频(使用多通道缓冲池)
    void StopSoundMulti(void);                                      //停止任何音频播放(使用多通道缓冲池)
    int GetSoundsPlaying(void);                                     //获取多声道播放的音频数量
    bool IsSoundPlaying(Sound sound);                               //检查当前是否正在播放音频
    void SetSoundVolume(Sound sound, float音量);                     //设置音频音量(1.0为最大音量)
    void SetSoundPitch(Sound sound, float音调);                      //设置音频的音调(1.0为基本音量)
    void SetSoundPan(Sound sound, float pan);                        //为音频设置平移(0.5为中心)
    Wave WaveCopy(Wave wave);                                       //将波复制到新波
    void WaveCrop(Wave *Wave, int initSample, int finalSample);     //将波裁剪到定义的采样范围
    void WaveFormat(Wave *Wave, int sampleRate, int sampleSize, int通道); //将波数据转换为所需格式
    float *LoadWaveSamples(Wave wave);                              //将波采样数据加载为32位float数据数组
    void UnloadWaveSamples(float *样本/*sample*/);                             //卸载使用加载WaveSamples()加载的样本数据
    
    //Music管理功能
    Music LoadMusicStream(const char *fileName);                    //从文件加载音乐流
    Music LoadMusicStreamFromMemory(const char *fileType, const unsigned char *data, int dataSize); //从数据加载音乐流
    void UnloadMusicStream(Music music);                            //卸载音乐流
    void PlayMusicStream(Music music);                              //开始播放音乐
    bool IsMusicStreamPlaying(Music music);                         //检查是否正在播放音乐
    void UpdateMusicStream(Music music);                            //更新音乐流的缓冲区
    void StopMusicStream(Music music);                              //停止音乐播放
    void PauseMusicStream(Music music);                             //暂停音乐播放
    void ResumeMusicStream(Music music);                            //继续播放暂停的音乐
    void SeekMusicStream(Music music, float 位置);                    //将音乐搜索到某个位置，我猜测应该是类似于进度条定位(以秒为单位)
    void SetMusicVolume(Music music, float音量);                     //设置音乐音量(1.0为最大音量)
    void SetMusicPitch(Music music, float音高);                      //设置音乐的音高(1.0为基本级别)
    void SetMusicPan(Music music, float pan);                             //为音乐设置平移(0.5为中心)
    float GetMusicTimeLength(Music music);                          //获取音乐时间长度(秒)
    float GetMusicTimePlayed(Music music);                          //获取当前播放的音乐时间(秒)
    
    //AudioStream管理功能
    AudioStream  LoadAudioStream(unsigned int sampleRate, unsigned int sampleSize, unsigned整型通道); //加载音频流(以流式传输原始音频pcm数据)
    void UnloadAudioStream(AudioStream stream);                     //卸载音频流并释放内存
    void UpdateAudioStream(AudioStream音频流, const void *data, int frameCount); //使用数据更新音频流缓冲区
    bool IsAudioStreamProcessed(AudioStream音频流);                  //检查是否有音频流缓冲区需要重新填充
    void PlayAudioStream(AudioStream音频流);                         //播放音频流
    void PauseAudioStream(AudioStream音频流);                        //暂停音频流
    void ResumeAudioStream(AudioStream音频流);                       //恢复音频流
    bool IsAudioStreamPlaying(AudioStream音频流);                    //检查是否正在播放音频流
    void StopAudioStream(AudioStream音频流);                         //停止音频流
    void SetAudioStreamVolume(AudioStream音频流, float音量);          //设置音频流的音量(1.0为最大音量)
    void SetAudioStreamPitch(AudioStream音频流, float音调);           //设置音频流的音调(1.0为基本级别)
    void SetAudioStreamPan(AudioStream音频流, float平移);             //设置音频流的平移(0.5居中)
    void SetAudioStreamBufferSizeDefault(int 大小);                   //新音频流的默认大小
    void SetAudioStreamCallback(AudioStream音频流, AudioCallback回调); //音频线程回调以请求新数据
    void AttachAudioStreamProcessor(AudioStream音频流, AudioCallback处理器); //将音频流处理器连接到流
    void DetachAudioStreamProcessor(AudioStream音频流, AudioCallback处理器); //从流中分离音频流处理器
    
    
