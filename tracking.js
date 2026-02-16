(function() {
  // ==========================================
  // ⚠️ 重要：請在此填入你的 Google Apps Script 網址
  const scriptURL = 'https://script.google.com/macros/s/AKfycbyYo-p7ZbFDcHq3M7ll6YvN9KrBBCrIYBSuHcD36qDBlfw5iuhS-yuxHgqfo0mmIg1uhg/exec'; 
  // ==========================================

  // --- 核心升級 1: 匿名學生 ID 系統 ---
  // 檢查瀏覽器是否已有 ID，沒有就產生一個新的 (例如: User-8492)
  let userId = localStorage.getItem("bio_user_id");
  if (!userId) {
    userId = "User-" + Math.floor(Math.random() * 100000);
    localStorage.setItem("bio_user_id", userId);
  }

  const pageName = window.location.pathname.split("/").pop() || "首頁";

  // --- 發送數據函式 (已升級) ---
  function sendToSheet(data) {
    // 自動將 User ID 附加到詳細內容中
    // 格式會變成： "原本的備註 | ID: User-12345"
    const finalDetail = (data.detail ? data.detail : "") + " | ID:" + userId;
    
    const payload = {
      eventType: data.eventType,
      pageName: data.pageName,
      detail: finalDetail
    };

    fetch(scriptURL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).catch(error => console.error('Error:', error));
  }

  // --- 事件監聽區 ---

  // 1. 記錄「進入頁面」
  window.addEventListener('load', function() {
    sendToSheet({ eventType: "PAGE_VIEW", pageName: pageName, detail: "進入" });
  });

  // 2. 記錄「停留超過 5 分鐘」 (代表有深讀)
  setTimeout(function() {
    sendToSheet({ eventType: "STAY_5MIN", pageName: pageName, detail: "停留長讀" });
  }, 300000); // 5分鐘

  // 3. 記錄「章節切換」 (針對有 tab 按鈕的頁面)
  document.addEventListener('DOMContentLoaded', function() {
    const chapterButtons = document.querySelectorAll('.tab'); 
    chapterButtons.forEach(function(btn) {
      btn.addEventListener('click', function() {
        const chapter = this.getAttribute('data-chapter');
        if (chapter) {
          sendToSheet({ eventType: "CLICK_TAB", pageName: pageName, detail: "切換至 " + chapter });
        }
      });
    });

    // 4. (新功能) 嘗試追蹤學習互動
    // 監聽網頁上所有的點擊，如果是按鈕，就記錄一下
    document.body.addEventListener('click', function(e) {
      // 如果點擊的是按鈕 (例如 困難/中等/容易)
      if (e.target.tagName === 'BUTTON') {
        // 排除掉章節切換按鈕 (以免重複記錄)
        if (!e.target.classList.contains('tab')) {
           // 記錄按鈕文字，例如 "Hard", "Easy" 或 "翻轉"
           let btnText = e.target.innerText || "按鈕";
           // 限制發送頻率 (這裡簡單做，只記錄有意義的長度)
           if(btnText.length < 20) {
             // 這裡設一個 10% 機率發送，避免學生狂按導致數據爆炸 (可選)
             // 為了測試，我們先每次都發
             sendToSheet({ eventType: "INTERACTION", pageName: pageName, detail: "點擊: " + btnText });
           }
        }
      }
    });
  });

})();
