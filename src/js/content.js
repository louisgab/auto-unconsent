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
            handler('Cookiebot', unconsentCookiebot)
            return true
        }
        if (node.classList && node.classList.contains('qc-cmp-ui-container')) {
            handler('Quantcast', unconsentQuantcast)
            return true
        }
        return false
    }

    function unconsentCookiebot() {
        const declineAllButton = document.querySelector('#CybotCookiebotDialogBodyLevelButtonLevelOptinDeclineAllButton')
        if (declineAllButton) {
            declineAllButton.click()
            return
        }

        const prefsCheckbox = document.querySelector('#CybotCookiebotDialogBodyLevelButtonPreferences')
        const statsCheckbox = document.querySelector('#CybotCookiebotDialogBodyLevelButtonStatistics')
        const marketingCheckbox = document.querySelector('#CybotCookiebotDialogBodyLevelButtonMarketing')
        const saveButton = document.querySelector('#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowallSelection') || document.querySelector('#CybotCookiebotDialogBodyLevelButtonAccept')
        prefsCheckbox.checked = false
        statsCheckbox.checked = false
        marketingCheckbox.checked = false
        saveButton.click()
    }

    function unconsentQuantcast() {
        document.querySelector('#qc-cmp-purpose-button').click()
        const rejectAllButton = document.querySelector('#qcCmpUi > div > div.qc-cmp-purposes-header > div > button.qc-cmp-button.qc-cmp-button-small.qc-cmp-secondary-button') || document.querySelector('#qcCmpUi > div.qc-cmp-nav-bar.qc-cmp-top > div.qc-cmp-nav-bar-buttons-container > button.qc-cmp-button.qc-cmp-secondary-button.qc-cmp-enable-button')
        rejectAllButton.click()
        const saveButton = document.querySelector('#qcCmpUi > div.qc-cmp-nav-bar.qc-cmp-bottom > div:nth-child(2) > button') || document.querySelector('#qcCmpUi > div > div.qc-cmp-nav-bar.qc-cmp-bottom > button')
        saveButton.click()
    }

    function handler(name, callback) {
        console.log('Detector found ' + name)
        chrome.runtime.sendMessage({ found: name })
        try {
            callback()
            chrome.runtime.sendMessage({ success: 'true' })
            console.log('Detector unconsented ' + name + ' successfully')
        } catch (error) {
            chrome.runtime.sendMessage({ success: 'false' })
            console.log('Detector failed to autounconsent')
            console.error(error)
        }
    }
})()
