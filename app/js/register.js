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

function validateForm(email, psw, psw_repeat, phone, dept) {
  if (
    email.length == 0 ||
    psw.toString().length < 6 ||
    phone.length == 0 ||
    dept.length == 0
  ) {
    alert(
      "Nhập thông tin không hợp lệ! Email phải có @, Mật khẩu phải có ít nhất 6 kí tự."
    );
    return false;
  } else if (psw != psw_repeat) {
    alert("Mật khẩu không khớp!");
    return false;
  }

  return true;
}

async function register() {
  var email = document.getElementById("email").value;
  var psw = document.getElementById("psw").value;
  var psw_repeat = document.getElementById("psw-repeat").value;
  var phone = document.getElementById("phone").value;
  var dept = document.getElementById("dept").value;

  if (validateForm(email, psw, psw_repeat, phone, dept)) {
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, psw)
      .then(async (user) => {
        const res = await db.collection("users").add({
          id: user.user.uid,
          email: email,
          dept: dept,
          key: "VINH",
          token: "",
          notifications: true,
          urlToImage:
            "https://avatars2.githubusercontent.com/u/60530946?s=460&u=e342f079ed3571122e21b42eedd0ae251a9d91ce&v=4",
          username: email.substring(0, email.length - 10),
          phone: phone,
        });

        alert("Đăng kí thành công!");
        window.location.reload();
      })
      .catch((error) => {
        alert(error.message);
      });
  }
}
