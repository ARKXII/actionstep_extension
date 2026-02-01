function processIFrame() {
  const iframe = document.getElementsByClassName("HistoricIlineIframe")[0];
  if (iframe) {
    // Check if iframe is already loaded
    if (
      iframe.contentDocument &&
      iframe.contentDocument.readyState === "complete"
    ) {
      processIframeContent(iframe);
    } else {
      // Wait for iframe to load
      iframe.addEventListener("load", function () {
        processIframeContent(iframe);
      });
    }
  }
}

function processIframeContent(iframe) {
  try {
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    const technicalMessage = iframeDoc.getElementById("technical");

    if (technicalMessage) {
      const technicalMessageValue = technicalMessage.value;
      console.log("Technical Message found in iframe, adjusting height.");

      const technicalMessageRows = technicalMessageValue.split("\n").length;
      const rowHeight = 60;
      const minHeight = 180;
      const calculatedHeight = Math.max(
        minHeight,
        technicalMessageRows * rowHeight,
      );

      technicalMessage.style.height = `${calculatedHeight}px`;
      ExtensionUtils.showToast("Technical Message height adjusted in iframe.");
    }
  } catch (error) {
    console.log("Cannot access iframe:", error.message);
  }
}