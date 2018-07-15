
    // Shader loading/unloading functions
    char *LoadText(const char *fileName);                                                               // Load chars array from text file
    Shader LoadShader(char *vsFileName, char *fsFileName);                                              // Load a custom shader and bind default locations
    Shader LoadShaderCode(char *vsCode, char *fsCode);                                                  // Load shader from code strings and bind default locations
    void UnloadShader(Shader shader);                                                                   // Unload a custom shader from memory
    
    Shader GetShaderDefault(void);                                                                      // Get default shader
    Texture2D GetTextureDefault(void);                                                                  // Get default texture

    // Shader access functions
    int GetShaderLocation(Shader shader, const char *uniformName);                                      // Get shader uniform location
    void SetShaderValue(Shader shader, int uniformLoc, float *value, int size);                         // Set shader uniform value (float)
    void SetShaderValuei(Shader shader, int uniformLoc, int *value, int size);                          // Set shader uniform value (int)
    void SetShaderValueMatrix(Shader shader, int uniformLoc, Matrix mat);                               // Set shader uniform value (matrix 4x4)
    void SetMatrixProjection(Matrix proj);                                                              // Set a custom projection matrix (replaces internal projection matrix)
    void SetMatrixModelview(Matrix view);                                                               // Set a custom modelview matrix (replaces internal modelview matrix)
    Matrix GetMatrixModelview();                                                                        // Get internal modelview matrix

    // Shading beegin/end functions
    void BeginShaderMode(Shader shader);                                                                // Begin custom shader drawing
    void EndShaderMode(void);                                                                           // End custom shader drawing (use default shader)
    void BeginBlendMode(int mode);                                                                      // Begin blending mode (alpha, additive, multiplied)
    void EndBlendMode(void);                                                                            // End blending mode (reset to default: alpha blending)
        
    // VR control functions
    VrDeviceInfo GetVrDeviceInfo(int vrDeviceType);                                                     // Get VR device information for some standard devices
    void InitVrSimulator(VrDeviceInfo info);                                                            // Init VR simulator for selected device parameters
    void CloseVrSimulator(void);                                                                        // Close VR simulator for current device
    bool IsVrSimulatorReady(void);                                                                      // Detect if VR simulator is ready
    void UpdateVrTracking(Camera *camera);                                                              // Update VR tracking (position and orientation) and camera
    void ToggleVrMode(void);                                                                            // Enable/Disable VR experience
    void BeginVrDrawing(void);                                                                          // Begin VR simulator stereo rendering
    void EndVrDrawing(void);                                                                            // End VR simulator stereo rendering
    
