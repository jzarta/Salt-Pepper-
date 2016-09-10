var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override')
var app = express();

var PORT = 3000;

//Serve static content for the app from the "public" directory in the application directory.
app.use(express.static(process.cwd() + '/public'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}))

var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'toor',
    database: 'quotes_db'
});

connection.connect(function(err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    };
    console.log('connected as id ' + connection.threadId);
})

app.get('/', function(req, res) {
    connection.query('SELECT * FROM quotes;', function(err, data) {
        if (err) throw err;
        res.render('index', {
            quotes: data
        });
    });
});


app.listen(PORT, function() {
    console.log("Listening on PORT %d", PORT);
});