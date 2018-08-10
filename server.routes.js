const express = require('express');
const router = express.Router();
const Busboy = require('busboy');
const inspect = require('util').inspect;

/* GET api listing. */
router.get('/', (req, res) => {
  console.log('api check')
  res.status(200).json({ message: 'api works!!' });
});

router.post('/upload', (req, res) => {
  var busboy = new Busboy({ headers: req.headers });

  busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
    console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);
    file.on('data', function (data) {
      console.log('File [' + fieldname + '] got ' + data.length + ' bytes');
    });
    file.on('end', function () {
      console.log('File [' + fieldname + '] Finished');
    });
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