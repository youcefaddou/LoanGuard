# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


dans le dossier racine: 

npm create vite@latest frontend -- --template react

dans le dossier frontend:

npm install tailwindcss @tailwindcss/vite

ensuite on place dans src/index.css tout en haut:

@import "tailwindcss";

Lance les projets

Pour le backend (depuis le dossier backend) :

bash
npx nodemon index.js

Pour le frontend (depuis le dossier frontend) :

bash
npm run dev