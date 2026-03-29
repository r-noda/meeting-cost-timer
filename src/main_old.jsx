import "../src/style/style.css";
import { createRoot } from "react-dom/client";
import { useState, useEffect } from 'react';
import Timer from "./Timer/timer";
// 新しく作成するコンポーネント（後述）
import MemberList from "./Member/MemberList";
import StandardButton from "./Button/StandardButton";

export const Contents = () => {
    // --- State管理 ---
    const [members, setMember] = useState([{ id: 1, wage: 0 }, { id: 2, wage: 0 }]);
    const [totalWage, setTotalWage] = useState(0);
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [seconds, setSeconds] = useState(0);
    const [isActive, setIsActive] = useState(false);


    
    // メンバーを追加
    const additionMember = () => {
        setMember([...members, { id: Date.now(), wage: 0 }]);
    };
    
    // メンバーを削除
    const removeMember = (idToRemove) => {
        setMember(members.filter((m) => m.id !== idToRemove));
    };
    
    // メンバーの時給を入力
    const updateWage = (id, value) => {
        setMember(members.map(m => m.id === id ? { ...m, wage: value } : m));
    };

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
            
            <Timer>{formatTime(seconds)}</Timer>

            {isConfirmed && (
                <div id="timer">
                    <button className="shadow" id="start" onClick={() => setIsActive(true)}>スタート</button>
                    <button className="shadow" id="stop" onClick={() => setIsActive(false)}>ストップ</button>
                    <button className="shadow" id="reset" onClick={() => { setIsActive(false); setSeconds(0); }}>リセット</button>
                </div>
            )}
            
            <div className="textWrapper">
                <div className="costInfo">
                    <p>この会議の合計コスト<span>{currentCost}</span>円</p>
                    <p>１分あたりのコスト<span>{Math.floor(totalWage / 60)}</span>円</p>
                    <p>出席者の時給の合計<span>{totalWage}</span>円</p>
                </div>

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

                <StandardButton id="save">メンバーを保存</StandardButton>
                 <select id="teamSelect"></select>
            </div>
        </div>
    );
};

const root = createRoot(document.getElementById("container"));
root.render(<Contents />);