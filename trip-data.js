'use strict';
// Public planning data only. Dates are candidates, not reservations.
window.TRIP_DATA = {
  version: 'v2.0', reviewedOn: '2026-10-16', daysCount: 5, nights: 4, hotelNightCap: 3000,
  dateOptions: ['2026-12-03', '2026-12-10'],
  sources: [
    { id: 1, title: 'Visit Seoul｜景福宮', url: 'https://english.visitseoul.net/attractions/Gyeongbokgung/ENP000072', note: '已讀：11–12 月 09:00–17:00，最後入場提前一小時；一般週二休。' },
    { id: 4, title: 'Seoul PASS｜東大門 SPAREX 票券', url: 'https://www.seoultravelpass.com/en/products/1496-seoul-dongdaemun-sparex-jjimjilbang-sauna-admission-ticket', note: '票務平台，非場館官網：刊載地址、日間 14,000／成人夜間 15,900 韓元；出發前重查。' },
    { id: 6, title: 'Visit Seoul｜東大門烤魚街', url: 'https://english.visitseoul.net/tours/Pyeonghwa-Markets-friend-of-30-years-Dongdaemun-Grilled-Fish-Street_/11084', note: '介紹頁較舊；僅用於街區與料理類型，不沿用舊價格／當前營業承諾。' },
    { id: 7, title: '國立中央博物館｜參觀資訊', url: 'https://www.museum.go.kr/ENG/contents/E0101010000.do', note: '已讀：常設展一般免費；3、6、9、12 月首個週一常設與特展區休館，另有例外公告。' },
    { id: 9, title: 'Asiana｜托運行李一般規則', url: 'https://flyasiana.com/C/US/EN/contents/free-baggage', note: '一般航線規則已讀，不代表候選航班／票種的最後結帳條款。' },
    { id: 11, title: 'Toyoko Inn｜東大門 No.1', url: 'https://www.toyoko-inn.com/eng/search/detail/00208', note: '已讀地址與早餐資訊；未核實兩組入住日期的房價、空房與取消條款。' },
    { id: 12, title: 'Toyoko Inn｜東大門 No.2', url: 'https://www.toyoko-inn.com/eng/search/detail/00291', note: '已讀地址與早餐資訊；未核實指定日期房價、空房與取消條款。' },
    { id: 13, title: 'Travelodge Dongdaemun Seoul｜官網', url: 'https://travelodgehotels.asia/travelodge-dongdaemun-seoul', note: '已讀 Standard Single 房型與地址；指定日期供應／含稅房價待核。' },
    { id: 14, title: 'Montana Sports｜官網', url: 'https://montanaski.co.kr', note: '已核實地址；官網時段有月份限制／文字不一致，12 月時間與庫存待確認。' },
    { id: 15, title: 'Best Snowboard｜官網', url: 'https://www.bestsnowboard.co.kr', note: '官網韓文採 CP949 解碼核對；地址已核實，出發日營業與尺碼仍須確認。' },
    { id: 18, title: 'CJ ONE 官方｜Olive Young 明洞 Town', url: 'https://m.cjone.com/cjmmobile/store/storeAreaDetail.do?coopco_cd=7030&brnd_cd=3000&no=D176', note: '店址已核；Olive Young 行動詳情頁存取受限，改用 CJ 官方店舖資料交叉核對。' },
    { id: 19, title: 'CJ ONE 官方｜Olive Young 弘大 Town', url: 'https://m.cjone.com/cjmmobile/store/storeAreaDetail.do?coopco_cd=7030&brnd_cd=3000&no=DE3C', note: '店址已核；出發日活動與時間待確認。' },
    { id: 20, title: 'Visit Seoul｜明洞餃子', url: 'https://english.visitseoul.net/restaurants/Myeongdong-Kyoja-EN/ENP008570', note: '已讀旅遊介紹；出發日營業及當日菜單待確認。' },
    { id: 21, title: 'Visit Seoul｜廣藏市場', url: 'https://english.visitseoul.net/area/Gwangjang-Market/ENP000286', note: '已讀市場與小吃介紹；不承諾個別攤位營業／單人最低消費。' },
    { id: 22, title: 'Visit Seoul｜COEX 星空圖書館', url: 'https://english.visitseoul.net/attractions/Starfield-Library/ENP026558', note: '已讀位於 COEX 的公共閱讀空間介紹；活動與出發日時段待查。' },
    { id: 23, title: 'Visit Seoul｜聖水洞趨勢介紹', url: 'https://english.visitseoul.net/editorspicks/2025SeoulTrendReportSeongsu-dong/ENNvepwqx', note: '街區／購物方向參考；不把文中快閃活動、服務名額套到 2026 年 12 月。' },
    { id: 24, title: '韓國觀光公社｜鷺梁津水產市場', url: 'https://english.visitkorea.or.kr/svc/contents/contentsView.do?vcontsId=91565', note: '已讀 674 Nodeul-ro 與市場介紹；當日魚貨、料理費和單人份另問。' }
  ],
  bases: {
    myeongdong: { name: '明洞站住宿區', query: '명동역 서울 중구' },
    dongdaemun: { name: '東大門歷史文化公園站住宿區', query: '동대문역사문화공원역 서울 중구' }
  },
  stops: {
    airport: { name: '仁川機場（航廈待定）', query: '인천국제공항' },
    seoul: { name: '首爾站', query: '서울역' },
    myeongdongOY: { name: 'Olive Young 明洞 Town', query: '올리브영 명동 타운 서울 중구 명동길 53' },
    palace: { name: '景福宮', query: '경복궁 서울 종로구 사직로 161' },
    insa: { name: '仁寺洞', query: '인사동 서울 종로구' },
    market: { name: '廣藏市場', query: '광장시장 서울 종로구 창경궁로 88' },
    fish: { name: '東大門烤魚街', query: '동대문 생선구이 골목 서울 종로구' },
    sparex: { name: 'SPAREX 東大門', query: '스파렉스 굿모닝시티 서울 중구 장충단로 247' },
    hongik: { name: '弘大入口站', query: '홍대입구역 서울 마포구' },
    hongdaeOY: { name: 'Olive Young 弘大 Town', query: '올리브영 홍대 타운 서울 마포구 홍익로6길 57' },
    yeonnam: { name: '延南洞', query: '연남동 서울 마포구' },
    best: { name: 'Best Snowboard 雪具店', query: '베스트스노우보드 서울 강남구 논현로 622' },
    montana: { name: 'Montana Sports 雙板雪具店', query: '몬타나스포츠 서울 강남구 언주로 540' },
    seafood: { name: '鷺梁津水產市場', query: '노량진수산물도매시장 서울 동작구 노들로 674' }
  },
  days: [
    { id: 1, title: '抵達後，只做入住與一頓熱飯', region: '機場 → 住宿區', route: '仁川機場 → 首爾站 → 住宿；明洞基地可順逛 Olive Young。',
      main: '航班未定，不排固定景點時間。明洞入住可逛商圈；若改住東大門，抵達日就在住宿區吃飯休息。',
      food: '明洞可選明洞餃子；東大門基地就近找單人湯飯／麵食，不特地跨區吃。',
      optional: '精神好再美妝採買；晚到直接刪掉。明洞主採買一次，弘大只補貨。',
      exit: '晚到先確認末班與入住方式；AREX 不適用時改查機場巴士或計程車。', refs: [20, 18] },
    { id: 2, title: '古宮散步，市場吃一點就好', region: '鍾路 → 東大門', route: '景福宮 → 仁寺洞 → 廣藏市場小吃 → 東大門烤魚晚餐。',
      main: '上午景福宮，下午仁寺洞喝熱飲。廣藏市場只挑一樣小吃，晚餐再找烤魚；不把每站都吃成正餐。',
      food: '市場飯捲／綠豆煎餅，熟食海鮮選烤魚街；每店先問一人份與最低點餐量。',
      optional: '汗蒸幕 SPAREX 是替換晚間逛街的選項，不是再多塞一個行程。',
      exit: '景福宮 11–12 月 09:00–17:00、最後入場 16:00；一般週二休。兩組候選的 DAY 2 都是週五，出發前仍複查。', refs: [1, 21, 6, 4] },
    { id: 3, title: '弘大到延南洞，把購物排在一起', region: '弘大・延南洞', route: '弘大入口站 → Olive Young 弘大 Town → 延南洞咖啡散步。',
      main: '今天專心逛一區。衣服、鞋子、文具自由挑，不加另一個跨城景點。',
      food: '優先單人湯飯、拌飯、麵食；辣炒雞排常見分享式，先問是否接單人，不預設一定能點。',
      optional: '想換風格就用聖水半日「替換」弘大；兩區不硬塞同一天。',
      exit: '天冷時縮短延南洞步行，選一間咖啡店坐著。購物後先回飯店放東西。', refs: [19, 23] },
    { id: 4, title: '雪具只挑重點，海鮮留作加選', region: '江南；鷺梁津可選', route: '單板先 Best Snowboard；雙板／雪鞋改 Montana。一次只挑 1–2 家。',
      main: '主線先走地址已核實的 Best Snowboard。買雙板／雪鞋則換 Montana；地圖可切換。先問營業、尺寸、試穿與運送。',
      food: '精力足才去鷺梁津；先談食材＋料理費與單人份。不合就回住宿區找熟食，不另外跨去昨天的烤魚街。',
      optional: '要逛第二家時先核實現址與營業。Board Korea／Gangnam Sports 暫不列必達導航。',
      exit: '半天採買留休息，不扛大袋硬逛市場。大件雪板先核對航空運動器材與超尺寸規定。', refs: [15, 14, 24] },
    { id: 5, title: '帶著餘裕回家，不再加遠程點', region: '住宿區 → 機場', route: '住宿 → 首爾站 → 仁川機場；實際接駁依航班與航廈確認。',
      main: '依航班倒推退房、交通、退稅與報到。這份規劃建議保守抓起飛前約 3 小時抵達機場，仍以航空公司規定為準。',
      food: '早餐吃完再出發，回程不為了排隊名店壓縮緩衝。',
      optional: '只有晚班且時間足夠才在住宿區補貨；不另外跨區。',
      exit: '確認 T1／T2、行李重量與護照。早班先查首班車，不假設機場鐵路一定趕得上。', refs: [] }
  ],
  backups: [
    { title: '文化雨備｜國立中央博物館', tag: '替換 DAY 2 或 DAY 4 主線', text: '想少走戶外時改選室內展館，不額外疊加古宮／雪具。常設展一般免費，特展另看。注意 12/7（一）依現行規則常設與特展區休館，不排在第一組回程日。', query: '국립중앙박물관 서울', refs: [7] },
    { title: '室內備案｜COEX 星空圖書館', tag: '替換 DAY 4 雪具購物', text: '不買雪具或天氣不佳，改成 COEX 室內逛街與閱讀空間；不是雪具逛完再加一個遠程大點。', query: '별마당 도서관 스타필드 코엑스몰 서울', refs: [22] },
    { title: '購物替案｜聖水洞', tag: '替換 DAY 3 弘大半日', text: '比較想看品牌店與咖啡空間，就選聖水取代弘大。非純室內雨備；快閃檔期另查，不把舊活動當作這趟保證。', query: '성수동 서울', refs: [23] }
  ],
  places: [
    { id: 'kyoja', category: 'food', title: '明洞餃子', tag: 'DAY 1／明洞基地順路', text: '熱麵與餃子方向。抵達日先吃飽，不為名店跨區；當日菜單與單人點餐現場確認。', query: '명동교자 본점 서울', refs: [20] },
    { id: 'gwangjang', category: 'food', title: '廣藏市場', tag: 'DAY 2／小吃不是第二頓正餐', text: '飯捲、綠豆煎餅等小吃，先一份再決定要不要加；攤位營業與價格現場確認。', query: '광장시장 서울 종로구', refs: [21] },
    { id: 'grilled-fish', category: 'food', title: '東大門烤魚街', tag: 'DAY 2／熟食海鮮選項', text: '找烤魚套餐，先問一人份與總額。官方街區介紹較舊，這版不沿用文中的舊餐價。', query: '동대문 생선구이 골목 서울', refs: [6] },
    { id: 'noryangjin', category: 'food', title: '鷺梁津水產市場', tag: 'DAY 4／有餘力才去', text: '先問單人份與食材、料理、其他費用總額再買；想吃牡蠣也先問當日來源和熟食做法，不承諾供應。', address: '서울특별시 동작구 노들로 674', query: '노량진수산물도매시장 서울 동작구 노들로 674', refs: [24] },
    { id: 'oy-myeongdong', category: 'beauty', title: 'Olive Young 明洞 Town', tag: 'DAY 1／明洞基地可主採買', text: '主採買安排一次即可。官方 CJ ONE 店址資料已核實，營業與活動出發前重查。', address: '서울특별시 중구 명동길 53 1~2층', query: '올리브영 명동 타운 서울 중구 명동길 53', refs: [18] },
    { id: 'oy-hongdae', category: 'beauty', title: 'Olive Young 弘大 Town', tag: 'DAY 3／順逛補貨', text: '在弘大到延南洞的同區行程順訪；如果明洞已買齊，不再安排第二場大採買。', address: '서울특별시 마포구 홍익로6길 57', query: '올리브영 홍대 타운 서울 마포구 홍익로6길 57', refs: [19] },
    { id: 'best', category: 'snow', title: 'Best Snowboard', tag: 'DAY 4／單板零售優先', text: '地址已核實。單板、服飾與裝備採買方向；出發前確認尺寸現貨與試穿，不是雪場租借。', address: '서울특별시 강남구 논현로 622 금은빌딩 1층', query: '베스트스노우보드 서울 강남구 논현로 622', phone: '02-511-5114', refs: [15] },
    { id: 'montana', category: 'snow', title: 'Montana Sports', tag: 'DAY 4／雙板與雪鞋零售', text: '地址已核實；12 月營業時段未核實，不外推官網其他月份時段。想買雙板／雪鞋可替換 Best 作主力店。', address: '서울 강남구 언주로 540 코원타워 1층', query: '몬타나스포츠 서울 강남구 언주로 540', phone: '02-566-8007', refs: [14] },
    { id: 'board', category: 'snow', title: 'Board Korea 江南店', tag: '零售候選／店址與時間待核', text: '628 號沿用舊資料，本次未成功讀取現行官網核實；分店休息日可能錯套，已移除「江南週一、二休」。未確認前不列預設路線。', address: '待核：서울 강남구 논현로 628', query: '보드코리아 강남 논현로 628', website: 'https://www.boardkorea.com/', refs: [], pending: true },
    { id: 'gangnam', category: 'snow', title: 'Gangnam Sports', tag: '零售候選／現址待電話核實', text: '524 號目前只有官網搜尋索引，不能當成已讀現行店址；也不導回舊 637。未核實前不列必達店。', address: '待核：서울 강남구 논현로 524', query: '강남스포츠 논현로 524 서울', website: 'http://gangnamsports.co.kr/', refs: [], pending: true },
    { id: 'sparex', category: 'relax', title: 'SPAREX 東大門汗蒸幕', tag: 'DAY 2／晚間逛街替案', text: 'Seoul PASS 刊載日間 ₩14,000、成人夜間 ₩15,900 與 24 小時資訊；只是票務平台觀察，不是 12 月承諾。查好票種、清潔限制與入場方式再去。', address: 'Goodmorning City B3, 247 Jangchungdan-ro, Jung-gu, Seoul', query: '스파렉스 굿모닝시티 서울 장충단로 247', refs: [4] }
  ],
  hotels: [
    { title: 'Toyoko Inn Seoul Dongdaemun No.1', tag: '優先查價／正式商務飯店', address: '337, Toegye-ro, Jung-gu, Seoul', text: '官方列免費早餐與房內衛浴設備；先查單人可住的整間房。房型、取消與晚到條款依指定日期確認。', query: '토요코인 서울 동대문1 서울 퇴계로 337', refs: [11] },
    { title: 'Toyoko Inn Seoul Dongdaemun No.2', tag: '同品牌備選／別混門牌', address: '325, Toegye-ro, Jung-gu, Seoul', text: '官方列免費早餐與房內衛浴設備。No.1／No.2 是不同飯店，訂房名稱、地址與地圖要一致。', query: '토요코인 서울 동대문2 서울 퇴계로 325', refs: [12] },
    { title: 'Travelodge Dongdaemun Seoul', tag: '單人房備選／Standard Single', address: '359 Dongho-ro, Jung-gu, Seoul', text: '官方明列 Standard Single 單人床房型。指定日期是否有房、私人衛浴與含稅價格需在訂房頁再次確認。', query: '트래블로지 동대문 서울 동호로 359', refs: [13] }
  ],
  todoGroups: [
    { id: 'now', title: '現在先完成｜行程定案', items: [
      { id: 'dates', title: '選定出發日期', text: '12/3–7 或 12/10–14，選擇五天四夜；上方選單不會自動替這項打勾。' },
      { id: 'flight', title: '確認並預訂來回機票', text: 'TPE ⇄ ICN，核對去回時間、直飛與兩段托運後總價；別只看裸票。' },
      { id: 'hotel', title: '選住宿區域並訂房', text: '正式飯店、1 成人整間房、逐晚含稅 ≤ NT$3,000；確認取消、衛浴與晚到入住。' },
      { id: 'budget', title: '訂全程預算上限', text: '分開列機票、四晚住宿、交通、餐飲、購物、保險及備用金。' }
    ] },
    { id: 'before', title: '出發前準備｜交通與收尾', items: [
      { id: 'transfer', title: '定稿機場往返交通', text: '依飯店、航班、T1／T2 查首末班與轉乘；早晚班另備接駁方案。' },
      { id: 'entry', title: '核對入境規定並辦妥旅平險', text: '依國籍與出發日期查護照效期、適用入境要求與保險，不把先前免簽規則當成保證。' },
      { id: 'connectivity', title: '準備網路、付款與交通卡', text: 'eSIM／SIM 先確認手機支援；備妥可用付款方式與小額現金。' },
      { id: 'hours', title: '複查營業、休館、預約與庫存', text: '景福宮、博物館、餐廳、SPAREX、雪具分店逐一重查；問清楚現貨尺寸與試穿。' },
      { id: 'events', title: '確認冬季活動檔期', text: '燈飾、市集與溜冰場等 2026 年檔期另查；未公告就留白，不套用上季日期。' },
      { id: 'packing', title: '完成打包與行李額度檢查', text: '保暖分層、防滑鞋、常備藥、充電；預留採買空間並核對運動器材／超尺寸規定。' }
    ] }
  ]
};
