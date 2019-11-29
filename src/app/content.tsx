import * as React from "react";
import * as ReactDOM from "react-dom";
import Fade from "@material-ui/core/Fade";
import Button from "@material-ui/core/Button";
import Modal from "@material-ui/core/Modal";
import { makeStyles } from "@material-ui/core/styles";
import NoteAdd from "@material-ui/icons/NoteAdd";

const useStyles = makeStyles(theme => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    width: 400,
    height: 250
  }
}));

chrome.runtime.sendMessage({}, _ => {
  var checkReady = setInterval(() => {
    if (document.readyState === "complete") {
      clearInterval(checkReady);
      console.log("We're in the injected content script!");
      setTimeout(injectApp, 1000);
    }
  });
});

function App() {
  const classes = useStyles({});
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  function toggleModal() {
    setIsModalOpen(!isModalOpen);
  }

  return (
    <>
      <Button
        style={{
          backgroundColor: "transparent",
          borderColor: "rgb(29, 161, 242)",
          borderWidth: "1px",
          color: "rgb(29, 161, 242)",
          borderStyle: "solid",
          height: 37,
          width: 37,
          marginRight: 10,
          marginBottom: 10,
          borderRadius: 100
        }}
        onClick={toggleModal}
      >
        <NoteAdd />
      </Button>
      {isModalOpen && (
        <Modal
          open={isModalOpen}
          onClose={toggleModal}
          className={classes.modal}
        >
          <Fade in={isModalOpen}>
            <div className={classes.paper}>
              <div>
                <h2 id="transition-modal-title">My Notes!</h2>
                <textarea style={{ width: "100%", height: 145 }}>
                  Default value
                </textarea>
              </div>
              <Button onClick={toggleModal}>Submit</Button>
            </div>
          </Fade>
        </Modal>
      )}
    </>
  );
}

// Message Listener function
chrome.runtime.onMessage.addListener((request, sender, response) => {
  // If message is injectApp
  if (request.injectApp) {
    // Inject our app to DOM and send response
    injectApp();
    response({
      startedExtension: true
    });
  }
});

function injectApp() {
  console.warn("omg");
  const userActions = document.querySelector('[data-testid="userActions"]');
  // for (var tweet of tweets) {
  const newDiv = document.createElement("div");
  newDiv.setAttribute("id", "chromeExtensionReactApp");
  userActions.parentNode.insertBefore(newDiv, userActions.nextSibling);
  ReactDOM.render(<App />, newDiv);
  // }
}
