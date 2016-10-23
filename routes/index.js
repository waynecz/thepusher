var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
    var title = 'ThePusher';
    res.renderPage('index', {
        title: title
    });
});

module.exports = router;
