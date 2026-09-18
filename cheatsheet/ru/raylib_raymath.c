
    // Математические утилиты
    float Clamp(float value, float min, float max)                              // Ограничить вещественное значение
    float Lerp(float start, float end, float amount)                            // Вычислить линейную интерполяцию между двумя вещественными числами
    float Normalize(float value, float start, float end)                        // Нормализовать входное значение внутри входного диапазона
    float Remap(float value, float inputStart, float inputEnd, float outputStart, float outputEnd) // Переотобразить входное значение из входного диапазона в выходной диапазон
    float Wrap(float value, float min, float max)                               // Зациклить входное значение в диапазоне от min до max
    int FloatEquals(float x, float y)                                           // Проверить, практически ли равны два заданных вещественных числа

    // Математика векторов Vector2
    Vector2 Vector2Zero(void)                                                   // Вектор со значениями компонентов 0.0f
    Vector2 Vector2One(void)                                                    // Вектор со значениями компонентов 1.0f
    Vector2 Vector2Add(Vector2 v1, Vector2 v2)                                  // Сложить два вектора (v1 + v2)
    Vector2 Vector2AddValue(Vector2 v, float add)                               // Сложить вектор и вещественное число
    Vector2 Vector2Subtract(Vector2 v1, Vector2 v2)                             // Вычесть два вектора (v1 - v2)
    Vector2 Vector2SubtractValue(Vector2 v, float sub)                          // Вычесть вещественное число из вектора
    float Vector2Length(Vector2 v)                                              // Вычислить длину вектора
    float Vector2LengthSqr(Vector2 v)                                           // Вычислить квадрат длины вектора
    float Vector2DotProduct(Vector2 v1, Vector2 v2)                             // Вычислить скалярное произведение двух векторов
    float Vector2CrossProduct(Vector2 v1, Vector2 v2)                           // Вычислить векторное произведение двух векторов
    float Vector2Distance(Vector2 v1, Vector2 v2)                               // Вычислить расстояние между двумя векторами
    float Vector2DistanceSqr(Vector2 v1, Vector2 v2)                            // Вычислить квадрат расстояния между двумя векторами
    float Vector2Angle(Vector2 v1, Vector2 v2)                                  // Вычислить угол со знаком от v1 к v2 относительно начала координат (0, 0). ПРИМЕЧАНИЕ: Соглашение о системе координат: положительная ось X направлена вправо, положительная ось Y — вниз, положительные углы отсчитываются по часовой стрелке, а отрицательные — против часовой стрелки
    float Vector2LineAngle(Vector2 start, Vector2 end)                          // Вычислить угол, заданный линиями двух векторов. ПРИМЕЧАНИЕ: Параметры должны быть нормализованы. Текущая реализация должна соответствовать glm::angle
    Vector2 Vector2Scale(Vector2 v, float scale)                                // Масштабировать вектор (умножить на значение)
    Vector2 Vector2Multiply(Vector2 v1, Vector2 v2)                             // Перемножить вектор на вектор
    Vector2 Vector2Negate(Vector2 v)                                            // Инвертировать вектор
    Vector2 Vector2Divide(Vector2 v1, Vector2 v2)                               // Разделить вектор на вектор
    Vector2 Vector2Normalize(Vector2 v)                                         // Нормализовать заданный вектор
    Vector2 Vector2Transform(Vector2 v, Matrix mat)                             // Трансформировать Vector2 с помощью заданной матрицы
    Vector2 Vector2Lerp(Vector2 v1, Vector2 v2, float amount)                   // Вычислить линейную интерполяцию между двумя векторами
    Vector2 Vector2Reflect(Vector2 v, Vector2 normal)                           // Вычислить вектор отражения от нормали
    Vector2 Vector2Min(Vector2 v1, Vector2 v2)                                  // Получить минимальное значение для каждой пары компонентов
    Vector2 Vector2Max(Vector2 v1, Vector2 v2)                                  // Получить максимальное значение для каждой пары компонентов
    Vector2 Vector2Rotate(Vector2 v, float angle)                               // Повернуть вектор на угол
    Vector2 Vector2MoveTowards(Vector2 v, Vector2 target, float maxDistance)    // Переместить вектор к цели
    Vector2 Vector2Invert(Vector2 v)                                            // Инвертировать данный вектор
    Vector2 Vector2Clamp(Vector2 v, Vector2 min, Vector2 max)                   // Ограничить компоненты вектора между минимальными и максимальными значениями, заданными переданными векторами
    Vector2 Vector2ClampValue(Vector2 v, float min, float max)                  // Ограничить длину вектора между минимальным и максимальным значениями
    int Vector2Equals(Vector2 p, Vector2 q)                                     // Проверить, почти ли равны два данных вектора
    Vector2 Vector2Refract(Vector2 v, Vector2 n, float r)                       // Вычислить направление преломлённого луча (v — нормализованное направление падающего луча, n — нормализованный вектор нормали к границе раздела двух оптических сред, r — отношение коэффициента преломления среды, из которой исходит луч, к коэффициенту преломления среды с другой стороны поверхности)

    // Математика векторов Vector3
    Vector3 Vector3Zero(void)                                                   // Вектор с компонентами со значением 0.0f
    Vector3 Vector3One(void)                                                    // Вектор с компонентами со значением 1.0f
    Vector3 Vector3Add(Vector3 v1, Vector3 v2)                                  // Сложить два вектора
    Vector3 Vector3AddValue(Vector3 v, float add)                               // Прибавить к вектору значение с плавающей запятой
    Vector3 Vector3Subtract(Vector3 v1, Vector3 v2)                             // Вычесть два вектора
    Vector3 Vector3SubtractValue(Vector3 v, float sub)                          // Вычесть из вектора значение с плавающей запятой
    Vector3 Vector3Scale(Vector3 v, float scalar)                               // Умножить вектор на скаляр
    Vector3 Vector3Multiply(Vector3 v1, Vector3 v2)                             // Перемножить вектор на вектор
    Vector3 Vector3CrossProduct(Vector3 v1, Vector3 v2)                         // Вычислить векторное произведение двух векторов
    Vector3 Vector3Perpendicular(Vector3 v)                                     // Вычислить перпендикулярный вектор для одного вектора
    float Vector3Length(const Vector3 v)                                        // Вычислить длину вектора
    float Vector3LengthSqr(const Vector3 v)                                     // Вычислить квадрат длины вектора
    float Vector3DotProduct(Vector3 v1, Vector3 v2)                             // Вычислить скалярное произведение двух векторов
    float Vector3Distance(Vector3 v1, Vector3 v2)                               // Вычислить расстояние между двумя векторами
    float Vector3DistanceSqr(Vector3 v1, Vector3 v2)                            // Вычислить квадрат расстояния между двумя векторами
    float Vector3Angle(Vector3 v1, Vector3 v2)                                  // Вычислить угол между двумя векторами
    Vector3 Vector3Negate(Vector3 v)                                            // Инвертировать направление данного вектора
    Vector3 Vector3Divide(Vector3 v1, Vector3 v2)                               // Разделить вектор на вектор
    Vector3 Vector3Normalize(Vector3 v)                                         // Нормализовать данный вектор
    Vector3 Vector3Project(Vector3 v1, Vector3 v2)                              // Вычислить проекцию вектора v1 на вектор v2
    Vector3 Vector3Reject(Vector3 v1, Vector3 v2)                               // Вычислить ортогональную проекцию вектора v1 на вектор v2
    void Vector3OrthoNormalize(Vector3 *v1, Vector3 *v2)                        // Ортонормировать данные векторы (делает векторы нормализованными и ортогональными друг другу по алгоритму Грамма-Шмидта)
    Vector3 Vector3Transform(Vector3 v, Matrix mat)                             // Преобразовать вектор Vector3 с помощью заданной матрицы
    Vector3 Vector3RotateByQuaternion(Vector3 v, Quaternion q)                  // Преобразовать вектор с помощью вращения кватернионом
    Vector3 Vector3RotateByAxisAngle(Vector3 v, Vector3 axis, float angle)      // Повернуть вектор вокруг оси
    Vector3 Vector3MoveTowards(Vector3 v, Vector3 target, float maxDistance)    // Переместить вектор к цели
    Vector3 Vector3Lerp(Vector3 v1, Vector3 v2, float amount)                   // Вычислить линейную интерполяцию между двумя векторами
    Vector3 Vector3CubicHermite(Vector3 v1, Vector3 tangent1, Vector3 v2, Vector3 tangent2, float amount) // Вычислить кубическую интерполяцию Эрмита между двумя векторами и их тангенсами в соответствии со спецификацией GLTF 2.0: https://registry.khronos.org/glTF/specs/2.0/glTF-2.0.html#interpolation-cubic
    Vector3 Vector3Reflect(Vector3 v, Vector3 normal)                           // Вычислить вектор отражения от нормали
    Vector3 Vector3Min(Vector3 v1, Vector3 v2)                                  // Получить минимальное значение для каждой пары компонентов
    Vector3 Vector3Max(Vector3 v1, Vector3 v2)                                  // Получить максимальное значение для каждой пары компонентов
    Vector3 Vector3Barycenter(Vector3 p, Vector3 a, Vector3 b, Vector3 c)       // Вычислить барицентрические координаты (u, v, w) точки p относительно треугольника (a, b, c) ПРИМЕЧАНИЕ: Предполагается, что P находится в плоскости треугольника
    Vector3 Vector3Unproject(Vector3 source, Matrix projection, Matrix view)    // Проецирует вектор Vector3 из экранного пространства в пространство объекта ПРИМЕЧАНИЕ: Самодостаточная функция, другие функции raymath не вызываются
    float3 Vector3ToFloatV(Vector3 v)                                           // Получить Vector3 в виде массива чисел с плавающей запятой
    Vector3 Vector3Invert(Vector3 v)                                            // Инвертировать данный вектор
    Vector3 Vector3Clamp(Vector3 v, Vector3 min, Vector3 max)                   // Ограничить компоненты вектора между минимальными и максимальными значениями, заданными переданными векторами
    Vector3 Vector3ClampValue(Vector3 v, float min, float max)                  // Ограничить длину вектора между двумя значениями
    int Vector3Equals(Vector3 p, Vector3 q)                                     // Проверить, почти ли равны два данных вектора
    Vector3 Vector3Refract(Vector3 v, Vector3 n, float r)                       // Вычислить направление преломлённого луча (v — нормализованное направление падающего луча, n — нормализованный вектор нормали к границе раздела двух оптических сред, r — отношение коэффициента преломления среды, из которой исходит луч, к коэффициенту преломления среды с другой стороны поверхности)

    // Математика векторов Vector4
    Vector4 Vector4Zero(void)                                                   // Получить нулевой вектор
    Vector4 Vector4One(void)                                                    // Получить единичный вектор
    Vector4 Vector4Add(Vector4 v1, Vector4 v2)                                  // Сложить два вектора
    Vector4 Vector4AddValue(Vector4 v, float add)                               // Добавить значение к компонентам вектора
    Vector4 Vector4Subtract(Vector4 v1, Vector4 v2)                             // Вычесть векторы
    Vector4 Vector4SubtractValue(Vector4 v, float add)                          // Вычесть значение из компонентов вектора
    float Vector4Length(Vector4 v)                                              // Длина вектора
    float Vector4LengthSqr(Vector4 v)                                           // Квадрат длины вектора
    float Vector4DotProduct(Vector4 v1, Vector4 v2)                             // Скалярное произведение векторов
    float Vector4Distance(Vector4 v1, Vector4 v2)                               // Вычислить расстояние между двумя векторами
    float Vector4DistanceSqr(Vector4 v1, Vector4 v2)                            // Вычислить квадрат расстояния между двумя векторами
    Vector4 Vector4Scale(Vector4 v, float scale)                                // Масштабировать компоненты вектора на значение (умножить)
    Vector4 Vector4Multiply(Vector4 v1, Vector4 v2)                             // Перемножить вектор на вектор
    Vector4 Vector4Negate(Vector4 v)                                            // Инвертировать направление вектора
    Vector4 Vector4Divide(Vector4 v1, Vector4 v2)                               // Разделить вектор на вектор
    Vector4 Vector4Normalize(Vector4 v)                                         // Нормализовать данный вектор
    Vector4 Vector4Min(Vector4 v1, Vector4 v2)                                  // Получить минимальное значение для каждой пары компонентов
    Vector4 Vector4Max(Vector4 v1, Vector4 v2)                                  // Получить максимальное значение для каждой пары компонентов
    Vector4 Vector4Lerp(Vector4 v1, Vector4 v2, float amount)                   // Вычислить линейную интерполяцию между двумя векторами
    Vector4 Vector4MoveTowards(Vector4 v, Vector4 target, float maxDistance)    // Переместить вектор к цели
    Vector4 Vector4Invert(Vector4 v)                                            // Инвертировать данный вектор
    int Vector4Equals(Vector4 p, Vector4 q)                                     // Проверить, почти ли равны два данных вектора


    // Математика матриц
    float MatrixDeterminant(Matrix mat)                                         // Вычислить определитель матрицы
    float MatrixTrace(Matrix mat)                                               // Получить след матрицы (сумму значений по диагонали)
    Matrix MatrixTranspose(Matrix mat)                                          // Транспонировать данную матрицу
    Matrix MatrixInvert(Matrix mat)                                             // Инвертировать данную матрицу
    Matrix MatrixIdentity(void)                                                 // Получить единичную матрицу
    Matrix MatrixAdd(Matrix left, Matrix right)                                 // Сложить две матрицы
    Matrix MatrixSubtract(Matrix left, Matrix right)                            // Вычесть две матрицы (left - right)
    Matrix MatrixMultiply(Matrix left, Matrix right)                            // Перемножить две матрицы ПРИМЕЧАНИЕ: При умножении матриц... порядок имеет значение!
    Matrix MatrixMultiplyValue(Matrix left, float value)                        // Умножить компоненты матрицы на значение
    Matrix MatrixTranslate(float x, float y, float z)                           // Получить матрицу переноса
    Matrix MatrixRotate(Vector3 axis, float angle)                              // Создать матрицу вращения вокруг оси на угол ПРИМЕЧАНИЕ: Угол должен быть задан в радианах
    Matrix MatrixRotateX(float angle)                                           // Получить матрицу вращения вокруг оси X ПРИМЕЧАНИЕ: Угол должен быть задан в радианах
    Matrix MatrixRotateY(float angle)                                           // Получить матрицу вращения вокруг оси Y ПРИМЕЧАНИЕ: Угол должен быть задан в радианах
    Matrix MatrixRotateZ(float angle)                                           // Получить матрицу вращения вокруг оси Z ПРИМЕЧАНИЕ: Угол должен быть задан в радианах
    Matrix MatrixRotateXYZ(Vector3 angle)                                       // Получить матрицу вращения XYZ ПРИМЕЧАНИЕ: Угол должен быть задан в радианах
    Matrix MatrixRotateZYX(Vector3 angle)                                       // Получить матрицу вращения ZYX ПРИМЕЧАНИЕ: Угол должен быть задан в радианах
    Matrix MatrixScale(float x, float y, float z)                               // Получить матрицу масштабирования
    Matrix MatrixFrustum(double left, double right, double bottom, double top, double nearPlane, double farPlane) // Получить матрицу перспективной проекции (усечённый конус)
    Matrix MatrixPerspective(double fovY, double aspect, double nearPlane, double farPlane) // Получить матрицу перспективной проекции ПРИМЕЧАНИЕ: Угол Fovy должен быть задан в радианах
    Matrix MatrixOrtho(double left, double right, double bottom, double top, double nearPlane, double farPlane) // Получить матрицу ортографической проекции
    Matrix MatrixLookAt(Vector3 eye, Vector3 target, Vector3 up)                // Получить матрицу взгляда камеры (матрицу вида)
    float16 MatrixToFloatV(Matrix mat)                                          // Получить массив чисел с плавающей запятой из данных матрицы




    // Математика кватернионов
    Quaternion QuaternionAdd(Quaternion q1, Quaternion q2)                      // Сложить два кватерниона
    Quaternion QuaternionAddValue(Quaternion q, float add)                      // Добавить к кватерниону значение с плавающей запятой
    Quaternion QuaternionSubtract(Quaternion q1, Quaternion q2)                 // Вычесть два кватерниона
    Quaternion QuaternionSubtractValue(Quaternion q, float sub)                 // Вычесть из кватерниона значение с плавающей запятой
    Quaternion QuaternionIdentity(void)                                         // Получить единичный кватернион
    float QuaternionLength(Quaternion q)                                        // Вычислить длину кватерниона
    Quaternion QuaternionNormalize(Quaternion q)                                // Нормализовать данный кватернион
    Quaternion QuaternionInvert(Quaternion q)                                   // Инвертировать данный кватернион
    Quaternion QuaternionMultiply(Quaternion q1, Quaternion q2)                 // Перемножить два кватерниона
    Quaternion QuaternionScale(Quaternion q, float mul)                         // Масштабировать кватернион на значение с плавающей запятой
    Quaternion QuaternionDivide(Quaternion q1, Quaternion q2)                   // Разделить два кватерниона
    Quaternion QuaternionLerp(Quaternion q1, Quaternion q2, float amount)       // Вычислить линейную интерполяцию между двумя кватернионами
    Quaternion QuaternionNlerp(Quaternion q1, Quaternion q2, float amount)      // Вычислить оптимизированную для сферической интерполяцию (nlerp) между двумя кватернионами
    Quaternion QuaternionSlerp(Quaternion q1, Quaternion q2, float amount)      // Вычислить сферическую линейную интерполяцию (slerp) между двумя кватернионами
    Quaternion QuaternionCubicHermiteSpline(Quaternion q1, Quaternion outTangent1, Quaternion q2, Quaternion inTangent2, float t) // Вычислить кубическую сплайн-интерполяцию кватернионов по алгоритму кубического сплайна Эрмита, как описано в спецификации GLTF 2.0
    Quaternion QuaternionFromVector3ToVector3(Vector3 from, Vector3 to)         // Вычислить кватернион вращения от одного вектора к другому
    Quaternion QuaternionFromMatrix(Matrix mat)                                 // Получить кватернион из заданной матрицы вращения
    Matrix QuaternionToMatrix(Quaternion q)                                     // Получить матрицу из заданного кватерниона
    Quaternion QuaternionFromAxisAngle(Vector3 axis, float angle)               // Получить кватернион вращения вокруг оси на угол ПРИМЕЧАНИЕ: Угол должен быть задан в радианах
    void QuaternionToAxisAngle(Quaternion q, Vector3 *outAxis, float *outAngle) // Получить угол и ось вращения для заданного кватерниона
    Quaternion QuaternionFromEuler(float pitch, float yaw, float roll)          // Получить кватернион из углов Эйлера ПРИМЕЧАНИЕ: Порядок вращения — ZYX
    Vector3 QuaternionToEuler(Quaternion q)                                     // Получить углы Эйлера из кватерниона (тангаж, рыскание, крен) ПРИМЕЧАНИЕ: Углы возвращаются в структуре Vector3 в радианах
    Quaternion QuaternionTransform(Quaternion q, Matrix mat)                    // Преобразовать кватернион с помощью заданной матрицы преобразования
    int QuaternionEquals(Quaternion p, Quaternion q)                            // Проверить, почти ли равны два данных кватерниона
    Matrix MatrixCompose(Vector3 translation, Quaternion rotation, Vector3 scale) // Составить матрицу преобразования из компонентов переноса, вращения и масштабирования
    void MatrixDecompose(Matrix mat, Vector3 *translation, Quaternion *rotation, Vector3 *scale) // Разложить матрицу преобразования на компоненты переноса, вращения и масштабирования с удалением сдвига
