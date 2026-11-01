# Simple Clima

App de clima para Android (Expo + React Native + TypeScript).

- Temperatura actual y pronóstico de 7 días
- Ciudad por defecto Buenos Aires, cambiable con buscador (se guarda en el teléfono)
- Sin GPS, sin cuentas, sin anuncios, sin analítica
- Datos: [Open-Meteo](https://open-meteo.com), pública y sin API key (CC BY 4.0)

## Estructura

```
App.tsx                 Punto de entrada; solo monta la pantalla
index.js                registerRootComponent de Expo
src/
  api/                  Cliente HTTP y llamadas a Open-Meteo
    client.ts           GET con timeout que normaliza los errores
    errors.ts           ApiError y mensajes mostrables
    openMeteo.ts        fetchForecast() y searchPlaces()
  components/           Componentes de presentación, sin estado de negocio
  constants/            Ciudad por defecto, claves de storage, límites
  hooks/                Estado y efectos: useForecast, usePlaceSearch, useStoredPlace
  screens/              WeatherScreen: compone hooks y componentes
  services/             Persistencia (AsyncStorage)
  theme/                Colores, espaciados, radios y tamaños de fuente
  types/                Tipos de dominio y formas crudas de la API
  utils/                Funciones puras: fechas, códigos WMO, formato
assets/                 Ícono, adaptive icon y splash de la app
store/                  Gráficos para la ficha de Play Store
docs/                   Política de privacidad (GitHub Pages)
scripts/                Generador de los assets gráficos
```

La regla: los **componentes** no llaman a la API ni al storage, los **hooks** no
renderizan, y los **utils** son funciones puras sin dependencias de React.

## Desarrollo

```bash
npm install
npx expo start      # escaneá el QR con Expo Go
npx tsc --noEmit    # chequeo de tipos
```

## APK de prueba (sin store)

```bash
npm install -g eas-cli
eas login
eas build --platform android --profile preview
```

## Publicar en Google Play

Ver **[PUBLICACION.md](./PUBLICACION.md)** para la guía completa paso a paso.

```bash
eas build --platform android --profile production   # genera el .aab
```

## Regenerar los assets gráficos

```bash
python3 -m pip install pillow
python3 scripts/generate-assets.py
```

El script escribe directamente en `assets/` y `store/`.
