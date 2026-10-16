# 首爾，一個人剛剛好

- 建立者：豪斯的 Hermes Agent
- 版次：v2.0
- 建立日期：2026-10-10
- 修訂日期：2026-10-16（Asia/Taipei）
- 來源／目的：豪斯的首爾 2026 年 12 月五天四夜獨旅規劃；依「全站重新整理、再做兩輪優化與驗證」重建。

**固定網站：** https://houseyen.github.io/seoul-dec-2026-trip/

**固定專案：** https://github.com/HouseYen/seoul-dec-2026-trip

## 六個同頁分頁

行程總覽、地圖導航、吃買清單、飯店住宿、機票比價、待辦清單。沒有換 repo 或建立第二個正式入口。

- 兩組候選日期：2026/12/3–7、12/10–14；1 成人、TPE ⇄ ICN、五天四夜。
- 飯店目標逐晚含稅 ≤ NT$3,000，僅列正式飯店候選；指定日期房價及空房未核實。
- 機票提供兩組日期條件卡、一鍵複製與手動查價入口；外部實測舊 Google Flights 日期深連結未套用，已撤下，不假裝有預填或報價。
- 每天一條主線，加選可刪；雪具店是零售，不是滑雪場或租借。
- Google Maps 每段獨立起終點、步行／大眾運輸連結；不把多站 transit 連結當完整行程。

## 原始碼與保留舊版

`index.html`、`styles.css`、`trip-data.js`、`app.js` 是無建置、零執行期套件的靜態網站。資料來源和查核限制在網站頁尾、`docs/content-review.md`。公開資料不得放入護照、訂位碼、token、私人訂單。

舊版 v1.13 的完整 commit：`daee29813388cf15227601c8c97643c84731894e`。本機另有 `archive/v1.13-before-rebuild` 分支；原始 Git 歷史不改寫、不 force push。

## 本機驗證

需求：Node.js、已安裝 Google Chrome。測試依賴只供開發，不載入正式頁面。

```sh
npm ci
npm run check
npm test
```

測試由 Playwright 啟動綁定 `127.0.0.1:4183` 的本機 Node 伺服器並在結束後關閉，無須修改個人 Chrome 設定或 Hermes 設定。測試使用獨立臨時瀏覽器，不使用使用者 cookies。

可用 `npm run test:desktop`、`npm run test:mobile` 單獨執行。測試內 Google Maps iframe 隔離為測試頁，驗證本站狀態與 URL，不冒充已驗證 Google 導航路況。指定正式網址可以執行相同測試：

```sh
TRIP_BASE_URL=https://houseyen.github.io/seoul-dec-2026-trip/ npm test
```

部分測試會在獨立瀏覽器 localStorage 建立測試勾選，及下載／匯入本機測試 JSON；不訂票、不訂房、不對外發訊息。

## 本機資料與備份

- 沿用 `seoul-trip-todos-v1` 與原 10 個 ID，避免升級清空進度。
- `seoul-trip-preferences-v2` 僅存日期、住宿區與雪具偏好。
- 資料只在同裝置／同瀏覽器；沒有雲端同步。
- 匯出 JSON 供手動跨裝置保存，匯入須格式驗證與使用者確認；最大 64 KB。
- 儲存被拒或損毀時顯示警告；不宣稱已保存，也不在載入時默默覆寫原資料。

## 兩輪重整記錄

- [實作範圍與計畫](docs/rebuild-plan.md)
- [資料查核、修正及限制](docs/content-review.md)
- [QA 結果](docs/qa-report.md)
- 第一輪／第二輪機械產生的統計：`docs/qa/round1.json`、`docs/qa/round2.json`。
- `test-results/`、`qa-artifacts/` 保存本機測試輸出／截圖，已排除 Git，不主動清除。

## 發布

沿用 `main` 與原 GitHub Pages。先完成測試、來源核對與 diff 檢查後提交，再推送；確認遠端 commit、Pages build 與線上靜態資產均是同一修訂，才回報上線。
