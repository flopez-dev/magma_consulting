/** Fuente única de los datos de contacto y de la empresa: la sección de contacto, el pie,
 *  las páginas legales y el JSON-LD los leen de aquí. */
export const correo = 'info@magma-consulting.com';
export const mailtoHref = `mailto:${correo}`;
// La sección de contacto abre el correo con el asunto ya puesto: quien escribe no empieza
// de cero y el mensaje llega identificado. Las páginas legales usan `mailtoHref` a secas.
export const mailtoConsultaHref = `${mailtoHref}?subject=${encodeURIComponent('Consulta desde la web')}`;

export const linkedinHref = 'https://www.linkedin.com/company/magmaconsultingsl/';

/** Domicilio social, por partes: el aviso legal y la privacidad lo pintan en una línea y el
 *  JSON-LD lo declara como PostalAddress. */
export const direccion = {
  calle: 'Avda. de Bruselas nº 61, 8º C',
  codigoPostal: '28028',
  localidad: 'Madrid',
  region: 'Comunidad de Madrid',
  pais: 'ES',
};

/** Titular del sitio, tal como figura en el aviso legal y en la política de privacidad. */
export const titular = {
  razonSocial: 'MDC STRATEGIC CONSULTING, S.L.',
  nif: 'B-56406150',
  domicilio: `${direccion.calle}, ${direccion.codigoPostal} ${direccion.localidad}`,
  registro:
    'inscrita en el Registro Mercantil de Madrid, Tomo 45.766, Folio 100, Hoja M-804455, Inscripción 1ª',
};
