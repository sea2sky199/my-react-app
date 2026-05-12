class LongClickAction {
    constructor(
        longClickTime = 500,
        shortClickCallback = () => {},
        longClickCallback = () => {}
    ) {
        this.longClickTime = longClickTime
        this.shortClickCallback = shortClickCallback
        this.longClickCallback = longClickCallback
    }

    handleClickDown = e => {
        const isMainClick = e.button === 0
        if (!isMainClick) {
            return
        }
        this.isShortClick = true
        this.rowClickTimer = setTimeout(
            () => (this.isShortClick = false),
            this.longClickTime
        )
    }

    handleClickRelease = e => {
        const isMainClick = e.button === 0
        if (!isMainClick) {
            return
        }
        clearTimeout(this.rowClickTimer)
        if (this.isShortClick) {
            this.shortClickCallback()
        } else {
            this.longClickCallback()
        }
    }
}

export { LongClickAction }
