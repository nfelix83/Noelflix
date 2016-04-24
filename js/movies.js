angular.module('pirateBooty.movies', [])

.controller('MoviesController', function ($scope, $window, Movies){
  $scope.searchType = 'title';
  $scope.searchParam = '';
  $scope.sessions = [];

  angular.element('#modal1').click(function(){
    angular.element('#modal1').closeModal();
  });

  $scope.init = function () {
    $scope.top();
  }

  $scope.fresh = function(){
    $('.active').removeClass('active');
    $('#fresh').addClass('active');
    $scope.movies = [];
    Movies.getNew($scope.movies);
  }

  $scope.popular = function(){
    $('.active').removeClass('active');
    $('#popular').addClass('active');
    $scope.movies = [];
    Movies.getVoted($scope.movies);
  }

  $scope.top = function(){
    $('.active').removeClass('active');
    $('#top').addClass('active');
    $scope.movies = [];
    Movies.getRated($scope.movies);
  }

  $scope.thumbsUp = function(rating){
    var thumbs = Math.round(rating);
    var ret = [];
    for(var i = 0; i < thumbs; i++){
      ret.push(i);
    }
    return ret;
  }

  $scope.thumbsDown = function(rating){
    var thumbs = 10 - Math.round(rating);
    var ret = [];
    for(var i = 0; i < thumbs; i++){
      ret.push(i);
    }
    return ret;
  }

  $scope.setToTitle = function(){
    $scope.searchType = 'title';
  }

  $scope.setToTorrent = function(){
    $scope.searchType = 'torrent';
  }

  $scope.search = function(){
    if($scope.searchType === 'torrent'){
      $window.location.href = '#/load/' + $scope.searchParam;
    } else {
      $scope.movies = [];
      Movies.search($scope.searchParam, $scope.movies);
    }
  }

  $scope.displaySessions = function(){
    socket.emit('getSessions');
    socket.on('sessions', function(sessions){
      angular.element('#modal1 .modal-content').empty();
      for(var i = 0; i < sessions.length; i++){
        $scope.sessions.push(sessions[i]);
        angular.element("<a class='waves-effect waves-light btn'>" + sessions[i].name + "</a>")
          .appendTo('#modal1 .modal-content').click(function(){

            $scope.join.call(this, angular.element(this).text());
          });
      }
      angular.element('#modal1').openModal();
    });
  }

  $scope.join = function(name){
    var session = undefined;
    for(var i = 0; i < $scope.sessions.length && session === undefined; i++){
      if($scope.sessions[i].name === name){
        session = $scope.sessions[i];
      }
    }
    var permission = true;
    if(session.password !== undefined){
      permission = prompt('Password: ') === session.password;
    }
    if(permission === false){
      Materialize.toast('ACCESS DENIED.', 4000);
    } else {
      $window.location.href = '#/session/' + session.name;
    }
  }

  $('body').css('background-color', 'white');

  $scope.init();
})

.controller('WatchController', function($compile, $interval, $scope, $stateParams, $window, Watch){
  // ss(socket).on('streaming', function(stream){
  //   console.log('HERE')
  //   console.log(stream);
  // })

  $scope.session = undefined;

  $scope.getSource = function(){
    return Watch.getSource($stateParams.title);
  }
  $scope.next = function(){
    socket.emit('getVideoArrayLength');
    socket.on('videoArrayLength', function(length){
      if($scope.getPosition() < length - 1){
        Watch.increment();
        var video = document.getElementById('playing');
        socket.emit('cleanUpStream');
        video.src = '' + $scope.getSource();
        video.play();
      } else {
        Materialize.toast('This is the last video.', 4000);
      }
    });
  }
  $scope.prev = function(){
    if($scope.getPosition() > 0){
      Watch.decrement();
      var video = document.getElementById('playing');
      socket.emit('cleanUpStream');
      video.src = '' + $scope.getSource();
      video.play();
    } else {
      Materialize.toast('This is the first video.', 4000);
    }
  }
  $scope.getPosition = function(){
    return Watch.getPosition();
  }

  $scope.create = function(){
    if($scope.session === undefined){
      var name = '';
      var password = '';
      while(name.length === 0){
        name = prompt("Enter session name: ");
      }
      password = prompt('Enter password (optional): ');

      $scope.session = {};
      $scope.session.name = name;
      if(password.length > 0){
        $scope.session.password = password;
      }
      socket.emit('createSession', $scope.session);
    } else {
      Materialize.toast('This is already a session.', 4000);
    }
  }

  $scope.$on('$destroy', function(){
    if($scope.session !== undefined){
      socket.emit('destroySession', $scope.session);
    }
    socket.emit('cleanUpStream');
  });

  socket.on('sessionCreated', function(){
    angular.element('#chatModal').openModal();
    $scope.draw();
  });

  $scope.draw = function(){
    var v = document.getElementById('playing');
    var canvas = document.getElementById('myCanvas');
    canvas.width = 640;
    canvas.height = 360;
    var context = canvas.getContext('2d');
    $interval(function(){
      context.drawImage(v,0,0,canvas.width,canvas.height);
      socket.emit('draw', canvas.toDataURL('image/jpeg',40));
    }, 30);
  }

  $('#chatForm').submit(function(){
  socket.emit('chat message', $('#m').val());
  $('#m').val('');
    return false;
  });
  socket.on('chat message', function(msg){
    $('#messages').append($('<li>').text(msg));
  });
  $('#chatModal').draggable();

  $('body').css('background-color', 'black');

  var peer = new Peer({key: 'lwjd5qra8257b9'});

  socket.on('peer-connect', function (peerID) {
    var conn = peer.connect(peerID);
    conn.on('open', function() {
      navigator.getUserMedia_ = (   navigator.getUserMedia
                           || navigator.webkitGetUserMedia
                           || navigator.mozGetUserMedia
                           || navigator.msGetUserMedia);
        navigator.getUserMedia_({audio: true}, function(stream) {
          var call = peer.call(peerID, stream);
        }, function(err) {
          console.log('Failed to get local stream' ,err);
        });
    });
  });
})

.controller('LoadController', function($stateParams, $window){
  socket.emit('generateList', $stateParams.title);
  socket.on('built', function(){
    $window.location.href = '#/watch/' + $stateParams.title;
  });
  socket.on('redirectHome', function(){
    Materialize.toast('No valid results', 4000)
    $window.location.href = '#/';
  });
})

.controller('SessionController', function($interval){
    socket.emit('sessionInit');
    var canvas = document.getElementById('c');
    canvas.width = 640;
    canvas.height = 360;
    var context = canvas.getContext('2d');
    socket.on('frame', function(frame){
      var image = new Image
      image.src = frame;
      image.onload = function(){
       context.drawImage(image,0,0)
      }
    });
    // $interval(function(){
    //   socket.emit('getFrame', function(frame){
    //   });
    // }, 20);

    $('#chatForm').submit(function(){
    socket.emit('chat message', $('#m').val());
    $('#m').val('');
      return false;
    });
    socket.on('chat message', function(msg){
      $('#messages').append($('<li>').text(msg));
    });
    $('#chatModal').draggable();
    angular.element('#chatModal').openModal();

    $('body').css('background-color', 'black');

    //
    // var source = audCtx.createBufferSource();
    // var player = audCtx.createScriptProcessor(2048, 1, 1);
    //
    // player.onaudioprocess = function (audioProcessingEvent) {
    //   var inputBuffer = audioProcessingEvent.inputBuffer;
    //   var outputBuffer = audioProcessingEvent.outputBuffer;
    //
    //   for (var channel = 0; channel < outputBuffer.numberOfChannels; channel++) {
    //     var inputData = inputBuffer.getChannelData(channel);
    //     var outputData = outputBuffer.getChannelData(channel);
    //
    //     // Loop through the 2048 samples
    //     for (var sample = 0; sample < inputBuffer.length; sample++) {
    //       // make output equal to the same as the input
    //       outputData[sample] = inputData[sample];
    //
    //       // add noise to each output sample
    //       // outputData[sample] += ((Math.random() * 2) - 1) * 0.2;
    //     }
    //   }
    // };

    var peer = new Peer({key: 'lwjd5qra8257b9'});

    peer.on('open', function (id) {
      socket.emit('peer-connect', id);
    });

    peer.on('connection', function(conn) {
      conn.on('open', function() {
        navigator.getUserMedia_ = (   navigator.getUserMedia
                             || navigator.webkitGetUserMedia
                             || navigator.mozGetUserMedia
                             || navigator.msGetUserMedia);
        peer.on('call', function(call) {
          call.answer();
          call.on('stream', function(remoteStream) {
            var audio = document.querySelector('audio');
            audio.src = window.URL.createObjectURL(remoteStream);
            audio.onloadedmetadata = function(e){
                console.log('Now playing!');
                audio.play();
            }
          });
        });
      });
    });
});
