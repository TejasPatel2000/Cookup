FROM node:lts-alpine AS builder
WORKDIR /usr/src/app
COPY ./frontend/ .
RUN yarn install
ENV NODE_ENV=production
RUN yarn build

FROM node:lts-alpine AS production
WORKDIR /usr/src/app
COPY ./backend/ .
COPY --from=builder /usr/src/app/build ./public
ENV NODE_ENV=production
RUN yarn install

EXPOSE $PORT

CMD ["yarn", "start"]
