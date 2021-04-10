FROM node:lts-alpine
RUN apk update && apk upgrade

USER node
WORKDIR /home/node/app

COPY ./package*.json .
COPY ./*yarn.lock .

RUN yarn cache clean
RUN yarn

COPY . .

CMD yarn start
