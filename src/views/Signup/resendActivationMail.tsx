import React, { Component } from "react";
import DefaultLayout from "../../layouts/DefaultLayout";
import { Link, Navigate  } from "react-router-dom";
import Backarrow from "../../assets/images/left-arrow.svg";
interface FormState {
  redirect: string | null,
  email: string;
  errors: {
    email: string;
  };
}
class ResendActicationMail extends Component<{}, FormState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      redirect: null,
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
    fetch('https://api.aimosa.io/Users/ResendActivationEmail', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    })
      .then((response) => response.json())
      .then((responceData) => {
        // Process the response from the server
        let redirectUrl = "/resend-activation-mail-success/?email=" + email;
        if (responceData.success) {
          this.setState({
            redirect: redirectUrl
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
          <form onSubmit={this.handleSubmit}>
            <p>
              <img src={Backarrow} alt="back-arrow" className="left-arrow-cont" />{" "}
              <Link to={"/sign-in"}>Back to Login</Link>
            </p>
            <h3>Resend Activation Email</h3>
            <div className="mb-3">
              {/* <p>
                Enter your email, and we'll send you instructions to rest your
                password.
              </p> */}
              <input
              name="email"
                value={email}
                onChange={this.handleInputChange}
                className="form-control"
                placeholder="Email"
              />
              
              {errors.email && <span className="validation-error">{errors.email}</span>}
            
            </div>
            
            <div className="d-grid">
              <button type="submit" className="btn btn-primary "
              disabled={!isFormValid}>
                Resend Activation Email
              </button>
            </div>
          </form>
        </div>
      </DefaultLayout>
    );
  }
}
export default ResendActicationMail;
