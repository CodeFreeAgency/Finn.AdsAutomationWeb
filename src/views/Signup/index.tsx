import React, { Component } from "react";
import DefaultLayout from "../../layouts/DefaultLayout";
import { Link, Navigate } from "react-router-dom";
import Terms from "../../components/Modal/termsmodal";
import SignupWithGoogle from "../../components/sign/SignupWithGoogle";
import SignupWithFacebook from "../../components/sign/SignupWithFacebook";

interface FormState {
  errorMessage: string,
  redirect: string | null,
  email: string;
  password: string;
  confirmPassword: string;
  showPassword: boolean;
  showPassword2: boolean;
  formStatus: Boolean;

  errors: {
    email: string;
    password: string;
    confirmPassword: string;
  };
}
class SignUp extends Component<{}, FormState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      errorMessage: "",
      redirect: null,
      email: "",
      password: "",
      confirmPassword: "",

      showPassword: false,
      showPassword2: false,
      formStatus: false,

      errors: {
        email: "",
        password: "",
        confirmPassword: "",
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

  handleSubmit = async(event: React.FormEvent) => {
    event.preventDefault();
    const { email, password, confirmPassword } = this.state;

    // Perform validation
    const errors: FormState["errors"] = {
      email: "",
      password: "",
      confirmPassword: "",
    };

    if (!email) {
      errors.email = "Email is required";
    } else if (!this.validateEmail(email)) 
    {
      errors.email = "Invalid email address";

    }

    if (!password) {
      errors.password = "Password is required";
    }
    if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }
    if (Object.values(errors).some((error) => error !== "")) {
      this.setState({ errors });
    } else {
      // Submit the form or perform other actions
      console.log("Form submitted");
      this.setState({ formStatus: true });
    }
    if (this.state.formStatus == true) {
      try {
        const response = await fetch("https://api.aimosa.io/Users/Register ", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });
        const responceData = await response.json();
        let redirectUrl = "/sign-up-success/?email=" + email;
        if (responceData.success === false) {
          console.log("error login", responceData);
          this.setState({ errorMessage: responceData.message });
        } else {
          this.setState({
            redirect: redirectUrl,
          });
          this.setState({ formStatus: false });
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  validateEmail = (email: string) => {
    // Email validation logic (you can use a library or a custom regex pattern)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  togglePasswordVisibility = () => {
    this.setState((prevState) => ({ showPassword: !prevState.showPassword }));
  };
  togglePasswordVisibility2 = () => {
    this.setState((prevState) => ({ showPassword2: !prevState.showPassword2 }));
  };

  render() {
    if (this.state.redirect) {
      return <Navigate to={this.state.redirect} />
    }
    const {
      email,
      password,
      confirmPassword,
      errors,
      showPassword,
      showPassword2,
    } = this.state;
    const isFormValid = email !== "" && confirmPassword !== "";
    return (
      <DefaultLayout>
        <div className="contanier-type1">
          <form onSubmit={this.handleSubmit}>
            <div className="auth-login-icon google-login-icon">
              <div className="googleicon">
                <SignupWithGoogle />
              </div>
            </div>
            <div className="auth-login-icon facebook-login-icon mb-4">
              <SignupWithFacebook />
            </div>
            <div className="separator mb-4">Or</div>
            {this.state.errorMessage && (
              <p className="text-center text-red">{this.state.errorMessage}</p>
            )}
            <div className="mb-3">
              <input
                id="Email"
                className="form-control"
                name="email"
                value={email}
                onChange={this.handleInputChange}
                placeholder="Email"
              />
              {errors.email && (
                <p className="validation-error">{errors.email}</p>
              )}
            </div>
            <div className="mb-4 password-cont">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'} 
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
            <div className="mb-4 password-cont">
              <input
                id="confirmPassword"
                type={showPassword2 ? "text" : "password"}
                className="form-control"
                placeholder="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={this.handleInputChange}
              />
              <span
                className="show-password"
                onClick={this.togglePasswordVisibility2}
              >
                {showPassword2 ? (
                  <i className="fas fa-eye-slash"></i>
                ) : (
                  <i className="fas fa-eye"></i>
                )}
              </span>
              {errors.confirmPassword && (
                <p className="validation-error">{errors.confirmPassword}</p>
              )}
            </div>
            <div className="cont-s">
              <p>
                By clicking ‘Create account’ or ‘continue with google or facebook’ you agree to the  <Link to={""}>aimosa TOS</Link> and <Link to={""}>Privacy policy</Link>
              </p>
            </div>
            <div className="d-grid">
              <button type="submit" className="btn btn-primary "  disabled={!isFormValid}>
                Create account
              </button>
            </div>
            <div className="new-create-account">
              <p>
                Have an account? <Link to={"/sign-in"}>Log in</Link>
              </p>
            </div>

            <Terms handleClose={undefined} show={undefined}>
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h3 className="modal-title">Privacy Policy & Terms</h3>
                  </div>
                  <div className="modal-body">
                    <h5>What is Lorem Ipsum?</h5>
                    <p>
                      <b>Lorem Ipsum</b> is simply dummy text of the printing and
                      typesetting industry. Lorem Ipsum has been the industry's
                      standard dummy text ever since the 1500s, when an unknown
                      printer took a galley of type and scrambled it to make a
                      type specimen book. It has survived not only five centuries,
                      but also the leap into electronic typesetting, remaining
                      essentially unchanged. It was popularised in the 1960s with
                      the release of Letraset sheets containing Lorem Ipsum
                      passages, and more recently with desktop publishing software
                      like Aldus PageMaker including versions of Lorem Ipsum.
                    </p>

                    <h5>Where does it come from?</h5>
                    <p>
                      Contrary to popular belief, Lorem Ipsum is not simply random
                      text. It has roots in a piece of classical Latin literature
                      from 45 BC, making it over 2000 years old. Richard
                      McClintock, a Latin professor at Hampden-Sydney College in
                      Virginia, looked up one of the more obscure Latin words,
                      consectetur, from a Lorem Ipsum passage, and going through
                      the cites of the word in classical literature, discovered
                      the undoubtable source. Lorem Ipsum comes from sections
                      1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The
                      Extremes of Good and Evil) by Cicero, written in 45 BC. This
                      book is a treatise on the theory of ethics, very popular
                      during the Renaissance. The first line of Lorem Ipsum,
                      "Lorem ipsum dolor sit amet..", comes from a line in section
                      1.10.32.
                    </p>
                    <p>
                      The standard chunk of Lorem Ipsum used since the 1500s is
                      reproduced below for those interested. Sections 1.10.32 and
                      1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are
                      also reproduced in their exact original form, accompanied by
                      English versions from the 1914 translation by H. Rackham.
                    </p>

                    <h5>Why do we use it?</h5>
                    <p>
                      It is a long established fact that a reader will be
                      distracted by the readable content of a page when looking at
                      its layout. The point of using Lorem Ipsum is that it has a
                      more-or-less normal distribution of letters, as opposed to
                      using 'Content here, content here', making it look like
                      readable English. Many desktop publishing packages and web
                      page editors now use Lorem Ipsum as their default model
                      text, and a search for 'lorem ipsum' will uncover many web
                      sites still in their infancy. Various versions have evolved
                      over the years, sometimes by accident, sometimes on purpose
                      (injected humour and the like).
                    </p>

                    <h5>Where can I get some?</h5>
                    <p>
                      There are many variations of passages of Lorem Ipsum
                      available, but the majority have suffered alteration in some
                      form, by injected humour, or randomised words which don't
                      look even slightly believable. If you are going to use a
                      passage of Lorem Ipsum, you need to be sure there isn't
                      anything embarrassing hidden in the middle of text. All the
                      Lorem Ipsum generators on the Internet tend to repeat
                      predefined chunks as necessary, making this the first true
                      generator on the Internet. It uses a dictionary of over 200
                      Latin words, combined with a handful of model sentence
                      structures, to generate Lorem Ipsum which looks reasonable.
                      The generated Lorem Ipsum is therefore always free from
                      repetition, injected humour, or non-characteristic words
                      etc.
                    </p>
                  </div>
                </div>
              </div>
            </Terms>
          </form>
        </div>
      </DefaultLayout>
    );
  }
}

export default SignUp;
