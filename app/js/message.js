var config = {
  apiKey: "AIzaSyB9-0fSDE7L9161oTksup63Ugy4vHUfMb4",
  authDomain: "project-message-65c25.firebaseapp.com",
  databaseURL: "https://project-message-65c25.firebaseio.com",
  projectId: "project-message-65c25",
  storageBucket: "project-message-65c25.appspot.com",
  messagingSenderId: "1037020081116",
  appId: "1:1037020081116:web:e25f32a41574d37b93fd19",
  measurementId: "G-94K8JYMM5E",
};
firebase.initializeApp(config);
const db = firebase.firestore();
const ref = firebase.storage().ref();

var users = [];
var file;
var selectAll = false;
var yourVideo = document.getElementById("yourVideo");
var pc = new RTCPeerConnection();

function showMyFace() {
  navigator.mediaDevices
    .getUserMedia({ audio: true, video: true })
    .then((stream) => (yourVideo.srcObject = stream))
    .then((stream) => pc.addStream(stream));
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

document.getElementById("capture").addEventListener("click", capture);
//db.settings({ timestampsInSnapshots: true});
//get user from database
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
    var label = document.createElement("label");
    var input = document.createElement("input");
    var span = document.createElement("span");
    var img = document.createElement("img");
    var h5 = document.createElement("h5");
    var p = document.createElement("p");
    var a1 = document.createElement("a");
    var a2 = document.createElement("a");

    li.className = "collection-item avatar";
    li.id = "userItem";
    img.className = "circle";
    h5.className = "title";
    a2.className = "secondary-content icon-call";
    a2.id = "btn-call";
    input.className = "filled-in list-user-item";

    label.htmlFor = user.id;
    input.type = "checkbox";
    input.id = user.id;
    label.onclick = "test()";

    input.name = "user";
    input.value = user.id;
    img.src =
      user.urlToImage == ""
        ? "https://avatars2.githubusercontent.com/u/60530946?s=460&u=e342f079ed3571122e21b42eedd0ae251a9d91ce&v=4"
        : user.urlToImage;
    h5.textContent = user.username;
    p.textContent = "Phòng : ";
    a1.textContent = user.dept;
    a2.href = "#";

    label.appendChild(input);
    label.appendChild(span);

    a2.appendChild(label);
    p.appendChild(a1);
    li.appendChild(img);
    li.appendChild(h5);
    li.appendChild(p);
    li.appendChild(a2);

    ul.appendChild(li);
  });
}
function removeDuplicates(array) {
  return array.filter((a, b) => array.indexOf(a) === b);
}

var arrCheckedUser = [];
function selectUser() {
  var checks = document.getElementsByClassName("list-user-item");
  arrCheckedUser = [];
  for (i = 0; i < users.length; i++) {
    if (checks[i].checked === true) {
      arrCheckedUser.push(checks[i].value);
    }
  }
  removeDuplicates(arrCheckedUser);
}

// Select all user
document.getElementById("select-all").onclick = function () {
  var checkboxes = document.getElementsByName("user");
  for (var checkbox of checkboxes) {
    checkbox.checked = this.checked;
  }
  checkSelectAll();
};
var _checkSelectAll = document.getElementById("select-all");
function checkSelectAll() {
  if (_checkSelectAll.checked) {
    selectAll = true;
    var current = document.getElementsByClassName("font-select-all");
    current.className = current.className.replace(" active", " unactive");
  } else {
    selectAll = false;
  }
  console.log(selectAll);
}

//Search user
function searchUser() {
  var input, filter, ul, li, a, i, txtValue;
  input = document.getElementById("search");
  filter = input.value.toUpperCase();
  ul = document.getElementById("myUL");
  li = ul.getElementsByTagName("li");
  for (i = 0; i < li.length; i++) {
    a = li[i].getElementsByTagName("a")[0];
    txtValue = a.textContent || a.innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      li[i].style.display = "";
    } else {
      li[i].style.display = "none";
    }
  }
}

async function addDataToFirestore() {
  selectUser();
  if (arrCheckedUser.length == 0 && selectAll == false) {
    alert("Chưa có người nhận!");
  } else {
    if (file == null) {
      console.log(arrCheckedUser);
      const res = await db.collection("notifications").add({
        all: selectAll,
        body: document.getElementById("note-input").value,
        key: "VINH",
        members: arrCheckedUser,
        publishAt: firebase.firestore.FieldValue.serverTimestamp(),
        title: document.getElementById("title-input").value,
        urlToImage: "",
      });

      document.getElementById("note-input").value = "";
      document.getElementById("title-input").value = "";
    } else {
      const name = +new Date() + "-" + file.name;
      const task = ref.child("Photos").child(name).put(file);
      task
        .then((snapshot) => snapshot.ref.getDownloadURL())
        .then(async (url) => {
          console.log(url);
          const res = await db.collection("notifications").add({
            all: selectAll,
            body: document.getElementById("note-input").value,
            key: "VINH",
            members: arrCheckedUser,
            publishAt: firebase.firestore.FieldValue.serverTimestamp(),
            title: document.getElementById("title-input").value,
            urlToImage: url,
          });

          document.getElementById("note-input").value = "";
          document.getElementById("title-input").value = "";
          var canvas = document.getElementById("canvas");
          const context = canvas.getContext("2d");
          context.clearRect(0, 0, canvas.width, canvas.height);
          file = null;
        })
        .catch(console.error);
    }
  }
}

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

      canvas.getContext("2d").drawImage(image, 0, 0, 300, 300);

      image.onload = function () {
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
      };
    };

    reader.readAsDataURL(input.files[0]);

    file = input.files[0];
    console.log(file);
  }
}
