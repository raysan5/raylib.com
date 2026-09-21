    // ПРИМЕЧАНИЕ: Это может быть полезно при использовании базовых фигур и одного шрифта;
    // определение белого прямоугольника для символа шрифта позволит рисовать всё за один вызов отрисовки (draw call)
    void SetShapesTexture(Texture2D texture, Rectangle source); // Установить текстуру и прямоугольник для использования при рисовании фигур
    Texture2D GetShapesTexture(void);                 // Получить текстуру, которая используется для рисования фигур
    Rectangle GetShapesTextureRectangle(void);        // Получить исходный прямоугольник текстуры, используемый для рисования фигур

    // Функции рисования базовых фигур
    void DrawPixel(int posX, int posY, Color color);                                                   // Нарисовать пиксель с помощью геометрии [Может быть медленно, используйте с осторожностью]
    void DrawPixelV(Vector2 position, Color color);                                                    // Нарисовать пиксель с помощью геометрии (векторная версия) [Может быть медленно, используйте с осторожностью]
    void DrawLine(int startPosX, int startPosY, int endPosX, int endPosY, Color color);                // Нарисовать линию
    void DrawLineV(Vector2 startPos, Vector2 endPos, Color color);                                     // Нарисовать линию (используя линии gl)
    void DrawLineEx(Vector2 startPos, Vector2 endPos, float thick, Color color);                       // Нарисовать линию (используя треугольники/четырехугольники)
    void DrawLineStrip(const Vector2 *points, int pointCount, Color color);                            // Нарисовать последовательность линий (используя линии gl)
    void DrawLineBezier(Vector2 startPos, Vector2 endPos, float thick, Color color);                   // Нарисовать сегмент линии с кубической интерполяцией Безье (плавный вход-выход)
    void DrawLineDashed(Vector2 startPos, Vector2 endPos, int dashSize, int spaceSize, Color color);   // Нарисовать пунктирную линию
    void DrawCircle(int centerX, int centerY, float radius, Color color);                              // Нарисовать закрашенный круг
    void DrawCircleV(Vector2 center, float radius, Color color);                                       // Нарисовать закрашенный круг (векторная версия)
    void DrawCircleGradient(Vector2 center, float radius, Color inner, Color outer);                   // Нарисовать круг, заполненный градиентом
    void DrawCircleSector(Vector2 center, float radius, float startAngle, float endAngle, int segments, Color color); // Нарисовать сектор круга
    void DrawCircleSectorLines(Vector2 center, float radius, float startAngle, float endAngle, int segments, Color color); // Нарисовать контур сектора круга
    void DrawCircleLines(int centerX, int centerY, float radius, Color color);                         // Нарисовать контур круга
    void DrawCircleLinesV(Vector2 center, float radius, Color color);                                  // Нарисовать контур круга (векторная версия)
    void DrawEllipse(int centerX, int centerY, float radiusH, float radiusV, Color color);             // Нарисовать эллипс
    void DrawEllipseV(Vector2 center, float radiusH, float radiusV, Color color);                      // Нарисовать эллипс (векторная версия)
    void DrawEllipseLines(int centerX, int centerY, float radiusH, float radiusV, Color color);        // Нарисовать контур эллипса
    void DrawEllipseLinesV(Vector2 center, float radiusH, float radiusV, Color color);                 // Нарисовать контур эллипса (векторная версия)
    void DrawRing(Vector2 center, float innerRadius, float outerRadius, float startAngle, float endAngle, int segments, Color color); // Нарисовать кольцо
    void DrawRingLines(Vector2 center, float innerRadius, float outerRadius, float startAngle, float endAngle, int segments, Color color); // Нарисовать контур кольца
    void DrawRectangle(int posX, int posY, int width, int height, Color color);                        // Нарисовать закрашенный прямоугольник
    void DrawRectangleV(Vector2 position, Vector2 size, Color color);                                  // Нарисовать закрашенный прямоугольник (векторная версия)
    void DrawRectangleRec(Rectangle rec, Color color);                                                 // Нарисовать закрашенный прямоугольник
    void DrawRectanglePro(Rectangle rec, Vector2 origin, float rotation, Color color);                 // Нарисовать закрашенный прямоугольник с расширенными параметрами
    void DrawRectangleGradientV(int posX, int posY, int width, int height, Color top, Color bottom);   // Нарисовать прямоугольник, заполненный вертикальным градиентом
    void DrawRectangleGradientH(int posX, int posY, int width, int height, Color left, Color right);   // Нарисовать прямоугольник, заполненный горизонтальным градиентом
    void DrawRectangleGradientEx(Rectangle rec, Color topLeft, Color bottomLeft, Color bottomRight, Color topRight); // Нарисовать прямоугольник, заполненный градиентом с кастомными цветами вершин
    void DrawRectangleLines(int posX, int posY, int width, int height, Color color);                   // Нарисовать контур прямоугольника
    void DrawRectangleLinesEx(Rectangle rec, float lineThick, Color color);                            // Нарисовать контур прямоугольника с расширенными параметрами
    void DrawRectangleRounded(Rectangle rec, float roundness, int segments, Color color);              // Нарисовать прямоугольник со скругленными углами
    void DrawRectangleRoundedLines(Rectangle rec, float roundness, int segments, Color color);         // Нарисовать контур прямоугольника со скругленными углами
    void DrawRectangleRoundedLinesEx(Rectangle rec, float roundness, int segments, float lineThick, Color color); // Нарисовать контур прямоугольника со скругленными углами и заданной толщиной линий
    void DrawTriangle(Vector2 v1, Vector2 v2, Vector2 v3, Color color);                                // Нарисовать закрашенный треугольник (вершины против часовой стрелки!)
    void DrawTriangleLines(Vector2 v1, Vector2 v2, Vector2 v3, Color color);                           // Нарисовать контур треугольника (вершины против часовой стрелки!)
    void DrawTriangleFan(const Vector2 *points, int pointCount, Color color);                          // Нарисовать веер треугольников (triangle fan) по точкам (первая вершина — центр)
    void DrawTriangleStrip(const Vector2 *points, int pointCount, Color color);                        // Нарисовать полосу треугольников (triangle strip) по точкам
    void DrawPoly(Vector2 center, int sides, float radius, float rotation, Color color);               // Нарисовать правильный многоугольник (векторная версия)
    void DrawPolyLines(Vector2 center, int sides, float radius, float rotation, Color color);          // Нарисовать контур многоугольника из n сторон
    void DrawPolyLinesEx(Vector2 center, int sides, float radius, float rotation, float lineThick, Color color); // Нарисовать контур многоугольника из n сторон с расширенными параметрами

    // Функции рисования сплайнов
    void DrawSplineLinear(const Vector2 *points, int pointCount, float thick, Color color);            // Нарисовать сплайн: линейный, минимум 2 точки
    void DrawSplineBasis(const Vector2 *points, int pointCount, float thick, Color color);             // Нарисовать сплайн: B-сплайн, минимум 4 точки
    void DrawSplineCatmullRom(const Vector2 *points, int pointCount, float thick, Color color);        // Нарисовать сплайн: Кэтмулла-Рома, минимум 4 точки
    void DrawSplineBezierQuadratic(const Vector2 *points, int pointCount, float thick, Color color);   // Нарисовать сплайн: квадратичный Безье, минимум 3 точки (1 управляющая точка): [p1, c2, p3, c4...]
    void DrawSplineBezierCubic(const Vector2 *points, int pointCount, float thick, Color color);       // Нарисовать сплайн: кубический Безье, минимум 4 точки (2 управляющие точки): [p1, c2, c3, p4, c5, c6...]
    void DrawSplineSegmentLinear(Vector2 p1, Vector2 p2, float thick, Color color);                    // Нарисовать сегмент сплайна: линейный, 2 точки
    void DrawSplineSegmentBasis(Vector2 p1, Vector2 p2, Vector2 p3, Vector2 p4, float thick, Color color); // Нарисовать сегмент сплайна: B-сплайн, 4 точки
    void DrawSplineSegmentCatmullRom(Vector2 p1, Vector2 p2, Vector2 p3, Vector2 p4, float thick, Color color); // Нарисовать сегмент сплайна: Кэтмулла-Рома, 4 точки
    void DrawSplineSegmentBezierQuadratic(Vector2 p1, Vector2 c2, Vector2 p3, float thick, Color color); // Нарисовать сегмент сплайна: квадратичный Безье, 2 точки, 1 управляющая точка
    void DrawSplineSegmentBezierCubic(Vector2 p1, Vector2 c2, Vector2 c3, Vector2 p4, float thick, Color color); // Нарисовать сегмент сплайна: кубический Безье, 2 точки, 2 управляющие точки

    // Функции вычисления точек на сегменте сплайна для заданного t [0.0f .. 1.0f]
    Vector2 GetSplinePointLinear(Vector2 startPos, Vector2 endPos, float t);                           // Вычислить точку сплайна: линейный
    Vector2 GetSplinePointBasis(Vector2 p1, Vector2 p2, Vector2 p3, Vector2 p4, float t);              // Вычислить точку сплайна: B-сплайн
    Vector2 GetSplinePointCatmullRom(Vector2 p1, Vector2 p2, Vector2 p3, Vector2 p4, float t);         // Вычислить точку сплайна: Кэтмулла-Рома
    Vector2 GetSplinePointBezierQuad(Vector2 p1, Vector2 c2, Vector2 p3, float t);                     // Вычислить точку сплайна: квадратичный Безье
    Vector2 GetSplinePointBezierCubic(Vector2 p1, Vector2 c2, Vector2 c3, Vector2 p4, float t);        // Вычислить точку сплайна: кубический Безье

    // Функции обнаружения столкновений (коллизий) базовых фигур
    bool CheckCollisionRecs(Rectangle rec1, Rectangle rec2);                                           // Проверить столкновение между двумя прямоугольниками
    bool CheckCollisionCircles(Vector2 center1, float radius1, Vector2 center2, float radius2);        // Проверить столкновение между двумя кругами
    bool CheckCollisionCircleRec(Vector2 center, float radius, Rectangle rec);                         // Проверить столкновение между кругом и прямоугольником
    bool CheckCollisionCircleLine(Vector2 center, float radius, Vector2 p1, Vector2 p2);               // Проверить столкновение круга с линией, созданной между двумя точками [p1] и [p2]
    bool CheckCollisionPointRec(Vector2 point, Rectangle rec);                                         // Проверить, находится ли точка внутри прямоугольника
    bool CheckCollisionPointCircle(Vector2 point, Vector2 center, float radius);                       // Проверить, находится ли точка внутри круга
    bool CheckCollisionPointTriangle(Vector2 point, Vector2 p1, Vector2 p2, Vector2 p3);               // Проверить, находится ли точка внутри треугольника
    bool CheckCollisionPointLine(Vector2 point, Vector2 p1, Vector2 p2, int threshold);                // Проверить, принадлежит ли точка линии между точками [p1] и [p2] с заданным отступом в пикселях [threshold]
    bool CheckCollisionPointPoly(Vector2 point, const Vector2 *points, int pointCount);                // Проверить, находится ли точка внутри многоугольника, описанного массивом вершин
    bool CheckCollisionLines(Vector2 startPos1, Vector2 endPos1, Vector2 startPos2, Vector2 endPos2, Vector2 *collisionPoint); // Проверить столкновение между двумя линиями, каждая из которых задана двумя точками, возвращает точку столкновения по ссылке
    Rectangle GetCollisionRec(Rectangle rec1, Rectangle rec2);                                         // Получить прямоугольник столкновения для двух пересекающихся прямоугольников

