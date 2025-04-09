FROM node:slim

WORKDIR /app

COPY package* .

RUN npm install 

COPY . .

EXPOSE 4000

CMD ["npm","start"]