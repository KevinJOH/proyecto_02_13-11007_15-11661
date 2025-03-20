import * as THREE from 'three';

class App {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private currentMesh: THREE.Mesh;
  private particles: THREE.Points;
  private particleGeometry: THREE.BufferGeometry;
  private particlePositions: Float32Array;
  private particleVelocity: Float32Array;
  private numParticles: number = 1000;

  private startTime: number;
  private sphereTrajectoryToggle: boolean = true;
  private geometryIndex: number = 0;
  private geometries: THREE.BufferGeometry[] = [
    new THREE.SphereGeometry(0.5, 32, 32), // Esfera
    new THREE.BoxGeometry(0.7, 0.7, 0.7),  // Cubo
    new THREE.ConeGeometry(0.5, 0.8, 4),   // Pirámide
  ];

  constructor() {
    // Crear escena
    this.scene = new THREE.Scene();

    // Configuración de la cámara
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.z = 5;

    // Configuración del renderizador
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    // Crear la primera figura (esfera por defecto)
    const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    this.currentMesh = new THREE.Mesh(this.geometries[this.geometryIndex], sphereMaterial);
    this.scene.add(this.currentMesh);

    // Crear sistema de partículas
    this.particleGeometry = new THREE.BufferGeometry();
    this.particlePositions = new Float32Array(this.numParticles * 3);
    this.particleVelocity = new Float32Array(this.numParticles * 3);

    for (let i = 0; i < this.numParticles; i++) {
      const index = i * 3;
      this.particlePositions[index] = (Math.random() - 0.5) * 5;
      this.particlePositions[index + 1] = (Math.random() - 0.5) * 5;
      this.particlePositions[index + 2] = (Math.random() - 0.5) * 5;

      this.particleVelocity[index] = (Math.random() - 0.5) * 0.02;
      this.particleVelocity[index + 1] = (Math.random() - 0.5) * 0.02;
      this.particleVelocity[index + 2] = (Math.random() - 0.5) * 0.02;
    }

    this.particleGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(this.particlePositions, 3)
    );

    const particleMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.05,
    });

    this.particles = new THREE.Points(this.particleGeometry, particleMaterial);
    this.scene.add(this.particles);

    // Inicializar
    this.startTime = Date.now();
    this.animate = this.animate.bind(this);

    // Eventos
    window.addEventListener('resize', this.onWindowResize.bind(this));
    window.addEventListener('click', this.onMouseClick.bind(this));
    window.addEventListener('keydown', this.onKeyDown.bind(this));

    this.animate();
  }

  private animate(): void {
    requestAnimationFrame(this.animate);

    const elapsedTime = (Date.now() - this.startTime) / 1000;

    // Mover la figura
    if (this.sphereTrajectoryToggle) {
      this.currentMesh.position.x = Math.sin(elapsedTime) * 2;
      this.currentMesh.position.y = Math.cos(elapsedTime) * 2;
    } else {
      this.currentMesh.position.x = Math.cos(elapsedTime) * 2;
      this.currentMesh.position.y = Math.sin(elapsedTime) * 2;
    }

    // Actualizar partículas
    for (let i = 0; i < this.numParticles; i++) {
      const index = i * 3;

      // Partículas siguen la figura con algo de dispersión
      const dx = this.currentMesh.position.x - this.particlePositions[index];
      const dy = this.currentMesh.position.y - this.particlePositions[index + 1];
      const dz = this.currentMesh.position.z - this.particlePositions[index + 2];

      this.particlePositions[index] += dx * 0.02;
      this.particlePositions[index + 1] += dy * 0.02;
      this.particlePositions[index + 2] += dz * 0.02;

      // Agregar algo de "ruido" en el movimiento
      this.particlePositions[index] += this.particleVelocity[index];
      this.particlePositions[index + 1] += this.particleVelocity[index + 1];
      this.particlePositions[index + 2] += this.particleVelocity[index + 2];
    }

    this.particleGeometry.attributes.position.needsUpdate = true;

    // Renderizar escena
    this.renderer.render(this.scene, this.camera);
  }

  private onWindowResize(): void {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  private onMouseClick(): void {
    // Cambiar la trayectoria de la figura
    this.sphereTrajectoryToggle = !this.sphereTrajectoryToggle;
  }

  private onKeyDown(event: KeyboardEvent): void {
    if (event.code === 'Space') {
      // Cambiar la geometría actual
      this.geometryIndex = (this.geometryIndex + 1) % this.geometries.length;
      const newMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
      const newGeometry = this.geometries[this.geometryIndex];

      this.scene.remove(this.currentMesh);
      this.currentMesh = new THREE.Mesh(newGeometry, newMaterial);
      this.scene.add(this.currentMesh);
    }
  }
}

const app = new App();

