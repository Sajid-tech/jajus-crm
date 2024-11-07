import { Input, Button, Typography } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import styles from "./signin.module.css";
import logo from "../../assets/images/logo_login.png";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import BASE_URL from "../../base/BaseUrl";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();

    let data = {
      email: email,
      name: name,
    };

    var v = document.getElementById("addIndiv").checkValidity();
    var v = document.getElementById("addIndiv").reportValidity();
    if (v) {
      axios({
        url: BASE_URL + `/api/web-send-password?username=${name}&email=${email}`,
        method: "POST",
        data,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }).then((res) => {
        if (res.data.code == "200") {
          toast.success("New Password Sent to your Email");
        } else {
          toast.error("Email Not sent.");
        }
      });
    }
  };

  return (
    <section
      className="flex flex-col lg:flex-row min-h-screen"
      id={styles["main-container"]}
    >
      <div className={styles["sub-container"]}>
        <div className="text-center">
          <div className={styles["img-container"]}>
            {/* <img src={logo} alt="logo" style={{ width: "212px" }} /> */}
          </div>
          <Typography
            variant="paragraph"
            color="white"
            className="text-lg font-normal"
          >
            Enter your user email and user name to reset your password.
          </Typography>
        </div>
        <form
          className="mt-8 mb-2 mx-auto w-full max-w-md lg:w-3/4"
          id="addIndiv"
          autoComplete="off"
        >
          <div className="mb-6 flex flex-col gap-6">
            <Typography
              variant="small"
              color="white"
              className="-mb-3 font-medium"
            >
              User email
            </Typography>
            <Input
              id="email"
              name="email"
              value={email}
              style={{ color : "white"}}
              onChange={(e) => setEmail(e.target.value)}
              size="lg"
              placeholder="Enter email"
              className="!border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
          </div>
          <div className="mb-6 flex flex-col gap-6">
            <Typography
              variant="small"
              color="white"
              className="-mb-3 font-medium"
            >
              User Name
            </Typography>
            <Input
              id="name"
              name="name"
              style={{ color : "white"}}
              size="lg"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="name"
              className="!border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
          </div>
          <Button
            type="submit"
            onClick={onSubmit}
            className={styles["signin-btn"]}
            fullWidth
          >
            Reset Password
          </Button>

          <Typography
            variant="paragraph"
            className="text-center text-white-500 font-medium mt-4"
          >
            Remembered your password?
            <Link to="/" className="text-red-900 ml-1">
              Sign In
            </Link>
          </Typography>
        </form>
      </div>
    </section>
  );
};

export default ForgetPassword;
