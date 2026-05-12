export const isElementInViewport = element => {
    var rect = element.getBoundingClientRect()

    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <=
        (window.innerHeight ||
            document.documentElement
                .clientHeight) /*or $(window).height() */ &&
        rect.right <=
        (window.innerWidth ||
            document.documentElement.clientWidth) /*or $(window).width() */
    )
}

export const getViewportHeight = () => Math.max(document.documentElement.clientHeight, window.innerHeight || 0)

export const hasClass = (...classNames) => classNames.map(([className, truthy]) => truthy ? className : '').join(' ')

export const createEvent = eventName => typeof(Event) === 'function' ?
    new Event(eventName) :
    (() => {
        let event = document.createEvent('Event')

        event.initEvent(eventName, true, true)

        return event
    })()