# v3.0 已確定日期改版：本機實作審查

- 建立／修訂：2026-11-02；建立者：Hermes Agent。
- 日期依使用者確認：2026/12/10（四）–12/13（日），四天三夜。不是外部來源或已訂位證明。
- 本子工作僅修改本機，不提交、推送、部署或發訊息。

## 實作

- 固定唯一日期選項並停用切換；初始化及schema1匯入均不能還原舊12/3。沿用兩個storage key及全部10個待辦ID，保留其他合法偏好及勾選值，不自動勾日期。
- DAY1抵達、DAY2古宮／鍾路／市場／東大門、DAY3預設弘大／延南洞，shopping=snow才換江南雪具；江南可切Best/Montana及加選鷺梁津。DAY4回機場，不排購物必達。舊#map-day-5映射DAY4。
- 已納入使用者「不要指定東橫INN」新指示：目前住宿主區品牌不限，正式飯店不要民宿，1人1房3晚、逐晚含稅≤NT$3,000、三晚≤NT$9,000。新日期方案待查核，沒有已核實合格推薦；東橫比較及原介紹保留原ID，移至預設收合的非目前指定推薦歷史。
- 10筆舊住宿、3筆機票及4筆官方阻塞保留原ID與證據連結，收入預設收合歷史。原12/3–7、12/10–14四晚價格不套成新三晚；目前價格狀態明寫尚待重查。
- 機票複製條件12/10出發、12/13回程，1成人直飛、每段至少20kg。
- 更新v3.0、2026-11-02修訂及metadata；social-card圖檔由父代理另行處理，本子工作未改圖。

## TDD與回歸證據

以下路徑相對專案根目錄，全部為本機真實執行產物：

- `qa-artifacts/confirmed-red.log`：初次4項新增測試全部RED；實際包含v2.2不等於v3.0、舊偏好／備份還原12/3、舊機票條件數目等錯誤。截圖及trace留在`qa-artifacts/confirmed-red-results/`。
- `qa-artifacts/confirmed-brand-red.log`：品牌新要求先加測試並執行，1 failed、3 passed；失敗為缺少#hotel-current-policy。截圖及trace留在`qa-artifacts/confirmed-brand-red-results/`。
- `qa-artifacts/confirmed-check.log`：最後`npm run check`通過；4天3晚、星期四五六日、NT$9,000、10個待辦及來源ledger核對成功；歷史價格JSON與生成JS一致。
- `qa-artifacts/confirmed-full-final.log`：最後`QA_ROUND=confirmed-v3 npm test`，54 passed (42.5s)、0 failed、0 skipped；桌機及手機各27項。包括四日地圖、D3兩主線、舊hash5、備份與錯誤shopping拒絕、完整10項值、六分頁、自動無障礙、手機overflow、列印、儲存拒絕／損毀、分享取消、手動複製fallback及歷史價格證據。
- 截圖：`qa-artifacts/confirmed-desktop-itinerary.png`、`confirmed-mobile-itinerary.png`、`confirmed-desktop-hotel-policy.png`、`confirmed-mobile-hotel-policy.png`、`confirmed-desktop-history.png`、`confirmed-mobile-history.png`；六分頁原有視覺截圖同樣保留在qa-artifacts。
- `git diff --exit-code -- price-data.js docs/price-audit.json docs/price-evidence`返回0：舊價格與證據未變。

## 修改範圍與限制

修改app.js、trip-data.js、index.html、README.md、package.json、package-lock.json，以及tests/confirmed-dates.spec.cjs（新增）、edge.spec.cjs、prices.spec.cjs、site.spec.cjs、toyoko.spec.cjs、validate-data.cjs、validate-prices.cjs；新增本審查文件。未改父代理的confirmed-dates-plan.md、圖檔、price-data.js、price-audit.json或歷史報告。

新日期機票、飯店價格、班次與營業尚未重新查核；父代理另行研究飯店候選，不能把本機測試通過當成預算達標。原位置查核仍2026-11-02、舊費用2026-10-18、其他景點沿用原2026-10-16，未假稱全面更新。Google Maps iframe在測試隔離，URL端點通過不等於驗證即時交通。自動無障礙檢測不是完整認證。父代理仍需獨立審查與重跑；本報告不宣稱已發布。
