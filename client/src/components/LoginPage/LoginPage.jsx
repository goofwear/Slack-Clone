import React from "react";
import PropTypes from "prop-types";
import { Redirect } from "react-router-dom";
import { Container } from "semantic-ui-react";
import LoadingOverlay from "react-loading-overlay";

import "./LoginPage.scss";
import { Navbar, ErrorInline } from "@/components/common";
import LoginForm from "./LoginForm";

class LoginPage extends React.Component {
  redirectToRegister = () => {
    const { history } = this.props;
    history.push("/register");
  };

  handleLogin = () => {
    const {
      fieldsValidation,
      clearAllError,
      formFields,
      fetchLoginUser
    } = this.props;
    const fieldErrors = fieldsValidation();

    // fetch login if there are no errors
    if (Object.keys(fieldErrors).length === 0) {
      fetchLoginUser(formFields);
      clearAllError();
    }
  };

  render() {
    const {
      isUserLoggedIn,
      error,
      isLoading,
      fieldErrors,
      formFields,

      handleChange
    } = this.props;
    return (
      <LoadingOverlay active={isLoading} spinner zIndex={10} text="Loading">
        <main className="login-page">
          {isUserLoggedIn && <Redirect to="/workspace" />}
          <Navbar />{" "}
          <Container text>
            <LoginForm
              fieldErrors={fieldErrors}
              formFields={formFields}
              handleLogin={this.handleLogin}
              handleChange={handleChange}
            />
            <br />
            <br /> New to Slack?{" "}
            <a className="redirect" onClick={this.redirectToRegister}>
              Register
            </a>
          </Container>
          <br />
          <div className="inline-error--center">
            {error && <ErrorInline text={`Error: ${error}`} />}
          </div>
        </main>
      </LoadingOverlay>
    );
  }
}

LoginPage.propTypes = {
  isUserLoggedIn: PropTypes.bool.isRequired,
  error: PropTypes.string,
  isLoading: PropTypes.bool.isRequired,
  formFields: PropTypes.object.isRequired,
  fieldErrors: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,

  fetchLoginUser: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  fieldsValidation: PropTypes.func.isRequired
};

export default LoginPage;