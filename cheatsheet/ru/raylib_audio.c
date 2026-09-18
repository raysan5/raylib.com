    // Функции управления аудиоустройством
    void InitAudioDevice(void);                                     // Инициализировать аудиоустройство и контекст
    void CloseAudioDevice(void);                                    // Закрыть аудиоустройство и контекст
    bool IsAudioDeviceReady(void);                                  // Проверить, успешно ли инициализировано аудиоустройство
    void SetMasterVolume(float volume);                             // Установить общую громкость (мастер-громкость)
    float GetMasterVolume(void);                                    // Получить общую громкость (мастер-громкость)

    // Функции загрузки/выгрузки аудиоволн и звуков
    Wave LoadWave(const char *fileName);                            // Загрузить данные звуковой волны (Wave) из файла
    Wave LoadWaveFromMemory(const char *fileType, const unsigned char *fileData, int dataSize); // Загрузить звуковую волну из буфера в памяти, fileType указывает на расширение: например, '.wav'
    bool IsWaveValid(Wave wave);                                    // Проверить, корректны ли данные звуковой волны (данные загружены и параметры верны)
    Sound LoadSound(const char *fileName);                          // Загрузить звук из файла
    Sound LoadSoundFromWave(Wave wave);                             // Загрузить звук из данных звуковой волны
    Sound LoadSoundAlias(Sound source);                             // Создать псевдоним звука, который разделяет сэмплы с исходным звуком, но не владеет аудиоданными
    bool IsSoundValid(Sound sound);                                 // Проверить, корректен ли звук (данные загружены и буферы инициализированы)
    void UpdateSound(Sound sound, const void *data, int sampleCount); // Обновить звуковой буфер новыми данными (формат данных по умолчанию: 32-битный float, стерео)
    void UnloadWave(Wave wave);                                     // Выгрузить данные звуковой волны из памяти
    void UnloadSound(Sound sound);                                  // Выгрузить звук из памяти
    void UnloadSoundAlias(Sound alias);                             // Выгрузить псевдоним звука (не освобождает сами аудиосэмплы)
    bool ExportWave(Wave wave, const char *fileName);               // Экспортировать данные звуковой волны в файл, возвращает true в случае успеха
    bool ExportWaveAsCode(Wave wave, const char *fileName);         // Экспортировать данные сэмплов звуковой волны в код (.h), возвращает true в случае успеха

    // Функции управления аудиоволнами и звуками
    void PlaySound(Sound sound);                                    // Воспроизвести звук
    void StopSound(Sound sound);                                    // Остановить воспроизведение звука
    void PauseSound(Sound sound);                                   // Поставить звук на паузу
    void ResumeSound(Sound sound);                                  // Возобновить поставленный на паузу звук
    bool IsSoundPlaying(Sound sound);                               // Проверить, воспроизводится ли звук в данный момент
    void SetSoundVolume(Sound sound, float volume);                 // Установить громкость для звука (1.0 — максимальный уровень)
    void SetSoundPitch(Sound sound, float pitch);                   // Установить высоту тона (pitch) для звука (1.0 — базовый уровень)
    void SetSoundPan(Sound sound, float pan);                       // Установить панорамирование (баланс) для звука (-1.0 влево, 0.0 по центру, 1.0 вправо)
    Wave WaveCopy(Wave wave);                                       // Скопировать звуковую волну в новую структуру Wave
    void WaveCrop(Wave *wave, int initFrame, int finalFrame);       // Обрезать звуковую волну до заданного диапазона кадров (сэмплов)
    void WaveFormat(Wave *wave, int sampleRate, int sampleSize, int channels); // Преобразовать данные звуковой волны в желаемый формат
    float *LoadWaveSamples(Wave wave);                              // Загрузить данные сэмплов из звуковой волны в виде массива 32-битных float
    void UnloadWaveSamples(float *samples);                         // Выгрузить данные сэмплов, загруженные с помощью LoadWaveSamples()

    // Функции управления музыкой
    Music LoadMusicStream(const char *fileName);                    // Загрузить музыкальный поток из файла
    Music LoadMusicStreamFromMemory(const char *fileType, const unsigned char *data, int dataSize); // Загрузить музыкальный поток из данных в памяти
    bool IsMusicValid(Music music);                                 // Проверить, корректен ли музыкальный поток (контекст и буферы инициализированы)
    void UnloadMusicStream(Music music);                            // Выгрузить музыкальный поток из памяти
    void PlayMusicStream(Music music);                              // Начать воспроизведение музыки
    bool IsMusicStreamPlaying(Music music);                         // Проверить, воспроизводится ли музыка
    void UpdateMusicStream(Music music);                            // Обновить буферы для потокового воспроизведения музыки
    void StopMusicStream(Music music);                              // Остановить воспроизведение музыки
    void PauseMusicStream(Music music);                             // Поставить воспроизведение музыки на паузу
    void ResumeMusicStream(Music music);                            // Возобновить воспроизведение музыки с паузы
    void SeekMusicStream(Music music, float position);              // Перемотать музыку на определенную позицию (в секундах)
    void SetMusicVolume(Music music, float volume);                 // Установить громкость для музыки (1.0 — максимальный уровень)
    void SetMusicPitch(Music music, float pitch);                   // Установить высоту тона (pitch) для музыки (1.0 — базовый уровень)
    void SetMusicPan(Music music, float pan);                       // Установить панорамирование (баланс) для музыки (-1.0 влево, 0.0 по центру, 1.0 вправо)
    float GetMusicTimeLength(Music music);                          // Получить общую длительность музыки (в секундах)
    float GetMusicTimePlayed(Music music);                          // Получить текущее время воспроизведения музыки (в секундах)


    // Функции управления аудиопотоками (AudioStream)
    AudioStream LoadAudioStream(unsigned int sampleRate, unsigned int sampleSize, unsigned int channels); // Загрузить аудиопоток (для потоковой передачи сырых данных PCM)
    bool IsAudioStreamValid(AudioStream stream);                    // Проверить, корректен ли аудиопоток (буферы инициализированы)
    void UnloadAudioStream(AudioStream stream);                     // Выгрузить аудиопоток и освободить память
    void UpdateAudioStream(AudioStream stream, const void *data, int frameCount); // Обновить буферы аудиопотока данными
    bool IsAudioStreamProcessed(AudioStream stream);                // Проверить, требует ли какой-либо из буферов аудиопотока повторного заполнения
    void PlayAudioStream(AudioStream stream);                       // Воспроизвести аудиопоток
    void PauseAudioStream(AudioStream stream);                      // Поставить аудиопоток на паузу
    void ResumeAudioStream(AudioStream stream);                     // Возобновить аудиопоток с паузы
    bool IsAudioStreamPlaying(AudioStream stream);                  // Проверить, воспроизводится ли аудиопоток в данный момент
    void StopAudioStream(AudioStream stream);                       // Остановить аудиопоток
    void SetAudioStreamVolume(AudioStream stream, float volume);    // Установить громкость для аудиопотока (1.0 — максимальный уровень)
    void SetAudioStreamPitch(AudioStream stream, float pitch);      // Установить высоту тона (pitch) для аудиопотока (1.0 — базовый уровень)
    void SetAudioStreamPan(AudioStream stream, float pan);          // Установить панорамирование (баланс) для аудиопотока (диапазон от -1.0 до 1.0, 0.0 — по центру)
    void SetAudioStreamBufferSizeDefault(int size);                 // Установить размер буфера по умолчанию для новых аудиопотоков
    void SetAudioStreamCallback(AudioStream stream, AudioCallback callback); // Установить функцию обратного вызова в аудиопотоке для запроса новых данных

    void AttachAudioStreamProcessor(AudioStream stream, AudioCallback processor); // Подключить процессор аудиопотока к потоку, принимает кадры с 2 сэмплами в виде 'float' (стерео)
    void DetachAudioStreamProcessor(AudioStream stream, AudioCallback processor); // Отключить процессор аудиопотока от потока

    void AttachAudioMixedProcessor(AudioCallback processor); // Подключить аудиопроцессор ко всему общему микшеру аудио, принимает кадры с 2 сэмплами в виде 'float' (стерео)
    void DetachAudioMixedProcessor(AudioCallback processor); // Отключить аудиопроцессор от всего общего микшера аудио


