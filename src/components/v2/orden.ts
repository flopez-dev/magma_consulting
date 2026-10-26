import { secciones } from '../../lib/secciones';

/** Orden de las secciones en las propuestas (v2 y v3): la prueba (Trayectoria) va antes que
 *  la solución (Servicios), y el menú sigue el orden en que aparecen en la página. */
const orden = ['credenciales', 'servicios', 'nosotras'];

export const seccionesPropuesta = [...secciones].sort(
  (a, b) => orden.indexOf(a.id) - orden.indexOf(b.id),
);

/** Ancla de cada fase de servicios (#fase-lanzar…), a la que lleva el índice de fases. */
export const idFase = (nombre: string) => `fase-${nombre.toLowerCase()}`;
