import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, useParams } from "react-router-dom";
import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

import "./index.css";

import LogoIcon from "../../assets/brand/logo-icon.svg";
import ActionDot from "../../assets/images/icons/undo-green-icon.svg";
import { Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { CircularProgress } from "@mui/material";

let rows: any = [];
let columns: GridColDef[] = [];
let filterData: any = [];

function AutomationRulesChangeLogTable(props) {
  let { id } = useParams();
  let apiEndPoint = "https://adsautomationapi.agilensmartservices.com/Rule/ChangeLog";
  let pageload = true;
  const [apiLoading, setApiLoading] = useState(false);
  const [tagInput, setTagInputValue] = useState("");
  const [clickedId, setClickedId] = useState("");
  const [rowSelectionModel, setRowSelectionModel] =
    React.useState<GridRowSelectionModel>([]);
  const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: "#001912",
      color: "rgba(255, 255, 255, 0.87)",
      maxWidth: 350,
      fontSize: theme.typography.pxToRem(12),
      border: "1px solid #001912",
    },
  }));

  useEffect(() => {
    if (pageload) {
      fetchData();
      pageload = false;
      console.log("best=s");
    }
  }, []);
  useEffect(() => {
    if (props.currPage || props.perPage || props.searchKey) {
      fetchData();
    }
  }, [props.currPage, props.perPage, props.searchKey]);
  const changelogclick = async (id: any) => {
    let userToken = localStorage.getItem("userToken");
    let AuthToken = "Bearer " + userToken;
    const response = await fetch("https://api.aimosa.io/Rule/ChangeLogUndo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: AuthToken,
      },
      body: JSON.stringify({
        id: id,
      }),
    });
    const responceData = await response;
    console.log("best=s", responceData);
    if (responceData.status == 200) {
      toast("Successfully Undo");
      undoChangeLog();
      fetchData();
    } else {
      toast("Unable to Undo");
    }
  };

  const undoChangeLog = async () => {
    let userToken = localStorage.getItem("userToken");
    let AuthToken = "Bearer " + userToken;
    const response = await fetch(
      "https://api.aimosa.io/AdsAutomation/ProcessAdsQueue",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: AuthToken,
        },
      }
    );
    const responceData = await response;
    console.log("beghyd", responceData);
  };

  const fetchData = async () => {
    if (!apiLoading) {
      setApiLoading(true);
      let userToken = localStorage.getItem("userToken");
      let AuthToken = "Bearer " + userToken;
      let url = apiEndPoint;
      let advancedFilters: any = [];

      if (props.filterData && props.filterData.length > 0) {
        advancedFilters = props.filterData;
      }
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: AuthToken,
        },
        body: JSON.stringify({
          id: id,
          pageNumber: props.currPage,
          pageSize: props.perPage,
          globalFilters: {
            searchText: props.searchKey,
          },
        }),
      };

      try {
        const response = await fetch(url, requestOptions);
        const responceData = await response.json();
        console.log("bookself=", responceData);
        if (responceData.result.length < 1) {
          setApiLoading(false);
        }

        let pageConfigDetails = {
          total: responceData.result.filteredCount,
          currPage: responceData.result.currPage,
          lastPage: responceData.result.lastPage,
          nextPage: responceData.result.nextPage,
          perPage: responceData.result.perPage,
          prevPage: responceData.result.prevPage,
          dropdownDatas: responceData.result.headers,
        };

        props.parentCallback(pageConfigDetails);
        if (columns.length < 1) {
          let headers = responceData.result.headers;
          for (let i = 0; headers.length > i; i++) {
            if (headers[i]["keyName"] === "time") {
              let disname = headers[i]["displayName"];
              disname = disname.split("(");
              columns.push({
                field: headers[i]["keyName"],
                renderHeader: (params) => (
                  <div className="title-group" style={{color:"black"}}>
                    {disname[0]}
                    <span>{disname[1]}</span>
                  </div>
                ),
                minWidth: 200,
              });
            } else if (headers[i]["keyName"] === "action") {
              columns.push({
                field: headers[i]["keyName"],
                headerName: headers[i]["displayName"],
                minWidth:170,
                flex:0.2,
                renderCell: (params) => {
                  return (
                    <>
                      {params.row.action && (
                        <div className="col-rulename">
                          <div>
                            <div className="changed-value" style={{color:"#000000DE"}}>
                              {params.row.action.changedValue}
                            </div>
                            <div className="history-value">
                              Prev : {params.row.action.previousValue} Now : {params.row.action.currentValue}
                            </div>
                            <div>
                              
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  );
                },
              });
            }
             else if (headers[i]["keyName"] === "target") {
              columns.push({
                field: headers[i]["keyName"],
                headerName: headers[i]["displayName"],
                minWidth: 210,
                renderCell: (params) => {
                  return (
                    <>
                      {params.row.action && (
                        <div className="col-rulename">
                          <div>
                            <div className="changed-value" style={{color:"#000000DE"}}>
                              {params.row.target}
                            </div>
                         
                          </div>
                        </div>
                      )}
                    </>
                  );
                },
              });
            }
             else if (headers[i]["keyName"] === "adGroupName") {
              columns.push({
                field: headers[i]["keyName"],
                headerName: headers[i]["displayName"],
               minWidth:150,
               flex:0.4,
                renderCell: (params) => {
                  return (
                    <>
                      {params.row.action && (
                        <div className="col-rulename">
                          <div>
                            <div className="changed-value" style={{ overflow: "hidden", whiteSpace: "normal" ,color:"#000000DE"}}>
                              {params.row.adGroupName}
                            </div>
                         
                          </div>
                        </div>
                      )}
                    </>
                  );
                },
              });
            }
             else if (headers[i]["keyName"] === "campaignName") {
              columns.push({
                field: headers[i]["keyName"],
                headerName: headers[i]["displayName"],
                minWidth:200,
               flex:0.7,
                renderCell: (params) => {
                  return (
                    <>
                      {params.row.action && (
                        <div className="col-rulename">
                          <div>
                            <div className="changed-value" style={{color:"#000000DE",overflow: "hidden", whiteSpace: "normal" }}>
                              {params.row.campaignName}
                            </div>
                         
                          </div>
                        </div>
                      )}
                    </>
                  );
                },
              });
            }
             else {
              columns.push({
                field: headers[i]["keyName"],
                headerName: headers[i]["displayName"],
                minWidth:150,
                flex:0.2,
              });
            }
          }
  
        }
        console.log("Columns header: ", columns);
        rows = responceData.result.data;
        setApiLoading(false);
        console.log("Row data: ", rows);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };




  return (
    <div className="mt-3">
      <div
        style={{ height: "calc(80vh - 120px)", width: "100%" }}
        className="change-log-table-container"
      >
        {!apiLoading ? (
          <>
            <DataGrid
              rows={rows}
              columns={columns}
              checkboxSelection={false}
              hideFooter={true}
              rowHeight={50}
              onRowSelectionModelChange={(newSelection) => {
                setRowSelectionModel(newSelection);
              }}
              disableRowSelectionOnClick
            />
          </>
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
            <CircularProgress
              className="loading"
              style={{ margin: "auto" }}
            />
          </div>
        </div>
        )}
      </div>
    </div>
  );
}
export default AutomationRulesChangeLogTable;
