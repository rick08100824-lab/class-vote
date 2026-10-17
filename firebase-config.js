// Firebase 前端設定（公開網頁用，可公開；真正的保護在 firestore.rules）
export const firebaseConfig = {
  apiKey: "AIzaSyAJhqsn04vvGpUsL5fGbubDpSxeOoagckg",
  authDomain: "my-teaching-tools-7cc8a.firebaseapp.com",
  projectId: "my-teaching-tools-7cc8a",
  storageBucket: "my-teaching-tools-7cc8a.firebasestorage.app",
  messagingSenderId: "380614302106",
  appId: "1:380614302106:web:b167205fe6b7fde3b34223"
};

// 目前進行的投票（單一文件，最簡單也最省讀取）
export const POLL_COLLECTION = "polls";
export const POLL_DOC = "current";

// 教師碼（僅擋誤觸，不是真正的安全機制；真正的權限要用 Firebase Auth）
export const TEACHER_CODE = "2468";

// Firebase JS SDK 版本（需與 HTML 內的 import 路徑一致）
export const SDK_VERSION = "13.0.0";
