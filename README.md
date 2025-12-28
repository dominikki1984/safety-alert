📱 Safety Alert – React Native / Expo

Aplikacja mobilna Safety Alert została stworzona w technologii React Native z wykorzystaniem Expo.
Celem aplikacji jest umożliwienie użytkownikowi szybkiej reakcji w sytuacjach awaryjnych poprzez integrację z natywnymi funkcjami urządzenia mobilnego.

✨ Funkcjonalności

📍 Pobieranie lokalizacji GPS urządzenia

🆘 Wysyłanie wiadomości SOS SMS

📞 Wykonywanie połączeń telefonicznych (otwarcie dialera)

📷 Wykonywanie zdjęć przy użyciu aparatu

🖼️ Zapis zdjęć do galerii urządzenia

💾 Lokalny zapis ustawień i historii akcji (AsyncStorage)

🧭 Prosta nawigacja pomiędzy ekranami

🖥️ Ekrany aplikacji

Home – ekran główny z przyciskami SOS, połączenia i historią akcji

Settings – konfiguracja numeru alarmowego i treści wiadomości

Camera – pełna obsługa aparatu i wykonywania zdjęć

🛠️ Wykorzystane technologie

React Native

Expo

TypeScript

@react-navigation/native

expo-sms

expo-location

expo-camera

expo-media-library

@react-native-async-storage/async-storage

🚀 Uruchomienie projektu
Wymagania:

Node.js (LTS)

npm

Aplikacja Expo Go (Android / iOS)

Instalacja:
git clone https://github.com/dominikki1984/safety-alert.git
cd safety-alert
npm install

Uruchomienie:
npx expo start


Zeskanuj kod QR w aplikacji Expo Go.

📂 Struktura projektu
safety-alert/
├── App.tsx
├── components/
├── screens/
├── services/
├── types/
├── assets/
└── package.json

⚠️ Uwagi

Funkcje SMS, połączeń telefonicznych i aparatu najlepiej testować na fizycznym urządzeniu.

Emulator Android może nie obsługiwać wszystkich natywnych funkcji (np. dialera).

👤 Autor

Autorzy: Dominik Cieśliński, Nikodem Czubak, Marcin Buczak
Projekt wykonany w ramach zaliczenia przedmiotu związanego z programowaniem aplikacji mobilnych.

📄 Licencja

Projekt edukacyjny – do użytku niekomercyjnego.
