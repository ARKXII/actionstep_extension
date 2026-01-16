//toast function
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
    }, 5000);
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

//start actionStepQOL
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

//client >> accounting ratesheet override copy
function ratesheetOverride() {
  const table = document.querySelector("table.as-subform");
  if (!table) console.log("No ratesheet table found");
  else {
    const data = [];

    const rows = table.querySelectorAll("tbody tr.js-subform-row");

    rows.forEach((row) => {
      const rowData = {};

      const rateNameInput = row.querySelector('input[name*="rate_name"]');
      const defaultRateInput = row.querySelector('input[name*="default_rate"]');
      const overrideRateInput = row.querySelector(
        'input[name*="override_rate"]'
      );
      const participantIdInput = row.querySelector(
        'input[name*="participant_id"]'
      );
      const rateIdInput = row.querySelector('input[name*="rate_id"]');

      if (rateNameInput) {
        rowData["Rate Name"] = rateNameInput.value;
        rowData["Default Rate"] = defaultRateInput
          ? defaultRateInput.value
          : "";
        rowData["Override Rate"] = overrideRateInput
          ? overrideRateInput.value
          : "";
        rowData["Participant ID"] = participantIdInput
          ? participantIdInput.value
          : "";
        rowData["Rate ID"] = rateIdInput ? rateIdInput.value : "";

        data.push(rowData);
      }
    });

    console.log("Ratesheet Data:", data);
    console.table(data);

    const csvFields = [
      "Rate Name",
      "Default Rate",
      "Override Rate",
      "Participant ID",
      "Client Name",
    ];

    const csvContent = [
      csvFields.join(","),
      ...data.map((row) => {
        const contactHeader = document.querySelector(
          ".contact-header__items h1"
        );
        const customText = contactHeader
          ? contactHeader.textContent.trim()
          : "NO_H1_FOUND";

        const values = csvFields.map((field, index) => {
          if (index === 4) {
            return '"' + customText.replace(/"/g, '""') + '"';
          }

          let value = row[field] || "";
          if (value == null || value == "") value = "<NULL>";
          if (
            value.includes(",") ||
            value.includes('"') ||
            value.includes("\n")
          ) {
            value = '"' + value.replace(/"/g, '""') + '"';
          }
          return value;
        });

        const chunks = [];
        for (let i = 0; i < values.length; i += 5) {
          chunks.push(values.slice(i, i + 5).join(","));
        }
        return chunks.join("\n");
      }),
    ].join("\n");

    const textbox = document.createElement("DIV");
    textbox.id = "ratesheet-data";
    textbox.innerHTML = `<div style="border: 1px solid #ccc; padding: 10px; margin-top: 10px;">
    <textarea id="ratesheet-textarea" style="width:100%;height:200px;font-family:monospace;">${csvContent}</textarea>
  </div>`;

    const targetDiv = document.querySelector(
      ".js-rate-sheet-override-elements"
    );
    if (targetDiv) {
      targetDiv.appendChild(textbox);
    } else {
      const newDiv = document.createElement("div");
      newDiv.className = "js-rate-sheet-override-elements";
      newDiv.style.cssText = "margin:20px 0";
      newDiv.appendChild(textbox);
      stepSelect.parentNode
        ? stepSelect.parentNode.insertBefore(newDiv, stepSelect.nextSibling)
        : document.body.appendChild(newDiv);
    }

    const copyDiv = document.createElement("DIV");
    copyDiv.innerHTML = `
<button type="button" onclick="document.getElementById('ratesheet-textarea').select();document.execCommand('copy');this.textContent='Copied';setTimeout(()=>this.textContent='Copy',1500);return false" 
  style="margin-top:8px;padding:6px 12px;background:#4CAF50;color:white;border:none;border-radius:3px;cursor:pointer">
  Copy Rate Sheet CSV
</button>`;
    const appendCopyTarget = document.querySelector(".as-subheader");
    if (appendCopyTarget) {
      appendCopyTarget.appendChild(copyDiv);
    }
  }
}
