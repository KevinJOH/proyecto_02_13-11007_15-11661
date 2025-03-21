precision highp float;

uniform float u_time;
uniform vec2 u_mouse; // Posición del cursor
uniform vec2 u_resolution;

out vec3 v_projectedPosition; // Variable para pasar al fragment shader

void main() {
  vec3 pos = position; // Usa directamente 'position', ya que es proporcionado automáticamente

  vec2 mouseWorld = u_mouse * vec2(u_resolution.x / u_resolution.y, 1.0);

  float dist = distance(vec2(pos.x, pos.y), mouseWorld);
  float attraction = 3.5 / (dist + 0.1);

  pos.x += (mouseWorld.x - pos.x) * attraction * 0.7;
  pos.y += (mouseWorld.y - pos.y) * attraction * 0.7;

  v_projectedPosition = pos; // Pasar la posición proyectada al fragment shader

  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(pos, 1.0);
  gl_PointSize = 3.0; // Tamaño de las partículas
}