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
                {state.successful ? "Log In" : "Reset Password"}
                {state.loading && (
                    <span className="spinner-border spinner-border-sm" style={{ marginLeft: "5px" }}></span>
                )}
            </button>
        </div>
    )
}

class ResetPasswordComponent extends Component {
    constructor(props) {
        super(props);
        ["handleResetPassword", "validate"].forEach(f => this[f] = this[f].bind(this))

        this.state = {
            focused: false,
            loading: true,
            message: "",
            alertVariant: "danger",
            errors: {},
            successful: false,
            email: ""
        };
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    validate(field) {
        let validations = {
            password: {
                value: this.password.value,
                isRequired: true,
                minLength: 6
            },
            confirmPassword: {
                value: this.confirmPassword.value,
                isRequired: true,
                mustMatch: {
                    name: "password",
                    value: this.password.value,
                    error: "Passwords don't match."
                }
            }
        }

        let { errors, isValid } = Form.validator(validations, this.state.errors, field)
        this.setState({
            errors
        })

        return isValid;
    }

    async handleResetPassword(e) {
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

        // Extract the token from the url
        const currentPath = window.location.pathname;
        const pathParts = currentPath.split('/');
        const resetPasswordToken = pathParts[pathParts.length - 1];

        AuthService.resetPassword(resetPasswordToken,
            this.email.value, this.password.value, this.confirmPassword.value).then(
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

    async componentDidMount() {
        // Map inputs in order to easily access them using "this"
        const inputs = [...document.getElementById("auth-form").getElementsByTagName("input")];
        inputs.forEach(input => this[input.name] = input)

        // Extract the token from the URL
        const currentPath = window.location.pathname;
        const pathParts = currentPath.split('/');
        const resetPasswordToken = pathParts[pathParts.length - 1];

        // Validate the reset password token
        try {
            const response = await AuthService.validateResetPasswordToken(resetPasswordToken);
            const { email } = response.data;
            this.setState({
                email,
                loading: false
            });
        } catch (error) {
            // Handle token validation error
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
                successful: false,
            });
        }

    }

    render() {
        return (
            <>
                <div className="col-12 col-md-7 col-lg-6 auth-main-col text-center">
                    <div className="d-flex flex-column align-content-end">
                        <div className="auth-body mx-auto">
                            <strong className="purple form-title">Reset Your Password</strong>
                            <div className="auth-form-container text-start">
                                <form
                                    id="auth-form"
                                    ref={this.formRef}
                                    className="auth-form"
                                    onSubmit={this.handleResetPassword}
                                >
                                    {!this.state.successful && (
                                        <>
                                            <div
                                                className="email mb-3"
                                                style={{ display: !this.state.email ? "none" : "inherit" }}
                                            >
                                                <input
                                                    name="email"
                                                    type="text"
                                                    className="form-control form-input"
                                                    value={this.state.email}
                                                    disabled />
                                            </div>
                                            <div
                                                className="password mb-3"
                                                style={{ display: !this.state.email ? "none" : "inherit" }}
                                            >
                                                <Input
                                                    type="password"
                                                    name="password"
                                                    className="input-group"
                                                    placeholder="New Password"
                                                    validator={this.validate}
                                                    onBlur={() => this.setState({ focused: false })}
                                                    onFocus={() => this.setState({ focused: true })}
                                                    focused={this.state.focused}
                                                    errors={this.state.errors}
                                                    required
                                                />
                                            </div>
                                            <div
                                                className="password mb-3"
                                                style={{ display: !this.state.email ? "none" : "inherit" }}
                                            >
                                                <Input
                                                    type="password"
                                                    name="confirmPassword"
                                                    className="input-group"
                                                    placeholder="Confirm Password"
                                                    validator={this.validate}
                                                    onBlur={() => this.setState({ focused: false })}
                                                    onFocus={() => this.setState({ focused: true })}
                                                    focused={this.state.focused}
                                                    errors={this.state.errors}
                                                    required
                                                />
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

                                    {this.state.email &&
                                        <div className="text-center">
                                            <SubmitButton state={this.state} />
                                        </div>}
                                </form>

                                <hr />
                                {!this.state.successful && <div className="auth-option text-center pt-2 purple">
                                    Remember your password?{" "}
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

export default ResetPasswordComponent;
