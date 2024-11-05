import { Button, TextField } from "@mui/material";
import styles from "./trialbalancereport.module.css";
import { useEffect, useRef, useState } from "react";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import CircularProgress from "@mui/material/CircularProgress";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import ReactToPrint from "react-to-print";
import Moment from "moment";
import axios from "axios";
import Layout from "../../../layout/Layout";
import { baseURL } from "../../../base/BaseUrl";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";

const TrialBalanceReport = () => {
  const componentRef = useRef();

  const [loader, setLoader] = useState(true);

  const [payment, setPayment] = useState([]);

  const [paymentTotal, setPaymentTotal] = useState([]);
  const [receivedTotal, setReceivedTotal] = useState([]);

  useEffect(() => {
    let data = {
      from_date: localStorage.getItem("from_date"),
      to_date: localStorage.getItem("to_date"),
    };

    axios({
      url: baseURL + "/web-fetch-trialBalance-report",
      method: "POST",
      data,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then((res) => {
      setPayment(res.data.payment);

      setLoader(false);
    });
  }, []);

  const positiveValues = payment.filter(
    (item) => !item.balance.toString().startsWith("-")
  );

  const positiveSum = positiveValues.reduce(
    (accumulator, currentValue) =>
      accumulator + parseFloat(currentValue.balance),
    0
  );

  const negativeValues = payment.filter((item) =>
    item.balance.toString().startsWith("-")
  );

  const negativeSum = negativeValues.reduce(
    (accumulator, currentValue) =>
      accumulator + parseFloat(currentValue.balance),
    0
  );

  // for save as pdf directly
  const handleSavePDF = () => {
    const input = componentRef.current;
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 0;
      pdf.addImage(
        imgData,
        "PNG",
        imgX,
        imgY,
        imgWidth * ratio,
        imgHeight * ratio
      );
      pdf.save("trial-balance-report.pdf");
    });
  };

  const onSubmit = (e) => {
    let data = {
      from_date: localStorage.getItem("from_date"),
      to_date: localStorage.getItem("to_date"),
    };
    e.preventDefault();

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
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleBackButton = () => {
    navigator("/");
  };

  return (
    <Layout>
      {loader && (
        <CircularProgress
          disableShrink
          style={{
            marginLeft: "600px",
            marginTop: "300px",
            marginBottom: "300px",
          }}
          color="secondary"
        />
      )}
      {!loader && (
        <div className={styles["main-container"]}>
          <div className={styles["sub-container"]}>
            <h1>
              {" "}
              <KeyboardBackspaceIcon
                className={styles["back-btn"]}
                onClick={handleBackButton}
              />{" "}
              Trial Balance Report
            </h1>
          </div>
          <div className={styles["button-container"]}>
            <div className={styles["button-sub-container"]}>
              <div className={styles["btn-container"]}>
                <Button
                  startIcon={<InsertDriveFileIcon />}
                  color="primary"
                  onClick={handleSavePDF}
                >
                  PDF
                </Button>
              </div>
              <div className={styles["btn-container"]}>
                <Button
                  startIcon={<FileDownloadIcon />}
                  color="primary"
                  onClick={(e) => onSubmit(e)}
                >
                  Download
                </Button>
              </div>
              <div className={styles["btn-container"]}>
                <ReactToPrint
                  trigger={() => (
                    <Button startIcon={<LocalPrintshopIcon />} color="primary">
                      Print
                    </Button>
                  )}
                  content={() => componentRef.current}
                />
              </div>
            </div>
            <div className={styles["table-main-container"]} ref={componentRef}>
              <div className={styles["header-container"]}>
                <h4>{localStorage.getItem("account_name")}</h4>{" "}
                <span style={{ fontSize: "13px" }}>
                  From :{" "}
                  {Moment(localStorage.getItem("from_date")).format(
                    "DD-MM-YYYY"
                  )}{" "}
                  To :{" "}
                  {Moment(localStorage.getItem("to_date")).format("DD-MM-YYYY")}
                </span>
              </div>
              <div className={styles["table-container"]}>
                <div className={styles["credit-table"]}>
                  <table className={styles["table"]}>
                    <thead>
                      <tr>
                        <th>Debit</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {negativeValues.map((dataSumm, key) => (
                        <tr key={key}>
                          <td>{dataSumm.payment_about}</td>
                          <td>{dataSumm.balance * -1}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td>Total</td>
                        <td>{negativeSum * -1}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
                <div className={styles["debit-table"]}>
                  <table className={styles["table"]}>
                    <thead>
                      <tr>
                        <th>Credit</th>
                        <th>Amount </th>
                      </tr>
                    </thead>
                    <tbody>
                      {positiveValues.map((dataSumm, key) => (
                        <tr key={key}>
                          <td>{dataSumm.payment_about}</td>
                          <td>{dataSumm.balance}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td>Total</td>
                        <td>{positiveSum}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default TrialBalanceReport;
