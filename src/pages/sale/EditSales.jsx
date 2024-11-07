import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Button } from "reactstrap";
import { Link } from "react-router-dom";
// import Select from "react-select";
import { toast } from "react-toastify";
import BASE_URL, { baseURL } from "../../base/BaseUrl";
import { IconButton, MenuItem, TextField } from "@mui/material";
import { Delete } from "@mui/icons-material";
import Layout from "../../layout/Layout";
import { MdKeyboardBackspace } from "react-icons/md";
// import "./dailyBook.css";

const EditSales = (props) => {
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const { id } = useParams();

  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();

  today = mm + "/" + dd + "/" + yyyy;
  var midate = "04/04/2022";
  var todayback = yyyy + "-" + mm + "-" + dd;

  const [estimate, setEstimate] = useState({
    sales_date: "",
    sales_customer: "",
    sales_address: "",
    sales_mobile: "",
    sales_item_type: "",
    sales_tax: "",
    sales_tempo: "",
    sales_loading: "",
    sales_unloading: "0",
    sales_other: "",
    sales_gross: "",
    sales_advance: "",
    sales_balance: "",
    sales_no_of_count: "",
    sales_sub_data: "",
  });

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const useTemplate = {
    id: "",
    sales_sub_type: "",
    sales_sub_item: "",
    sales_sub_qnty_sqr: "",
    sales_sub_qnty: "",
    sales_sub_rate: "",
    sales_sub_amount: "",
    sales_sub_item_original: "",
  };

  const [users, setUsers] = useState([useTemplate]);

  const [estimate_count, setCount] = useState(1);

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

  useEffect(() => {
    axios({
      url: BASE_URL + "/api/web-fetch-sales-by-id/" + id,
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then((res) => {
      setEstimate(res.data.sales);
      setUsers(res.data.salesSub);
    });
  }, []);

  const [product, setProduct] = useState([]);
  useEffect(() => {
    axios({
      url:
        BASE_URL +
        "/api/web-fetch-product-types/" +
        estimate.sales_item_type,
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then((res) => {
      setProduct(res.data.product_type);
    });
  }, [estimate.sales_item_type]);

  const [productTypeGroup, setProductTypeGroup] = useState([]);
  useEffect(() => {
    var isLoggedIn = localStorage.getItem("user_type_id");
    if (!isLoggedIn) {
      window.location = "/signin";
    } else {
    }

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

  const onInputChange = (e) => {
    if (e.target.name == "sales_mobile") {
      if (validateOnlyDigits(e.target.value)) {
        setEstimate({
          ...estimate,
          [e.target.name]: e.target.value,
        });
      }
    } else if (e.target.name == "sales_tax") {
      if (validateOnlyNumber(e.target.value)) {
        setEstimate({
          ...estimate,
          [e.target.name]: e.target.value,
        });
      }

      const result = [];

      for (let i = 0; i < users.length; i++) {
        result.push(
          users[i].sales_sub_qnty_sqr * users[i].sales_sub_rate
        );
      }

      const valu = result.reduce((acc, curr) => acc + curr, 0);

      const total =
        parseInt(e.target.value || 0) +
        parseInt(estimate.sales_tempo || 0) +
        parseInt(estimate.sales_loading || 0) +
        parseInt(estimate.estimate_unloading || 0) +
        parseInt(estimate.sales_other || 0) +
        parseInt(valu || 0);
      setEstimate((estimate) => ({
        ...estimate,
        sales_gross: total,
      }));
      const balance =
        parseInt(e.target.value || 0) +
        parseInt(estimate.sales_tempo || 0) +
        parseInt(estimate.sales_loading || 0) +
        parseInt(estimate.estimate_unloading || 0) +
        parseInt(estimate.sales_other || 0) +
        parseInt(valu || 0) -
        parseInt(estimate.sales_advance || 0);
      setEstimate((estimate) => ({
        ...estimate,
        sales_balance: balance,
      }));
    } else if (e.target.name == "sales_tempo") {
      if (validateOnlyNumber(e.target.value)) {
        setEstimate({
          ...estimate,
          [e.target.name]: e.target.value,
        });
      }

      const result = [];

      for (let i = 0; i < users.length; i++) {
        result.push(
          users[i].sales_sub_qnty_sqr * users[i].sales_sub_rate
        );
      }

      const valu = result.reduce((acc, curr) => acc + curr, 0);

      const total =
        parseInt(estimate.sales_tax || 0) +
        parseInt(e.target.value || 0) +
        parseInt(estimate.sales_loading || 0) +
        parseInt(estimate.estimate_unloading || 0) +
        parseInt(estimate.sales_other || 0) +
        parseInt(valu || 0);
      setEstimate((estimate) => ({
        ...estimate,
        sales_gross: total,
      }));
      const balance =
        parseInt(estimate.sales_tax || 0) +
        parseInt(e.target.value || 0) +
        parseInt(estimate.sales_loading || 0) +
        parseInt(estimate.estimate_unloading || 0) +
        parseInt(estimate.sales_other || 0) +
        parseInt(valu || 0) -
        parseInt(estimate.sales_advance || 0);
      setEstimate((estimate) => ({
        ...estimate,
        sales_balance: balance,
      }));
    } else if (e.target.name == "sales_loading") {
      if (validateOnlyNumber(e.target.value)) {
        setEstimate({
          ...estimate,
          [e.target.name]: e.target.value,
        });
      }

      const result = [];

      for (let i = 0; i < users.length; i++) {
        result.push(
          users[i].sales_sub_qnty_sqr * users[i].sales_sub_rate
        );
      }

      const valu = result.reduce((acc, curr) => acc + curr, 0);

      const total =
        parseInt(estimate.sales_tax || 0) +
        parseInt(estimate.sales_tempo || 0) +
        parseInt(e.target.value || 0) +
        parseInt(estimate.estimate_unloading || 0) +
        parseInt(estimate.sales_other || 0) +
        parseInt(valu || 0);
      setEstimate((estimate) => ({
        ...estimate,
        sales_gross: total,
      }));
      const balance =
        parseInt(estimate.sales_tax || 0) +
        parseInt(estimate.sales_tempo || 0) +
        parseInt(e.target.value || 0) +
        parseInt(estimate.estimate_unloading || 0) +
        parseInt(estimate.sales_other || 0) +
        parseInt(valu || 0) -
        parseInt(estimate.sales_advance || 0);
      setEstimate((estimate) => ({
        ...estimate,
        sales_balance: balance,
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
          users[i].sales_sub_qnty_sqr * users[i].sales_sub_rate
        );
      }

      const valu = result.reduce((acc, curr) => acc + curr, 0);

      const total =
        parseInt(estimate.sales_tax || 0) +
        parseInt(estimate.sales_tempo || 0) +
        parseInt(estimate.sales_loading || 0) +
        parseInt(e.target.value || 0) +
        parseInt(estimate.sales_other || 0) +
        parseInt(valu || 0);
      setEstimate((estimate) => ({
        ...estimate,
        sales_gross: total,
      }));
      const balance =
        parseInt(estimate.sales_tax || 0) +
        parseInt(estimate.sales_tempo || 0) +
        parseInt(estimate.sales_loading || 0) +
        parseInt(e.target.value || 0) +
        parseInt(estimate.sales_other || 0) +
        parseInt(valu || 0) -
        parseInt(estimate.sales_advance || 0);
      setEstimate((estimate) => ({
        ...estimate,
        sales_balance: balance,
      }));
    } else if (e.target.name == "sales_other") {
      if (validateOnlyNumber(e.target.value)) {
        setEstimate({
          ...estimate,
          [e.target.name]: e.target.value,
        });
      }

      const result = [];

      for (let i = 0; i < users.length; i++) {
        result.push(
          users[i].sales_sub_qnty_sqr * users[i].sales_sub_rate
        );
      }

      const valu = result.reduce((acc, curr) => acc + curr, 0);

      const total =
        parseInt(estimate.sales_tax || 0) +
        parseInt(estimate.sales_tempo || 0) +
        parseInt(estimate.sales_loading || 0) +
        parseInt(estimate.estimate_unloading || 0) +
        parseInt(e.target.value || 0) +
        parseInt(valu || 0);
      setEstimate((estimate) => ({
        ...estimate,
        sales_gross: total,
      }));
      const balance =
        parseInt(estimate.sales_tax || 0) +
        parseInt(estimate.sales_tempo || 0) +
        parseInt(estimate.sales_loading || 0) +
        parseInt(estimate.estimate_unloading || 0) +
        parseInt(e.target.value || 0) +
        parseInt(valu || 0) -
        parseInt(estimate.sales_advance || 0);
      setEstimate((estimate) => ({
        ...estimate,
        sales_balance: balance,
      }));
    } else if (e.target.name == "sales_gross") {
      if (validateOnlyNumber(e.target.value)) {
        setEstimate({
          ...estimate,
          [e.target.name]: e.target.value,
        });
      }
    } else if (e.target.name == "sales_advance") {
      if (validateOnlyNumber(e.target.value)) {
        setEstimate({
          ...estimate,
          [e.target.name]: e.target.value,
        });
      }

      const result = [];

      for (let i = 0; i < users.length; i++) {
        result.push(
          users[i].sales_sub_qnty_sqr * users[i].sales_sub_rate
        );
      }

      const valu = result.reduce((acc, curr) => acc + curr, 0);

      const balance =
        parseInt(estimate.sales_tax || 0) +
        parseInt(estimate.sales_tempo || 0) +
        parseInt(estimate.sales_loading || 0) +
        parseInt(estimate.estimate_unloading || 0) +
        parseInt(estimate.sales_other || 0) +
        parseInt(valu || 0) -
        parseInt(e.target.value || 0);
      setEstimate((estimate) => ({
        ...estimate,
        sales_balance: balance,
      }));
    } else if (e.target.name == "sales_balance") {
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

  const QntyCal = (selectedValue) => {
    const tempUsers = [...users];
    tempUsers[selectedValue].sales_sub_amount =
      tempUsers[selectedValue].sales_sub_qnty_sqr *
      tempUsers[selectedValue].sales_sub_rate;
    setUsers(tempUsers);

    const result = [];

    for (let i = 0; i < users.length; i++) {
      result.push(users[i].sales_sub_qnty_sqr * users[i].sales_sub_rate);
    }

    const valu = result.reduce((acc, curr) => acc + curr, 0);

    const total =
      parseInt(estimate.sales_tax || 0) +
      parseInt(estimate.sales_tempo || 0) +
      parseInt(estimate.sales_loading || 0) +
      parseInt(estimate.estimate_unloading || 0) +
      parseInt(estimate.sales_other || 0) +
      parseInt(valu || 0);
    setEstimate((estimate) => ({
      ...estimate,
      sales_gross: total,
    }));
    const balance =
      parseInt(estimate.sales_tax || 0) +
      parseInt(estimate.sales_tempo || 0) +
      parseInt(estimate.sales_loading || 0) +
      parseInt(estimate.estimate_unloading || 0) +
      parseInt(estimate.sales_other || 0) +
      parseInt(valu || 0) -
      parseInt(estimate.sales_advance || 0);
    setEstimate((estimate) => ({
      ...estimate,
      sales_balance: balance,
    }));
  };

  const RateCal = (selectedValue) => {
    const tempUsers = [...users];
    tempUsers[selectedValue].sales_sub_amount =
      tempUsers[selectedValue].sales_sub_qnty_sqr *
      tempUsers[selectedValue].sales_sub_rate;
    setUsers(tempUsers);

    const result = [];

    for (let i = 0; i < users.length; i++) {
      result.push(users[i].sales_sub_qnty_sqr * users[i].sales_sub_rate);
    }

    const valu = result.reduce((acc, curr) => acc + curr, 0);

    const total =
      parseInt(estimate.sales_tax || 0) +
      parseInt(estimate.sales_tempo || 0) +
      parseInt(estimate.sales_loading || 0) +
      parseInt(estimate.estimate_unloading || 0) +
      parseInt(estimate.sales_other || 0) +
      parseInt(valu || 0);
    setEstimate((estimate) => ({
      ...estimate,
      sales_gross: total,
    }));
    const balance =
      parseInt(estimate.sales_tax || 0) +
      parseInt(estimate.sales_tempo || 0) +
      parseInt(estimate.sales_loading || 0) +
      parseInt(estimate.estimate_unloading || 0) +
      parseInt(estimate.sales_other || 0) +
      parseInt(valu || 0) -
      parseInt(estimate.sales_advance || 0);
    setEstimate((estimate) => ({
      ...estimate,
      sales_balance: balance,
    }));
  };
  const onSubmit = (e) => {
    let data = {
      sales_date: estimate.sales_date,
      sales_year: estimate.estimate_year,
      sales_customer: estimate.sales_customer,
      sales_address: estimate.sales_address,
      sales_mobile: estimate.sales_mobile,
      sales_item_type: estimate.sales_item_type,
      sales_tax: estimate.sales_tax,
      sales_tempo: estimate.sales_tempo,
      sales_loading: estimate.sales_loading,
      sales_unloading: estimate.sales_unloading,
      sales_other: estimate.sales_other,
      sales_gross: estimate.sales_gross,
      sales_advance: estimate.sales_advance,
      sales_balance: estimate.sales_balance,
      sales_no_of_count: estimate.sales_no_of_count,
      sales_sub_data: users,
    };
    e.preventDefault();
    var v = document.getElementById("addIndiv").checkValidity();
    var v = document.getElementById("addIndiv").reportValidity();
    if (v) {
      setIsButtonDisabled(true);
      axios({
        url: BASE_URL + "/api/web-update-sales-direct/" + id,
        method: "PUT",
        data,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }).then((res) => {
        if (res.data.code == "200") {
          toast.success("Sales Updated Sucessfully");
          setIsButtonDisabled(false);
          navigate("/sale-list");
        } else {
          toast.error("Sales Already Updated for a day");
          setIsButtonDisabled(false);
        }
      });
    }
  };

  return (
    <Layout>
      <div>
        <div className="flex mb-4 mt-6">
          <h1 className="flex text-2xl text-[#464D69] font-semibold ml-2 content-center">
          <Link to="/sale-list">
                <MdKeyboardBackspace className=" text-white bg-[#464D69] p-1 w-10 h-8 cursor-pointer rounded-2xl" />
              </Link>
              
               &nbsp;
            Edit Sales
          </h1>
        </div>
        <div className="row">
          <div className="col-md-12 grid-margin stretch-card">
            
            <div className="p-6 mt-5 bg-white shadow-md rounded-lg">
                <form id="addIndiv" autoComplete="off">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                    <div className="form-group">
                      <TextField
                        fullWidth
                        required
                        type="date"
                        size="small"
                        label="Date"
                        autoComplete="Name"
                        name="sales_date"
                        value={estimate.sales_date}
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
                        name="sales_customer"
                        value={estimate.sales_customer}
                        onChange={(e) => onInputChange(e)}
                      />
                    </div>

                    <div className="form-group">
                      <TextField
                        fullWidth
                        type="tel"
                        inputProps={{ maxLength: 10 }}
                        label="Mobile No"
                        size="small"
                        autoComplete="Name"
                        name="sales_mobile"
                        value={estimate.sales_mobile}
                        onChange={(e) => onInputChange(e)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                    <div className="form-group col-span-3">
                      <TextField
                        fullWidth
                        required
                        size="small"
                        label="Address"
                        autoComplete="Name"
                        name="sales_address"
                        value={estimate.sales_address}
                        onChange={(e) => onInputChange(e)}
                      />
                    </div>
                    <div className="form-group">
                      <TextField
                        fullWidth
                        size="small"
                        label="Item Type"
                        autoComplete="Name"
                        required
                        SelectProps={{
                          MenuProps: {},
                        }}
                        select
                        name="sales_item_type"
                        value={estimate.sales_item_type}
                        onChange={(e) => onInputChange(e)}
                      >
                        {productTypeGroup.map((fabric, key) => (
                          <MenuItem key={key} value={fabric.product_type_group}>
                            {fabric.product_type_group}
                          </MenuItem>
                        ))}
                      </TextField>
                    </div>
                  </div>
                  <hr />
                  <div className="row mb-4 mt-3">
                    <div className="col-sm-12 col-md-4 col-xl-6">
                      {users.map((user, index) => (
                        <div className="row " key={index}>
                          <div className="grid grid-cols-1 md:grid-cols-7 gap-6 mb-6">
                            <div className="form-group">
                              <TextField
                              size="small"
                                fullWidth
                                required
                                label="Type"
                                autoComplete="Name"
                                name="sales_sub_type"
                                value={user.sales_sub_type}
                                onChange={(e) => onChange(e, index)}
                              />
                            </div>
                            <div className="form-group">
                              <TextField
                                fullWidth
                                label="Item"
                                autoComplete="Name"
                                ref={inputRef}
                                required
                                size="small"
                                name="sales_sub_item"
                                value={user.sales_sub_item}
                                onChange={(e) => onChange(e, index)}
                              />
                            </div>
                            <div className="form-group">
                              <TextField
                              size="small"
                                fullWidth
                                label="Original Item"
                                autoComplete="Name"
                                required
                                SelectProps={{
                                  MenuProps: {},
                                }}
                                select
                                name="sales_sub_item_original"
                                value={user.sales_sub_item_original}
                                onChange={(e) => onChange(e, index)}
                              >
                                {product.map((fabric, key) => (
                                  <MenuItem
                                    key={fabric.product_type}
                                    value={fabric.product_type}
                                  >
                                    {fabric.product_type}
                                  </MenuItem>
                                ))}
                              </TextField>
                            </div>
                            <div className="form-group">
                              <TextField
                                fullWidth
                                size="small"
                                label="Qnty in Piece"
                                autoComplete="Name"
                                ref={inputRef}
                                required
                                name="sales_sub_qnty"
                                value={user.sales_sub_qnty}
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
                                size="small"
                                name="sales_sub_qnty_sqr"
                                value={user.sales_sub_qnty_sqr}
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
                                size="small"
                                autoComplete="Name"
                                ref={inputRef}
                                required
                                name="sales_sub_rate"
                                value={user.sales_sub_rate}
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
                                size="small"
                                disabled
                                required
                                name="sales_sub_amount"
                                value={user.sales_sub_amount}
                                onChange={(e) => onChange(e, index)}
                              />
                            </div>
                          </div>
                        </div>
                      ))}

                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                    <div className="form-group">
                      <TextField
                        fullWidth
                        type="text"
                        label="Tax"
                        size="small"
                        autoComplete="Name"
                        name="sales_tax"
                        value={estimate.sales_tax}
                        onChange={(e) => onInputChange(e)}
                      />
                    </div>

                    <div className="form-group ">
                      <TextField
                        fullWidth
                        size="small"
                        label="Tempo Charges"
                        autoComplete="Name"
                        name="sales_tempo"
                        value={estimate.sales_tempo}
                        onChange={(e) => onInputChange(e)}
                      />
                    </div>

                    <div className="form-group">
                      <TextField
                        fullWidth
                        type="text"
                        size="small"
                        label="Loading/Unloading Charges"
                        autoComplete="Name"
                        name="sales_loading"
                        value={estimate.sales_loading}
                        onChange={(e) => onInputChange(e)}
                      />
                    </div>
                    <div className="form-group">
                      <TextField
                        fullWidth
                        type="text"
                        size="small"
                        label="Other Charges"
                        autoComplete="Name"
                        name="sales_other"
                        value={estimate.sales_other}
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
                        size="small"
                        disabled
                        autoComplete="Name"
                        name="sales_gross"
                        value={estimate.sales_gross}
                        onChange={(e) => onInputChange(e)}
                      />
                    </div>

                    <div className="form-group ">
                      <TextField
                        fullWidth
                        label="Advance"
                        size="small"
                        autoComplete="Name"
                        name="sales_advance"
                        value={estimate.sales_advance}
                        onChange={(e) => onInputChange(e)}
                      />
                    </div>

                    <div className="form-group">
                      <TextField
                        fullWidth
                        type="text"
                        label="Balance"
                        size="small"
                        disabled
                        autoComplete="Name"
                        name="sales_balance"
                        value={estimate.sales_balance}
                        onChange={(e) => onInputChange(e)}
                      />
                    </div>
                  </div>
                  <div className="row mt-4">
                    <button
                      type="submit"
                      className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
                      color="primary"
                      onClick={(e) => onSubmit(e)}
                      disabled={isButtonDisabled}
                    >
                      {isButtonDisabled ? "Updating" : "Update"}
                    </button>
                    <Link to="/sale-list">
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
    </Layout>
  );
};

export default EditSales;
