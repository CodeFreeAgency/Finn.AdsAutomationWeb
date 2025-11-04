import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DefaultLayout from "../../layouts/DefaultLayout";
import ChromeExtn from "../../assets/images/chrome-extension.svg";
import FirefoxExtn from "../../assets/images/firefox-extension.png";
import Logo from "../../assets/brand/logo.svg";

interface FormState {
  redirect: string | null;
  token: string;
  extensionName: string;
  extensionVersion: string;
  extensionType: string;
  manifestVersion: string;
}

const Synckdpextension: React.FC = () => {
  const navigate = useNavigate();

  const [state, setState] = useState<FormState>({
    token: "",
    extensionName: "",
    extensionVersion: "",
    extensionType: "",
    manifestVersion: "",
    redirect: null,
  });

  const [extensionDownloaded, setExtensionDownloaded] =
    useState<boolean>(false);

  useEffect(() => {
    // Check if the message has already been logged
    const isMessageLogged = (window as any).messageLogged;
    if (!isMessageLogged) {
      const browserExtensionElement = document.getElementById(
        "Aimosa_Browser_Extension"
      ) as HTMLInputElement;
      if (browserExtensionElement && browserExtensionElement.value) {
        // Parse the JSON string to convert it into a JavaScript object
        const parsedElement = JSON.parse(browserExtensionElement.value);

        // Set a flag to indicate that the message has been logged
        (window as any).messageLogged = true;

        // Update state with extension information
        setState((prev) => ({
          ...prev,
          extensionType: parsedElement.type,
          manifestVersion: parsedElement.manifest_version,
          extensionName: parsedElement.name || "Not installed",
          extensionVersion: parsedElement.version || "Not installed",
        }));
      }
    }
  }, []);

  const handleSyncClick = () => {
    // Get userToken from local storage
    const userToken = localStorage.getItem("userToken");

    // Log userToken to the console
    console.log("User Token:", userToken);

    // Construct the URL with userToken
    const url = `https://account.kdp.amazon.com?t=${userToken}`;

    // Open a new window with the provided URL and userToken
    const newWindow = window.open(url, "_blank", "width=800,height=600");

    if (newWindow) {
      // Log to the console in the new window
      newWindow.onload = function () {
        (newWindow as any).console.log("User Token in New Window:", userToken);
      };

      // Set up a timer to periodically check if the new window is closed
      const checkClosed = setInterval(() => {
        if (newWindow.closed) {
          console.log("New Window is Closed");
          // Redirect to the dashboard page when the new window is closed
          navigate("/Dashboard");
          clearInterval(checkClosed); // Clear the interval once redirected
        }
      }, 1000);

      newWindow.focus();
    }
  };
  return (
    <div>
      <div className="login-logo">
        <img src={Logo} alt="logo" />
      </div>
      <form>
        <input
          type="hidden"
          id="Aimosa_Browser_Extension"
          value={JSON.stringify({
            name: state.extensionName,
            version: state.extensionVersion,
          })}
        />
        <div className="mb-3">
          <div className="row">
            <div className="col-md-6 mb-3">
              <div className="extension-box">
                <img src={ChromeExtn} alt="chrom extension" className="mb-4" />
                <p> Name: {state.extensionName}</p>
                <p>Extension Version: {state.extensionVersion}</p>
              </div>
            </div>
            <div className="col-md-6 mb-3">
              <div className="extension-box">
                <img
                  src={FirefoxExtn}
                  alt="firefox extension"
                  className="mb-4"
                />
                <p>
                  {" "}
                  Name:
                  {/* {state.extensionName} */}
                </p>
                <p>
                  Extension Version:
                  {/* {state.extensionVersion} */}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="d-grid onboard-success-btn">
          <div className="row">
            <div className="col-md-12">
              <button
                type="submit"
                className="btn btn-primary"
                onClick={handleSyncClick}
              >
                sync
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Synckdpextension;
