export interface Socia {
  nombre: string;
  cargo: string;
  foto: { nombre: string; ancho: number; alto: number };
  bio: string;
  /** Resto de la trayectoria, tomada íntegra de la web anterior; se despliega con «Ver más». */
  masBio: string;
  trayectoria: string;
  linkedin: string;
}

/** Las dos socias. El JSON-LD (founder) sale de aquí. Las fotos son las que ya publicaba la
 *  empresa; se sustituirán por fotografía propia. */
export const socias: Socia[] = [
  {
    nombre: 'Margarita Díaz Cano',
    cargo: 'Directora Estrategia y Desarrollo',
    foto: { nombre: 'margarita', ancho: 708, alto: 688 },
    bio: 'Natural de Villarrobledo (Albacete), licenciada en Gestión Comercial y Marketing. Ha desarrollado toda su carrera en tecnología y telecomunicaciones, siendo pionera en servicios para operadores locales.',
    masBio:
      'Se formó en la Escuela Superior ESISC Business & Marketing School. Fue de las primeras en llevar este tipo de servicios al operador local, y ha acompañado el crecimiento de ese mercado desde dentro de cada una de las empresas de referencia del sector en las que ha trabajado.',
    trayectoria:
      'Airtel-Vodafone · Grupo Avaya · Xtra Telecom-Grupo MasMóvil · Aire Networks · Avatel',
    linkedin: 'https://www.linkedin.com/in/margarita-d%C3%ADaz-cano-a52593208/',
  },
  {
    nombre: 'Marta Segarra Grau',
    cargo: 'Directora Operaciones y Ventas',
    foto: { nombre: 'marta', ancho: 714, alto: 685 },
    bio: 'Natural de Benicarló (Castellón), licenciada en Filología Inglesa. Comenzó en World Telecom y se incorporó al proyecto de servicios para operadores locales junto a Margarita.',
    masBio:
      'Se formó en la Universidad de Valencia. Empezó en World Telecom, una empresa inglesa pionera en soluciones de telefonía, y al volver a España se sumó al proyecto de operador local que lideraba Margarita. Desde entonces ha desarrollado, gestionado y comercializado buena parte del catálogo de productos que hoy forma este negocio.',
    trayectoria: 'World Telecom · Xtra Telecom-Grupo MasMóvil · Aire Networks · Avatel',
    linkedin: 'https://www.linkedin.com/in/marta-segarra-grau-a978a336/',
  },
];
