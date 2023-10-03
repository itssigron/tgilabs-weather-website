import React, { Component } from "react";
import { Link, useNavigate } from "react-router-dom";
import Alert from 'react-bootstrap/Alert';
import AuthService from "../services/auth.service";
import Form, { Input } from "../utilities/Forms";

function SubmitButton({ state }) {
  const navigate = useNavigate();

  return (
    <div className="text-center">
      <button
        type="submit"
        onClick={() => state.successful ? navigate("/login") : ""}
        className="btn btn-primary w-100 theme-btn mx-auto"
      >
        {state.successful ? "Log In" : "Reset Password"}
        {state.loading && (
          <span className="spinner-border spinner-border-sm" style={{ marginLeft: "5px" }}></span>
        )}
      </button>
    </div>
  )
}

class RequestPasswordReset extends Component {
  constructor(props) {
    super(props);
    ["handlePasswordResetRequest", "validate"].forEach(f => this[f] = this[f].bind(this))

    this.state = {
      focused: false,
      errors: {},
      loading: false,
      message: "",
      alertVariant: "danger",
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
      }
    }

    let { errors, isValid } = Form.validator(validations, this.state.errors, field)
    this.setState({
      errors
    })
    return isValid;
  }

  async handlePasswordResetRequest(e) {
    e.preventDefault();

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

    AuthService.requestPasswordReset(this.email.value).then(
      response => {
        this.setState({
          message: response.data.message,
          // its a "success" message in a "warning" variant for better appearance
          alertVariant: "warning",
          successful: true,
          loading: false
        });
      },
      error => {
        const resMessage = error?.response?.data?.message || error?.response?.data || error.toString();

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
              <strong className="purple form-title">Reset your Password</strong>
              <div className="auth-form-container text-start">
                <form
                  id="auth-form"
                  className="auth-form"
                  onSubmit={this.handlePasswordResetRequest}
                >

                  {!this.state.successful && <>
                    <Input
                      type="text"
                      name="email"
                      placeholder="Email"
                      validator={this.validate}
                      onBlur={() => this.setState({ focused: false })}
                      onFocus={() => this.setState({ focused: true })}
                      focused={this.state.focused}
                      errors={this.state.errors}
                      required
                    />
                  </>}

                  {this.state.message && (
                    <Alert variant={this.state.alertVariant}>
                      {Array.isArray(this.state.message) ? (
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
                  <SubmitButton state={this.state} />
                </form>

                <hr />

                {!this.state.successful && <div className="auth-option text-center pt-2 purple">
                  <Link className="text-link" to="/login">
                    Back to Login{" "}
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

export default RequestPasswordReset;