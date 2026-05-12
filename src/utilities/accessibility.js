const handleKeyDown = (e, fxn) => {
    //when enter is clicked while div is in focus
    if (e.keyCode === 13) {
        fxn()
    }
}

export { handleKeyDown }
