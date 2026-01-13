function actionStepQOL() {
  const actionType = document.getElementById("action_type_id");
  const stepSelect = document.getElementById("action_type_step_number");
  const error = "";
  if (actionType) actionType.style.height = "700px";
  else error = "Action Type element not found.";
  if (stepSelect) {
    stepSelect.style.height = "900px";
    const texts = Array.from(stepSelect.selectedOptions).map((o) => o.text);
    const content = texts.join("\n") || "No selections";
    const textbox = document.createElement("div");
    textbox.innerHTML = `<div style="margin:15px 0;padding:5px;"><textarea style="width:100%;height:500px;padding:8px;border:1px solid #ddd;font-family:Arial;font-size:14px" readonly>${content}</textarea><button type="button" onclick="this.previousElementSibling.select();document.execCommand('copy');this.textContent='Copied';setTimeout(()=>this.textContent='Copy',1500);return false" style="margin-top:8px;padding:6px 12px;background:#4CAF50;color:white;border:none;border-radius:3px;cursor:pointer">Copy</button></div>`;
    const targetDiv = document.querySelector(".ActionTypeStepNumber");
    if (targetDiv) {
      targetDiv.appendChild(textbox);
    } else {
      const newDiv = document.createElement("div");
      newDiv.className = "ActionTypeStepNumber";
      newDiv.style.cssText = "margin:20px 0";
      newDiv.appendChild(textbox);
      stepSelect.parentNode
        ? stepSelect.parentNode.insertBefore(newDiv, stepSelect.nextSibling)
        : document.body.appendChild(newDiv);
    }
    console.log("Selected:", texts);
  } else error = "Current Step element not found.";
}
try {
  actionStepQOL();
} catch {
  console.log(error);
}
