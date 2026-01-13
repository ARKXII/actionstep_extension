function actionStepQOL() {
  const actionType = document.getElementById("action_type_id");
  const stepSelect = document.getElementById("action_type_step_number");

  //search for select elements
  if (!actionType) {
    console.debug("Action Type element (#action_type_id) not found.");
    return false;
  }

  if (!stepSelect) {
    console.debug("Current Step element (#action_type_step_number) not found.");
    return false;
  }
  //set select box height
  actionType.style.height = "700px";
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
    return true;
  } catch (error) {
    console.debug("Error inserting textbox:", error.message);
    return false;
  }
}

const result = actionStepQOL();
if (result) {
  console.log("actionStepQOL completed successfully");
} else {
  console.log("actionStepQOL did not complete");
}
