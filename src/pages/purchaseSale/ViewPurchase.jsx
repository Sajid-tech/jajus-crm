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

const ViewPurchase = () => {
  const { id } = useParams();
  const componentRef = useRef();

  const [loader, setLoader] = useState(false);
  const [purchase, setPurchase] = useState([]);
  const [purchaseSub, setPurchaseSub] = useState([]);
  let total = 0;

  useEffect(() => {
    axios({
      url: `${BASE_URL}/api/web-fetch-purchase-by-id/${id}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then((res) => {
        setPurchase(res.data.purchase);
        setPurchaseSub(res.data.purchaseSub);
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
                Purchase
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
                        <span className="mr-2">🖨️</span> Print 
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
                        JAJU’S FLOORING CONCEPTS
                      </h3>
                      <small>new 80 ft sompura, sriniwaspura road, Banakshankari 6th Stage 11th Block, Srinivaspura, Bengaluru, Karnataka 560098</small><br/>
                      <small>Phone : 097420 42097 Email : </small>
                      <h4 className="text-xl font-semibold">PURCHASE</h4>
                    </div>

                    <div className="grid grid-cols-2  !m-0">
                      <div className="flex justify-center border-r border-gray-300 pr-3 m-2">
                        <span>Date:</span>{" "}
                        <span>
                          {moment(purchase.purchase_date).format("DD-MM-YYYY")}
                        </span>
                      </div>
                      <div className="flex justify-center pl-3 m-2">
                        <span>Purchase No:</span> <span>{purchase.purchase_no}</span>
                      </div>
                    </div>

                    <div className="border p-2">
                      <span className="font-semibold">Supplier:</span>{" "}
                      <span>{purchase.purchase_supplier}</span>
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
                          {purchaseSub.map((dataSumm, key) => (
                            <tr className="border-b" key={key}>
                              <td className="py-2 px-4 border-r">{key + 1}</td>
                              <td className="py-2 px-4 border-r">
                                {dataSumm.purchase_sub_item}
                              </td>
                              <td className="py-2 px-4 border-r">
                                {dataSumm.purchase_sub_qnty}
                              </td>
                              <td className="py-2 px-4 border-r">
                                {dataSumm.purchase_sub_rate}
                              </td>
                              <td className="py-2 px-4">
                                {dataSumm.purchase_sub_amount}
                                <span className="hidden">
                                  {(total += dataSumm.purchase_sub_amount)}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr>
                            <td
                              colSpan="4"
                              className="text-right font-semibold pr-4 border-r border-b"
                            >
                              Total
                            </td>
                            <td className="text-right pr-4 font-bold border-r border-b">
                              {total}
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

export default ViewPurchase;
