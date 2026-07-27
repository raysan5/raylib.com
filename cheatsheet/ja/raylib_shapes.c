    // 注意: 基本図形と単一のフォントだけを使用する場合に有用
    // フォントの文字として白い矩形を定義すると、すべてを1回のドローコールで描画できます
    void SetShapesTexture(Texture2D texture, Rectangle source); // 図形の描画に使用するテクスチャと矩形を設定する
    Texture2D GetShapesTexture(void);                 // 図形の描画に使用するテクスチャを取得する
    Rectangle GetShapesTextureRectangle(void);        // 図形の描画に使用するテクスチャのソース矩形を取得する

    // 基本図形の描画関数
    void DrawPixel(int posX, int posY, Color color);                                                   // ジオメトリを使用してピクセルを描画する(処理が低速になる場合があるため注意して使用してください)
    void DrawPixelV(Vector2 position, Color color);                                                    // ジオメトリを使用してピクセルを描画する（Vector版）(処理が低速になる場合があるため注意して使用してください)
    void DrawLine(int startPosX, int startPosY, int endPosX, int endPosY, Color color);                // 線を描画する
    void DrawLineV(Vector2 startPos, Vector2 endPos, Color color);                                     // 線を描画する（GLのラインを使用）
    void DrawLineEx(Vector2 startPos, Vector2 endPos, float thick, Color color);                       // 線を描画する（三角形／四角形を使用）
    void DrawLineStrip(const Vector2 *points, int pointCount, Color color);                            // 連続した線を描画する（GLのラインを使用）
    void DrawLineBezier(Vector2 startPos, Vector2 endPos, float thick, Color color);                   // 3次ベジェのイーズイン・アウト補間による線分を描画する
    void DrawLineDashed(Vector2 startPos, Vector2 endPos, int dashSize, int spaceSize, Color color);   // 破線を描画する
    void DrawCircle(int centerX, int centerY, float radius, Color color);                              // 単色で塗りつぶした円を描画する
    void DrawCircleV(Vector2 center, float radius, Color color);                                       // 単色で塗りつぶした円を描画する（Vector版）
    void DrawCircleGradient(Vector2 center, float radius, Color inner, Color outer);                   // グラデーションで塗りつぶした円を描画する
    void DrawCircleSector(Vector2 center, float radius, float startAngle, float endAngle, int segments, Color color); // 扇形を描画する
    void DrawCircleSectorLines(Vector2 center, float radius, float startAngle, float endAngle, int segments, Color color); // 扇形の輪郭を描画する
    void DrawCircleLines(int centerX, int centerY, float radius, Color color);                         // 円の輪郭を描画する
    void DrawCircleLinesV(Vector2 center, float radius, Color color);                                  // 円の輪郭を描画する（Vector版）
    void DrawEllipse(int centerX, int centerY, float radiusH, float radiusV, Color color);             // 楕円を描画する
    void DrawEllipseV(Vector2 center, float radiusH, float radiusV, Color color);                      // 楕円を描画する（Vector版）
    void DrawEllipseLines(int centerX, int centerY, float radiusH, float radiusV, Color color);        // 楕円の輪郭を描画する
    void DrawEllipseLinesV(Vector2 center, float radiusH, float radiusV, Color color);                 // 楕円の輪郭を描画する（Vector版）
    void DrawRing(Vector2 center, float innerRadius, float outerRadius, float startAngle, float endAngle, int segments, Color color); // 環を描画する
    void DrawRingLines(Vector2 center, float innerRadius, float outerRadius, float startAngle, float endAngle, int segments, Color color); // 環の輪郭を描画する
    void DrawRectangle(int posX, int posY, int width, int height, Color color);                        // 単色で塗りつぶした矩形を描画する
    void DrawRectangleV(Vector2 position, Vector2 size, Color color);                                  // 単色で塗りつぶした矩形を描画する（Vector版）
    void DrawRectangleRec(Rectangle rec, Color color);                                                 // 単色で塗りつぶした矩形を描画する
    void DrawRectanglePro(Rectangle rec, Vector2 origin, float rotation, Color color);                 // 高度なパラメーターを指定して単色で塗りつぶした矩形を描画する
    void DrawRectangleGradientV(int posX, int posY, int width, int height, Color top, Color bottom);   // 垂直グラデーションで塗りつぶした矩形を描画する
    void DrawRectangleGradientH(int posX, int posY, int width, int height, Color left, Color right);   // 水平グラデーションで塗りつぶした矩形を描画する
    void DrawRectangleGradientEx(Rectangle rec, Color topLeft, Color bottomLeft, Color bottomRight, Color topRight); // 頂点ごとの色を指定してグラデーションで塗りつぶした矩形を描画する
    void DrawRectangleLines(int posX, int posY, int width, int height, Color color);                   // 矩形の輪郭を描画する
    void DrawRectangleLinesEx(Rectangle rec, float lineThick, Color color);                            // 拡張パラメーターを指定して矩形の輪郭を描画する
    void DrawRectangleRounded(Rectangle rec, float roundness, int segments, Color color);              // 角の丸い矩形を描画する
    void DrawRectangleRoundedLines(Rectangle rec, float roundness, int segments, Color color);         // 角の丸い矩形の線を描画する
    void DrawRectangleRoundedLinesEx(Rectangle rec, float roundness, int segments, float lineThick, Color color); // 角の丸い矩形の輪郭を描画する
    void DrawTriangle(Vector2 v1, Vector2 v2, Vector2 v3, Color color);                                // 単色で塗りつぶした三角形を描画する（頂点は反時計回りの順序）
    void DrawTriangleLines(Vector2 v1, Vector2 v2, Vector2 v3, Color color);                           // 三角形の輪郭を描画する（頂点は反時計回りの順序）
    void DrawTriangleFan(const Vector2 *points, int pointCount, Color color);                          // 点で定義された三角形ファンを描画する（最初の頂点が中心）
    void DrawTriangleStrip(const Vector2 *points, int pointCount, Color color);                        // 点で定義された三角形ストリップを描画する
    void DrawPoly(Vector2 center, int sides, float radius, float rotation, Color color);               // 正多角形を描画する（Vector版）
    void DrawPolyLines(Vector2 center, int sides, float radius, float rotation, Color color);          // n角形の輪郭を描画する
    void DrawPolyLinesEx(Vector2 center, int sides, float radius, float rotation, float lineThick, Color color); // 拡張パラメーターを指定してn角形の輪郭を描画する

    // スプラインの描画関数
    void DrawSplineLinear(const Vector2 *points, int pointCount, float thick, Color color);            // 線形スプラインを描画する（最低2点）
    void DrawSplineBasis(const Vector2 *points, int pointCount, float thick, Color color);             // Bスプラインを描画する（最低4点）
    void DrawSplineCatmullRom(const Vector2 *points, int pointCount, float thick, Color color);        // Catmull-Romスプラインを描画する（最低4点）
    void DrawSplineBezierQuadratic(const Vector2 *points, int pointCount, float thick, Color color);   // 2次ベジェスプラインを描画する（最低3点、制御点1個）: [p1, c2, p3, c4...]
    void DrawSplineBezierCubic(const Vector2 *points, int pointCount, float thick, Color color);       // 3次ベジェスプラインを描画する（最低4点、制御点2個）: [p1, c2, c3, p4, c5, c6...]
    void DrawSplineSegmentLinear(Vector2 p1, Vector2 p2, float thick, Color color);                    // 線形スプライン線分を描画する（2点）
    void DrawSplineSegmentBasis(Vector2 p1, Vector2 p2, Vector2 p3, Vector2 p4, float thick, Color color); // Bスプライン線分を描画する（4点）
    void DrawSplineSegmentCatmullRom(Vector2 p1, Vector2 p2, Vector2 p3, Vector2 p4, float thick, Color color); // Catmull-Romスプライン線分を描画する（4点）
    void DrawSplineSegmentBezierQuadratic(Vector2 p1, Vector2 c2, Vector2 p3, float thick, Color color); // 2次ベジェスプライン線分を描画する（2点、制御点1個）
    void DrawSplineSegmentBezierCubic(Vector2 p1, Vector2 c2, Vector2 c3, Vector2 p4, float thick, Color color); // 3次ベジェスプライン線分を描画する（2点、制御点2個）

    // 指定したt [0.0f .. 1.0f]におけるスプライン線分上の点を評価する関数
    Vector2 GetSplinePointLinear(Vector2 startPos, Vector2 endPos, float t);                           // 線形スプライン上の点を取得（評価）する
    Vector2 GetSplinePointBasis(Vector2 p1, Vector2 p2, Vector2 p3, Vector2 p4, float t);              // Bスプライン上の点を取得（評価）する
    Vector2 GetSplinePointCatmullRom(Vector2 p1, Vector2 p2, Vector2 p3, Vector2 p4, float t);         // Catmull-Romスプライン上の点を取得（評価）する
    Vector2 GetSplinePointBezierQuad(Vector2 p1, Vector2 c2, Vector2 p3, float t);                     // 2次ベジェスプライン上の点を取得（評価）する
    Vector2 GetSplinePointBezierCubic(Vector2 p1, Vector2 c2, Vector2 c3, Vector2 p4, float t);        // 3次ベジェスプライン上の点を取得（評価）する

    // 基本図形の当たり判定関数
    bool CheckCollisionRecs(Rectangle rec1, Rectangle rec2);                                           // 2つの矩形間の衝突を確認する
    bool CheckCollisionCircles(Vector2 center1, float radius1, Vector2 center2, float radius2);        // 2つの円間の衝突を確認する
    bool CheckCollisionCircleRec(Vector2 center, float radius, Rectangle rec);                         // 円と矩形の衝突を確認する
    bool CheckCollisionCircleLine(Vector2 center, float radius, Vector2 p1, Vector2 p2);               // 円と2点[p1]、[p2]で作られた線分との衝突を確認する
    bool CheckCollisionPointRec(Vector2 point, Rectangle rec);                                         // 点が矩形の内側にあるか確認する
    bool CheckCollisionPointCircle(Vector2 point, Vector2 center, float radius);                       // 点が円の内側にあるか確認する
    bool CheckCollisionPointTriangle(Vector2 point, Vector2 p1, Vector2 p2, Vector2 p3);               // 点が三角形の内側にあるか確認する
    bool CheckCollisionPointLine(Vector2 point, Vector2 p1, Vector2 p2, int threshold);                // 点が2点[p1]、[p2]で作られた線分上にあるか、ピクセル単位の許容幅[threshold]を指定して確認する
    bool CheckCollisionPointPoly(Vector2 point, const Vector2 *points, int pointCount);                // 点が頂点配列で定義された多角形の内側にあるか確認する
    bool CheckCollisionLines(Vector2 startPos1, Vector2 endPos1, Vector2 startPos2, Vector2 endPos2, Vector2 *collisionPoint); // それぞれ2点で定義された2本の線分の衝突を確認し、衝突点を参照で返し、確認する
    Rectangle GetCollisionRec(Rectangle rec1, Rectangle rec2);                                         // 2つの矩形が衝突している領域の矩形を取得する
