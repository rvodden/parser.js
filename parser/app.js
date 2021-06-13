const express = require('express');
const app = express();
const winston = require('winston');
const expressWinston = require('express-winston');
const {parse} = require('./parser');
const {InvalidExpression} = require('model');

expressWinston.requestWhitelist.push('body');
app.use(express.urlencoded({extended: true}));
app.use(express.json());

const port = process.env.PORT || 0;

const router = new express.Router();

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

router.post('/', (req, res) => {
  try {
    res.json(parse(req.body.expression));
  } catch (err) {
    if (!(err instanceof InvalidExpression)) throw err;
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
    console.log(`Parser is now listening on port ${server.address().port}.`);
  });
}

module.exports = app;
