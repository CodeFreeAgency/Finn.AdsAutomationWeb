import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import "./reports.css";
import { CircularProgress, Pagination, Stack } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import ExportIcon from "../../assets/images/icons/export.svg";
import { toast } from "react-toastify";
import load1 from "../../assets/images/icons/Spinner.gif";
import NewChart from "./newchart";
import { DateRangePicker } from "rsuite";
import isAfter from "date-fns/isAfter";
import Moment from "moment";
import DashboardLayout from "../../layouts/DashboardLayout";

interface ResultProps {
  searchResult: any;
}
let columns: GridColDef[] = [];

  const Tacos: React.FunctionComponent<ResultProps> = (props) => {
   let current = new Date();

   let endDate = new Date();
  let currPage = 1;
  let dataLength = 50;
  const [startDate ,setStartDate]=useState(new Date().setDate(current.getDate() - 30))
  const [apiLoading, setApiLoading] = useState(false);
  const [rows, setRows] = useState<any[]>([]);
  const [perPage, setPerPage] = useState(50);
  const [spinner, setSpinner] = useState(false);
  const [lastPage, setLastPage] = useState(1);
  const [activePage, setActivePage] = useState(1);
  const [totalRow, setTotalRow] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [globalFilterDateRange ,setglobalFilterDateRange] = useState([])
  

  useEffect(() => {
    if (props.searchResult !== "") {
        // tacos();
    }
  }, [props.searchResult, searchText ,globalFilterDateRange]);



  const applyDataLength = (e) => {
    dataLength = parseInt(e.target.value);
    setPerPage(e.target.value);
    currPage = activePage;
    // tacos();
  };

  const handleChange = (event, value: number) => {
    currPage = value;
    setActivePage(value);
    dataLength = perPage;
    // tacos();
  };

  // const tacos = async () => {
  //   setApiLoading(true);
  //   let userToken = localStorage.getItem("userToken");
  //   let AuthToken = "Bearer " + userToken;
  //   let advancedFilterDateRange: any = {};
  //   let requestOptions: any = {};
  //   let url =
  //     "";
  //     if (globalFilterDateRange.length > 0) {
  //       advancedFilterDateRange = {
  //         dateRange: "Custom",
  //         startDate:
  //         Moment(globalFilterDateRange[0]).format("YYYY-MM-DD") +
  //         "T13:32:30.064Z" ,
  //         endDate:
  //         Moment(globalFilterDateRange[1]).format("YYYY-MM-DD") +
  //         "T13:32:30.064Z",
  //       };
  //     }

  //     if (globalFilterDateRange.length > 0) {
  //    requestOptions = {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: AuthToken,
  //     },

  //     body: JSON.stringify({
  //       profileId: Number(props.searchResult),
  //       pageNumber: currPage,
  //       pageSize: dataLength,
  //       globalFilters: {
  //         searchText: searchText,
  //         dateRanges: advancedFilterDateRange,
  //         advancedFilters: [],
  //       },
  //     }),
  //   };
  // }
  //    else if (globalFilterDateRange.length === 0) {
  //    requestOptions = {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: AuthToken,
  //     },

  //     body: JSON.stringify({
  //       profileId: Number(props.searchResult),
  //       pageNumber: currPage,
  //       pageSize: dataLength,
  //       globalFilters: {
  //         searchText: searchText,
  //         advancedFilters: [],
  //       },
  //     }),
  //   };
  // }

  //   try {
  //     const response = await fetch(url, requestOptions);
  //     const responceData = await response.json();
  //     if (responceData.success) {
  //       setApiLoading(false);
  //       let result = responceData.result;
  //       let data = responceData.result.data;
  //       setRows(data)
  //       setTotalRow(1);
  //       setPerPage(result.perPage);
  //       setActivePage(1);
  //       setLastPage(1);

  //       if (columns.length < 1) {
  //           let headers = responceData.result.headers;
  //           for (let i = 0; headers.length > i; i++) {
  //             if (headers[i]["keyName"] === "pPCPercentage") {
  //               columns.push({
  //                 field: "pPCPercentage",
  //                 headerName: headers[i]["displayName"],
  //                 flex:1,
  //                 minWidth: 120,
                  
  //                 renderCell: (params) => {
  //                   return (
  //                     <>
  //                       <div className="col-rulename">
  //                         <div className="col-title">{params.row.ppcPercentage}</div>
  //                       </div>
  //                     </>
  //                   );
  //                 },
  //               }); 
  //             }
  //             else if (headers[i]["keyName"] === "pPCSales") {
  //               columns.push({
  //                 field: "pPCSales",
  //                 headerName: headers[i]["displayName"],
  //                 flex:1,
  //                 minWidth: 120,
                  
  //                 renderCell: (params) => {
  //                   return (
  //                     <>
  //                       <div className="col-rulename">
  //                         <div className="col-title">{params.row.ppcSales}</div>
  //                       </div>
  //                     </>
  //                   );
  //                 },
  //               }); 
  //             }
  //              else {
  //               columns.push({
  //                 field: headers[i]["keyName"],
  //                 headerName: headers[i]["displayName"],
  //                 minWidth: 120,
  //                 flex:1
  //               });
  //             }
  //           }
      
  //         }
    
  //     } else {
  //       setRows([]);
  //       setApiLoading(false);
  //     }
  //   } catch (error) {
  //     setApiLoading(false);
  //     console.error("Error fetching data:", error);
  //   }
  // };
  
  const handleKeyDown = (event: any) => {
    if (event.key === "Enter") {
      setSearchText(event.target.value);
      event.preventDefault();
    }
  };

  // const handleExportData = async () => {
  //   setSpinner(true);
  //   let userToken = localStorage.getItem("userToken");
  //   let AuthToken = "Bearer " + userToken;
  //   let advancedFilterDateRange: any = {};
  //   let url2 =
  //     "";
  //     if (globalFilterDateRange.length > 0) {
  //       advancedFilterDateRange = {
  //         dateRange: "Custom",
  //         startDate:
  //         Moment(globalFilterDateRange[0]).format("YYYY-MM-DD") +
  //         "T13:32:30.064Z" ,
  //         endDate:
  //         Moment(globalFilterDateRange[1]).format("YYYY-MM-DD") +
  //         "T13:32:30.064Z",
  //       };
  //     }
  //   const requestOptions = {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: AuthToken,
  //     },
  //         body: JSON.stringify({
  //           profileId: Number(props.searchResult),
  //           pageNumber: currPage,
  //           pageSize: dataLength,
  //           globalFilters: {
  //             searchText: searchText,
  //             dateRanges: advancedFilterDateRange,
  //             advancedFilters: [],
            
  //           },
  //         }),
  //       }
  //   try {
  //     const response = await fetch(url2, requestOptions);

  //     if (!response.ok) {
  //       throw new Error("Failed to export data");
  //     }

  //     const blob = await response.blob();
  //     const url = window.URL.createObjectURL(blob);
  //     const a = document.createElement("a");
  //     a.style.display = "none";
  //     a.href = url;
  //     a.download = `Tacos_Report.csv`;
  //     document.body.appendChild(a);
  //     a.click();
  //     window.URL.revokeObjectURL(url);

  //     // Handle success
  //     console.log("Export successful");
  //     setSpinner(false);
  //   } catch (error) {
  //     setSpinner(false);
  //     toast("Export failed")
  //     console.error("Error exporting data:", error);
  //   }
  // };
  const onChangeDateRangeSubmitGlobal = (e) => {
    if (e && e.length >= 2) {
      console.log(Moment(e[0]).format("YYYY-MM-DD"));
      console.log(e[1]);
      
      setglobalFilterDateRange(e); 
    }
  }
  
    
  
  

  return (
    <DashboardLayout>
    <Row className="ms-2 me-3">
         <div className="action-row d-flex justify-content-between mt-4 " >
          <div className="back-arrow-container d-flex align-items-center  ">
          <div className="filters">
                  <DateRangePicker
                    placeholder="Select Date Range"
                    onChange={onChangeDateRangeSubmitGlobal}
                    format="yyyy-MM-dd"
                    disabledDate={(date) => isAfter(date, new Date())}
                  
                 
                  />
                </div>
          </div>
          <div className="filter-container ">
      
            <div className=" d-flex align-items-center">
              <form className="me-3">
                <div className="search-filter-container ">
                  <i className="fa fa-search"></i>
                  <input
                    type="text"
                    placeholder="Search"
                    id="globalSearch"
                    name="globalSearch"
                    onKeyDown={handleKeyDown}
                  />
                </div>
              </form>
              {!spinner ? (
                <div
                  className="filter-item export-link-container"
                  // onClick={handleExportData}
                >
                  <p>
                    <i>
                      <img src={ExportIcon} alt="filter icon" />
                    </i>
                    <span>Export</span>
                  </p>
                </div>
              ) : (
                <div className="filter-item export-link-container">
                  <img src={load1} height={40} width={40} alt="spinner" />
                </div>
              )}
            </div>
          </div>
        </div>
      {!apiLoading ? (
        <div style={{ height: "400px", width: "100%" }}>
          <DataGrid
            className="mt-3"
            rows={rows.map((row, index) => ({ ...row, id: index }))}
            columns={columns}
            disableRowSelectionOnClick
            hideFooter={true}
            rowHeight={40}
          />

          <div className="custom-table-footer">
            <Row>
              <Col md={5}>
                <form className="table-footer-left">
                  <span>Show </span>
                  <label>
                    <select
                      className="form-select"
                      defaultValue={perPage}
                      onChange={(event) => applyDataLength(event)}
                    >
                      <option value="50">50</option>
                      <option value="100">100</option>
                      <option value="150">150</option>
                      <option value="200">200</option>
                    </select>
                  </label>
                  <span> of {totalRow} total entries</span>
                </form>
              </Col>
              <Col md={7}>
                <div className="table-footer-right">
                  <Stack spacing={2}>
                    <Pagination
                      count={lastPage}
                      page={activePage}
                      variant="outlined"
                      shape="rounded"
                      onChange={handleChange}
                    />
                  </Stack>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      ) : (
        <div className="loading-container">
          <div
            style={{
              marginBottom: "250px",
              marginTop: "250px",
            }}
          >
            <CircularProgress className="loading" style={{ margin: "auto" }} />
          </div>
        </div>
      )}
    </Row>
    </DashboardLayout>
  );
}

export default Tacos;
