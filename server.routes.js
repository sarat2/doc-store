var http = require("https");
const express = require('express');
const router = express.Router();
const Busboy = require('busboy');
const inspect = require('util').inspect;
const uuidv1 = require('uuid/v1');
const azure = require('azure-storage');
const blobService = azure.createBlobService(process.env.storageConnectionString);

/* GET api listing. */
router.get('/', (req, res) => {
  console.log('api check')
  res.status(200).json({ message: 'api works!!' });
});

router.post('/upload', (req, res) => {
  var busboy = new Busboy({ headers: req.headers });

  busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
    /*
    console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);
    file.on('data', function (data) {
      console.log('File [' + fieldname + '] got ' + data.length + ' bytes');
    });
    file.on('end', function () {
      console.log('File [' + fieldname + '] Finished');
    });
    */

    function readFirstBytes() {
      var chunk = file.read(5);
      if (!chunk)
        return file.once('readable', readFirstBytes);
      // var type = fileType(chunk);
      // if (type.ext === 'jpg' || type.ext === 'png' || type.ext === 'gif') {
        console.log(filename);
        const blobStream = blobService.createWriteStreamToBlockBlob("docs", filename,
          function (error, response) {
            if (error)
              console.log('blob upload error', error);
            else {
              console.log('blob upload complete');
              console.log(JSON.stringify(response, null, 4));
            }
              
          }
        );
        file.unshift(chunk);
        file.pipe(blobStream);
      // } else {
      //   console.error('Rejected file of type ' + type);
      //   file.resume(); // Drain file stream to continue processing form
      // }
    }

    readFirstBytes();
  });

  busboy.on('field', function (fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
    // console.log(JSON.parse(val));
    // console.log('Field [' + fieldname + ']: value: ' + inspect(val));

    // console.log(uuidv1());
    var doc = JSON.parse(val);
    doc['@search.action'] = 'upload';
    doc['id'] = uuidv1();
    
    var options = {
      "method": "POST",
      "hostname": "docustore.search.windows.net",
      "path": "/indexes/docs/docs/index?api-version=2017-11-11",
      "headers": {
        "content-type": "application/json",
        "api-key": process.env.searchKey,
        "cache-control": "no-cache"
      }
    };
    
    var request = http.request(options, function (response) {
      var chunks = [];
    
      response.on("data", function (chunk) {
        chunks.push(chunk);
      });
    
      response.on("end", function () {
        var body = Buffer.concat(chunks);
        console.log(body.toString());
      });
    });

    request.write(JSON.stringify({ value: [ doc ] }));
    request.end();
    // req.write(JSON.stringify({ value: 
    //    [ { '@search.action': 'upload',
    //        id: '3dc43e10-9d91-11e8-9787-c398b547b7b2',
    //        appName: 'Contracts',
    //        appKey: '123456',
    //        contractNo: '19AX04567R0A01',
    //        fmsRegNo: '2019000001',
    //        startDate: '07/01/2018',
    //        endDate: '06/30/2019',
    //        documentName: 'ExecutedContractCopy.pdf',
    //        category: 'Supporting',
    //        subCategory: 'Executed',
    //        tags: [] } ] }));
    // req.end();

  });

  busboy.on('finish', function () {
    console.log('finish');
    res.writeHead(200, { 'Connection': 'close' });
    res.end();
  });

  req.pipe(busboy);
});

module.exports = router;



/*
var request = require("request");

var options = { method: 'POST',
  url: 'https://docustore.search.windows.net/indexes/docs/docs/index',
  qs: { 'api-version': '2017-11-11' },
  headers: 
   { 'postman-token': '37ed7622-cc01-7f5e-b8fb-55c5deed1c8d',
     'cache-control': 'no-cache',
     'api-key': 'CB4664734B38E6542A1306216AC8D929',
     'content-type': 'application/json' },
  body: 
   { value: 
      [ { '@search.action': 'upload',
          id: '3dc43e10-9d91-11e8-9787-c398b547b7b2',
          appName: 'Contracts',
          appKey: '123456',
          contractNo: '19AX04567R0A01',
          fmsRegNo: '2019000001',
          startDate: '07/01/2018',
          endDate: '06/30/2019',
          documentName: 'ExecutedContractCopy.pdf',
          category: 'Supporting',
          subCategory: 'Executed',
          tags: [] } ] },
  json: true };

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});
*/
