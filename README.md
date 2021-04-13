# CookUp
A web app designed to share and find recipes.
### Getting Started
Install Docker from [here](https://docs.docker.com/get-docker/).

If you're on Linux, you will also need to install docker-compose by following the instructions found [here](https://docs.docker.com/compose/install/#install-compose-on-linux-systems).

Finally run these commands to get up and running.

```bash
git clone https://github.com/CookUpApp/cookup.git
cd cookup
# The port the app will listen on
# Use "PORT=$PORT" for cloud9 sessions
echo "PORT=8080" > .env
echo "SESSION_KEY=..." > .env
echo "TWILIO_SID=....." > .env
echo "TWILIO_TOKEN=....." > .env
echo "TWILIO_NUMBER=+1.........." > .env
docker-compose up
```

### Deploying to Heroku
```bash
heroku container:login
heroku create cookupapp --buildpack heroku/node
heroku container:push web
heroku container:release web
```

### Adding Packages
All dependency files are are owned by the node user within their respective containers.
DO NOT RUN `npm install` OR `npm i` IN BACKEND OR FRONTEND.
```bash
npm run add -- PACKAGES ... ARGS ...
```
