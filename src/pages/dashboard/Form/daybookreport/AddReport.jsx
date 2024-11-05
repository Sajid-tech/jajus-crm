import React, { useEffect, useState, useRef } from "react";
import TextField from "@material-ui/core/TextField";
import { baseURL } from "../../api";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { Button } from "reactstrap";
import { Link } from "react-router-dom";
import { IconButton } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "react-select";
import "./dailyBook.css";
import { toast } from "react-toastify";

const AdddayBook = (props) => {
  let history = useHistory();
  const inputRef = useRef(null);

  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();

  today = mm + "/" + dd + "/" + yyyy;
  var midate = "04/04/2022";
  var todayback = yyyy + "-" + mm + "-" + dd;

  const [dayBook, setDayBook] = useState({
    payment_date: todayback,
    payment_year: "2023-24",
    payment_total: "0",
    received_total: "0",
    payment_no_of_count: "",
    received_no_of_count: "",
    payment_sub_data: "",
    received_sub_data: "",
  });

  const useTemplate1 = {
    payment_about: "",
    payment_amount: "",
    payment_about_new: "",
  };

  const useTemplate2 = {
    received_about: "",
    received_amount: "",
    received_about_new: "",
  };

  const [payment, setPayment] = useState([useTemplate1]);

  const [received, setReceived] = useState([useTemplate2]);

  const [payment_count, setPaymentCount] = useState(1);

  const [received_count, setReceivedCount] = useState(1);

  const [accountName, setaccountName] = useState([]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    var theLoginToken = localStorage.getItem("login");

    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: "Bearer " + theLoginToken,
      },
    };

    fetch(baseURL + "/web-fetch-ledger-accountname", requestOptions)
      .then((response) => response.json())
      .then((data) => setaccountName(data.mix));
  }, []);

  const onInputChange = (e) => {
    setDayBook({
      ...dayBook,
      [e.target.name]: e.target.value,
    });
  };

  const addPayment = () => {
    setPayment([...payment, useTemplate1]);
    setPaymentCount(payment_count + 1);
  };

  const addReceived = () => {
    setReceived([...received, useTemplate2]);
    setReceivedCount(received_count + 1);
  };

  const onChangePayment = (e, index) => {
    const updatedpayment = payment.map((user, i) =>
      index == i
        ? Object.assign(user, { [e.target.name]: e.target.value })
        : user
    );
    setPayment(updatedpayment);
  };

  const onChangeReceived = (e, index) => {
    const updatedreceived = received.map((user, i) =>
      index == i
        ? Object.assign(user, { [e.target.name]: e.target.value })
        : user
    );
    setReceived(updatedreceived);
  };

  const removePayment = (index) => {
    const filteredpayment = [...payment];
    filteredpayment.splice(index, 1);
    setPayment(filteredpayment);
    setPaymentCount(payment_count - 1);
  };

  const removeReceived = (index) => {
    const filteredreceived = [...received];
    filteredreceived.splice(index, 1);
    setReceived(filteredreceived);
    setReceivedCount(received_count - 1);
  };

  const [isButtonDisabled, setIsButtonDisabled] = React.useState(false);

  useEffect(() => {
    var isLoggedIn = localStorage.getItem("user_type_id");
    if (!isLoggedIn) {
      window.location = "/login";
    } else {
    }
  });

  const PaymentCal = (selectedValue) => {
    const tempUsers = [...payment];
    setPayment(tempUsers);
    const result = [];
    for (let i = 0; i < payment.length; i++) {
      result.push(payment[i].payment_amount);
    }
    const valu = result.reduce((acc, curr) => acc + parseInt(curr), 0);
    const total = +parseInt(valu || 0);
    setDayBook((dayBook) => ({
      ...dayBook,
      payment_total: total,
    }));
  };

  const ReceivedCal = (selectedValue) => {
    const tempUsers = [...received];
    setReceived(tempUsers);
    const result = [];
    for (let i = 0; i < received.length; i++) {
      result.push(received[i].received_amount);
    }
    const valu = result.reduce((acc, curr) => acc + parseInt(curr), 0);
    const total = +parseInt(valu || 0);
    setDayBook((dayBook) => ({
      ...dayBook,
      received_total: total,
    }));
  };

  const onSubmit = (e) => {
    let data = {
      payment_date: dayBook.payment_date,
      payment_year: dayBook.payment_year,
      payment_total: dayBook.payment_total,
      received_total: dayBook.received_total,
      payment_no_of_count: payment_count,
      received_no_of_count: received_count,
      payment_sub_data: payment,
      received_sub_data: received,
    };
    e.preventDefault();
    var v = document.getElementById("addIndiv").checkValidity();
    var v = document.getElementById("addIndiv").reportValidity();
    if (v) {
      setIsButtonDisabled(true);
      axios({
        url: baseURL + "/web-create-payment-received",
        method: "POST",
        data,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("login")}`,
        },
      }).then((res) => {
        if (res.data.code == "200") {
          toast.success("Day Book Created Sucessfully");
          setDayBook({
            payment_date: todayback,
            payment_year: "2023-24",
            payment_total: "0",
            received_total: "0",
            payment_no_of_count: "",
            received_no_of_count: "",
            payment_sub_data: "",
            received_sub_data: "",
          });
          setReceivedCount(1);
          setPaymentCount(1);
          setPayment([{ payment_about: "", payment_amount: "0" }]);
          setReceived([{ received_about: "", received_amount: "0" }]);
          setIsButtonDisabled(false);
          history.push("/dayBook");
        } else {
          toast.error("Day Book Already Created for a day");
          setIsButtonDisabled(false);
        }
      });
    }
  };

  return (
    <div>
      <div className="page-header">
        <h3 className="page-title"> Add Day Book </h3>
      </div>
      <div className="row">
        <div className="col-md-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <form id="addIndiv" autoComplete="off">
                <div className="row">
                  <div className="col-sm-12 col-md-4 col-xl-3">
                    <div className="form-group">
                      <TextField
                        fullWidth
                        required
                        type="date"
                        label="Date"
                        autoComplete="Name"
                        name="payment_date"
                        value={dayBook.payment_date}
                        onChange={(e) => onInputChange(e)}
                      />
                    </div>
                  </div>
                  <div className="col-sm-12 col-md-4 col-xl-3">
                    <div className="form-group">
                      <TextField
                        fullWidth
                        required
                        disabled
                        label="Received Total"
                        autoComplete="Name"
                        name="received_total"
                        value={dayBook.received_total}
                        onChange={(e) => onInputChange(e)}
                      />
                    </div>
                  </div>
                  <div className="col-sm-12 col-md-4 col-xl-3">
                    <div className="form-group">
                      <TextField
                        fullWidth
                        required
                        disabled
                        label="Payment Total"
                        autoComplete="Name"
                        name="payment_total"
                        value={dayBook.payment_total}
                        onChange={(e) => onInputChange(e)}
                      />
                    </div>
                  </div>
                  <div className="col-sm-12 col-md-4 col-xl-3">
                    <div className="form-group">
                      <TextField
                        fullWidth
                        required
                        disabled
                        label="Balance"
                        autoComplete="Name"
                        name="payment_balance"
                        value={dayBook.received_total - dayBook.payment_total}
                        onChange={(e) => onInputChange(e)}
                      />
                    </div>
                  </div>
                </div>
                <hr />
                <div className="row mb-4">
                  <div className="col-sm-12 col-md-4 col-xl-6">
                    <div className="row mb-4">
                      <div className="col-sm-12 col-md-4 col-xl-12">Credit</div>
                    </div>
                    {received.map((user, index) => (
                      <div className="row " key={index}>
                        <div className="col-sm-12 col-md-12 col-xl-4">
                          <div className="form-group">
                            <TextField
                              fullWidth
                              label="Amount"
                              autoComplete="Name"
                              ref={inputRef}
                              required
                              name="received_amount"
                              value={user.received_amount}
                              onChange={(e) => {
                                onChangeReceived(e, index);
                                ReceivedCal(index);
                              }}
                            />
                          </div>
                        </div>
                        <div className="col-sm-12 col-md-12 col-xl-7">
                          <div className="form-group">
                            {user.received_about !== "New Value" && (
                              // <Select
                              //     options={accountName.map((option) => (
                              //     {
                              //         value: option.account_name,
                              //         label: option.account_name,
                              //         name: 'received_about',
                              //     }))}
                              //     placeholder="Account"
                              //     label="Account"
                              //     name="received_about"
                              //     required
                              //     alue={user.received_about}
                              //     onChange={(e) => onInputChange(e)}
                              //     />

                              <TextField
                                fullWidth
                                label="Account"
                                autoComplete="Name"
                                required
                                name="received_about"
                                SelectProps={{
                                  MenuProps: {},
                                }}
                                select
                                value={user.received_about}
                                onChange={(e) => onChangeReceived(e, index)}
                              >
                                {accountName.map((fabric, key) => (
                                  <MenuItem
                                    key={key}
                                    value={fabric.account_name}
                                  >
                                    {fabric.account_name}
                                  </MenuItem>
                                ))}
                                <MenuItem value="New Value">
                                  Type a new value...
                                </MenuItem>
                              </TextField>
                            )}
                            {user.received_about === "New Value" && (
                              <TextField
                                label="Account"
                                autoComplete="Name"
                                required
                                name="received_about_new"
                                value={user.received_about_new}
                                onChange={(e) => onChangeReceived(e, index)}
                                fullWidth
                              />
                            )}
                          </div>
                        </div>
                        <div className="col-sm-12 col-md-12 col-xl-1">
                          <IconButton
                            tabIndex="-1"
                            onClick={() => removeReceived(index)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </div>
                      </div>
                    ))}

                    <div className="row mt-4">
                      <div className="col-sm-12 col-md-12 col-xl-12">
                        <Button
                          className="mr-10 mb-10 new_button"
                          color="primary"
                          variant="contained"
                          onClick={(e) => addReceived(e)}
                        >
                          Add More
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-12 col-md-4 col-xl-6">
                    <div className="row mb-4">
                      <div className="col-sm-12 col-md-4 col-xl-12">Debit</div>
                    </div>
                    {payment.map((user, index) => (
                      <div className="row " key={index}>
                        <div className="col-sm-12 col-md-12 col-xl-4">
                          <div className="form-group">
                            <TextField
                              fullWidth
                              label="Amount"
                              autoComplete="Name"
                              required
                              name="payment_amount"
                              value={user.payment_amount}
                              onChange={(e) => {
                                onChangePayment(e, index);
                                PaymentCal(index);
                              }}
                            />
                          </div>
                        </div>
                        <div className="col-sm-12 col-md-12 col-xl-7">
                          <div className="form-group">
                            {user.payment_about !== "New Value" && (
                              <TextField
                                fullWidth
                                label="Account"
                                autoComplete="Name"
                                required
                                name="payment_about"
                                SelectProps={{
                                  MenuProps: {},
                                }}
                                select
                                value={user.payment_about}
                                onChange={(e) => onChangePayment(e, index)}
                              >
                                {accountName.map((fabric, key) => (
                                  <MenuItem
                                    key={key}
                                    value={fabric.account_name}
                                  >
                                    {fabric.account_name}
                                  </MenuItem>
                                ))}
                                <MenuItem value="New Value">
                                  Type a new value...
                                </MenuItem>
                              </TextField>
                            )}
                            {user.payment_about === "New Value" && (
                              <TextField
                                label="Account"
                                autoComplete="Name"
                                required
                                name="payment_about_new"
                                value={user.payment_about_new}
                                onChange={(e) => onChangePayment(e, index)}
                                fullWidth
                              />
                            )}
                          </div>
                        </div>
                        <div className="col-sm-12 col-md-12 col-xl-1">
                          <IconButton
                            tabIndex="-1"
                            onClick={() => removePayment(index)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </div>
                      </div>
                    ))}

                    <div className="row mt-4">
                      <div className="col-sm-12 col-md-12 col-xl-12">
                        <Button
                          className="mr-10 mb-10 new_button"
                          color="primary"
                          variant="contained"
                          onClick={(e) => addPayment(e)}
                        >
                          Add More
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row mt-4">
                  {parseInt(dayBook.payment_total) -
                    parseInt(dayBook.received_total) ==
                  0 ? (
                    <Button
                      type="submit"
                      className="btn btn-gradient-primary mr-4"
                      color="primary"
                      onClick={(e) => onSubmit(e)}
                      disabled={isButtonDisabled}
                    >
                      Submit
                    </Button>
                  ) : (
                    ""
                  )}
                  <Link to="estimateList">
                    <Button className="btn btn-light" color="success">
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
  );
};

export default AdddayBook;
