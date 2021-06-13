const express = require('express');
const axios = require('axios').default;
const app = express();
const winston = require('winston');
const expressWinston = require('express-winston');

expressWinston.requestWhitelist.push('body');

axios.defaults.timeout = 500;

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(
    expressWinston.logger({
      transports: [new winston.transports.Console()],
      format: winston.format.combine(
          winston.format.colorize(),
          winston.format.json()
      ),
      statusLevels: {
        success: 'debug',
        warn: 'debug',
        error: 'info',
      },
    })
);

app.setup = (config) => {
  if (config) {
    app.PARSER_ADDRESS =
      config.parser_address ||
      process.env.PARSER_ADDRESS ||
      'http://localhost:3000/';
    app.CALCULATER_ADDRESS =
      config.calculator_address ||
      process.env.CALCULATER_ADDRESS ||
      'http://localhost:3001/';
  } else {
    app.PARSER_ADDRESS =
      process.env.PARSER_ADDRESS || 'http://localhost:3000/';
    app.CALCULATER_ADDRESS =
      process.env.CALCULATER_ADDRESS || 'http://localhost:3001/';
  }
  app.PORT = process.env.PORT || 0;
};

const router = new express.Router();
const parserPath = '/api';
const calculatorPath = '/api';


router.post('/', (req, res, next) => {
  return axios
      .post(app.PARSER_ADDRESS + parserPath, req.body)
      .then((response) => {
        return axios
            .post(app.CALCULATER_ADDRESS + calculatorPath, response.data)
            .then((response) => {
              res.json(response.data);
            });
      })
      .catch((error) => {
        if ( error.response ) { // upstream error
          res.status(error.response.status);
          res.json(error.response.data);
        } else { // something else
          next(error);
        }
      });
});

app.use('/api', router);

app.use(
    expressWinston.errorLogger({
      transports: [new winston.transports.Console()],
      format: winston.format.combine(
          winston.format.colorize(),
          winston.format.json()
      ),
      statusLevels: {
        success: 'debug',
        warn: 'debug',
        error: 'info',
      },
    })
);

app.asyncListen = (port, config) => {
  return new Promise((resolve, reject) => {
    app.setup(config);
    const server = app.listen(port);
    server.once('listening', () => {
      resolve(server);
    });
    server.once('error', reject);
  });
};

if (require.main == module) {
  app.setup();
  const server = app.listen(app.PORT, () => {
    console.log(
        `ExpressionEvaluator is now listening on port ${server.address().port}.`
    );
  });
}

module.exports = app;
