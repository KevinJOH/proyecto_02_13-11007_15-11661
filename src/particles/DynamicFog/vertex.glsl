// Usamos el atributo "direction" (ya que no podemos usar "position")
attribute vec3 direction;

uniform float uTime;
uniform float uFillTime;
uniform float uDisperseTime;
uniform float uSizeMin;
uniform float uSizeMax;
uniform float uDrift;
uniform float uMaxX;
uniform float uMaxY;

varying float vFogFactor;

void main() {
  // Definimos la duración total del ciclo
  float cycleDuration = uFillTime + uDisperseTime;
  float tCycle = mod(uTime, cycleDuration);
  
  float factor;
  vec2 offset;
  
  // Calculamos las direcciones laterales de cada partícula según el signo de direction.x y .y.
  float sideX = sign(direction.x);
  float sideY = sign(direction.y);
  sideX = (sideX == 0.0) ? 1.0 : sideX;
  sideY = (sideY == 0.0) ? 1.0 : sideY;
  
  // Fase de "llenado": las partículas parten de fuera (cada esquina) y se acercan al centro.
  if (tCycle < uFillTime) {
    float tFill = tCycle / uFillTime;
    factor = smoothstep(0.0, 1.0, tFill);
    offset.x = mix(sideX * uMaxX, 0.0, tFill);
    offset.y = mix(sideY * uMaxY, 0.0, tFill);
  } 
  // Fase de "dispersión": las partículas salen del centro y regresan hacia las esquinas.
  else {
    float tDisperse = (tCycle - uFillTime) / uDisperseTime;
    factor = 1.0 - smoothstep(0.0, 1.0, tDisperse);
    offset.x = mix(0.0, sideX * uMaxX, tDisperse);
    offset.y = mix(0.0, sideY * uMaxY, tDisperse);
  }
  
  // Añadimos un leve "drift" usando ruido simple, para que el movimiento sea orgánico.
  vec3 noise = vec3(
    sin(uTime * 0.3 + direction.x),
    cos(uTime * 0.3 + direction.y),
    sin(uTime * 0.3)
  ) * uDrift;
  
  // Posición final de la partícula:
  // Se parte de la posición original (direction), se le suma el offset calculado (en X e Y) y un poco de ruido.
  vec3 pos = direction + vec3(offset, 0.0) + noise;
  
  // El tamaño del punto se interpola entre uSizeMin y uSizeMax según el factor del ciclo.
  gl_PointSize = mix(uSizeMin, uSizeMax, factor);
  
  // Se pasa el factor al fragment shader para modificar color y opacidad
  vFogFactor = factor;
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}