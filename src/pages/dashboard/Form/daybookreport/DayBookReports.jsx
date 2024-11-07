import { Button, TextField } from "@mui/material";
import Layout from "../../../../layout/Layout";
import styles from "./daybookreport.module.css";
import { useEffect, useRef, useState } from "react";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import CircularProgress from "@mui/material/CircularProgress";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import ReactToPrint from "react-to-print";
import axios from "axios";
import { toast } from "react-toastify";

import { Link } from "react-router-dom";
import BASE_URL, { baseURL } from "../../../../base/BaseUrl";
import { Input } from "@material-tailwind/react";

const DayBookReports = () => {
  const componentRef = useRef(null);

  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();

  today = mm + "/" + dd + "/" + yyyy;
  const [isExporting, setIsExporting] = useState(false);
  const [payment, setPayment] = useState([]);
  const [received, setReceived] = useState([]);
  const [paymentTotal, setPaymentTotal] = useState([]);
  const [receivedTotal, setReceivedTotal] = useState([]);
  const [loader, setLoader] = useState(false);

  var todayback = yyyy + "-" + mm + "-" + dd;

  const [reportDownload, setReportDownload] = useState({
    from_date: todayback,
  });

  const onInputChange = (e) => {
    const newReportDownload = {
      ...reportDownload,
      [e.target.name]: e.target.value,
    };

    setReportDownload(newReportDownload);
  };

  const fetchData = async () => {
    try {
      const data = {
        from_date: reportDownload.from_date,
      };

      axios({
        url: baseURL + "/web-fetch-daybook-report",
        method: "POST",
        data,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }).then((res) => {
        
        setPayment(res.data.payment);
        setReceived(res.data.received);
        setPaymentTotal(res.data.total_payment_amount);
        setReceivedTotal(res.data.total_received_amount);
        setLoader(false);
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [reportDownload.from_date]);

  // for download
  const onSubmit = (e) => {
    let data = {
      from_date: reportDownload.from_date,
    };
    e.preventDefault();

    axios({
      url: baseURL + "/web-download-daybook-report",
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
        link.setAttribute("download", "dayBook.csv");
        document.body.appendChild(link);
        link.click();
        toast.success("Day Book Report is Downloaded Successfully");
      })
      .catch((err) => {
        toast.error("Day Book Report is Not Downloaded");
      });
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
      pdf.save("day-book.pdf");
    });
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2);
    return `${day}-${month}-${year}`;
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
        <>
          <div className={styles["main-container"]}>
            <div className={styles["sub-container"]}>
              <h1>Day Book</h1>
              <div>
                <Input
                  fullWidth
                  required
                  type="date"
                  label="Date"
                  autoComplete="Name"
                  name="from_date"
                  value={reportDownload.from_date}
                  onChange={(e) => onInputChange(e)}
                />
              </div>
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
                      <Button
                        startIcon={<LocalPrintshopIcon />}
                        color="primary"
                      >
                        Print
                      </Button>
                    )}
                    content={() => componentRef.current}
                  />
                </div>
              </div>
              <div
                className={styles["table-main-container"]}
                ref={componentRef}
                style={{ fontSize: isExporting ? "10px" : "16px" }}
              >
                <h1>
                  {reportDownload.from_date
                    ? formatDate(reportDownload.from_date)
                    : ""}
                </h1>
                <div className={styles["table-container"]}>
                  <div className={styles["credit-table"]}>
                    <table className={styles["table"]}>
                      <thead>
                        <tr>
                          <th>Sl No</th>
                          <th>Credit by</th>
                          <th>Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {received.map((dataSumm, key) => (
                          <tr key={key}>
                            <td>
                              <Link to="/">{key + 1}</Link>
                            </td>
                            <td>{dataSumm.received_about}</td>
                            <td>{dataSumm.received_amount}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr>
                          <td colSpan={2}>Total</td>
                          <td>{receivedTotal.total_received_amount}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                  <div className={styles["debit-table"]}>
                    <table className={styles["table"]}>
                      <thead>
                        <tr>
                          <th>Sl No</th>
                          <th>Debit by</th>
                          <th>Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {payment.map((dataSumm, key) => (
                          <tr key={key}>
                            <td>
                              <Link to={"editPaid/" + dataSumm.id}>
                                {key + 1}
                              </Link>
                            </td>
                            <td>{dataSumm.payment_about}</td>
                            <td>{dataSumm.payment_amount}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr>
                          <td colSpan={2}>Total</td>
                          <td>{paymentTotal.total_payment_amount}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </Layout>
  );
};

export default DayBookReports;
