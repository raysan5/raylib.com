    // 基本的な幾何学的3D図形の描画関数
    void DrawLine3D(Vector3 startPos, Vector3 endPos, Color color);                                    // 3Dワールド空間に線を描画する(注意: 線の太さは指定できません)
    void DrawPoint3D(Vector3 position, Color color);                                                   // 3D空間に点を描画する（実際には短い線）
    void DrawCircle3D(Vector3 center, float radius, Vector3 rotationAxis, float rotationAngle, Color color); // 3Dワールド空間に円を描画する
    // 6.2で説明文を変更
    void DrawTriangle3D(Vector3 v1, Vector3 v2, Vector3 v3, Color color);                              // 単色で塗りつぶした三角形を描画する（頂点は反時計回りの順序）
    void DrawTriangleStrip3D(const Vector3 *points, int pointCount, Color color);                      // 点で定義された三角形ストリップを描画する
    void DrawCube(Vector3 position, float width, float height, float length, Color color);             // 立方体を描画する
    void DrawCubeV(Vector3 position, Vector3 size, Color color);                                       // 立方体を描画する（Vector版）
    void DrawCubeWires(Vector3 position, float width, float height, float length, Color color);        // 立方体のワイヤーフレームを描画する
    void DrawCubeWiresV(Vector3 position, Vector3 size, Color color);                                  // 立方体のワイヤーフレームを描画する（Vector版）
    void DrawSphere(Vector3 centerPos, float radius, Color color);                                     // 球を描画する
    // 6.2で説明文を変更
    void DrawSphereEx(Vector3 centerPos, float radius, int rings, int slices, Color color);            // リング数とスライス数を指定して球を描画する
    void DrawSphereWires(Vector3 centerPos, float radius, int rings, int slices, Color color);         // 球のワイヤーフレームを描画する
    // 6.2で変更
    // 変更前（6.0）: void DrawCylinder(Vector3 position, float radiusTop, float radiusBottom, float height, int slices, Color color);
    void DrawCylinder(Vector3 position, float radiusTop, float radiusBottom, float height, int sides, Color color); // 円柱または円錐を描画する
    void DrawCylinderEx(Vector3 startPos, Vector3 endPos, float startRadius, float endRadius, int sides, Color color); // startPosを底面、endPosを上面として円柱を描画する
    // 6.2で変更
    // 変更前（6.0）: void DrawCylinderWires(Vector3 position, float radiusTop, float radiusBottom, float height, int slices, Color color);
    void DrawCylinderWires(Vector3 position, float radiusTop, float radiusBottom, float height, int sides, Color color); // 円柱または円錐のワイヤーフレームを描画する
    void DrawCylinderWiresEx(Vector3 startPos, Vector3 endPos, float startRadius, float endRadius, int sides, Color color); // startPosを底面、endPosを上面として円柱のワイヤーフレームを描画する
    // 6.2で変更
    // 変更前（6.0）: void DrawCapsule(Vector3 startPos, Vector3 endPos, float radius, int slices, int rings, Color color);
    void DrawCapsule(Vector3 startPos, Vector3 endPos, float radius, int rings, int slices, Color color); // 球状の両端の中心をstartPosとendPosとするカプセルを描画する
    // 6.2で変更
    // 変更前（6.0）: void DrawCapsuleWires(Vector3 startPos, Vector3 endPos, float radius, int slices, int rings, Color color);
    void DrawCapsuleWires(Vector3 startPos, Vector3 endPos, float radius, int rings, int slices, Color color); // 球状の両端の中心をstartPosとendPosとするカプセルのワイヤーフレームを描画する
    void DrawPlane(Vector3 centerPos, Vector2 size, Color color);                                      // XZ平面を描画する
    void DrawRay(Ray ray, Color color);                                                                // レイを表す線を描画する
    void DrawGrid(int slices, float spacing);                                                          // 原点(0, 0, 0)を中心としたグリッドを描画する

    // モデルの管理関数
    // 3Dモデルの読み込みと描画関数（モジュール: models）
    // モデルの管理関数

    // モデルの管理関数
    Model LoadModel(const char *fileName);                                                // ファイルからモデルを読み込む（メッシュとマテリアル）
    Model LoadModelFromMesh(Mesh mesh);                                                   // 生成済みメッシュからモデルを読み込む（デフォルトマテリアル）
    // 6.2で説明文を変更
    bool IsModelValid(Model model);                                                       // モデルが有効か確認する（GPUに読み込み済み、VAO／VBO）
    void UnloadModel(Model model);                                                        // メッシュを含むモデルをメモリ（RAMおよび／またはVRAM）からアンロードする
    BoundingBox GetModelBoundingBox(Model model);                                         // すべてのメッシュを考慮してモデルのバウンディングボックス境界を計算する

    // モデルの描画関数
    void DrawModel(Model model, Vector3 position, float scale, Color tint);               // モデルを描画する（設定されている場合はテクスチャ付き）
    // 6.2で説明文を変更
    void DrawModelEx(Model model, Vector3 position, Vector3 rotationAxis, float rotationAngle, Vector3 scale, Color tint); // カスタム変換を指定してモデルを描画する
    void DrawModelWires(Model model, Vector3 position, float scale, Color tint);          // モデルのワイヤーフレームを描画する（設定されている場合はテクスチャ付き）
    // 6.2で説明文を変更
    void DrawModelWiresEx(Model model, Vector3 position, Vector3 rotationAxis, float rotationAngle, Vector3 scale, Color tint); // カスタム変換を指定してモデルのワイヤーフレームを描画する
    void DrawBoundingBox(BoundingBox box, Color color);                                   // バウンディングボックスのワイヤーフレームを描画する
    void DrawBillboard(Camera camera, Texture2D texture, Vector3 position, float scale, Color tint); // ビルボードテクスチャを描画する
    // 6.2で変更
    // 変更前（6.0）: void DrawBillboardRec(Camera camera, Texture2D texture, Rectangle source, Vector3 position, Vector2 size, Color tint);
    void DrawBillboardRec(Camera camera, Texture2D texture, Rectangle rec, Vector3 position, Vector2 size, Color tint); // 矩形で指定したビルボードテクスチャを描画する
    // 6.2で変更
    // 変更前（6.0）: void DrawBillboardPro(Camera camera, Texture2D texture, Rectangle source, Vector3 position, Vector3 up, Vector2 size, Vector2 origin, float rotation, Color tint);
    void DrawBillboardPro(Camera camera, Texture2D texture, Rectangle rec, Vector3 position, Vector3 up, Vector2 size, Vector2 origin, float rotation, Color tint); // 拡大縮小と回転を指定して、転送元矩形で指定したビルボードテクスチャを描画する

    // メッシュの管理関数
    void UploadMesh(Mesh *mesh, bool dynamic);                                            // メッシュの頂点データをGPUへアップロードし、VAO／VBOのIDを設定する
    void UpdateMeshBuffer(Mesh mesh, int index, const void *data, int dataSize, int offset); // 指定したバッファーインデックスのGPU上のメッシュ頂点データを更新する
    void UnloadMesh(Mesh mesh);                                                           // CPUとGPUからメッシュデータをアンロードする
    void DrawMesh(Mesh mesh, Material material, Matrix transform);                        // マテリアルと変換を指定して3Dメッシュを描画する
    void DrawMeshInstanced(Mesh mesh, Material material, const Matrix *transforms, int instances); // マテリアルと個別の変換を指定して複数のメッシュインスタンスを描画する
    BoundingBox GetMeshBoundingBox(Mesh mesh);                                            // メッシュのバウンディングボックス境界を計算する
    void GenMeshTangents(Mesh *mesh);                                                     // メッシュの接線を計算する
    bool ExportMesh(Mesh mesh, const char *fileName);                                     // メッシュデータをファイルへエクスポートし、成功した場合はtrueを返す
    bool ExportMeshAsCode(Mesh mesh, const char *fileName);                               // メッシュを複数の頂点属性配列として定義したコードファイル（.h）へエクスポートする

    // メッシュの生成関数
    Mesh GenMeshPoly(int sides, float radius);                                            // 多角形メッシュを生成する
    Mesh GenMeshPlane(float width, float length, int resX, int resZ);                     // 平面メッシュを生成する（細分割あり）
    Mesh GenMeshCube(float width, float height, float length);                            // 直方体メッシュを生成する
    Mesh GenMeshSphere(float radius, int rings, int slices);                              // 球メッシュを生成する（標準的な球）
    Mesh GenMeshHemiSphere(float radius, int rings, int slices);                          // 半球メッシュを生成する（底面なし）
    Mesh GenMeshCylinder(float radius, float height, int slices);                         // 円柱メッシュを生成する
    Mesh GenMeshCone(float radius, float height, int slices);                             // 円錐／角錐メッシュを生成する
    Mesh GenMeshTorus(float radius, float size, int radSeg, int sides);                   // トーラスメッシュを生成する
    Mesh GenMeshKnot(float radius, float size, int radSeg, int sides);                    // 三葉結び目メッシュを生成する
    Mesh GenMeshHeightmap(Image heightmap, Vector3 size);                                 // 画像データからハイトマップメッシュを生成する
    Mesh GenMeshCubicmap(Image cubicmap, Vector3 cubeSize);                               // 画像データから立方体ベースのマップメッシュを生成する

    // マテリアルの読み込み／アンロード関数
    Material *LoadMaterials(const char *fileName, int *materialCount);                    // モデルファイルからマテリアルを読み込む
    Material LoadMaterialDefault(void);                                                   // デフォルトマテリアルを読み込む（DIFFUSE、SPECULAR、NORMALマップに対応）
    // 6.2で説明文を変更
    bool IsMaterialValid(Material material);                                              // マテリアルが有効か確認する（シェーダーが割り当て済みで、マップテクスチャがGPUに読み込み済み）
    void UnloadMaterial(Material material);                                               // GPUメモリ（VRAM）からマテリアルをアンロードする
    void SetMaterialTexture(Material *material, int mapType, Texture2D texture);          // マテリアルのマップ種別にテクスチャを設定する（MATERIAL_MAP_DIFFUSE、MATERIAL_MAP_SPECULARなど）
    void SetModelMeshMaterial(Model *model, int meshId, int materialId);                  // メッシュにマテリアルを設定する

    // モデルアニメーションの読み込み／アンロード関数
    ModelAnimation *LoadModelAnimations(const char *fileName, int *animCount);            // ファイルからモデルアニメーションを読み込む
    void UpdateModelAnimation(Model model, ModelAnimation anim, float frame);             // モデルアニメーションのポーズを更新する（頂点バッファーとボーン行列）
    void UpdateModelAnimationEx(Model model, ModelAnimation animA, float frameA, ModelAnimation animB, float frameB, float blend); // 2つのアニメーションをブレンドしてモデルアニメーションのポーズを更新する
    void UnloadModelAnimations(ModelAnimation *animations, int animCount);                // アニメーション配列データをアンロードする
    bool IsModelAnimationValid(Model model, ModelAnimation anim);                         // モデルとアニメーションのスケルトンが一致するか確認する

    // 当たり判定関数
    bool CheckCollisionSpheres(Vector3 center1, float radius1, Vector3 center2, float radius2); // 2つの球間の衝突を確認する
    bool CheckCollisionBoxes(BoundingBox box1, BoundingBox box2);                         // 2つのバウンディングボックス間の衝突を確認する
    bool CheckCollisionBoxSphere(BoundingBox box, Vector3 center, float radius);          // ボックスと球の衝突を確認する
    RayCollision GetRayCollisionSphere(Ray ray, Vector3 center, float radius);            // レイと球の衝突情報を取得する
    RayCollision GetRayCollisionBox(Ray ray, BoundingBox box);                            // レイとボックスの衝突情報を取得する
    RayCollision GetRayCollisionMesh(Ray ray, Mesh mesh, Matrix transform);               // レイとメッシュの衝突情報を取得する
    RayCollision GetRayCollisionTriangle(Ray ray, Vector3 p1, Vector3 p2, Vector3 p3);    // レイと三角形の衝突情報を取得する
    RayCollision GetRayCollisionQuad(Ray ray, Vector3 p1, Vector3 p2, Vector3 p3, Vector3 p4); // レイと四角形の衝突情報を取得する
