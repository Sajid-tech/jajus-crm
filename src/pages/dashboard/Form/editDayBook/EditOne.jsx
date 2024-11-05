import {
  FormControl,
  Grid2,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Button,
} from "@mui/material";
import styles from "./editdaybook.module.css";
import DeleteIcon from "@mui/icons-material/Delete";
import React, { useEffect, useRef, useState } from "react";
import Layout from "../../../../layout/Layout";
import { baseURL } from "../../../../base/BaseUrl";
import axios from "axios";
import { toast } from "react-toastify";

const EditdayBook = () => {
  const inputRef = useRef(null);

  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();

  today = mm + "/" + dd + "/" + yyyy;
  var midate = "04/04/2022";
  var todayback = yyyy + "-" + mm + "-" + dd;

  const [dayBook, setDayBook] = useState({
    payment_date: "",
    payment_year: "2023-24",
    payment_total: "0",
    received_total: "0",
    payment_no_of_count: "",
    received_no_of_count: "",
    payment_sub_data: "",
    received_sub_data: "",
  });

  const useTemplate1 = {
    id: "",
    payment_about: "",
    payment_amount: "",
    payment_about_new: "",
  };

  const useTemplate2 = {
    id: "",
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
    var theLoginToken = localStorage.getItem("token");

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

  useEffect(() => {
    axios({
      url: `${baseURL}/web-fetch-ledger-accountname?payment_date=${selectedDate}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then((res) => {
      setPayment(res.data.payment);
      setReceived(res.data.received);
      setPaymentCount(res.data.payment_count);
      setReceivedCount(res.data.received_count);
      const result = [];
      for (let i = 0; i < res.data.received.length; i++) {
        result.push(res.data.received[i].received_amount);
      }
      const valu = result.reduce((acc, curr) => acc + parseInt(curr), 0);
      const total = +parseInt(valu || 0);
      setDayBook((dayBook) => ({
        ...dayBook,
        received_total: total,
      }));
      setDayBook((dayBook) => ({
        ...dayBook,
        payment_date: res.data.received_date,
      }));

      const result1 = [];
      for (let i = 0; i < res.data.payment.length; i++) {
        result1.push(res.data.payment[i].payment_amount);
      }
      const valu1 = result1.reduce((acc, curr) => acc + parseInt(curr), 0);
      const total1 = +parseInt(valu1 || 0);
      setDayBook((dayBook) => ({
        ...dayBook,
        payment_total: total1,
      }));
    });
  }, []);

  const onInputChange = (e) => {
    setDayBook({
      ...dayBook,
      [e.target.name]: e.target.value,
    });
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

  const [isButtonDisabled, setIsButtonDisabled] = React.useState(false);

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
        url: baseURL + "/web-update-daybook/" + params.id,
        method: "PUT",
        data,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }).then((res) => {
        if (res.data.code == "200") {
          toast.success("Day Book Updated Sucessfully");
          setDayBook({
            payment_date: "",
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
        } else {
          toast.error("Day Book Already Created for a day");
          setIsButtonDisabled(false);
        }
      });
    }
  };

  return (
    <Layout>
      <div className={styles["main-container"]}>
        <div className={styles["sub-container"]}>
          <h1>Edit Day Book</h1>
        </div>
        <div className={styles["form-container"]}>
          <form id="addIndiv" autoComplete="off">
            <div className={styles["form-sub-container"]}>
              <div className="col-sm-12 col-md-4 col-xl-3">
                <div className="form-group">
                  <TextField
                    fullWidth
                    required
                    type="date"
                    label="Date"
                    disabled
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
                    variant="standard"
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
            <div className={styles["sub-form-div"]}>
              <div className={styles["credit-container"]}>
                <h1>Credit</h1>
                {received.map((user, index) => (
                  <div key={index} className={styles["credit-component"]}>
                    <Grid2 container spacing={2}>
                      <Grid2 item>
                        <TextField
                          variant="standard"
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
                        <TextField
                          fullWidth
                          label="id"
                          hidden
                          autoComplete="Name"
                          required
                          name="id"
                          value={user.id}
                          onChange={(e) => {
                            onChangeReceived(e, index);
                          }}
                        />
                      </Grid2>
                      <Grid2 item sx={{ width: "30%" }}>
                        {user.received_about !== "New Value" && (
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
                              <MenuItem key={key} value={fabric.account_name}>
                                {fabric.account_name}
                              </MenuItem>
                            ))}
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
                      </Grid2>
                    </Grid2>
                  </div>
                ))}
              </div>
              <div className={styles["debit-container"]}>
                <h1>Dedit</h1>
                {payment.map((user, index) => (
                  <div key={index} className={styles["debit-component"]}>
                    <Grid2 container spacing={2}>
                      <Grid2 item>
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
                        <TextField
                          fullWidth
                          label="id"
                          autoComplete="Name"
                          required
                          hidden
                          name="id"
                          value={user.id}
                          onChange={(e) => {
                            onChangePayment(e, index);
                          }}
                        />
                      </Grid2>
                      <Grid2 item sx={{ width: "30%" }}>
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
                              <MenuItem key={key} value={fabric.account_name}>
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
                      </Grid2>
                    </Grid2>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles["submit-container"]}>
              <div className={styles["submit-sub-container"]}>
                {parseInt(dayBook.payment_total) -
                  parseInt(dayBook.received_total) ==
                0 ? (
                  <Button
                    type="submit"
                    color="primary"
                    onClick={(e) => onSubmit(e)}
                    disabled={isButtonDisabled}
                  >
                    Update
                  </Button>
                ) : (
                  ""
                )}
                <Button className={styles["cancel-btn"]}>Cancel</Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default EditdayBook;
