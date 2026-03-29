function MemberList({ members, isConfirmed, onRemove, onUpdate }) {
    return (
        <div id="members">
            {members.map((member) => (
                <div className="member" key={member.id}>
                    時給: 
                    {isConfirmed ? (
                        <span className="wageText">{member.wage}円</span>
                    ) : (
                        <>
                            <input 
                                type="number" 
                                className="hourlyWageInput"
                                value={member.wage || ""}
                                onChange={(e) => onUpdate(member.id, e.target.value)}
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