import { useEffect, useRef, useState } from "react";
import { baseURL } from "../../../../base/BaseUrl";
import {
  Button,
  TextField,
  MenuItem,
  Grid2,
  Autocomplete,
  IconButton,
} from "@mui/material";
import {  useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Layout from "../../../../layout/Layout";
import styles from "./editdaybook.module.css";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";

const EditdayBook = () => {
  const location = useLocation();
  const selectedDate = location.state?.selectedDate;

  const navigate = useNavigate();
  const inputRef = useRef(null);

  const [date, setDate] = useState(null);

  useEffect(() => {
    if (selectedDate) {
      setDate(selectedDate);
    }
  }, [selectedDate]);

  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();

  today = mm + "/" + dd + "/" + yyyy;
  var midate = "04/04/2022";
  var todayback = yyyy + "-" + mm + "-" + dd;

  const [dayBook, setDayBook] = useState({
    payment_date: null,
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

  console.log(payment_count ,received_count , "received_count" )

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
      url: `${baseURL}/web-fetch-daybook-paid-by-id-new/${selectedDate}`,

      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then((res) => {
      if (Array.isArray(res.data.payment)) {
        const length = res.data.payment.length;
        setPaymentCount(length);
      } else {
        console.error("Expected res.data.payment to be an array");
      }

      if (Array.isArray(res.data.received)) {
        const length = res.data.received.length;
        setReceivedCount(length);
      } else {
        console.error("Expected res.data.payment to be an array");
      }

      setPayment(res.data.payment);
      setReceived(res.data.received);

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

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

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
      payment_year: "2023-24",
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
        url: `${baseURL}/web-update-daybook-paid-new/${date}`,
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
            payment_no_of_count: "0",
            received_no_of_count: "0",
            payment_sub_data: "",
            received_sub_data: "",
          });
          setReceivedCount(1);
          setPaymentCount(1);
          setPayment([{ payment_about: "", payment_amount: "0" }]);
          setReceived([{ received_about: "", received_amount: "0" }]);
          
          navigate("/home");
          setIsButtonDisabled(false);
        } else {
          toast.success("Day Book Already Created for a day");
          setIsButtonDisabled(false);
        }
      });
    }
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

  const handleCancelButton = () => {
    navigate("/home");
  };

  useEffect(() => {
    if (selectedDate) {
      setDayBook((prev) => ({
        ...prev,
        payment_date: selectedDate,
      }));
    }
  }, [selectedDate]);

  const addReceived = () => {
    setReceived([...received, useTemplate2]);
    setReceivedCount((prev) => prev + 1);
  };

  const addPayment = () => {
    setPayment([...payment, useTemplate1]);
    setPaymentCount((prev)=> prev + 1);
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
                        autoComplete="Name"
                        name="payment_date"
                        value={dayBook.payment_date}
                        disabled={!selectedDate}
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
            <div className={styles["sub-form-div"]}>
              <div className={styles["credit-container"]}>
                <h1>Credit</h1>
                {received.map((user, index) => (
                  <div key={index} className={styles["credit-component"]}>
                    <div className={styles['credit-sub-container']}>
                      <div >
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
                      </div>
                      <div>
                        <Autocomplete
                          disablePortal
                          options={accountName}
                          getOptionLabel={(option) =>
                            option?.account_name || ""
                          }
                          value={
                            accountName.find(
                              (option) =>
                                option.account_name === user.received_about
                            ) || null
                          }
                          onChange={(event, newValue) => {
                            if (newValue && newValue.inputValue) {
                              const newOption = {
                                account_name: newValue.inputValue,
                              };
                              // Add the new value to the options list
                              setaccountName((prevOptions) => [
                                ...prevOptions,
                                newOption,
                              ]);
                              onChangeReceived(
                                {
                                  target: {
                                    name: "received_about",
                                    value: newValue.inputValue,
                                  },
                                },
                                index
                              );
                            } else {
                              onChangeReceived(
                                {
                                  target: {
                                    name: "received_about",
                                    value: newValue
                                      ? newValue.account_name
                                      : "",
                                  },
                                },
                                index
                              );
                            }
                          }}
                          filterOptions={(options, { inputValue }) => {
                            const filtered = options.filter((option) =>
                              option.account_name
                                .toLowerCase()
                                .includes(inputValue.toLowerCase())
                            );
                            if (
                              inputValue !== "" &&
                              !filtered.some(
                                (option) => option.account_name === inputValue
                              )
                            ) {
                              filtered.push({
                                inputValue,
                                account_name: `${inputValue}`,
                              });
                            }
                            return filtered;
                          }}
                          renderInput={(params) => (
                            <TextField
                              variant="standard"
                              required
                              {...params}
                              label="Account"
                              InputLabelProps={{ shrink: true }}
                              autoComplete="off"
                              name="received_about"
                            />
                          )}
                        />
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
                  </div>
                ))}
                <div className={styles["button-div"]}>
                  <Button onClick={(e) => addReceived(e)}>Add More</Button>
                </div>
              </div>
              <div className={styles["debit-container"]}>
                <h1>Dedit</h1>
                {payment.map((user, index) => (
                  <div key={index} className={styles["debit-component"]}>
                    <div  className={styles['debit-sub-container']}>
                      <div>
                        <TextField
                          fullWidth
                          variant="standard"
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
                      <div>
                    
                        <Autocomplete
                          disablePortal
                          options={accountName}
                          getOptionLabel={(option) =>
                            option?.account_name || ""
                          }
                          value={
                            accountName.find(
                              (option) =>
                                option.account_name === user.payment_about
                            ) || null
                          }
                          onChange={(event, newValue) => {
                            if (newValue && newValue.inputValue) {
                               const newOption = {
                                account_name: newValue.inputValue,
                              };
                              setaccountName((prevOptions) => [
                                ...prevOptions,
                                newOption,
                              ]);
                              onChangePayment(
                                {
                                  target: {
                                    name: "payment_about",
                                    value: newValue.inputValue,
                                  },
                                },
                                index
                              );
                            } else {
                              onChangePayment(
                                {
                                  target: {
                                    name: "payment_about",
                                    value: newValue
                                      ? newValue.account_name
                                      : "",
                                  },
                                },
                                index
                              );
                            }
                          }}
                          filterOptions={(options, { inputValue }) => {
                            const filtered = options.filter((option) =>
                              option.account_name
                                .toLowerCase()
                                .includes(inputValue.toLowerCase())
                            );
                            if (
                              inputValue !== "" &&
                              !filtered.some(
                                (option) => option.account_name === inputValue
                              )
                            ) {
                              filtered.push({
                                inputValue,
                                account_name: `${inputValue}`,
                              });
                            }
                            return filtered;
                          }}
                          renderInput={(params) => (
                            <TextField
                              variant="standard"
                              required
                              {...params}
                              label="Account"
                              InputLabelProps={{ shrink: true }}
                              autoComplete="off"
                              name="payment_about"
                            />
                          )}
                        />
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
                  </div>
                ))}
                <div className={styles["button-div"]}>
                  <Button onClick={(e) => addPayment(e)}>Add More</Button>
                </div>
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
                <Button
                  className={styles["cancel-btn"]}
                  onClick={handleCancelButton}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default EditdayBook;
