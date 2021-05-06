# [CookUp](https://cookupapp.herokuapp.com/)
A web app designed to share and find recipes.
### Getting Started
1. Install Docker from [here](https://docs.docker.com/get-docker/).

    If you're on Linux, you will also need to install docker-compose by following the instructions found [here](https://docs.docker.com/compose/install/#install-compose-on-linux-systems).

2. Setup Twilio

    Instructions can be found [here](https://www.twilio.com/docs/sms/quickstart/node#sign-up-for-twilio-and-get-a-twilio-phone-number).

3. Finally run these commands to get up and running.

```bash
git clone https://github.com/CookUpApp/cookup.git
cd cookup
# The port the app will listen on
# Use "PORT=$PORT" for cloud9 sessions
echo "PORT=8080" > .env
echo "SESSION_KEY=..." > .env
echo "TWILIO_SID=....." > .env
echo "TWILIO_TOKEN=....." > .env
# Number received from Twilio
echo "TWILIO_NUMBER=+1.........." > .env
# Optional, only required for production
echo "MONGO_URL=........" > .env
docker-compose up
```

### Deploying to Heroku
```bash
heroku container:login
heroku create --buildpack heroku/nodejs
heroku container:push web
heroku container:release web
```

### Adding Packages
All dependency files are are owned by the node user within their respective containers.

DO NOT RUN `npm install` OR `npm i` IN BACKEND OR FRONTEND.
```bash
npm run add -- PACKAGES ... ARGS ...
```

### Linting
1. `jsx-a11y/label-has-associated-control` was set to `"assert": "either"` since our forms had mixed label locations for styling.
2. `jsx-a11y/anchor-is-valid` was set to `off` since out css framework had a heavy use of anchor buttons
3. `func-names` was set to off as we needed functions with a contextual this in our database schema
