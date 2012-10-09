// Based on https://github.com/evanw/glfx.js/blob/master/src/filters/blur/zoomblur.js

#define LINEAR_EASING
#define SINUSOIDAL_EASING
#define EXPONENTIAL_EASING
#import "com/rendermix/Easing/Easing.glsllib"

varying vec2 texCoord;
#ifdef SOURCE_TEX
uniform sampler2D m_SourceTex;
#endif
#ifdef TARGET_TEX
uniform sampler2D m_TargetTex;
#endif
uniform float m_Strength;
uniform float m_Time;

/* random number between 0 and 1 */
float random(in vec3 scale, in float seed) {
    /* use the fragment position for randomness */
    return fract(sin(dot(gl_FragCoord.xyz + seed, scale)) * 43758.5453 + seed);
}

vec3 crossFade(in vec2 uv, in float dissolve) {
#ifdef SOURCE_TEX
    vec3 sourceColor = texture2D(m_SourceTex, uv).rgb;
#else
    vec3 sourceColor = vec3(0.0);
#endif
#ifdef TARGET_TEX
    vec3 targetColor = texture2D(m_TargetTex, uv).rgb;
#else
    vec3 targetColor = vec3(0.0);
#endif
    return mix(sourceColor, targetColor, dissolve);
}

void main() {
    // Linear interpolate center across center half of the image
    vec2 center = vec2(Linear_ease(0.25, 0.5, 1.0, m_Time), 0.5);
    float dissolve = Exponential_easeInOut(0.0, 1.0, 1.0, m_Time);
    // Mirrored sinusoidal loop. 0->strength then strength->0
    float strength = Sinusoidal_easeInOut(0.0, m_Strength, 0.5, m_Time);

    vec3 color = vec3(0.0);
    float total = 0.0;
    vec2 toCenter = center - texCoord;

    /* randomize the lookup values to hide the fixed number of samples */
    float offset = random(vec3(12.9898, 78.233, 151.7182), 0.0);

    for (float t = 0.0; t <= 40.0; t++) {
        float percent = (t + offset) / 40.0;
        float weight = 4.0 * (percent - percent * percent);
        color += crossFade(texCoord + toCenter * percent * strength, dissolve) * weight;
        total += weight;
    }
    gl_FragColor = vec4(color / total, 1.0);
}
