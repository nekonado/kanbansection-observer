// 推奨のカラーコード
const recommendedColor = "#DDFF00";

document.addEventListener("DOMContentLoaded", () => {
  const optionsContainer = document.getElementById("options-container");
  const addOptionSetButton = document.getElementById("add-option-set");
  const saveOptionsButton = document.getElementById("save-options");
  const resetColorsButton = document.getElementById("reset-colors");

  // 初期表示時に保存された値を取得して反映
  chrome.storage.sync.get({ optionSets: [] }, (result) => {
    result.optionSets.forEach(addOptionSet);
  });

  // 「Add Option Set」ボタンのクリックイベント
  addOptionSetButton.addEventListener("click", () => {
    addOptionSet();
  });

  // 「Save Options」ボタンのクリックイベント
  saveOptionsButton.addEventListener("click", () => {
    saveOptions();
  });

  // 「Reset Colors」ボタンのクリックイベント
  resetColorsButton.addEventListener("click", () => {
    resetColors();
  });

  // 新しい条件入力欄を追加
  function addOptionSet({
    status = "",
    color = recommendedColor,
    wipLimit = "",
  } = {}) {
    const newOptionSet = document.createElement("div");
    newOptionSet.classList.add("option-set");

    const statusLabel = document.createElement("label");
    statusLabel.textContent = "Status";
    const statusInput = document.createElement("input");
    statusInput.type = "text";
    statusInput.classList.add("status-input");
    statusInput.value = status;

    const wipLimitLabel = document.createElement("label");
    wipLimitLabel.textContent = "WIP Limit";
    const wipLimitInput = document.createElement("input");
    wipLimitInput.type = "number";
    wipLimitInput.classList.add("wip-limit-input");
    wipLimitInput.value = wipLimit;

    const colorLabel = document.createElement("label");
    colorLabel.textContent = "Color";
    const colorInput = document.createElement("input");
    colorInput.type = "color";
    colorInput.classList.add("color-input");
    colorInput.value = color;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("delete-button");
    deleteButton.addEventListener("click", () => {
      optionsContainer.removeChild(newOptionSet);
    });

    newOptionSet.appendChild(statusLabel);
    newOptionSet.appendChild(statusInput);

    newOptionSet.appendChild(wipLimitLabel);
    newOptionSet.appendChild(wipLimitInput);

    newOptionSet.appendChild(colorLabel);
    newOptionSet.appendChild(colorInput);

    newOptionSet.appendChild(deleteButton);

    optionsContainer.appendChild(newOptionSet);
  }

  // 保存処理
  function saveOptions() {
    // フラグを初期化
    let hasEmptyInput = false;

    const optionSets = Array.from(optionsContainer.children).map(
      (optionSet) => {
        const status = optionSet.querySelector(".status-input").value;
        const color = optionSet.querySelector(".color-input").value;
        const wipLimit = optionSet.querySelector(".wip-limit-input").value;

        // いずれかの input が空であればフラグを立てる
        if (!status || !color || !wipLimit) {
          hasEmptyInput = true;
        }

        return { status, color, wipLimit };
      }
    );

    // フラグが立っていれば alert を表示して保存を中止
    if (hasEmptyInput) {
      window.alert("Please fill in all input fields before applying options.");
      return;
    }

    chrome.storage.sync.set({ optionSets }, () => {
      console.log("Options applied: ", optionSets);
    });
    window.alert("Options saved successfully!");
  }

  // リセット処理
  function resetColors() {
    // すべての色を推奨のカラーコードに設定
    const colorInputs = optionsContainer.querySelectorAll(".color-input");
    colorInputs.forEach((input) => {
      input.value = recommendedColor;
    });
  }
});
