import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import BASE_URL, { baseURL } from "../../base/BaseUrl";
import { IconButton, MenuItem, Button, TextField } from "@mui/material";
import { Delete } from "@mui/icons-material";
import Layout from "../../layout/Layout";
import Fields from "../../common/TextField/TextField";
import { MdKeyboardBackspace } from "react-icons/md";
import { Input } from "@material-tailwind/react";
import { FaPlus } from "react-icons/fa";

const type = [
  {
    value: "Granites",
    label: "Granites",
  },
  {
    value: "Tiles",
    label: "Tiles",
  },
];

const AddEstimate = (props) => {
  const navigate = useNavigate();
  const inputRef = useRef(null);

  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();

  today = mm + "/" + dd + "/" + yyyy;
  var midate = "04/04/2022";
  var todayback = yyyy + "-" + mm + "-" + dd;
  const [currentYear, setCurrentYear] = useState(null);

  const [estimate, setEstimate] = useState({
    estimate_date: todayback,
    estimate_year: currentYear,
    estimate_type: "",
    estimate_customer: "",
    estimate_address: "",
    estimate_mobile: "",
    estimate_item_type: "",
    estimate_tax: "",
    estimate_tempo: "",
    estimate_loading: "",
    estimate_unloading: "0",
    estimate_other: "",
    estimate_gross: "",
    estimate_advance: "",
    estimate_balance: "",
    estimate_no_of_count: "",
    estimate_sub_data: "",
  });

  const useTemplate2 = {
    received_about: "",
    received_amount: "",
    received_about_new: "",
  };

  const [received, setReceived] = useState([useTemplate2]);

  const [payment_count, setPaymentCount] = useState(1);

  const [estimate_ref, setEstimateRef] = useState([]);

  const [received_count, setReceivedCount] = useState(1);

  const [productTypeGroup, setProductTypeGroup] = useState([]);

  const useTemplate = {
    estimate_sub_type: "",
    estimate_sub_item: "",
    estimate_sub_qnty: "",
    estimate_sub_qnty_sqr: "",
    estimate_sub_rate: "",
    estimate_sub_amount: "",
  };

  const [users, setUsers] = useState([useTemplate]);
  const [estimate_count, setCount] = useState(1);


  useEffect(() => {
    var theLoginToken = localStorage.getItem("token");

    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: "Bearer " + theLoginToken,
      },
    };

    fetch(BASE_URL + "/api/web-fetch-year", requestOptions)
      .then((response) => response.json())
      .then((data) => setCurrentYear(data.year?.current_year));
  }, []);



  const addItem = () => {
    setUsers([...users, useTemplate]);
    setCount(estimate_count + 1);
  };

  const onChange = (e, index) => {
    const updatedUsers = users.map((user, i) =>
      index == i
        ? Object.assign(user, { [e.target.name]: e.target.value })
        : user
    );
    setUsers(updatedUsers);
  };

  const removeUser = (index) => {
    const filteredUsers = [...users];
    filteredUsers.splice(index, 1);
    setUsers(filteredUsers);
    setCount(estimate_count - 1);
  };

  useEffect(() => {
    axios({
      url: BASE_URL + "/api/web-fetch-product-type-group",
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then((res) => {
      setProductTypeGroup(res.data.product_type_group);
    });
  }, []);

  useEffect(() => {
    var theLoginToken = localStorage.getItem("token");

    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: "Bearer " + theLoginToken,
      },
    };

    fetch(BASE_URL + "/api/web-fetch-estimate-latest/2023-24", requestOptions)
      .then((response) => response.json())
      .then((data) => setEstimateRef(data?.estimateRef));
  }, []);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const validateOnlyDigits = (inputtxt) => {
    var phoneno = /^\d+$/;
    if (inputtxt.match(phoneno) || inputtxt.length == 0) {
      return true;
    } else {
      return false;
    }
  };

  const validateOnlyNumber = (inputtxt) => {
    var phoneno = /^\d*\.?\d*$/;
    if (inputtxt.match(phoneno) || inputtxt.length == 0) {
      return true;
    } else {
      return false;
    }
  };

  const onInputChange = (e) => {
    if (e.target.name == "estimate_mobile") {
      if (validateOnlyDigits(e.target.value)) {
        setEstimate({
          ...estimate,
          [e.target.name]: e.target.value,
        });
      }
    } else if (e.target.name == "estimate_tax") {
      if (validateOnlyNumber(e.target.value)) {
        setEstimate({
          ...estimate,
          [e.target.name]: e.target.value,
        });
      }

      const result = [];

      for (let i = 0; i < users.length; i++) {
        result.push(
          users[i].estimate_sub_qnty_sqr * users[i].estimate_sub_rate
        );
      }

      const valu = result.reduce((acc, curr) => acc + curr, 0);

      const total =
        parseInt(e.target.value || 0) +
        parseInt(estimate.estimate_tempo || 0) +
        parseInt(estimate.estimate_loading || 0) +
        parseInt(estimate.estimate_unloading || 0) +
        parseInt(estimate.estimate_other || 0) +
        parseInt(valu || 0);
      setEstimate((estimate) => ({
        ...estimate,
        estimate_gross: total,
      }));
      const balance =
        parseInt(e.target.value || 0) +
        parseInt(estimate.estimate_tempo || 0) +
        parseInt(estimate.estimate_loading || 0) +
        parseInt(estimate.estimate_unloading || 0) +
        parseInt(estimate.estimate_other || 0) +
        parseInt(valu || 0) -
        parseInt(estimate.estimate_advance || 0);
      setEstimate((estimate) => ({
        ...estimate,
        estimate_balance: balance,
      }));
    } else if (e.target.name == "estimate_tempo") {
      if (validateOnlyNumber(e.target.value)) {
        setEstimate({
          ...estimate,
          [e.target.name]: e.target.value,
        });
      }

      const result = [];

      for (let i = 0; i < users.length; i++) {
        result.push(
          users[i].estimate_sub_qnty_sqr * users[i].estimate_sub_rate
        );
      }

      const valu = result.reduce((acc, curr) => acc + curr, 0);

      const total =
        parseInt(estimate.estimate_tax || 0) +
        parseInt(e.target.value || 0) +
        parseInt(estimate.estimate_loading || 0) +
        parseInt(estimate.estimate_unloading || 0) +
        parseInt(estimate.estimate_other || 0) +
        parseInt(valu || 0);
      setEstimate((estimate) => ({
        ...estimate,
        estimate_gross: total,
      }));
      const balance =
        parseInt(estimate.estimate_tax || 0) +
        parseInt(e.target.value || 0) +
        parseInt(estimate.estimate_loading || 0) +
        parseInt(estimate.estimate_unloading || 0) +
        parseInt(estimate.estimate_other || 0) +
        parseInt(valu || 0) -
        parseInt(estimate.estimate_advance || 0);
      setEstimate((estimate) => ({
        ...estimate,
        estimate_balance: balance,
      }));
    } else if (e.target.name == "estimate_loading") {
      if (validateOnlyNumber(e.target.value)) {
        setEstimate({
          ...estimate,
          [e.target.name]: e.target.value,
        });
      }

      const result = [];

      for (let i = 0; i < users.length; i++) {
        result.push(
          users[i].estimate_sub_qnty_sqr * users[i].estimate_sub_rate
        );
      }

      const valu = result.reduce((acc, curr) => acc + curr, 0);

      const total =
        parseInt(estimate.estimate_tax || 0) +
        parseInt(estimate.estimate_tempo || 0) +
        parseInt(e.target.value || 0) +
        parseInt(estimate.estimate_unloading || 0) +
        parseInt(estimate.estimate_other || 0) +
        parseInt(valu || 0);
      setEstimate((estimate) => ({
        ...estimate,
        estimate_gross: total,
      }));
      const balance =
        parseInt(estimate.estimate_tax || 0) +
        parseInt(estimate.estimate_tempo || 0) +
        parseInt(e.target.value || 0) +
        parseInt(estimate.estimate_unloading || 0) +
        parseInt(estimate.estimate_other || 0) +
        parseInt(valu || 0) -
        parseInt(estimate.estimate_advance || 0);
      setEstimate((estimate) => ({
        ...estimate,
        estimate_balance: balance,
      }));
    } else if (e.target.name == "estimate_unloading") {
      if (validateOnlyNumber(e.target.value)) {
        setEstimate({
          ...estimate,
          [e.target.name]: e.target.value,
        });
      }

      const result = [];

      for (let i = 0; i < users.length; i++) {
        result.push(
          users[i].estimate_sub_qnty_sqr * users[i].estimate_sub_rate
        );
      }

      const valu = result.reduce((acc, curr) => acc + curr, 0);

      const total =
        parseInt(estimate.estimate_tax || 0) +
        parseInt(estimate.estimate_tempo || 0) +
        parseInt(estimate.estimate_loading || 0) +
        parseInt(e.target.value || 0) +
        parseInt(estimate.estimate_other || 0) +
        parseInt(valu || 0);
      setEstimate((estimate) => ({
        ...estimate,
        estimate_gross: total,
      }));
      const balance =
        parseInt(estimate.estimate_tax || 0) +
        parseInt(estimate.estimate_tempo || 0) +
        parseInt(estimate.estimate_loading || 0) +
        parseInt(e.target.value || 0) +
        parseInt(estimate.estimate_other || 0) +
        parseInt(valu || 0) -
        parseInt(estimate.estimate_advance || 0);
      setEstimate((estimate) => ({
        ...estimate,
        estimate_balance: balance,
      }));
    } else if (e.target.name == "estimate_other") {
      if (validateOnlyNumber(e.target.value)) {
        setEstimate({
          ...estimate,
          [e.target.name]: e.target.value,
        });
      }

      const result = [];

      for (let i = 0; i < users.length; i++) {
        result.push(
          users[i].estimate_sub_qnty_sqr * users[i].estimate_sub_rate
        );
      }

      const valu = result.reduce((acc, curr) => acc + curr, 0);

      const total =
        parseInt(estimate.estimate_tax || 0) +
        parseInt(estimate.estimate_tempo || 0) +
        parseInt(estimate.estimate_loading || 0) +
        parseInt(estimate.estimate_unloading || 0) +
        parseInt(e.target.value || 0) +
        parseInt(valu || 0);
      setEstimate((estimate) => ({
        ...estimate,
        estimate_gross: total,
      }));
      const balance =
        parseInt(estimate.estimate_tax || 0) +
        parseInt(estimate.estimate_tempo || 0) +
        parseInt(estimate.estimate_loading || 0) +
        parseInt(estimate.estimate_unloading || 0) +
        parseInt(e.target.value || 0) +
        parseInt(valu || 0) -
        parseInt(estimate.estimate_advance || 0);
      setEstimate((estimate) => ({
        ...estimate,
        estimate_balance: balance,
      }));
    } else if (e.target.name == "estimate_gross") {
      if (validateOnlyNumber(e.target.value)) {
        setEstimate({
          ...estimate,
          [e.target.name]: e.target.value,
        });
      }
    } else if (e.target.name == "estimate_advance") {
      if (validateOnlyNumber(e.target.value)) {
        setEstimate({
          ...estimate,
          [e.target.name]: e.target.value,
        });
      }

      const result = [];

      for (let i = 0; i < users.length; i++) {
        result.push(
          users[i].estimate_sub_qnty_sqr * users[i].estimate_sub_rate
        );
      }

      const valu = result.reduce((acc, curr) => acc + curr, 0);

      const balance =
        parseInt(estimate.estimate_tax || 0) +
        parseInt(estimate.estimate_tempo || 0) +
        parseInt(estimate.estimate_loading || 0) +
        parseInt(estimate.estimate_unloading || 0) +
        parseInt(estimate.estimate_other || 0) +
        parseInt(valu || 0) -
        parseInt(e.target.value || 0);
      setEstimate((estimate) => ({
        ...estimate,
        estimate_balance: balance,
      }));
    } else if (e.target.name == "estimate_balance") {
      if (validateOnlyNumber(e.target.value)) {
        setEstimate({
          ...estimate,
          [e.target.name]: e.target.value,
        });
      }
    } else {
      setEstimate({
        ...estimate,
        [e.target.name]: e.target.value,
      });
    }
  };

  const addReceived = () => {
    setReceived([...received, useTemplate2]);
    setReceivedCount(received_count + 1);
  };

  const onChangeReceived = (e, index) => {
    const updatedreceived = received.map((user, i) =>
      index == i
        ? Object.assign(user, { [e.target.name]: e.target.value })
        : user
    );
    setReceived(updatedreceived);
  };

  const removeReceived = (index) => {
    const filteredreceived = [...received];
    filteredreceived.splice(index, 1);
    setReceived(filteredreceived);
    setReceivedCount(received_count - 1);
  };

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const QntyCal = (selectedValue) => {
    const tempUsers = [...users];
    tempUsers[selectedValue].estimate_sub_amount =
      tempUsers[selectedValue].estimate_sub_qnty_sqr *
      tempUsers[selectedValue].estimate_sub_rate;
    setUsers(tempUsers);

    const result = [];

    for (let i = 0; i < users.length; i++) {
      result.push(users[i].estimate_sub_qnty_sqr * users[i].estimate_sub_rate);
    }

    const valu = result.reduce((acc, curr) => acc + curr, 0);

    const total =
      parseInt(estimate.estimate_tax || 0) +
      parseInt(estimate.estimate_tempo || 0) +
      parseInt(estimate.estimate_loading || 0) +
      parseInt(estimate.estimate_unloading || 0) +
      parseInt(estimate.estimate_other || 0) +
      parseInt(valu || 0);
    setEstimate((estimate) => ({
      ...estimate,
      estimate_gross: total,
    }));
    const balance =
      parseInt(estimate.estimate_tax || 0) +
      parseInt(estimate.estimate_tempo || 0) +
      parseInt(estimate.estimate_loading || 0) +
      parseInt(estimate.estimate_unloading || 0) +
      parseInt(estimate.estimate_other || 0) +
      parseInt(valu || 0) -
      parseInt(estimate.estimate_advance || 0);
    setEstimate((estimate) => ({
      ...estimate,
      estimate_balance: balance,
    }));
  };

  const RateCal = (selectedValue) => {
    const tempUsers = [...users];
    tempUsers[selectedValue].estimate_sub_amount =
      tempUsers[selectedValue].estimate_sub_qnty_sqr *
      tempUsers[selectedValue].estimate_sub_rate;
    setUsers(tempUsers);

    const result = [];

    for (let i = 0; i < users.length; i++) {
      result.push(users[i].estimate_sub_qnty_sqr * users[i].estimate_sub_rate);
    }

    const valu = result.reduce((acc, curr) => acc + curr, 0);

    const total =
      parseInt(estimate.estimate_tax || 0) +
      parseInt(estimate.estimate_tempo || 0) +
      parseInt(estimate.estimate_loading || 0) +
      parseInt(estimate.estimate_unloading || 0) +
      parseInt(estimate.estimate_other || 0) +
      parseInt(valu || 0);
    setEstimate((estimate) => ({
      ...estimate,
      estimate_gross: total,
    }));
    const balance =
      parseInt(estimate.estimate_tax || 0) +
      parseInt(estimate.estimate_tempo || 0) +
      parseInt(estimate.estimate_loading || 0) +
      parseInt(estimate.estimate_unloading || 0) +
      parseInt(estimate.estimate_other || 0) +
      parseInt(valu || 0) -
      parseInt(estimate.estimate_advance || 0);
    setEstimate((estimate) => ({
      ...estimate,
      estimate_balance: balance,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    setIsButtonDisabled(true);
    const formData = {
      estimate_date: estimate.estimate_date,
      estimate_year: currentYear,
      estimate_customer: estimate.estimate_customer,
      estimate_address: estimate.estimate_address,
      estimate_mobile: estimate.estimate_mobile,
      estimate_item_type: estimate.estimate_item_type,
      estimate_tax: estimate.estimate_tax,
      estimate_tempo: estimate.estimate_tempo,
      estimate_loading: estimate.estimate_loading,
      estimate_unloading: estimate.estimate_unloading,
      estimate_other: estimate.estimate_other,
      estimate_gross: estimate.estimate_gross,
      estimate_advance: estimate.estimate_advance,
      estimate_balance: estimate.estimate_balance,
      estimate_no_of_count: estimate_count,
      estimate_sub_data: users,
    };
    try {
      const response = await axios.post(
        `${BASE_URL}/api/web-create-estimate`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status == "200") {
        toast.success("Estimate Created Sucessfully");
        navigate("/estimate-list");
      } else {
        if (response.status == "401") {
          toast.error("Estimate Duplicate Entry");
        } else if (response.status == "402") {
          toast.error("Estimate Duplicate Entry");
        } else {
          toast.error("An unknown error occurred");
        }
      }
    } catch (error) {
      console.error("Error updating Estimate:", error);
      toast.error("Error  updating Estimate");
    } finally {
      setIsButtonDisabled(false);
    }
  };

  return (
    <Layout>
      <div>
        <div className="flex justify-between mb-4 mt-6">
          <h1 className="flex text-2xl text-[#464D69] font-semibold ml-2 content-center">
            <Link to="/estimate-list">
              <MdKeyboardBackspace className=" text-white bg-[#464D69] p-1 w-10 h-8 cursor-pointer rounded-2xl" />
            </Link>{" "}
            &nbsp; Add Estimate
          </h1>
          <h3 className="text-xl text-[#464D69] font-semibold ml-2 content-center">
            Estimate No : <b>{estimate_ref}</b>
          </h3>
        </div>
        <div className="row">
          <div className="p-6 mt-5 bg-white shadow-md rounded-lg">
            <div className="card">
              <div className="card-body">
                <form autoComplete="off">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                    <div className="form-group">
                      <TextField
                        fullWidth
                        size="small"
                        required
                        type="date"
                        label="Date"
                        autoComplete="Name"
                        name="estimate_date"
                        value={estimate.estimate_date}
                        onChange={(e) => onInputChange(e)}
                      />
                    </div>

                    <div className="form-group col-span-2">
                      <TextField
                        fullWidth
                        required
                        size="small"
                        label="Customer"
                        autoComplete="Name"
                        name="estimate_customer"
                        value={estimate.estimate_customer}
                        onChange={(e) => onInputChange(e)}
                      />
                    </div>

                    <div className="form-group">
                      <TextField
                        fullWidth
                        size="small"
                        type="tel"
                        maxLength={10}
                        label="Mobile No"
                        autoComplete="Name"
                        name="estimate_mobile"
                        value={estimate.estimate_mobile}
                        onChange={(e) => onInputChange(e)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                    <div className="form-group col-span-3">
                      <Fields
                        type="textField"
                        title="Address"
                        autoComplete="Name"
                        name="estimate_address"
                        value={estimate.estimate_address}
                        onChange={(e) => onInputChange(e)}
                      />
                    </div>
                    <div className="form-group">
                      <Fields
                        required={true}
                        title="Item Type"
                        type="estimateItemDropdown"
                        name="estimate_item_type"
                        value={estimate.estimate_item_type}
                        onChange={(e) => onInputChange(e)}
                        options={productTypeGroup}
                      />
                    </div>
                  </div>
                  <hr />
                  <div>
                    <div>
                      {users.map((user, index) => (
                        <div
                          key={index}
                          className="grid grid-cols-1 md:grid-cols-7 gap-6 mb-6 mt-3"
                        >
                          <div className="form-group">
                            <Fields
                              required={true}
                              title="Type"
                              type="whatsappDropdown"
                              name="estimate_sub_type"
                              value={user.estimate_sub_type}
                              onChange={(e) => onChange(e, index)}
                              options={type}
                            />
                          </div>
                          <div className="form-group">
                            <TextField
                            size="small"
                              label="Item"
                              autoComplete="Name"
                              ref={inputRef}
                              required
                              name="estimate_sub_item"
                              value={user.estimate_sub_item}
                              onChange={(e) => onChange(e, index)}
                            />
                          </div>
                          <div className="form-group ">
                            <TextField
                              label="Qnty in Piece"
                              autoComplete="Name"
                              ref={inputRef}
                              required
                              size="small"
                              name="estimate_sub_qnty"
                              value={user.estimate_sub_qnty}
                              onChange={(e) => {
                                onChange(e, index);
                              }}
                            />
                          </div>
                          <div className="form-group">
                            <TextField
                              label="Qnty in Sqr ft"
                              autoComplete="Name"
                              ref={inputRef}
                              required
                              size="small"
                              name="estimate_sub_qnty_sqr"
                              value={user.estimate_sub_qnty_sqr}
                              onChange={(e) => {
                                onChange(e, index);
                                QntyCal(index);
                              }}
                            />
                          </div>{" "}
                          <div className="form-group">
                            <TextField
                              label="Rate"
                              autoComplete="Name"
                              size="small"
                              ref={inputRef}
                              required
                              name="estimate_sub_rate"
                              value={user.estimate_sub_rate}
                              onChange={(e) => {
                                onChange(e, index);
                                RateCal(index);
                              }}
                            />
                          </div>
                          <div className="form-group">
                            <TextField
                              label="Amount"
                              autoComplete="Name"
                              size="small"
                              ref={inputRef}
                              required
                              disabled
                              labelProps={{
                                className: "!text-gray-500",
                              }}
                              name="estimate_sub_amount"
                              value={user.estimate_sub_amount}
                              onChange={(e) => onChange(e, index)}
                            />
                          </div>
                          <div className="form-group">
                            <IconButton
                              tabIndex="-1"
                              onClick={() => removeUser(index)}
                            >
                              <Delete />
                            </IconButton>
                          </div>
                        </div>
                      ))}

                      <div className="row mt-4">
                        <div className="col-sm-12 col-md-12 col-xl-12">
                          <Button onClick={(e) => addItem(e)}>
                            <FaPlus /> &nbsp; Add More
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6 mt-3">
                    <div className="form-group">
                      <Input
                        fullWidth
                        type="text"
                        label="Tax"
                        autoComplete="Name"
                        name="estimate_tax"
                        value={estimate.estimate_tax}
                        onChange={(e) => onInputChange(e)}
                      />
                    </div>

                    <div className="form-group ">
                      <Input
                        fullWidth
                        label="Tempo Charges"
                        autoComplete="Name"
                        name="estimate_tempo"
                        value={estimate.estimate_tempo}
                        onChange={(e) => onInputChange(e)}
                      />
                    </div>

                    <div className="form-group">
                      <Input
                        fullWidth
                        type="text"
                        label="Loading/Unloading Charges"
                        autoComplete="Name"
                        name="estimate_loading"
                        value={estimate.estimate_loading}
                        onChange={(e) => onInputChange(e)}
                      />
                    </div>
                    <div className="form-group">
                      <Input
                        fullWidth
                        type="text"
                        label="Other Charges"
                        autoComplete="Name"
                        name="estimate_other"
                        value={estimate.estimate_other}
                        onChange={(e) => onInputChange(e)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                    <div className="form-group">
                      <Input
                        fullWidth
                        type="text"
                        label="Gross Total"
                        autoComplete="Name"
                        disabled
                        name="estimate_gross"
                        value={estimate.estimate_gross}
                        onChange={(e) => onInputChange(e)}
                      />
                    </div>

                    <div className="form-group ">
                      <Input
                        fullWidth
                        label="Advance"
                        autoComplete="Name"
                        name="estimate_advance"
                        value={estimate.estimate_advance}
                        onChange={(e) => onInputChange(e)}
                      />
                    </div>

                    <div className="form-group">
                      <Input
                        fullWidth
                        type="text"
                        disabled
                        label="Balance"
                        autoComplete="Name"
                        name="estimate_balance"
                        value={estimate.estimate_balance}
                        onChange={(e) => onInputChange(e)}
                      />
                    </div>
                  </div>
                  <div className="row mt-4">
                    <button
                      type="submit"
                      onClick={(e) => onSubmit(e)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
                      color="primary"
                      disabled={isButtonDisabled}
                    >
                      {isButtonDisabled ? "Submitting" : "Submit"}
                    </button>
                    <Link to="/estimate-list">
                      <button className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2">
                        Cancel
                      </button>
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AddEstimate;
