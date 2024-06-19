export const useBodyScroll = () => {    
    const getCurrentCount = () => {
        let currentCount = parseInt(window.document.body.dataset['noScroll'])
        if (isNaN(currentCount)) {
            return 0
        }
        return currentCount
    }

    const setCurrentCount = (newCount) => {
        if (typeof newCount == 'number' && !isNaN(newCount)) {
            window.document.body.dataset['noScroll'] = `${newCount}`
        }
        if (newCount > 0) {
            window.document.body.classList.add('no-scroll')
        }
        else {
            window.document.body.classList.remove('no-scroll')
        }
    }

    const disableScroll = () => {
        const currentCount = getCurrentCount()
        setCurrentCount(currentCount + 1)
    }

    const enableScroll = () => {
        const currentCount = getCurrentCount()
        setCurrentCount(currentCount - 1)
    }

    return {disableScroll, enableScroll}
}