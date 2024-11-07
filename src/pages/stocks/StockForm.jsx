import React, { useEffect, useState } from "react";
import styles from "./stocks.module.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Input } from "@material-tailwind/react";
import BASE_URL from "../../base/BaseUrl";
import Layout from "../../layout/Layout";

const StockForm = () => {
  let navigate = useNavigate();

  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();

  today = mm + "/" + dd + "/" + yyyy;
  var todayback = yyyy + "-" + mm + "-" + dd;
  const [currentYear, setCurrentYear] = useState(null);

  const [stocks, setStocksDownload] = useState({
    from_date: currentYear,
    to_date: todayback,
  });

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
      .then((data) => setCurrentYear(data.year?.from_date));
  }, []);

  const onInputChange = (e) => {
    setStocksDownload({
      ...stocks,
      [e.target.name]: e.target.value,
    });
  };

  const onReportView = (e) => {
    e.preventDefault();
    var v = document.getElementById("addIndiv").checkValidity();
    var v = document.getElementById("addIndiv").reportValidity();
    if (v) {
      localStorage.setItem("from_date", stocks.from_date);
      localStorage.setItem("to_date", stocks.to_date);
      navigate("/stock-report");
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    var v = document.getElementById("addIndiv").checkValidity();
    var v = document.getElementById("addIndiv").reportValidity();
    if (v) {
      let data = {
        from_date: stocks.from_date,
        to_date: stocks.to_date,
      };

      axios({
        url: BASE_URL + "/api/web-download-stock-report",
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
          link.setAttribute("download", "Stock.csv");
          document.body.appendChild(link);
          link.click();
          toast.success("Stock Report is Downloaded Successfully");
        })
        .catch((err) => {
          console.log(err);
          toast.error("Stock Report is Not Downloaded");
        });
    }
  };

  return (
    <Layout>
      <div className={styles["main-container"]}>
        <h1>Stocks Form</h1>
        <div className={styles["sub-container"]}>
          <form id="addIndiv" autoComplete="off">
            <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
              <div>
                <Input
                  fullWidth
                  required
                  label="From Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  autoComplete="Name"
                  name="from_date"
                  value={stocks.from_date}
                  onChange={(e) => onInputChange(e)}
                />
              </div>
              <div item>
                <Input
                  fullWidth
                  required
                  label="To Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  autoComplete="Name"
                  name="to_date"
                  value={stocks.to_date}
                  onChange={(e) => onInputChange(e)}
                />
              </div>
            </div>
            <div className={styles["btn-main-container"]}>
              <div>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
                  color="primary"
                  onClick={(e) => onReportView(e)}
                >
                  View
                </button>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
                  onClick={(e) => onSubmit(e)}
                >
                  Download
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default StockForm;
