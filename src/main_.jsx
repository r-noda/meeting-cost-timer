// --- 定数・変数の定義 ---
const saveButton = document.getElementById("save");
const inputElements = document.getElementsByClassName("hourlyWageInput"); // 名前を分かりやすく
const teamSelect = document.getElementById("teamSelect");

// localStorageから取得（なければ空配列）
let teamList = JSON.parse(localStorage.getItem("teams")) || [];

// --- 関数定義 ---
/**
 * セレクトボックスの表示を最新の状態に更新する
 */
function updateTeamSelect() {
    // 一度中身を空にする（重複防止）
    teamSelect.innerHTML = '<option value="">チームを選択してください</option>';
    
    // リストからoptionを生成
    teamList.forEach(team => {
        const optionHTML = `<option value="${team.name}">${team.name}</option>`;
        teamSelect.insertAdjacentHTML('beforeend', optionHTML);
    });
}

/**
 * 現在の入力値を保存する
 */
function saveMember(teamName) {
    // 入力値を配列にまとめる
    const wages = Array.from(inputElements).map(input => input.value);

    // 新しいチームデータを作成
    const newTeamData = {
        name: teamName,
        wages: wages
    };

    // データの更新と保存
    teamList.push(newTeamData);
    localStorage.setItem("teams", JSON.stringify(teamList));
    
    // UIを更新
    updateTeamSelect();
    alert(`チーム「${teamName}」を保存しました`);
}

/**
 * 選択されたチームの時給を入力欄に反映する
 */
function reflectWages(selectedName) {
    const targetTeam = teamList.find(team => team.name === selectedName);
    
    if (targetTeam) {
        targetTeam.wages.forEach((wage, index) => {
            if (inputElements[index]) {
                inputElements[index].value = wage;
            }
        });
    } 
}

// --- イベントリスナー ---

// 保存ボタン
saveButton.addEventListener("click", () => {
    let teamName = "";
    let isNameValid = false; // 名前がOKかどうかを判定する旗（フラグ）

    while (!isNameValid) {
        teamName = prompt("チーム名を入力してください", "新チーム");

        // 1. キャンセルなら終了
        if (teamName === null) return;

        // 2. 空欄チェック
        if (teamName.trim() === "") {
            alert("名前を入力してください！");
            continue; // whileの先頭に戻る
        }

        // 3. 重複チェック
        // findを使って、同じ名前がすでにあるか探す（簡潔な書き方）
        const isDuplicate = teamList.find(team => team.name === teamName);
        
        if (isDuplicate) {
            if (confirm(`「${teamName}」は既に存在します。上書きしますか？`)) {
                // ここで古いデータを消して、新しいデータを入れる処理を呼ぶ
                updateMember(teamName); 
                return; // 保存して終わる
            }
        } else {
            // 空欄でもなく、重複もしてないならOK！
            isNameValid = true; 
        }
    }

    // ループを抜けた = 名前が確定した
    saveMember(teamName);
});

function updateMember(teamName) {
    teamList = teamList.filter(team => team.name !== teamName);

    // 2. その後、通常の保存処理（saveMember）を呼ぶ
    // これで「消してから新しく保存」という上書きが完成！
    saveMember(teamName);
    
}


// セレクトボックス変更時
teamSelect.addEventListener("change", (event) => {
    reflectWages(event.target.value);
});

// ページ読み込み時の初期化
window.addEventListener("load", updateTeamSelect);