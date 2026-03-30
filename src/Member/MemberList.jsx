function MemberList({ members, isConfirmed, onRemove, onUpdate }) {
    return (
        <div id="members">
            {members.map((member) => (
                <div className="member" key={member.id}>
                    名前:
                    {isConfirmed ? (
                        <span className="memberNameText">{member.name}</span>
                    ) : (
                        <input
                            id={`name-input-${member.id}`} 
                            name={`name-${member.id}`} // name属性も追加するとより良い
                            type="text" 
                            className="memberNameInput"
                            value={member.name || ""} // 名前なら .name ですね！
                            onChange={(e) => onUpdate(member.id, "name", e.target.value)} // "name" を追加
                        />
                    )}
                    時給:
                    {isConfirmed ? (
                        <span className="wageText">{member.wage}円</span>
                    ) : (
                        <>
                            <input
                                type="number" 
                                className="hourlyWageInput"
                                value={member.wage || ""}
                                onChange={(e) => onUpdate(member.id, "wage", e.target.value)} // "wage" を追加
                            />
                            <button className="delete shadow" onClick={() => onRemove(member.id)}>削除</button>
                        </>
                    )}
                </div>
            ))}
        </div>
    );
}
export default MemberList;
