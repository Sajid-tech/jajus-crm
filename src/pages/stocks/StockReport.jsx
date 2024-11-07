import { Button, TextField } from "@mui/material";
import styles from "./stockreport.module.css";
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
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { MdKeyboardBackspace } from "react-icons/md";
import { Link } from "react-router-dom";
import BASE_URL from "../../base/BaseUrl";
import Layout from "../../layout/Layout";

const StockReport = () => {
  const componentRef = useRef();

  const [loader, setLoader] = useState(true);

  const [stocks, setStocks] = useState([]);


  useEffect(() => {
    let data = {
      from_date: localStorage.getItem("from_date"),
      to_date: localStorage.getItem("to_date"),
    };

    axios({
      url: BASE_URL + "/api/web-fetch-stock-report",
      method: "POST",
      data,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then((res) => {
        setStocks(res.data.stocks);

      setLoader(false);
    });
  }, []);

//   const positiveValues = stocks.filter(
//     (item) => !item.balance.toString().startsWith("-")
//   );

//   const positiveSum = positiveValues.reduce(
//     (accumulator, currentValue) =>
//       accumulator + parseFloat(currentValue.balance),
//     0
//   );

//   const negativeValues = payment.filter((item) =>
//     item.balance.toString().startsWith("-")
//   );

//   const negativeSum = negativeValues.reduce(
//     (accumulator, currentValue) =>
//       accumulator + parseFloat(currentValue.balance),
//     0
//   );

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
      pdf.save("stocks-report.pdf");
    });
  };

  const onSubmit = (e) => {
    let data = {
      from_date: localStorage.getItem("from_date"),
      to_date: localStorage.getItem("to_date"),
    };
    e.preventDefault();

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
        link.setAttribute("download", "trialBalance.csv");
        document.body.appendChild(link);
        link.click();
      })
      .catch((err) => {
      });
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
            <h1 className="flex"> 
                 <Link to="/stock-form">
                <MdKeyboardBackspace className=" text-white bg-[#464D69] p-1 w-10 h-8 cursor-pointer rounded-2xl" />
              </Link> &nbsp;
              Stocks Report
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
                <span style={{ fontSize: "18px" , fontWeight : "500" }}>
              Stocks    From :{" "}
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
                        <th>Items Name</th>
                        <th>Open Balance</th>
                        <th>Received</th>
                        <th>Sales</th>
                        <th>Close Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stocks.map((dataSumm, key) => (
                        <tr key={key}>
                          <td>{dataSumm.product_type}</td>
                          <td>{dataSumm.openpurch - dataSumm.closesale}</td>
                          <td>{dataSumm.purch}</td>
                          <td>{dataSumm.sale}</td>
                          <td>{(dataSumm.openpurch - dataSumm.closesale) + (dataSumm.purch - dataSumm.sale)}</td>
                         
                        </tr>
                      ))}
                    </tbody>
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

export default StockReport;
