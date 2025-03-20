precision mediump float;

varying float vFogFactor;

uniform vec3 uClearColor;
uniform vec3 uFillColor;
uniform float uMinOpacity;
uniform float uMaxOpacity;

void main() {
  float dist = distance(gl_PointCoord, vec2(0.5));
  if (dist > 0.5) discard;
  
  vec3 color = mix(uClearColor, uFillColor, vFogFactor);
  float alpha = mix(uMinOpacity, uMaxOpacity, vFogFactor);
  
  gl_FragColor = vec4(color, alpha);
}
