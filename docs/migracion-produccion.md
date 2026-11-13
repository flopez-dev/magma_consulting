# Migración a producción: lo que falta

Hoja de ruta para terminar de pasar `magma-consulting.com` de Arsys a Cloudflare. Estado a
**26 de octubre de 2026**. Bloqueo actual: **no hay acceso al Área de Cliente de Arsys**
(solo al panel del hosting), y los nameservers y la renovación del dominio solo se cambian
desde ahí. Lo tiene que hacer el cliente (titular) o darnos acceso.

> ⚠️ **El dominio caduca el 31/10/2026 a las 13:48 UTC.** Si caduca, se caen la web y el
> correo de toda la empresa, y solo Arsys puede renovarlo durante la gracia. No dejarlo caducar
> para «comprarlo luego en Cloudflare»: tras la caducidad hay ~75-80 días sin servicio y
> después queda libre para cualquiera.

## Lo que ya está hecho

- **Zona `magma-consulting.com` creada en Cloudflare** (plan Free), pendiente de activar.
  Nameservers asignados: `rose.ns.cloudflare.com` y `thomas.ns.cloudflare.com`.
- **Registros de la zona** (comprobados contra los nameservers de Cloudflare el 26/10):

  | Tipo    | Nombre       | Contenido                                            | Proxy    |
  | :------ | :----------- | :--------------------------------------------------- | :------- |
  | MX (10) | @            | `magmaconsulting-com01c.mail.protection.outlook.com` | DNS only |
  | TXT     | @            | `v=spf1 include:spf.protection.outlook.com -all`     | DNS only |
  | TXT     | @            | `MS=ms76387046`                                      | DNS only |
  | CNAME   | autodiscover | `autodiscover.outlook.com`                           | DNS only |
  | CNAME   | autoconfig   | `autoconfig.serviciodecorreo.es` (se borrará)        | DNS only |
  | CNAME   | webmail      | `serviciodecorreo.es` (se borrará)                   | DNS only |

  Borrados a propósito: `A` del apex y de `www` (los crea el Worker) y `CNAME ftp`. No se
  añadieron los restos del hosting de Arsys (`cgi`, `control`, `qain391`) ni el DKIM del correo
  de Arsys: la web vieja no se rescata y el SPF solo autoriza a Microsoft.
- **Secretos en GitHub**: `CLOUDFLARE_API_TOKEN_MAGMA_CONSULTING` y `CLOUDFLARE_ACCOUNT_ID`.
- **Worker desplegado**: la PR #7 (`develop` → `main`) se fusionó el 26/10 y
  `deploy-cloudflare.yml` subió el Worker `magma-consulting` con los dominios personalizados
  `magma-consulting.com` y `www.magma-consulting.com`. Empezará a servir solo cuando la zona
  esté activa. Producción es indexable (comprobado: sin `noindex`, canonical y sitemap en el
  dominio real).
- **El correo está en Microsoft 365**, no en Arsys: el MX apunta a Outlook. Los 4 buzones que
  aparecen en el panel del hosting de Arsys están al 0 % (restos sin uso, a confirmar).

## Datos del dominio

- Registrador: **Arsys Internet, S.L. (dba NICLINE.COM)**. Alta 31/10/2023, caducidad
  31/10/2026. Sin DNSSEC y sin bloqueo de transferencia (RDAP, 26/10/2026).
- Nameservers actuales: `dns39.servidoresdns.net` y `dns40.servidoresdns.net` (Arsys).
- Titular: MDC Strategic Consulting, S.L. Soporte de Arsys: 941 620 100.

## Pasos pendientes, en orden

No pasar de un paso al siguiente sin que su comprobación salga bien.

### 1. Arsys, Área de Cliente (titular)

- [ ] **Renovar `magma-consulting.com` un año** (o comprobar renovación automática y tarjeta).
      La transferencia posterior a Cloudflare suma su año encima: no se pierde lo pagado.
- [ ] **Cambiar los servidores DNS** del dominio a externos: `rose.ns.cloudflare.com` y
      `thomas.ns.cloudflare.com`, borrando `dns39`/`dns40.servidoresdns.net`.
- [ ] No borrar todavía la zona DNS ni el hosting de Arsys (sirven para volver atrás).

### 2. Cloudflare, activar la zona

- [ ] En la zona, pulsar **I updated my nameservers** y esperar el estado **Active**.
- [ ] Comprobar delegación y correo:

  ```sh
  dig +short NS magma-consulting.com                  # rose y thomas de Cloudflare
  dig +short MX magma-consulting.com                  # ...mail.protection.outlook.com
  dig +short TXT magma-consulting.com                 # SPF y MS=ms76387046
  dig +short CNAME autodiscover.magma-consulting.com  # autodiscover.outlook.com
  ```

- [ ] Enviar un correo desde una cuenta externa a cada uno de los 4 buzones de la empresa y
      responder desde ellos.

### 3. Cloudflare, ajustes de la zona

- [ ] **Security → Bots**: Bot Fight Mode y JavaScript Detections **desactivados** (si no,
      aparece la cookie `cf_clearance` y `/cookies/` deja de ser cierta).
- [ ] **AI Crawl Control**: sin robots.txt gestionado (la web genera el suyo).
- [ ] **Rules → Redirect Rules**: plantilla «Redirect from WWW to root», 301 de
      `https://www.magma-consulting.com/*` a `https://magma-consulting.com/${1}`, conservando
      la query string.
- [ ] **SSL/TLS → Edge Certificates**: activar **Always Use HTTPS**.

### 4. Comprobar la web en producción

El certificado puede tardar unos minutos tras la activación.

- [ ] `https://magma-consulting.com/` carga la web nueva.
- [ ] `https://www.magma-consulting.com/` redirige con 301 a la raíz.
- [ ] Redirecciones de las URLs del WordPress:

  ```sh
  curl -sI https://magma-consulting.com/servicios/ | head -3
  curl -sI https://magma-consulting.com/politica-de-privacidad-2/ | head -3
  curl -s https://magma-consulting.com/ | grep -i 'name="robots"'   # no debe salir nada
  ```

- [ ] `/robots.txt` y `/sitemap-index.xml` responden con el dominio real.
- [ ] En un navegador real (DevTools → Application → Cookies) no hay ninguna cookie.

### 5. Google

- [ ] Search Console: propiedad de dominio verificada por DNS (TXT en Cloudflare), enviar
      `https://magma-consulting.com/sitemap-index.xml` y retirar `wp-sitemap.xml`.

### 6. Microsoft 365 (comprobar quién factura)

- [ ] Con un administrador global en `admin.microsoft.com`: los 4 usuarios con licencia,
      dominio en estado correcto, y en **Configuración → Relaciones de partners** si aparece
      Arsys.
- [ ] Si factura Arsys: comprar el mismo plan directamente a Microsoft, asignar las licencias
      nuevas a los 4 usuarios, quitar las de Arsys, comprobar el correo, y solo entonces pedir a
      Arsys la baja de su suscripción y quitarles los permisos de partner. Los buzones no se
      mueven (mismo tenant).

### 7. Correo antiguo de Arsys

- [ ] Abrir el webmail de Arsys de cada uno de los 4 buzones y confirmar que están vacíos, y
      que nadie los tiene configurados por IMAP/POP en el móvil u Outlook.
- [ ] Borrar en Cloudflare `CNAME webmail` y `CNAME autoconfig`.

### 8. Transferir el dominio a Cloudflare Registrar

Con la web y el correo ya funcionando (no se corta nada durante la transferencia).

- [ ] En Arsys: confirmar desbloqueo, quitar la privacidad WHOIS si la hay y pedir el código
      EPP/AuthCode.
- [ ] En Cloudflare: **Domain Registration → Transfer Domains**, pegar el código, datos del
      titular y pago (un año a precio de coste, que se suma a la caducidad).
- [ ] Aprobar el correo de confirmación; tarda de horas a 5 días.
- [ ] Desactivar la renovación automática del dominio en Arsys.

### 9. Cancelar en Arsys

- [ ] Hosting (no hay nada que rescatar de la web vieja; confirmar antes que el correo de
      Arsys no va incluido con algo pendiente).
- [ ] Correo de Arsys, si es producto aparte.
- [ ] Microsoft 365 de Arsys, solo tras el paso 6.
- [ ] Revisar que no queda ninguna renovación ni cargo recurrente.

### 10. Cerrar en el repo

- [ ] Actualizar `CLAUDE.md` («Estado conocido»: el dominio ya está en Cloudflare) y la
      sección «Puesta en marcha» de `README.md`.
- [ ] Opcional: DKIM de Microsoft 365 (CNAME `selector1` y `selector2` desde Microsoft
      Defender) y un DMARC con `p=none` para empezar. Hoy el dominio no tiene ninguno.
- [ ] Borrar este documento.

## Si algo sale mal

- **Correo**: comparar los registros de Cloudflare con la tabla de arriba (casi siempre es un
  registro que falta o una nube naranja). Último recurso: volver a los nameservers de Arsys,
  cuya zona sigue intacta mientras no se cancele.
- **Web**: el correo no depende del Worker. Relanzar **Actions → Deploy site to Cloudflare
  Workers → Run workflow**.

Recordatorio: cada push o merge a `main` despliega a producción. Se trabaja en `develop`.

## Mensaje para el cliente

> Hola,
>
> Para publicar la web nueva necesito que hagas dos gestiones en tu **Área de Cliente de
> Arsys** (no en el panel del hosting). Son urgentes porque **el dominio magma-consulting.com
> caduca el 31 de octubre**: si caduca, dejarían de funcionar la web y el correo.
>
> 1. **Renovar el dominio magma-consulting.com un año** (Dominios → magma-consulting.com →
>    Renovar). Si ya tiene la renovación automática, basta con comprobar que la tarjeta es
>    válida.
> 2. **Cambiar sus servidores DNS**, en esa misma ficha (Servidores DNS → Modificar →
>    servidores externos). Hay que poner estos dos y borrar los que haya:
>    - `rose.ns.cloudflare.com`
>    - `thomas.ns.cloudflare.com`
>
> El correo no se ve afectado: está todo preparado para que siga funcionando igual.
>
> Si te resulta más cómodo, puedes darme acceso a tu Área de Cliente y lo hago yo, o llamar a
> Arsys (941 620 100) y pedirles exactamente esas dos cosas.
>
> Gracias.
