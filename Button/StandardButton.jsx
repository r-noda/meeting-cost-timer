// StandardButton.jsx (1つに合体！)
function StandardButton({ children, onClick, id }) {
    return (
        <button type="button" id={id} className="shadow" onClick={onClick}>
            {children}
        </button>
    );
}

export default StandardButton;