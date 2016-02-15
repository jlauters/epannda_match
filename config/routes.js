module.exports = function(app, config) {

    // controllers
    var home = require('../controllers/home')(app, config);

    app.get('/', home.index);

    app.use(function(err, req, res, callback) {
        if(err) { callback(err); }
        else {
            res.status(404).json({"error":"Not Found"});
            callback();
        }
    });
}
