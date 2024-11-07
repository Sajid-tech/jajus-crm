import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CircularProgress} from "@mui/material";
import MUIDataTable from "mui-datatables";
import Layout from "../../layout/Layout";
import BASE_URL from "../../base/BaseUrl";
import moment from "moment";

const EstimateList = () => {
  const [chapterList, setChapterList] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOrderList = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${BASE_URL}/api/web-fetch-estimate-list`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setChapterList(response.data?.estimate);
      } catch (error) {
        console.error("error while fetching select chapters ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrderList();
    setLoading(false);
  }, []);

  const columns = useMemo(
    () => [
      
      {
        name: "estimate_date",
        label: "Estimate Date",
        options: {
          filter: true,
          sort: false,
          customBodyRender: (estimate_date, tableMeta) => {
            const idss = chapterList[tableMeta.rowIndex].id;
            return (
              <Link 
                title="View Estimate" 
                to={`/view-estimate/${idss}`}
                style={{color : "rgb(30 136 229)"}}
              >
                {moment(estimate_date).format("DD-MM-YYYY")}
              </Link>
            );
          }
        }
      },
      {
        name: "estimate_no",
        label: "Estimate No",
        options: {
          filter: true,
          sort: false,
          customBodyRender: (value, tableMeta) => {
            const estimateStatus = chapterList[tableMeta.rowIndex].estimate_status;
            const ids = chapterList[tableMeta.rowIndex].id;
            const isUserType1 = localStorage.getItem("user_type_id");
      
            if (isUserType1 == '1') {
              return value;
              
            } else if((estimateStatus == 'Estimate') && (isUserType1 == '2') ) {
              return (
                <Link style={{color : "rgb(30 136 229)"}} title="Create Sales" to={`/add-esales/${ids}`}>
                  {value}
                </Link>
              );
            }else{
              return value;
            }
          },
        },
      }
      ,
      {
        name: "estimate_customer",
        label: "Customer",
        options: {
          filter: true,
          sort: false,
        },
      },
      {
        name: "estimate_no_of_count",
        label: "No Of Items",
        options: {
          filter: true,
          sort: false,
        },
      },
      {
        name: "estimate_gross",
        label: "Gross",
        options: {
          filter: true, 
          sort: false,
        },
      },
      {
        name: "estimate_advance",
        label: "Advance",
        options: {
          filter: true,
          sort: false,
        },
      },
      {
        name: "estimate_balance",
        label: "Balance",
        options: {
          filter: true,
          sort: false,
        },
      },

      
    ],
    [chapterList]
  );

  const options = {
    selectableRows: "none",
    elevation: 0,
    responsive: "standard",
    viewColumns: false,
    download: false,
    print: false,
  };

  const data = useMemo(() => (chapterList ? chapterList : []), [chapterList]);

  return (
    <Layout>
      {loading && (
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
      <div className="flex flex-col md:flex-row justify-between items-center  mt-5 p-2 rounded-lg space-y-4 md:space-y-0">
        <h3 className="text-center md:text-left text-lg md:text-xl font-bold">
          Estimate
        </h3>

        <Link
          to="/add-estimate"
          className="btn btn-primary text-center md:text-right text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg shadow-md"
        >
          <button>+ Add Estimate</button>
        </Link>
      </div>
      <div className="mt-5">
        <div className="bg-white mt-4 p-4 md:p-6 rounded-lg shadow-lg">
          <MUIDataTable
            title={"Estimate List"}
            data={data}
            columns={columns}
            options={options}
          />
        </div>
      </div>
    </Layout>
  );
};

export default EstimateList;
