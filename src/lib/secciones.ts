/** Enlaces de ancla del menú y del pie, en el orden de la página. Valores no está: la
 *  trayectoria es mejor prueba para quien llega, y cuatro enlaces caben en línea hasta 780 px. */
export const secciones = [
  { id: 'servicios', texto: 'Servicios' },
  { id: 'credenciales', texto: 'Trayectoria' },
  { id: 'nosotras', texto: 'Nosotras' },
] as const;

export const contacto = { id: 'contacto', texto: 'Contacto' } as const;

/** Páginas legales, enlazadas desde el pie. */
export const legales = [
  { ruta: '/aviso-legal/', texto: 'Aviso legal' },
  { ruta: '/privacidad/', texto: 'Privacidad' },
  { ruta: '/cookies/', texto: 'Cookies' },
] as const;
