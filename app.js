import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBmUOvHROXYi9SXDaKTke33IKQcRYJ8b2c",
  authDomain: "memo-site-2fb45.firebaseapp.com",
  projectId: "memo-site-2fb45",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function addMemo() {
  const input = document.getElementById("memoInput");
  await addDoc(collection(db, "memos"), {
    text: input.value,
    created: Date.now()
  });
  input.value = "";
  loadMemos();
}

async function loadMemos() {
  const querySnapshot = await getDocs(collection(db, "memos"));
  const list = document.getElementById("memoList");
  list.innerHTML = "";
  querySnapshot.forEach((doc) => {
    const li = document.createElement("li");
    li.textContent = doc.data().text;
    list.appendChild(li);
  });
}

loadMemos();
window.addMemo = addMemo;
