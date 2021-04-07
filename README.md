# CookUp
An web app designed to share and find recipees.
### Getting Started
Install Docker from [here](https://docs.docker.com/get-docker/).

If you're on Linux, you will also need to install docker-compose by following the instructions found [here](https://docs.docker.com/compose/install/#install-compose-on-linux-systems).

Finally run this command to get up and running.

```bash
git clone https://github.com/CookUpApp/cookup.git
cd cookup
echo "PORT=80" > .env # The port the app will listen on ("PORT=$PORT" for c9)
docker-compose up
```

### Deploying to heroku
```bash
heroku container:login
heroku create
heroku container:push web
heroku container:release web
```
