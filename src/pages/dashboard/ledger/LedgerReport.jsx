import { Button, TextField } from "@mui/material";
import styles from "./ledgerreport.module.css";
import { useEffect, useRef, useState } from "react";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import CircularProgress from "@mui/material/CircularProgress";
import ReactToPrint from "react-to-print";
import Moment from "moment";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Layout from "../../../layout/Layout";
import { baseURL } from "../../../base/BaseUrl";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { MdKeyboardBackspace } from "react-icons/md";

const LedgerReport = () => {
  const componentRef = useRef(null);

  const navigate = useNavigate();

  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();

  today = mm + "/" + dd + "/" + yyyy;

  const [payment, setPayment] = useState([]);
  const [received, setReceived] = useState([]);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    let data = {
      account_name: localStorage.getItem("account_name"),
      from_date: localStorage.getItem("from_date"),
      to_date: localStorage.getItem("to_date"),
    };

    axios({
      url: baseURL + "/web-fetch-ledger-report-new",
      method: "POST",
      data,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then((res) => {
      setPayment(res.data.payment);
      setReceived(res.data.received);

      setLoader(false);
    });
  }, []);

 const calculateTotalPayment = () => {
  let total = 0;
  payment.forEach((item) => {
    total += Number(item.payment_amount) || 0;
  });
  return total;
};

const calculateTotalReceived = () => {
  let total = 0;
  received.forEach((item) => {
    total += Number(item.received_amount) || 0;
  });
  return total;
};

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
      pdf.save("ledger-report.pdf");
      toast.success("Ledger Report is Downloaded Successfully");
    });
  };

  const onSubmit = (e) => {
    let data = {
      account_name: localStorage.getItem("account_name"),
      from_date: localStorage.getItem("from_date"),
      to_date: localStorage.getItem("to_date"),
    };
    e.preventDefault();

    axios({
      url: baseURL + "/web-download-ledger-report-new",
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
        link.setAttribute("download", "ledger.csv");
        document.body.appendChild(link);
        link.click();
        toast.success("Ledger Report is Downloaded Successfully");
      })
      .catch((err) => {
      });
  };

  const handleBackButton = () => {
    navigate("/ledger");
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
            <Link to="/ledger">
                <MdKeyboardBackspace className=" text-white bg-[#464D69] p-1 w-10 h-8 cursor-pointer rounded-2xl" />
              </Link> &nbsp;
              Ledger Report
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
                        <th>Date</th>
                        <th>Debit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payment.map((dataSumm, key) => (
                        <tr key={key}>
                          <td>
                            {Moment(dataSumm.payment_date).format("DD-MM-YYYY")}
                          </td>
                          <td>{dataSumm.payment_amount}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td>Total</td>
                        <td>{calculateTotalPayment()}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
                <div className={styles["debit-table"]}>
                  <table className={styles["table"]}>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Credit </th>
                      </tr>
                    </thead>
                    <tbody>
                      {received.map((dataSumm, key) => (
                        <tr key={key}>
                          <td>
                            {Moment(dataSumm.received_date).format(
                              "DD-MM-YYYY"
                            )}
                          </td>
                          <td>{dataSumm.received_amount}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td>Total</td>
                        <td>{calculateTotalReceived()}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
            <div
              className="col-md-12 mt-4"
              style={{ display: "flex", justifyContent: "center" }}
            >
              <h4>
                {" "}
                Balance (
                {calculateTotalReceived() - calculateTotalPayment() >= "0"
                  ? " to be paid "
                  : " to be received "}
                ) = &nbsp; ₹
                {calculateTotalReceived() - calculateTotalPayment() >= "0"
                  ? calculateTotalReceived() - calculateTotalPayment()
                  : calculateTotalPayment() - calculateTotalReceived()}
              </h4>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default LedgerReport;
