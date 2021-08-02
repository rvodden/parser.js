const express = require('express');
const axios = require('axios').default;
const app = express();
const winston = require('winston');
const expressWinston = require('express-winston');

const CalculatorClient = require('./calculator_client');
const ParserClient = require('./parser_client');
const ExpressionEvaluator = require('./expression_evaluator');

const parserPath = '/api';
const calculatorPath = '/api';

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

const router = new express.Router();

app.setup = (config) => {
  if (config) {
    app.PARSER_ADDRESS =
      config.parser_address ||
      process.env.PARSER_ADDRESS ||
      'http://localhost:3000';
    app.CALCULATER_ADDRESS =
      config.calculator_address ||
      process.env.CALCULATER_ADDRESS ||
      'http://localhost:3001';
  } else {
    app.PARSER_ADDRESS =
      process.env.PARSER_ADDRESS || 'http://localhost:3000';
    app.CALCULATER_ADDRESS =
      process.env.CALCULATER_ADDRESS || 'http://localhost:3001';
  }
  app.PORT = process.env.PORT || 0;
  router.expressionEvaluator = new ExpressionEvaluator(
      new ParserClient(app.PARSER_ADDRESS + parserPath),
      new CalculatorClient(app.CALCULATER_ADDRESS + calculatorPath)
  );
};


router.post('/', (req, res, next) => {
  return router.expressionEvaluator.evaluate(req.body).then((result) => {
    res.json(result);
  }).catch((error) => {
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

if (require.main === module) {
  app.setup();
  const server = app.listen(app.PORT, () => {
    console.log(
        `ExpressionEvaluator is now listening on port ${server.address().port}.`
    );
  });
}

module.exports = app;
