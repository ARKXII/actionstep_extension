// Create a reusable function to watch for elements
function createElementObserver(elementId, callback, alreadyExistsCallback = null) {
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType !== Node.ELEMENT_NODE) continue;
        
        // Check if the added node itself is the target element
        if (node.id === elementId) {
          console.log(`${elementId} detected!`);
          callback(node);
          return;
        }
        
        // Check if target element is within the added node
        const element = node.querySelector(`#${elementId}`);
        if (element) {
          console.log(`${elementId} found inside added node!`);
          callback(element);
          return;
        }
      }
    }
  });
  
  // Check if element already exists on page load
  const existingElement = document.getElementById(elementId);
  if (existingElement) {
    console.log(`${elementId} already exists on page load`);
    if (alreadyExistsCallback) alreadyExistsCallback(existingElement);
    else callback(existingElement);
  }
  
  return observer;
}

// Function to handle iframe processing
function processIFrame() {
  const iframe = document.getElementById("mainFrame");
  if (!iframe) return;
  
  console.log("Found mainFrame iframe, processing...");
  
  // Function to attempt processing iframe content
  const attemptProcessIframe = () => {
    try {
      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
      
      // Check if we can access the iframe document
      if (!iframeDoc) {
        console.log("Cannot access iframe document, retrying...");
        setTimeout(attemptProcessIframe, 500);
        return;
      }
      
      // Look for technical element
      const technicalMessage = iframeDoc.getElementById("technical");
      
      if (technicalMessage) {
        console.log("Found technical element in iframe!");
        adjustTextareaHeight(technicalMessage);
        
        // Also set up observer inside iframe for dynamic changes
        setupIframeObserver(iframeDoc, technicalMessage);
        
        ExtensionUtils.showToast("Technical Message height adjusted in iframe.");
      } else {
        console.log("Technical element not found yet in iframe, retrying...");
        // Technical element might not be loaded yet, try again
        setTimeout(attemptProcessIframe, 500);
      }
    } catch (error) {
      console.log("Error accessing iframe:", error.message);
      // Might be cross-origin issue
      handleCrossOriginIframe(iframe);
    }
  };
  
  if (iframe.contentDocument?.readyState === "complete") {
    attemptProcessIframe();
  } else {
    iframe.addEventListener("load", attemptProcessIframe, { once: true });
  }
}

// Function to adjust textarea height
function adjustTextareaHeight(textarea) {
  const lineCount = textarea.value.split("\n").length;
  const rowHeight = 25; // Reduced from 60 to match typical line height
  const minHeight = 60; // Height for 3 rows (20px per row)
  const maxHeight = 900; // Optional max height
  
  let calculatedHeight = Math.max(minHeight, (lineCount * rowHeight));
  calculatedHeight = Math.min(calculatedHeight, maxHeight);
  
  textarea.style.height = `${calculatedHeight}px`;
  textarea.style.overflowY = calculatedHeight >= maxHeight ? 'auto' : 'hidden';
  
  console.log(`Adjusted technical message height: ${calculatedHeight}px (${lineCount} lines)`);
  
  // Also update the rows attribute for consistency
  const calculatedRows = Math.max(3, Math.min(lineCount, 20));
  textarea.setAttribute('rows', calculatedRows);
}

// Function to set up observer inside iframe for dynamic content
function setupIframeObserver(iframeDoc, initialTextarea) {
  // Set up input listener for auto-grow
  initialTextarea.addEventListener('input', function() {
    adjustTextareaHeight(this);
  });
  
  // Also set up a mutation observer inside the iframe in case
  // the textarea is replaced dynamically
  try {
    const iframeObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          const newTechnical = iframeDoc.getElementById("technical");
          if (newTechnical && newTechnical !== initialTextarea) {
            console.log("New technical element detected in iframe");
            adjustTextareaHeight(newTechnical);
            newTechnical.addEventListener('input', function() {
              adjustTextareaHeight(this);
            });
          }
        }
      }
    });
    
    iframeObserver.observe(iframeDoc.body, {
      childList: true,
      subtree: true
    });
  } catch (error) {
    console.log("Could not set up iframe observer:", error.message);
  }
}

// Function to handle cross-origin iframes (if needed)
function handleCrossOriginIframe(iframe) {
  console.log("Potential cross-origin iframe detected");
  
  // Try postMessage approach if you control both domains
  // Or use a different strategy
  ExtensionUtils.showToast("Cannot access iframe content due to security restrictions.");
}

// Function to attempt direct access first (fallback)
function tryDirectAccess() {
  const technicalMessage = document.getElementById("technical");
  if (technicalMessage) {
    console.log("Found technical element in main document (not in iframe)");
    adjustTextareaHeight(technicalMessage);
    technicalMessage.addEventListener('input', function() {
      adjustTextareaHeight(this);
    });
  }
}

// Main observers setup
const drilldownObserver = createElementObserver(
  "DrilldownDialog",
  () => ExtensionUtils.showToast("Open column in new tab to apply fixes.")
);

const cleanRoomObserver = createElementObserver(
  "cz-clean-room",
  processIFrame
);

// Also try to find technical element directly in case it's not in iframe
setTimeout(tryDirectAccess, 1000);

// Start observing
const observerConfig = { childList: true, subtree: true };
drilldownObserver.observe(document.body, observerConfig);
cleanRoomObserver.observe(document.body, observerConfig);

console.log("Textarea height adjuster script loaded");