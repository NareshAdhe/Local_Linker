FROM node:25-alpine as build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

FROM nginx:stable-alpine

COPY --from=build /app/dist /usr/share/nginx/html

COPY --from=build /app/nginx.conf /etc/nginx/conf.d/default.conf