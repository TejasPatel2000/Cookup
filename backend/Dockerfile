FROM node:lts-alpine

WORKDIR /home/node/app

COPY ./package.json .

RUN yarn cache clean
RUN yarn

COPY . .

CMD yarn start
