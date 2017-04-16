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


    var video = document.querySelector('video');
    var canvas = document.querySelector('canvas');
    var ctx = canvas.getContext('2d');
    var localMediaStream = null;

    //カメラ使えるかチェック
    var hasGetUserMedia = function() {
      return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia || navigator.msGetUserMedia);
    }
    //エラー
    var onFailSoHard = function(e) {
      console.log('エラー!', e);
    };

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

    if (hasGetUserMedia()) {
      console.log("カメラ OK");
    } else {
      alert("未対応ブラウザです。");
    }


    window.URL = window.URL || window.webkitURL;
    navigator.getUserMedia  = navigator.getUserMedia || navigator.webkitGetUserMedia ||
                  navigator.mozGetUserMedia || navigator.msGetUserMedia;

    navigator.getUserMedia({video: true}, function(stream) {
      video.src = window.URL.createObjectURL(stream);
      localMediaStream = stream;
    }, onFailSoHard);

    //setInterval('snapshot()', 1000);


  $scope.hello = function(){
    alert( "world" );
    navigator.camera.getPicture(onSuccess, onFail, { quality: 25,
        destinationType: Camera.DestinationType.DATA_URL
    });

    function onSuccess(imageData) {
        $scope.socket.send(imageData);
    }

    function onFail(message) {
        alert('Failed because: ' + message);
    }
  };
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
