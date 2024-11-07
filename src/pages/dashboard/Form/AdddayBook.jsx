import {
  FormControl,
  Grid2,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Button,
  Autocomplete,
} from "@mui/material";
import Layout from "../../../layout/Layout";
import styles from "./dailybook.module.css";
import DeleteIcon from "@mui/icons-material/Delete";
import React, { useEffect, useRef, useState } from "react";
import BASE_URL, { baseURL } from "../../../base/BaseUrl";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Input } from "@material-tailwind/react";
import { FaPlus } from "react-icons/fa";

const AdddayBook = () => {
  const inputRef = useRef(null);

  const navigate = useNavigate();

  const location = useLocation();
  const selectedDate = location.state?.selectedDate;

  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();

  today = mm + "/" + dd + "/" + yyyy;
  var todayback = yyyy + "-" + mm + "-" + dd;
  const [currentYear , setCurrentYear] = useState(null);
  var midate = "04/04/2022";
  const [dayBook, setDayBook] = useState({
    payment_date: todayback,
    payment_year: currentYear,
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

  const [amountValues, setAmountValues] = useState(null);

  const [data, setData] = useState();

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

    fetch(BASE_URL + "/api/web-fetch-year", requestOptions)
      .then((response) => response.json())
      .then((data) => setCurrentYear(data.year?.current_year));
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

  const onSubmit = (e) => {
    let data = {
      payment_date: dayBook.payment_date,
      payment_year: currentYear,
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
        url: BASE_URL + "/api/web-create-payment-received",
        method: "POST",
        data,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }).then((res) => {
        if (res.data.code == "200") {
          navigate("/home");
          setDayBook({
            payment_date: todayback,
            payment_year: currentYear,
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

  return (
    <Layout>
      <div className={styles["main-container"]}>
      <div className={styles["sub-container"]}>
          <h1>Add Day Book</h1>
        </div>
        <div className={styles["form-container"]}>
          <form id="addIndiv" autoComplete="off">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6 mt-2">
              <div className="form-group">
                <Input
                  fullWidth
                  required
                  type="date"
                  label="Date"
                  autoComplete="Name"
                  name="payment_date"
                  value={dayBook.payment_date}
                  disabled={!selectedDate}
                 labelProps ={{
                    className:"!text-gray-700"
                  }}
                />
              </div>

              <div className="form-group">
                <Input
                  fullWidth
                  required
                  disabled
                  label="Received Total"
                  autoComplete="Name"
                  name="received_total"
                  value={dayBook.received_total}
                  onChange={(e) => onInputChange(e)}
                  labelProps ={{
                    className:"!text-gray-700"
                  }}
                />
              </div>

              <div className="form-group">
                <Input
                  fullWidth
                  required
                  disabled
                  label="Payment Total"
                  autoComplete="Name"
                  name="payment_total"
                  value={dayBook.payment_total}
                  onChange={(e) => onInputChange(e)}
                  labelProps ={{
                    className:"!text-gray-700"
                  }}
                />
              </div>

              <div className="form-group">
                <Input
                  fullWidth
                  required
                  disabled
                  label="Balance"
                  autoComplete="Name"
                  name="payment_balance"
                  value={dayBook.received_total - dayBook.payment_total}
                  onChange={(e) => onInputChange(e)}
                  labelProps ={{
                    className:"!text-gray-700"
                  }}
                />
              </div>
            </div>
            <hr />
            <div className="grid grid-cols-2 gap-5">
              <div >
                <h1 className="p-2 text-xl font-bold">Credit</h1>
                {received.map((user, index) => (
                  <div key={index} className="mb-3">
                    <div className="flex gap-3">
                      <div className="">
                        <Input
                          fullWidth
                          label="Amount"
                          autoComplete="Name"
                          required
                          name="received_amount"
                          value={user.received_amount}
                          onChange={(e) => {
                            onChangeReceived(e, index);
                            ReceivedCal(index);
                          }}
                        />
                      </div>
                      <div className="w-[100%]">
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
                              required
                              {...params}
                              label="Account"
                              InputLabelProps={{ shrink: true }}
                              autoComplete="off"
                              name="received_about"
                              sx={{
                                "& .MuiInputBase-root": {
                                  padding: "1px", 
                                },
                              }}
                            />
                          )}
                        />
                      </div>
                      {index >= 1 && (
                        <div className={styles["delete-btn"]}>
                          <IconButton
                            tabIndex="-1"
                            onClick={() => removeReceived(index)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <div className="mb-4">
                  <Button onClick={(e) => addReceived(e)}> <FaPlus/> &nbsp; Add More</Button>
                </div>
              </div>
              <div >
                <h1 className="p-2 text-xl font-bold">Dedit</h1>
                {payment.map((user, index) => (
                  <div key={index} className="mb-3">
                    <div className="flex gap-3">
                      <div>
                        <Input
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
                      <div className="w-[100%]">
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
                              required
                              {...params}
                              label="Account"
                              InputLabelProps={{ shrink: true }}
                              autoComplete="off"
                              name="payment_about"
                              sx={{
                                "& .MuiInputBase-root": {
                                  padding: "1px", 
                                },
                              }}
                            />
                          )}
                        />
                      </div>
                      {index >= 1 && (
                        <div className="col-sm-12 col-md-12 col-xl-1">
                          <IconButton
                            tabIndex="-1"
                            onClick={() => removePayment(index)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <div className="mb-3">
                  <Button
                  
                  onClick={(e) => addPayment(e)}> 
                  
                  <FaPlus/> &nbsp;  Add More</Button>
                </div>
              </div>
            </div>
            <div className={styles["submit-container"]}>
              <div >
                {parseInt(dayBook.payment_total) -
                  parseInt(dayBook.received_total) ==
                0 ? (
                  <button
                   className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
                    type="submit"
                    color="primary"
                    onClick={(e) => onSubmit(e)}
                    disabled={isButtonDisabled}
                  >
                    Submit
                  </button>
                ) : (
                  ""
                )}
                <button
                  onClick={handleCancelButton}
                   className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
               
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default AdddayBook;
