import { correo, linkedinHref } from './contacto';
import { socias } from './equipo';
import { fases } from './servicios';
import { nombreSitio } from './sitio';

/** La consultora y sus dos socias. `sameAs` enlaza la página de empresa y los perfiles
 *  personales de LinkedIn: son la señal de entidad que le faltaba a la web anterior. Los
 *  servicios y las socias salen de los mismos datos que pinta la página, así que no pueden
 *  divergir.
 *
 *  Sin `aggregateRating` a propósito: no hay reseñas públicas y verificables que respalden
 *  un número. */
export function consultora(url: string, imagen: string, logo: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${url}#magma`,
    name: nombreSitio,
    description:
      'Consultoría de telecomunicaciones especializada en operadores móviles virtuales, infraestructura de redes y servicios de FTTH para operadores locales y empresas.',
    url,
    image: imagen,
    logo,
    email: correo,
    areaServed: 'ES',
    sameAs: [linkedinHref],
    founder: socias.map((s) => ({
      '@type': 'Person',
      name: s.nombre,
      jobTitle: s.cargo,
      sameAs: s.linkedin,
    })),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Servicios',
      itemListElement: fases
        .flatMap((f) => f.servicios)
        .map((s) => ({
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: s.nombre,
            description: s.lista ? `${s.texto} ${s.lista.join(', ')}.` : s.texto,
          },
        })),
    },
  };
}
