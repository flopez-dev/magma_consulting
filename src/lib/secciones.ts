/** Enlaces de ancla del menú y del pie, en el orden de la página. */
export const secciones = [
  { id: 'servicios', texto: 'Servicios' },
  { id: 'nosotras', texto: 'Nosotras' },
  { id: 'valores', texto: 'Valores' },
] as const;

export const contacto = { id: 'contacto', texto: 'Contacto' } as const;

/** Páginas legales, enlazadas desde el pie. */
export const legales = [
  { ruta: '/aviso-legal/', texto: 'Aviso legal' },
  { ruta: '/privacidad/', texto: 'Privacidad' },
  { ruta: '/cookies/', texto: 'Cookies' },
] as const;
