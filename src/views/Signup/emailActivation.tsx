import React, { Component } from "react";
import DefaultLayout from "../../layouts/DefaultLayout";
import { Link, Navigate } from "react-router-dom";

interface FormState {
  redirect: string | null,
  email: string;
  token: string;
  errors: {
    email: string;
  };
}
class EmailActivation extends Component<{}, FormState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      redirect: null,
      token: window.location.href.split('=')[1],
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

  componentDidMount() {
    this.activteAccount();
  }

  activteAccount() {
    const { email } = this.state;
    const { token } = this.state;

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
    fetch('https://api.aimosa.io/Users/Activate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    })
      .then((response) => response.json())
      .then((responceData) => {
        // Process the response from the server
        if (responceData.success) {
          this.setState({
            redirect: "/sign-in"
          });
        } else {
          // Email validation failed, handle the error appropriately (e.g., display an error message)
        }
      })
      .catch((error) => {
        // Handle any errors that occurred during the API call
        console.error('Error:', error);
      });
  }

  validateEmail = (email: string) => {
    // Email validation logic (you can use a library or a custom regex pattern)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  render() {
    if (this.state.redirect) {
      return <Navigate to={this.state.redirect} />
    }
    const { email, errors } = this.state;
    const isFormValid = email !== '' ;
    return (
      <DefaultLayout>
        <div className="contanier-type1">
          <form>
            <div className="mb-3">
              <h3>You Successfully activated your email.</h3>
              <p>
                Please click the link to continue.
              </p>
              <p><Link to={"/sign-in"}>click to Login</Link></p>
            
            </div>
          </form>
        </div>
      </DefaultLayout>
    );
  }
}
export default EmailActivation;
