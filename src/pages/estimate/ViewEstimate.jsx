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

const ViewEstimate = () => {
  const { id } = useParams();
  const componentRef = useRef();

  const [loader, setLoader] = useState(false);
  const [estimate, setEstimate] = useState([]);
  const [estimateSub, setEstimateSub] = useState([]);
  let total = 0;

  useEffect(() => {
    axios({
      url: `${BASE_URL}/api/web-fetch-estimate-by-id/${id}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then((res) => {
        setEstimate(res.data.estimate);
      setEstimateSub(res.data.estimateSub);
      setLoader(false);
    });
  }, []);

  const handleExportWithFunction = () => {
    console.log("calling");
    // savePDF(componentRef.current, {
    //   paperSize: "A4",
    //   orientation: "vertical",
    //   scale: 0.8,
    // });
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
              <h3 className="text-lg font-bold">
                {/* <Link to="/saleList">
                <i className="mdi mdi-keyboard-backspace text-black bg-white rounded-full p-2"></i>
              </Link> */}
                Estimate 
              </h3>
            </div>
            <div className="flex justify-center">
              <div className="w-full max-w-5xl">
                <div className="bg-white shadow-lg p-6 rounded-lg">
                  <div className="grid grid-cols-2 mb-4">
                    <div className="flex justify-center">
                      <button
                        // onClick={printReceipt}
                        className="flex items-center text-blue-600 hover:text-blue-800"
                      >
                        <span className="mr-2">
                          <BiSolidFilePdf />
                        </span>{" "}
                        PDF
                      </button>
                    </div>
                    <div className="flex justify-center">
                      <button
                        // onClick={printReceipt}
                        className="flex items-center text-blue-600 hover:text-blue-800"
                      >
                        <span className="mr-2">🖨️</span> Print Letter
                      </button>
                    </div>

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
                      ESTIMATE
                      </h3>
                    </div>

                    <div className="grid grid-cols-2  !m-0">
                      <div className="flex justify-center border-r border-gray-300 pr-3 m-2">
                        <span>Date:</span>{" "}
                        <span>
                          {moment(estimate.estimate_date).format("DD-MM-YYYY")}
                        </span>
                      </div>
                      <div className="flex justify-center pl-3 m-2">
                        <span>Estimate No:</span> <span>{estimate.estimate_no}</span>
                      </div>
                    </div>

                    <div className="border p-2">
                      <span className="font-semibold">Customer:</span>{" "}
                      <span>{estimate.estimate_customer}</span>
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
                          {estimateSub.map((dataSumm, key) => (
                            <tr className="border-b" key={key}>
                              <td className="py-2 px-4 border-r">{key + 1}</td>
                              <td className="py-2 px-4 border-r">
                                {dataSumm.estimate_sub_item}
                              </td>
                              <td className="py-2 px-4 border-r">
                                {dataSumm.estimate_sub_qnty}
                              </td>
                              <td className="py-2 px-4 border-r">
                                {dataSumm.estimate_sub_rate}
                              </td>
                              <td className="py-2 px-4">
                                {dataSumm.estimate_sub_amount}
                                <span className="hidden">
                                  {(total += dataSumm.estimate_sub_amount)}
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
                              {estimate.estimate_tax}
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
                              {estimate.estimate_tempo}
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
                              {estimate.estimate_loading}
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
                            {estimate.estimate_other}
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
                              {estimate.estimate_gross}
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
                            {estimate.estimate_advance}
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
                              {estimate.estimate_balance}
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

export default ViewEstimate;
