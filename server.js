var morgan = require('morgan');
var Promise = require('bluebird');
var kickass = Promise.promisify(require('kickass-torrent'));
var torrentStream = require('torrent-stream');

var express = require('express');
var app = express();

var port = process.env.PORT || 3000;
var trackers = ['http://9.rarbg.com:2710/announce',
         'http://announce.torrentsmd.com:6969/announce',
         'http://bt.careland.com.cn:6969/announce',
         'http://explodie.org:6969/announce',
         'http://mgtracker.org:2710/announce',
         'http://tracker.best-torrents.net:6969/announce',
         'http://tracker.tfile.me/announce',
         'http://tracker.torrenty.org:6969/announce',
         'http://tracker1.wasabii.com.tw:6969/announce',
         'udp://9.rarbg.com:2710/announce',
         'udp://9.rarbg.me:2710/announce',
         'udp://coppersurfer.tk:6969/announce',
         'udp://exodus.desync.com:6969/announce',
         'udp://open.demonii.com:1337/announce',
         'udp://tracker.btzoo.eu:80/announce',
         'udp://tracker.istole.it:80/announce',
         'udp://tracker.openbittorrent.com:80/announce',
         'udp://tracker.prq.to/announce',
         'udp://tracker.publicbt.com:80/announce'];

app.use('/', express.static(__dirname + '/'));
app.use(morgan('dev'));

app.get('/', function(req, res){
});

app.get('/search/:searchParam', function(req, res){
  console.log('RANGE: ' + req.headers.range);
  var queryParams = {
    q: req.params.searchParam,
    field: 'seeders'
  }
  kickass(queryParams)
  .then(function(results){
    var filteredResults = [];
    for(var i = 0; i < results.list.length; i++){
      if((results.list[i].title.indexOf('264') !== -1 ||
          results.list[i].title.indexOf('mp4') !== -1 ||
          results.list[i].title.indexOf('webm') !== -1 ||
          results.list[i].title.indexOf('ogg') !== -1) &&
          results.list[i].size < 1200000000) {
        filteredResults.push(results.list[i].hash);
      }
    }
    var engine = torrentStream('magnet:?xt=urn:btih:' + filteredResults[0],
                               {connections: 10000,
                                uploads: 0,
                                trackers: trackers});
    engine.on('ready', function(){
      var fileToStream = undefined;
      var maxLength = 0;
      engine.files.forEach(function(file){
        if(file.length > maxLength){
          maxLength = file.length;
          fileToStream = file;
        }
      });
      var type = 'mp4';
      if(fileToStream.name.indexOf('.264') !== -1){ type = 'mp4'}
      if(fileToStream.name.indexOf('.mp4') !== -1){ type = 'mp4'}
      if(fileToStream.name.indexOf('.webm') !== -1){ type = 'webm'}
      if(fileToStream.name.indexOf('.ogg') !== -1){ type = 'ogg'}
      console.log(fileToStream.name, ' : ', type);
      var total = fileToStream.length;

      if(typeof req.headers.range != 'undefined') {
          var range = req.headers.range;
          var parts = range.replace(/bytes=/, "").split("-");
          var partialstart = parts[0];
          var partialend = parts[1];
          var start = parseInt(partialstart, 10);
          var end = partialend ? parseInt(partialend, 10) : total - 1;
      } else {
          var start = 0;
          var end = total;
      }
      var chunksize = (end - start) + 1;
      var stream = fileToStream.createReadStream({start: start, end: end});
      res.writeHead(206, { 'Content-Range': 'bytes ' + start + '-' + end + '/' + total,
                           'Accept-Ranges': 'bytes',
                           'Content-Length': chunksize,
                           'Content-Type': 'video/' + type });
      stream.pipe(res);
    });
  });
});

app.listen(port);