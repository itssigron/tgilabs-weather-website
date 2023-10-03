import React, { Component } from "react";
import { Link, useNavigate } from "react-router-dom";
import Alert from 'react-bootstrap/Alert';
import AuthService from "../services/auth.service";

import Form from "../utilities/Forms";
import { Input } from "../utilities/Forms";

function SubmitButton({ state }) {
  const navigate = useNavigate();

  return (
    <div className="text-center">
      <button
        type="submit"
        onClick={e => state.successful ? navigate("/login") : ""}
        className="btn btn-primary w-100 theme-btn mx-auto"
      >
        {state.successful ? "Log In" : "Sign Up"}
        {state.loading && (
          <span className="spinner-border spinner-border-sm" style={{ marginLeft: "5px" }}></span>
        )}
      </button>
    </div>
  )
}

class Register extends Component {
  constructor(props) {
    super(props);
    ["handleRegister", "validate"].forEach(f => this[f] = this[f].bind(this))

    this.state = {
      focused: false,
      loading: false,
      message: "",
      alertVariant: "danger",
      errors: {},
      successful: false
    };
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  validate(field) {
    let validations = {
      email: {
        value: this.email.value,
        isRequired: true,
        isEmail: true,
      },
      password: {
        value: this.password.value,
        isRequired: true,
        minLength: 6
      },
      username: {
        value: this.username.value,
        isRequired: true,
        minLength: 3
      }
    }

    let { errors, isValid } = Form.validator(validations, this.state.errors, field)
    this.setState({
      errors
    })

    return isValid;
  }

  async handleRegister(e) {
    e.preventDefault();
    if (this.state.successful) return;
    if (!this.validate()) {
      this.setState({
        focused: true
      })
      return;
    }

    this.setState({
      message: "Loading...",
      alertVariant: "secondary",
      loading: true
    });

    await this.sleep(600);

    AuthService.register(this.username.value, this.email.value, this.password.value).then(
      response => {
        this.setState({
          message: response.data.message,
          successful: true,
          // its a "success" message in a "warning" variant for better appearance
          alertVariant: "warning",
          loading: false
        });
      },
      error => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        this.setState({
          loading: false,
          message: resMessage,
          alertVariant: "danger",
          successful: false
        });
      }
    );
  }

  componentDidMount() {
    // Map inputs in order to easily access them using "this"
    const inputs = [...document.getElementById("auth-form").getElementsByTagName("input")];
    inputs.forEach(input => this[input.name] = input)
  }

  render() {
    return (
      <>
        <div className="col-12 col-md-7 col-lg-6 auth-main-col text-center">
          <div className="d-flex flex-column align-content-end">
            <div className="auth-body mx-auto">
              <strong className="purple form-title">Create your Account</strong>
              <div className="auth-form-container text-start">
                <form
                  id="auth-form"
                  ref={this.formRef}
                  className="auth-form"
                  onSubmit={this.handleRegister}
                >
                  {!this.state.successful && (
                    <>
                      <Input
                        type="text"
                        name="username"
                        placeholder="Username"
                        validator={this.validate}
                        onBlur={() => this.setState({ focused: false })}
                        onFocus={() => this.setState({ focused: true })}
                        focused={this.state.focused}
                        errors={this.state.errors}
                        required
                      />
                      <Input
                        type="email"
                        name="email"
                        placeholder="Email"
                        validator={this.validate}
                        onBlur={() => this.setState({ focused: false })}
                        onFocus={() => this.setState({ focused: true })}
                        focused={this.state.focused}
                        errors={this.state.errors}
                        required
                      />

                      <div className="password mb-3">
                        <Input
                          type="password"
                          name="password"
                          className="input-group"
                          placeholder="Password"
                          validator={this.validate}
                          onBlur={() => this.setState({ focused: false })}
                          onFocus={() => this.setState({ focused: true })}
                          focused={this.state.focused}
                          errors={this.state.errors}
                          required
                        >
                        </Input>
                      </div>
                    </>
                  )}

                  {this.state.message && (
                    <Alert variant={this.state.alertVariant}>
                      {Array.isArray(this.state.message) && this.state.message.length > 1 ? (
                        <ul>
                          {this.state.message.map((error, index) => (
                            <li key={index}>{error}</li>
                          ))}
                        </ul>
                      ) : (
                        this.state.message
                      )}
                    </Alert>
                  )}

                  <div className="text-center">
                    <SubmitButton state={this.state} />
                  </div>
                </form>

                <hr />
                {!this.state.successful && <div className="auth-option text-center pt-2 purple">
                  Have an account?{" "}
                  <Link className="text-link" to="/login">
                    Sign in{" "}
                  </Link>
                </div>}
              </div>
            </div>
          </div>
        </div >
      </>
    );
  }
}

export default Register;