import React, { useState } from "react";
import { GoogleLogin } from "react-google-login";
import { useNavigate } from "react-router-dom";
import { gapi } from "gapi-script";
const SignInWithGoogle = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const responseGoogle = (response) => {
    const { profileObj, tokenObj } = response;
    const { email, givenName, familyName } = profileObj;
    const { accessToken, idToken } = tokenObj;

    const apiData = {
      email: email,
      firstName: givenName,
      lastName: familyName,
      provider: "google",
      authToken: response.accessToken,
      idToken: response.tokenId,
    };

    console.log(apiData);

    fetch("https://api.aimosa.io/Users/OAuthLogin", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("API Response:", data);

        if (data.success) {
          if (data.result.kdpSync) {
            navigate("/Dashboard");
          } else {
            navigate("/onboarding");
          }
        } else {
          console.error("API Error:", data.message);
        }
      });
  };

  const responseErrorGoogle = (response) => {
    if (response.error === "popup_closed_by_user") {
      alert("Sign-in process canceled by the user.");
    } else {
      console.error("Google Error:", response);
    }
  };


  return (
    <div>
      <GoogleLogin
        clientId="732317224628-p81vrbgvh2amf4r3s4bra4m0kv4pkk57.apps.googleusercontent.com"
        buttonText="Login with Google"     
        onSuccess={responseGoogle}
        onFailure={responseErrorGoogle}
        cookiePolicy={"single_host_origin"}
        scope="profile email openid"
      />
    </div>
  );
};

export default SignInWithGoogle;
