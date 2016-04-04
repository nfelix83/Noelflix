var morgan = require('morgan');
var Promise = require('bluebird');
var kickass = Promise.promisify(require('kickass-torrent'));
var torrentStream = require('torrent-stream');
var mongoose = require('mongoose');
var EventEmitter = require('events');

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

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

var myEvents = new EventEmitter();

var filteredResults = [];

var builtFlag;

var globalStream;
var globalHeaders;

var generateList = function(param){

  var validResults = true;
  builtFlag = false;

  filteredResults = [];

  for(var i = 0; i < 1 && validResults; i++){
    var queryParams = {
      q: param,
      field: 'seeders',
      page: i + 1
    }
    kickass(queryParams)
    .then(function(results){
      if(results.list.length === 0){
        validResults = false;
      }
      for(var i = 0; i < results.list.length; i++){
        if((results.list[i].title.indexOf('264') !== -1 ||
            results.list[i].title.indexOf('265') !== -1 ||
            results.list[i].title.indexOf('mp4') !== -1 ||
            results.list[i].title.indexOf('webm') !== -1 ||
            results.list[i].title.indexOf('ogg') !== -1) &&
            results.list[i].size < 1300000000) {
          if(results.list[i].seeds > 4){
            filteredResults.push(results.list[i].hash);
            if(filteredResults.length > 0 && builtFlag === false){
              myEvents.emit('built');
              builtFlag = true;
            }
          } else {
            validResults = false;
          break;
          }
        }
      }
    });
  }
};

app.get('/watch/:position/:searchParam', function(req, res){
  var engine = torrentStream('magnet:?xt=urn:btih:' + filteredResults[req.params.position],
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
    globalHeaders = { 'Content-Range': 'bytes ' + start + '-' + end + '/' + total,
                         'Accept-Ranges': 'bytes',
                         'Content-Length': chunksize,
                         'Content-Type': 'video/' + type };
    res.writeHead(206, globalHeaders);
    globalStream = stream;
    myEvents.emit('streamReady');
    stream.pipe(res);
    myEvents.on('cleanUpStream', function(){
      engine.remove(function(){
        engine.destroy(function(){
          console.log('Engine destroyed');
          //OPTIONAL CLEANUP
        });
      });
    });
  });
});

// var currentFrame;

io.on('connection', function(socket){
  console.log('Socket to me.');

  myEvents.on('built', function(){
    socket.emit('built');
  });

  socket.on('generateList', function(param){
    generateList(param);
  });

  socket.on('getVideoArrayLength', function(){
    socket.emit('videoArrayLength', filteredResults.length);
  });

  socket.on('createSession', function(session){
    var session = new Session(session);
    session.save();
  });

  socket.on('getSessions', function(){
    Session.find({}, function(err, results){
      socket.emit('sessions', results);
    });
  })

  socket.on('destroySession', function(session){
    Session.findOne(session, function(err, result){
      result.remove();
    });
  });

  socket.on('cleanUpStream', function(){
    myEvents.emit('cleanUpStream');
  });

  socket.on('sessionInit', function(){
    io.emit('sessionCreated');
  });

  socket.on('draw', function(v){
    io.emit('frame', v);
  });

  // socket.on('getFrame', function(){
  //   socket.emit('frame', currentFrame);
  // });

  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });

  socket.on('peer-connect', function(id) {
    io.emit('peer-connect', id);
  });

  // myEvents.on('streamReady', function(){
  //   var stream = ss.createStream();
  //   ss(socket).emit('streaming', stream);
  //   globalStream.pipe(stream);
  // });
});

mongoose.connect('mongodb://127.0.0.1:27017/pirateBooty');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(callback){
  console.log("Connected to DB");
});

var sessionSchema = mongoose.Schema({
  name: { type: String, required: true},
  password: String
});

var Session = mongoose.model('Session', sessionSchema);

http.listen(port);
