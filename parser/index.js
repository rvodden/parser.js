var express = require('express');
var app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json())

var port = process.env.PORT || 8080;

var router = express.Router();

router.get('/', (req, res) => {
    res.json({
        message: "Horray! Welcome to the best API in the world!"
    })
})

app.use('/api', router);

app.listen(port);
console.log('Magic happens on port ' + port);