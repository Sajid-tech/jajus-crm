import React, { useState } from "react";
import {
  Card,
  CardBody,
  Typography,
  CardHeader,
  Input,
  CardFooter,
  Button,
} from "@material-tailwind/react";
import Layout from "../../layout/Layout";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { baseURL } from "../../base/BaseUrl";
import { toast } from "react-toastify";

const ChangePassword = () => {
  const navigate = useNavigate();

  const [changePassword, setChangePassword] = useState({
    old_password: "",
    password: "",
    confirm_password: "",
  });

  const onInputChange = (e) => {
    setChangePassword({
      ...changePassword,
      [e.target.name]: e.target.value,
    });
  };

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();

    if (changePassword.password !== changePassword.confirm_password) {
      toast.error("Passwords don't match");
      return false;
    }

    let data = {
      old_password: changePassword.old_password,
      password: changePassword.password,
      username: localStorage.getItem("username"),
    };

    var v = document.getElementById("addIndiv").checkValidity();
    var v = document.getElementById("addIndiv").reportValidity();
    if (v) {
      setIsButtonDisabled(true);
      axios({
        url: baseURL + "/web-change-password",
        method: "POST",
        data,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }).then((res) => {
        if (res.data.code == "200") {
          toast.success("Password Updated Successfully");
          navigate("/home");
        } else {
          toast.error("Duplicate Entry");
        }
      });
    }
  };

  return (
    <Layout>
      <div className="mt-12 mb-8 flex flex-col gap-12">
        <Card>
          <form id="addIndiv" autoComplete="off">
            <CardHeader variant="gradient" color="white" className="mb-8 p-6">
              <Typography variant="h6" color="black">
                Change Password
              </Typography>
            </CardHeader>

            <CardBody className="flex flex-col gap-4">
              <Input
                type="password"
                label="Old Password"
                size="lg"
                color="blue"
                required
                name="old_password"
                value={changePassword.old_password}
                onChange={(e) => onInputChange(e)}
              />
              <Input
                type="password"
                label="New Password"
                size="lg"
                color="blue"
                required
                name="password"
                value={changePassword.password}
                onChange={(e) => onInputChange(e)}
              />
              <Input
                type="password"
                label="Confirm Password"
                size="lg"
                color="blue"
                required
                name="confirm_password"
                value={changePassword.confirm_password}
                onChange={(e) => onInputChange(e)}
              />
            </CardBody>
            <CardFooter className="pt-0">
              <Button
                type="submit"
                variant="gradient"
                color="blue"
                fullWidth
                style={{ marginBottom: "10px" }}
                onClick={(e) => onSubmit(e)}
                disabled={isButtonDisabled}
              >
                Submit
              </Button>
              <Link to="/home">
                <Button variant="gradient" color="blue" fullWidth>
                  Cancel
                </Button>
              </Link>
            </CardFooter>
          </form>
        </Card>
      </div>
    </Layout>
  );
};

export default ChangePassword;
