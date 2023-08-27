
    //模块：rmodels
    //基本几何3D形状绘图功能
    void DrawLine3D(Vector3 startPos, Vector3 endPos, Color color);                                 //在三维世界空间中绘制直线
    void DrawPoint3D(Vector3位置, Color color);                                                      //在三维空间中绘制一个点, 实际上是一条细线
    void DrawCircle3D(Vector3中心, float半径, Vector3旋转轴, float旋转角度, Color color);                //在三维世界空间中绘制圆
    void DrawTriangle3D(Vector3 v1, Vector3 v2, Vector3 v3, Color color);                           //绘制一个彩色填充三角形(顶点按逆时针顺序！)
    void DrawTriangleStrip3D(Vector3 *点, int点计数, Color color);                                    //绘制由点定义的三角形条带
    void DrawCube(Vector3位置, float宽度, float高度, float长度, Color color);                           //绘制立方体
    void DrawCubeV(Vector3位置, Vector3大小, Color color);                                            //绘制立方体(矢量版本)
    void DrawCubeWires(Vector3位置, float宽度, float高度, float长度, Color color);                      //绘制立方体线
    void DrawCubeWiresV(Vector3位置, Vector3大小, Color color);                                       //绘制立方体线(矢量版本)
    void DrawCubeTexture(Texture2D texture, Vector3位置, float宽度, float高度, float长度, Color color);  //绘制立方体Texture
    void DrawCubeTextureRec(Texture2D texture, Rectangle source, Vector3位置, float宽度, float高度, float长度, Color color); //使用Texture区域绘制立方体
    void DrawSphere(Vector3 centerPos, float半径, Color color);                                      //绘制球体
    void DrawSphereEx(Vector3 centerPos, float半径, int rings,int slices, Color color);              //使用扩展参数绘制球体
    void DrawSphereWires(Vector3 centerPos, float半径, int rings,int slices, Color color);           //绘制球体导线
    void DrawCylinder(Vector3位置, float半径顶部, float半径底部, float高度, int slices, Color color);    //绘制圆柱体/圆锥体
    void DrawCylinderEx(Vector3 startPos, Vector3 endPos, float startRadius, float endRadius, int sides, Color Color); //绘制底部位于startPos, 顶部位于endPos的圆柱体
    void DrawCylinderWires(Vector3位置, float半径顶部, float半径底部, float高度, int slices, Color color); //绘制圆柱体/圆锥体导线
    void DrawCylinderWiresEx(Vector3 startPos, Vector3 endPos, float startRadius, float endRadius, int sides, Color Color); //绘制圆柱体导线, 底部位于startPos, 顶部位于endPos
    void DrawPlane(Vector3 centerPos, Vector2大小, Color color);                                     //绘制平面XZ
    void DrawRay(Ray ray, Color color);                                                             //绘制光线线
    void DrawGrid(int slices, float 间距);                                                            //绘制Mesh(以(0, 0, 0)为中心)
    
    //------------------------------------------------------------------------------------
    //Model 3d加载和绘图功能(模块：Model)
    //------------------------------------------------------------------------------------
    
    //Model管理功能
    Model LoadModel(const char *fileName);                                                          //从文件加载Model(Mesh和材质)
    Model LoadModelFromMesh(Mesh mesh);                                                             //从生成的Mesh LoadModel(默认材质)
    void UnloadModel(Model model);                                                                  //从内存(RAM和/或VRAM)卸载Model(包括Mesh)
    void UnloadModelKeepMeshes(Model model);                                                        //从内存(RAM和/或VRAM)卸载Model(但不卸载Mesh)
    BoundingBox GetModelBoundingBox(Model model);                                                   //计算Model边界框限制(考虑所有Mesh)
    
    //Model绘图功能
    void DrawModel(Model Model, Vector3位置, float比例, Color color);                                 //绘制Model(如果设置了Texture)
    void DrawModelEx(Model Model, Vector3位置, Vector3旋转轴, float旋转角度, Vector3比例, Color color);  //使用扩展参数绘制Model
    void DrawModelWires(Model Model, Vector3位置, float比例, Color color);                            //绘制Model导线(如果设置了Texture)
    void DrawModelWiresEx(Model Model, Vector3位置, Vector3旋转轴, float旋转角度, Vector3比例, Color color); //使用扩展参数绘制Model导线(如果设置了Texture)
    void DrawBoundingBox(BoundingBox框, Color color);                                               //绘制边界框(导线)
    void DrawBillboard(Camera camera, Texture2D texture, Vector3位置, float大小, Color color);                //绘制广告牌Texture
    void DrawBillboardRec(Camera camera, Texture2D texture, Rectangle源, Vector3位置, Vector2大小, Color color); //绘制源定义的公告牌Texture
    void DrawBillboardPro(Camera camera, Texture2D texture, Rectangle源, Vector3位置, Vector3向上, Vector2大小, Vector2原点, float旋转, Color color); //绘制由源和旋转定义的公告牌Texture
    
    //Mesh管理功能
    void UploadMesh(Mesh *mesh, bool dynamic);                                                     //在GPU中上载Mesh顶点数据并提供VAO/VBO ID
    void UpdateMeshBuffer(Mesh mesh, int 索引/*index*/, const void *data, int dataSize, int 偏移量);            //为特定缓冲区索引更新GPU中的Mesh顶点数据
    void UnloadMesh(Mesh mesh);                                                                    //从CPU和GPU卸载Mesh数据
    void DrawMesh(Mesh mesh, Material material, Matrix transform);                                 //使用材质和变换绘制三维网格
    void DrawMeshInstanced(Mesh mesh, Material material, const Matrix *transforms, int instances); //使用材质和不同变换绘制多个Mesh实例
    bool ExportMesh(Mesh mesh, const char *fileName);                                              //将Mesh数据导出到文件, 成功时返回true
    BoundingBox GetMeshBoundingBox(Mesh mesh);                                                     //计算Mesh边界框限制
    void GenMeshTangents(Mesh *mesh);                                                              //计算Mesh切线
    
    //Mesh生成函数
    Mesh GenMeshPoly(int sides, float radius);                                                     //生成多边形网格
    Mesh GenMeshPlane(float宽度, float长度, int resX, int resZ);                                     //生成平面Mesh(带细分)
    Mesh GenMeshCube(float宽度, float高度, float长度);                                                //生成长方体网格
    Mesh GenMeshSphere(float半径, int rings,int slices);                                            //生成球体Mesh(标准球体)
    Mesh GenMeshHemiSphere(float半径, int rings,int slices);                                        //生成半球形Mesh(无底帽)
    Mesh GenMeshCylinder(float半径, float高度, int slices);                                          //生成圆柱体网格
    Mesh GenMeshCone(float半径, float高度, int slices);                                              //生成圆锥体/棱锥体网格
    Mesh GenMeshTorus(float半径, float大小, int radSeg, int边);                                       //生成圆环体网格
    Mesh GenMeshKnot(float半径, float大小, int radSeg, int边);                                       //生成三叶结网格
    Mesh GenMeshHeightmap(Image 高度贴图, Vector3大小);                                               //从图像数据生成高度图网格
    Mesh GenMeshCubicmap(Image 立方体贴图, Vector3 立方体大小);                                                  //从图像数据生成基于立方体的地图网格
    
    //材料装载/卸载功能
    Material *LoadMaterials(const char *fileName, int *materialCount);                             //从Model文件加载材质
    Material LoadMaterialDefault(void);                                                           //加载默认材质(支持：DIFFUSE, SPECULAR, NORMAL贴图)
    void UnloadMaterial(Material material);                                                       //从GPU内存(VRAM)卸载材料
    void SetMaterialTexture(Material  *material, int mapType, Texture2D texture);                 //为材质贴图类型(material_map_DIFFUSE, material.map_SPECULAR…)设置Texture
    void SetModelMeshMaterial(Model *Model, int meshId, int materialId);                          //设置Mesh的材质
    
    //Model动画加载/卸载功能
    ModelAnimation *LoadModelAnimations(const char *fileName, unsigned int *animCount);          //从文件加载Model动画
    void UpdateModelAnimation(Model Model, ModelAnimation 动画, int帧);                             //更新Model动画姿势
    void UnloadModelAnimation(ModelAnimation 动画);                                                 //卸载动画数据
    void UnloadModelAnimations(ModelAnimation *动画, unsigned int计数);                             //卸载动画阵列数据
    bool IsModelAnimationValid(Model Model, ModelAnimation 动画);                                         //检查Model动画骨架匹配
    
    //碰撞检测功能
    bool CheckCollisionSpheres(Vector3中心1, float半径1, Vector3中心2, float半径2);                  //检查两个球体之间的碰撞
    bool CheckCollisionBoxes(BoundingBox box1, BoundingBox box2);                                //检查两个边界框之间的碰撞
    bool CheckCollisionBoxSphere(BoundingBox box, Vector3中心, float半径);                           //检查长方体和球体之间的碰撞
    RayCollision GetRayCollisionSphere(Ray ray, Vector3中心, float半径);                           //获取光线和球体之间的碰撞信息
    RayCollision GetRayCollisionBox(Ray ray, BoundingBox box);                                      //获取光线和长方体之间的碰撞信息
    RayCollision GetRayCollisionMesh(Ray ray, Mesh mesh, Matrix transform);                      //获取光线和Mesh之间的碰撞信息
    RayCollision GetRayCollisionTriangle(Ray ray, Vector3 p1, Vector3 p2, Vector3 p3);           //获取光线和三角形之间的碰撞信息
    RayCollision GetRayCollisionQuad(Ray ray, Vector3 p1, Vector3 p2, Vector3 p3, Vector3 p4);   //获取光线和四边形之间的碰撞信息

