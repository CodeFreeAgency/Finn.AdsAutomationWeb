import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import "./reports.css";
import { CircularProgress, Pagination, Stack } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import ExportIcon from "../../assets/images/icons/export.svg";
import { toast } from "react-toastify";
import load1 from "../../assets/images/icons/Spinner.gif";
import NewChart from "./newchart";

let columns: GridColDef[] = [];
function Cvr(props) {
  let currPage = 1;
  let dataLength = 50;
  const [apiLoading, setApiLoading] = useState(false);
  const [rows, setRows] = useState<any[]>([]);
  const [perPage, setPerPage] = useState(50);
  const [spinner, setSpinner] = useState(false);
  const [lastPage, setLastPage] = useState(1);
  const [activePage, setActivePage] = useState(1);
  const [totalRow, setTotalRow] = useState(0);
  const [searchText, setSearchText] = useState("");

  // useEffect(() => {
  //   console.log(props);

  //   if (props.profileId) {
  //       cvr();
  //   }
  // }, [props.profileId, searchText]);



  const applyDataLength = (e) => {
    dataLength = parseInt(e.target.value);
    setPerPage(e.target.value);
    currPage = activePage;
    // cvr();
  };

  const handleChange = (event, value: number) => {
    currPage = value;
    setActivePage(value);
    dataLength = perPage;
    // cvr();
  };

  // const cvr = async () => {
  //   setApiLoading(true);
  //   let userToken = localStorage.getItem("userToken");
  //   let AuthToken = "Bearer " + userToken;
  //   let url =
  //     "";
  //   const requestOptions = {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: AuthToken,
  //     },
  //     body: JSON.stringify({
  //       profileId: Number(props.profileId),
  //       pageNumber: currPage,
  //       pageSize: dataLength,
  //       globalFilters: {
  //         searchText: searchText,
  //         advancedFilters: [],
  //       },
  //     }),
  //   };

  //   try {
  //     const response = await fetch(url, requestOptions);
  //     const responceData = await response.json();
  //     if (responceData.success) {
  //       setApiLoading(false);
  //       let result = responceData.result;
  //       let data = responceData.result.data;
  //       setRows(data)
  //       setTotalRow(result.filteredCount);
  //       setPerPage(result.perPage);
  //       setActivePage(result.currPage);
  //       setLastPage(result.lastPage);

  //       if (columns.length < 1) {
  //           let headers = responceData.result.headers;
  //           for (let i = 0; headers.length > i; i++) {
  //             if (headers[i]["keyName"] === "parentAsin") {
  //               columns.push({
  //                 field: headers[i]["keyName"],
  //                 headerName: headers[i]["displayName"],
  //                 minWidth: 120,
  //                 renderCell: (params) => {
  //                   return (
  //                     <>
  //                       <div className="col-rulename">
  //                         <div className="col-title">{params.row.parentAsin}</div>
  //                       </div>
  //                     </>
  //                   );
  //                 },
  //               });
  //             } else if (headers[i]["keyName"] === "title") {
  //               columns.push({
  //                 field: headers[i]["keyName"],
  //                 headerName: headers[i]["displayName"],
  //               minWidth: 250, flex: 1,
  //                 renderCell: (params) => {
  //                   return (
  //                     <>
  //                       <div className="col-rulename">
  //                         <div className="col-title">{params.row.title}</div>
  //                       </div>
  //                     </>
  //                   );
  //                 },
  //               });
  //             } else {
  //               columns.push({
  //                 field: headers[i]["keyName"],
  //                 headerName: headers[i]["displayName"],
  //                 minWidth: 120,
  //                 maxWidth:120, 
  //               });
  //             }
  //           }
  //           columns.push({
  //               field: "chart",
  //               headerName: "Chart",
  //               minWidth: 150,
  //               renderCell: (params) => {  
  //                 return (
  //                   <div className="action-icon-box">
  //                  <NewChart datas={params.row} tabname ={props.tabName} />
  //                   </div>
  //                 );
  //               },
  //           })
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
  //   let url2 =
  //     "";
  //   const requestOptions = {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: AuthToken,
  //     },
  //         body: JSON.stringify({
  //           profileId: Number(props.profileId),
  //           pageNumber: currPage,
  //           pageSize: dataLength,
  //           globalFilters: {
  //             searchText: searchText,
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
  //     a.download = `Cvr_Report.csv`;
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
  

  return (
    <Row className="ms-2 me-3">
         <div className="action-row d-flex justify-content-between mt-3 " >
          <div className="back-arrow-container d-flex align-items-center  ">
      
          </div>
          <div className="filter-container">
            <div className=" d-flex align-item-center">
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
        <div style={{ height: "calc(80vh - 120px)", width: "100%" }}>
          <DataGrid
            className="split-headers  mt-3"
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
  );
}

export default Cvr;
