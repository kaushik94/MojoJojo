# MojoJojo
## An app that posts twitter data to instamojo API
### Local Installation
```
$ git clone https://github.com/kaushik94/instamojo-jojo
$ cd instamojo-jojo && npm install
$ npm test
$ npm start
```
NOTE: Redis instance should be running locallu on port:6379.
### Heroku Installation
After `npm install` do
```
$ heroku create
$ git push heroku master
```
You should set the config vars properly
### Tests
In the `tests/tests.js`. Using `Mocha` for testing.
```
$ npm test
```
### Implementation details
### License
`MIT`