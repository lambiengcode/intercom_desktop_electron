firebase.initializeApp(config);
const ref = firebase.storage().ref();
const db = firebase.firestore();
var database = firebase.database().ref();
var yourVideo = document.getElementById("yourVideo");
var friendsVideo = document.getElementById("friendsVideo");
var yourId = Math.floor(Math.random() * 1000000000);
var ranListenId = makeId(30);
var state = "Call";
var snap;
var file;
var image;
var users = [];
var idUser = "";
var servers = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};
var pc = new RTCPeerConnection(servers);
var count = 0;
pc.onicecandidate = (event) =>
  event.candidate
    ? sendMessage(yourId, JSON.stringify({ ice: event.candidate }))
    : console.log("Sent All Ice");
pc.onaddstream = (event) => (friendsVideo.srcObject = event.stream);

document.querySelector("#ShowButton").innerHTML = "Gọi";

const listenChange = db
  .collection("requests")
  .where("id", "==", ranListenId)
  .onSnapshot((querySnapshot) => {
    querySnapshot.docChanges().forEach((snapshot) => {
      snap = snapshot;
      if (snapshot.doc.data().request == true) {
        state = "Connecting";
        document.querySelector("#ShowButton").innerHTML = "Hủy Cuộc Gọi";
      } else if (snapshot.doc.data().completed == false) {
        state = "Disconnect";
        document.querySelector("#ShowButton").innerHTML = "Dừng Cuộc Gọi";
      } else {
        state = "Call";
        window.location.reload();
      }
    });
  });

const getUser = db
  .collection("users")
  .where("id", "!=", "FnAWubAdtFgYwGIML23oRAtp5u93")
  .get()
  .then((snapshot) => {
    snapshot.docs.forEach((doc) => {
      let items = doc.data();

      users.push(items);
    });
    showUser();
  });

function showUser() {
  users.forEach((user) => {
    var ul = document.querySelector("ul");
    var li = document.createElement("li");
    var img = document.createElement("img");
    var h5 = document.createElement("h5");
    var p = document.createElement("p");
    var a1 = document.createElement("a");
    var a2 = document.createElement("a");
    var i = document.createElement("i");
    var id = document.createElement("p");

    li.className = "collection-item avatar";
    li.id = "userItem";
    img.className = "circle";
    h5.className = "title";
    a2.className = "secondary-content";
    a2.id = "btn-call";
    i.className = "material-icons li-user";

    img.src =
      user.urlToImage == ""
        ? "https://avatars2.githubusercontent.com/u/60530946?s=460&u=e342f079ed3571122e21b42eedd0ae251a9d91ce&v=4"
        : user.urlToImage;
    //console.log(img.src);
    h5.textContent = user.username;
    p.textContent = "Phòng : ";
    a1.textContent = user.dept;
    i.textContent = "phone";
    a2.href = "#";
    i.id = "call-video";

    i.onclick = () => (idUser = user.id);

    a2.appendChild(i);
    p.appendChild(a1);
    li.appendChild(img);
    li.appendChild(h5);
    li.appendChild(p);
    li.appendChild(a2);
    li.appendChild(id);

    ul.appendChild(li);
  });
}

function sendMessage(senderId, data) {
  var msg = database.push({ sender: senderId, message: data });
  count++;
  msg.remove();
  if (count == 1) {
    addDataToFirestore(data);
  }
}

async function addDataToFirestore(data) {
  const name = +new Date() + "-" + file.name;
  const task = ref.child("Photos").child(name).put(file);
  task
    .then((snapshot) => snapshot.ref.getDownloadURL())
    .then(async (url) => {
      const res = await db.collection("requests").add({
        idSend: "FnAWubAdtFgYwGIML23oRAtp5u93",
        receiveID: idUser,
        completed: false,
        request: true,
        publishAt: firebase.firestore.FieldValue.serverTimestamp(),
        responcedTime: firebase.firestore.FieldValue.serverTimestamp(),
        urlToImage: url,
        filePath: "",
        responce: "",
        sdp: data,
        id: ranListenId,
      });
    })
    .catch(console.error);
}
function readMessage(data) {
  var msg = JSON.parse(data.val().message);
  var sender = data.val().sender;
  if (sender != yourId) {
    if (msg.ice != undefined) {
      pc.addIceCandidate(new RTCIceCandidate(msg.ice));
    } else if (msg.sdp.type == "offer") {
      var r = confirm("Answer call?");
      if (r == true) {
        pc.setRemoteDescription(new RTCSessionDescription(msg.sdp))
          .then(() => pc.createAnswer())
          .then((answer) => pc.setLocalDescription(answer))
          .then(() =>
            sendMessage(yourId, JSON.stringify({ sdp: pc.localDescription }))
          );
      } else {
        alert("Rejected the call");
      }
    } else if (msg.sdp.type == "answer") {
      msg.sdp.sdp = msg.sdp.sdp.replace(
        "useinbandfec=1",
        "useinbandfec=1; stereo=1; maxaveragebitrate=2000"
      );
      pc.setRemoteDescription(new RTCSessionDescription(msg.sdp));
    }
  }
}
database.on("child_added", readMessage);
function showMyFace() {
  navigator.mediaDevices
    .getUserMedia({ audio: true, video: true })
    .then((stream) => (yourVideo.srcObject = stream))
    .then((stream) => pc.addStream(stream));
}
function showFriendsFace() {
  console.log(idUser);
  if (idUser != "") {
    if (state == "Call") {
      if (file != null || file == "") {
        pc.createOffer()
          .then((offer) => {
            console.log(offer.sdp);
            offer.sdp = offer.sdp.replace(
              "useinbandfec=1",
              "useinbandfec=1; stereo=1; maxaveragebitrate=2000"
            );
            pc.setLocalDescription(offer);
          })
          .then(() => {
            sendMessage(yourId, JSON.stringify({ sdp: pc.localDescription }));
          });
      } else {
        alert("Chọn hình!");
      }
    } else if (state == "Connecting") {
      snap.doc.ref.update({
        request: false,
        completed: true,
        responce: "Missing",
      });
    } else if (state == "Disconnect") {
      snap.doc.ref.update({
        request: false,
        completed: true,
        responce: "Not Responding",
      });
    } else {
    }
  } else {
    alert("Chọn người nhận cuộc gọi!");
  }
}

function makeId(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function capture() {
  var canvas = document.getElementById("canvas");
  var video = document.getElementById("yourVideo");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas
    .getContext("2d")
    .drawImage(video, 0, 0, video.videoWidth, video.videoHeight); // for drawing the video element on the canvas

  if (canvas.getContext) {
    var mySrc = canvas.toDataURL("image/png");
    file = dataURLtoFile(mySrc, "filename.png");
  }
}

function processBase64Image(dataString) {
  var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
    response = {};

  if (matches.length !== 3) {
    return new Error("Invalid input string");
  }

  response.type = matches[1];
  response.data = new Buffer(matches[2], "base64");

  return response;
}

function offCamera() {
  navigator.mediaDevices
    .getUserMedia({ audio: true, video: true })
    .then((stream) => (yourVideo.srcObject = stream))
    .then((stream) => {
      stream.getAudioTracks()[0].stop()
      stream.getVideoTracks()[0].stop();
      stream.stop();
    });
}

document.getElementById("capture").addEventListener("click", capture);

function dataURLtoFile(dataurl, filename) {
  var arr = dataurl.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

function readURL(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    var image = new Image();

    reader.onload = function (e) {
      image.src = e.target.result;
      console.log(image.src);

      var canvas = document.getElementById("canvas");
      var context = canvas.getContext("2d");
      context.clearRect(0, 0, canvas.width, canvas.height);
      canvas
        .getContext("2d")
        .drawImage(image, 0, 0, canvas.width, canvas.height);

      image.onload = function () {
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
      };
    };

    reader.readAsDataURL(input.files[0]);

    file = input.files[0];
    console.log(file);
  }
}

console.log(idUser);
