FROM node:lts-alpine
RUN apk update && apk upgrade

USER node
WORKDIR /home/node/app

CMD [ -d "node_modules" ] && yarn start || yarn install && yarn start
