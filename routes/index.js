var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
    var title = 'ThePusher';
    res.renderPage('index', {
        title: title
    });
});

router.get('/vue-img-inputer', function (req, res, next) {
    var title = 'VueImgInpute';
    res.render('inputer', {
        title: title
    });
});

module.exports = router;
