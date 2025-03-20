precision highp float;

in vec3 a_position; // Cambiar el nombre para evitar conflicto
in vec3 a_offset;

uniform float u_time;

void main() {
  // Calcular posición animada
  vec3 animatedPosition = a_position + a_offset * sin(u_time + a_offset.x);
  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(animatedPosition, 1.0);
  gl_PointSize = 5.0; // Tamaño de la partícula
}



