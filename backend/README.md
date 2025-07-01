Dans le dossier backend:

npm init -y
npm i express prisma
npm install --save-dev nodemon
npm i dotenv
npx prisma init
npm install @prisma/client

Config du .env pour ajouter la DATABASE_URL:

npx prisma generate

ajouter dans package.json sous scripts du backend:

"prisma": {
    "schema": "./prisma"
  },

creation des models prisma d'abord, ensuite: 
npx prisma migrate dev

npm install argon2 jsonwebtoken
npm install cors
npm install axios



