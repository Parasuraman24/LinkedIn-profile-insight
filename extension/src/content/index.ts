console.log('LinkedIn Profile Insights: Content script loaded.');

// Listen for messages from popup
interface MessagePayload {
    action: string;
}

chrome.runtime.onMessage.addListener((request: MessagePayload, _sender: chrome.runtime.MessageSender, sendResponse: (response?: object) => void) => {
    if (request.action === "SCRAPE_VIEWERS") {
        console.log(`[Content Script] Received SCRAPE_VIEWERS request on: ${window.location.href}`);

        // Helper to extract text safely
        const getText = (el: Element | null) => el?.textContent?.trim() || "";

        try {
            // New Strategy: Heuristic Search
            // Instead of relying on specific container classes, look for profile links.
            const profileLinks = Array.from(document.querySelectorAll('a[href*="/in/"]'));
            console.log(`[Content Script] Found ${profileLinks.length} total profile links.`);

            const uniqueProfiles = new Map();

            profileLinks.forEach(link => {
                const href = (link as HTMLAnchorElement).href;
                // Exclude current user or irrelevant links
                if (href.includes("/overlay/") || href.includes("/detail/")) return;

                // Find the closest "card" container.
                // We walk up a few levels.
                const card = link.closest('li') || link.closest('.artdeco-card') || link.closest('div.display-flex') || link.parentElement?.parentElement;

                if (!card) return;

                // Check if we already have this user (deduplicate by URL)
                const urlObj = new URL(href);
                const cleanPath = urlObj.pathname;
                if (uniqueProfiles.has(cleanPath)) return;

                // Attempt to Scrape details from this card context
                // Name often in the link itself or near it
                const name = getText(link.querySelector('span[dir="ltr"]') || link || card.querySelector('.artdeco-entity-lockup__title'));

                // If name is just "LinkedIn Member", skip
                if (name.includes("LinkedIn Member") || name.includes("View profile")) return;

                const headline = getText(card.querySelector('.artdeco-entity-lockup__subtitle') || card.querySelector('.text-body-small') || card.querySelector('.job-title') || card.querySelector('div.truncate'));

                const time = getText(card.querySelector('time') || card.querySelector('.time-badge')) || "Found on page";

                const imgEl = card.querySelector('img');
                const imageUrl = imgEl?.src || "";

                if (name && name.length > 2) {
                    uniqueProfiles.set(cleanPath, {
                        name,
                        headline: headline || "LinkedIn User",
                        time,
                        imageUrl,
                        profileUrl: href
                    });
                }
            });

            const validData = Array.from(uniqueProfiles.values());

            console.log(`[Content Script] Heuristic scraped ${validData.length} unique profiles.`);
            if (validData.length > 0) {
                console.log("First scraped item:", validData[0]);
            }

            sendResponse({ status: "SUCCESS", data: validData });

        } catch (e) {
            console.error("[Content Script] Scraping error:", e);
            sendResponse({ status: "ERROR", message: "Failed to scrape page: " + e });
        }
    }
    // Return true is only needed if we passed sendResponse locally to an async function, 
    // but here we are synchronous (mostly), although sendResponse is robust.
    return true;
});
