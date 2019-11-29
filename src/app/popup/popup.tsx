import * as React from "react";
import * as ReactDOM from "react-dom";

import "./popup.css";

function Hello() {
  return (
    <div className="popup-padded">
      <h1>{chrome.i18n.getMessage("l10nHello")}</h1>
      <button onClick={loadApp}>Load App</button>
    </div>
  );
}

function loadApp() {
  // Get active tab
  chrome.tabs.query(
    {
      active: true,
      currentWindow: true
    },
    tabs => {
      // Send message to script file
      chrome.tabs.sendMessage(tabs[0].id, { injectApp: true }, response => {
        window.close();
      });
    }
  );
}

ReactDOM.render(<Hello />, document.getElementById("root"));
