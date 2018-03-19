# DFTBA Commission Reporter

## Development

To run the app locally, first make sure you have [Node.js](https://nodejs.org) installed,
then navigate to this directory and run

```
npm install
```

Then duplicate the .env.sample file into .env and configure the environment variables to suit your needs.
To see all the current production variables, you can run the following command, provided you have the Heroku Toolbelt installed.

```
heroku config -a dftba-commission
```

Once you have your config config'd, run the following command for running the app locally:

```
npm run dev
```


## Running a Production Deployment

The app has only been tested for production in a Heroku environment and requires the following addons:

- Auth0
- Sendgrid (required for Auth0)
- Heroku Postgres :: Database (Hobby Basic or greater)
- Papertrail (optional, for tracking logs)

To push to the existing deployment running at https://dftba-commission.herokuapp.com, simply commit your changes
and `git push heroku master`, assuming you have `heroku` configured as a remote. To do this run `heroku git:remote -a swatchify`.

If you are configuring a new deployment, simply run `heroku create` and configure the addons mentioned above.
