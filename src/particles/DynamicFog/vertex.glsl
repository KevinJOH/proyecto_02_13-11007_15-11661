attribute vec3 direction;

// Uniforms para el control del ciclo, tamaño, deriva y desplazamiento horizontal.
uniform float uTime;
uniform float uFillTime;
uniform float uDisperseTime;
uniform float uSizeMin;
uniform float uSizeMax;
uniform float uDrift;
uniform float uMaxX; // Distancia horizontal de inicio/final.

varying float vFogFactor;

void main() {
  float cycleDuration = uFillTime + uDisperseTime;
  float tCycle = mod(uTime, cycleDuration);
  
  float factor;
  float hOffset;
  float side = sign(direction.x);
  side = (side == 0.0) ? 1.0 : side;
  
  if (tCycle < uFillTime) {
    float tFill = tCycle / uFillTime;
    factor = smoothstep(0.0, 1.0, tFill);
    hOffset = mix(side * uMaxX, 0.0, tFill);
  } else {
    float tDisperse = (tCycle - uFillTime) / uDisperseTime;
    factor = 1.0 - smoothstep(0.0, 1.0, tDisperse);
    hOffset = mix(0.0, side * uMaxX, tDisperse);
  }
  
  vec3 driftPos = direction + vec3(sin(uTime + direction.x), cos(uTime + direction.y), sin(uTime)) * uDrift;
  driftPos.x += hOffset;

  gl_PointSize = mix(uSizeMin, uSizeMax, factor);
  
  vFogFactor = factor;
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4(driftPos, 1.0);
}
