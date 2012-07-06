varying vec2 texCoord;
#ifdef SOURCE_TEX
uniform sampler2D m_SourceTex;
#endif
#ifdef TARGET_TEX
uniform sampler2D m_TargetTex;
#endif
#ifdef LUMA_TEX
uniform sampler2D m_LumaTex;
#endif
uniform float m_Time; // Ranges from 0.0 to 1.0
uniform float m_Softness;

void main() {
#ifdef LUMA_TEX
    float luma = texture2D(m_LumaTex, texCoord).x;
#else
    float luma = 1.0;
#endif

#ifdef SOURCE_TEX
    vec4 sourceColor = texture2D(m_SourceTex, texCoord);
#else
    vec4 sourceColor = vec4(0.0);
#endif
#ifdef TARGET_TEX
    vec4 targetColor = texture2D(m_TargetTex, texCoord);
#else
    vec4 targetColor = vec4(0.0);
#endif
    float time = mix(0.0, 1.0 + m_Softness, m_Time);

    if (luma <= time - m_Softness)
        gl_FragColor = targetColor;
    else if (luma >= time)
        gl_FragColor = sourceColor;
    else {
        float alpha = (time - luma) / m_Softness;
        gl_FragColor = mix(sourceColor, targetColor, alpha);
    }
}
