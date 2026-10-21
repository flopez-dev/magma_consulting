import { correo, direccion, linkedinHref, titular } from './contacto';
import { socias } from './equipo';
import { fases } from './servicios';
import { nombreSitio } from './sitio';

/** Grafo de la home: la consultora (con sus dos socias y su catálogo) y el sitio web.
 *  `sameAs` enlaza la página de empresa y los perfiles personales de LinkedIn: son la señal
 *  de entidad que le faltaba a la web anterior. Los servicios y las socias salen de los mismos
 *  datos que pinta la página, así que no pueden divergir. ProfessionalService es un tipo de
 *  LocalBusiness, por eso lleva `address`.
 *
 *  Sin `aggregateRating`, `telephone` ni `foundingDate` a propósito: no hay reseñas públicas
 *  que respalden un número y el cliente no ha dado teléfono ni fecha de fundación. */
export function grafo(url: string, imagen: string, logo: string) {
  const idConsultora = `${url}#magma`;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProfessionalService',
        '@id': idConsultora,
        name: nombreSitio,
        legalName: 'MDC Strategic Consulting, S.L.',
        vatID: `ES${titular.nif.replace('-', '')}`,
        description:
          'Consultoría de telecomunicaciones especializada en operadores móviles virtuales, infraestructura de redes y servicios de FTTH para operadores locales y empresas.',
        url,
        image: imagen,
        logo,
        email: correo,
        address: {
          '@type': 'PostalAddress',
          streetAddress: direccion.calle,
          postalCode: direccion.codigoPostal,
          addressLocality: direccion.localidad,
          addressRegion: direccion.region,
          addressCountry: direccion.pais,
        },
        areaServed: { '@type': 'Country', name: 'España' },
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'ventas',
          email: correo,
          availableLanguage: 'es',
        },
        knowsAbout: [
          'Operador móvil virtual (OMV)',
          'FTTH mayorista',
          'Bitstream',
          'Operadores locales de telecomunicaciones',
          'Infraestructura de redes',
          'Tránsito IP',
        ],
        sameAs: [linkedinHref],
        founder: socias.map((s) => ({
          '@type': 'Person',
          name: s.nombre,
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
                provider: { '@id': idConsultora },
              },
            })),
        },
      },
      {
        '@type': 'WebSite',
        '@id': `${url}#web`,
        url,
        name: nombreSitio,
        inLanguage: 'es-ES',
        publisher: { '@id': idConsultora },
      },
    ],
  };
}
