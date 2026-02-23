import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "네키",
  authDomain: "네auth",
  projectId: "네project",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/* 글 등록 */
async function submitPost() {
  const title = document.getElementById("title").value;
  const content = document.getElementById("content").value;

  await addDoc(collection(db, "posts"), {
    title,
    content,
    created: Date.now()
  });

  alert("등록 완료");
  location.href = "index.html";
}

/* 글 목록 */
async function loadPosts() {
  const querySnapshot = await getDocs(collection(db, "posts"));
  const list = document.getElementById("postList");
  if (!list) return;

  list.innerHTML = "";

  querySnapshot.forEach((docSnap) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <a href="view.html?id=${docSnap.id}">
        ${docSnap.data().title}
      </a>
      <button onclick="deletePost('${docSnap.id}')">삭제</button>
    `;
    list.appendChild(li);
  });
}

/* 글 상세 */
async function loadPostDetail() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  if (!id) return;

  const docRef = doc(db, "posts", id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    document.getElementById("postTitle").textContent = docSnap.data().title;
    document.getElementById("postContent").textContent = docSnap.data().content;
    loadComments(id);
  }
}

/* 글 삭제 */
async function deletePost(id) {
  if (!confirm("정말 삭제할까요?")) return;

  await deleteDoc(doc(db, "posts", id));
  alert("삭제 완료");
  location.reload();
}

/* 댓글 불러오기 */
async function loadComments(postId) {
  const querySnapshot = await getDocs(collection(db, "posts", postId, "comments"));
  const list = document.getElementById("commentList");
  if (!list) return;

  list.innerHTML = "";

  querySnapshot.forEach((docSnap) => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${docSnap.data().text}
      <button onclick="deleteComment('${postId}','${docSnap.id}')">삭제</button>
    `;
    list.appendChild(li);
  });
}

/* 댓글 추가 */
async function addComment() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const text = document.getElementById("commentInput").value;

  await addDoc(collection(db, "posts", id, "comments"), {
    text,
    created: Date.now()
  });

  alert("댓글 등록");
  location.reload();
}

/* 댓글 삭제 */
async function deleteComment(postId, commentId) {
  if (!confirm("댓글 삭제할까요?")) return;

  await deleteDoc(doc(db, "posts", postId, "comments", commentId));
  alert("삭제 완료");
  location.reload();
}

loadPosts();
loadPostDetail();

window.submitPost = submitPost;
window.addComment = addComment;
window.deletePost = deletePost;
window.deleteComment = deleteComment;
