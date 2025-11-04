import React, { useState, useEffect } from "react";
import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import "./index.css";
import ActionDot from "../../assets/images/icons/more-action-icon.svg";
import { Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { CircularProgress } from "@mui/material";
import { Popconfirm } from "antd";


let columns: GridColDef[] = [];

function AutomationRulesListTable(props) {
  
  let apiEndPoint = "https://adsautomationapi.agilensmartservices.com/Rule/All";
  const [apiLoading, setApiLoading] = useState(false);
  const [rows, setIsRows] = useState<any>([]);
  const [tagInput, setTagInputValue] = useState("");
  const [selectedAccount, setSelectedAccount] = useState("");
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
    props.handleSelectedRules(rowSelectionModel);
  }, [rowSelectionModel]);
  

  
  useEffect(() => {
    if (props.pageReload || props.currPage || props.perPage || props.filterData || props.searchKey ||props.fetchRulesByStatus || props.selectedAccount) {
      if (props.selectedAccount) {
        setSelectedAccount(props.selectedAccount);
        fetchData();
      }
    }
  }, [props.pageReload, props.currPage, props.perPage, props.filterData, props.searchKey ,props.fetchRulesByStatus,props.selectedAccount ]);
  
  



  const tagInputValue = (e) => {
    setTagInputValue(e.target.value);
  };


  const patchTagData = async () => {
    let userToken = localStorage.getItem("userToken");
    let AuthToken = "Bearer " + userToken;
    const response = await fetch(
      "https://api.aimosa.io/BookShelf/" + clickedId + "/Tag",
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: AuthToken,
        },
        body: JSON.stringify({
          tags: [tagInput],
        }),
      }
    );
    const responceData = await response;
    console.log("best=s", responceData);
    fetchData();
  };
  const cancel = () => {};

  const deleteRule = async (id ,profileId) => {
    let userToken = localStorage.getItem("userToken");
    let AuthToken = "Bearer " + userToken;
    const response = await fetch(
      "https://adsautomationapi.agilensmartservices.com/Rule",
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: AuthToken,
        },
        body: JSON.stringify({
          id: [id],
        }),
      }
    );
    const responceData = await response.json();
 
    console.log("deleteRule" + JSON.stringify(responceData));
   
    if (responceData.success === true) {
      const Data = async () => {
        if (props.selectedAccount !== "") {
          console.log(props.selectedAccount);
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
              pageNumber: props.currPage,
              pageSize: props.perPage,
    
              globalFilters: {
                searchText: props.searchKey,
                advancedFilters: [
                  profileId,
                  props.fetchRulesByStatus,
                ],
              },
            }),
          };
    
          try {
            const response = await fetch(url, requestOptions);
            const responceData = await response.json();
    
            let pageConfigDetails = {
              total: responceData.result.total,
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
              console.log(headers);
    
              for (let i = 0; headers.length > i; i++) {
                if (headers[i]["keyName"] === "status") {
                  columns.push({
                    field: headers[i]["keyName"],
                    headerName: headers[i]["displayName"],
                    width: 80,
                    renderCell: (params) => {
                      return (
                        <>
                          <div className="form-check form-switch">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="flexSwitchCheckChecked"
                              onChange={() => statusHandler(params,params.row.profileId)}
                              checked={
                                params.row.status === "Enabled" ? true : false
                              }
                            />
                          </div>
                        </>
                      );
                    },
                  });
                } else if (headers[i]["keyName"] === "ruleName") {
                  columns.push({
                    field: headers[i]["keyName"],
                    headerName: headers[i]["displayName"],
                    width: 170,
                    flex:0.7,
                    renderCell: (params) => {
                      return (
                        <>
                          <div className="col-rulename">
                            <div className="col-title" style={{ overflow: "hidden", whiteSpace: "normal" }}>{params.row.ruleName}</div>
                          </div>
                        </>
                      );
                    },
                  });
                } else if (headers[i]["keyName"] === "automationCriteria") {
                  columns.push({
                    field: headers[i]["keyName"],
                    headerName: headers[i]["displayName"],
                    flex: 1,
                    minWidth: 150,
                    renderCell: (params) => {
                      return (
                        <>
                          <div className="col-rulename">
                            {params.row.automationCriteria.map(
                              (automationCriteria, i) => (
                                <div
                                  key={i}
                                  style={{
                                    overflow: "hidden",
                                    whiteSpace: "normal",
                                  }}
                                >
                                  {automationCriteria}
                                </div>
                              )
                            )}
                          </div>
                        </>
                      );
                    },
                  });
                } else if (headers[i]["keyName"] === "matchTypes") {
                  columns.push({
                    field: headers[i]["keyName"],
                    headerName: headers[i]["displayName"],
                    minWidth: 180,
                    maxWidth: 180,
                    renderCell: (params) => {
                      return (
                        <>
                          <div className="col-rulename">
                            {params.row.matchTypes.map((value, i) => (
                              <div key={i}>{value}</div>
                            ))}
                          </div>
                        </>
                      );
                    },
                  });
                } else if (headers[i]["keyName"] === "targetCriteria") {
                  columns.push({
                    field: headers[i]["keyName"],
                    headerName: headers[i]["displayName"],
                    flex: 1,
                    minWidth: 130,
                    renderCell: (params) => {
                      return (
                        <>
                          <div className="col-rulename">
                            {params.row.targetCriteria.map((value, i) => (
                              <div
                                key={i}
                                style={{ overflow: "hidden", whiteSpace: "normal" }}
                              >
                                {value}
                              </div>
                            ))}
                          </div>
                        </>
                      );
                    },
                  });
                } else if (headers[i]["keyName"] === "actionCriteria") {
                  columns.push({
                    field: headers[i]["keyName"],
                    headerName: headers[i]["displayName"],
                    flex: 1,
                    minWidth: 130,
                    renderCell: (params) => {
                      return (
                        <>
                          <div className="col-rulename">
                            {params.row.actionCriteria.map((value, i) => (
                              <div
                                key={i}
                                style={{ overflow: "hidden", whiteSpace: "normal" }}
                              >
                                {value}
                              </div>
                            ))}
                          </div>
                        </>
                      );
                    },
                  });
                } else if (headers[i]["keyName"] === "dateCreated") {
                  columns.push({
                    field: headers[i]["keyName"],
                    headerName: headers[i]["displayName"],
                    minWidth: 90,
                    maxWidth: 90,
                    renderCell: (params) => {
                      return (
                        <>
                          <div className="col-rulename">
                            {params.row.dateCreated}
                          </div>
                        </>
                      );
                    },
                  });
                } else {
                  columns.push({
                    field: headers[i]["keyName"],
                    headerName: headers[i]["displayName"],
                    minWidth: 100,
                  });
                }
              }
              columns.push({
                field: "rowAction",
                headerName: "",
                sortable: false,
                filterable: false,
                disableColumnMenu: true,
                width: 50,
                renderCell: (params) => {
                  return (
                    <>
                      <div className="col-action-container text-right">
                        <div
                          id={"dropdownMenuButton" + params.row.id}
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          <img src={ActionDot} alt="actions" />
                        </div>
                        <ul
                          className="dropdown-menu"
                          aria-labelledby={"dropdownMenuButton" + params.row.id}
                        >
                          <li>
                            <Link
                              to={
                                "/ads/automation-rules/audit-log/" + params.row.id
                              }
                            >
                              <p className="dropdown-item">Audit Log</p>
                            </Link>
                          </li>
                          <li>
                            <Link
                              to={"/ads/add-automation-newrules/" + params.row.id}
                            >
                              <p className="dropdown-item">Edit</p>
                            </Link>
                          </li>
                          <li>
                            <p
                              className="dropdown-item"
                              onClick={(e) => Duplicaate(params.row.id ,params.row.profileId)}
                            >
                              Duplicate
                            </p>
                          </li>
                          <Popconfirm
                            title="Delete"
                            description="Are you sure you want to delete rules?"
                            onConfirm={(e) => deleteRule(params.row.id,params.row.profileId)}
                            onCancel={cancel}
                            okText="Yes"
                            cancelText="No"
                          >
                            <li>
                              <p className="dropdown-item text-red">Delete</p>
                            </li>
                          </Popconfirm>
                        </ul>
                      </div>
                    </>
                  );
                },
              });
            }
            console.log("Columns header: ", columns);
            setIsRows(responceData.result.data);
            setApiLoading(false);
            console.log("Row data: ", rows);
          } catch (error) {
            setApiLoading(false);
            console.error("Error fetching data:", error);
          }
        }
      };
      Data()
      toast("Successfully Deleted");
     
    } else {
      toast("Unable to Deleted");
    }
  };
  const Duplicaate = async (id ,profileId) => {
    console.log(profileId);

    
    
    let userToken = localStorage.getItem("userToken");
    let AuthToken = "Bearer " + userToken;
    const response = await fetch(
      "https://adsautomationapi.agilensmartservices.com/Rule/Duplicate/" + id,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: AuthToken,
        },
        body: JSON.stringify({}),
      }
    );
    const responceData = await response.json();
    
    console.log("Duplicaate" + JSON.stringify(responceData));
    if (responceData.success === true) {
      const Data = async () => {
        if (props.selectedAccount !== "") {
          console.log(props.selectedAccount);
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
              pageNumber: props.currPage,
              pageSize: props.perPage,
    
              globalFilters: {
                searchText: props.searchKey,
                advancedFilters: [
                  profileId,
                  props.fetchRulesByStatus,
                ],
              },
            }),
          };
    
          try {
            const response = await fetch(url, requestOptions);
            const responceData = await response.json();
    
            let pageConfigDetails = {
              total: responceData.result.total,
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
              console.log(headers);
    
              for (let i = 0; headers.length > i; i++) {
                if (headers[i]["keyName"] === "status") {
                  columns.push({
                    field: headers[i]["keyName"],
                    headerName: headers[i]["displayName"],
                    width: 80,
                    renderCell: (params) => {
                      return (
                        <>
                          <div className="form-check form-switch">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="flexSwitchCheckChecked"
                              onChange={() => statusHandler(params ,params.row.profileId)}
                              checked={
                                params.row.status === "Enabled" ? true : false
                              }
                            />
                          </div>
                        </>
                      );
                    },
                  });
                } else if (headers[i]["keyName"] === "ruleName") {
                  columns.push({
                    field: headers[i]["keyName"],
                    headerName: headers[i]["displayName"],
                    width: 170,
                    flex:0.7,
                    renderCell: (params) => {
                      return (
                        <>
                          <div className="col-rulename">
                            <div className="col-title" style={{ overflow: "hidden", whiteSpace: "normal" }}>{params.row.ruleName}</div>
                          </div>
                        </>
                      );
                    },
                  });
                } else if (headers[i]["keyName"] === "automationCriteria") {
                  columns.push({
                    field: headers[i]["keyName"],
                    headerName: headers[i]["displayName"],
                    flex: 1,
                    minWidth: 150,
                    renderCell: (params) => {
                      return (
                        <>
                          <div className="col-rulename">
                            {params.row.automationCriteria.map(
                              (automationCriteria, i) => (
                                <div
                                  key={i}
                                  style={{
                                    overflow: "hidden",
                                    whiteSpace: "normal",
                                  }}
                                >
                                  {automationCriteria}
                                </div>
                              )
                            )}
                          </div>
                        </>
                      );
                    },
                  });
                } else if (headers[i]["keyName"] === "matchTypes") {
                  columns.push({
                    field: headers[i]["keyName"],
                    headerName: headers[i]["displayName"],
                    minWidth: 180,
                    maxWidth: 180,
                    renderCell: (params) => {
                      return (
                        <>
                          <div className="col-rulename">
                            {params.row.matchTypes.map((value, i) => (
                              <div key={i}>{value}</div>
                            ))}
                          </div>
                        </>
                      );
                    },
                  });
                } else if (headers[i]["keyName"] === "targetCriteria") {
                  columns.push({
                    field: headers[i]["keyName"],
                    headerName: headers[i]["displayName"],
                    flex: 1,
                    minWidth: 130,
                    renderCell: (params) => {
                      return (
                        <>
                          <div className="col-rulename">
                            {params.row.targetCriteria.map((value, i) => (
                              <div
                                key={i}
                                style={{ overflow: "hidden", whiteSpace: "normal" }}
                              >
                                {value}
                              </div>
                            ))}
                          </div>
                        </>
                      );
                    },
                  });
                } else if (headers[i]["keyName"] === "actionCriteria") {
                  columns.push({
                    field: headers[i]["keyName"],
                    headerName: headers[i]["displayName"],
                    flex: 1,
                    minWidth: 130,
                    renderCell: (params) => {
                      return (
                        <>
                          <div className="col-rulename">
                            {params.row.actionCriteria.map((value, i) => (
                              <div
                                key={i}
                                style={{ overflow: "hidden", whiteSpace: "normal" }}
                              >
                                {value}
                              </div>
                            ))}
                          </div>
                        </>
                      );
                    },
                  });
                } else if (headers[i]["keyName"] === "dateCreated") {
                  columns.push({
                    field: headers[i]["keyName"],
                    headerName: headers[i]["displayName"],
                    minWidth: 90,
                    maxWidth: 90,
                    renderCell: (params) => {
                      return (
                        <>
                          <div className="col-rulename">
                            {params.row.dateCreated}
                          </div>
                        </>
                      );
                    },
                  });
                } else {
                  columns.push({
                    field: headers[i]["keyName"],
                    headerName: headers[i]["displayName"],
                    minWidth: 100,
                  });
                }
              }
              columns.push({
                field: "rowAction",
                headerName: "",
                sortable: false,
                filterable: false,
                disableColumnMenu: true,
                width: 50,
                renderCell: (params) => {
                  return (
                    <>
                      <div className="col-action-container text-right">
                        <div
                          id={"dropdownMenuButton" + params.row.id}
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          <img src={ActionDot} alt="actions" />
                        </div>
                        <ul
                          className="dropdown-menu"
                          aria-labelledby={"dropdownMenuButton" + params.row.id}
                        >
                          <li>
                            <Link
                              to={
                                "/ads/automation-rules/audit-log/" + params.row.id
                              }
                            >
                              <p className="dropdown-item">Audit Log</p>
                            </Link>
                          </li>
                          <li>
                            <Link
                              to={"/ads/add-automation-newrules/" + params.row.id}
                            >
                              <p className="dropdown-item">Edit</p>
                            </Link>
                          </li>
                          <li>
                            <p
                              className="dropdown-item"
                              onClick={(e) => Duplicaate(params.row.id ,params.row.profileId)}
                            >
                              Duplicate
                            </p>
                          </li>
                          <Popconfirm
                            title="Delete"
                            description="Are you sure you want to delete rules?"
                            onConfirm={(e) => deleteRule(params.row.id,params.row.profileId)}
                            onCancel={cancel}
                            okText="Yes"
                            cancelText="No"
                          >
                            <li>
                              <p className="dropdown-item text-red">Delete</p>
                            </li>
                          </Popconfirm>
                        </ul>
                      </div>
                    </>
                  );
                },
              });
            }
            console.log("Columns header: ", columns);
            setIsRows(responceData.result.data);
            setApiLoading(false);
            console.log("Row data: ", rows);
          } catch (error) {
            setApiLoading(false);
            console.error("Error fetching data:", error);
          }
        }
      };
      Data()
      toast("Successfully Duplicated");
     
    } else {
      toast("Unable to Duplicate");
    }
   
  };

  const statusHandler = async (params ,profileId) => {
    // Update the status in the local state
    setIsRows((prevRows) =>
      prevRows.map((row) =>
        row.id === params.row.id
          ? { ...row, status: row.status === "Paused" ? "Enabled" : "Paused" }
          : row
      )
    );
  
    try {
      // Retrieve token from local storage and set up the authorization header
      let userToken = localStorage.getItem("userToken");
      let AuthToken = "Bearer " + userToken;
  
      // Perform the PUT request
      const response = await fetch(
        "https://adsautomationapi.agilensmartservices.com/Rule/Status",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: AuthToken,
          },
          body: JSON.stringify({
            ruleId: [params.row.id],
            status: params.row.status === "Paused" ? "Enabled" : "Paused",
          }),
        }
      );
  
      // Parse the response data
      const responseData = await response.json();
      console.log("Duplicate" + JSON.stringify(responseData));
  
      // Check the response and show appropriate toast messag

      if (responseData.success === true) {
        const Data = async () => {
          if (props.selectedAccount !== "") {
            console.log(props.selectedAccount);
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
                pageNumber: props.currPage,
                pageSize: props.perPage,
      
                globalFilters: {
                  searchText: props.searchKey,
                  advancedFilters: [
                    profileId,
                    props.fetchRulesByStatus,
                  ],
                },
              }),
            };
      
            try {
              const response = await fetch(url, requestOptions);
              const responceData = await response.json();
      
              let pageConfigDetails = {
                total: responceData.result.total,
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
                console.log(headers);
      
                for (let i = 0; headers.length > i; i++) {
                  if (headers[i]["keyName"] === "status") {
                    columns.push({
                      field: headers[i]["keyName"],
                      headerName: headers[i]["displayName"],
                      width: 80,
                      renderCell: (params) => {
                        return (
                          <>
                            <div className="form-check form-switch">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                id="flexSwitchCheckChecked"
                                onChange={() => statusHandler(params ,params.row.profileId)}
                                checked={
                                  params.row.status === "Enabled" ? true : false
                                }
                              />
                            </div>
                          </>
                        );
                      },
                    });
                  } else if (headers[i]["keyName"] === "ruleName") {
                    columns.push({
                      field: headers[i]["keyName"],
                      headerName: headers[i]["displayName"],
                      width: 170,
                      flex:0.7,
                      renderCell: (params) => {
                        return (
                          <>
                            <div className="col-rulename">
                              <div className="col-title" style={{ overflow: "hidden", whiteSpace: "normal" }}>{params.row.ruleName}</div>
                            </div>
                          </>
                        );
                      },
                    });
                  } else if (headers[i]["keyName"] === "automationCriteria") {
                    columns.push({
                      field: headers[i]["keyName"],
                      headerName: headers[i]["displayName"],
                      flex: 1,
                      minWidth: 150,
                      renderCell: (params) => {
                        return (
                          <>
                            <div className="col-rulename">
                              {params.row.automationCriteria.map(
                                (automationCriteria, i) => (
                                  <div
                                    key={i}
                                    style={{
                                      overflow: "hidden",
                                      whiteSpace: "normal",
                                    }}
                                  >
                                    {automationCriteria}
                                  </div>
                                )
                              )}
                            </div>
                          </>
                        );
                      },
                    });
                  } else if (headers[i]["keyName"] === "matchTypes") {
                    columns.push({
                      field: headers[i]["keyName"],
                      headerName: headers[i]["displayName"],
                      minWidth: 180,
                      maxWidth: 180,
                      renderCell: (params) => {
                        return (
                          <>
                            <div className="col-rulename">
                              {params.row.matchTypes.map((value, i) => (
                                <div key={i}>{value}</div>
                              ))}
                            </div>
                          </>
                        );
                      },
                    });
                  } else if (headers[i]["keyName"] === "targetCriteria") {
                    columns.push({
                      field: headers[i]["keyName"],
                      headerName: headers[i]["displayName"],
                      flex: 1,
                      minWidth: 130,
                      renderCell: (params) => {
                        return (
                          <>
                            <div className="col-rulename">
                              {params.row.targetCriteria.map((value, i) => (
                                <div
                                  key={i}
                                  style={{ overflow: "hidden", whiteSpace: "normal" }}
                                >
                                  {value}
                                </div>
                              ))}
                            </div>
                          </>
                        );
                      },
                    });
                  } else if (headers[i]["keyName"] === "actionCriteria") {
                    columns.push({
                      field: headers[i]["keyName"],
                      headerName: headers[i]["displayName"],
                      flex: 1,
                      minWidth: 130,
                      renderCell: (params) => {
                        return (
                          <>
                            <div className="col-rulename">
                              {params.row.actionCriteria.map((value, i) => (
                                <div
                                  key={i}
                                  style={{ overflow: "hidden", whiteSpace: "normal" }}
                                >
                                  {value}
                                </div>
                              ))}
                            </div>
                          </>
                        );
                      },
                    });
                  } else if (headers[i]["keyName"] === "dateCreated") {
                    columns.push({
                      field: headers[i]["keyName"],
                      headerName: headers[i]["displayName"],
                      minWidth: 90,
                      maxWidth: 90,
                      renderCell: (params) => {
                        return (
                          <>
                            <div className="col-rulename">
                              {params.row.dateCreated}
                            </div>
                          </>
                        );
                      },
                    });
                  } else {
                    columns.push({
                      field: headers[i]["keyName"],
                      headerName: headers[i]["displayName"],
                      minWidth: 100,
                    });
                  }
                }
                columns.push({
                  field: "rowAction",
                  headerName: "",
                  sortable: false,
                  filterable: false,
                  disableColumnMenu: true,
                  width: 50,
                  renderCell: (params) => {
                    return (
                      <>
                        <div className="col-action-container text-right">
                          <div
                            id={"dropdownMenuButton" + params.row.id}
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            <img src={ActionDot} alt="actions" />
                          </div>
                          <ul
                            className="dropdown-menu"
                            aria-labelledby={"dropdownMenuButton" + params.row.id}
                          >
                            <li>
                              <Link
                                to={
                                  "/ads/automation-rules/audit-log/" + params.row.id
                                }
                              >
                                <p className="dropdown-item">Audit Log</p>
                              </Link>
                            </li>
                            <li>
                              <Link
                                to={"/ads/add-automation-newrules/" + params.row.id}
                              >
                                <p className="dropdown-item">Edit</p>
                              </Link>
                            </li>
                            <li>
                              <p
                                className="dropdown-item"
                                onClick={(e) => Duplicaate(params.row.id ,params.row.profileId)}
                              >
                                Duplicate
                              </p>
                            </li>
                            <Popconfirm
                              title="Delete"
                              description="Are you sure you want to delete rules?"
                              onConfirm={(e) => deleteRule(params.row.id,params.row.profileId)}
                              onCancel={cancel}
                              okText="Yes"
                              cancelText="No"
                            >
                              <li>
                                <p className="dropdown-item text-red">Delete</p>
                              </li>
                            </Popconfirm>
                          </ul>
                        </div>
                      </>
                    );
                  },
                });
              }
              console.log("Columns header: ", columns);
              setIsRows(responceData.result.data);
              setApiLoading(false);
              console.log("Row data: ", rows);
            } catch (error) {
              setApiLoading(false);
              console.error("Error fetching data:", error);
            }
          }
        };
        Data()
        const toastMessage =
        params.row.status === "Paused" ? "Successfully Enabled" : "Successfully Paused";
       toast(toastMessage);
       
      } else {
        toast("Unable to Perform Action");
      }
    } catch (error) {
      console.error(error);
      toast("An error occurred. Please try again.");
    }
  };
  

  const fetchData = async () => {
    if (props.selectedAccount !== "") {
      console.log(props.selectedAccount);
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
          pageNumber: props.currPage,
          pageSize: props.perPage,

          globalFilters: {
            searchText: props.searchKey,
            advancedFilters: [
              String(props.selectedAccount),
              props.fetchRulesByStatus,
            ],
          },
        }),
      };

      try {
        const response = await fetch(url, requestOptions);
        const responceData = await response.json();
        let pageConfigDetails = {
          total: responceData.result.total,
          filteredCount: responceData.result.filteredCount,
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
          console.log(headers);

          for (let i = 0; headers.length > i; i++) {
            if (headers[i]["keyName"] === "status") {
              columns.push({
                field: headers[i]["keyName"],
                headerName: headers[i]["displayName"],
                width: 80,
                renderCell: (params) => {
                  return (
                    <>
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                          id="flexSwitchCheckChecked"
                          onChange={() => statusHandler(params,params.row.profileId)}
                          checked={
                            params.row.status === "Enabled" ? true : false
                          }
                        />
                      </div>
                    </>
                  );
                },
              });
            } else if (headers[i]["keyName"] === "ruleName") {
              columns.push({
                field: headers[i]["keyName"],
                headerName: headers[i]["displayName"],
                width: 170,
                flex:0.7,
                renderCell: (params) => {
                  return (
                    <>
                      <div className="col-rulename">
                        <div className="col-title" style={{ overflow: "hidden", whiteSpace: "normal" }}>{params.row.ruleName}</div>
                      </div>
                    </>
                  );
                },
              });
            } else if (headers[i]["keyName"] === "automationCriteria") {
              columns.push({
                field: headers[i]["keyName"],
                headerName: headers[i]["displayName"],
                flex: 1,
                minWidth: 150,
                renderCell: (params) => {
                  return (
                    <>
                      <div className="col-rulename">
                        {params.row.automationCriteria.map(
                          (automationCriteria, i) => (
                            <div
                              key={i}
                              style={{
                                overflow: "hidden",
                                whiteSpace: "normal",
                              }}
                            >
                              {automationCriteria}
                            </div>
                          )
                        )}
                      </div>
                    </>
                  );
                },
              });
            } else if (headers[i]["keyName"] === "matchTypes") {
              columns.push({
                field: headers[i]["keyName"],
                headerName: headers[i]["displayName"],
                minWidth: 180,
                maxWidth: 180,
                renderCell: (params) => {
                  return (
                    <>
                      <div className="col-rulename">
                        {params.row.matchTypes.map((value, i) => (
                          <div key={i}>{value}</div>
                        ))}
                      </div>
                    </>
                  );
                },
              });
            } else if (headers[i]["keyName"] === "targetCriteria") {
              columns.push({
                field: headers[i]["keyName"],
                headerName: headers[i]["displayName"],
                flex: 1,
                minWidth: 130,
                renderCell: (params) => {
                  return (
                    <>
                      <div className="col-rulename">
                        {params.row.targetCriteria.map((value, i) => (
                          <div
                            key={i}
                            style={{ overflow: "hidden", whiteSpace: "normal" }}
                          >
                            {value}
                          </div>
                        ))}
                      </div>
                    </>
                  );
                },
              });
            } else if (headers[i]["keyName"] === "actionCriteria") {
              columns.push({
                field: headers[i]["keyName"],
                headerName: headers[i]["displayName"],
                flex: 1,
                minWidth: 130,
                renderCell: (params) => {
                  return (
                    <>
                      <div className="col-rulename">
                        {params.row.actionCriteria.map((value, i) => (
                          <div
                            key={i}
                            style={{ overflow: "hidden", whiteSpace: "normal" }}
                          >
                            {value}
                          </div>
                        ))}
                      </div>
                    </>
                  );
                },
              });
            } else if (headers[i]["keyName"] === "dateCreated") {
              columns.push({
                field: headers[i]["keyName"],
                headerName: headers[i]["displayName"],
                minWidth: 90,
                maxWidth: 90,
                renderCell: (params) => {
                  return (
                    <>
                      <div className="col-rulename">
                        {params.row.dateCreated}
                      </div>
                    </>
                  );
                },
              });
            } else {
              columns.push({
                field: headers[i]["keyName"],
                headerName: headers[i]["displayName"],
                minWidth: 100,
              });
            }
          }
          columns.push({
            field: "rowAction",
            headerName: "",
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            width: 50,
            renderCell: (params) => {
              return (
                <>
                  <div className="col-action-container text-right">
                    <div
                      id={"dropdownMenuButton" + params.row.id}
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <img src={ActionDot} alt="actions" />
                    </div>
                    <ul
                      className="dropdown-menu"
                      aria-labelledby={"dropdownMenuButton" + params.row.id}
                    >
                      <li>
                        <Link
                          to={
                            "/ads/automation-rules/audit-log/" + params.row.id
                          }
                        >
                          <p className="dropdown-item">Audit Log</p>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to={"/ads/add-automation-newrules/" + params.row.id }
                        >
                          <p className="dropdown-item">Edit</p>
                        </Link>
                      </li>
                      <li>
                        <p
                          className="dropdown-item"
                          onClick={(e) => Duplicaate(params.row.id ,params.row.profileId)}
                        >
                          Duplicate
                        </p>
                      </li>
                      <Popconfirm
                        title="Delete"
                        description="Are you sure you want to delete rules?"
                        onConfirm={(e) => deleteRule(params.row.id ,params.row.profileId)}
                        onCancel={cancel}
                        okText="Yes"
                        cancelText="No"
                      >
                        <li>
                          <p className="dropdown-item text-red">Delete</p>
                        </li>
                      </Popconfirm>
                    </ul>
                  </div>
                </>
              );
            },
          });
        }
        setIsRows(responceData.result.data)
        console.log("Columns header: ", columns);
        setApiLoading(false);
        console.log("Row data: ", responceData.result.data);
      } catch (error) {
        setApiLoading(false);
        console.error("Error fetching data:", error);
      }
    }
  };

  return (
    <div className="mt-4">
      <div style={{ height: "calc(78vh - 120px)", width: "100%" }}>
        {!apiLoading ? (
          <>
            <div
              className="modal fade"
              id="addTagModel"
              aria-hidden="true"
              aria-labelledby="exampleModalToggleLabel3"
            >
              <div className="modal-dialog ">
                <div className="modal-content addTagModel">
                  <Row className="addTagInputContainer">
                    <Col md={12}>
                      <input
                        type="text"
                        className="form-control"
                        onChange={tagInputValue}
                      />
                    </Col>
                    <div className="addTagbtnContainer">
                      <button
                        type="button"
                        className="addTagBtn btn btn-primary"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                        
                        onClick={patchTagData}
                      >
                        Add
                      </button>
                    </div>
                  </Row>
                </div>
              </div>
            </div>
            <DataGrid
              rows={rows}
              columns={columns}
              checkboxSelection={true}
              hideFooter={true}
              rowHeight={100}
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
export default AutomationRulesListTable;
