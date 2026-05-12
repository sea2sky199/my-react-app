export const trackPageView = (currentUrl, pageTitle) => {
    let _paq = window._paq || []

    _paq.push(['setCustomUrl', currentUrl])
    _paq.push(['setDocumentTitle', pageTitle])

    // remove all previously assigned custom variables, requires Matomo (formerly Piwik) 3.0.2
    _paq.push(['deleteCustomVariables', 'page'])
    _paq.push(['setGenerationTimeMs', 0])
    _paq.push(['trackPageView'])
}
