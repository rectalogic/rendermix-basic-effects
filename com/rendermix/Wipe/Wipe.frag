varying vec2 texCoord;
#ifdef SOURCE_TEX
uniform sampler2D m_sourceTex;
#endif
#ifdef TARGET_TEX
uniform sampler2D m_targetTex;
#endif
#ifdef LUMA_TEX
uniform sampler2D m_lumaTex;
#endif
uniform float m_time; // Ranges from 0.0 to 1.0
uniform float m_softness;

void main() {
#ifdef LUMA_TEX
    float luma = texture2D(m_lumaTex, texCoord).x;
#else
    float luma = 1.0;
#endif

    vec4 sourceColor = texture2D(m_sourceTex, texCoord);
    vec4 targetColor = texture2D(m_targetTex, texCoord);
    float time = mix(0.0, 1.0 + m_softness, m_time);

    if (luma <= time - m_softness)
        gl_FragColor = targetColor;
    else if (luma >= time)
        gl_FragColor = sourceColor;
    else {
        float alpha = (time - luma) / m_softness;
        gl_FragColor = mix(sourceColor, targetColor, alpha);
    }
}
