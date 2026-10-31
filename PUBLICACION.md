# Publicar Simple Clima en Google Play

Guía paso a paso de **lo que tenés que hacer vos**, en orden, con los enlaces de
cada pantalla. Todo lo que es código y assets ya está resuelto en el repo (ver
[Qué ya está hecho](#qué-ya-está-hecho)).

| Dato | Valor |
|---|---|
| Nombre en la tienda | **Simple Clima** |
| Package / Application ID | **`com.margen.simpleclima`** (inmutable una vez publicada) |
| Tipo de cuenta | Personal |
| Monetización | Gratis, sin anuncios, sin compras |
| Permisos de Android | Solo `INTERNET` |

---

## Índice

1. [Qué ya está hecho](#qué-ya-está-hecho)
2. [Paso 1 — Cuenta de Google Play Console](#paso-1--cuenta-de-google-play-console)
3. [Paso 2 — Publicar la política de privacidad](#paso-2--publicar-la-política-de-privacidad)
4. [Paso 3 — Cuenta de Expo y primer build de producción](#paso-3--cuenta-de-expo-y-primer-build-de-producción)
5. [Paso 4 — Crear la app en Play Console](#paso-4--crear-la-app-en-play-console)
6. [Paso 5 — Ficha de la tienda](#paso-5--ficha-de-la-tienda)
7. [Paso 6 — Capturas de pantalla](#paso-6--capturas-de-pantalla)
8. [Paso 7 — Formularios obligatorios](#paso-7--formularios-obligatorios)
9. [Paso 8 — Subir el AAB a pruebas internas](#paso-8--subir-el-aab-a-pruebas-internas)
10. [Paso 9 — Prueba cerrada con 12 testers](#paso-9--prueba-cerrada-con-12-testers)
11. [Paso 10 — Pasar a producción](#paso-10--pasar-a-producción)
12. [Después del lanzamiento](#después-del-lanzamiento)

---

## Qué ya está hecho

No tenés que tocar nada de esto.

- **Código reorganizado** en `src/` (`api`, `components`, `constants`, `hooks`,
  `screens`, `services`, `theme`, `types`, `utils`). `App.tsx` quedó en 7 líneas.
- **Manejo de errores**: timeout de 10 s, mensajes distintos para sin conexión,
  timeout y servicio caído, y botón de reintento.
- **Atribución a Open-Meteo** visible y clickeable dentro de la app, como exige
  su licencia CC BY 4.0.
- **`app.json`**: nombre, package, ícono, adaptive icon, splash, solo Android,
  `permissions: []`.
- **`eas.json`**: perfil `production` que genera AAB con `autoIncrement` y
  `appVersionSource: "remote"`, más el bloque `submit`.
- **Assets** en `assets/` (ícono 1024, adaptive icon, splash) y en `store/`
  (ícono 512×512 y gráfico destacado 1024×500). Se regeneran con
  `python3 scripts/generate-assets.py`.
- **Política de privacidad** en `docs/index.html`, lista para GitHub Pages.
- **`.gitignore`** actualizado para que no se commiteen keystores ni el JSON de
  la service account.

---

## Paso 1 — Cuenta de Google Play Console

**Dónde:** <https://play.google.com/console/signup>

1. Entrá con la cuenta de Google que vayas a usar para siempre como
   desarrollador. Migrar una app a otra cuenta después es un trámite largo.
2. Elegí **Personal** (*Yourself / Personal account*).
3. Pagá la cuota de **USD 25**, que es por única vez.
4. Completá la **verificación de identidad**: nombre legal, dirección, teléfono
   y una foto de tu documento. Google suele tardar entre unas horas y 48 h.
5. Definí el **nombre de desarrollador** que verá el público en la ficha.

> **Importante:** Google exige que las cuentas personales creadas desde
> noviembre de 2023 hagan una prueba cerrada con **12 testers durante 14 días
> seguidos** antes de poder pedir acceso a producción (Paso 9). Conviene
> arrancar a juntar la gente desde ahora.
> Referencia: <https://support.google.com/googleplay/android-developer/answer/14151465>

---

## Paso 2 — Publicar la política de privacidad

Play exige una **URL pública** de política de privacidad aunque la app no
recopile nada. El HTML ya está escrito en `docs/index.html`.

**Dónde:** `https://github.com/Mate-Studio-Group/simple-clima/settings/pages`

1. *Settings* → *Pages*.
2. En **Source**, elegí `Deploy from a branch`.
3. Branch: `main`, carpeta: **`/docs`**. Guardá.
4. Esperá 1–2 minutos y verificá que cargue:
   **`https://mate-studio-group.github.io/simple-clima/`**
5. Guardá esa URL: la vas a pegar en el Paso 5 y en el Paso 7.

> Si el repo es privado, GitHub Pages no sirve en el plan gratuito. En ese caso
> hacelo público, o subí el HTML a cualquier hosting estático (Netlify, Vercel,
> Cloudflare Pages).

---

## Paso 3 — Cuenta de Expo y primer build de producción

**Dónde:** <https://expo.dev/signup> y tu terminal.

```bash
# 1. Instalar EAS CLI (una sola vez en tu máquina)
npm install -g eas-cli

# 2. Iniciar sesión con tu cuenta de Expo
eas login

# 3. Vincular el proyecto con Expo (agrega extra.eas.projectId a app.json)
cd ~/Mate/simple-clima
eas init

# 4. Build de producción: genera el .aab que pide Play
eas build --platform android --profile production
```

En el paso 4 te va a preguntar por la **keystore**. Elegí que **EAS la genere y
la administre** (*Generate new keystore*). Es la opción recomendada y evita que
pierdas la firma.

Cuando termina (10–20 minutos), Expo te da un link para descargar el **`.aab`**.
Descargalo: lo vas a subir a mano en el Paso 8.

> Antes de esto, probá que la app siga andando bien:
> `npx expo start` y escaneá con Expo Go.

---

## Paso 4 — Crear la app en Play Console

**Dónde:** <https://play.google.com/console> → *Todas las apps* → **Crear app**

| Campo | Valor |
|---|---|
| Nombre de la app | `Simple Clima` |
| Idioma predeterminado | Español (Argentina) o Español (Latinoamérica) |
| App o juego | App |
| Gratuita o de pago | **Gratuita** (no se puede cambiar a gratis→paga después) |
| Declaraciones | Aceptar las directrices del programa y las leyes de exportación de EE. UU. |

---

## Paso 5 — Ficha de la tienda

**Dónde:** *Crecer* → *Presencia en Play Store* → **Ficha de Play Store principal**

### Nombre de la app (máx. 30)
```
Simple Clima
```

### Descripción breve (máx. 80)
```
El pronóstico de la semana, sin vueltas. Gratis, sin anuncios y sin cuentas.
```

### Descripción completa (máx. 4000)
```
Simple Clima muestra lo único que querés saber cuando mirás el clima: cómo está
ahora y cómo va a estar los próximos siete días.

Sin cuentas, sin anuncios, sin notificaciones y sin permisos raros. Abrís la
app y ves el pronóstico.

QUÉ HACE
• Temperatura actual y estado del cielo
• Pronóstico de 7 días con máxima, mínima y probabilidad de lluvia
• Buscador de ciudades de todo el mundo
• Recuerda la ciudad que elegiste
• Deslizá hacia abajo para actualizar

QUÉ NO HACE
• No pide tu ubicación ni accede al GPS
• No muestra publicidad
• No te hace crear una cuenta
• No recopila datos personales ni usa herramientas de analítica

Los datos del pronóstico provienen de Open-Meteo (open-meteo.com), un servicio
meteorológico abierto, bajo licencia CC BY 4.0.
```

### Gráficos

| Recurso | Archivo en el repo |
|---|---|
| Ícono de la app (512×512 PNG) | `store/play-icon-512.png` |
| Gráfico destacado (1024×500 PNG) | `store/feature-graphic-1024x500.png` |
| Capturas de teléfono | Ver Paso 6 |

### Categorización
- **Categoría de la app:** `Clima` (*Weather*)
- **Etiquetas:** clima, pronóstico, tiempo
- **Email de contacto:** `margenpro@gmail.com`
- **Sitio web:** (opcional) `https://github.com/Mate-Studio-Group/simple-clima`

---

## Paso 6 — Capturas de pantalla

Play pide **mínimo 2** capturas de teléfono (hasta 8). Requisitos: PNG o JPEG,
lado menor ≥ 320 px, lado mayor ≤ 3840 px, relación entre 16:9 y 9:16.

**Cómo sacarlas:** instalá el APK de prueba en tu teléfono
(`eas build -p android --profile preview`), abrí la app y usá la captura nativa
de Android. Sugerencia de las 4 pantallas:

1. Pantalla principal con Buenos Aires y el pronóstico completo
2. El buscador abierto con resultados de una ciudad
3. Otra ciudad cargada, por ejemplo Bariloche o Madrid
4. Un día con lluvia, para que se vea el indicador de precipitación

---

## Paso 7 — Formularios obligatorios

Están todos en *Política* → **Contenido de la app**. Respuestas listas para esta
app:

### Política de privacidad
- URL: la del Paso 2 → `https://mate-studio-group.github.io/simple-clima/`

### Acceso a la app
- **Todas las funciones están disponibles sin restricciones de acceso.**
  No hay login, así que no hace falta dar credenciales de prueba.

### Anuncios
- **No, la app no contiene anuncios.**

### Clasificación de contenido
Cuestionario de IARC. Respuestas:
- Categoría: **Utilidad, productividad, comunicación u otro**
- Violencia, sexo, lenguaje, drogas, juegos de azar: **No** a todo
- ¿Comparte la ubicación del usuario? **No**
- ¿Permite comprar bienes digitales? **No**
- ¿Es una app de redes sociales o con contenido generado por usuarios? **No**

### Público objetivo y contenido
- **Grupos de edad:** 18 y más. (Si incluís menores, se activan las reglas de
  *Families*, que piden más trámites y no aportan nada acá.)
- ¿La app atrae a niños? **No**

### Seguridad de los datos
La respuesta corta es que la app no recopila nada:
- ¿Tu app recopila o comparte alguno de los tipos de datos requeridos? → **No**
- ¿Todos los datos se encriptan en tránsito? → **Sí** (la app usa solo HTTPS)
- ¿Ofrecés una forma de solicitar la eliminación de datos? → **No**, no se
  recopilan datos

> La ciudad guardada no cuenta como recopilación: queda solo en el dispositivo
> y nunca se transmite. Play lo considera *on-device only*, que está fuera del
> alcance del formulario.

### Otras declaraciones
- **App de noticias:** No
- **App de salud:** No
- **COVID-19 / rastreo de contactos:** No
- **App financiera:** No
- **Programa de gobierno:** No

---

## Paso 8 — Subir el AAB a pruebas internas

**Dónde:** *Probar y lanzar* → *Pruebas* → **Pruebas internas** → *Crear
versión*

1. Activá **Firma de aplicaciones de Play** cuando lo ofrezca. Es obligatorio
   para AAB y protege la firma.
2. Arrastrá el **`.aab`** que descargaste en el Paso 3.
3. **Nombre de la versión:** `1.0.0 (1)`
4. **Notas de la versión:**
   ```
   <es-AR>
   Primera versión. Clima actual y pronóstico de 7 días.
   </es-AR>
   ```
5. Guardá, revisá y lanzá a pruebas internas.
6. En la pestaña **Testers**, creá una lista con tu propio mail e instalá la app
   desde el link de participación para verificar que todo funciona.

> La primera subida **tiene que ser manual**. Las siguientes se pueden
> automatizar con `eas submit`, que ya está configurado en `eas.json`.

---

## Paso 9 — Prueba cerrada con 12 testers

Este paso aplica porque la cuenta es personal.

**Dónde:** *Probar y lanzar* → *Pruebas* → **Pruebas cerradas** → *Crear track*

1. Creá un track cerrado y subí el mismo AAB.
2. En **Testers**, creá una lista de correo electrónico con **al menos 12
   direcciones de Gmail**. Tienen que ser cuentas reales: amigos, familia,
   compañeros con Android.
3. Compartí el **link de participación** con cada uno. Cada persona tiene que
   **aceptar la invitación e instalar la app**.
4. Google exige que haya **12 testers activos durante 14 días corridos**. Si
   alguien se baja a mitad de camino, el contador puede reiniciarse.
5. Pasados los 14 días, Play Console habilita el botón para solicitar acceso a
   producción.

---

## Paso 10 — Pasar a producción

**Dónde:** *Probar y lanzar* → **Acceso a producción** → *Solicitar acceso*

1. Completá el formulario explicando cómo hiciste la prueba y qué feedback
   recibiste. Sé concreto: cuántos testers, qué dispositivos, qué ajustaste.
2. Google revisa la solicitud. Suele tardar unos días.
3. Aprobado el acceso, andá a *Producción* → *Crear versión*, promové el AAB
   desde pruebas cerradas y enviá a revisión.
4. La primera revisión de una app nueva puede demorar **de 3 a 7 días**.

---

## Después del lanzamiento

### Publicar una actualización

```bash
# 1. Subí la versión visible en app.json ("version": "1.1.0")
# 2. Nuevo build: el versionCode se incrementa solo (autoIncrement)
eas build --platform android --profile production

# 3. Subida automática a Play (ver nota sobre la service account)
eas submit --platform android --latest
```

### Habilitar `eas submit`

Para que el comando de arriba funcione hace falta una **service account** de
Google Cloud con permisos en Play Console:

1. <https://play.google.com/console> → *Configuración* → *Acceso a la API*
2. Creá un proyecto de Google Cloud vinculado y, desde ahí, una service account.
3. Descargá el JSON de credenciales y guardalo como
   `play-service-account.json` en la raíz del repo. **Ya está en `.gitignore`.**
4. En Play Console, dale a esa cuenta permiso de *Administrador de versiones*.

Guía oficial: <https://docs.expo.dev/submit/android/>

### Enlaces útiles

- Play Console: <https://play.google.com/console>
- Políticas para desarrolladores: <https://play.google.com/about/developer-content-policy/>
- Documentación de EAS Build: <https://docs.expo.dev/build/introduction/>
- Estado de los builds: <https://expo.dev/accounts>
