import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import "./reports.css";
import { CircularProgress, Pagination, Stack, Tooltip } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import ExportIcon from "../../assets/images/icons/export.svg";
import { toast } from "react-toastify";
import load1 from "../../assets/images/icons/Spinner.gif";
import NewChart from "./newchart";
import pauseicon from "../../assets/images/icons/pause.svg";
import dayjs from "dayjs";

function BuyBox(props: any) {
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
  const [columns, setColumns] = useState<GridColDef[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  useEffect(() => {
    console.log(props);
    if (props.profileId) {
      buyBox();
    }
  }, [props.profileId, searchText]);

  const applyDataLength = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(e.target.value, 10);
    dataLength = value;
    setPerPage(value);
    currPage = activePage;
    buyBox();
  };

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    currPage = value;
    setActivePage(value);
    dataLength = perPage;
    buyBox();
  };

  const buyBox = async () => {
    try {
      setApiLoading(true);
      let userToken = localStorage.getItem("userToken");
      let AuthToken = "Bearer " + userToken;
      let url =
        "https://finnapi.sellingpartnerservices.com/SPAPIReports/GetInventory";

      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: AuthToken,
        },
        body: JSON.stringify({
          pageNumber: currPage,
          pageSize: 50,
          globalFilters: {
            searchText: searchText,
            advancedFilters: [
              {
                logicalOperator: "And",
                conditions: [
                  {
                    logicalOperator: "And",
                    operator: "Equal",
                    value: String(props.profileId),
                    secondValue: "",
                    columnName: "ProfileId",
                  },
                  {
                    logicalOperator: "And",
                    operator: "Equal",
                    value: String(props.selectedAccountCountry),
                    secondValue: "",
                    columnName: "MarketPlaceId",
                  },
                ],
              },
            ],
          },
        }),
      };

      const response = await fetch(url, requestOptions);
      const data = await response.json();

      if (response.ok && data && data.data && data.data.length > 0) {
        console.log("Received data:", data);

        const rowsWithId = data.data.map((row, index) => ({
          ...row,
          id: index,
        }));

        setRows(rowsWithId);
        setTotalRow(data.totalCount);
        setLastPage(Math.ceil(data.totalCount / perPage));

        const headers = Object.keys(data.data[0]);
        console.log("Headers:", headers);

        const capitalizeFirstLetter = (string) => {
          return string.replace(/\b\w/g, (char) => char.toUpperCase());
        };

        const newColumns = headers
          .map((header) => {
            let cellClass = "text-ellipsis";

            if (header === "specificColumn1" || header === "specificColumn2") {
              cellClass += " large-font";
            }

            let columnWidth = 180;

            if (header === "itemName" || header === "itemDescription") {
              columnWidth = 250;
            }

            if (header === "quantity" || header === "profileName") {
              return null;
            }
            if (header === "marketPlaceId" || header === "MarketPlaceId") {
              return null;
            }
            if (header === "productId" || header === "ProductId") {
              return null;
            }
            return {
              field: header,
              flex: 1,
              headerName: capitalizeFirstLetter(header),
              width: columnWidth,
              headerClassName: "header-ellipsis",
              renderCell: (params) => (
                <Tooltip
                  title={String(params.value)}
                  placement="top-start"
                  arrow
                >
                  <div
                    className={cellClass}
                    style={{
                      fontSize: "14px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {params.value}
                  </div>
                </Tooltip>
              ),
            };
          })
          .filter((col) => col !== null) as GridColDef[];

        setColumns(newColumns);
      } else {
        console.error(
          "API call unsuccessful or data structure incorrect:",
          data
        );
        setRows([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setApiLoading(false); // Always set loading state to false after fetch operation
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      setSearchText(event.currentTarget.value);
      event.preventDefault();
    }
  };

  const handleExportData = async () => {
    setSpinner(true);
    try {
      let userToken = localStorage.getItem("userToken");
      if (!userToken) {
        throw new Error("User token not found");
      }

      let AuthToken = "Bearer " + userToken;
      let url2 =
        "https://finnapi.sellingpartnerservices.com/SPAPIReports/Inventory/Export";

      const requestOptions: RequestInit = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: AuthToken,
        },
        body: JSON.stringify({
          pageNumber: 0,
          pageSize: 0,
          globalFilters: {
            searchText: searchText,
            campaigns: [],
            marketPlaces: [],
            adTypes: [],
            advancedFilters: [],
          },
          fileName: "Inventory_Report.csv",
          format: "CSV",
          zipFile: true,
          visibleColumns: [],
          profileId: Number(props.profileId),
          marketPlace: props.selectedAccountCountry,
        }),
      };

      const response = await fetch(url2, requestOptions);

      if (!response.ok) {
        throw new Error("Failed to export data");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      const storedLabel = localStorage.getItem("selectedAccountLabel");
      const country = localStorage.getItem("Country");
      const formattedDate = dayjs(selectedDate).format("YYYY-MM-DD");

      a.download = `${storedLabel}${country}_Inventory_Report_${formattedDate}.csv`;

      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);

      console.log("Export successful");
      setSpinner(false);
    } catch (error) {
      setSpinner(false);
      toast("Export failed");
      console.error("Error exporting data:", error);
    }
  };
  return (
    <Row className="ms-2 me-3">
      <div className="action-row d-flex justify-content-between mt-3 ">
        <div className="back-arrow-container d-flex align-items-center  "></div>
        <div className="filter-container">
          <div className=" d-flex align-item-center">
            <form className="me-3">
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
            {!spinner ? (
              <div
                className="filter-item export-link-container"
                onClick={handleExportData}
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
            className="split-headers mt-3"
            rows={rows}
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

export default BuyBox;
