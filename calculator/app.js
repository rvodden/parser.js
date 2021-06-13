const express = require('express');
const app = express();
const winston = require('winston');
const expressWinston = require('express-winston');
const model = require('model');
const calculator = require('./calculator');

expressWinston.requestWhitelist.push('body');

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

const port = process.env.PORT || 0;

const router = new express.Router();

router.post('/', (req, res) => {
  try {
    res.json(calculator.calculate(req.body));
  } catch (err) {
    if (!(err instanceof model.InvalidExpression)) throw err;
    res.status(400).send({
      error: err.message,
    });
  }
});

app.use('/api', router);

app.use(
    expressWinston.errorLogger({
      transports: [new winston.transports.Console()],
      format: winston.format.combine(
          winston.format.colorize(),
          winston.format.json()
      ),
    })
);

app.asyncListen = (port) => {
  return new Promise((resolve, reject) => {
    const server = app.listen(port);
    server.once('listening', () => {
      resolve(server);
    });
    server.once('error', reject);
  });
};

if (require.main == module) {
  const server = app.listen(port);
  server.once('listening', () => {
    console.log(
        `Calculator is now listening on port ${server.address().port}.`
    );
  });
}

module.exports = app;
