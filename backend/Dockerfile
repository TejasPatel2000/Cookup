FROM node:lts-alpine
WORKDIR /usr/src/app

ADD package.json /usr/src/app

RUN npm install

ADD . /usr/src/app

CMD ["npm", "start"]
