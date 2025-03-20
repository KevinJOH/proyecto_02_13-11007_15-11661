import * as THREE from 'three';

export class Burst {
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  public renderer: THREE.WebGLRenderer;
  public particles: THREE.Points;
  private container: HTMLElement;
  private startTime: number;
  private directions: Float32Array;

  constructor(container: HTMLElement) {
    this.container = container;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    this.camera.position.z = 5;
    
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(this.renderer.domElement);

    // Partículas inicialmente en el centro
    const geometry = new THREE.BufferGeometry();
    const numParticles = 500;
    const positions = new Float32Array(numParticles * 3);
    this.directions = new Float32Array(numParticles * 3);
    for (let i = 0; i < numParticles; i++) {
      // Todas empiezan en el centro
      positions[i * 3] = 0;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = 0;
      // Dirección aleatoria para la explosión
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      this.directions[i * 3] = Math.sin(phi) * Math.cos(theta);
      this.directions[i * 3 + 1] = Math.sin(phi) * Math.sin(theta);
      this.directions[i * 3 + 2] = Math.cos(phi);
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({ color: 0xffaa00, size: 0.2 });
    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
    this.startTime = Date.now();
  }

  public animate = () => {
    requestAnimationFrame(this.animate);
    const elapsed = (Date.now() - this.startTime) * 0.001;
    const positions = (this.particles.geometry.attributes.position as THREE.BufferAttribute).array as Float32Array;
    // Las partículas se mueven en la dirección asignada multiplicadas por el tiempo
    for (let i = 0; i < positions.length / 3; i++) {
      positions[i * 3] = this.directions[i * 3] * elapsed * 2;
      positions[i * 3 + 1] = this.directions[i * 3 + 1] * elapsed * 2;
      positions[i * 3 + 2] = this.directions[i * 3 + 2] * elapsed * 2;
    }
    (this.particles.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
    this.renderer.render(this.scene, this.camera);
  }

  public dispose() {
    this.renderer.dispose();
    this.scene.clear();
    if (this.renderer.domElement.parentElement) {
      this.renderer.domElement.parentElement.removeChild(this.renderer.domElement);
    }
  }
}
