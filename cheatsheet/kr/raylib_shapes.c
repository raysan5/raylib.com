
    // NOTE: It can be useful when using basic shapes and one single font,
    // defining a font char white rectangle would allow drawing everything in a single draw call
    void SetShapesTexture(Texture2D texture, Rectangle source);       // 도형을 그릴 때 사용할 텍스처의 영역을 설정한다

    // 기본 도형을 그리는 함수들
    void DrawPixel(int posX, int posY, Color color);                                                   // 픽셀을 찍는다
    void DrawPixelV(Vector2 position, Color color);                                                    // 픽셀을 찍는다 (벡터 버전)
    void DrawLine(int startPosX, int startPosY, int endPosX, int endPosY, Color color);                // 선분을 그린다
    void DrawLineV(Vector2 startPos, Vector2 endPos, Color color);                                     // 선분을 그린다 (벡터 버전)
    void DrawLineEx(Vector2 startPos, Vector2 endPos, float thick, Color color);                       // 주어진 두께를 가진 선분을 그린다
    void DrawLineBezier(Vector2 startPos, Vector2 endPos, float thick, Color color);                   // Draw a line using cubic-bezier curves in-out
    void DrawLineBezierQuad(Vector2 startPos, Vector2 endPos, Vector2 controlPos, float thick, Color color); // Draw line using quadratic bezier curves with a control point
    void DrawLineBezierCubic(Vector2 startPos, Vector2 endPos, Vector2 startControlPos, Vector2 endControlPos, float thick, Color color); // Draw line using cubic bezier curves with 2 control points
    void DrawLineStrip(Vector2 *points, int pointCount, Color color);                                  // Draw lines sequence
    void DrawCircle(int centerX, int centerY, float radius, Color color);                              // 주어진 색상으로 채워진 원을 그린다
    void DrawCircleSector(Vector2 center, float radius, float startAngle, float endAngle, int segments, Color color);      // 부채꼴을 그린다
    void DrawCircleSectorLines(Vector2 center, float radius, float startAngle, float endAngle, int segments, Color color); // 부채꼴의 테두리를 그린다
    void DrawCircleGradient(int centerX, int centerY, float radius, Color color1, Color color2);       // 선형 그라데이션으로 채워진 원을 그린다
    void DrawCircleV(Vector2 center, float radius, Color color);                                       // Draw a color-filled circle (Vector version)
    void DrawCircleLines(int centerX, int centerY, float radius, Color color);                         // Draw circle outline
    void DrawEllipse(int centerX, int centerY, float radiusH, float radiusV, Color color);             // 주어진 색상으로 채워진 타원을 그린다
    void DrawEllipseLines(int centerX, int centerY, float radiusH, float radiusV, Color color);        // 타원의 테두리를 그린다
    void DrawRing(Vector2 center, float innerRadius, float outerRadius, float startAngle, float endAngle, int segments, Color color); // Draw ring
    void DrawRingLines(Vector2 center, float innerRadius, float outerRadius, float startAngle, float endAngle, int segments, Color color);    // Draw ring outline
    void DrawRectangle(int posX, int posY, int width, int height, Color color);                        // 주어진 색상으로 채워진 직사각형을 그린다
    void DrawRectangleV(Vector2 position, Vector2 size, Color color);                                  // 주어진 색상으로 채워진 직사각형을 그린다 (벡터 버전)
    void DrawRectangleRec(Rectangle rec, Color color);                                                 // 주어진 색상으로 채워진 직사각형을 그린다 (직사각형 구조체 버전)
    void DrawRectanglePro(Rectangle rec, Vector2 origin, float rotation, Color color);                 // 색상, 원점, 그리고 회전 각도 등의 추가적인 매개 변수로 직사각형을 그린다
    void DrawRectangleGradientV(int posX, int posY, int width, int height, Color color1, Color color2);// 가로 방향의 선형 그라데이션으로 채워진 원을 그린다
    void DrawRectangleGradientH(int posX, int posY, int width, int height, Color color1, Color color2);// 세로 방향의 선형 그라데이션으로 채워진 원을 그린다
    void DrawRectangleGradientEx(Rectangle rec, Color col1, Color col2, Color col3, Color col4);       // Draw a gradient-filled rectangle with custom vertex colors
    void DrawRectangleLines(int posX, int posY, int width, int height, Color color);                   // 직사각형의 테두리를 그린다
    void DrawRectangleLinesEx(Rectangle rec, float lineThick, Color color);                            // 색상과 선 굵기 등의 추가적인 매개 변수로 직사각형을 그린다
    void DrawRectangleRounded(Rectangle rec, float roundness, int segments, Color color);              // 모서리가 둥근 직사각형을 그린다
    void DrawRectangleRoundedLines(Rectangle rec, float roundness, int segments, float lineThick, Color color); // 모서리가 둥근 직사각형의 테두리를 그린다
    void DrawTriangle(Vector2 v1, Vector2 v2, Vector2 v3, Color color);                                // Draw a color-filled triangle (vertex in counter-clockwise order!)
    void DrawTriangleLines(Vector2 v1, Vector2 v2, Vector2 v3, Color color);                           // Draw triangle outline (vertex in counter-clockwise order!)
    void DrawTriangleFan(Vector2 *points, int pointCount, Color color);                                // Draw a triangle fan defined by points (first vertex is the center)
    void DrawTriangleStrip(Vector2 *points, int pointCount, Color color);                              // Draw a triangle strip defined by points
    void DrawPoly(Vector2 center, int sides, float radius, float rotation, Color color);               // Draw a regular polygon (Vector version)
    void DrawPolyLines(Vector2 center, int sides, float radius, float rotation, Color color);          // Draw a polygon outline of n sides
    void DrawPolyLinesEx(Vector2 center, int sides, float radius, float rotation, float lineThick, Color color); // Draw a polygon outline of n sides with extended parameters

    // 기본 도형에 대한 충돌 감지 함수들
    bool CheckCollisionRecs(Rectangle rec1, Rectangle rec2);                                           // 두 직사각형 사이의 충돌을 감지한다
    bool CheckCollisionCircles(Vector2 center1, float radius1, Vector2 center2, float radius2);        // 두 원 사이의 충돌을 감지한다
    bool CheckCollisionCircleRec(Vector2 center, float radius, Rectangle rec);                         // 원과 직사각형 사이의 충돌을 감지한다
    bool CheckCollisionPointRec(Vector2 point, Rectangle rec);                                         // 주어진 점이 직사각형 내부에 있는지 확인한다
    bool CheckCollisionPointCircle(Vector2 point, Vector2 center, float radius);                       // 주어진 점이 원의 내부에 있는지 확인한다
    bool CheckCollisionPointTriangle(Vector2 point, Vector2 p1, Vector2 p2, Vector2 p3);               // 주어진 점이 삼각형 내부에 있는지 확인한다
    bool CheckCollisionPointPoly(Vector2 point, Vector2 *points, int pointCount);                      // 주어진 점이 꼭짓점 배열로 정의된 다각형 내부에 있는지 확인한다
    bool CheckCollisionLines(Vector2 startPos1, Vector2 endPos1, Vector2 startPos2, Vector2 endPos2, Vector2 *collisionPoint); // 시작점과 끝점으로 정의된 두 선분이 서로 만나는지 확인하고, 서로 만난다면 교점을 반환한다
    bool CheckCollisionPointLine(Vector2 point, Vector2 p1, Vector2 p2, int threshold);                // Check if point belongs to line created between two points [p1] and [p2] with defined margin in pixels [threshold]
    Rectangle GetCollisionRec(Rectangle rec1, Rectangle rec2);                                         // 두 직사각형이 겹치는 영역에 해당하는 직사각형을 반환한다

