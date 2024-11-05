import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "reactstrap";
import { Link } from "react-router-dom";
// import Select from "react-select";
import { toast } from "react-toastify";
import BASE_URL, { baseURL } from "../../base/BaseUrl";
import { IconButton, MenuItem, TextField } from "@mui/material";
import { Delete } from "@mui/icons-material";
import Layout from "../../layout/Layout";
// import "./dailyBook.css";

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

  const [estimate, setEstimate] = useState({
    estimate_date: todayback,
    estimate_year: "2023-24",
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

  // const useTemplate = {
  //   type: "",
  //   item: "",
  //   qnty_in_piece: "",
  //   qnty_in_sqr: "",
  //   rate: "",
  //   amount: "",
  // };

  const useTemplate2 = {
    received_about: "",
    received_amount: "",
    received_about_new: "",
  };

  // const [payment, setPayment] = useState([useTemplate]);

  const [received, setReceived] = useState([useTemplate2]);

  const [payment_count, setPaymentCount] = useState(1);

  const [estimate_ref, setEstimateRef] = useState([]);

  const [received_count, setReceivedCount] = useState(1);

  // const [accountName, setaccountName] = useState([]);

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
    var theLoginToken = localStorage.getItem('token');   
    
    const requestOptions = {
            method: 'GET', 
            headers: {
               'Authorization': 'Bearer '+theLoginToken
            }             
    };     


    fetch(BASE_URL+'/api/web-fetch-estimate-latest/2023-24', requestOptions)
    .then(response => response.json())
    .then(data => setEstimateRef(data?.estimateRef)); 
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

  const [isButtonDisabled, setIsButtonDisabled] = React.useState(false);





  // const onSubmit = (e) => {
  //   let data = {
  //     estimate_date: estimate.estimate_date,
  //     estimate_year: estimate.estimate_year,
  //     estimate_customer: estimate.estimate_customer,
  //     estimate_address: estimate.estimate_address,
  //     estimate_mobile: estimate.estimate_mobile,
  //     estimate_item_type: estimate.estimate_item_type,
  //     estimate_tax: estimate.estimate_tax,
  //     estimate_tempo: estimate.estimate_tempo,
  //     estimate_loading: estimate.estimate_loading,
  //     estimate_unloading: estimate.estimate_unloading,
  //     estimate_other: estimate.estimate_other,
  //     estimate_gross: estimate.estimate_gross,
  //     estimate_advance: estimate.estimate_advance,
  //     estimate_balance: estimate.estimate_balance,
  //     estimate_no_of_count: estimate_count,
  //     estimate_sub_data: users,
  //   };
  //   e.preventDefault();
  //   var v = document.getElementById("addIndiv").checkValidity();
  //   var v = document.getElementById("addIndiv").reportValidity();
  //   if (v) {
  //     setIsButtonDisabled(true);
  //     axios({
  //       url: BASE_URL + "/api/web-create-estimate",
  //       method: "POST",
  //       data,
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem("token")}`,
  //       },
  //     }).then((res) => {
  //       if (res.data.code == "200") {
  //         toast.success("Estimate Created Sucessfully");
  //         navigate("/estimate-list");
  //       } else {
  //         toast.error("Day Book Already Created for a day");
  //         setIsButtonDisabled(false);
  //       }
  //     });
  //   }
  // };

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
      estimate_year: estimate.estimate_year,
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

      if (response.status == '200') {
        toast.success("Estimate Created Sucessfully");
        navigate("/estimate-list");
      } else {
        if (response.status == '401') {
          toast.error("Estimate Duplicate Entry");
        } else if (response.status == '402') {
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
          <h1 className="text-2xl text-[#464D69] font-semibold ml-2 content-center">
            Add Estimate
          </h1>
          <h3 className="text-2xl text-[#464D69] font-semibold ml-2 content-center">
          Estimate No : <b>{estimate_ref}</b>
          </h3>
        </div>
        <div className="row">
          <div className="col-md-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <form onSubmit={onSubmit} autoComplete="off">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                    <div className="form-group">
                      <TextField
                        fullWidth
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
                        type="tel"
                        inputProps={{ maxLength: 10 }}
                        required
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
                      <TextField
                        fullWidth
                        required
                        label="Address"
                        autoComplete="Name"
                        name="estimate_address"
                        value={estimate.estimate_address}
                        onChange={(e) => onInputChange(e)}
                      />
                    </div>
                    <div className="form-group">
                      <TextField
                        fullWidth
                        label="Item Type"
                        autoComplete="Name"
                        required
                        SelectProps={{
                          MenuProps: {},
                        }}
                        select
                        name="estimate_item_type"
                        value={estimate.estimate_item_type}
                        onChange={(e) => onInputChange(e)}
                      >
                        {productTypeGroup.map((fabric, key) => (
                          <MenuItem key={key} value={fabric.product_type_group}>
                            {fabric.product_type_group}
                          </MenuItem>
                        ))}
                      </TextField>

                      {/* {user.received_about === "New Value" && (
                                <TextField
                                  label="Account"
                                  autoComplete="Name"
                                  required
                                  name="item_type"
                                  value={dayBook.item_type}
                                  onChange={(e) => onChangeReceived(e, index)}
                                  fullWidth
                                />
                              )} */}
                    </div>
                  </div>
                  <hr />
                  <div className="row mb-4 mt-3">
                    <div className="col-sm-12 col-md-4 col-xl-6">
                      {received.map((user, index) => (
                        <div className="row " key={index}>
                          <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-6">
                            <div className="form-group">
                              {users.received_about !== "New Value" && (
                                <TextField
                                  fullWidth
                                  label="Type"
                                  autoComplete="Name"
                                  required
                                  SelectProps={{
                                    MenuProps: {},
                                  }}
                                  select
                                  name="estimate_sub_type"
                                  value={user.estimate_sub_type}
                                  onChange={(e) => onChange(e, index)}
                                >
                                  {type.map((fabric, key) => (
                                    <MenuItem
                                      key={fabric.value}
                                      value={fabric.value}
                                    >
                                      {fabric.label}
                                    </MenuItem>
                                  ))}
                                </TextField>
                              )}
                            </div>
                            <div className="form-group">
                              <TextField
                                fullWidth
                                label="Item"
                                autoComplete="Name"
                                ref={inputRef}
                                required
                                name="estimate_sub_item"
                                value={user.estimate_sub_item}
                                onChange={(e) => onChange(e, index)}
                              />
                            </div>
                            <div className="form-group">
                              <TextField
                                fullWidth
                                label="Qnty in Piece"
                                autoComplete="Name"
                                ref={inputRef}
                                required
                                name="estimate_sub_qnty"
                                value={user.estimate_sub_qnty}
                                onChange={(e) => {
                                  onChange(e, index);
                                }}
                              />
                            </div>
                            <div className="form-group">
                              <TextField
                                fullWidth
                                label="Qnty in Sqr ft"
                                autoComplete="Name"
                                ref={inputRef}
                                required
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
                                fullWidth
                                label="Rate"
                                autoComplete="Name"
                                ref={inputRef}
                                required
                                name="estimate_sub_rate"
                                value={user.estimate_sub_rate}
                                onChange={(e) => {
                                  onChange(e, index);
                                  RateCal(index);
                                }}
                              />
                            </div>{" "}
                            <div className="form-group">
                              <TextField
                                fullWidth
                                label="Amount"
                                autoComplete="Name"
                                ref={inputRef}
                                required
                                name="estimate_sub_amount"
                                value={user.estimate_sub_amount}
                                onChange={(e) => onChange(e, index)}
                              />
                            </div>
                            <div className="col-sm-12 col-md-12 col-xl-1">
                              <IconButton
                                tabIndex="-1"
                                onClick={() => removeUser(index)}
                              >
                                <Delete />
                              </IconButton>
                            </div>
                          </div>
                        </div>
                      ))}

                      <div className="row mt-4">
                        <div className="col-sm-12 col-md-12 col-xl-12">
                          <button
                            className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
                            color="primary"
                            variant="contained"
                            onClick={(e) => addItem(e)}
                          >
                            Add More
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                    <div className="form-group">
                      <TextField
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
                      <TextField
                        fullWidth
                        label="Tempo Charges"
                        autoComplete="Name"
                        name="estimate_tempo"
                        value={estimate.estimate_tempo}
                        onChange={(e) => onInputChange(e)}
                      />
                    </div>

                    <div className="form-group">
                      <TextField
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
                      <TextField
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
                      <TextField
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
                      <TextField
                        fullWidth
                        label="Advance"
                        autoComplete="Name"
                        name="estimate_advance"
                        value={estimate.estimate_advance}
                        onChange={(e) => onInputChange(e)}
                      />
                    </div>

                    <div className="form-group">
                      <TextField
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
                        className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
                        color="primary"
                        disabled={isButtonDisabled}
                      >
                        Submit
                      </button>
                    <Link to="/estimate-list">
                      <Button className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2">
                        Cancel
                      </Button>
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
