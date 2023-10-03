import React, { Component } from "react";
import { Link, Navigate } from "react-router-dom";
import Alert from 'react-bootstrap/Alert';
import AuthService from "../services/auth.service";
import EventBus from "../services/EventBus.service";
import Form from "../utilities/Forms";
import { Input } from "../utilities/Forms";

class Login extends Component {
    constructor(props) {
        super(props);
        ["handleLogin", "validate", "setRemember"].forEach(f => this[f] = this[f].bind(this))

        this.state = {
            focused: false,
            showPassword: false,
            rememberPassword: false,
            errors: {},
            success: false,
            loading: false,
            message: "",
            alertVariant: "danger"
        };
    }

    setRemember(e) {
        this.setState({
            rememberPassword: e.currentTarget.checked
        })
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    validate(field) {
        let thisObj = this;
        let validations = Object.fromEntries(["emailOrUsername", "password"].map(k => [k, { input: thisObj[k] }]))

        let { errors, isValid } = Form.validator(validations, this.state.errors, field);

        this.setState({
            errors
        })

        return isValid;
    }

    async handleLogin(e) {
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

        AuthService.login(this.emailOrUsername.value, this.password.value).then(
            () => {
                // Call to update the profile (will update the navbar)
                EventBus.dispatch("updateProfile");

                // Set a success state to navigate back to the main page
                this.setState({ success: true });
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
                    alertVariant: "danger"
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
                { // Navigate back to the main page on a successful login
                    this.state.success && <Navigate to='/' />
                }

                <div className="col-12 col-md-7 col-lg-6 auth-main-col text-center">
                    <div className="d-flex flex-column align-content-end">
                        <div className="auth-body mx-auto">
                            <strong className="purple form-title">Login to your account</strong>
                            <div className="auth-form-container text-start">
                                <form
                                    id="auth-form"
                                    ref={this.formRef}
                                    className="auth-form"
                                    onSubmit={this.handleLogin}
                                >
                                    <Input
                                        type="text"
                                        name="emailOrUsername"
                                        placeholder="Email or Username"
                                        validator={this.validate}
                                        onBlur={() => this.setState({ focused: false })}
                                        onFocus={() => this.setState({ focused: true })}
                                        focused={this.state.focused}
                                        errors={this.state.errors}
                                        required
                                    />

                                    <div className="password mb-3">
                                        <Input
                                            type={"password"}
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

                                        <div className="extra mt-3 row justify-content-between">
                                            <center>
                                                <div className="reset-password">
                                                    <Link to="/reset-password">Forgot password?</Link>
                                                </div>
                                            </center>
                                        </div>
                                    </div>
                                    {this.state.message && (
                                        <Alert variant={this.state.alertVariant}>
                                            {this.state.message}
                                        </Alert>
                                    )}
                                    <div className="text-center">
                                        <button
                                            type="submit"
                                            className="btn btn-primary w-100 theme-btn mx-auto"
                                        >
                                            Log In
                                            {this.state.loading && (
                                                <span className="spinner-border spinner-border-sm" style={{ marginLeft: "5px" }}></span>
                                            )}
                                        </button>
                                    </div>
                                </form>

                                <hr />
                                <div className="auth-option text-center pt-2 purple">
                                    No Account?{" "}
                                    <Link className="text-link" to="/register">
                                        Sign up{" "}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div >
                </div >
            </>
        );
    }
}

export default Login;