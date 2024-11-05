import React, { Component } from "react";
import { Form } from "react-bootstrap";
import { baseURL } from "../../api";
import Button from "@material-ui/core/Button";
import { Input } from "reactstrap";
import "./login.scss";
import { toast } from "react-toastify";

const style = {
  border: "1px solid rgb(255, 255, 255)",
  boxShadow: "8px 6px 3px #00000030",
  borderRadius: "8px",
  backgroundColor: "#0000007d",
  paddingRight: "0px",
  paddingLeft: "0px",
};

const inputstyle = {
  border: "1px solid rgb(255, 255, 255)",
  borderRadius: "8px",
  color: "#fff",
};
export class ForgetPassword extends Component {
  constructor(props) {
    super(props);

    this.state = { username: "" };
    this.state = { email: "" };
  }

  handleKeyDown = (event) => {
    if (event.key === "Enter") {
      this.onResetPassword();
    }
  };

  onResetPassword() {
    if (this.state.email != "" && this.state.username != "") {
      fetch(
        baseURL +
          `/web-send-password?username=${this.state.username}&email=${this.state.email}`,
        {
          method: "POST",
        }
      )
        .then((response) => response.json())

        .then((response) => {
          toast.success("New Password Sent to your Email");
        })

        .catch((error) => {
          toast.error("Email Not sent.");
        });
    } else {
      toast.warning("Please enter an User Name & Email");
    }
  }

  render() {
    return (
      <div>
        <div className="d-flex align-items-center auth px-0 pagesofload">
          <div className="row w-100 mx-0">
            <div className="col-lg-4 col-md-6 mx-auto" style={style}>
              <div className="auth-form-light text-left py-5 px-4 px-sm-5">
                <div className="brand-logo text-center">
                  <img
                    src={require("../../assets/images/logo_login.png")}
                    alt="logo"
                    style={{ width: "212px" }}
                  />
                </div>
                <Form className="pt-3">
                  <Form.Group className="d-flex search-field">
                    <Input
                      type="email"
                      style={inputstyle}
                      name="user-mail"
                      autoFocus
                      className="has-input input-lg"
                      placeholder="Enter Email Address"
                      onKeyDown={this.handleKeyDown}
                      onChange={(event) =>
                        this.setState({ email: event.target.value })
                      }
                      required
                    />
                  </Form.Group>
                  <Form.Group className="d-flex search-field">
                    <Input
                      type="text"
                      name="user-pwd"
                      style={inputstyle}
                      className="has-input input-lg"
                      placeholder="Enter User Name"
                      onKeyDown={this.handleKeyDown}
                      onChange={(event) =>
                        this.setState({ username: event.target.value })
                      }
                      required
                    />
                  </Form.Group>
                  <a
                    href="login"
                    className="auth-link text-black"
                    style={{ color: "#fff" }}
                  >
                    Already having account? Login
                  </a>
                  <Form.Group className="d-flex search-field"></Form.Group>
                  <div className="mt-3">
                    <Button
                      color="primary"
                      className="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn"
                      variant="contained"
                      size="large"
                      id="signin"
                      style={{
                        borderRadius: "8px",
                        backgroundColor: "#db343fc7",
                      }}
                      onClick={() => this.onResetPassword()}
                    >
                      Reset Password
                    </Button>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ForgetPassword;
