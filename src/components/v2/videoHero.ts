/**
 * Vídeo de fondo del hero de las propuestas (marcado en VideoFondo.astro). Cambios respecto a
 * la home:
 * - Solo se descarga con pantalla ancha, sin ahorro de datos y sin movimiento reducido. En
 *   móvil se queda el poster: 600 KB de vídeo en bucle detrás del texto no compensan.
 * - Lleva un botón para pararlo (WCAG 2.2.2: nada se mueve más de 5 s sin forma de pararlo).
 *
 * Como en la home, se pausa fuera de pantalla y si la preferencia de movimiento cambia en vivo.
 * `permitir` deja que la v3 decida cuándo puede reproducirse (al terminar las partículas).
 */
export function videoHero(raiz: ParentNode = document, { permitido: inicial = true } = {}) {
  const video = raiz.querySelector<HTMLVideoElement>('[data-hero-video]');
  const boton = raiz.querySelector<HTMLButtonElement>('[data-hero-pausa]');
  if (!video) return { permitir: (_valor: boolean) => {} };

  const reducido = window.matchMedia('(prefers-reduced-motion: reduce)');
  const ancho = window.matchMedia('(min-width: 720px)');
  const conexion = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  const ahorro = conexion?.saveData === true;

  let cargado = false;
  let enPantalla = true;
  let pausadoAMano = false;
  let permitido = inicial;

  const cargar = () => {
    if (cargado || ahorro || reducido.matches || !ancho.matches) return;
    cargado = true;
    const fuentes: [string, string | undefined][] = [
      ['video/webm', video.dataset.webm],
      ['video/mp4', video.dataset.mp4],
    ];
    for (const [tipo, src] of fuentes) {
      if (!src) continue;
      const fuente = document.createElement('source');
      fuente.type = tipo;
      fuente.src = src;
      video.append(fuente);
    }
    video.load();
  };

  const actualizar = () => {
    cargar();
    if (!cargado) return;
    if (reducido.matches || !enPantalla || pausadoAMano || !permitido) {
      video.pause();
    } else {
      video.play().catch(() => {});
    }
    if (boton) {
      boton.hidden = reducido.matches || !permitido;
      boton.dataset.pausado = String(pausadoAMano);
      boton.setAttribute(
        'aria-label',
        pausadoAMano ? 'Reanudar el vídeo de fondo' : 'Pausar el vídeo de fondo',
      );
    }
  };

  boton?.addEventListener('click', () => {
    pausadoAMano = !pausadoAMano;
    actualizar();
  });
  reducido.addEventListener('change', actualizar);
  ancho.addEventListener('change', actualizar);

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entrada]) => {
      enPantalla = entrada.isIntersecting;
      actualizar();
    }).observe(video);
  }

  actualizar();

  return {
    permitir(valor: boolean) {
      if (valor === permitido) return;
      permitido = valor;
      actualizar();
    },
  };
}
