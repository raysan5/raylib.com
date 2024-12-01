
    //模块：rshapes
    //设置要用于形状绘图的Texture和Rectangle
    //注意：当使用基本形状和单个Font时, 
    //自定义字体绘制的字符颜色设置为白色时的Rectangle（defining a font char white rectangle）将允许在一次绘制调用中绘制所有内容（这可能涉及到有关rlgl及更底层的知识）
    void SetShapesTexture(Texture2D texture, Rectangle source);                         //设置要用于形状绘图的Texture和Rectangle，这可能也涉及到rlgl及更底层的知识，如果你不是很熟悉这是做什么的就请慎用，以免产生奇怪的效果
    
    //基本形状绘图功能
    void DrawPixel(int posX, int posY, Color color);                                    //绘制像素
    void DrawPixelV(Vector2位置, Color);                                                 //绘制像素(矢量版本)
    void DrawLine(int 起始点X, int 起始端点Y, int 终止端点X, int 终止端点Y, Color color);      //画一条线
    void DrawLineV(Vector2 startPos, Vector2 endPos, Color color);                      //绘制直线(矢量版本)
    void DrawLineEx(Vector2 startPos, Vector2 endPos, float thick, Color);              //绘制定义厚度的线
    void DrawLineBezier(Vector2 startPos, Vector2 endPos, float thick, Color Color);    //使用三次贝塞尔曲线绘制直线
    void DrawLineBezierQuad(Vector2 startPos, Vector2 endPos, Vector2 controlPos, float thick, Color Color); //使用带有控制点的二次贝塞尔曲线绘制直线
    void DrawLineBezierCubic(Vector2 startPos, Vector2 endPos, Vector2 startControlPos, Vector2 endControlPos, float thick, Color); //使用具有2个控制点的三次贝塞尔曲线绘制直线
    void DrawLineStrip(Vector2*点, int点计数, Color color);                               //绘制线序列
    void DrawCircle(int centerX, int centerY, float半径, Color color);                   //绘制颜色填充的圆
    void DrawCircleSector(Vector2中心, float半径, float startAngle, float endAngle, int段, Color color); //画一个圆
    void DrawCircleSectorLines(Vector2中心, float半径, float startAngle, float endAngle, int段, Color color); //绘制圆扇形轮廓
    void DrawCircleGradient(int centerX, int centerY, float radius, Color color1, Color color2); //绘制渐变填充圆
    void DrawCircleV(Vector2中心, float半径, Color color);                                //绘制颜色填充的圆(矢量版本)
    void DrawCircleLines(int centerX, int centerY, float半径, Color color);              //绘制圆轮廓
    void DrawEllipse(int centerX, int centerY, float半径H, float半径V, Color color);      //绘制椭圆
    void DrawEllipseLines(int centerX, int centerY, float半径H, float半径V, Color color); //绘制椭圆轮廓
    void DrawRing(Vector2中心, float innerRadius, float outerRadius, float startAngle, float endAngle, int 段/*segments,可能指圆缺*/, Color color); //牵引环
    void DrawRingLines(Vector2中心, float innerRadius, float outerRadius, float startAngle, float endAngle, int段/*segments,可能指圆缺*/, Color color); //绘制环形轮廓
    void DrawRectangle(int posX, int posY, int width, int height, Color Color);         //绘制填充颜色的Rectangle
    void DrawRectangle V(Vector2 位置, Vector2大小, Color color);                          //绘制彩色填充Rectangle(矢量版)
    void DrawRectangleRec(Rectangle rec, Color color);                                  //绘制填充颜色的Rectangle
    void DrawRectanglePro(Rectangle rec, Vector2 原点/*开始渐变的点*/, float旋转, Color color);            //用pro参数绘制一个填充颜色的Rectangle
    void DrawRectangleGradientV(int posX, int posY, int width, int height, Color color1, Color color2); //绘制垂直渐变填充Rectangle
    void DrawRectangleGradientH(int posX, int posY, int width, int height, Color color1, Color color2); //绘制水平渐变填充Rectangle
    void DrawRectangleGradientEx(Rectangle rec, Color col1, Color col2, Color col3, Color col4);    //使用自定义顶点颜色绘制渐变填充Rectangle
    void DrawRectangleLines(int posX, int posY, int width, int height, Color Color);    //绘制Rectangle轮廓
    void DrawRectangleLinesEx(Rectangle rec, float lineThick, Color color);             //使用扩展参数绘制Rectangle轮廓
    void DrawRectangleRounded(Rectangle rec, float 圆度/*roundness*/, int段, Color color);              //绘制圆角Rectangle
    void DrawRectangleRoundedLines(Rectangle rec, float 圆度/*roundness*/, int段, float 线条粗细, Color color); //绘制带有圆角边缘轮廓的Rectangle
    void DrawTriangle(Vector2 v1, Vector2 v2, Vector2 v3, Color color);                 //绘制一个彩色填充三角形(顶点按逆时针顺序！)
    void DrawTriangleLines(Vector2 v1, Vector2 v2, Vector2 v3, Color color);               //绘制三角形轮廓(顶点按逆时针顺序！)
    void DrawTriangleFan(Vector2*点, int 点的数量/*pointCount*/, Color color);                             //绘制由点定义的三角形扇形(第一个顶点是中心)
    void DrawTriangleStrip(Vector2*点, int 点的数量/*pointCount*/, Color color);                           //绘制由点定义的三角形条带
    void DrawPoly(Vector2中心, int边, float半径, float旋转/*填入一个角度，使画出来的多边形可以旋转*/, Color color);                  //绘制正多边形(矢量版本)
    void DrawPolyLines(Vector2中心, int边, float半径, float旋转/*填入一个角度，使画出来的多边形可以旋转*/, Color color);                 //绘制n条边的多边形轮廓
    void DrawPolyLinesEx(Vector2中心, int边, float半径, float旋转/*填入一个角度，使画出来的多边形可以旋转*/, float 线条粗细, Color color); //使用扩展参数绘制n条边的多边形轮廓
    
    //基本形状碰撞检测功能
    bool CheckCollisionRecs(Rectangle rec1, Rectangle rec2);                            //检查两个Rectangle之间的碰撞
    bool CheckCollisionCircles(Vector2中心1, float半径1, Vector2中心2, float半径2);         //检查两个圆之间的碰撞
    bool CheckCollisionCircleRec(Vector2中心, float半径, Rectangle rec);                  //检查圆和Rectangle之间的碰撞
    bool CheckCollisionPointRec(Vector2点, Rectangle rec);                               //检查点是否在Rectangle内
    bool CheckCollisionPointCircle(Vector2点, Vector2中心, float半径);                     //检查点是否在圆内
    bool CheckCollisionPointTriangle(Vector2点, Vector2 p1, Vector2 p2, Vector2 p3);     //检查点是否在三角形内
    bool CheckCollisionLines(Vector2 startPos1, Vector2 endPos1, Vector2 startPos2, Vector2 endPos2, Vector2* collisionPoint); //检查两条线段之间（两点定义）是否碰撞, 通过Vector2 *collisionPoint指针指向相关Vector2类变量以获取碰撞点
    bool CheckCollisionPointLine(Vector2点, Vector2 p1, Vector2 p2, int 阈值);             //检查点是否属于两点[p1]和[p2]之间创建的线, 并以像素为单位定义了边距[threshold]
    Rectangle GetCollisionRec(Rectangle rec1, Rectangle rec2);                           //获取两个Rectangle碰撞的碰撞Rectangle
    
    
