    // Audio device management functions
    void InitAudioDevice(void);                                     // Initialize audio device and context
    void CloseAudioDevice(void);                                    // Close the audio device and context
    bool IsAudioDeviceReady(void);                                  // Check if audio device has been initialized successfully
    void SetMasterVolume(float volume);                             // Set master volume (listener)

    // Wave/Sound loading/unloading functions
    Wave LoadWave(const char *fileName);                            // Load wave data from file
    Wave LoadWaveFromMemory(const char *fileType, const unsigned char *fileData, int dataSize); // Load wave from memory buffer, fileType refers to extension: i.e. '.wav'
    bool IsWaveReady(Wave wave);                                    // Checks if wave data is ready
    Sound LoadSound(const char *fileName);                          // Load sound from file
    Sound LoadSoundFromWave(Wave wave);                             // Load sound from wave data
    bool IsSoundReady(Sound sound);                                 // Checks if a sound is ready
    void UpdateSound(Sound sound, const void *data, int sampleCount); // Update sound buffer with new data
    void UnloadWave(Wave wave);                                     // Unload wave data
    void UnloadSound(Sound sound);                                  // Unload sound
    bool ExportWave(Wave wave, const char *fileName);               // Export wave data to file, returns true on success
    bool ExportWaveAsCode(Wave wave, const char *fileName);         // Export wave sample data to code (.h), returns true on success

    // Wave/Sound management functions
    void PlaySound(Sound sound);                                    // Play a sound
    void StopSound(Sound sound);                                    // Stop playing a sound
    void PauseSound(Sound sound);                                   // Pause a sound
    void ResumeSound(Sound sound);                                  // Resume a paused sound
    bool IsSoundPlaying(Sound sound);                               // Check if a sound is currently playing
    void SetSoundVolume(Sound sound, float volume);                 // Set volume for a sound (1.0 is max level)
    void SetSoundPitch(Sound sound, float pitch);                   // Set pitch for a sound (1.0 is base level)
    void SetSoundPan(Sound sound, float pan);                       // Set pan for a sound (0.5 is center)
    Wave WaveCopy(Wave wave);                                       // Copy a wave to a new wave
    void WaveCrop(Wave *wave, int initSample, int finalSample);     // Crop a wave to defined samples range
    void WaveFormat(Wave *wave, int sampleRate, int sampleSize, int channels); // Convert wave data to desired format
    float *LoadWaveSamples(Wave wave);                              // Load samples data from wave as a 32bit float data array
    void UnloadWaveSamples(float *samples);                         // Unload samples data loaded with LoadWaveSamples()

    // Music management functions
    Music LoadMusicStream(const char *fileName);                    // Load music stream from file
    Music LoadMusicStreamFromMemory(const char *fileType, const unsigned char *data, int dataSize); // Load music stream from data
    bool IsMusicReady(Music music);                                 // Checks if a music stream is ready
    void UnloadMusicStream(Music music);                            // Unload music stream
    void PlayMusicStream(Music music);                              // Start music playing
    bool IsMusicStreamPlaying(Music music);                         // Check if music is playing
    void UpdateMusicStream(Music music);                            // Updates buffers for music streaming
    void StopMusicStream(Music music);                              // Stop music playing
    void PauseMusicStream(Music music);                             // Pause music playing
    void ResumeMusicStream(Music music);                            // Resume playing paused music
    void SeekMusicStream(Music music, float position);              // Seek music to a position (in seconds)
    void SetMusicVolume(Music music, float volume);                 // Set volume for music (1.0 is max level)
    void SetMusicPitch(Music music, float pitch);                   // Set pitch for a music (1.0 is base level)
    void SetMusicPan(Music music, float pan);                       // Set pan for a music (0.5 is center)
    float GetMusicTimeLength(Music music);                          // Get music time length (in seconds)
    float GetMusicTimePlayed(Music music);                          // Get current music time played (in seconds)

    // AudioStream management functions
    AudioStream LoadAudioStream(unsigned int sampleRate, unsigned int sampleSize, unsigned int channels); // Load audio stream (to stream raw audio pcm data)
    bool IsAudioStreamReady(AudioStream stream);                    // Checks if an audio stream is ready
    void UnloadAudioStream(AudioStream stream);                     // Unload audio stream and free memory
    void UpdateAudioStream(AudioStream stream, const void *data, int frameCount); // Update audio stream buffers with data
    bool IsAudioStreamProcessed(AudioStream stream);                // Check if any audio stream buffers requires refill
    void PlayAudioStream(AudioStream stream);                       // Play audio stream
    void PauseAudioStream(AudioStream stream);                      // Pause audio stream
    void ResumeAudioStream(AudioStream stream);                     // Resume audio stream
    bool IsAudioStreamPlaying(AudioStream stream);                  // Check if audio stream is playing
    void StopAudioStream(AudioStream stream);                       // Stop audio stream
    void SetAudioStreamVolume(AudioStream stream, float volume);    // Set volume for audio stream (1.0 is max level)
    void SetAudioStreamPitch(AudioStream stream, float pitch);      // Set pitch for audio stream (1.0 is base level)
    void SetAudioStreamPan(AudioStream stream, float pan);          // Set pan for audio stream (0.5 is centered)
    void SetAudioStreamBufferSizeDefault(int size);                 // Default size for new audio streams
    void SetAudioStreamCallback(AudioStream stream, AudioCallback callback);  // Audio thread callback to request new data

    void AttachAudioStreamProcessor(AudioStream stream, AudioCallback processor); // Attach audio stream processor to stream
    void DetachAudioStreamProcessor(AudioStream stream, AudioCallback processor); // Detach audio stream processor from stream

    void AttachAudioMixedProcessor(AudioCallback processor); // Attach audio stream processor to the entire audio pipeline
    void DetachAudioMixedProcessor(AudioCallback processor); // Detach audio stream processor from the entire audio pipeline

