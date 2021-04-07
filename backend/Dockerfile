FROM node:lts-alpine
RUN apk update && apk upgrade

USER node
RUN mkdir -p /home/node/app && chown -R node:node /home/node/app
WORKDIR /home/node/app

COPY --chown=node:node . /home/node/app

CMD [ -d "node_modules" ] && yarn start || yarn install && yarn start
