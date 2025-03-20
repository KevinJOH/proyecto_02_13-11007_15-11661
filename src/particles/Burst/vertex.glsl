// Atributo con la dirección de la partícula
attribute vec3 direction;

// Uniforms para el control de la animación y tiempos de fase
uniform float uTime;
uniform float uPhaseTime;
uniform float uExplosionTime;
uniform float uMaxDistance;
uniform float uExplosionFactor;

// Variable para enviar el color al fragment shader
varying vec3 vColor;

void main() {
  // Duración total del ciclo
  float cycleDuration = uPhaseTime + uExplosionTime;
  // Tiempo dentro del ciclo actual (de 0 a cycleDuration)
  float tCycle = mod(uTime, cycleDuration);

  vec3 pos;

  if (tCycle < uPhaseTime) {
    // Fase de compresión: de estado expandido (frío, azul) a centro (caliente, rojo)
    float t = tCycle / uPhaseTime;
    pos = mix(direction * uMaxDistance, vec3(0.0), t);
    vColor = mix(vec3(0.0, 0.0, 1.0), vec3(1.0, 0.0, 0.0), t);
  } else {
    // Fase de explosión: de centro (rojo) a estado expandido (explosión, amarillo cálido)
    float t = (tCycle - uPhaseTime) / uExplosionTime;
    pos = mix(vec3(0.0), direction * uExplosionFactor, t);
    // Interpolación de rojo a amarillo
    vColor = mix(vec3(1.0, 0.0, 0.0), vec3(1.0, 0.8, 0.0), t);
  }
  
  gl_PointSize = 4.0;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}