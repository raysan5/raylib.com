    // Функции отрисовки базовых геометрических 3D-фигур
    void DrawLine3D(Vector3 startPos, Vector3 endPos, Color color);                                    // Отрисовать линию в трехмерном мировом пространстве (3D)
    void DrawPoint3D(Vector3 position, Color color);                                                   // Отрисовать точку в 3D-пространстве (на самом деле маленькую линию)
    void DrawCircle3D(Vector3 center, float radius, Vector3 rotationAxis, float rotationAngle, Color color); // Отрисовать круг в трехмерном мировом пространстве (3D)
    void DrawTriangle3D(Vector3 v1, Vector3 v2, Vector3 v3, Color color);                              // Отрисовать закрашенный цветом треугольник (вершины в порядке против часовой стрелки!)
    void DrawTriangleStrip3D(const Vector3 *points, int pointCount, Color color);                      // Отрисовать ленту треугольников (triangle strip) по заданным точкам
    void DrawCube(Vector3 position, float width, float height, float length, Color color);             // Отрисовать куб
    void DrawCubeV(Vector3 position, Vector3 size, Color color);                                       // Отрисовать куб (векторная версия)
    void DrawCubeWires(Vector3 position, float width, float height, float length, Color color);        // Отрисовать каркас куба
    void DrawCubeWiresV(Vector3 position, Vector3 size, Color color);                                  // Отрисовать каркас куба (векторная версия)
    void DrawSphere(Vector3 centerPos, float radius, Color color);                                     // Отрисовать сферу
    void DrawSphereEx(Vector3 centerPos, float radius, int rings, int slices, Color color);            // Отрисовать сферу с расширенными параметрами
    void DrawSphereWires(Vector3 centerPos, float radius, int rings, int slices, Color color);         // Отрисовать каркас сферы
    void DrawCylinder(Vector3 position, float radiusTop, float radiusBottom, float height, int slices, Color color); // Отрисовать цилиндр или конус
    void DrawCylinderEx(Vector3 startPos, Vector3 endPos, float startRadius, float endRadius, int sides, Color color); // Отрисовать цилиндр с основанием в startPos и вершиной в endPos
    void DrawCylinderWires(Vector3 position, float radiusTop, float radiusBottom, float height, int slices, Color color); // Отрисовать каркас цилиндра или конуса
    void DrawCylinderWiresEx(Vector3 startPos, Vector3 endPos, float startRadius, float endRadius, int sides, Color color); // Отрисовать каркас цилиндра с основанием в startPos и вершиной в endPos
    void DrawCapsule(Vector3 startPos, Vector3 endPos, float radius, int slices, int rings, Color color); // Отрисовать капсулу с центрами сферических наконечников в startPos и endPos
    void DrawCapsuleWires(Vector3 startPos, Vector3 endPos, float radius, int slices, int rings, Color color); // Отрисовать каркас капсулы с центрами сферических наконечников в startPos и endPos
    void DrawPlane(Vector3 centerPos, Vector2 size, Color color);                                      // Отрисовать плоскость XZ
    void DrawRay(Ray ray, Color color);                                                                // Отрисовать луч
    void DrawGrid(int slices, float spacing);                                                          // Отрисовать сетку (с центром в (0, 0, 0))

    //------------------------------------------------------------------------------------
    // Функции загрузки и отрисовки 3D-моделей (Модуль: models)
    //------------------------------------------------------------------------------------

    // Функции управления моделями
    Model LoadModel(const char *fileName);                                                // Загрузить модель из файлов (полигональные сетки и материалы)
    Model LoadModelFromMesh(Mesh mesh);                                                   // Загрузить модель из сгенерированной полигональной сетки (материал по умолчанию)
    bool IsModelValid(Model model);                                                       // Проверить, корректна ли модель (загружена в GPU, VAO/VBO)
    void UnloadModel(Model model);                                                        // Выгрузить модель (включая полигональные сетки) из памяти (ОЗУ и/или видеопамяти)
    BoundingBox GetModelBoundingBox(Model model);                                         // Вычислить границы ограничивающего параллелепипеда модели (учитывает все полигональные сетки)

    // Функции отрисовки моделей
    void DrawModel(Model model, Vector3 position, float scale, Color tint);               // Отрисовать модель (с текстурой, если она задана)
    void DrawModelEx(Model model, Vector3 position, Vector3 rotationAxis, float rotationAngle, Vector3 scale, Color tint); // Отрисовать модель с расширенными параметрами
    void DrawModelWires(Model model, Vector3 position, float scale, Color tint);          // Отрисовать каркас модели (с текстурой, если она задана)
    void DrawModelWiresEx(Model model, Vector3 position, Vector3 rotationAxis, float rotationAngle, Vector3 scale, Color tint); // Отрисовать каркас модели с расширенными параметрами (с текстурой, если она задана)
    void DrawBoundingBox(BoundingBox box, Color color);                                   // Отрисовать каркас ограничивающего параллелепипеда
    void DrawBillboard(Camera camera, Texture2D texture, Vector3 position, float scale, Color tint); // Отрисовать текстуру билборда
    void DrawBillboardRec(Camera camera, Texture2D texture, Rectangle source, Vector3 position, Vector2 size, Color tint); // Отрисовать текстуру билборда, заданную исходной областью
    void DrawBillboardPro(Camera camera, Texture2D texture, Rectangle source, Vector3 position, Vector3 up, Vector2 size, Vector2 origin, float rotation, Color tint); // Отрисовать текстуру билборда, заданную исходной областью и углом поворота

    // Функции управления полигональными сетками
    void UploadMesh(Mesh *mesh, bool dynamic);                                            // Загрузить данные вершин сетки в GPU и предоставить идентификаторы VAO/VBO
    void UpdateMeshBuffer(Mesh mesh, int index, const void *data, int dataSize, int offset); // Обновить данные вершин сетки в GPU для определенного индекса буфера
    void UnloadMesh(Mesh mesh);                                                           // Выгрузить данные сетки из CPU и GPU
    void DrawMesh(Mesh mesh, Material material, Matrix transform);                        // Отрисовать 3D-сетку с материалом и трансформацией
    void DrawMeshInstanced(Mesh mesh, Material material, const Matrix *transforms, int instances); // Отрисовать несколько экземпляров сетки с материалом и различными трансформациями
    BoundingBox GetMeshBoundingBox(Mesh mesh);                                            // Вычислить границы ограничивающего параллелепипеда сетки
    void GenMeshTangents(Mesh *mesh);                                                     // Вычислить касательные векторы сетки
    bool ExportMesh(Mesh mesh, const char *fileName);                                     // Экспортировать данные сетки в файл, возвращает true в случае успеха
    bool ExportMeshAsCode(Mesh mesh, const char *fileName);                               // Экспортировать сетку в виде файла кода (.h), определяющего несколько массивов атрибутов вершин

    // Функции генерации полигональных сеток
    Mesh GenMeshPoly(int sides, float radius);                                            // Сгенерировать полигональную сетку
    Mesh GenMeshPlane(float width, float length, int resX, int resZ);                     // Сгенерировать сетку плоскости (с разбиением)
    Mesh GenMeshCube(float width, float height, float length);                            // Сгенерировать сетку прямоугольного параллелепипеда
    Mesh GenMeshSphere(float radius, int rings, int slices);                              // Сгенерировать сетку сферы (стандартная сфера)
    Mesh GenMeshHemiSphere(float radius, int rings, int slices);                          // Сгенерировать сетку полусферы (без нижнего основания)
    Mesh GenMeshCylinder(float radius, float height, int slices);                         // Сгенерировать сетку цилиндра
    Mesh GenMeshCone(float radius, float height, int slices);                             // Сгенерировать сетку конуса или пирамиды
    Mesh GenMeshTorus(float radius, float size, int radSeg, int sides);                   // Сгенерировать сетку тора
    Mesh GenMeshKnot(float radius, float size, int radSeg, int sides);                    // Сгенерировать сетку трилистника
    Mesh GenMeshHeightmap(Image heightmap, Vector3 size);                                 // Сгенерировать сетку карты высот на основе данных изображения
    Mesh GenMeshCubicmap(Image cubicmap, Vector3 cubeSize);                               // Сгенерировать блочную сетку карты на основе данных изображения

    // Функции загрузки и выгрузки материалов
    Material *LoadMaterials(const char *fileName, int *materialCount);                    // Загрузить материалы из файла модели
    Material LoadMaterialDefault(void);                                                   // Загрузить материал по умолчанию (поддерживает карты DIFFUSE, SPECULAR, NORMAL)
    bool IsMaterialValid(Material material);                                              // Проверить, корректен ли материал (назначен шейдер, текстуры карт загружены в GPU)
    void UnloadMaterial(Material material);                                               // Выгрузить материал из видеопамяти (VRAM)
    void SetMaterialTexture(Material *material, int mapType, Texture2D texture);          // Установить текстуру для определенного типа карты материала (MATERIAL_MAP_DIFFUSE, MATERIAL_MAP_SPECULAR...)
    void SetModelMeshMaterial(Model *model, int meshId, int materialId);                  // Установить материал для полигональной сетки

    // Функции загрузки и выгрузки анимаций моделей
    ModelAnimation *LoadModelAnimations(const char *fileName, int *animCount);            // Загрузить анимации модели из файла
    void UpdateModelAnimation(Model model, ModelAnimation anim, float frame);             // Обновить позу анимации модели (вершинные буферы и матрицы костей)
    void UpdateModelAnimationEx(Model model, ModelAnimation animA, float frameA, ModelAnimation animB, float frameB, float blend); // Обновить позу анимации модели, смешивая две анимации
    void UnloadModelAnimations(ModelAnimation *animations, int animCount);                // Выгрузить данные массива анимаций
    bool IsModelAnimationValid(Model model, ModelAnimation anim);                         // Проверить совпадение скелетов анимации модели

    // Функции определения столкновений
    bool CheckCollisionSpheres(Vector3 center1, float radius1, Vector3 center2, float radius2); // Проверить столкновение между двумя сферами
    bool CheckCollisionBoxes(BoundingBox box1, BoundingBox box2);                         // Проверить столкновение между двумя ограничивающими параллелепипедами
    bool CheckCollisionBoxSphere(BoundingBox box, Vector3 center, float radius);          // Проверить столкновение между параллелепипедом и сферой
    RayCollision GetRayCollisionSphere(Ray ray, Vector3 center, float radius);            // Получить информацию о столкновении между лучом и сферой
    RayCollision GetRayCollisionBox(Ray ray, BoundingBox box);                            // Получить информацию о столкновении между лучом и параллелепипедом
    RayCollision GetRayCollisionMesh(Ray ray, Mesh mesh, Matrix transform);               // Получить информацию о столкновении между лучом и полигональной сеткой
    RayCollision GetRayCollisionTriangle(Ray ray, Vector3 p1, Vector3 p2, Vector3 p3);    // Получить информацию о столкновении между лучом и треугольником
    RayCollision GetRayCollisionQuad(Ray ray, Vector3 p1, Vector3 p2, Vector3 p3, Vector3 p4); // Получить информацию о столкновении между лучом и четырёхугольником

