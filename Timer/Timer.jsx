function Timer(props) {
    const { children } = props;
    
    return (
        <div id="stopwatch">
            {children}
        </div>
    )
}

export default Timer;