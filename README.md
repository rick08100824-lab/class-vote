# 🗳️ 課堂投票工具（即時版）

用 Firebase Firestore 做的課堂即時投票。老師出題 → 學生手機投票 → 投影畫面即時顯示長條圖。

- 建立日期：2026-10-17
- Firebase 專案：`my-teaching-tools-7cc8a`
- Firestore 文件：`polls/current`（單一文件，最省讀取）
- 本機測試：`python -m http.server 8767` → http://localhost:8767/admin.html

---

## 三個頁面

| 檔案 | 誰用 | 功能 |
|------|------|------|
| `admin.html` | **老師**（筆電） | 出題、設定 2～6 個選項、開啟/結束投票、重設票數、顯示學生 QR code |
| `index.html` | **學生**（手機） | 看題目、點選項投票（同一台裝置只能投一次）、看即時票數 |
| `display.html` | **老師**（投影機） | 即時長條圖、票數、百分比、目前領先、全螢幕 |

教師碼預設 **`2468`**（在 `firebase-config.js` 的 `TEACHER_CODE` 修改）。

---

## 資料結構

```json
// polls/current
{
  "question": "你最喜歡哪一種形狀？",
  "options": [ { "id": "a", "text": "三角形" }, { "id": "b", "text": "圓形" } ],
  "counts":  { "a": 2, "b": 1 },
  "open": true,
  "showLive": true,
  "round": 1792228601534
}
```

- 投票時只做一次原子累加：`updateDoc(ref, { "counts.a": increment(1) })`，不會有兩人同時投票蓋掉票數的問題
- `round` 是「這一輪」的編號：換題目或重設票數時會更新，學生端據此忘記上一次的選擇
- **不記名**：只存票數，不存姓名或座號

---

## 課堂使用流程

1. 打開 `admin.html`，輸入教師碼
2. 輸入題目、選項 → 按「建立新投票（會清除票數）」
3. 投影 `display.html`（建議按全螢幕）
4. 學生掃 `admin.html` 上的 QR code 進入投票頁
5. 邊投邊看長條圖即時長高 → 按「結束投票」鎖住結果

---

## 常用指令（對 AI 說即可）

| 你說的話 | 會做的事 |
|----------|----------|
| 「幫我開一個新的投票，題目是…選項是…」 | 直接寫入 Firestore，不用開 admin 頁 |
| 「結束投票 / 開放投票」 | 切換 `open` |
| 「把票數歸零」 | 重設 `counts`，並更新 `round` |
| 「這次投票結果如何」 | 查 Firestore 統計（走 `firestore_list_documents`）|
| 「把投票工具推上 GitHub Pages」 | 建立 repo、推送、開 Pages、產生 QR |

---

## 安全性提醒

- `polls` 目前規則是 `allow read, write: if true`（**課堂 demo 用**）
- `admin.html` 的教師碼是**前端檢查，不是真安全機制**（可被繞過）
- 要真正防護（不讓學生亂改題目）需要加入 Firebase Authentication 或改用 Cloud Functions
- 課堂內部使用（不公開流傳網址）沒問題

---

## 已知問題

- `firestore_query_collection`（Firebase MCP 工具）在 firebase-tools 15.34.0 有 bug，會回
  `The requested 'read_time' cannot be in the future.` → 改用 `firestore_list_documents`
- 剛部署完 Firestore 規則的頭幾十秒，瀏覽器可能出現 `permission-denied`；
  因為 snapshot listener 被拒後不會自動重試，**重新整理頁面**即可
