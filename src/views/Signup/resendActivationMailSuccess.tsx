import React, { Component } from "react";
import DefaultLayout from "../../layouts/DefaultLayout";
import { Link } from "react-router-dom";
import LogoSmall from '../../assets/brand/logo-s.svg';

interface FormState {
  email: string;
  errors: {
    email: string;
  };
}
class ResendActicationMailSuccess extends Component<{}, FormState> {

  constructor(props: {}) {
    super(props);
    
    this.state = {
      email: "",
      errors: {
        email: "",
      },
    };
  }
  handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    this.setState((prevState) => ({
      ...prevState,
      [name]: value,
      errors: {
        ...prevState.errors,
        [name]: "",
      },
    }));
  };

  handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const { email } = this.state;

    // Perform validation
    const errors: FormState["errors"] = {
      email: "",
    };

    if (!email) {
      errors.email = "Email is required";
    } else if (!this.validateEmail(email)) {
      errors.email = "Invalid email address";
    }

    if (Object.values(errors).some((error) => error !== "")) {
      this.setState({ errors });
    } else {
      // Submit the form or perform other actions
      console.log("Form submitted");
    }
  
  
    // Make an API call using fetch or any other library of your choice
    fetch('https://api.aimosa.io/Users/ForgotPassword', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    })
      .then((response) => response.json())
      .then((responceData) => {
        // Process the response from the server
        if (responceData.success) {
         
          // Email validation successful, display a success message or perform any necessary actions
        } else {
          // Email validation failed, handle the error appropriately (e.g., display an error message)
        }
      })
      .catch((error) => {
        // Handle any errors that occurred during the API call
        console.error('Error:', error);
      });
      //navigate("/sign-up-success")
  }

  validateEmail = (email: string) => {
    // Email validation logic (you can use a library or a custom regex pattern)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  render() {
    const { email, errors } = this.state;
    const isFormValid = email !== '' ;
    let userEmail = window.location.href.split('=')[1];
    return (
      <DefaultLayout>
        <div className="contanier-type1">
          <form onSubmit={this.handleSubmit}>
            <div className="mb-3">
              <p><img src={LogoSmall} alt="Logo Small" /> </p>
              <h3>Check your email to verify</h3>
              <p>
                Rend Activation link sent to <span className="underline">{userEmail}</span>. Please click the link to continue.
              </p>
              <p>Didn't receive the email? Please check spam folder or <Link to={"/resend-activation-mail"}>click to resend.</Link></p>
            
            </div>
          </form>
        </div>
      </DefaultLayout>
    );
  }
}

export default ResendActicationMailSuccess;
