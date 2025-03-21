import * as THREE from 'three';
import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

/**
 * Clase Attraction: Crea una escena de partículas interactivas con Three.js.
 */
export class Attraction {
  private scene: THREE.Scene; // La escena de Three.js.
  private camera: THREE.PerspectiveCamera; // La cámara de perspectiva.
  private renderer: THREE.WebGLRenderer; // El renderizador WebGL.
  private points: THREE.Points; // Las partículas representadas como puntos.
  private material: THREE.ShaderMaterial; // El material del shader personalizado.
  private startTime: number; // Tiempo de inicio para animaciones.
  private controls: OrbitControls; // Controles de órbita para la cámara.

  private camConfig = {
    fov: 75, // Campo de visión de la cámara.
    aspect: window.innerWidth / window.innerHeight, // Relación de aspecto de la cámara.
    near: 0.1, // Plano cercano de la cámara.
    far: 1000, // Plano lejano de la cámara.
  };

  /**
   * Constructor de la clase Attraction.
   */
  constructor() {
    // Inicializar la escena.
    this.scene = new THREE.Scene();

    // Configurar la cámara.
    this.camera = new THREE.PerspectiveCamera(
      this.camConfig.fov,
      this.camConfig.aspect,
      this.camConfig.near,
      this.camConfig.far
    );
    this.camera.position.z = 5; // Posicionar la cámara en el eje Z.

    // Configurar el renderizador.
    this.renderer = new THREE.WebGLRenderer({
      antialias: true, // Habilitar antialiasing.
      powerPreference: 'high-performance', // Preferir alto rendimiento.
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight); // Establecer el tamaño del renderizador.
    document.body.appendChild(this.renderer.domElement); // Agregar el canvas al DOM.

    // Configurar los controles de órbita.
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true; // Habilitar amortiguamiento para movimientos suaves.
    this.controls.dampingFactor = 0.05; // Ajustar el factor de amortiguamiento.

    // Configurar la resolución para el shader.
    const resolution = new THREE.Vector2(window.innerWidth, window.innerHeight);

    // Crear la geometría de las partículas.
    const particleCount = 1000;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 2; // Posición X aleatoria.
      positions[i * 3 + 1] = (Math.random() - 0.5) * 2; // Posición Y aleatoria.
      positions[i * 3 + 2] = (Math.random() - 0.5) * 2; // Posición Z aleatoria.
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3)); // Establecer el atributo de posición.

    // Crear el material del shader personalizado.
    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        u_time: { value: 0.0 }, // Tiempo uniforme para animaciones.
        u_resolution: { value: resolution }, // Resolución uniforme para el shader.
        u_mouse: { value: new THREE.Vector2(0, 0) }, // Posición del mouse uniforme.
      },
      transparent: true, // Habilitar transparencia.
    });

    // Crear los puntos (partículas) y agregarlos a la escena.
    this.points = new THREE.Points(geometry, this.material);
    this.scene.add(this.points);

    // Inicializar el tiempo de inicio.
    this.startTime = Date.now();

    // Vincular los métodos de eventos.
    this.onWindowResize = this.onWindowResize.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.animate = this.animate.bind(this);

    // Agregar listeners de eventos.
    window.addEventListener('resize', this.onWindowResize);
    window.addEventListener('mousemove', this.onMouseMove);

    // Inicializar el tamaño de la ventana y comenzar la animación.
    this.onWindowResize();
    this.animate();
  }

  /**
   * Método de animación: Actualiza la escena en cada fotograma.
   */
  private animate(): void {
    requestAnimationFrame(this.animate); // Llamar a sí mismo en el próximo fotograma.
    const elapsedTime = (Date.now() - this.startTime) / 1000; // Calcular el tiempo transcurrido.
    this.material.uniforms.u_time.value = elapsedTime; // Actualizar el tiempo uniforme.

    this.controls.update(); // Actualizar los controles de órbita.

    this.renderer.render(this.scene, this.camera); // Renderizar la escena.
  }

  /**
   * Método para manejar el evento de cambio de tamaño de la ventana.
   */
  private onWindowResize(): void {
    this.camera.aspect = window.innerWidth / window.innerHeight; // Actualizar la relación de aspecto de la cámara.
    this.camera.updateProjectionMatrix(); // Actualizar la matriz de proyección de la cámara.
    this.renderer.setSize(window.innerWidth, window.innerHeight); // Actualizar el tamaño del renderizador.
    this.material.uniforms.u_resolution.value.set(window.innerWidth, window.innerHeight); // Actualizar la resolución uniforme.
  }

  /**
   * Método para manejar el evento de movimiento del mouse.
   */
  private onMouseMove(event: MouseEvent): void {
    const mouseX = (event.clientX / window.innerWidth) * 2 - 1; // Normalizar la posición X del mouse.
    const mouseY = -(event.clientY / window.innerHeight) * 2 + 1; // Normalizar la posición Y del mouse.
    this.material.uniforms.u_mouse.value.set(mouseX, mouseY); // Actualizar la posición del mouse uniforme.
  }
}