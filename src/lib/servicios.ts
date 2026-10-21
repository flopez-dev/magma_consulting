export interface Servicio {
  nombre: string;
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
        texto:
          'Te ayudamos a lanzar tu propio Operador Móvil Virtual (OMV): de la marca blanca al canal de distribución, listo para vender.',
      },
      {
        nombre: 'Planes de negocio',
        texto:
          'Tu hoja de ruta antes de invertir: planes estratégicos, técnicos y comerciales para operadores locales y empresas de telecomunicaciones.',
      },
    ],
  },
  {
    numero: '02',
    nombre: 'Conectar',
    servicios: [
      {
        nombre: 'Servicios de FTTH',
        texto:
          'Vende fibra sin desplegar red propia: servicio mayorista de bitstream FTTH, pensado para operadores locales y revendedores.',
      },
      {
        nombre: 'Infraestructura de redes',
        texto:
          'Diseño, monitorización y respaldo de la red: la infraestructura troncal completa para que tu operador no se quede nunca sin servicio.',
        lista: [
          'Infraestructura troncal',
          'Servicios de tránsito IP',
          'Monitorización de redes',
          'Conexiones punto a punto',
          'Líneas de respaldo',
          'Acceso dedicado directo',
          'Red privada virtual (VPN)',
        ],
      },
      {
        nombre: 'Compra/venta de redes',
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
        texto:
          'Formamos a tu equipo de ventas, gestores de cuentas y atención al cliente para que vendan con soltura desde el primer día.',
      },
      {
        nombre: 'Servicios empresa',
        texto:
          'Haz crecer tu negocio entre las empresas de tu zona con WiFi profesional, conectividad avanzada y ciberseguridad. Servicios de valor añadido para diferenciar tu oferta, captar nuevos clientes y vender más a tu cartera actual.',
      },
    ],
  },
];
