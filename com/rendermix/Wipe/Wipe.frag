varying vec2 texCoord;
#ifdef SOURCE_TEX
uniform sampler2D m_sourceTex;
#endif
#ifdef TARGET_TEX
uniform sampler2D m_targetTex;
#endif
uniform sampler2D m_lumaTex;
uniform float m_time; // Ranges from 0.0 to 1.0

//XXX need to add "softness" uniform to blur luma edge

void main() {
    float luma = texture2D(m_lumaTex, texCoord).x;
    vec4 sourceColor = texture2D(m_sourceTex, texCoord);
    vec4 targetColor = texture2D(m_targetTex, texCoord);
    gl_FragColor = m_time >= luma ? targetColor : sourceColor;
}
