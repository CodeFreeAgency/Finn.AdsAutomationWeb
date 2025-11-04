/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

import "./index.css";

import { Row, Col } from "react-bootstrap";
import Nav from "react-bootstrap/Nav";
import Tab from "react-bootstrap/Tab";

import LogoIcon from "../../../assets/brand/logo-icon.svg";
import Moment from "moment";

import ColumnFilter from "../../../components/Filters/cloumn-filter";
import ConditionFilter from "../../../components/Filters/condition-filter";

import FilterIcon from "../../../assets/images/icons/filter-icon.svg";
import PauseIcon from "../../../assets/images/icons/pause.svg";
import ExportIcon from "../../../assets/images/icons/export.svg";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
// import axios from "axios";
let rows: any = [];
let columns: GridColDef[] = [];

function MarketplaceTable(props) {
  let apiEndPoint = "https://api.aimosa.io/Dashboard/Marketplaces";
  let pageload = true;
  let paginationCounts: any = [];
  const [lastPage, setLastPage] = useState(0);
  const [currPage, setcurrPage] = useState(1);
  const [metaData, setMetaData] = useState<any>([]);
  const [dropdownDatas, setDropdownDatas] = useState<any[]>([]);
  const [apiLoading, setApiLoading] = useState(false);
  const [perPage, setPerPage] = useState(50);
  const [totalPage, setTotalPage] = useState(1);
  const [activePage, setActivePage] = useState(1);
  const [totalRow, setTotalRow] = useState(0);
  const [paginationList, setPaginationList] = useState<any>([]);
  const [searchKeyValue, setSearchKeyValue] = useState<any[]>([]);
  const [filterDateRange, setFilterDateRange] = useState<any[]>([]);
  const [dropdownDataFilter, SetDropdownDataFilter] = useState<any[]>([]);
  const [columFiltervalue, setColumFiltervalue] = useState<any[]>([]);

  let filterData: any = [];
  const [globalFilterFromData, setGlobalFilterFromData] = useState<any[]>([]);
  const [searchKeyFilter, setSearchKeyFilter] = useState("");
  let searchKey = "";
  const [selectOptionList, setSelectOptionList] = useState<any[]>([]);
  useEffect(() => {
    if (props.filterDateRange) {
      if (props.filterDateRange.length > 0) {
        if (filterDateRange !== props.filterDateRange) {
          setFilterDateRange(props.filterDateRange);
          pageload = true;
          fetchData();
          pageload = false;
        }
      }
    }
  });
  useEffect(() => {
    if (props.tabName && pageload) {
      fetchData();
      pageload = false;
    }
  }, []);
  const getMetaData = async () => {
    let userToken = localStorage.getItem("userToken");
    let AuthToken = "Bearer " + userToken;
    let url = "https://api.aimosa.io/MasterData/meta";
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: AuthToken,
      },
    });

    try {
      const responceData = await response.json();
      setMetaData(responceData.result.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const handleChange = (event, value: number) => {
    setcurrPage(value);
  };
  const handleCallbackTotalData = (childData) => {
    console.log("Child Bookshelf Table data: ", childData);
    setLastPage(childData.lastPage);
    setTotalRow(childData.total);
    setPerPage(childData.perPage);
    setActivePage(childData.currPage);
    setDropdownDatas(childData.dropdownDatas);
  };
  const fetchData = async () => {
    setApiLoading(true);
    getMetaData();
    let userToken = localStorage.getItem("userToken");
    let AuthToken = "Bearer " + userToken;
    let url = apiEndPoint;
    let advancedFilters: any = [];
    let advancedFilterDateRange: any = {};

    if (filterData.length > 0) {
      advancedFilters = filterData;
    }
    if (props.filterDateRange.length > 0) {
      advancedFilterDateRange = {
        dateRange: "Custom",
        startDate:
          Moment(props.filterDateRange[0]).format("YYYY-MM-DD") +
          "T13:32:30.064Z",
        endDate:
          Moment(props.filterDateRange[1]).format("YYYY-MM-DD") +
          "T13:32:30.064Z",
      };
    }
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: AuthToken,
      },
      body: JSON.stringify({
        pageNumber: 1,
        pageSize: 50,
        sortOptions: null,
        columnFilters: null,
        globalFilters: {
          searchText: searchKeyFilter,
          authors: [],
          bookFormats: [],
          dateRanges: advancedFilterDateRange,
          titles: [],
          campaigns: [],
          platforms: [],
          marketPlaces: [],
          adTypes: [],
          advancedFilters: advancedFilters,
        },
      }),
    };
    try {
      const response = await fetch(url, requestOptions);
      const responceData = await response.json();
      let result = responceData.result;
      let pageConfigDetails = {
        total: responceData.result.total,
        currPage: responceData.result.currPage,
        lastPage: responceData.result.lastPage,
        nextPage: responceData.result.nextPage,
        perPage: responceData.result.perPage,
        prevPage: responceData.result.prevPage,
        dropdownDatas: responceData.result.headers,
      };
      let headers = responceData.result.headers;
      setDropdownDatas(headers);
      SetDropdownDataFilter(headers);
      handleCallbackTotalData(pageConfigDetails);
      if (columns.length < 1) {
        setSelectOptionList(responceData.result.headers);
        let headers = responceData.result.headers;
        for (let i = 0; headers.length > i; i++) {
          if (headers[i]["keyName"] === "status") {
            columns.push({
              field: headers[i]["keyName"],
              headerName: headers[i]["displayName"],
              width: 120,
              renderCell: (params) => (
                <i className={"status " + params.row.status}></i>
              ),
            });
          } else if (headers[i]["keyName"] === "marketplace") {
            columns.push({
              field: headers[i]["keyName"],
              headerName: headers[i]["displayName"],
              width: 115,
              renderCell: (params) => (
                <i className={"flag-" + params.row.marketplace}></i>
              ),
            });
          } else if (headers[i]["keyName"] === "campaign") {
            columns.push({
              field: headers[i]["keyName"],
              headerName: headers[i]["displayName"],
              minWidth: 115,
            });
          } else {
            columns.push({
              field: headers[i]["keyName"],
              headerName: headers[i]["displayName"],
              minWidth: 115,
            });
          }
        }
      }
      for (let i = 1; i <= result.total; i += result.perPage) {
        if (i < 20 * perPage) {
          paginationCounts.push(i);
        }
      }
      setTotalPage(paginationCounts.length);
      setPaginationList(paginationCounts);
      console.log("pagination: ", paginationList);
      rows = responceData.result.data;
      setApiLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const applyPagination = (e, pageNo: any) => {
    console.log("pagination no: ", pageNo);
    // currPage = pageNo;
    fetchData();
  };

  const applyDataLength = (e) => {
    console.log("dataSize: ", e.pageReadTotal.value);
    setPerPage(parseInt(e.pageReadTotal.value));
    fetchData();
  };
  const handleNvEnter = (event) => {
    console.log("Nv Enter:", event);
  };
  const handleCallback = (childData) => {
    setGlobalFilterFromData(childData);
    filterData = childData;
    fetchData();
  };

  const handleKeyDown = (event: any) => {
    if (event.key === "Enter") {
      console.log("local=" + event.target.value);
      setSearchKeyFilter(event.target.value);
      console.log("set=" + searchKeyFilter);
      event.preventDefault();
    }
  };
  useEffect(() => {
    fetchData();
  }, [searchKeyFilter]);
  const cancelDropdown = () => {
    const eleRm: any = document.getElementsByClassName("dropdown-menu");
    for (let i = 0; i < eleRm.length; i++) {
      eleRm[i].classList.remove("show");
    }
  };
  // aaa hide data
  const hiddenColumns = columFiltervalue;
  console.log("hide column : " + hiddenColumns);

  const applyColumns = () => {
    console.log("12345678 apply columns : " + searchKeyValue);
    // aaa
    setColumFiltervalue(searchKeyValue);
  };
  // set condiction
  function onItemCheck(e, item) {
    if (e.target.checked === true) {
      setSearchKeyValue((current) => [...current, e.target.name]);
      console.log("setSearchKeyValue true " + setSearchKeyValue);
    }

    if (e.target.checked === false) {
      setSearchKeyValue((current) =>
        current.filter((item) => item !== e.target.name)
      );
      console.log("setSearchKeyValue false " + setSearchKeyValue);
    }
  }
  let userToken = localStorage.getItem("userToken");
  let AuthToken = "Bearer " + userToken;

  const [csvData, setCsvData] = useState(null);

  const handleExportData = async () => {
    try {
      const response = await fetch(
        "https://api.aimosa.io/Dashboard/Dashboard/Marketplaces/Export",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: AuthToken,
          },
          body: JSON.stringify({}),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to export data");
      }
      console.log(response);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = "MarketPlace exported_data.csv";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);

      console.log("Export successful");
    } catch (error) {
      console.error("Error exporting data:", error);
    }
  };

  return (
    <div
      style={{
        height: 500,
        width: "100%",
        border: "1px solid #E5E7EB",
        borderTop: "none",
        borderBottomLeftRadius: "6px",
        borderBottomRightRadius: "6px",
        marginTop: "-35px",
      }}
    >
      <Row className="mt-2 mb-2">
        <Col md={5}>
          {props.checkBox && (
            <div className="bulk-operations">
              <div className="cus-dropdown">
                <span>Bulk operation</span>
                <i
                  className="fa fa-angle-down down-arrow-right"
                  aria-hidden="true"
                ></i>
                <div className="dropdown-container">
                  <form>
                    <Tab.Container
                      id="left-tabs-example"
                      defaultActiveKey="first"
                    >
                      <Row>
                        <Col sm={4}>
                          <Nav variant="pills" className="flex-column">
                            <Nav.Item>
                              <Nav.Link eventKey="first">Status</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                              <Nav.Link eventKey="second">
                                Daily Budget
                              </Nav.Link>
                            </Nav.Item>
                          </Nav>
                        </Col>
                        <Col sm={8}>
                          <Tab.Content>
                            <Tab.Pane eventKey="first">
                              <select
                                className="form-select"
                                id="bulkaction-status"
                              >
                                <option selected>Status</option>
                                <option value="Enabled">Enabled</option>
                                <option value="Paused">Paused</option>
                                <option value="Archived">Archived</option>
                              </select>
                            </Tab.Pane>
                            <Tab.Pane eventKey="second">
                              <div>
                                <label>Daily Budget</label>
                                <select
                                  className="form-select"
                                  id="bulkaction-daily-budget"
                                >
                                  <option selected>Select</option>
                                  <option value="Increase daily budget by">
                                    Increase daily budget by
                                  </option>
                                  <option value="Lower daily budget by">
                                    Lower daily budget by
                                  </option>
                                  <option value="Set daily budget to">
                                    Set daily budget to
                                  </option>
                                </select>
                              </div>
                              <div>
                                <label>Daily Budget Value</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Enter Value"
                                  aria-label="value"
                                  aria-describedby="addon-wrapping"
                                />
                              </div>
                              <div>
                                <label>Adjust bid value options</label>
                                <select
                                  className="form-select"
                                  id="bulkaction-value-options"
                                >
                                  <option selected>Select</option>
                                  <option value="%">%</option>
                                  <option value="$">$</option>
                                </select>
                              </div>
                            </Tab.Pane>
                          </Tab.Content>
                        </Col>
                      </Row>
                    </Tab.Container>
                    <hr />
                    <div className="footer">
                      <button type="button" className="btn btn-default">
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary"
                        disabled
                      >
                        Apply
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </Col>
        <Col className="dashboardTable-container">
          <div className="filter-container">
            <Row>
              <Col md={3} className="padding-lr-10"></Col>
              <Col md={9}>
                <div>
                  <form>
                    <div className="search-filter-container">
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
                </div>
                <div className="filter-item filter-link-container dropdownContent">
                  <p
                    id="dropdownMenuButton1"
                    data-bs-toggle="dropdown"
                    data-bs-auto-close="outside"
                    aria-expanded="false"
                    data-bs-display="static"
                  >
                    <i>
                      <img src={FilterIcon} alt="filter icon" />
                    </i>
                    <span>Filter</span>
                    <i
                      className="fa fa-angle-down down-arrow-right"
                      aria-hidden="true"
                    ></i>
                  </p>
                  <div
                    className="dropdown-menu dropdown-menu-lg-end"
                    aria-labelledby="dropdownMenuButton1"
                  >
                    <ConditionFilter
                      parentCallback={handleCallback}
                      dropdownData={dropdownDatas}
                      metaData={metaData}
                    />
                  </div>
                </div>

                <div className="filter-item column-link-container dropdownContent">
                  <p
                    id="dropdownMenuButton2"
                    data-bs-toggle="dropdown"
                    data-bs-auto-close="outside"
                    aria-expanded="false"
                    data-bs-display="static"
                  >
                    <i>
                      <img src={PauseIcon} alt="filter icon" />
                    </i>
                    <span>Columns</span>
                    <i
                      className="fa fa-angle-down down-arrow-right"
                      aria-hidden="true"
                    ></i>
                  </p>
                  <div
                    className="dropdown-menu dropdown-menu-lg-start"
                    aria-labelledby="dropdownMenuButton1"
                  >
                    <form>
                      <div className="set-max-height-400">
                        {/* <ColumnFilter columnList={dropdownDatas} /> */}
                        <table className="table">
                          <thead>
                            <tr>
                              <th scope="col">
                                <input
                                  type="checkbox"
                                  className="form-check-input"
                                  //checked={checked}
                                  id="mastercheck"
                                  //onChange={(e) => onMasterCheck(e)}
                                />
                              </th>
                              <th scope="col">Column Name</th>
                            </tr>
                          </thead>
                          <tbody>
                            {dropdownDataFilter.map((list, i) => (
                              <tr
                                key={list.keyName}
                                className={list.selected ? "selected" : ""}
                              >
                                <th scope="row">
                                  <input
                                    type="checkbox"
                                    checked={list.checked}
                                    className="form-check-input Selected-filter"
                                    // id="rowcheck{user.id}"
                                    onChange={(e) =>
                                      onItemCheck(e, list.selected)
                                    }
                                    name={list.keyName}
                                  />
                                </th>
                                <td>{list.displayName}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <hr />
                      <div className="footer">
                        <button
                          type="button"
                          className="btn btn-default"
                          onClick={cancelDropdown}
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={applyColumns}
                        >
                          Apply
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
                <div className="filter-item export-link-container">
                  <p>
                    <i>
                      <img src={ExportIcon} alt="filter icon" />
                    </i>
                    {/* <button className="export-btn" onClick={HandleExportAd}>
                      Export{" "}
                    </button>{" "} */}
                    <span onClick={handleExportData}>Export</span>;{" "}
                  </p>
                </div>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
      {!apiLoading ? (
        <div
          style={{
            height: 400,
            width: "100%",
          }}
        >
          <DataGrid
            rows={rows}
            //columns={columns}
            columns={columns.filter(
              (col) => !hiddenColumns.includes(col.field)
            )}
            checkboxSelection={props.checkBox}
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
          <div className="loading-text">
            <span className="logicon">
              <img src={LogoIcon} alt="logo-small"></img>
            </span>
            <span>L</span>
            <span>O</span>
            <span>A</span>
            <span>D</span>
            <span>I</span>
            <span>N</span>
            <span>G</span>
          </div>
        </div>
      )}
    </div>
  );
}
export default MarketplaceTable;
