FROM node:lts-alpine AS builder
WORKDIR /usr/src/app
COPY ./frontend/ .
RUN npm install
ENV NODE_ENV=production
RUN npm run build

FROM node:lts-alpine AS production
WORKDIR /usr/src/app
COPY ./backend/ .
COPY --from=builder /usr/src/app/build ./public
ENV NODE_ENV=production
RUN npm install

EXPOSE $PORT

CMD ["npm", "start"]
