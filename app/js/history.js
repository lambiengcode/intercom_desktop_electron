//set to input value is today
function getDate() {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1; //January is 0!
  var yyyy = today.getFullYear();

  if (dd < 10) {
    dd = "0" + dd;
  }

  if (mm < 10) {
    mm = "0" + mm;
  }

  today = yyyy + "-" + mm + "-" + dd;
  console.log(today);
  document.getElementById("end").value = today;
}

window.onload = function () {
  getDate();
};

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

//db.settings({ timestampsInSnapshots: true});
//get user from database
const getUser = db
  .collection("requests")
  .orderBy("responcedTime", "desc")
  .get()
  .then((snapshot) => {
    snapshot.docs.forEach((doc) => {
      let items = doc.data();

      db.collection("users")
        .where("id", "==", items.receiveID)
        .get()
        .then((snap) => {
          snap.docs.forEach((element) => {
            var username = element.data().username;
            var urlOfUser = element.data().urlToImage;
            var ul = document.querySelector("ul");
            var li = document.createElement("li");
            var img = document.createElement("img");
            var h5 = document.createElement("h5");
            var p = document.createElement("p");
            var p1 = document.createElement("p");
            var p2 = document.createElement("p");
            var a1 = document.createElement("a");
            var a12 = document.createElement("a");
            var a13 = document.createElement("a");
            var imgSend = document.createElement("img");
            var publishAt = items.publishAt.toDate();
            var responceTime = items.responcedTime.toDate();

            const options = {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            };
            li.className = "collection-item avatar";
            li.id = "userItem";
            img.className = "circle";
            h5.className = "title";
            imgSend.className = "imageSend secondary-content";
            imgSend.id = "myImg";
            imgSend.src = items.urlToImage;

            img.src = urlOfUser;

            //console.log(img.src);
            h5.textContent = username;
            p.textContent = "Trạng thái: ";
            p1.textContent = "Thời gian trả lời: ";
            p2.textContent = "Thời gian bắt đầu gọi: ";
            a1.textContent = items.responce;
            a12.textContent =
              responceTime.toLocaleDateString("vi-VN", options) +
              " ----  " +
              checkValid(responceTime.getHours()) +
              ":" +
              checkValid(responceTime.getMinutes()) +
              ":" +
              checkValid(responceTime.getSeconds());
            a13.textContent =
              publishAt.toLocaleDateString("vi-VN", options) +
              " ---- " +
              checkValid(publishAt.getHours()) +
              ":" +
              checkValid(publishAt.getMinutes()) +
              ":" +
              checkValid(publishAt.getSeconds());

            p.appendChild(a1);
            p1.appendChild(a12);
            p2.appendChild(a13);
            li.appendChild(img);
            li.appendChild(h5);
            li.appendChild(p);
            li.appendChild(p1);
            li.appendChild(p2);
            li.appendChild(imgSend);

            ul.appendChild(li);
          });
        });
    });
  });

function checkValid(input) {
  if (input < 10) {
    return "0" + input.toString();
  } else {
    return input;
  }
}

//Dropdown filter
var x, i, j, l, ll, selElmnt, a, b, c;
/* Look for any elements with the class "custom-select": */
x = document.getElementsByClassName("custom-select");
l = x.length;
for (i = 0; i < l; i++) {
  selElmnt = x[i].getElementsByTagName("select")[0];
  ll = selElmnt.length;
  /* For each element, create a new DIV that will act as the selected item: */
  a = document.createElement("DIV");
  a.setAttribute("class", "select-selected");
  a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
  x[i].appendChild(a);
  /* For each element, create a new DIV that will contain the option list: */
  b = document.createElement("DIV");
  b.setAttribute("class", "select-items select-hide");
  for (j = 1; j < ll; j++) {
    /* For each option in the original select element,
        create a new DIV that will act as an option item: */
    c = document.createElement("DIV");
    c.innerHTML = selElmnt.options[j].innerHTML;
    c.addEventListener("click", function (e) {
      /* When an item is clicked, update the original select box,
            and the selected item: */
      var y, i, k, s, h, sl, yl;
      s = this.parentNode.parentNode.getElementsByTagName("select")[0];
      sl = s.length;
      h = this.parentNode.previousSibling;
      for (i = 0; i < sl; i++) {
        if (s.options[i].innerHTML == this.innerHTML) {
          s.selectedIndex = i;
          h.innerHTML = this.innerHTML;
          y = this.parentNode.getElementsByClassName("same-as-selected");
          yl = y.length;
          for (k = 0; k < yl; k++) {
            y[k].removeAttribute("class");
          }
          this.setAttribute("class", "same-as-selected");
          break;
        }
      }
      h.click();
    });
    b.appendChild(c);
  }
  x[i].appendChild(b);
  a.addEventListener("click", function (e) {
    /* When the select box is clicked, close any other select boxes,
        and open/close the current select box: */
    e.stopPropagation();
    closeAllSelect(this);
    this.nextSibling.classList.toggle("select-hide");
    this.classList.toggle("select-arrow-active");
  });
}

function closeAllSelect(elmnt) {
  /* A function that will close all select boxes in the document,
    except the current select box: */
  var x,
    y,
    i,
    xl,
    yl,
    arrNo = [];
  x = document.getElementsByClassName("select-items");
  y = document.getElementsByClassName("select-selected");
  xl = x.length;
  yl = y.length;
  for (i = 0; i < yl; i++) {
    if (elmnt == y[i]) {
      arrNo.push(i);
    } else {
      y[i].classList.remove("select-arrow-active");
    }
  }
  for (i = 0; i < xl; i++) {
    if (arrNo.indexOf(i)) {
      x[i].classList.add("select-hide");
    }
  }
}

/* If the user clicks anywhere outside the select box,
then close all select boxes: */
document.addEventListener("click", closeAllSelect);
////////////////////////////////
//click zoom img
// Get the modal
var modal = document.getElementById("myModal");

// Get the image and insert it inside the modal - use its "alt" text as a caption
var img = document.getElementById("myImg");
var modalImg = document.getElementById("img01");
var captionText = document.getElementById("caption");

if (img) {
  img.addEventListener("click", addSrc, false);
}
function addSrc() {
  modal.style.display = "block";
  modalImg.src = this.src;
  captionText.innerHTML = this.alt;
}

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
  modal.style.display = "none";
};
//filter
var dayFrom, dayTo, state;
var yourSelect = document.getElementById("filterByState");
function getFilter() {
  dayFrom = new Date(document.getElementById("start").value);
  dayTo = document.getElementById("end").value;
  state = yourSelect.options[yourSelect.selectedIndex].value;

  console.log(dayFrom);
  console.log(dayTo);
  console.log(typeof dayFrom);
  console.log(state);
  filterByState(state);
}
//filter by state

function filterByState(state) {
  filter = state.toUpperCase();
  ul = document.getElementById("myUL");
  li = ul.getElementsByTagName("li");
  for (i = 0; i < li.length; i++) {
    a = li[i].getElementsByTagName("a")[0];
    response = a.textContent || a.innerText;
    if (response.toUpperCase().indexOf(filter) > -1) {
      li[i].style.display = "";
    } else {
      li[i].style.display = "none";
    }
  }
}
//filter by date

function filterByDate(dayFrom, dayTo) {
  filter = state.toUpperCase();
  ul = document.getElementById("myUL");
  li = ul.getElementsByTagName("li");
  for (i = 0; i < li.length; i++) {
    a = li[i].getElementsByTagName("a")[0];
    response = a.textContent || a.innerText;
    if (response.toUpperCase().indexOf(filter) > -1) {
      li[i].style.display = "";
    } else {
      li[i].style.display = "none";
    }
  }
}
