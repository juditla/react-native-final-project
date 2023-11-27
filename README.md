# INKSPIRE - Frontend

Inkspire is a mobile application developed with React Native and Expo optimised for iOS.
The application is designed to connect users with local tattoo artists, providing a platform to explore their artwork and facilitate communication.

## Technologies

### Frontend

- React Native / Expo
- TypeScript
- Jest for Unit tests
- Maestro for E2E tests
- GiftedChat UI library
- React Native Paper
- Google Maps API

#### Backend

Link to repository: <a href='https://github.com/juditla/fastify-final-project'>fastify-final-project</a>

- Node.js
- Fastify
- postgreSQL
- Prisma
- REST API
- Cloudinary image upload

## Screenshots

<img src="https://github.com/juditla/fastify-final-project/blob/main/assets/screenshot/Login-Screen.png" alt="login screen" width="300" height="auto" /> <img src="https://github.com/juditla/fastify-final-project/blob/main/assets/screenshot/ArtistOverview-Screen.png" alt="artist overview screen" width="300" height="auto" /> <img src="https://github.com/juditla/fastify-final-project/blob/main/assets/screenshot/ArtistDetail-Screen.png" alt="artist details screen" width="300" height="auto" /> <img src="https://github.com/juditla/fastify-final-project/blob/main/assets/screenshot/StudioOverview-Screen.png" alt="studio overview screen" width="300" height="auto" /> <img src="https://github.com/juditla/fastify-final-project/blob/main/assets/screenshot/StudioDetail-Screen.png" alt="studio details screen" width="300" height="auto" /> <img src="https://github.com/juditla/fastify-final-project/blob/main/assets/screenshot/ConversationOverview-Screen.png" alt="conversation overview screen" width="300" height="auto" /> <img src="https://github.com/juditla/fastify-final-project/blob/main/assets/screenshot/Chat-Screen.png" alt="chat screen" width="300" height="auto" /> <img src="https://github.com/juditla/fastify-final-project/blob/main/assets/screenshot/Profile-Screen.png" alt="profile screen" width="300" height="auto" /> <img src="https://github.com/juditla/fastify-final-project/blob/main/assets/screenshot/EditProfile-Screen.png" alt="edit profile screen" width="300" height="auto" />

## Setup guide

To run this project locally, the following steps are needed:

- Clone this repo on your local machine and connect to your GitHub account

- Install dependencies by running `pnpm install`

- For automated testing on EAS build with Maestro

  - Create an expo account
    - https://expo.dev/
    - Create `EXPO_TOKEN`` and add as a secret to your github repository
  - Install Maestro
    - Run `curl -Ls "https://get.maestro.mobile.dev" | bash`
    - for iOS additionally:
      - `brew tap facebook/fb`
      - `brew install facebook/fb/idb-companion`
      - `idb_companion - udid idOfIOSDevice` - to find your udid run `xcrun simctl list`
  - Create Maestro account
    - https://console.mobile.dev/
    - Create `MAESTRO_API_KEY` and add as a secret to your github repository and EXPO project

- To set up the backend part of the project, go to <a href='https://github.com/juditla/fastify-final-project'>fastify-final-project</a> and follow the set up instructions there
