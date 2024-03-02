// GitHub:
const githubRepoUrl = "https://github.com/nekonado/kanbansection-observer";

// DOM 検索して対象の要素を取得する関数
function findTargetElement(status) {
  const kanbanElement = document.getElementById("kanban");
  if (!kanbanElement) return null;

  const sections = kanbanElement.getElementsByTagName("section");

  for (const section of sections) {
    const divElement = section.getElementsByTagName("div")[0];
    const textContent = divElement ? divElement.textContent.trim() : "";
    const isStatusMatch = new RegExp(status).test(textContent);
    let nextSibling = divElement.nextElementSibling;

    // div の次の要素が ul でない場合は次の要素をたどる
    while (nextSibling && nextSibling.tagName !== "UL") {
      nextSibling = nextSibling.nextElementSibling;
    }

    if (isStatusMatch && nextSibling && nextSibling.tagName === "UL") {
      return nextSibling;
    }
  }

  return null;
}

// オプションを取得する関数
function getOptions() {
  return new Promise((resolve, reject) => {
    if (chrome.runtime.lastError) {
      reject(chrome.runtime.lastError);
      return;
    }
    chrome.storage.sync.get({ optionSets: [] }, (result) => {
      resolve(result.optionSets);
    });
  });
}

// オプション取得時のエラーハンドリングを行う関数
function handleGetOptionsError(error) {
  console.error(error);
  console.warn(`
    ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
    ┃ Oops! Something went wrong!               ┃
    ┃ Please check your settings.               ┃
    ┃ If the issue persists,                    ┃
    ┃ Please lend a paw and fix the error.      ┃
    ┃                                           ┃
    ┃   /\\_/\\    GitHub Needs You!    /\\_/\\     ┃
    ┃  ( o.o )   Help Us with a PR!  ( o.o )    ┃
    ┃   > ^ <                         > ^ <     ┃
    ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

    => GitHub Repository: ${githubRepoUrl}
`);
}

// スタイルを適用する関数
function applyStyles(status, color) {
  const targetElement = findTargetElement(status);
  // 背景色を変更
  if (targetElement) {
    targetElement.style.backgroundColor = color + "CC";
    targetElement.style.border = `solid 3px ${color}`;
  }
}

// スタイルをクリアする関数
function clearStyles(status) {
  const targetElement = findTargetElement(status);
  // 背景色をクリア
  if (targetElement) {
    targetElement.style.backgroundColor = "";
    targetElement.style.border = "";
  }
}

// liCount のチェックを行う関数
function checkLiCount(
  targetElement,
  liCount,
  onLiCountMatch,
  onLiCountMismatch
) {
  if (targetElement) {
    const listItems = targetElement.querySelectorAll("li");
    const draggableFalseLiCount = Array.from(listItems).reduce(
      (count, listItem) => {
        const draggableAttributeValue = listItem.getAttribute("draggable");
        if (
          draggableAttributeValue !== null &&
          draggableAttributeValue.toLowerCase() === "false"
        ) {
          return count + 1;
        }
        return count;
      },
      0
    );

    if (draggableFalseLiCount >= liCount) {
      onLiCountMatch();
    } else {
      onLiCountMismatch();
    }
  } else {
    onLiCountMismatch();
  }
}

// 対象の要素を取得してスタイルを適用またはクリアする関数
function findTargetElementAndApplyStyles() {
  getOptions()
    .then((optionSets) => {
      optionSets.forEach(({ status, color, liCount }) => {
        const targetElement = findTargetElement(status);
        // liCount のチェックを行い、スタイルを適用またはクリア
        checkLiCount(
          targetElement,
          liCount,
          () => {
            applyStyles(status, color);
          },
          () => {
            clearStyles(status);
          }
        );
      });
    })
    .catch(handleGetOptionsError);
}

// MutationObserverの作成
const observer = new MutationObserver((mutations) => {
  mutations.forEach(findTargetElementAndApplyStyles);
});

// 監視の開始
observer.observe(document.body, {
  childList: true, // 子ノードの変更を監視
  subtree: true, // 対象ノードの子孫全体を監視
});

// オプションページで保存された値を読み込み、初回適用
findTargetElementAndApplyStyles();

// メッセージ受信時の処理
chrome.runtime.onMessage.addListener(function (message) {
  // メッセージがチェックボックスの状態変更関連であるかを確認
  if (message.type === "checkboxStateChanged") {
    // チェックボックスの状態に応じて背景色を設定するかどうかを判断
    if (!message.isChecked) {
      // // チェックボックスがチェックされている場合の処理
      getOptions()
        .then((optionSets) => {
          optionSets.forEach(({ status }) => {
            const targetElement = findTargetElement(status);
            if (targetElement) {
              targetElement.style.backgroundColor = "";
              targetElement.style.border = "";
            }
          });
        })
        .catch((error) => {
          handleGetOptionsError(error);
        });
    } else {
      // チェックボックスがチェックされていない場合の処理
      findTargetElementAndApplyStyles();
    }
  }
});

// 初回実行時のログ表示
console.info(`
  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
  ┃ Thank you for your support!                        ┃
  ┃ We'd love to receive a star on GitHub!             ┃
  ┃                                                    ┃
  ┃   /\\_/\\    GitHub Star is Welcome!      /\\_/\\      ┃
  ┃  ( o.o )   Show your love with a star! ( o.o )     ┃
  ┃   > ˇ <                                 > ˇ <      ┃
  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

  => GitHub Repository: ${githubRepoUrl}
`);
