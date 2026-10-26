import type { NombreIcono } from './iconos';

export interface Servicio {
  nombre: string;
  icono: NombreIcono;
  texto: string;
  lista?: string[];
}

export interface Fase {
  numero: string;
  nombre: string;
  servicios: Servicio[];
}

/** Los siete servicios, agrupados en las tres fases reales del ciclo de vida de un operador.
 *  No es una lista plana numerada 01-07: los servicios no son pasos de una secuencia, así
 *  que numerarlos todos sería un adorno sin significado. Lanzar → conectar → operar sí es
 *  una progresión real, y ahí el numeral grande encaja. El JSON-LD sale de aquí. */
export const fases: Fase[] = [
  {
    numero: '01',
    nombre: 'Lanzar',
    servicios: [
      {
        nombre: 'Telefonía móvil',
        icono: 'movil',
        texto:
          'Te ayudamos a lanzar tu propio operador móvil virtual (OMV), desde la marca blanca hasta el canal de distribución, listo para vender.',
      },
      {
        nombre: 'Planes de negocio',
        icono: 'planes',
        texto:
          'Planes estratégicos, técnicos y comerciales para que sepas si tu proyecto sale a cuenta antes de invertir en él.',
      },
    ],
  },
  {
    numero: '02',
    nombre: 'Conectar',
    servicios: [
      {
        nombre: 'Servicios de FTTH',
        icono: 'fibra',
        texto:
          'Vende fibra sin desplegar red propia con nuestro servicio mayorista de bitstream FTTH, pensado para operadores locales y nacionales y para revendedores.',
      },
      {
        nombre: 'Infraestructura de redes',
        icono: 'red',
        texto:
          'Diseñamos tu red troncal, la monitorizamos y le damos respaldo para que tus clientes sigan conectados aunque algo falle.',
        lista: [
          'Infraestructura troncal',
          'Tránsito IP',
          'Monitorización de redes',
          'Conexiones punto a punto',
          'Líneas de respaldo',
          'Acceso dedicado directo',
          'Red privada virtual (VPN)',
        ],
      },
      {
        nombre: 'Compraventa de redes',
        icono: 'compraventa',
        texto:
          'Te acompañamos en todo el proceso, tanto si compras una red como si vendes la tuya.',
      },
    ],
  },
  {
    numero: '03',
    nombre: 'Operar',
    servicios: [
      {
        nombre: 'Formación en ventas',
        icono: 'formacion',
        texto:
          'Formamos a tus comerciales, a tus gestores de cuentas y a tu equipo de atención al cliente para que vendan con soltura desde el primer día.',
      },
      {
        nombre: 'Servicios para empresas',
        icono: 'empresas',
        texto:
          'Haz crecer tu negocio entre las empresas de tu zona con wifi profesional, conectividad avanzada y ciberseguridad. Servicios de valor añadido para diferenciar tu oferta, captar nuevos clientes y vender más a tu cartera actual.',
      },
    ],
  },
];

/** Ancla de cada fase en Servicios (#fase-lanzar…), a la que lleva el índice de fases. */
export const idFase = (nombre: string) => `fase-${nombre.toLowerCase()}`;
