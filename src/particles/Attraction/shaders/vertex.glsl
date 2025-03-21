precision highp float;

uniform float u_time;
uniform vec2 u_mouse; 
uniform vec2 u_resolution;

out vec3 v_projectedPosition; 

void main() {
  vec3 pos = position; 

  // Normalizar la posición del mouse.
  vec2 mouseWorld = u_mouse * vec2(u_resolution.x / u_resolution.y, 1.0);

   // Calcular la distancia al mouse.
  float dist = distance(vec2(pos.x, pos.y), mouseWorld);

  // Calcular la atracción basada en la distancia.
  float attraction = 3.5 / (dist + 0.1); 

  // Aplicar atracción en los ejes
  pos.x += (mouseWorld.x - pos.x) * attraction * 0.7;
  pos.y += (mouseWorld.y - pos.y) * attraction * 0.7; 

  // Pasar la posición proyectada al fragment shader.
  v_projectedPosition = pos; 

  // Calcular la posición final.
  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(pos, 1.0); 
  gl_PointSize = 3.0; // Tamaño de las partículas.
}