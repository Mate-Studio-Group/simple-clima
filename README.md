# Clima

App personal de clima (Expo + React Native + TypeScript).

- Pronóstico de 7 días y temperatura actual
- Ciudad por defecto: Buenos Aires, cambiable con buscador (se guarda en el teléfono)
- API: [Open-Meteo](https://open-meteo.com), pública y sin API key

## Correr en desarrollo

```bash
npm install
npx expo install react react-native @react-native-async-storage/async-storage expo-status-bar
npx expo start
```

`expo install` elige las versiones que corresponden al SDK 58. Escaneá el QR con Expo Go.

## Generar un APK instalable (Android, sin store)

```bash
npm i -g eas-cli
eas login
eas build -p android --profile preview
```

Al terminar, Expo da un link/QR para descargar e instalar el APK en el celu.
