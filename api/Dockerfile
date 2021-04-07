FROM node:lts-alpine
WORKDIR /usr/src/api

VOLUME [ "/usr/src/api/node_modules/" ]

RUN yarn install
CMD ["yarn", "start"]
