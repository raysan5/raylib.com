
    // Функции для работы с окнами
    void InitWindow(int width, int height, const char *title);  // Инициализировать окно и контекст OpenGL
    void CloseWindow(void);                                     // Закрыть окно и выгрузить контекст OpenGL
    bool WindowShouldClose(void);                               // Проверить, следует ли закрыть приложение (нажата клавиша KEY_ESCAPE или кнопка закрытия окна)
    bool IsWindowReady(void);                                   // Проверить, успешно ли инициализировано окно
    bool IsWindowFullscreen(void);                              // Проверить, развернуто ли окно на весь экран
    bool IsWindowHidden(void);                                  // Проверить, скрыто ли окно в данный момент
    bool IsWindowMinimized(void);                               // Проверить, свернуто ли окно в данный момент
    bool IsWindowMaximized(void);                               // Проверить, развернуто ли окно в данный момент
    bool IsWindowFocused(void);                                 // Проверить, является ли окно активным в данный момент
    bool IsWindowResized(void);                                 // Проверить, изменился ли размер окна в последнем кадре
    bool IsWindowState(unsigned int flag);                      // Проверить, включен ли конкретный флаг окна
    void SetWindowState(unsigned int flags);                    // Установить состояние конфигурации окна с помощью флагов
    void ClearWindowState(unsigned int flags);                  // Сбросить флаги состояния конфигурации окна
    void ToggleFullscreen(void);                                // Переключение режима окна: полноэкранный/оконный; изменение разрешения монитора в соответствии с разрешением окна.
    void ToggleBorderlessWindowed(void);                        // Переключение режима окна: окно без рамок, размер окна подгоняется под разрешение монитора.
    void MaximizeWindow(void);                                  // Установить состояние окна: развернутое (если окно можно изменять в размерах)
    void MinimizeWindow(void);                                  // Установить состояние окна: свернутое (если окно можно изменять в размере)
    void RestoreWindow(void);                                   // Восстановить окно из свернутого или развернутого состояния
    void SetWindowIcon(Image image);                            // Установить значок окна (одиночное изображение, RGBA 32 бит)
    void SetWindowIcons(Image *images, int count);              // Установить значок окна (несколько изображений, RGBA 32 бит)
    void SetWindowTitle(const char *title);                     // Установить заголовок окна
    void SetWindowPosition(int x, int y);                       // Установить положение окна на экране
    void SetWindowMonitor(int monitor);                         // Назначить монитор для текущего окна
    void SetWindowMinSize(int width, int height);               // Установить минимальные размеры окна (для FLAG_WINDOW_RESIZABLE)
    void SetWindowMaxSize(int width, int height);               // Установить максимальные размеры окна (для FLAG_WINDOW_RESIZABLE)
    void SetWindowSize(int width, int height);                  // Установить размеры окна
    void SetWindowOpacity(float opacity);                       // Установить прозрачность окна [0.0f..1.0f]
    void SetWindowFocused(void);                                // Сделать окно активным
    void *GetWindowHandle(void);                                // Получить дескриптор системного окна
    int GetScreenWidth(void);                                   // Получить текущую ширину экрана
    int GetScreenHeight(void);                                  // Получить текущую высоту экрана
    int GetRenderWidth(void);                                   // Получить текущую ширину рендеринга (с учетом HiDPI)
    int GetRenderHeight(void);                                  // Получить текущую высоту рендеринга (с учетом HiDPI)
    int GetMonitorCount(void);                                  // Получить количество подключенных мониторов
    int GetCurrentMonitor(void);                                // Получить текущий монитор, на котором расположено окно
    Vector2 GetMonitorPosition(int monitor);                    // Получить заданную позицию монитора
    int GetMonitorWidth(int monitor);                           // Получить заданную ширину монитора (текущий видеорежим, используемый монитором)
    int GetMonitorHeight(int monitor);                          // Получить заданную высоту монитора (текущий видеорежим, используемый монитором)
    int GetMonitorPhysicalWidth(int monitor);                   // Получить физическую ширину указанного монитора в миллиметрах
    int GetMonitorPhysicalHeight(int monitor);                  // Получить физическую высоту монитора в миллиметрах
    int GetMonitorRefreshRate(int monitor);                     // Получить заданную частоту обновления монитора
    Vector2 GetWindowPosition(void);                            // Получить координаты XY окна на мониторе
    Vector2 GetWindowScaleDPI(void);                            // Получить коэффициент масштабирования DPI окна
    const char *GetMonitorName(int monitor);                    // Получить удобочитаемое имя указанного монитора в кодировке UTF-8.
    void SetClipboardText(const char *text);                    // Установить текстовое содержимое буфера обмена
    const char *GetClipboardText(void);                         // Получить текстовое содержимое буфера обмена
    Image GetClipboardImage(void);                              // Получить изображение из буфера обмена
    void EnableEventWaiting(void);                              // Включить ожидание событий в EndDrawing(), отключить автоматический опрос событий
    void DisableEventWaiting(void);                             // Отключить ожидание событий в EndDrawing() и автоматический опрос событий

    // Функции для работы с курсором
    void ShowCursor(void);                                      // Показать курсор
    void HideCursor(void);                                      // Скрыть курсор
    bool IsCursorHidden(void);                                  // Проверить, не виден ли курсор
    void EnableCursor(void);                                    // Включить курсор (разблокирует курсор)
    void DisableCursor(void);                                   // Отключить курсор (блокирует курсор)
    bool IsCursorOnScreen(void);                                // Проверить, находится ли курсор на экране.

    // Функции для работы с отрисовкой
    void ClearBackground(Color color);                          // Установить цвет фона (цвет очистки буфера кадра)
    void BeginDrawing(void);                                    // Подготовка холста (framebuffer) к отрисовке
    void EndDrawing(void);                                      // Завершить отрисовку на холсте и переключить буферы (double buffering)
    void BeginMode2D(Camera2D camera);                          // Запустить 2D-режим с пользовательской камерой (2D)
    void EndMode2D(void);                                       // Завершить 2D-режим с пользовательской камерой
    void BeginMode3D(Camera3D camera);                          // Запустить 3D-режим с пользовательской камерой (3D)
    void EndMode3D(void);                                       // Завершить 3D-режим и вернуться к стандартной ортогональной проекции
    void BeginTextureMode(RenderTexture2D target);              // Запустить отрисовку в текстуру
    void EndTextureMode(void);                                  // Завершить отрисовку в текстуру
    void BeginShaderMode(Shader shader);                        // Запустить отрисовку с пользовательским шейдером
    void EndShaderMode(void);                                   // Завершить отрисовку с использованием пользовательского шейдера (использовать шейдер по умолчанию)
    void BeginBlendMode(int mode);                              // Запустить режим смешивания цветов (alpha, additive, multiplied, subtract, custom)
    void EndBlendMode(void);                                    // Завершить режим смешивания (сброс к значению по умолчанию: alpha blending)
    void BeginScissorMode(int x, int y, int width, int height); // Запустить режим отсечения (определить область экрана для последующей отрисовки)
    void EndScissorMode(void);                                  // Завершить режим отсечения
    void BeginVrStereoMode(VrStereoConfig config);              // Запустить стереорендеринг (требуется VR симулятор)
    void EndVrStereoMode(void);                                 // Завершить стереорендеринг (требуется VR симулятор)

    // Функции конфигурации стереорендеринга для VR симулятора
    VrStereoConfig LoadVrStereoConfig(VrDeviceInfo device);     // Загрузить стереоконфигурацию VR для параметров VR-симулятора
    void UnloadVrStereoConfig(VrStereoConfig config);           // Выгрузить конфигурацию стереорежима VR

    // Функции для работы с шейдерами
    // ПРИМЕЧАНИЕ: Функциональность шейдеров недоступна в OpenGL 1.1
    Shader LoadShader(const char *vsFileName, const char *fsFileName);   // Загрузить шейдер из файлов и привязать стандартные локации
    Shader LoadShaderFromMemory(const char *vsCode, const char *fsCode); // Загрузить шейдер из строк кода и привязать стандартные локации
    bool IsShaderValid(Shader shader);                                   // Проверить, корректен ли шейдер (загружен ли в видеопамять / на GPU)
    int GetShaderLocation(Shader shader, const char *uniformName);       // Получить локацию униформ-переменной шейдера
    int GetShaderLocationAttrib(Shader shader, const char *attribName);  // Получить локацию атрибута шейдера
    void SetShaderValue(Shader shader, int locIndex, const void *value, int uniformType); // Установить значение униформ-переменной шейдера
    void SetShaderValueV(Shader shader, int locIndex, const void *value, int uniformType, int count); // Установить массив значений униформ-переменной шейдера
    void SetShaderValueMatrix(Shader shader, int locIndex, Matrix mat);  // Установить значение uniform-переменной шейдера (матрица 4x4)
    void SetShaderValueTexture(Shader shader, int locIndex, Texture2D texture); // Установить значение uniform-переменной шейдера и привязать текстуру (sampler2D)
    void UnloadShader(Shader shader);                                    // Выгрузить шейдер из видеопамяти (VRAM)

    // Функции для работы с экранным пространством
    Ray GetScreenToWorldRay(Vector2 position, Camera camera);         // Получить луч трассировки от позиции на экране (например, курсора мыши)
    Ray GetScreenToWorldRayEx(Vector2 position, Camera camera, int width, int height); // Получить луч трассировки от позиции на экране (например, мыши) во вьюпорте
    Vector2 GetWorldToScreen(Vector3 position, Camera camera);        // Получить позицию на экране (в экранном пространстве) для 3D-координаты в мировом пространстве
    Vector2 GetWorldToScreenEx(Vector3 position, Camera camera, int width, int height); // Получить позицию в экранном пространстве, соответствующую позиции в трехмерном мировом пространстве.
    Vector2 GetWorldToScreen2D(Vector2 position, Camera2D camera);    // Получить позицию в экранном пространстве, соответствующую 2D-координатам в мировом пространстве для 2D-камеры
    Vector2 GetScreenToWorld2D(Vector2 position, Camera2D camera);    // Получить позицию в мировом пространстве, соответствующую позиции в экранном пространстве для 2D-камеры
    Matrix GetCameraMatrix(Camera camera);                            // Получить матрицу трансформации камеры (матрицу вида)
    Matrix GetCameraMatrix2D(Camera2D camera);                        // Получить матрицу трансформации 2D-камеры

    // Функции для работы со временем
    void SetTargetFPS(int fps);                       // Установить целевой FPS (максимальный)
    float GetFrameTime(void);                         // Получить время отрисовки последнего кадра в секундах (delta time)
    double GetTime(void);                             // Получить время в секундах, прошедшее с момента вызова InitWindow()
    int GetFPS(void);                                 // Получить текущий FPS

    // Функции пользовательского управления кадрами
    // ПРИМЕЧАНИЕ: Эти функции предназначены для опытных пользователей, которым нужен полный контроль над обработкой кадров.
    // По умолчанию EndDrawing() выполняет всю эту работу: отрисовывает всё + SwapScreenBuffer() + управляет таймингом кадра + PollInputEvents()
    // Чтобы отключить это автоматическое поведение и управлять процессами кадра вручную, включите в config.h: SUPPORT_CUSTOM_FRAME_CONTROL
    void SwapScreenBuffer(void);                      // Поменять местами задний и передний буферы (вывод изображения на экран)
    void PollInputEvents(void);                       // Опросить и зафиксировать все события ввода
    void WaitTime(double seconds);                    // Приостановить работу программы на заданное время (задержать выполнение)

    // Функции генерации случайных значений
    void SetRandomSeed(unsigned int seed);            // Установить базовое число (зерно) для генератора случайных чисел
    int GetRandomValue(int min, int max);             // Получить случайное значение в диапазоне от min до max (включительно)
    int *LoadRandomSequence(unsigned int count, int min, int max); // Загрузить последовательность случайных уникальных значений (без повторений)
    void UnloadRandomSequence(int *sequence);         // Выгрузить последовательность случайных значений

    // Прочие функции
    void TakeScreenshot(const char *fileName);                // Сделать скриншот текущего экрана (формат определяется расширением файла)
    void SetConfigFlags(unsigned int flags);                  // Установить флаги конфигурации (см. ФЛАГИ)
    void OpenURL(const char *url);                            // Открыть URL в браузере по умолчанию (при наличии)

    // Система логирования
    void SetTraceLogLevel(int logLevel);                      // Установить текущий пороговый (минимальный) уровень логирования
    void TraceLog(int logLevel, const char *text, ...);       // Вывести отладочное сообщение в лог (LOG_DEBUG, LOG_INFO, LOG_WARNING, LOG_ERROR...)
    void SetTraceLogCallback(TraceLogCallback callback);      // Установить пользовательскую функцию логирования

    // Управление памятью с использованием внутренних аллокаторов
    void *MemAlloc(unsigned int size);                        // Внутренний аллокатор памяти
    void *MemRealloc(void *ptr, unsigned int size);           // Внутренний реаллокатор памяти
    void MemFree(void *ptr);                                  // Внутреннее освобождение памяти

    // Функции управления файловой системой
    unsigned char *LoadFileData(const char *fileName, int *dataSize); // Загрузить данные файла в виде массива байт (чтение)
    void UnloadFileData(unsigned char *data);                     // Выгрузить данные файла, выделенные функцией LoadFileData()
    bool SaveFileData(const char *fileName, void *data, int dataSize); // Сохранить данные в файл из массива байт (запись), возвращает true в случае успеха
    bool ExportDataAsCode(const unsigned char *data, int dataSize, const char *fileName); // Экспортировать данные в код (.h), возвращает true в случае успеха
    char *LoadFileText(const char *fileName);                     // Загрузить текстовые данные из файла (чтение), возвращает строку, завершающуюся нулем '\0'
    void UnloadFileText(char *text);                              // Выгрузить текстовые данные файла, выделенные функцией LoadFileText()
    bool SaveFileText(const char *fileName, const char *text);    // Сохранить текстовые данные в файл (запись), строка должна завершаться нулем '\0', возвращает true в случае успеха

    // Пользовательские функции обратного вызова для доступа к файлам
    // ВНИМАНИЕ: Настройка функций обратного вызова предназначена для опытных пользователей
    void SetLoadFileDataCallback(LoadFileDataCallback callback);  // Установить собственный загрузчик бинарных данных файлов
    void SetSaveFileDataCallback(SaveFileDataCallback callback);  // Установить собственный сохранитель бинарных данных файлов
    void SetLoadFileTextCallback(LoadFileTextCallback callback);  // Установить собственный загрузчик текстовых данных файлов
    void SetSaveFileTextCallback(SaveFileTextCallback callback);  // Установить собственный сохранитель текстовых данных файлов

    int FileRename(const char *fileName, const char *fileRename); // Переименовать файл (если существует)
    int FileRemove(const char *fileName);                         // Удалить файл (если существует)
    int FileCopy(const char *srcPath, const char *dstPath);       // Скопировать файл из одного пути в другой, целевой путь (dstPath) создается, если он не существует
    int FileMove(const char *srcPath, const char *dstPath);       // Переместить файл из одной директории в другую, целевой путь (dstPath) создается, если он не существует
    int FileTextReplace(const char *fileName, const char *search, const char *replacement); // Заменить текст в существующем файле
    int FileTextFindIndex(const char *fileName, const char *search); // Найти текст в существующем файле
    bool FileExists(const char *fileName);                        // Проверить, существует ли файл
    bool DirectoryExists(const char *dirPath);                    // Проверить, существует ли путь к директории (каталогу)
    bool IsFileExtension(const char *fileName, const char *ext);  // Проверить расширение файла (рекомендуется указывать с точкой: .png, .wav)
    int GetFileLength(const char *fileName);                      // Получить размер файла в байтах (ПРИМЕЧАНИЕ: имя GetFileSize() конфликтует с windows.h)
    long GetFileModTime(const char *fileName);                    // Получить время изменения файла (время последней записи)
    const char *GetFileExtension(const char *fileName);           // Получить указатель на расширение в строке имени файла (включая точку: «.png»)
    const char *GetFileName(const char *filePath);                // Получить указатель на имя файла в строке пути
    const char *GetFileNameWithoutExt(const char *filePath);      // Получить имя файла без расширения (использует static string)
    const char *GetDirectoryPath(const char *filePath);           // Получить полный путь для заданного пути к файлу (использует static string)
    const char *GetPrevDirectoryPath(const char *dirPath);        // Получить путь к родительской директории для заданного пути (использует static string)
    const char *GetWorkingDirectory(void);                        // Получить текущую рабочую директорию (использует static string)
    const char *GetApplicationDirectory(void);                    // Получить директорию запущенного приложения (использует static string)
    int MakeDirectory(const char *dirPath);                       // Создать директории (включая все вложенные папки по указанному пути), возвращает 0 в случае успеха
    bool ChangeDirectory(const char *dirPath);                    // Изменить текущую рабочую директорию, возвращает true в случае успеха
    bool IsPathFile(const char *path);                            // Проверить, является ли заданный путь файлом или директорией
    bool IsFileNameValid(const char *fileName);                   // Проверить, корректно (валидно) ли имя файла для текущей платформы/ОС
    FilePathList LoadDirectoryFiles(const char *dirPath);         // Загрузить пути к файлам и директориям, без сканирования поддиректорий (вложенных папок)
    FilePathList LoadDirectoryFilesEx(const char *basePath, const char *filter, bool scanSubdirs); // Загрузить пути к файлам с фильтрацией по расширению и сканированием поддиректорий; доступные фильтры: ".", "FILES", "DIRS"**
    void UnloadDirectoryFiles(FilePathList files);                // Выгрузить (очистить из памяти) пути к файлам
    bool IsFileDropped(void);                                     // Проверить, был ли файл перетащен (сброшен) в окно программы
    FilePathList LoadDroppedFiles(void);                          // Загрузить пути к перетащенным (сброшенным) файлам
    void UnloadDroppedFiles(FilePathList files);                  // Выгрузить (очистить из памяти) пути к перетащенным (сброшенным) файлам
    unsigned int GetDirectoryFileCount(const char *dirPath);      // Получить количество файлов в директории (каталоге)
    unsigned int GetDirectoryFileCountEx(const char *basePath, const char *filter, bool scanSubdirs); // Получить количество файлов в директории с фильтрацией по расширению и рекурсивным сканированием. Используйте 'DIR' в строке фильтра, чтобы включить директории в результат.

    // Функции сжатия и кодирования данных
    unsigned char *CompressData(const unsigned char *data, int dataSize, int *compDataSize);        // Сжать данные (алгоритм DEFLATE), память необходимо освободить через MemFree()
    unsigned char *DecompressData(const unsigned char *compData, int compDataSize, int *dataSize);  // Разжать данные (алгоритм DEFLATE), память необходимо освободить через MemFree()
    char *EncodeDataBase64(const unsigned char *data, int dataSize, int *outputSize);               // Закодировать данные в string Base64 (включая NULL-терминатор), память необходимо освободить через MemFree()
    unsigned char *DecodeDataBase64(const char *text, int *outputSize);                             // Декодировать string Base64 (ожидается наличие NULL-терминатора), память необходимо освободить через MemFree()
    unsigned int ComputeCRC32(unsigned char *data, int dataSize); // Вычислить хэш-код CRC32
    unsigned int *ComputeMD5(unsigned char *data, int dataSize);  // Вычислить хэш-код MD5, возвращает статический массив int[4] (16 байт)
    unsigned int *ComputeSHA1(unsigned char *data, int dataSize); // Вычислить хэш-код SHA1, возвращает статический массив int[5] (20 байт)
    unsigned int *ComputeSHA256(unsigned char *data, int dataSize); // Вычислить хэш-код SHA256, возвращает статический массив int[8] (32 байта)

    // Функционал событий автоматизации
    AutomationEventList LoadAutomationEventList(const char *fileName); // Загрузить список событий автоматизации из файла, NULL для пустого списка, вместимость = MAX_AUTOMATION_EVENTS
    void UnloadAutomationEventList(AutomationEventList list);   // Выгрузить список событий автоматизации из файла
    bool ExportAutomationEventList(AutomationEventList list, const char *fileName); // Экспортировать список событий автоматизации в виде текстового файла
    void SetAutomationEventList(AutomationEventList *list);     // Установить список событий автоматизации для записи
    void SetAutomationEventBaseFrame(int frame);                // Установить внутренний базовый кадр события автоматизации для начала записи
    void StartAutomationEventRecording(void);                   // Начать запись событий автоматизации (необходимо установить AutomationEventList)
    void StopAutomationEventRecording(void);                    // Остановить запись событий автоматизации
    void PlayAutomationEvent(AutomationEvent event);            // Воспроизвести записанное событие автоматизации

    //------------------------------------------------------------------------------------
    // Функции обработки ввода (Модуль: core)
    //------------------------------------------------------------------------------------

    // Функции работы с вводом: клавиатура
    bool IsKeyPressed(int key);                             // Проверить, была ли клавиша нажата один раз
    bool IsKeyPressedRepeat(int key);                       // Проверить, была ли клавиша нажата повторно
    bool IsKeyDown(int key);                                // Проверить, зажата ли клавиша в данный момент
    bool IsKeyReleased(int key);                            // Проверить, была ли клавиша отпущена один раз
    bool IsKeyUp(int key);                                  // Проверить, что клавиша НЕ зажата в данный момент
    int GetKeyPressed(void);                                // Получить нажатую клавишу (код клавиши); вызовите несколько раз для получения клавиш из очереди, возвращает 0, когда очередь пуста
    int GetCharPressed(void);                               // Получить нажатый символ (Unicode); вызовите несколько раз для получения символов из очереди, возвращает 0, когда очередь пуста
    const char *GetKeyName(int key);                        // Получить имя клавиши QWERTY для текущей раскладки клавиатуры (например, вернет строку 'q' для KEY_A на клавиатуре AZERTY)
    void SetExitKey(int key);                               // Установить кастомную клавишу для выхода из программы (по умолчанию — ESC)

    // Функции работы с вводом: геймпады
    bool IsGamepadAvailable(int gamepad);                   // Проверить, доступен ли геймпад
    const char *GetGamepadName(int gamepad);                // Получить внутренний идентификатор имени геймпада
    bool IsGamepadButtonPressed(int gamepad, int button);   // Проверить, была ли кнопка геймпада нажата один раз
    bool IsGamepadButtonDown(int gamepad, int button);      // Проверить, зажата ли кнопка геймпада в данный момент
    bool IsGamepadButtonReleased(int gamepad, int button);  // Проверить, была ли кнопка геймпада отпущена один раз
    bool IsGamepadButtonUp(int gamepad, int button);        // Проверить, что кнопка геймпада НЕ зажата в данный момент
    int GetGamepadButtonPressed(void);                      // Получить последнюю нажатую кнопку геймпада
    int GetGamepadAxisCount(int gamepad);                   // Получить количество осей геймпада
    float GetGamepadAxisMovement(int gamepad, int axis);    // Получить значение смещения оси геймпада
    int SetGamepadMappings(const char *mappings);           // Установить внутреннюю карту кнопок геймпада (база данных SDL_GameControllerDB)
    void SetGamepadVibration(int gamepad, float leftMotor, float rightMotor, float duration); // Установить вибрацию геймпада для обоих моторов (длительность в секундах)

    // Функции работы с вводом: мышь
    bool IsMouseButtonPressed(int button);                  // Проверить, была ли кнопка мыши нажата один раз
    bool IsMouseButtonDown(int button);                     // Проверить, зажата ли кнопка мыши в данный момент
    bool IsMouseButtonReleased(int button);                 // Проверить, была ли кнопка мыши отпущена один раз
    bool IsMouseButtonUp(int button);                       // Проверить, что кнопка мыши НЕ зажата в данный момент
    int GetMouseX(void);                                    // Получить координату X курсора мыши
    int GetMouseY(void);                                    // Получить координату Y курсора мыши
    Vector2 GetMousePosition(void);                         // Получить координаты X и Y курсора мыши
    Vector2 GetMouseDelta(void);                            // Получить смещение (Дельта) мыши между кадрами
    void SetMousePosition(int x, int y);                    // Установить координаты X и Y курсора мыши
    void SetMouseOffset(int offsetX, int offsetY);          // Установить смещение мыши
    void SetMouseScale(float scaleX, float scaleY);         // Установить масштабирование мыши
    float GetMouseWheelMove(void);                          // Получить смещение колесика мыши по X или Y, в зависимости от того, какое больше
    Vector2 GetMouseWheelMoveV(void);                       // Получить смещение колесика мыши по X и Y одновременно
    void SetMouseCursor(int cursor);                        // Установить курсор мыши

    // Функции работы с вводом: тач / сенсорный ввод
    int GetTouchX(void);                                    // Получить координату X тач-ввода для точки 0 (относительно размера экрана)
    int GetTouchY(void);                                    // Получить координату Y тач-ввода для точки 0 (относительно размера экрана)
    Vector2 GetTouchPosition(int index);                    // Получить координаты X и Y тач-ввода для указанного индекса точки касания (относительно размера экрана)
    int GetTouchPointId(int index);                         // Получить уникальный идентификатор точки касания по её индексу
    int GetTouchPointCount(void);                           // Получить количество точек касания

    //------------------------------------------------------------------------------------
    // Функции обработки жестов и тач-ввода (Модуль: rgestures)
    //------------------------------------------------------------------------------------
    void SetGesturesEnabled(unsigned int flags);            // Включить набор жестов с помощью флагов
    bool IsGestureDetected(unsigned int gesture);           // Проверить, был ли обнаружен жест
    int GetGestureDetected(void);                           // Получить последний обнаруженный жест
    float GetGestureHoldDuration(void);                     // Получить время удержания жеста в секундах
    Vector2 GetGestureDragVector(void);                     // Получить вектор перетаскивания жеста
    float GetGestureDragAngle(void);                        // Получить угол перетаскивания жеста
    Vector2 GetGesturePinchVector(void);                    // Получить дельту щипка жеста
    float GetGesturePinchAngle(void);                       // Получить угол щипка жеста

    //------------------------------------------------------------------------------------
    // Функции системы камеры (Модуль: rcamera)
    //------------------------------------------------------------------------------------
    void UpdateCamera(Camera *camera, int mode);            // Обновить позицию камеры для выбранного режима
    void UpdateCameraPro(Camera *camera, Vector3 movement, Vector3 rotation, float zoom); // Обновить перемещение и вращение камеры

