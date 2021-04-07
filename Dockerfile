FROM node:lts-alpine AS builder
WORKDIR /usr/src/app
COPY ./frontend/ .
RUN yarn install
RUN yarn build

FROM node:lts-alpine AS production
WORKDIR /usr/src/app
COPY ./backend/ .
COPY --from=builder /usr/src/app/build ./public
RUN yarn install

EXPOSE $PORT

CMD ["yarn", "start"]
