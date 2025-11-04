import React, { Component } from "react";
import DefaultLayout from "../../layouts/DefaultLayout";
import { Link, Navigate, useNavigate } from "react-router-dom";
import SignInWithFacebook from "../../components/sign/SignInWithFacebook";
import SignInWithGoogle from "../../components/sign/GoogleSignIn";
import adsLogo from "../../assets/images/icons/adslogo.png";
import Captens from "../../assets/images/logocaptens.svg";
import Logo from "../../assets/images/finnLogo.png";
import Header from "../../shared/Header";
interface FormState {
  errorMessage: string;
  redirect: string | null;
  email: string;
  password: string;
  showPassword: boolean;
  errors: {
    email: string;
    password: string;
  };
  loading: boolean;
  profileOptions: { value: string; label: string }[];
}

class SignIn extends Component<{}, FormState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      errorMessage: "",
      redirect: null,
      email: "",
      password: "",
      showPassword: false,
      errors: {
        email: "",
        password: "",
      },
      loading: false,
      profileOptions: [],
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
  handleSubmit = async (event: React.FormEvent) => {
    this.setState({ loading: true });
    event.preventDefault();
    const { email, password } = this.state;

    const errors: FormState["errors"] = {
      email: "",
      password: "",
    };

    if (!email) {
      errors.email = "Email is required";
    } else if (!this.validateEmail(email)) {
      errors.email = "Invalid email address";
    }

    if (!password) {
      errors.password = "Password is required";
    }

    if (Object.values(errors).some((error) => error !== "")) {
      this.setState({ errors, loading: false });
      return;
    } else {
      console.log("Form submitted");
    }

    try {
      const response = await fetch(
        "http://18.207.111.239/Users/Login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const responseData = await response.json();
      const profiles = responseData.result.profiles;
      const uniqueProfilesMap = new Map();

      profiles.forEach((profile) => {
        if (!uniqueProfilesMap.has(profile.name)) {
          uniqueProfilesMap.set(profile.name, profile);
        }
      });

      const uniqueProfiles = Array.from(uniqueProfilesMap.values());

      const profileOptions = uniqueProfiles.map((profile) => ({
        value: profile.profileId,
        label: profile.profileName || "Unnamed Profile",
      }));

      console.log(profileOptions);
      this.setState({ profileOptions });
      // console.log(responseData.result.profiles);
      if (!responseData.success) {
        console.log("Error login", responseData);

        this.setState({
          errorMessage:
            response.status !== 500
              ? responseData.message
              : "Something went wrong",
          loading: false,
        });
        return;
      }
      if (!responseData.result.userLogin) {
        this.setState({
          errorMessage: "User data is missing in the response.",
          loading: false,
        });
        return;
      }
      console.log("userName " + responseData.result.userLogin.username);
      console.log("email " + email);
      console.log("accessToken " + responseData.result.accessToken);
      localStorage.setItem("userName", responseData.result.userLogin.username);
      localStorage.setItem("email", email);
      localStorage.setItem("userToken", responseData.result.accessToken);
      this.setState({
        redirect: "/ads/ads-compaign-manager",
        loading: false,
      });
    } catch (error) {
      this.setState({
        errorMessage: "Something went wrong",
        loading: false,
      });
      console.error("Error:", error);
    }
  };

  validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  togglePasswordVisibility = () => {
    this.setState((prevState) => ({ showPassword: !prevState.showPassword }));
  };
  render() {
    if (this.state.redirect) {
      return <Navigate to={this.state.redirect} />;
    }

    const { email, password, errors, showPassword, profileOptions } =
      this.state;
    const isFormValid = email !== "" && password !== "";

    return (
      <div>
        <div className="contanier-type1">
          <div className="box-body">
            <div className="white-box">
              <div className="text-center mb-4 " style={{ fontSize: "25px" }}>
                <img src={Logo} className="bg-white" />
              </div>
              <form onSubmit={this.handleSubmit}>
                {this.state.errorMessage && (
                  <p className="text-center text-red">
                    *{this.state.errorMessage}
                  </p>
                )}
                <div className="mb-3">
                  <label className="lab">Email</label>
                  <input
                    type="text"
                    name="email"
                    className="form-control mt-2"
                    value={email}
                    onChange={this.handleInputChange}
                  />
                  {errors.email && (
                    <span className="validation-error">{errors.email}</span>
                  )}
                </div>
                <div className="mb-0 password-cont">
                  <label className="lab">Password</label>
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    className="form-control mt-2"
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
                    <span className="validation-error">{errors.password}</span>
                  )}
                </div>

                <div
                  className="d-grid mt-3"
                  style={{ fontWeight: "600 !important" }}
                >
                  <button
                    type="submit"
                    className="btn btn-primary "
                    style={{ fontWeight: "600", fontSize: "20px" }}
                  >
                    {!this.state.loading ? (
                      "Log in"
                    ) : (
                      <div className="spinner-box">
                        <div className="pulse-container">
                          <div className="pulse-bubble pulse-bubble-1"></div>
                          <div className="pulse-bubble pulse-bubble-2"></div>
                          <div className="pulse-bubble pulse-bubble-3"></div>
                        </div>
                      </div>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default SignIn;
