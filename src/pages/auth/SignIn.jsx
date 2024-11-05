import { Input, Checkbox, Button, Typography } from "@material-tailwind/react";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL, { baseURL } from "../../base/BaseUrl";
import { ContextPanel } from "../../utils/ContextPanel";
import toast, { Toaster } from "react-hot-toast";
import styles from './signin.module.css'
import logo from '../../assets/images/logo_login.png'

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { isPanelUp } = useContext(ContextPanel);
  const navigate = useNavigate();

  const handleSumbit = async (e) => {
    e.preventDefault();
    if (!isPanelUp) {
      navigate("/maintenance");
      return;
    }

    setLoading(true);

    //create a formData object and append state values
    const formData = new FormData();
    formData.append("username", email);
    formData.append("password", password);

    try {
      // Send POST request to login API with form data
      const res = await axios.post(`${BASE_URL}/api/web-login`, formData);
      console.log(res, "res");
      if (res.status === 200) {
        const token = res.data.UserInfo?.token;
        localStorage.setItem("user_type_id", res.data.UserInfo.user.user_type_id);
        const username = res.data.UserInfo?.user.name;
        localStorage.setItem("username", username);
        if (token) {
          // Store the token in localStorage

          localStorage.setItem("token", token);
          navigate("/home");
        } else {
          toast.error("Login Failed, Token not received.");
        }
      } else {
        toast.error("Login Failed, Please check your credentials.");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred during login.");
    }

    setLoading(false);
  };
  return (
    <>
      <Toaster
        toastOptions={{
          success: {
            style: {
              background: "green",
            },
          },
          error: {
            style: {
              background: "red",
            },
          },
        }}
        position="top-right"
        reverseOrder={false}
      />
      <section className="flex flex-col lg:flex-row min-h-screen" id={styles['main-container']}>
        <div 
        // className="flex-1 lg:w-3/5 m-4 lg:m-12  px-4 lg:px-8"
        className={styles['sub-container']}
        >
          <div className="text-center">
          <div  className={styles['img-container']}>
                  <img src={logo} alt="logo" style={{width:'212px'}}/>
                </div>
            <Typography
              variant="paragraph"
              color="white"
              className="text-lg font-normal"
            >
              Enter your user name and password to Sign In.
            </Typography>
          </div>
          <form
            onSubmit={handleSumbit}
            method="POST"
            className="mt-8 mb-2 mx-auto w-full max-w-md lg:w-3/4"
          >
            <div className="mb-6 flex flex-col gap-6">
              <Typography
                variant="small"
                color="white"
                className="-mb-3 font-medium"
              >
                User Name
              </Typography>
              <Input
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                size="lg"
                placeholder="name@mail.com"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
              <Typography
                variant="small"
                color="white"
                className="-mb-3 font-medium"
              >
                Password
              </Typography>
              <Input
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                size="lg"
                placeholder="********"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
            </div>

            <Button type="sumbit" disabled={loading} className={styles['signin-btn']} fullWidth>
              {loading ? "Checking..." : "Sign In"}
            </Button>

            <div
              style={{
                marginTop: "20px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Typography variant="small" className="font-medium text-white-900">
                <Link to="/forget-password">Forgot Password</Link>
              </Typography>
            </div>
          </form>
        </div>
       
      </section>
    </>
  );
};

export default SignIn;
