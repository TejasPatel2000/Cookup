FROM node:lts-alpine
WORKDIR /usr/src/app

VOLUME [ "/usr/src/app/node_modules/" ]

RUN yarn install
CMD ["yarn", "start"]
