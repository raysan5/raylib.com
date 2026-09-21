    //设置要用于形状绘图的Texture和Rectangle
    //注意：当使用基本形状和单个Font时, 
    //自定义字体绘制的字符颜色设置为白色时的Rectangle（defining a font char white rectangle）将允许在一次绘制调用中绘制所有内容（这可能涉及到有关rlgl及更底层的知识）
    void SetShapesTexture(Texture2D texture, Rectangle source); //设置要用于形状绘图的Texture和Rectangle，这可能也涉及到rlgl及更底层的知识，如果你不是很熟悉这是做什么的就请慎用，以免产生奇怪的效果
    Texture2D GetShapesTexture(void);                 // Get texture that is used for shapes drawing
    Rectangle GetShapesTextureRectangle(void);        // Get texture source rectangle that is used for shapes drawing
    
    //基本形状绘图功能
    void DrawPixel(int posX, int posY, Color color);                                                    //绘制像素
    void DrawPixelV(Vector2 position, Color color);                                                     //绘制像素(矢量版本)
    void DrawLine(int startPosX, int startPosY, int endPosX, int endPosY, Color color);                 //画一条线
    void DrawLineV(Vector2 startPos, Vector2 endPos, Color color);                                      //绘制直线(矢量版本)
    void DrawLineEx(Vector2 startPos, Vector2 endPos, float thick, Color color);                        //绘制定义厚度的线
    void DrawLineStrip(const Vector2 *points, int pointCount, Color color);                             //绘制线序列
    void DrawLineBezier(Vector2 startPos, Vector2 endPos, float thick, Color color);                    //使用三次贝塞尔曲线绘制直线
    void DrawLineDashed(Vector2 startPos, Vector2 endPos, int dashSize, int spaceSize, Color color);    // Draw a dashed line
    void DrawCircle(int centerX, int centerY, float radius, Color color);                               //绘制颜色填充的圆
    void DrawCircleV(Vector2 center, float radius, Color color);                                        //绘制颜色填充的圆(矢量版本)
    void DrawCircleGradient(Vector2 center, float radius, Color inner, Color outer);                    //绘制渐变填充圆
    void DrawCircleSector(Vector2 center, float radius, float startAngle, float endAngle, int segments, Color color); //画一个圆
    void DrawCircleSectorLines(Vector2 center, float radius, float startAngle, float endAngle, int segments, Color color); //绘制圆扇形轮廓
    void DrawCircleLines(int centerX, int centerY, float radius, Color color);                          //绘制圆轮廓
    void DrawCircleLinesV(Vector2 center, float radius, Color color);                                   // Draw circle outline (Vector version)
    void DrawEllipse(int centerX, int centerY, float radiusH, float radiusV, Color color);              //绘制椭圆
    void DrawEllipseV(Vector2 center, float radiusH, float radiusV, Color color);                       // Draw ellipse (Vector version)
    void DrawEllipseLines(int centerX, int centerY, float radiusH, float radiusV, Color color);         //绘制椭圆轮廓
    void DrawEllipseLinesV(Vector2 center, float radiusH, float radiusV, Color color);                  // Draw ellipse outline (Vector version)
    void DrawRing(Vector2 center, float innerRadius, float outerRadius, float startAngle, float endAngle, int  segments, Color color); //牵引环
    void DrawRingLines(Vector2 center, float innerRadius, float outerRadius, float startAngle, float endAngle, int segments, Color color); //绘制环形轮廓
    void DrawRectangle(int posX, int posY, int width, int height, Color color);                         //绘制填充颜色的Rectangle
    void DrawRectangleV(Vector2 position, Vector2 size, Color color);                                   //绘制彩色填充Rectangle(矢量版)
    void DrawRectangleRec(Rectangle rec, Color color);                                                  //绘制填充颜色的Rectangle
    void DrawRectanglePro(Rectangle rec, Vector2 origin, float rotation, Color color);                  //用pro参数绘制一个填充颜色的Rectangle
    void DrawRectangleGradientV(int posX, int posY, int width, int height, Color top, Color bottom);    //绘制垂直渐变填充Rectangle
    void DrawRectangleGradientH(int posX, int posY, int width, int height, Color left, Color right);    //绘制水平渐变填充Rectangle
    void DrawRectangleGradientEx(Rectangle rec, Color topLeft, Color bottomLeft, Color bottomRight, Color topRight); //使用自定义顶点颜色绘制渐变填充Rectangle
    void DrawRectangleLines(int posX, int posY, int width, int height, Color color);                    //绘制Rectangle轮廓
    void DrawRectangleLinesEx(Rectangle rec, float lineThick, Color color);                             //使用扩展参数绘制Rectangle轮廓
    void DrawRectangleRounded(Rectangle rec, float roundness, int segments, Color color);               //绘制圆角Rectangle
    void DrawRectangleRoundedLines(Rectangle rec, float roundness, int segments, Color color);          //绘制带有圆角边缘轮廓的Rectangle
    void DrawRectangleRoundedLinesEx(Rectangle rec, float roundness, int segments, float lineThick, Color color); // Draw rectangle with rounded edges outline
    void DrawTriangle(Vector2 v1, Vector2 v2, Vector2 v3, Color color);                                 //绘制一个彩色填充三角形(顶点按逆时针顺序！)
    void DrawTriangleLines(Vector2 v1, Vector2 v2, Vector2 v3, Color color);                            //绘制三角形轮廓(顶点按逆时针顺序！)
    void DrawTriangleFan(const Vector2 *points, int pointCount, Color color);                           //绘制由点定义的三角形扇形(第一个顶点是中心)
    void DrawTriangleStrip(const Vector2 *points, int pointCount, Color color);                         //绘制由点定义的三角形条带
    void DrawPoly(Vector2 center, int sides, float radius, float rotation, Color color);                //绘制正多边形(矢量版本)
    void DrawPolyLines(Vector2 center, int sides, float radius, float rotation, Color color);           //绘制n条边的多边形轮廓
    void DrawPolyLinesEx(Vector2 center, int sides, float radius, float rotation, float lineThick, Color color); //使用扩展参数绘制n条边的多边形轮廓

    // Splines drawing functions
    void DrawSplineLinear(const Vector2 *points, int pointCount, float thick, Color color);             // Draw spline: Linear, minimum 2 points
    void DrawSplineBasis(const Vector2 *points, int pointCount, float thick, Color color);              // Draw spline: B-Spline, minimum 4 points
    void DrawSplineCatmullRom(const Vector2 *points, int pointCount, float thick, Color color);         // Draw spline: Catmull-Rom, minimum 4 points
    void DrawSplineBezierQuadratic(const Vector2 *points, int pointCount, float thick, Color color);    // Draw spline: Quadratic Bezier, minimum 3 points (1 control point): [p1, c2, p3, c4...]
    void DrawSplineBezierCubic(const Vector2 *points, int pointCount, float thick, Color color);        // Draw spline: Cubic Bezier, minimum 4 points (2 control points): [p1, c2, c3, p4, c5, c6...]
    void DrawSplineSegmentLinear(Vector2 p1, Vector2 p2, float thick, Color color);                     // Draw spline segment: Linear, 2 points
    void DrawSplineSegmentBasis(Vector2 p1, Vector2 p2, Vector2 p3, Vector2 p4, float thick, Color color); // Draw spline segment: B-Spline, 4 points
    void DrawSplineSegmentCatmullRom(Vector2 p1, Vector2 p2, Vector2 p3, Vector2 p4, float thick, Color color); // Draw spline segment: Catmull-Rom, 4 points
    void DrawSplineSegmentBezierQuadratic(Vector2 p1, Vector2 c2, Vector2 p3, float thick, Color color); // Draw spline segment: Quadratic Bezier, 2 points, 1 control point
    void DrawSplineSegmentBezierCubic(Vector2 p1, Vector2 c2, Vector2 c3, Vector2 p4, float thick, Color color); // Draw spline segment: Cubic Bezier, 2 points, 2 control points

    // Spline segment point evaluation functions, for a given t [0.0f .. 1.0f]
    Vector2 GetSplinePointLinear(Vector2 startPos, Vector2 endPos, float t);                            // Get (evaluate) spline point: Linear
    Vector2 GetSplinePointBasis(Vector2 p1, Vector2 p2, Vector2 p3, Vector2 p4, float t);               // Get (evaluate) spline point: B-Spline
    Vector2 GetSplinePointCatmullRom(Vector2 p1, Vector2 p2, Vector2 p3, Vector2 p4, float t);          // Get (evaluate) spline point: Catmull-Rom
    Vector2 GetSplinePointBezierQuad(Vector2 p1, Vector2 c2, Vector2 p3, float t);                      // Get (evaluate) spline point: Quadratic Bezier
    Vector2 GetSplinePointBezierCubic(Vector2 p1, Vector2 c2, Vector2 c3, Vector2 p4, float t);         // Get (evaluate) spline point: Cubic Bezier

    //基本形状碰撞检测功能
    bool CheckCollisionRecs(Rectangle rec1, Rectangle rec2);                                            //检查两个Rectangle之间的碰撞
    bool CheckCollisionCircles(Vector2 center1, float radius1, Vector2 center2, float radius2);         //检查两个圆之间的碰撞
    bool CheckCollisionCircleRec(Vector2 center, float radius, Rectangle rec);                          //检查圆和Rectangle之间的碰撞
    bool CheckCollisionCircleLine(Vector2 center, float radius, Vector2 p1, Vector2 p2);                // Check if circle collides with a line created betweeen two points [p1] and [p2]
    bool CheckCollisionPointRec(Vector2 point, Rectangle rec);                                          //检查点是否在Rectangle内
    bool CheckCollisionPointCircle(Vector2 point, Vector2 center, float radius);                        //检查点是否在圆内
    bool CheckCollisionPointTriangle(Vector2 point, Vector2 p1, Vector2 p2, Vector2 p3);                //检查点是否在三角形内
    bool CheckCollisionPointLine(Vector2 point, Vector2 p1, Vector2 p2, int threshold);                 //检查点是否属于两点[p1]和[p2]之间创建的线, 并以像素为单位定义了边距[threshold]
    bool CheckCollisionPointPoly(Vector2 point, const Vector2 *points, int pointCount);                 // Check if point is within a polygon described by array of vertices
    bool CheckCollisionLines(Vector2 startPos1, Vector2 endPos1, Vector2 startPos2, Vector2 endPos2, Vector2* collisionPoint); //检查两条线 segments之间（两点定义）是否碰撞, 通过Vector2 *collisionPoint指针指向相关Vector2类变量以获取碰撞点
    Rectangle GetCollisionRec(Rectangle rec1, Rectangle rec2);                                          //获取两个Rectangle碰撞的碰撞Rectangle
    
    
