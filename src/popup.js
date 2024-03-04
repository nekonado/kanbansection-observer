document.addEventListener("DOMContentLoaded", () => {
  // オプション画面へのリンクボタンのクリックイベントリスナーを追加
  document.getElementById("openOptions").addEventListener("click", () => {
    chrome.runtime.openOptionsPage();
  });
});

document.addEventListener("DOMContentLoaded", () => {
  // チェックボックス要素を取得
  const checkbox = document.getElementById("toggleCheckbox");

  // チェックボックスの状態が変更されたときのイベントリスナーを追加
  checkbox.addEventListener("change", () => {
    // チェックボックスの状態に基づいてメッセージを作成
    const message = {
      type: "checkboxStateChanged",
      isChecked: checkbox.checked,
    };

    // content scriptにメッセージを送信
    chrome.tabs.query({ url: "https://*.backlog.com/board/*" }, (tabs) => {
      // 条件に一致するタブが見つかった場合
      if (tabs && tabs.length > 0) {
        // ここでタブにメッセージを送信するなどの操作を行います
        const tabId = tabs[0].id;
        chrome.tabs.sendMessage(tabId, message);
      } else {
        // 条件に一致するタブが見つからなかった場合の処理
        console.log("No tabs matching your criteria were found.");
      }
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const toggleCheckbox = document.getElementById("toggleCheckbox");
  const toggleText = document.getElementById("toggleText");

  // スライダーの初期状態をONに設定する
  toggleCheckbox.checked = true;
  toggleText.textContent = "Lights: ON 🌝";

  toggleCheckbox.addEventListener("change", () => {
    if (toggleCheckbox.checked) {
      toggleText.textContent = "Lights: ON 🌝";
      toggleText.style.color = "#006a58";
    } else {
      toggleText.textContent = "Lights: OFF 🌚";
      toggleText.style.color = "#000000";
    }
  });
});
