FROM node:16.13.1

RUN npm i -g npm@latest
RUN npm install -g serve

RUN mkdir app

COPY . ./app

WORKDIR /app
RUN npm install && npm run build

