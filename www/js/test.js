    var video = document.getElementById("myVideo");
    var control = document.getElementById("buttons");

    getVideoSources(function(cam) {
      console.log("cam", cam);
      var b = document.createElement("input");
      b.type = "button";
      b.value = cam.name;
      b.onclick = getMain(cam.id);
      control.appendChild(b);
      console.log('add button');
    });

    function getMain(cam_id) {
      return function() {
        main(cam_id);
      };
    }

    function main(cam_id) {
      navigator.getUserMedia({
        audio: false,
        video: {
          optional: [
            { sourceId: cam_id}
          ]
        }
      }, function(stream) { // success
        console.log("Start Video", stream);
        localStream = stream;
        video.src = window.URL.createObjectURL(stream);
      }, onFailSoHard);
    };
