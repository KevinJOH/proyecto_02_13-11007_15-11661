precision mediump float;

varying float vFogFactor;

uniform vec3 uClearColor;
uniform vec3 uFillColor;
uniform float uMinOpacity;
uniform float uMaxOpacity;

void main() {
  // Se crea una forma circular en cada partícula utilizando gl_PointCoord.
  float dist = distance(gl_PointCoord, vec2(0.5));
  if (dist > 0.5) discard;
  
  // Se interpola el color entre uClearColor y uFillColor según el factor.
  vec3 color = mix(uClearColor, uFillColor, vFogFactor);
  // La opacidad se interpola de uMinOpacity a uMaxOpacity.
  float alpha = mix(uMinOpacity, uMaxOpacity, vFogFactor);
  
  gl_FragColor = vec4(color, alpha);
}