var http = require("https");
const express = require('express');
const router = express.Router();
const Busboy = require('busboy');
const inspect = require('util').inspect;
const uuidv1 = require('uuid/v1');
const path = require('path');
const azure = require('azure-storage');
const blobService = azure.createBlobService(process.env.storageConnectionString);

/* GET api listing. */
router.get('/', (req, res) => {
  console.log('api check')
  res.status(200).json({ message: 'api works!!' });
});

router.get('/download', (req, res) => {
  var container = req.query.c.toLowerCase();
  var docPath = req.query.p;

  // var container = req.params.c.toLowerCase();
  // var docPath = req.params.p;
  
  var fileName = path.parse(docPath).base;
  console.log(container);
  console.log(docPath);
  console.log(fileName);

  blobService.getBlobProperties(container, docPath,
    function (err, properties, status) {
      if (err) {
        res.send(502, "Error fetching file: %s", err.message);
      } else if (!status.isSuccessful) {
        res.send(404, "The file %s does not exist", fileName);
      } else {
        res.header('Content-Type', properties.contentType);
        res.header('Content-Disposition', 'attachment; filename=' + fileName);
        // console.log('test')
        blobService.createReadStream(container, docPath).on('error', function(error){ console.log(error); }).pipe(res);
      }
    });
});

router.post('/upload', (req, res) => {
  var busboy = new Busboy({ headers: req.headers });
  var metadata, uploadedfile;

  var awaitMetaData = new Promise((resolve, reject) => {
    busboy.on('field', function (fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
      // console.log('Field [' + fieldname + ']: value: ' + inspect(val));
      if (fieldname === 'metadata') {
        metadata = JSON.parse(val);
        console.log('retrieved metadata');
        resolve();
      }
    });
  })


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
      let taxonomy = metadata.appKey + '/' + metadata.category + ((metadata.subCategory !== '') ? '/' + metadata.subCategory + '/' : '/') + filename;
      const blobStream = blobService.createWriteStreamToBlockBlob(metadata.appName.toLowerCase(), taxonomy,
        function (error, response) {
          if (error)
            console.log('blob upload error', error);
          else {
            console.log('blob upload complete');
            console.log(JSON.stringify(response, null, 4));

            metadata['@search.action'] = 'mergeOrUpload';
            metadata['docPath'] = taxonomy
            if (metadata.id === '') {
              metadata.id = uuidv1();
            }

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

            request.write(JSON.stringify({ value: [metadata] }));
            request.end();
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

    awaitMetaData.then(readFirstBytes);
  });

  busboy.on('finish', function () {
    console.log('finish');
    res.writeHead(200, { 'Connection': 'close' });
    res.end();
  });

  req.pipe(busboy);
});

module.exports = router;