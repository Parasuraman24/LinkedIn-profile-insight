
// This script runs on the localhost callback page to capture the token
console.log('LinkedIn Profile Insights: Auth script loaded.');

function handleAuthHelper() {
    const dataElement = document.getElementById('auth-success-data');
    if (dataElement) {
        const token = dataElement.getAttribute('data-token');
        const userJson = dataElement.getAttribute('data-user');

        if (token && userJson) {
            try {
                const user = JSON.parse(userJson);

                // Save to Chrome storage
                chrome.storage.local.set({
                    authToken: token,
                    userProfile: user,
                    loginTime: Date.now()
                }, () => {
                    console.log('LinkedIn Profile Insights: Auth data saved to storage.');

                    // Notify background user (optional) or just close
                    chrome.runtime.sendMessage({ action: "AUTH_SUCCESS", user });

                    // Update UI to show we are done
                    document.body.innerHTML = `
                        <div style="font-family: sans-serif; text-align: center; padding-top: 50px; color: green;">
                            <h1>Extension Authenticated!</h1>
                            <p>You can close this tab and return to the extension.</p>
                        </div>
                    `;
                });
            } catch (e) {
                console.error('LinkedIn Profile Insights: Error parsing auth data', e);
            }
        }
    }
}

// Run immediately
handleAuthHelper();
