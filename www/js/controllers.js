angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {
  $scope.socket = new WebSocket("ws://192.168.1.18:8080/");
  text = $(".result");

  $scope.socket.onopen = function(e) {
    console.log('server connect');
  }

  $scope.socket.onclose = function(e) {
    console.log('server close');
  }

  $scope.socket.onerror = function(e) {
    console.log('occured error');
  }

  $scope.socket.onmessage = function(e) {
      var result = e.data;
      console.log(e.data)
      text.val(result);
  }


  function getVideoSources(callback) {
    if (!navigator.mediaDevices) {
      console.log("MediaStreamTrack");
      MediaStreamTrack.getSources(function(cams) {
        cams.forEach(function(c, i, a) {
          if (c.kind != 'video') return;
          callback({
            name: c.facing,
            id: c.id
          });
        });
      });
    } else {
      navigator.mediaDevices.enumerateDevices().then(function(cams) {
        cams.forEach(function(c, i, a) {
          console.log("mediaDevices", c);
          if (c.kind != 'videoinput') return;
          callback({
            name: c.label,
            id: c.deviceId
          });
        });
      });
    }
  }


    var video = document.querySelector('video');
    var canvas = document.querySelector('canvas');
    var ctx = canvas.getContext('2d');
    var localMediaStream = null;
    var control = document.getElementById("buttons");



    //カメラ画像キャプチャ
    snapshot = function() {
      if (localMediaStream) {
        ctx.drawImage(video, 0, 0);
        image = canvas.toDataURL('image/jpeg');
        base64 = image.split(',')[1];
        $scope.socket.send(base64);
        //console.log(base64)
      }
    }




    getVideoSources(function(cam) {
      console.log("cam", cam);
      var b = document.createElement("input");
      b.type = "button";
      b.value = 'button';
      b.onclick = getMain(cam.id);
      control.appendChild(b);
    });

    function getMain(cam_id) {
      return function() {
        main(cam_id);
      };
    }

    function main(cam_id) {
      navigator.getUserMedia({
        video: {
          optional: [
            { sourceId: cam_id}
          ]
        }
      }, function(stream) { // success
        localMediaStream = stream;
        video.src = window.URL.createObjectURL(stream);
      }, function(e) { // error
      });
    };


    setInterval('snapshot()', 1000);



})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
