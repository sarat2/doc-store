const express = require('express');
const router = express.Router();
const Busboy = require('busboy');
const inspect = require('util').inspect;
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
    console.log('Field [' + fieldname + ']: value: ' + inspect(val));
  });

  busboy.on('finish', function () {
    res.writeHead(200, { 'Connection': 'close' });
    res.end();
  });

  req.pipe(busboy);
});

module.exports = router;