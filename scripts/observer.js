// Main observer - watches for DrilldownDialog
const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    for (const node of mutation.addedNodes) {
      // Check if the added node itself is the DrilldownDialog
      if (
        node.nodeType === node.ELEMENT_NODE &&
        node.id === "DrilldownDialog"
      ) {
        console.log("DrilldownDialog detected!");
        ExtensionUtils.buttonClicked("Open column in new tab to apply fixes.");
        return; // Found it, no need to check further
      }

      // Also check if DrilldownDialog is within the added node
      if (node.nodeType === node.ELEMENT_NODE && node.querySelector) {
        const drilldownDialog = node.querySelector("#DrilldownDialog");
        if (drilldownDialog) {
          console.log("DrilldownDialog found inside added node!");
          ExtensionUtils.buttonClicked(
            "Open column in new tab to apply fixes."
          );
          return;
        }
      }
    }
  }
});

// Also check if DrilldownDialog already exists when script loads
if (document.getElementById("DrilldownDialog")) {
  console.log("DrilldownDialog already exists on page load");
  ExtensionUtils.buttonClicked(
    "Open column in new tab to apply fixes. Thanks!"
  );
}

// Start observing
observer.observe(document.body, {
  childList: true,
  subtree: true,
});