// Layout.js
import React from "react";
import { useEffect } from "react";

import "./style.css";
function Layout({ user, successMsg, errorMsg, error, body }) {
  useEffect(() => {
    // Function to load external JavaScript files
    const loadScripts = () => {
      const jqueryScript = document.createElement("script");
      jqueryScript.src =
        "https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js";
      jqueryScript.async = true;
      document.head.appendChild(jqueryScript);

      const bootstrapScript = document.createElement("script");
      bootstrapScript.src =
        "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js";
      bootstrapScript.async = true;
      document.head.appendChild(bootstrapScript);

      const socketIOScript = document.createElement("script");
      socketIOScript.src = "/socket.io/socket.io.js";
      socketIOScript.async = true;
      document.head.appendChild(socketIOScript);

      const sendRequestScript = document.createElement("script");
      sendRequestScript.src = "/js/sendrequest.js";
      sendRequestScript.async = true;
      document.head.appendChild(sendRequestScript);

      // Clean up function to remove the scripts when the component unmounts
      return () => {
        document.head.removeChild(jqueryScript);
        document.head.removeChild(bootstrapScript);
        document.head.removeChild(socketIOScript);
        document.head.removeChild(sendRequestScript);
      };
    };

    // Call the function to load scripts
    const cleanupScripts = loadScripts();

    // Return cleanup function
    return () => {
      cleanupScripts();
    };
  }, []);
  return (
    <div className="container">
      <div className="header clearfix">
        <nav id="reload">
          <ul className="nav nav-pills pull-right">
            {user ? (
              <>
                <input type="hidden" id="currentuser" value={user.username} />
              </>
            ) : (
              <>
                <li role="presentation">
                  <a href="/users/login">Login</a>
                </li>
                <li role="presentation">
                  <a href="/users/register">Register</a>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default Layout;
