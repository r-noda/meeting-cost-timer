import "../src/style/style.css";
import { createRoot } from "react-dom/client";
import { useState, useEffect } from 'react';
import Timer from "./Timer/Timer";
// 新しく作成するコンポーネント（後述）
import MemberList from "./Member/MemberList";
import StandardButton from "./Button/StandardButton";

export const Contents = () => {
    // --- State管理 ---
    const [members, setMember] = useState([{ id: 1, name:"", wage: 0 }, { id: 2, name:"", wage: 0 }]);
    const [totalWage, setTotalWage] = useState(0);
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [seconds, setSeconds] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [teamList, setTeamList] = useState(() => {
        // ページ読み込み時にLocalStorageからデータを取ってくる
        const savedTeams = localStorage.getItem("teams");
        return savedTeams ? JSON.parse(savedTeams) : [];
    });
    const [deleteTeam, setDeleteTeam] = useState("");


    // --- 【追加】チーム保存ロジック ---
    const handleSaveTeam = () => {
        let teamName = "";
        let isNameValid = false;

        // 以前作った「正しい名前が入るまでループ」を再利用
        while (!isNameValid) {
            teamName = prompt("チーム名を入力してください (例:新商品開発チーム)", "○○チーム");
            if (teamName === null) return; // キャンセル時
            if (teamName.trim() === "") {
                alert("名前を入力してください！");
                continue;
            }

            const isDuplicate = teamList.find(t => t.name === teamName);
            if (isDuplicate) {
                if (confirm("既に存在します。上書きしますか？")) {
                    isNameValid = true; // 上書きOKならループ脱出
                } else {
                    continue; // キャンセルなら再入力へ
                }
            } else {
                isNameValid = true; // 新規ならOK
            }
        }

        // --- ここからはReactの流儀 ---
        const wagesToSave = members.map(m => m.wage);
        const namesToSave = members.map(m => m.name);
        const newTeam = { name: teamName, memberName: namesToSave, wages: wagesToSave };

        // すでに存在するか再度チェックして分岐更新
        const exists = teamList.find(t => t.name === teamName);
        if (exists) {
            setTeamList(teamList.map(t => t.name === teamName ? newTeam : t));
        } else {
            setTeamList([...teamList, newTeam]);
        }
        
        alert("保存しました！");
    };

    // --- 削除チーム選択ロジック ---
    const selectDeleteTeam = (e) => {
        setDeleteTeam(e.target.value);
    }
    
    // --- 選択されたチームの削除ロジック ---
    const deleteSelectedTeam = () => {
        // 早期リターン：何も選ばれていなければ何もしない
        if (!deleteTeam) return;

        if (window.confirm(`チーム「${deleteTeam}」を完全に削除しますか？`)) {
            setTeamList(prevList => prevList.filter(t => t.name !== deleteTeam));
            setDeleteTeam(""); // 選択状態をリセット
        }
    }
    
    // --- チーム読み込みロジック ---
    const handleSelectTeam = (e) => {
        const selectedName = e.target.value;
        if (!selectedName) return;

        const targetTeam = teamList.find(t => t.name === selectedName);
        
        if (targetTeam && targetTeam.memberName && targetTeam.wages) {
            // targetTeam.memberName をベースに、同じ index の時給を組み合わせて復元
            const restoredMembers = targetTeam.memberName.map((name, index) => ({
                id: Date.now() + index,    // ユニークなIDを付与
                name: name,                // 名前配列から取得
                wage: targetTeam.wages[index] || 0, // 時給配列の同じ位置から取得（なければ0）
            }));

            setMember(restoredMembers); // 画面に表示するメンバーリストを更新
        }
    };

    // メンバーを追加
    const additionMember = () => {
        setMember([...members, { id: Date.now(), wage: 0 }]);
    };
    
    // メンバーを削除
    const removeMember = (idToRemove) => {
        setMember(members.filter((m) => m.id !== idToRemove));
    };
    
    // メンバーの時給を入力
    const updateWage = (id, field, value) => {
        setMember(members.map(member => 
            // IDが一致するメンバーだけを更新
            member.id === id 
            ? { ...member, [field]: field === "wage" ? Number(value) : value } 
            : member
        ));
    };

    // メンバーを確定
    const confirmMembers = () => {
        const activeMembers = members.filter(m => Number(m.wage) > 0);
        if (activeMembers.length === 0) {
            alert("時給を一人以上入力してください！");
            return;
        }
        const total = activeMembers.reduce((sum, m) => sum + Number(m.wage), 0);
        setMember(activeMembers);
        setTotalWage(total);
        setIsConfirmed(true);
    };

    const handleFinish = () => {
        if (window.confirm("会議を終了してメニューに戻りますか？（計測はリセットされます）")) {
            setIsConfirmed(false);
            // ここでタイマーをストップさせたり、
            // データを保存する処理を呼ぶとさらに完璧です！
        }
    }

    // --- タイマーロジック ---
    useEffect(() => {
        let interval = null;
        if (isActive) {
            interval = setInterval(() => setSeconds((prev) => prev + 1), 1000);
        } else {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isActive]);

    useEffect(() => {
        // teamListが更新されるたびに実行される
        localStorage.setItem("teams", JSON.stringify(teamList));
    }, [teamList]); // 監視対象をteamListにする

    const formatTime = (totalSeconds) => {
        const h = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
        const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
        const s = (totalSeconds % 60).toString().padStart(2, '0');
        return `${h}:${m}:${s}`;
    };

    // --- 計算プロパティ ---
    const currentCost = Math.floor((totalWage * seconds) / 3600);

    return (
        <div>
            <h1 className="mainTitlte">会議のコストタイマー</h1>
            {isConfirmed && (
                <>
                    <Timer>{formatTime(seconds)}</Timer>
                    <div id="timer">
                        <StandardButton className="shadow" id="start" onClick={() => setIsActive(true)}>スタート</StandardButton>
                        <StandardButton className="shadow" id="stop" onClick={() => setIsActive(false)}>ストップ</StandardButton>
                        <StandardButton className="shadow" id="reset" onClick={() => { setIsActive(false); setSeconds(0); }}>リセット</StandardButton>
                    </div>
                    <div className="costInfo">
                        <p>この会議の合計コスト<span id="totalCost">{currentCost}</span>円</p>
                        <p>１分あたりのコスト<span>{Math.floor(totalWage / 60)}</span>円</p>
                        <p>出席者の時給の合計<span>{totalWage}</span>円</p>
                    </div>
                </>
            )}
            
            <div className="textWrapper">
                {!isConfirmed && (
                    <StandardButton id="addMember" onClick={additionMember}>出席者を追加</StandardButton>
                )}

                <MemberList 
                    members={members} 
                    isConfirmed={isConfirmed} 
                    onRemove={removeMember} 
                    onUpdate={updateWage} 
                />

                {!isConfirmed && (
                    <StandardButton id="confirmMembers" onClick={confirmMembers}>会議の出席者を確定</StandardButton>
                )}

                {!isConfirmed && (
                    <div className="setupControls">
                        <StandardButton id="save" onClick={handleSaveTeam}>現在の出席者を保存</StandardButton>                        
                        <select id="teamSelect" onChange={handleSelectTeam} className="shadow">
                            <option value="">保存したチームを読み込む</option>
                            {teamList.map((team, index) => (
                                <option key={index} value={team.name}>{team.name}</option>
                            ))}
                        </select>
                        <div className="deleteButtonWrapper">
                            <select id="deleteTeamSelect" className="shadow" value={deleteTeam} onChange={selectDeleteTeam}>
                                <option value="">削除するチームを選択</option>
                                {teamList.map((team, index) => (
                                    <option key={index} value={team.name}>{team.name}</option>
                                ))}
                            </select>
                            <StandardButton id="delete" onClick={deleteSelectedTeam} disabled={!deleteTeam}>削除</StandardButton>
                        </div>
                    </div>
                )}
                {isConfirmed && (
                    <StandardButton id="finish" onClick={handleFinish} >会議を終了する</StandardButton>
                )}
            </div>
        </div>
    );
};


const root = createRoot(document.getElementById("container"));
root.render(<Contents />);
