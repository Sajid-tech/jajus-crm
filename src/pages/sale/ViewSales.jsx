import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
// import ReactToPrint from "react-to-print";
// import { savePDF } from "@progress/kendo-react-pdf";
import Moment from "moment";
// import  {NumericFormat} from "react-number-format";
import { Link } from "react-router-dom";
import BASE_URL from "../../base/BaseUrl";
import Layout from "../../layout/Layout";
import { CircularProgress } from "@mui/material";
import moment from "moment";
import { BiSolidFilePdf } from "react-icons/bi";
import { IoPrint } from "react-icons/io5";
import { MdKeyboardBackspace } from "react-icons/md";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";


const ViewSales = () => {
  const { id } = useParams();
  const componentRef = useRef();

  const [loader, setLoader] = useState(false);
  const [sales, setSales] = useState([]);
  const [salesSub, setSalesSub] = useState([]);
  let total = 0;

  useEffect(() => {
    axios({
      url: `${BASE_URL}/api/web-fetch-sales-by-id/${id}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then((res) => {
      setSales(res.data.sales);
      setSalesSub(res.data.salesSub);
      setLoader(false);
    });
  }, []);

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
      pdf.save("sales.pdf");
    });
  };
  return (
    <Layout>
      <div>
        {loader && (
          <div className="flex justify-center items-center h-screen">
            <CircularProgress color="secondary" />
          </div>
        )}
        {!loader && (
          <>
            <div className="page-header mb-4 mt-4">
              <h3 className="flex text-xl font-bold">
              <Link to="/sale-list">
                <MdKeyboardBackspace className=" text-white bg-[#464D69] p-1 w-10 h-8 cursor-pointer rounded-2xl" />
              </Link> &nbsp;
                Sales
              </h3>
            </div>
            <div className="flex justify-center">
              <div className="w-full max-w-5xl">
                <div className="bg-white shadow-lg p-6 rounded-lg">
                <div className="flex justify-end mr-5 mb-4">
                    <div >
                      <button
                      onClick={handleSavePDF}
                        // onClick={printReceipt}
                        className="flex text-xl font-bold items-center text-blue-600 hover:text-blue-800"
                      >
                        <span className="mr-2 text-xl font-bold">
                          <BiSolidFilePdf /> 
                        </span>{" "}
                        PDF
                      </button>
                    </div>
                    {/* <div className="flex justify-center">
                      <button
                        className="flex items-center text-blue-600 hover:text-blue-800"
                      >
                        <span className="mr-2">🖨️</span> Print Letter
                      </button>
                    </div> */}

                    {/* <ReactToPrint
                    trigger={() => (
                      <button className="btn btn-primary">
                        <i className="mdi mdi-printer text-white"></i> Print
                      </button>
                    )}
                    content={() => componentRef.current}
                  /> */}
                  </div>

                  <div
                    ref={componentRef}
                    className=" border rounded-lg mt-4 space-y-4"
                  >
                    <div className="text-center border p-4 space-y-1">
                      <h3 className="text-2xl font-semibold">
                        JAJU’S FLOORING CONCEPTS
                      </h3>
                      <small>
                        New 80 ft sompura, sriniwaspura road, Banakshankari 6th
                        Stage 11th Block, Srinivaspura, Bengaluru, Karnataka
                        560098
                      </small>
                      <small>Phone : 097420 42097 Email :</small>
                      <h4 className="text-xl font-semibold">SALES</h4>
                    </div>

                    <div className="grid grid-cols-2  !m-0">
                      <div className="flex justify-center border-r border-gray-300 pr-3 m-2">
                        <span>Date:</span>{" "}
                        <span>
                          {moment(sales.sales_date).format("DD-MM-YYYY")}
                        </span>
                      </div>
                      <div className="flex justify-center pl-3 m-2">
                        <span>Sales No:</span> <span>{sales.sales_no}</span>
                      </div>
                    </div>

                    <div className="border p-2">
                      <span className="font-semibold">Customer:</span>{" "}
                      <span>{sales.sales_customer}</span>
                    </div>

                    <div className="overflow-auto">
                      <table className="w-full text-center">
                        <thead>
                          <tr className="border-b bg-gray-200">
                            <th className="py-2 px-4 font-semibold border-r">
                              Sl No
                            </th>
                            <th className="py-2 px-4 font-semibold border-r">
                              Item Name
                            </th>
                            <th className="py-2 px-4 font-semibold border-r">
                              Quantity
                            </th>
                            <th className="py-2 px-4 font-semibold border-r">
                              Rate (₹)
                            </th>
                            <th className="py-2 px-4 font-semibold">
                              Amount (₹)
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {salesSub.map((dataSumm, key) => (
                            <tr className="border-b" key={key}>
                              <td className="py-2 px-4 border-r">{key + 1}</td>
                              <td className="py-2 px-4 border-r">
                                {dataSumm.sales_sub_item}
                              </td>
                              <td className="py-2 px-4 border-r">
                                {dataSumm.sales_sub_qnty}
                              </td>
                              <td className="py-2 px-4 border-r">
                                {dataSumm.sales_sub_rate}
                              </td>
                              <td className="py-2 px-4">
                                {dataSumm.sales_sub_amount}
                                <span className="hidden">
                                  {(total += dataSumm.sales_sub_amount)}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr className="border-red-300">
                            <td
                              colSpan="4"
                              className="text-right  font-semibold pr-4 border-r border-b"
                            >
                              Sub-Total
                            </td>
                            <td className="text-right pr-4 border-r border-b">
                              {total}
                            </td>
                          </tr>
                          <tr>
                            <td
                              colSpan="4"
                              className="text-right  font-semibold pr-4 border-r border-b"
                            >
                              Tax
                            </td>
                            <td className="text-right pr-4 border-r border-b">
                              {sales.sales_tax}
                            </td>
                          </tr>
                          <tr>
                            <td
                              colSpan="4"
                              className="text-right font-semibold pr-4 border-r border-b"
                            >
                              Tempo Charges
                            </td>
                            <td className="text-right pr-4 border-r border-b">
                              {sales.sales_tempo}
                            </td>
                          </tr>
                          <tr>
                            <td
                              colSpan="4"
                              className="text-right font-semibold pr-4 border-r border-b"
                            >
                              Loading / Unloading Charges
                            </td>
                            <td className="text-right pr-4 border-r border-b">
                              {sales.sales_loading}
                            </td>
                          </tr>
                          <tr>
                            <td
                              colSpan="4"
                              className="text-right font-semibold pr-4 border-r border-b"
                            >
                              Other Charges
                            </td>
                            <td className="text-right pr-4 border-r border-b">
                              {sales.sales_other}
                            </td>
                          </tr>
                          <tr>
                            <td
                              colSpan="4"
                              className="text-right font-semibold pr-4 border-r border-b"
                            >
                              Total
                            </td>
                            <td className="text-right pr-4 font-bold border-r border-b">
                              {sales.sales_gross}
                            </td>
                          </tr>
                          <tr>
                            <td
                              colSpan="4"
                              className="text-right font-semibold pr-4 border-r border-b"
                            >
                              Advance Received
                            </td>
                            <td className="text-right pr-4 border-r border-b">
                              {sales.sales_advance}
                            </td>
                          </tr>
                          <tr>
                            <td
                              colSpan="4"
                              className="text-right font-semibold pr-4 border-r border-b"
                            >
                              Balance
                            </td>
                            <td className="text-right pr-4 font-bold border-r border-b">
                              {sales.sales_balance}
                            </td>
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
      </div>
    </Layout>
  );
};

export default ViewSales;
