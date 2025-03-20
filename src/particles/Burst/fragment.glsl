precision mediump float;

varying vec3 vColor;

void main() {
  // Crear una partícula circular utilizando gl_PointCoord
  float dist = distance(gl_PointCoord, vec2(0.5));
  if(dist > 0.5) discard;
  gl_FragColor = vec4(vColor, 1.0);
}