precision highp float;

uniform float u_time;

void main() {
  // Calcular color en función del tiempo
  vec3 color = vec3(sin(u_time), cos(u_time + 1.0), sin(u_time + 2.0));
  gl_FragColor = vec4(color, 1.0); // Usa gl_FragColor en lugar de fragColor
}
