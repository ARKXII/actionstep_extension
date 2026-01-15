function buttonClicked(string) {
  // Get toast css
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = chrome.runtime.getURL("toast.css");
  document.head.appendChild(link);

  // Check if snackbar already exists
  let toast = document.getElementById("snackbar");

  if (toast) {
    // Update existing snackbar content
    toast.innerHTML = `${string}`;

    // Make sure it's visible (re-add show class if needed)
    toast.className = "show";

    // Clear any existing timeout to reset the hide timer
    if (toast._hideTimeout) {
      clearTimeout(toast._hideTimeout);
    }

    // Set new timeout to hide after 3 seconds
    toast._hideTimeout = setTimeout(function () {
      toast.className = toast.className.replace("show", "");
    }, 3000);
  } else {
    // Create new snackbar
    toast = document.createElement("div");
    toast.id = "snackbar";
    toast.innerHTML = `${string}`;
    document.body.appendChild(toast);

    // Add the "show" class
    toast.className = "show";

    // After 3 seconds, remove the show class
    toast._hideTimeout = setTimeout(function () {
      toast.className = toast.className.replace("show", "");
    }, 3000);
  }
}

function actionStepQOL() {
  const actionType = document.getElementById("action_type_id");
  const stepSelect = document.getElementById("action_type_step_number");
  const customSelect = document.getElementById(
    "DataCollectionSingleRowPluginData_MultiSelectContainer"
  );
  const inputCustom = document.getElementById(
    "DataCollectionSingleRowPluginData_Input"
  );

  //search for select elements
  //set select box height
  if (actionType) actionType.style.height = "700px";
  if (stepSelect) {
    stepSelect.style.height = "900px";
    const texts = Array.from(stepSelect.selectedOptions).map((o) => o.text);
    const content = texts.join("\n") || "No selections";

    //inject textbox with content
    const textbox = document.createElement("div");
    textbox.innerHTML = `<div style="margin:15px 0;padding:5px;"><textarea style="width:100%;height:500px;padding:8px;border:1px solid #ddd;font-family:Arial;font-size:14px" readonly>${content}</textarea><button type="button" onclick="this.previousElementSibling.select();document.execCommand('copy');this.textContent='Copied';setTimeout(()=>this.textContent='Copy',1500);return false" style="margin-top:8px;padding:6px 12px;background:#4CAF50;color:white;border:none;border-radius:3px;cursor:pointer">Copy</button></div>`;

    const targetDiv = document.querySelector(".ActionTypeStepNumber");
    try {
      if (targetDiv) {
        targetDiv.appendChild(textbox);
      } else {
        const newDiv = document.createElement("div");
        newDiv.className = "ActionTypeStepNumber";
        newDiv.style.cssText = "margin:20px 0";
        newDiv.appendChild(textbox);

        if (stepSelect.parentNode) {
          stepSelect.parentNode.insertBefore(newDiv, stepSelect.nextSibling);
        } else {
          console.debug("Step select element has no parent node.");
          return false;
        }
      }

      console.log("Selected:", texts);
    } catch (error) {
      console.debug("Error inserting textbox:", error.message);
    }
  }
  if (customSelect) customSelect.style.height = "500px";
  if (inputCustom) {
    inputCustom.focus();
  }

  return true;
}

const result = actionStepQOL();
if (result) {
  console.log("actionStepQOL completed successfully");
  buttonClicked("ActionStep QoL scripts loaded!");
} else {
  console.log(result);
}

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
        buttonClicked("Open column in new tab to apply fixes.");
        return; // Found it, no need to check further
      }

      // Also check if DrilldownDialog is within the added node
      if (node.nodeType === node.ELEMENT_NODE && node.querySelector) {
        const drilldownDialog = node.querySelector("#DrilldownDialog");
        if (drilldownDialog) {
          console.log("DrilldownDialog found inside added node!");
          buttonClicked("Open column in new tab to apply fixes.");
          return;
        }
      }
    }
  }
});

// Also check if DrilldownDialog already exists when script loads
if (document.getElementById("DrilldownDialog")) {
  console.log("DrilldownDialog already exists on page load");
  buttonClicked("Open column in new tab to apply fixes. Thanks!");
}

// Start observing
observer.observe(document.body, {
  childList: true,
  subtree: true,
});
