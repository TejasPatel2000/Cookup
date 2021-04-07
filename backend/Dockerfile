FROM node:lts-alpine
WORKDIR /usr/src/app

ADD package.json /usr/src/app

RUN apk update && apk upgrade && yarn install

ADD . /usr/src/app

CMD ["yarn", "start"]
