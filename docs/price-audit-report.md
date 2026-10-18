# v2.1 指定日期價格與本機 QA

- 建立者：豪斯的 Hermes Agent
- 版次：v1.1
- 修訂內容與原因：補齊兩家替代飯店四筆查核、統一較新的參考匯率，並記錄最終42項本機回歸，避免把網站測試當成預算達標。
- 建立／修訂日期：2026-10-18（Asia/Taipei）
- 來源／目的：承接豪斯「繼續完成」，呈現實際價格觀察、逐晚住宿硬限制與缺失；不以界面完成代替可訂房／票價確認。

## 比較框架

2026-12-03～07、2026-12-10～14；1 成人、TPE ⇄ ICN、經濟艙、去回直飛、五天四夜。去回各至少20 kg托運是比較用規劃假設；雪具規則另核。住宿為1成人、1間整間房、私人衛浴、非民宿，逐晚含稅上限NT$3,000。

## 韓亞：三筆已選定去回航班的觀察價

| 去回日期 | 去程／回程（各機場當地時間） | 每人來回觀察價 | 狀態 |
|---|---|---:|---|
| 2026-12-03～2026-12-07 | 17:05–20:30／13:50–15:55 | NT$9,736 | Google訂票選項觀察，非官網復價[37] |
| 2026-12-10～2026-12-14 | 17:05–20:30／13:50–15:55 | NT$13,567 | Google訂票選項觀察，非官網復價[38] |
| 2026-12-10～2026-12-14 | 17:05–20:30／08:00–09:50 | NT$10,124 | Google訂票選項觀察，非官網復價[39] |

同為17:05去／13:50回，12/10～14比12/3～7的當次觀察價多NT$3,831；只比較這兩筆同時段行程，不宣稱已比完所有航空。[37][38]
行程頁顯示全旅程首件托運免費；23 kg來自韓亞非美線一般經濟艙規則，不等於已核對所選票種、雪具、最終稅費或付款費。[9]
12/14 08:00早回雖較同週午回便宜，若採本行程約提前3小時到機場的規劃，需約05:00抵達；接駁與體力成本另估。這是保守規劃建議，不是已核實車班。

## 原三家正式飯店：六筆查核

| 飯店／房型 | 入住～退房 | 四晚所見總額 | 判定 |
|---|---|---:|---|
| Toyoko Inn Seoul Dongdaemun No.1／未取得日期房型 | 2026-12-03～2026-12-07 | 未取得 | 官網此查詢未提供可用報價；不是所有通路售罄[40] |
| Toyoko Inn Seoul Dongdaemun No.1／未取得日期房型 | 2026-12-10～2026-12-14 | 未取得 | 官網此查詢未提供可用報價；不是所有通路售罄[41] |
| Toyoko Inn Seoul Dongdaemun No.2／未取得日期房型 | 2026-12-03～2026-12-07 | 未取得 | 官網此查詢未提供可用報價；不是所有通路售罄[42] |
| Toyoko Inn Seoul Dongdaemun No.2／未取得日期房型 | 2026-12-10～2026-12-14 | 未取得 | 官網此查詢未提供可用報價；不是所有通路售罄[43] |
| Travelodge Dongdaemun Seoul／Standard Single | 2026-12-03～2026-12-07 | KRW 655,556（含頁面已列稅費） | 所見週五／週六未稅換算已超過上限，不能列為逐晚合格方案[44] |
| Travelodge Dongdaemun Seoul／Superior Queen | 2026-12-10～2026-12-14 | KRW 564,894（含頁面已列稅費） | 所見週五／週六未稅換算已超過上限，不能列為逐晚合格方案[46] |

Travelodge為Early Bird方案，第一窗Standard Single、第二窗Superior Queen；不同房型不能當作純日期價差。逐晚原幣、四晚總稅費及取消原文見網站和公開摘錄；總稅費不自行平均分攤，已列總額也不是台幣結帳價。[44][46]
所有KRW估值統一使用Xe參考1 KRW = 0.02433396 TWD，來源標示Oct 18, 2026, 02:46 UTC；不冒充即時刷卡／訂房結帳匯率，換算更新也不代表重新取得飯店報價。[48]
完成五家×兩窗共十筆查核，仍沒有已核實逐晚含稅≤NT$3,000的可訂方案：六筆未取得可用房價、四筆所見價格超標。官網未提供可用房價不代表所有通路售罄；超標方案也不標成符合預算。

## 兩家替代飯店：四筆補查

| 飯店／房型 | 入住～退房 | 四晚所見含已列稅費總額 | TWD參考估值／判定 |
|---|---|---:|---|
| Hotel Venue G (Hotel Venue-G Seoul)／Superior Double | 2026-12-03～2026-12-07 | KRW 749,700 | 約NT$18,243.17，不合預算[53] |
| Hotel Venue G (Hotel Venue-G Seoul)／Standard Budget (No Window) | 2026-12-10～2026-12-14 | KRW 637,200 | 約NT$15,505.60，不合預算[54] |
| Toyoko Inn Seoul Yeongdeungpo／未取得日期房型 | 2026-12-03～2026-12-07 | 未取得 | 未有官網可用報價，不是全通路售罄[55] |
| Toyoko Inn Seoul Yeongdeungpo／未取得日期房型 | 2026-12-10～2026-12-14 | 未取得 | 未有官網可用報價，不是全通路售罄[56] |

Hotel Venue G是鍾路／清溪川替代案，官方地址117 Cheonggyecheon-ro；永登浦東橫INN分店ID為00311，官方地址293 Singil-ro。兩者都不冒充明洞／東大門飯店，沒有默默更新原地圖住宿錨點。[51][52]
Venue G逐晚拆價未取得、稅費拆額未取得；四晚含已列稅費總額依參考匯率均超NT$12,000，足以排除此方案四晚每一晚都在NT$3,000內，但不能反推哪一天超多少。不得自行攤分。[53][54][48]
Venue G所見免費取消期限第一窗2026/11/29 23:59、第二窗2026/12/06 23:59，均為飯店當地時間；入住前三日起及no-show按所見方案收100%費用，入住押金金額未取得。[53][54]

## 官方引擎查核缺失

長榮兩窗、華航兩窗的指定日期查詢均未取得可確認總價；公開阻塞摘錄只記錄實際Access Denied回應，不填入零元或推估值。華航日曆的不同返程範例已排除，不挪用成這兩窗的報價。

- EVA Air 2026-12-03～2026-12-07：[阻塞紀錄](price-evidence/official-fare-1.txt)。
- EVA Air 2026-12-10～2026-12-14：[阻塞紀錄](price-evidence/official-fare-2.txt)。
- China Airlines 2026-12-03～2026-12-07：[阻塞紀錄](price-evidence/official-fare-3.txt)。
- China Airlines 2026-12-10～2026-12-14：[阻塞紀錄](price-evidence/official-fare-4.txt)。

## 本機 QA（與價格是否達標分開）

- 實際完整執行：42項通過；desktop 21、mobile 21；0失敗、0略過、0 flaky。
- 21個本機頁面／資料／摘錄資產HTTP 200；兩種寬度無橫向溢出、無pageerror。
- 原六分頁、地圖分段、10個舊待辦ID、儲存拒絕／損毀、分享取消、備份、列印和日期篩選均回歸通過。
- Maps iframe在整合測試中明確隔離；自動化無障礙測試不是完整人工認證，也不證明實際公共運輸班次或外部報價可成交。
- 這份記錄只證明本機查核與UI；遠端commit、Pages資產與Telegram送達須另以實際發布輸出核對，不能由本文件推定。
- 機械結果：[`qa/price-update-local.json`](qa/price-update-local.json)；價格資料：[`price-audit.json`](price-audit.json)。

## Sources

[9] https://flyasiana.com/C/US/EN/contents/free-baggage
[37] https://www.google.com/travel/flights/booking?tfs=CBwQAhpBEgoyMDI2LTEyLTAzIh8KA1RQRRIKMjAyNi0xMi0wMxoDSUNOKgJPWjIDNzE0KABqBwgBEgNUUEVyBwgBEgNJQ04aQRIKMjAyNi0xMi0wNyIfCgNJQ04SCjIwMjYtMTItMDcaA1RQRSoCT1oyAzcxMygAagcIARIDSUNOcgcIARIDVFBFQAFIAXABggELCP___________wGYAQE&tfu=CmxDalJJUlZvelIyeEpYMVY0VVhkQlMwSTRTMEZDUnkwdExTMHRMUzB0ZEd4aVlYa3lOVUZCUVVGQlIzSlZUWHBaU21Jd2FVRkJFZ2RQV2pjeE15TXhHZ29JaUV3UUFCb0RWRmRFT0J4d3NPb0ISAggAIgA&hl=en&gl=TW&curr=TWD — Google Flights selected Asiana itinerary 2026-12-03/2026-12-07 a-afternoon-return
[38] https://www.google.com/travel/flights/booking?tfs=CBwQAho_EgoyMDI2LTEyLTEwIh8KA1RQRRIKMjAyNi0xMi0xMBoDSUNOKgJPWjIDNzE0agcIARIDVFBFcgcIARIDSUNOGkESCjIwMjYtMTItMTQiHwoDSUNOEgoyMDI2LTEyLTE0GgNUUEUqAk9aMgM3MTMoAGoHCAESA0lDTnIHCAESA1RQRUABSAFwAYIBCwj___________8BmAEB&tfu=CmxDalJJVmpCMVkwbzVZVUZXVEc5QlRHZGxaR2RDUnkwdExTMHRMUzB0ZEdKaloyRXhNRUZCUVVGQlIzSlZUVGhqU1cxSFRGVkJFZ1ZQV2pjeE14b0tDUDlwRUFBYUExUlhSRGdjY016R0FnPT0SAggAIgMSATE&hl=en&gl=TW&curr=TWD — Google Flights selected Asiana itinerary 2026-12-10/2026-12-14 b-afternoon-return
[39] https://www.google.com/travel/flights/booking?tfs=CBwQAho_EgoyMDI2LTEyLTEwIh8KA1RQRRIKMjAyNi0xMi0xMBoDSUNOKgJPWjIDNzE0agcIARIDVFBFcgcIARIDSUNOGkESCjIwMjYtMTItMTQiHwoDSUNOEgoyMDI2LTEyLTE0GgNUUEUqAk9aMgM3MTEoAGoHCAESA0lDTnIHCAESA1RQRUABSAFwAYIBCwj___________8BmAEB&tfu=CmxDalJJV1V3eVprVTJNMlpsV0RCQlMyMUxTV2RDUnkwdExTMHRMUzB0ZEd4aVpIZ3hOMEZCUVVGQlIzSlZUa2RuVDBKdU55MUJFZ2RQV2pjeE1TTXhHZ29JakU4UUFCb0RWRmRFT0J4dzIvTUISAggAIgA&hl=en&gl=TW&curr=TWD — Google Flights selected Asiana itinerary 2026-12-10/2026-12-14 b-early-return
[40] https://www.toyoko-inn.com/eng/search/result/room_plan/?hotel=00208&start=2026-12-03&end=2026-12-07&room=1&people=1&smoking=all&tab=roomType&sort=recommend — Toyoko Inn Seoul Dongdaemun No.1｜2026-12-03–2026-12-07 官網觀察
[41] https://www.toyoko-inn.com/eng/search/result/room_plan/?hotel=00208&start=2026-12-10&end=2026-12-14&room=1&people=1&smoking=all&tab=roomType&sort=recommend — Toyoko Inn Seoul Dongdaemun No.1｜2026-12-10–2026-12-14 官網觀察
[42] https://www.toyoko-inn.com/eng/search/result/room_plan/?hotel=00291&start=2026-12-03&end=2026-12-07&room=1&people=1&smoking=all&tab=roomType&sort=recommend — Toyoko Inn Seoul Dongdaemun No.2｜2026-12-03–2026-12-07 官網觀察
[43] https://www.toyoko-inn.com/eng/search/result/room_plan/?hotel=00291&start=2026-12-10&end=2026-12-14&room=1&people=1&smoking=all&tab=roomType&sort=recommend — Toyoko Inn Seoul Dongdaemun No.2｜2026-12-10–2026-12-14 官網觀察
[44] https://booking.travelodgehotels.asia/ibe/details.aspx?hotelID=16811&lang=en-us&rmID=83881&voucher=&currID=79&access= — Travelodge Dongdaemun Seoul｜2026-12-03–2026-12-07 官網觀察
[46] https://booking.travelodgehotels.asia/ibe/details.aspx?hotelID=16811&lang=en-us&rmID=84593&voucher=&currID=79&access= — Travelodge Dongdaemun Seoul｜2026-12-10–2026-12-14 官網觀察
[48] https://www.xe.com/currencyconverter/convert/?Amount=1&From=KRW&To=TWD — Xe｜KRW→TWD 參考匯率（非結帳匯率）
[51] https://www.hotelvenueg.co.kr — 飯店官方身分／地址｜Hotel Venue G
[52] https://www.toyoko-inn.com/eng/search/detail/00311 — 飯店官方身分／地址｜Toyoko Inn Seoul Yeongdeungpo
[53] https://bw.tripla.ai/booking/result?code=019b20a6-86ed-7b58-af35-81e2de80c0ea&checkin=2026%2F12%2F03&checkout=2026%2F12%2F07&type=rooms&is_day_use=false&order=price_low_to_high&is_including_occupied=false&rooms=%5B%7B%22adults%22%3A1%7D%5D&parentUrl=https%3A%2F%2Fwww.hotelvenueg.co.kr&parentPathname=%2F&locale=en — Hotel Venue G (Hotel Venue-G Seoul)｜2026-12-03–2026-12-07 官網查核
[54] https://bw.tripla.ai/booking/result?code=019b20a6-86ed-7b58-af35-81e2de80c0ea&checkin=2026%2F12%2F10&checkout=2026%2F12%2F14&type=rooms&is_day_use=false&order=price_low_to_high&is_including_occupied=false&rooms=%5B%7B%22adults%22%3A1%7D%5D&parentUrl=https%3A%2F%2Fwww.hotelvenueg.co.kr&parentPathname=%2F&locale=en — Hotel Venue G (Hotel Venue-G Seoul)｜2026-12-10–2026-12-14 官網查核
[55] https://www.toyoko-inn.com/eng/search/result/room_plan/?hotel=00311&start=2026-12-03&end=2026-12-07&room=1&people=1&smoking=all&tab=roomType&sort=recommend — Toyoko Inn Seoul Yeongdeungpo｜2026-12-03–2026-12-07 官網查核
[56] https://www.toyoko-inn.com/eng/search/result/room_plan/?hotel=00311&start=2026-12-10&end=2026-12-14&room=1&people=1&smoking=all&tab=roomType&sort=recommend — Toyoko Inn Seoul Yeongdeungpo｜2026-12-10–2026-12-14 官網查核
