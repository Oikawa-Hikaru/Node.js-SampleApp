var express = require('express');
var router = express.Router();

// Connectionを定義する
var Connection = require('tedious').connect;

// SQLServerの接続定義を記載する。
var config = {
    server: 'localhost',
    authentication: {
        type: 'default',
        options: {
            userName: 'admin',
            password: 'xxxxxx', // 伏せました。
        }
    },
    options: {
        encrypt: true,
        database: 'Training01',
        trustServerCertificate: true,
    }
};

/* GET users listing. */
router.get('/', function (req, res, next) {
    console.log('SQL Serverへの接続を実施しています...');
    var connection = new Connection(config);
    var content = [];

    connection.on('connect', function (err) {
        if (err) {
            console.log(err);
            console.log('SQL Serer connect error.(' + err + ')');
            process.exit();
        }
        console.log("connected");
        executeStatement();
    });

    connection.on('end', function () {
        console.log("disconnected");
        res.render('sqlSample', { title: '製品一覧', content: content });
    });

    var Request = require('tedious').Request;

    function executeStatement() {
        request = new Request("SELECT * FROM ProductsMaster with (NOLOCK)", function (err) {
            if (err) {
                console.log(err);
            }
        });

        var result = {};
        request.on('row', function (columns) {
            columns.forEach(function (column) {
                if (column.value === null) {
                    console.log('NULL');
                } else {
                    result[column.metadata.colName] = column.value;
                }
            });
            content.push(result);
            result = {};
        });

        request.on('requestCompleted', function () {
            console.log('requestCompleted');
            connection.close();
        });

        connection.execSql(request);
    }
});

console.log('sqlSample.js is Loaded.');

module.exports = router;
