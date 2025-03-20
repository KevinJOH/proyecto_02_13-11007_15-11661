import * as THREE from 'three';

export class DynamicFog {
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  public renderer: THREE.WebGLRenderer;
  public particles: THREE.Points;
  private container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    this.camera.position.z = 5;
    
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(this.renderer.domElement);

    // Genera partículas distribuidas de forma aleatoria para simular niebla
    const geometry = new THREE.BufferGeometry();
    const numParticles = 1000;
    const positions = new Float32Array(numParticles * 3);
    for (let i = 0; i < numParticles; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 4;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 4;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({ color: 0xffffff, size: 0.1, transparent: true, opacity: 0.5 });
    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  }

  public animate = () => {
    requestAnimationFrame(this.animate);
    // Efecto sutil de rotación para darle dinamismo a la niebla
    this.particles.rotation.y += 0.001;
    this.renderer.render(this.scene, this.camera);
  }

  public dispose() {
    // Elimina el canvas y limpia la escena
    this.renderer.dispose();
    this.scene.clear();
    if (this.renderer.domElement.parentElement) {
      this.renderer.domElement.parentElement.removeChild(this.renderer.domElement);
    }
  }
}
