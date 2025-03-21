precision highp float;

uniform vec2 u_mouse;
uniform vec2 u_resolution;

// Posición proyectada desde el vertex shader
in vec3 v_projectedPosition; 

void main() {
  // Se calcula la distancia desde la projectPosition hasta el cursor
  vec2 mouseWorld = u_mouse * vec2(u_resolution.x / u_resolution.y, 1.0);
  float dist = distance(vec2(v_projectedPosition.xy), mouseWorld);

  // Cambiar el color de la particula dependiendo de la distancia al cursor.
  vec3 color;
  if (dist < 1.0) {
    color = vec3(0.89, 0.89, 0.89);
  } else {
    color = vec3(0.459, 0.498, 1.0);
  }

  gl_FragColor = vec4(color, 1.0);
}