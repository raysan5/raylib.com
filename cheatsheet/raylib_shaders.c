
    // Shaders System Functions (Module: core)
    void BeginShaderMode(Shader shader);                                    // Begin custom shader drawing
    void EndShaderMode(void);                                               // End custom shader drawing (use default shader)
    void BeginBlendMode(int mode);                                          // Begin blending mode (alpha, additive, multiplied)
    void EndBlendMode(void);                                                // End blending mode (reset to default: alpha blending)

    // Shader management functions
    Shader LoadShader(const char *vsFileName, const char *fsFileName);      // Load shader from files and bind default locations
    Shader LoadShaderFromMemory(const char *vsCode, const char *fsCode);    // Load shader from code strings and bind default locations
    int GetShaderLocation(Shader shader, const char *uniformName);          // Get shader uniform location
    int GetShaderLocationAttrib(Shader shader, const char *attribName);     // Get shader attribute location
    void SetShaderValue(Shader shader, int locIndex, const void *value, int uniformType);               // Set shader uniform value
    void SetShaderValueV(Shader shader, int locIndex, const void *value, int uniformType, int count);   // Set shader uniform value vector
    void SetShaderValueMatrix(Shader shader, int locIndex, Matrix mat);         // Set shader uniform value (matrix 4x4)
    void SetShaderValueTexture(Shader shader, int locIndex, Texture2D texture); // Set shader uniform value for texture (sampler2d)
    void UnloadShader(Shader shader);                                       // Unload shader from GPU memory (VRAM)
    
