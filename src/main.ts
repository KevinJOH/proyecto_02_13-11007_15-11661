import { DynamicFog } from './particles/DynamicFog';
import { Burst } from './particles/Burst/index.ts';
import { Attraction } from './particles/Attraction/index.ts';

// Utilizamos el elemento body como contenedor del render
const container: HTMLElement = document.body;

let currentScene: { animate: () => void; dispose: () => void; renderer: { domElement: HTMLElement } } | null = null;
let currentSceneIndex = 0;
const scenes = [DynamicFog, Burst, Attraction];

function initScene() {
  // Si existe una escena previa, se elimina y se liberan recursos
  if (currentScene) {
    currentScene.dispose();
  }
  // Se instancia la siguiente escena
  const SceneClass = scenes[currentSceneIndex];
  currentScene = new SceneClass(container);
  currentScene.animate();
}

// Escucha la pulsación de la tecla espacio para cambiar la escena
window.addEventListener('keydown', (event: KeyboardEvent) => {
  if (event.code === 'Space') {
    currentSceneIndex = (currentSceneIndex + 1) % scenes.length;
    initScene();
  }
});

// Inicializa la primera escena al cargar la página
initScene();