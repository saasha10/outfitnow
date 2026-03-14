# OutfitNow

**Tu estilo, tu momento.** A React Native mobile app built with Expo.

## Tech Stack

- **Framework:** [Expo](https://expo.dev/) SDK 55 (React Native 0.83)
- **Language:** TypeScript (strict mode)
- **Navigation:** React Navigation 7 (native stack)
- **Backend:** Firebase (Auth, Firestore, Storage)
- **HTTP Client:** Axios
- **Validation:** Zod
- **Animations:** React Native Reanimated 4
- **Linting:** ESLint 9 (flat config) + Prettier

## Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- iOS Simulator (macOS) or Android Emulator

## Getting Started

```bash
# Install dependencies
npm install

# Start the development server
npx expo start

# Run on specific platform
npm run ios
npm run android
npm run web
```

## Environment Variables

Create a `.env` file in the project root with your Firebase config:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## Project Structure

```
src/
├── assets/          # Images, fonts, and other static assets
├── components/      # Reusable UI components
├── constants/       # Theme colors, spacing, font sizes
├── hooks/           # Custom React hooks
├── navigation/      # React Navigation setup
├── screens/         # Screen components
├── services/        # External services (API, Firebase)
│   └── firebase/    # Firebase config, auth, database, storage
├── store/           # State management
├── types/           # TypeScript type definitions
└── utils/           # Utility functions
```

## Path Aliases

The project uses path aliases for clean imports:

| Alias | Path |
| --- | --- |
| `@/*` | `src/*` |
| `@components/*` | `src/components/*` |
| `@screens/*` | `src/screens/*` |
| `@navigation/*` | `src/navigation/*` |
| `@services/*` | `src/services/*` |
| `@hooks/*` | `src/hooks/*` |
| `@store/*` | `src/store/*` |
| `@utils/*` | `src/utils/*` |
| `@constants/*` | `src/constants/*` |
| `@app-types/*` | `src/types/*` |
| `@assets/*` | `src/assets/*` |

## Scripts

| Command | Description |
| --- | --- |
| `npm start` | Start dev server |
| `npm run dev` | Start dev server (dev client) |
| `npm run ios` | Start on iOS |
| `npm run android` | Start on Android |
| `npm run web` | Start on web |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Run ESLint with auto-fix |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check formatting |
| `npm run type-check` | Run TypeScript type checking |
