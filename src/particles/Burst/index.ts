import * as THREE from 'three';
import vertexShader from './vertex.glsl';
import fragmentShader from './fragment.glsl';

export class Burst {
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  public renderer: THREE.WebGLRenderer;
  public particles: THREE.Points;
  private container: HTMLElement;
  private startTime: number;

  constructor(container: HTMLElement) {
    this.container = container;
    
    // Escena y cámara
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    this.camera.position.z = 10;
    
    // Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(this.renderer.domElement);
    
    // Geometría de las partículas
    const geometry = new THREE.BufferGeometry();
    const numParticles = 768;

    // Atributo "direction" para cada partícula (dirección en la esfera)
    const directions = new Float32Array(numParticles * 3);
    for (let i = 0; i < numParticles; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      directions[i * 3]     = Math.sin(phi) * Math.cos(theta);
      directions[i * 3 + 1] = Math.sin(phi) * Math.sin(theta);
      directions[i * 3 + 2] = Math.cos(phi);
    }
    geometry.setAttribute('direction', new THREE.BufferAttribute(directions, 3));

    // Atributo "position": no se usa directamente en el shader pero es obligatorio
    const dummyPositions = new Float32Array(numParticles * 3);
    geometry.setAttribute('position', new THREE.BufferAttribute(dummyPositions, 3));

    // Material basado en shaders personalizados
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0.0 },
        // Duración de la fase de contracción/comprensión (por ejemplo, 1 segundo)
        uPhaseTime: { value: 1.5 },
        // Duración de la fase de explosión (por ejemplo, 1 segundo)
        uExplosionTime: { value: 3.0 },
        // Posición inicial: radio desde el que parten las partículas en estado frío (azul)
        uMaxDistance: { value: 10.0 },
        // Distancia máxima en la explosión (puede ser igual o menor que uMaxDistance para un ciclo cerrado)
        uExplosionFactor: { value: 10.0 }
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      transparent: true,
      depthTest: false,
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);

    this.startTime = Date.now();

    // Para actualizar el renderizado cuando se redimensiona la ventana
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
    
    // Actualiza el uniform del tiempo
    const material = this.particles.material as THREE.ShaderMaterial;
    material.uniforms.uTime.value = elapsed;
    
    // Renderiza la escena
    this.renderer.render(this.scene, this.camera);
  };

  public dispose() {
    window.removeEventListener('resize', this.onWindowResize);
    this.renderer.dispose();
    this.scene.clear();
    if (this.renderer.domElement.parentElement) {
      this.renderer.domElement.parentElement.removeChild(
        this.renderer.domElement
      );
    }
  }
}