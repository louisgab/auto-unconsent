chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (chrome.runtime.lastError) {
        return
    }
    if (tab.active != true) {
        return
    }
    if (tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://')) {
        return
    }

    if (changeInfo.status == 'loading') {
        chrome.tabs.executeScript(
            tab.id,
            {
                file: 'js/content.js',
                runAt: 'document_end',
            },
            () => {
                console.log('Injected detector on ' + tab.url)
            }
        )
    }
})

chrome.runtime.onMessage.addListener((message, callback) => {
    if (message.found) {
        console.log('Found:' + message.found)
    }
    if (message.success) {
        console.log('Success:' + message.success)
    }
})
