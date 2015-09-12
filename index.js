var GoogleSpreadsheet = require("google-spreadsheet");

var my_sheet = new GoogleSpreadsheet('1bpC1BePnvqBPWMjw7A9tYfHdwOhdlJ45GxhNQFNoamA');

var creds = require('./google-generated-creds.json');

var express = require('express');
var app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/sessions.json', function (req, res) {
  my_sheet.useServiceAccountAuth(creds, function(err){
    if(err) {
      console.log('err', err);
    }
    // getInfo returns info about the sheet and an array or "worksheet" objects
    my_sheet.getInfo( function( err, sheet_info ){
      if(err) {
        console.log('err', err);
      }

      console.log( sheet_info.title + ' is loaded' );
      // use worksheet object if you want to stop using the # in your calls

      var sheet1 = sheet_info.worksheets[0];

      var returnData = [];
      sheet1.getRows( function( err, rows ){
        Object.keys(rows).forEach(function (propKey) {
          if(rows[propKey].zeitstempel && rows[propKey].deinname && rows[propKey].deinsessiontitel) {
            var sessionObject = {
              zeit: rows[propKey].zeitstempel,
              name: rows[propKey].deinname,
              titel: rows[propKey].deinsessiontitel
            }
            if (rows[propKey].deinesession) {
              sessionObject.session = rows[propKey].deinesession;
            }

            returnData.push(sessionObject);
          }
        });
        res.json(returnData);
      });
    });

  });

});


var server = app.listen(3030, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
