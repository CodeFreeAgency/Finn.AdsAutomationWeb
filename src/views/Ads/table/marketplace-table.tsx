import React, { useState, useEffect } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { toast } from "react-toastify";
import CircularProgress from "@mui/material/CircularProgress";
import "./index.css";
import { Row, Col } from "react-bootstrap";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import Moment from "moment";
import ConditionFilter from "../../../components/Filters/condition-filter";
import load from "../../../assets/images/icons/Spinner.gif";
import FilterIcon from "../../../assets/images/icons/filter-icon.svg";
import ExportIcon from "../../../assets/images/icons/export.svg";

function MarketplaceTable(props) {
  const [rows, setRows] = useState<any[]>([]);
  const [columns, setColumns] = useState<GridColDef[]>([]);
  const [pageLoad, setPageLoad] = useState(true);
  const [currPage, setCurrPage] = useState(1);
  const [dataLength, setDataLength] = useState(50);
  const [gridHeight, setGridHeight] = useState(400);
  const [metaData, setMetaData] = useState<any>([]);
  const [apiLoading, setApiLoading] = useState(false);
  const [selectedRowid, setSelectedRows] = useState<any>([]);
  const [perPage, setPerPage] = useState(50);
  const [lastPage, setLastPage] = useState(1);
  const [activePage, setActivePage] = useState(1);
  const [totalRow, setTotalRow] = useState(0);
  const [filterDateRange, setFilterDateRange] = useState<any[]>([]);
  const [dropdownDatas, setDropdownDatas] = useState<any[]>([]);
  const [spinner, setSpinner] = useState(false);
  const [globalFilterFromData, setGlobalFilterFromData] = useState<any[]>([]);
  const [searchKeyFilter, setSearchKeyFilter] = useState("");
  const [columFiltervalue, setColumFiltervalue] = useState<any[]>([]);
  const [dropdownDataFilter, SetDropdownDataFilter] = useState<any[]>([]);
  const [filterData, setFilterData] = useState<any[]>([]);

  const hiddenColumns = columFiltervalue;
  const searchKey = searchKeyFilter;

  useEffect(() => {
    setMetaData(props.metaData);
  }, [props.metaData]);

  // Dynamically adjust grid height
  useEffect(() => {
    const handleResize = () => {
      const windowHeight = window.innerHeight;
      setGridHeight(Math.floor(windowHeight * 0.6));
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Reset and reload when profile changes (SP/SB/SD)
  useEffect(() => {
    setRows([]);
    setColumns([]);
    setPageLoad(true);
    fetchData();
  }, [props.selectedProfiles]);

  // Load on tab change
  useEffect(() => {
    if (props.tabName && pageLoad) {
      fetchData();
      setPageLoad(false);
    }
  }, [props.tabName, props.selectedProfiles]);

  // Refetch when filters or conditions change
  useEffect(() => {
    if (props.condition && props.selectedProfiles && props.filterDateRange) {
      if (filterDateRange !== props.filterDateRange) {
        setFilterDateRange(props.filterDateRange);
      }
      fetchData();
    }
  }, [props.condition, props.selectedProfiles, props.filterDateRange]);

  const fetchData = async () => {
    setApiLoading(true);

    let apiEndPoint = "";
    if (props.selectedProfiles === "SP") {
      apiEndPoint = `http://18.207.111.239/Ads/SPCampaignManager/${props.tabName}`;
    } else if (props.selectedProfiles === "SB") {
      apiEndPoint = `http://18.207.111.239/Ads/SBCampaignManager/${props.tabName}`;
    } else if (props.selectedProfiles === "SD") {
      apiEndPoint = `http://18.207.111.239/Ads/SDCampaignManager/${props.tabName}`;
    }

    const userToken = localStorage.getItem("userToken");
    const AuthToken = "Bearer " + userToken;

    let advancedFilters = filterData.length > 0 ? filterData : [];
    let advancedFilterDateRange: any = {};
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

    try {
      const response = await fetch(apiEndPoint, {
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
            advancedFilters,
            dateRanges: advancedFilterDateRange,
          },
        }),
      });

      const responseData = await response.json();
      const result = responseData.result;

      setTotalRow(result.filteredCount);
      setPerPage(result.perPage);
      setActivePage(result.currPage);
      setLastPage(result.lastPage);

      const filteredHeaders = result.headers.filter(
        (header) => header.keyName !== "marketplace"
      );
      setDropdownDatas(filteredHeaders);
      SetDropdownDataFilter(filteredHeaders);

      // ✅ Always rebuild columns for correct header display
      const newColumns: GridColDef[] = filteredHeaders.map((header) => {
        if (header.keyName === "status") {
          return {
            field: header.keyName,
            headerName: header.displayName,
            width: 100,
            renderCell: (params) => (
              <i className={`status ${params.row.campaignStatus}`}></i>
            ),
            description: header.fullName,
          };
        } else if (header.keyName === "campaignName") {
          return {
            field: header.keyName,
            headerName: header.displayName,
            minWidth: 150,
            flex: 0.5,
            description: header.fullName,
          };
        } else {
          return {
            field: header.keyName,
            headerName: header.displayName,
            minWidth: 120,
            flex: 0.5,
            description: header.fullName,
          };
        }
      });

      setColumns(newColumns);
      setRows(result.data);
      setApiLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setApiLoading(false);
    }
  };

  const applyDataLength = (e) => {
    setDataLength(parseInt(e.target.value));
    fetchData();
  };

  const handleCallback = (childData) => {
    setGlobalFilterFromData(childData);
    setFilterData(childData);
    fetchData();
  };

  const handleKeyDown = (event: any) => {
    if (event.key === "Enter") {
      setSearchKeyFilter(event.target.value);
      fetchData();
      event.preventDefault();
    }
  };

  const handleChange = (event, value: number) => {
    setCurrPage(value);
    fetchData();
  };

  const handleExportData = async () => {
    setSpinner(true);
    try {
      const userToken = localStorage.getItem("userToken");
      if (!userToken) throw new Error("User token not found");

      const AuthToken = "Bearer " + userToken;
      let advancedFilters =
        globalFilterFromData.length > 0 ? globalFilterFromData : [];
      let advancedFilterDateRange: any = {};
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

      let apiEndPoint = "";
      switch (props.selectedProfiles) {
        case "SP":
          apiEndPoint = `http://18.207.111.239/Ads/SPCampaignManager/${props.tabName}/Export`;
          break;
        case "SB":
          apiEndPoint = `http://18.207.111.239/Ads/SBCampaignManager/${props.tabName}/Export`;
          break;
        case "SD":
          apiEndPoint = `http://18.207.111.239/Ads/SDCampaignManager/${props.tabName}/Export`;
          break;
      }

      const response = await fetch(apiEndPoint, {
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
            advancedFilters,
            dateRanges: advancedFilterDateRange,
          },
        }),
      });

      if (!response.ok) throw new Error("Export failed");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;

      const profileDescription =
        props.selectedProfiles === "SP"
          ? "Sponsored Product"
          : props.selectedProfiles === "SB"
          ? "Sponsored Brand"
          : "Sponsored Display";

      const storedLabel = localStorage.getItem("selectedAccountLabel");
      const country = localStorage.getItem("Country");

      a.download = `${storedLabel}${country}_${profileDescription}_${props.tabName}_${advancedFilterDateRange.startDate?.slice(
        0,
        10
      )}-${advancedFilterDateRange.endDate?.slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      setSpinner(false);
    } catch (error) {
      toast("Export failed");
      setSpinner(false);
      console.error("Error exporting data:", error);
    }
  };

  return (
    <div style={{ height: 500, width: "100%" }}>
      <Row className="mt-2 mb-2">
        <Col>
          <div className="filter-container">
            <Row>
              <Col md={3}></Col>
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
                    <i className="fa fa-angle-down down-arrow-right"></i>
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

      {apiLoading ? (
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
            <CircularProgress style={{ margin: "auto" }} />
          </div>
        </div>
      ) : (
        <div style={{ height: gridHeight, width: "100%" }}>
          {columns.length > 0 && (
            <DataGrid
              rows={rows}
              columns={columns.filter(
                (col) => !hiddenColumns.includes(col.field)
              )}
              onRowSelectionModelChange={(ids) => {
                const selectedIDs = new Set(ids);
                setSelectedRows(Array.from(selectedIDs));
              }}
              hideFooter
              rowHeight={40}
            />
          )}

          <div className="custom-table-footer">
            <Row>
              <Col md={5}>
                <form className="table-footer-left">
                  <span>Show </span>
                  <label>
                    <select
                      className="form-select"
                      value={perPage}
                      onChange={(e) => applyDataLength(e)}
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
      )}
    </div>
  );
}

export default MarketplaceTable;
