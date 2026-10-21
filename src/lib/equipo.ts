export interface Socia {
  nombre: string;
  foto: { nombre: string; ancho: number; alto: number };
  bio: string;
  /** Resto de la trayectoria (de la web anterior), sin repetir la bio corta; se despliega con
   *  «Ver más». */
  masBio: string;
  trayectoria: string;
  linkedin: string;
}

/** Las dos socias. El JSON-LD (founder) sale de aquí. Las fotos son las que ya publicaba la
 *  empresa; se sustituirán por fotografía propia. */
export const socias: Socia[] = [
  {
    nombre: 'Margarita Díaz Cano',
    foto: { nombre: 'margarita', ancho: 708, alto: 688 },
    bio: 'Natural de Villarrobledo (Albacete), licenciada en Gestión Comercial y Marketing. Ha desarrollado toda su carrera en tecnología y telecomunicaciones y fue pionera en servicios para operadores locales.',
    masBio:
      'Se formó en la Escuela Superior ESISC Business & Marketing School. Ha acompañado el crecimiento del mercado del operador local desde dentro de cada una de las empresas de referencia del sector en las que ha trabajado.',
    trayectoria:
      'Airtel-Vodafone · Grupo Avaya · Xtra Telecom-Grupo MasMóvil · Aire Networks · Avatel',
    linkedin: 'https://www.linkedin.com/in/margarita-d%C3%ADaz-cano-a52593208/',
  },
  {
    nombre: 'Marta Segarra Grau',
    foto: { nombre: 'marta', ancho: 714, alto: 685 },
    bio: 'Natural de Benicarló (Castellón), licenciada en Filología Inglesa. Comenzó en World Telecom y se incorporó al proyecto de servicios para operadores locales junto a Margarita.',
    masBio:
      'Se formó en la Universidad de Valencia. World Telecom, donde empezó, era una empresa inglesa pionera en soluciones de telefonía. Desde que se unió a Margarita ha desarrollado, gestionado y comercializado buena parte del catálogo de productos que hoy forma este negocio.',
    trayectoria: 'World Telecom · Xtra Telecom-Grupo MasMóvil · Aire Networks · Avatel',
    linkedin: 'https://www.linkedin.com/in/marta-segarra-grau-a978a336/',
  },
];
