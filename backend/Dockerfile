FROM node:20

RUN apt-get update && apt-get install -y imagemagick

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
