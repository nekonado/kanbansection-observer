// 推奨のカラーコード
const recommendedColor = "#DDFF00";

document.addEventListener("DOMContentLoaded", function () {
  const optionsContainer = document.getElementById("options-container");
  const addOptionSetButton = document.getElementById("add-option-set");
  const saveOptionsButton = document.getElementById("saveOptions");
  const resetColorsButton = document.getElementById("resetColors"); // 追加

  // 初期表示時に保存された値を取得して反映
  chrome.storage.sync.get({ optionSets: [] }, function (result) {
    result.optionSets.forEach(addOptionSet);
  });

  // 「Add Option Set」ボタンのクリックイベント
  addOptionSetButton.addEventListener("click", function () {
    addOptionSet();
  });

  // 「Save Options」ボタンのクリックイベント
  saveOptionsButton.addEventListener("click", function () {
    saveOptions();
  });

  // 「Reset Colors」ボタンのクリックイベント
  resetColorsButton.addEventListener("click", function () {
    resetColors();
  });

  // 保存処理
  function saveOptions() {
    // フラグを初期化
    let hasEmptyInput = false;

    const optionSets = Array.from(optionsContainer.children).map(
      (optionSet) => {
        const status = optionSet.querySelector(".status-input").value;
        const color = optionSet.querySelector(".color-input").value;
        const liCount = optionSet.querySelector(".li-count-input").value;

        // いずれかの input が空であればフラグを立てる
        if (!status || !color || !liCount) {
          hasEmptyInput = true;
        }

        return { status, color, liCount };
      }
    );

    // フラグが立っていれば alert を表示して保存を中止
    if (hasEmptyInput) {
      window.alert("Please fill in all input fields before applying options.");
      return;
    }

    chrome.storage.sync.set({ optionSets }, function () {
      console.log("Options applied: ", optionSets);
    });
  }

  // リセット処理
  function resetColors() {
    // すべての色を推奨のカラーコードに設定
    const colorInputs = optionsContainer.querySelectorAll(".color-input");
    colorInputs.forEach((input) => {
      input.value = recommendedColor;
    });
  }

  // 新しい条件入力欄を追加
  function addOptionSet({
    status = "",
    color = recommendedColor,
    liCount = "",
  } = {}) {
    const newOptionSet = document.createElement("div");
    newOptionSet.classList.add("option-set");

    const statusLabel = document.createElement("label");
    statusLabel.textContent = "Status";
    const statusInput = document.createElement("input");
    statusInput.type = "text";
    statusInput.classList.add("status-input");
    statusInput.value = status;

    const liCountLabel = document.createElement("label");
    liCountLabel.textContent = "Max WIP";
    const liCountInput = document.createElement("input");
    liCountInput.type = "number";
    liCountInput.classList.add("li-count-input");
    liCountInput.value = liCount;

    const colorLabel = document.createElement("label");
    colorLabel.textContent = "Color";
    const colorInput = document.createElement("input");
    colorInput.type = "color";
    colorInput.classList.add("color-input");
    colorInput.value = color;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("delete-button");
    deleteButton.addEventListener("click", function () {
      optionsContainer.removeChild(newOptionSet);
    });

    newOptionSet.appendChild(statusLabel);
    newOptionSet.appendChild(statusInput);
    newOptionSet.appendChild(liCountLabel);
    newOptionSet.appendChild(liCountInput);
    newOptionSet.appendChild(colorLabel);
    newOptionSet.appendChild(colorInput);
    newOptionSet.appendChild(deleteButton);

    optionsContainer.appendChild(newOptionSet);
  }
});
