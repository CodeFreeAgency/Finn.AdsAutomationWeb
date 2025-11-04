import React, { Component } from "react";
import DefaultLayout from "../../layouts/DefaultLayout";
import { Link, Navigate } from "react-router-dom";
interface FormState {
  redirect: string | null;
  password: string;
  showPassword: boolean;
  token: string;
  errorMessage: string;
  successMessage: string;
  errors: {
    password: string;
  };
}
class SetNewPassword extends Component<{}, FormState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      redirect: null,
      token: window.location.href.split("=")[1],
      password: "",
      showPassword: false,
      errorMessage: "",
      successMessage: "",
      errors: {
        password: "",
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

  onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const { password, token } = this.state;

    // Perform validation
    const errors: FormState["errors"] = {
      password: password ? "" : "Password is required",
    };

    this.setState({ errors });

    if (password) {
      fetch("https://api.aimosa.io/Users/ResetPassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password, token }),
      })
        .then((response) => response.json())
        .then((responseData) => {
          if (responseData.success) {
            this.setState({ successMessage: "Successfully password changed." });
            this.setState({
              redirect: "/sign-in",
            });
          } else {
            this.setState({ errorMessage: responseData.message });
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };

  togglePasswordVisibility = () => {
    this.setState((prevState) => ({ showPassword: !prevState.showPassword }));
  };

  render() {
    if (this.state.redirect) {
      return <Navigate to={this.state.redirect} />;
    }
    const { password, errors, showPassword } = this.state;
    const isFormValid = password !== "";
    return (
      <DefaultLayout>
        <div className="contanier-type1">
          <form onSubmit={this.onSubmit}>
            <h3>Set New Password</h3>
            <p>Enter your new password and rest your password.</p>
            {this.state.errorMessage && (
              <p className="text-center text-red">{this.state.errorMessage}</p>
            )}
            {this.state.successMessage && (
              <p className="text-center text-green">
                {this.state.successMessage}
              </p>
            )}
            <div className="mb-4 password-cont">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className="form-control"
                placeholder="Password"
                name="password"
                value={password}
                onChange={this.handleInputChange}
              />
              <span
                className="show-password"
                onClick={this.togglePasswordVisibility}
              >
                {showPassword ? (
                  <i className="fas fa-eye-slash"></i>
                ) : (
                  <i className="fas fa-eye"></i>
                )}
              </span>
              {errors.password && (
                <p className="validation-error">{errors.password}</p>
              )}
            </div>

            <div className="d-grid">
              <button
                type="submit"
                className="btn btn-primary "
                disabled={!isFormValid}
              >
                Reset Password
              </button>
            </div>
            <div className="new-create-account">
              <p>
                Back to <Link to={"/sign-in"}>Log in</Link>
              </p>
            </div>
          </form>
        </div>
      </DefaultLayout>
    );
  }
}
export default SetNewPassword;
