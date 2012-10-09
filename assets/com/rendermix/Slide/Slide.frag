varying vec2 texCoord;
#ifdef SOURCE_TEX
uniform sampler2D m_SourceTex;
#endif
#ifdef TARGET_TEX
uniform sampler2D m_TargetTex;
#endif
uniform float m_TranslateX;
uniform float m_TranslateY;
uniform float m_Time;

vec4 sourceTex(vec2 uv) {
    #ifdef SOURCE_TEX
    return texture2D(m_SourceTex, uv);
    #else
    return vec4(0.0);
    #endif
}

vec4 targetTex(vec2 uv) {
    #ifdef TARGET_TEX
    return texture2D(m_TargetTex, uv);
    #else
    return vec4(0.0);
    #endif
}

void main() {
    float x = m_Time * m_TranslateX;
    float y = m_Time * m_TranslateY;

    if (x >= 0.0 && y >= 0.0) {
        if (texCoord.x >= x && texCoord.y >= y) {
            gl_FragColor = sourceTex(texCoord - vec2(x, y));
        }
        else {
            vec2 uv;
            if (x > 0.0)
                uv = vec2(x - 1.0, y);
            else if (y > 0.0)
                uv = vec2(x, y - 1.0);
            gl_FragColor = targetTex(texCoord - uv);
        }
    }
    else if (x <= 0.0 && y <= 0.0) {
        if (texCoord.x <= (1.0 + x) && texCoord.y <= (1.0 + y))
            gl_FragColor = sourceTex(texCoord - vec2(x, y));
        else {
            vec2 uv;
            if (x < 0.0)
                uv = vec2(x + 1.0, y);
            else if (y < 0.0)
                uv = vec2(x, y + 1.0);
            gl_FragColor = targetTex(texCoord - uv);
        }
    }
    else
        gl_FragColor = vec4(0.0);
}
