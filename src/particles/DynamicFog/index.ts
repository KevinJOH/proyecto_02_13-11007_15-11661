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

    this.camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    this.camera.position.z = 10;

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(this.renderer.domElement);

    // Crear geometría de partículas
    const geometry = new THREE.BufferGeometry();
    const numParticles = 102400;
    const positions = new Float32Array(numParticles * 3);
    const directions = new Float32Array(numParticles * 3);

    for (let i = 0; i < numParticles; i++) {
      directions[i * 3] = (Math.random() - 0.5) * 10;
      directions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      directions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }

    // Atributo "direction" para cada partícula (dirección en el espacio)
    geometry.setAttribute('direction', new THREE.BufferAttribute(directions, 3));

    // Atributo "position": no se usa directamente en el shader pero es obligatorio
    const dummyPositions = new Float32Array(numParticles * 3);
    geometry.setAttribute('position', new THREE.BufferAttribute(dummyPositions, 3));

    // Material con ShaderMaterial personalizado
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      depthTest: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        // uTime: tiempo transcurrido
        uTime: { value: 0.0 },
        // uFillTime: tiempo que tarda en aparecer una partícula
        uFillTime: { value: 5.0 },
        // uDisperseTime: tiempo que tarda en desaparecer una partícula
        uDisperseTime: { value: 5.0 },
        // uSizeMin: tamaño mínimo de las partículas
        uSizeMin: { value: 1.0 },
        // uSizeMax: tamaño máximo de las partículas
        uSizeMax: { value: 5.0 },
        // uDrift: desplazamiento de las partículas
        uDrift: { value: 0.0 },
        // uMinX: coordenada mínima en X
        uMaxX: { value: 0.0 },
        // uClearColor: color de fondo   
        uClearColor: { value: new THREE.Color(0xeeeeee) },
        // uFillColor: color de las partículas
        uFillColor: { value: new THREE.Color(0x111111) },
        // uMinOpacity: opacidad mínima de las partículas
        uMinOpacity: { value: 0.01 },
        // uMaxOpacity: opacidad máxima de las partículas
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

    // Actualizar el tiempo del shader
    const material = this.particles.material as THREE.ShaderMaterial;
    material.uniforms.uTime.value = elapsed;
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
