import React, { useState, useEffect } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import "./index.css";
import CircularProgress from "@mui/material/CircularProgress";
import { Row, Col } from "react-bootstrap";
import Nav from "react-bootstrap/Nav";
import Tab from "react-bootstrap/Tab";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import Moment from "moment";
import ConditionFilter from "../../../components/Filters/condition-filter";
import load from "../../../assets/images/icons/Spinner.gif";
import FilterIcon from "../../../assets/images/icons/filter-icon.svg";
import ExportIcon from "../../../assets/images/icons/export.svg";
import axios from "axios";
import { toast } from "react-toastify";

let rows: any = [];
let columns: GridColDef[] = [];

function SearchTermsTable(props) {
  let apiEndPoint =
    "http://18.207.111.239/Ads/SPCampaignManager/" +
    props.tabName;
  let pageload = true;
  let currPage = 1;
  let dataLength = 50;
  const [metaData, setMetaData] = useState<any>([]);
  const [apiLoading, setApiLoading] = useState(false);
  const [perPage, setPerPage] = useState(50);
  const [lastPage, setLastPage] = useState(1);
  const [activePage, setActivePage] = useState(1);
  const [totalRow, setTotalRow] = useState(0);
  const [filterDateRange, setFilterDateRange] = useState<any[]>([]);

  let filterData: any = [];
  let Condition: any = [];
  const [globalFilterFromData, setGlobalFilterFromData] = useState<any[]>([]);
  const [searchKeyFilter, setSearchKeyFilter] = useState("");

  // aaa
  const [columFiltervalue, setColumFiltervalue] = useState<any[]>([]);
  const [dropdownDataFilter, SetDropdownDataFilter] = useState<any[]>([]);
  const [spinner, setSpinner] = useState(false);
  const [dropdownDatas, setDropdownDatas] = useState<any[]>([]);

  let searchKey = "";
  useEffect(() => {
    setMetaData(props.metaData);
  }, [props.metaData, metaData]);
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
      // fetchData();
      pageload = false;
    }
  }, []);
  useEffect(() => {
    setApiLoading(true)
    if (props.condition) {

      fetchData();
    }
  }, [props.condition]);
  const fetchData = async () => {
    setApiLoading(true);

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
        profileId:3974246367388856,
        pageNumber: currPage,
        pageSize: dataLength,
        globalFilters: {
          searchText: searchKey,
          advancedFilters: advancedFilters,
          dateRanges: advancedFilterDateRange,
         
        },
      }),
    };
    try {
      const response = await fetch(url, requestOptions);
      const responceData = await response.json();
      let result = responceData.result;
      setTotalRow(result.filteredCount);
      setPerPage(result.perPage);
      setActivePage(result.currPage);
      setLastPage(result.lastPage);
      let headers = responceData.result.headers;

      setDropdownDatas(headers);
      SetDropdownDataFilter(headers);

      if (columns.length < 1) {
        for (let i = 0; headers.length > i; i++) {
          if (headers[i]["keyName"] === "campaignStatus") {
            columns.push({
              field: headers[i]["keyName"],
              headerName: headers[i]["displayName"],
              width: 80,
              renderCell: (params) => (
                <i className={"status " + params.row.campaignStatus}></i>
              ),
            });
          } else if (headers[i]["keyName"] === "marketplace") {
            columns.push({
              field: headers[i]["keyName"],
              headerName: headers[i]["displayName"],
              width: 80,
              renderCell: (params) => (
                <i className={"flag-" + params.row.marketplace}></i>
              ),
            });
          } else if (headers[i]["keyName"] === "campaign") {
            columns.push({
              field: headers[i]["keyName"],
              headerName: headers[i]["displayName"],
              minWidth: 250,
            });
          } else {
            columns.push({
              field: headers[i]["keyName"],
              headerName: headers[i]["displayName"],
              minWidth: 100,
            });
          }
        }
      }
      rows = responceData.result.data;
      setApiLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const applyDataLength = (e) => {
    console.log("dataSize: ", e.target.value);
    dataLength = parseInt(e.target.value);
    fetchData();
  };

  const handleCallback = (childData) => {

    setGlobalFilterFromData(childData);
    filterData = childData;
    fetchData();
  };
  const handleKeyDown = (event: any) => {
    if (event.key === "Enter") {

      searchKey = event.target.value;
      setSearchKeyFilter(event.target.value);
      fetchData();
      event.preventDefault();
    }
  };

  const hiddenColumns = columFiltervalue;

  const handleChange = (event, value: number) => {
    currPage = value;
    fetchData();
  };

  let userToken = localStorage.getItem("userToken");
  let AuthToken = "Bearer " + userToken;

  const handleExportData = async () => {
    setSpinner(true);

    try {
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

      const response = await fetch(
        " http://18.207.111.239/Ads/SPCampaignManager/SearchTerms/Export",

        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: AuthToken,
          },
          body: JSON.stringify({
            profileId:3974246367388856,
            pageNumber: currPage,
            pageSize: dataLength,
            globalFilters: {
              searchText: searchKeyFilter,
              advancedFilters: advancedFilters,
              dateRanges: advancedFilterDateRange,
       
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to export data");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = "Search terms exported_data.csv";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);

      // Handle success
      console.log("Export successful");
      setSpinner(false);
    } catch (error) {
      setSpinner(false);
      toast("Export failed")
      console.error("Error exporting data:", error);
    }
  };

  return (
    <div style={{ height: 500, width: "100%" }}>
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
        <Col>
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
                {!spinner ? (
                  <div className="filter-item export-link-container">
                    <p>
                      <i>
                        <img src={ExportIcon} alt="filter icon" />
                      </i>
                      <span onClick={handleExportData}>Export</span>
                    </p>
                  </div>
                ) : (
                  <div className="filter-item export-link-container">
                    <img src={load} height={40} width={40} alt="spinner" />
                  </div>
                )}
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
      {!apiLoading ? (
        <div style={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={rows}
            //columns={columns}
            // aaa
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
              position: "absolute",
              top: "30%",
              left: 0,
              width: "100%",
              height: "100%",
            }}
          >
            <CircularProgress className="loading" style={{ margin: "auto" }} />
          </div>
        </div>
      )}
    </div>
  );
}
export default SearchTermsTable;
