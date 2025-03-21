import * as THREE from 'three';
import vertexShader from './vertex.glsl';
import fragmentShader from './fragment.glsl';

export class DynamicFog {
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  public renderer: THREE.WebGLRenderer;
  public particles: THREE.Points;
  private container: HTMLElement;
  private startTime: number;

  constructor(container: HTMLElement) {
    this.container = container;
    this.scene = new THREE.Scene();

    // Cargar la textura de fondo
    const textureLoader = new THREE.TextureLoader();
    const backgroundTexture = textureLoader.load('../../../public/cementerio.png');
    this.scene.background = backgroundTexture;

    // Configuramos la cámara para abarcar la escena
    this.camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    this.camera.position.z = 4;

    // Renderer con fondo negro y con transparencia activada.
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(this.renderer.domElement);

    // Creamos la geometría de partículas.
    // Usaremos 102400 partículas para obtener buena densidad.
    const geometry = new THREE.BufferGeometry();
    const numParticles = 15000;
    const directions = new Float32Array(numParticles * 3);

    // Distribuimos las partículas en un volumen pequeño centrado (por ejemplo, [-2, 2]).
    for (let i = 0; i < numParticles; i++) {
      directions[i * 3]     = (Math.random() - 0.5) * 5;
      directions[i * 3 + 1] = (Math.random() - 0.5) * 15;
      directions[i * 3 + 2] = (Math.random() - 0.5) * 5;
    }
    // Utilizamos el atributo "direction" (ya que Three.js no permite usar "position" para las partículas).
    geometry.setAttribute('direction', new THREE.BufferAttribute(directions, 3));

    // Se requiere también el atributo "position" (dummy) para la compatibilidad de Three.js.
    const dummyPositions = new Float32Array(numParticles * 3);
    geometry.setAttribute('position', new THREE.BufferAttribute(dummyPositions, 3));

    // Creamos un ShaderMaterial personalizado.
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      depthTest: false,
      // AdditiveBlending para que las transparencias se acumulen.
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0.0 },
        // Tiempo de llenado (desde cada esquina hasta el centro)
        uFillTime: { value: 15.0 },
        // Tiempo de dispersión (desde el centro hacia las esquinas)
        uDisperseTime: { value: 15.0 },
        // Tamaño en píxeles de las partículas (mínimo y máximo)
        uSizeMin: { value: 40.0 },
        uSizeMax: { value: 50.0 },
        // Drift: desplazamiento suave (ruido) para darle un movimiento orgánico
        uDrift: { value: 0.5 },
        // Desplazamiento extremo en X e Y.
        // A mayor valor, las partículas parten desde más lejos de la pantalla.
        uMaxX: { value: 10.0 },
        uMaxY: { value: 10.0 },
        // Colores: se interpola de un tono claro a uno ligeramente oscuro
        uClearColor: { value: new THREE.Color(0x9e9e9e) },
        uFillColor: { value: new THREE.Color(0x9e9e9e) },
        // Opacidades mínima y máxima para las partículas
        uMinOpacity: { value: 0.05 },
        uMaxOpacity: { value: 0.1 },
      },
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);

    this.startTime = Date.now();
    window.addEventListener('resize', this.onWindowResize);
  }

  private onWindowResize = () => {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  };

  public animate = () => {
    requestAnimationFrame(this.animate);
    const elapsed = (Date.now() - this.startTime) * 0.001;
    (this.particles.material as THREE.ShaderMaterial).uniforms.uTime.value = elapsed;
    this.renderer.render(this.scene, this.camera);
  };

  public dispose() {
    window.removeEventListener('resize', this.onWindowResize);
    this.renderer.dispose();
    this.scene.clear();
    if (this.renderer.domElement.parentElement) {
      this.renderer.domElement.parentElement.removeChild(this.renderer.domElement);
    }
  }
}