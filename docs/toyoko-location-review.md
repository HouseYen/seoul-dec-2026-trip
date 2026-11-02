# v2.2 東橫INN位置整合與限制

- 建立者：豪斯的 Hermes Agent
- 版次：v1.0
- 建立／修訂日期：2026-11-02（Asia/Taipei）
- 來源／目的：將本次四分店位置比較合併既有飯店分頁；保留原價格資料、既有日期／住宿錨點及待辦，不另開網站。

## 已合併內容

| 分店 | 官方地址 | 位置判斷 |
|---|---|---|
| 東大門No.2／00291 | 325 Toegye-ro, Jung-gu | 預設位置首選，東大門歷史文化公園站周邊。[12] |
| 東大門No.1／00208 | 337 Toegye-ro, Jung-gu | 同交通圈、幾乎同級；房價、房型及取消條件較好就選它。[11] |
| 永登浦／00311 | 293 Singil-ro, Yeongdeungpo-gu | 新吉／永登浦站一帶；若指定日期價格有利再權衡。[52] |
| 江南／00282 | 323 Gangnam-daero, Seocho-gu | 江南站周邊，實址瑞草區；本行程不為一天雪具採買改四晚基地。[57] |

排名是按現有行程的適配判斷，不是品質評分或價格推薦。首爾站、明洞與東大門歷史文化公園同在4號線；弘大入口與東大門歷史文化公園同在2號線。[59][60]

No.2官方另有1號出口電梯繞行圖文，有行李時不把最近出口直接當最省力動線，實際可用狀態仍須出發前核對。[58]

## 時間與範圍

- 位置與路網依2026-11-02讀取的官方分店及路網資訊，不代表12月班次或出口設施保證。
- `docs/price-audit.json`與`price-data.js`本次不變，價格維持2026-10-18快照；沒有重新查價、更新空房或宣稱逐晚含稅達標。
- Google Maps連結是名稱＋地址搜尋，不是已驗證門到門耗時或公車班次。
- 原六分頁、10個待辦ID及儲存key維持；位置推薦不自動改住宿區域錨點。
- 新測試先在缺少比較區時觀察到RED，後續以本機及正式網址完整回歸驗收。機械結果留在忽略的QA目錄，不冒充實際住宿／票價承諾。

## Sources

[11] https://www.toyoko-inn.com/eng/search/detail/00208
[12] https://www.toyoko-inn.com/eng/search/detail/00291
[52] https://www.toyoko-inn.com/eng/search/detail/00311 — 飯店官方身分／地址｜Toyoko Inn Seoul Yeongdeungpo
[57] https://www.toyoko-inn.com/eng/search/detail/00282 — Toyoko Inn｜首爾江南官方位置
[58] https://www.toyoko-inn.com/eng/search/detail/00291/access — 東大門No.2｜官方電梯步行指引
[59] https://en.wikipedia.org/wiki/Seoul_Subway_Line_2 — 首爾地鐵2號線｜路網交叉核對
[60] https://en.wikipedia.org/wiki/Seoul_Subway_Line_4 — 首爾地鐵4號線｜路網交叉核對
