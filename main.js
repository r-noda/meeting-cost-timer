let startTime; // 開始時刻
let elapsedTime = 0; // 経過時間
let timerInterval; // タイマーID

// 時間をフォーマットする関数 /////////////////////////////////////////////////
function timeToString(time) {
    const date = new Date(time);
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const seconds = String(date.getUTCSeconds()).padStart(2, '0');
    return  {
        minutes,
        timeText: `${hours}:${minutes}:${seconds}`
    };
}


//　メンバー追加　/////////////////////////////////////////////////////////////////
const membersDiv = document.getElementById("members");
const addButton = document.getElementById("addMember");

addButton.addEventListener("click", additionMember);
function additionMember() {
    membersDiv.insertAdjacentHTML(
        "beforeend",
        `<div class="member">
            時給: <input class="hourlyWageInput" type="number">
            <button type="button" class="delete shadow">削除</button>
        </div>`
    );
};


// 削除ボタン（イベント委譲） //////////////////////////////////////////////////////
membersDiv.addEventListener("click", function(e){
    if (e.target.classList.contains("delete")) {
        e.target.closest(".member").remove();
    }
});


//　メンバーを確定　/////////////////////////////////////////////////////////////////
const confirmMembers = document.getElementById("confirmMembers");
confirmMembers.addEventListener("click", sumSalary);

let minuteCost = 0; // 1分当たりのコスト(会議出席者の時給の合計の60分の1)
function sumSalary() {
    let totalHourlyWage = 0; // 会議出席者の時給の合計
    const inputs = document.querySelectorAll('.hourlyWageInput');

    // すべてが空欄の場合、アラートを表示
    let hasValue = false;

    for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].value !== "") {
            hasValue = true;
            break;
        }
    }

    if (!hasValue) {
        alert("時給を入力してください");
        return;
    }
    
    // 全員の時給を合計し、空欄がある場合はそのdivを削除    
    for (let i = 0; i < inputs.length; i++) {
        const member = inputs[i].closest(".member");

        if (inputs[i].value === "") {
            member.remove();
            continue;
        }

        totalHourlyWage += inputs[i].valueAsNumber || 0;
        member.textContent = inputs[i].value + "円";
    }

    const memberTop = document.querySelector('.memberTop');
    memberTop.classList.remove("invisible");


    document.getElementById('totalHourlyWage').textContent = totalHourlyWage; // 1分あたりのコストを表示(小数以下は切り捨て)
    minuteCost = totalHourlyWage / 60; // 会議出席者の時給の合計の60分の1
    console.log(minuteCost)
    document.getElementById('minuteCost').textContent = Math.floor(minuteCost); // 1分あたりのコストを表示(小数以下は切り捨て)

    const timer = document.querySelector('#timer');
    timer.classList.remove("invisible");
    confirmMembers.classList.add("invisible")
    addButton.classList.add("invisible")
}


// スタート機能 /////////////////////////////////////////////////////////////////
function start() {
    clearInterval(timerInterval);
    startTime = Date.now() - elapsedTime;
    timerInterval = setInterval(() => {

    elapsedTime = Date.now() - startTime;

    const result = timeToString(elapsedTime);

    document.getElementById('stopwatch').textContent = result.timeText;

    const minutes = Math.floor(elapsedTime / 60000);

    document.getElementById('totalCost').textContent =
        Math.floor(minutes * minuteCost);

}, 10);
}

// ストップ機能 /////////////////////////////////////////////////////////////////
function stop() {
    clearInterval(timerInterval);
}


// リセット機能 /////////////////////////////////////////////////////////////////
function reset() {
    clearInterval(timerInterval);
    elapsedTime = 0;
    document.getElementById('stopwatch').textContent = "00:00:00";
}


// ボタンにイベントを追加 ///////////////////////////////////////////////////////
document.getElementById('start').addEventListener('click', start);
document.getElementById('stop').addEventListener('click', stop);
document.getElementById('reset').addEventListener('click', reset);