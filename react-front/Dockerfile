FROM node:20-slim

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE ${VITE_DEV_PORT:-5173}

CMD ["npm", "run", "dev"]
