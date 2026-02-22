import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "여기에_키",
  authDomain: "여기에",
  projectId: "여기에",
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
