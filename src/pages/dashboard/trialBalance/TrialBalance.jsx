import React, { useEffect, useState } from "react";
import styles from "./trialbalance.module.css";
import Layout from "../../../layout/Layout";
import { Button, Grid2, MenuItem, TextField } from "@mui/material";
import { baseURL } from "../../../base/BaseUrl";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const TrialBalance = () => {
  let navigate = useNavigate();

  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();

  today = mm + "/" + dd + "/" + yyyy;
  var todayback = yyyy + "-" + mm + "-" + dd;

  const [trialBalance, setTrialBalanceDownload] = useState({
    from_date: "2023-04-01",
    to_date: todayback,
  });

  const onInputChange = (e) => {
    setTrialBalanceDownload({
      ...trialBalance,
      [e.target.name]: e.target.value,
    });
  };

  const onReportView = (e) => {
    e.preventDefault();

    localStorage.setItem("from_date", trialBalance.from_date);
    localStorage.setItem("to_date", trialBalance.to_date);
    navigate("/trialBalanceReport");
  };

  const onSubmit = (e) => {
    e.preventDefault();
    var v = document.getElementById("addIndiv").checkValidity();
    var v = document.getElementById("addIndiv").reportValidity();
    if (v) {
      let data = {
        from_date: trialBalance.from_date,
        to_date: trialBalance.to_date,
      };

      axios({
        url: baseURL + "/web-download-trialBalance-report",
        method: "POST",
        data,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((res) => {
          const url = window.URL.createObjectURL(new Blob([res.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "trialBalance.csv");
          document.body.appendChild(link);
          link.click();
          toast.success("Trial Balance Report is Downloaded Successfully");
        })
        .catch((err) => {
          console.log(err);
          toast.error("Trial Balance Report is Not Downloaded");
        });
    }
  };

  return (
    <Layout>
      <div className={styles["main-container"]}>
        <h1>Trial Balance Form</h1>
        <div className={styles["sub-container"]}>
          <form id="addIndiv" autoComplete="off">
            <div>
              <Grid2 container spacing={3}>
                <Grid2>
                  <TextField
                    fullWidth
                    sx={{ width: 500 }}
                    variant="standard"
                    required
                    label="From Date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    autoComplete="Name"
                    name="from_date"
                    value={trialBalance.from_date}
                    onChange={(e) => onInputChange(e)}
                  />
                </Grid2>
                <Grid2 item>
                  <TextField
                    fullWidth
                    sx={{ width: 500 }}
                    variant="standard"
                    required
                    label="To Date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    autoComplete="Name"
                    name="to_date"
                    value={trialBalance.to_date}
                    onChange={(e) => onInputChange(e)}
                  />
                </Grid2>
              </Grid2>
            </div>
            <div className={styles["btn-main-container"]}>
              <div className={styles["btn-container"]}>
                <Button color="primary" onClick={(e) => onReportView(e)}>
                  View
                </Button>
                <Button onClick={(e) => onSubmit(e)}>Download</Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default TrialBalance;
