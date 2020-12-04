;(() => {
    console.log('🤐 Detector started...')

    const observer = new MutationObserver(async mutations => {
        mutations.forEach(mutation => {
            if (!mutation.addedNodes.length) {
                return
            }
            let result = Array.from(mutation.addedNodes).some(node => {
                return searchProvider(node)
            })
            if (result) {
                observer.disconnect()
                console.log('🤐 Detector ended')
                return
            }
        })
    })
    observer.observe(document, {
        childList: true,
        subtree: true,
        attributes: true,
    })

    function searchProvider(node) {
        if (node.id == 'CybotCookiebotDialog') {
            handler('Cookiebot', unconsentCookiebot)
            return true
        }
        if (node.classList && node.classList.contains('qc-cmp-ui-container')) {
            handler('Quantcast', unconsentQuantcast)
            return true
        }
        if (node.id == 'didomi-popup') {
            handler('Didomi', unconsentDidomi)
            return true
        }
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
        const moreButton = document.querySelector('#qc-cmp-purpose-button')
        moreButton.click()
        const rejectAllButton = document.querySelector('#qcCmpUi > div > div.qc-cmp-purposes-header > div > button.qc-cmp-button.qc-cmp-button-small.qc-cmp-secondary-button') || document.querySelector('#qcCmpUi > div.qc-cmp-nav-bar.qc-cmp-top > div.qc-cmp-nav-bar-buttons-container > button.qc-cmp-button.qc-cmp-secondary-button.qc-cmp-enable-button')
        rejectAllButton.click()
        const saveButton = document.querySelector('#qcCmpUi > div.qc-cmp-nav-bar.qc-cmp-bottom > div:nth-child(2) > button') || document.querySelector('#qcCmpUi > div > div.qc-cmp-nav-bar.qc-cmp-bottom > button')
        saveButton.click()
    }

    function unconsentDidomi() {
        const moreButton = document.querySelector('#didomi-notice-learn-more-button')
        moreButton.click()
        setTimeout(() => {
            const rejectAllButton = document.querySelector('#didomi-consent-popup .didomi-consent-popup-actions.didomi-buttons.didomi-buttons-all button')
            rejectAllButton.click()
        }, 300)
    }

    function handler(name, callback) {
        console.log('🤐 Detector found ' + name)
        chrome.runtime.sendMessage({ found: name })
        try {
            callback()
            chrome.runtime.sendMessage({ success: 'true' })
            console.log('🤐 Detector unconsented ' + name + ' successfully')
        } catch (error) {
            chrome.runtime.sendMessage({ success: 'false' })
            console.log('🤐 Detector failed to autounconsent')
            console.error(error)
        }
    }
})()
