// Content script to extract business information and potential leads on the current page

console.log("Assix Lead Extractor Content Script Active.");

// Extract basic structured information from the current document
function extractLeadsAndDetails() {
  const pageTitle = document.title;
  const pageUrl = window.location.href;
  
  // Clean text scraping
  const text = document.body.innerText || "";
  
  // RegEx for contacts
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const phoneRegex = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
  
  const emails = Array.from(new Set(text.match(emailRegex) || []));
  const phones = Array.from(new Set(text.match(phoneRegex) || []));
  
  // Extract social networks links
  const socialLinks: string[] = [];
  document.querySelectorAll('a[href]').forEach((elem) => {
    const href = (elem as HTMLAnchorElement).href;
    if (href.includes("linkedin.com") || href.includes("twitter.com") || href.includes("facebook.com") || href.includes("instagram.com")) {
      socialLinks.push(href);
    }
  });
  
  const uniqueSocials = Array.from(new Set(socialLinks));

  return {
    title: pageTitle,
    url: pageUrl,
    emails: emails.slice(0, 10),
    phones: phones.slice(0, 10),
    socials: uniqueSocials.slice(0, 5),
    timestamp: new Date().toISOString()
  };
}

// Listen for scrape trigger from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "SCRAPE_PAGE") {
    try {
      const data = extractLeadsAndDetails();
      sendResponse({ success: true, data });
    } catch (err: any) {
      sendResponse({ success: false, error: err.message });
    }
  }
  return true;
});

// Assix Browser Agent bridge to communicate with dashboard and forward page-agent events
window.addEventListener('message', (event) => {
  if (event.data?.source !== 'assix-dashboard') return;
  if (event.data?.type === 'ping') {
    window.postMessage({ 
      source: 'assix-agent', type: 'pong' 
    }, '*');
    return;
  }
  if (event.data?.instruction) {
    const taskId = event.data.taskId;
    
    // Listen to page-agent's own activity events
    // and forward them to Assix as step logs
    const activityHandler = (e: MessageEvent) => {
      if (e.data?.channel === 'PAGE_AGENT_EXT_RESPONSE') {
        if (e.data?.action === 'activity_event') {
          window.postMessage({
            source: 'assix-agent',
            taskId,
            type: 'step',
            step: e.data?.payload?.description || 
                  JSON.stringify(e.data?.payload)
          }, '*');
        }
        if (e.data?.action === 'execute_result') {
          window.postMessage({
            source: 'assix-agent',
            taskId,
            status: e.data?.error ? 'failed' : 'complete',
            result: e.data?.payload?.result || 
                    'Task completed',
            error: e.data?.error
          }, '*');
          window.removeEventListener('message', 
            activityHandler);
        }
      }
    };
    window.addEventListener('message', activityHandler);
    
    // Trigger the extension to run the task
    window.postMessage({
      channel: 'PAGE_AGENT_EXT',
      action: 'execute',
      task: event.data.instruction,
      id: taskId
    }, '*');
  }
});
