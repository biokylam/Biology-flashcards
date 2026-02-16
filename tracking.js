(function() {
  // ==========================================
  // 設定區域：請將下面的網址換成你剛剛複製的 Google Script 網址
  const scriptURL = 'https://script.google.com/macros/s/AKfycbyYo-p7ZbFDcHq3M7ll6YvN9KrBBCrIYBSuHcD36qDBlfw5iuhS-yuxHgqfo0mmIg1uhg/exec'; 
  // ==========================================

  const pageName = window.location.pathname.split("/").pop() || "首頁";

  // 發送資料的通用函式
  function sendToSheet(data) {
    fetch(scriptURL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).catch(error => console.error('Error:', error));
  }

  // 1. 記錄「進入頁面」
  window.addEventListener('load', function() {
    sendToSheet({ eventType: "PAGE_VIEW", pageName: pageName, detail: "進入頁面" });
  });

  // 2. 記錄「停留超過 5 分鐘」
  setTimeout(function() {
    sendToSheet({ eventType: "STAY_OVER_5MIN", pageName: pageName, detail: "停留超過5分鐘" });
  }, 300000);

  // 3. 記錄「章節點擊」 (針對 Ch1-4, Ch5-8 等頁面的按鈕)
  document.addEventListener('DOMContentLoaded', function() {
    const chapterButtons = document.querySelectorAll('.tab'); // 抓取所有 class 為 tab 的按鈕
    
    chapterButtons.forEach(function(btn) {
      btn.addEventListener('click', function() {
        const chapter = this.getAttribute('data-chapter'); // 抓取 data-chapter 屬性
        if (chapter) {
          sendToSheet({
            eventType: "CLICK_CHAPTER",
            pageName: pageName,
            detail: "點選了 " + chapter
          });
        }
      });
    });
  });
})();
