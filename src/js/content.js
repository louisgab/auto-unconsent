;(() => {
    console.log('Detector started...')

    const observer = new MutationObserver(detector)
    observer.observe(document.querySelector('body'), { childList: true, subtree: true })

    function detector(mutations) {
        mutations.forEach(mutation => {
            if (!mutation.addedNodes.length) {
                return
            }
            let result = Array.from(mutation.addedNodes).some(node => {
                return searchProvider(node)
            })
            if (result) {
                observer.disconnect()
                console.log('Detector ended')
                return
            }
        })
    }

    function searchProvider(node) {
        if (node.id == 'CybotCookiebotDialog') {
            handler(unconsentCookiebot)
            return true
        }
        if (node.classList && node.classList.contains('qc-cmp-ui-container')) {
            handler(unconsentQuantcast)
            return true
        }
        return false
    }

    function unconsentCookiebot() {
        console.log('Detector found Cookiebot')
        chrome.runtime.sendMessage({ found: 'CookieBot' })
        document.querySelector('#CybotCookiebotDialogBodyLevelButtonPreferences').click()
        document.querySelector('#CybotCookiebotDialogBodyLevelButtonStatistics').click()
        document.querySelector('#CybotCookiebotDialogBodyLevelButtonMarketing').click()
        document.querySelector('#CybotCookiebotDialogBodyLevelButtonAccept').click()
    }

    function unconsentQuantcast() {
        console.log('Detector found Quantcast')
        chrome.runtime.sendMessage({ found: 'QuantCast' })
        document.querySelector('#qc-cmp-purpose-button').click()
        const rejectAllButton = document.querySelector('#qcCmpUi > div > div.qc-cmp-purposes-header > div > button.qc-cmp-button.qc-cmp-button-small.qc-cmp-secondary-button') || document.querySelector('#qcCmpUi > div.qc-cmp-nav-bar.qc-cmp-top > div.qc-cmp-nav-bar-buttons-container > button.qc-cmp-button.qc-cmp-secondary-button.qc-cmp-enable-button')
        rejectAllButton.click()
        const saveButton = document.querySelector('#qcCmpUi > div.qc-cmp-nav-bar.qc-cmp-bottom > div:nth-child(2) > button') || document.querySelector('#qcCmpUi > div > div.qc-cmp-nav-bar.qc-cmp-bottom > button')
        saveButton.click()
    }

    function handler(callback) {
        try {
            callback()
            chrome.runtime.sendMessage({ success: 'true' })
        } catch (error) {
            chrome.runtime.sendMessage({ success: 'false' })
            console.log('Detector failed to autounconsent')
            console.error(error)
        }
    }
})()
