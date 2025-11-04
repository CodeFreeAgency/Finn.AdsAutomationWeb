import React from 'react';
// import FacebookLogin from 'react-facebook-login';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';

import FacebookIcon from "../../assets/images/facebook-icon.svg";

const SignInWithFacebook = () => {
  const responseFacebook = (response) => {
    console.log(response); // You can handle the response here
  };

  return (
    <div className='facebookicon'>
      <FacebookLogin
        appId="1849303572152431"
        autoLoad={false}
        fields="name,email,picture" // Specify the fields you want to retrieve
        callback={responseFacebook} // Handle the response
        render={renderProps => (
          <button onClick={renderProps.onClick}>
            <img src={FacebookIcon} alt="facebook icon" />
            <span>Continue with Facebook</span>
          </button>
        )}
      />
    </div>
  );
};

export default SignInWithFacebook;
