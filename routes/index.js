var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
    var title = '22';
    res.renderPage('index', {
        title: title
    });
});
router.get('/bar', function (req, res, next) {

    res.send('adsdada');
});

module.exports = router;
