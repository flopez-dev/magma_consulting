import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Opciones {
  /** Pantallas de scroll que el escenario se queda fijo (1 a 4). */
  hold: number;
  /** 'igual': la misma escena en móvil; 'reposo': el móvil ve la composición final. */
  movil?: 'igual' | 'reposo';
  /** Añade los tweens a la línea de tiempo, que va de 0 a 1 a lo largo del hold. */
  construir: (tl: gsap.core.Timeline, q: (selector: string) => Element[]) => void;
}

/**
 * Escena de scroll de la v2: una sección alta cuyo escenario (`.scene-stage`) se queda fijo con
 * `position: sticky` mientras una línea de tiempo de GSAP avanza con el scroll nativo. Nada
 * captura la rueda. Con movimiento reducido, sin JS o en el plan de reposo del móvil, la sección
 * lleva `is-rest` y enseña su composición final, que es la que pinta el CSS por defecto.
 */
export function escena(raiz: HTMLElement, { hold, movil = 'igual', construir }: Opciones) {
  const reducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const esMovil = window.matchMedia('(max-width: 767px)').matches;

  if (reducido || (esMovil && movil === 'reposo')) {
    raiz.classList.add('is-rest');
    return;
  }

  raiz.style.setProperty('--hold', String(hold));
  raiz.classList.add('is-live');

  const q = (selector: string) => Array.from(raiz.querySelectorAll(selector));
  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: { trigger: raiz, start: 'top top', end: 'bottom bottom', scrub: 0.6 },
  });
  construir(tl, q);

  // Las alturas cambian cuando cargan las imágenes y las fuentes.
  window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
}
