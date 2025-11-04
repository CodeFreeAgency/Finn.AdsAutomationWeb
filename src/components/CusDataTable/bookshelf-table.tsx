import React, { useState, useEffect } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import NotificationIcon from "../../assets/images/icons/tag-del-notification.png";

import "./index.css";

import LogoIcon from "../../assets/brand/logo-icon.svg";
import ConditionFilter from "../Filters/condition-filter";
import ColumnFilter from "../Filters/cloumn-filter";
import { Col, Row } from "react-bootstrap";

import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import { toast } from "react-toastify";
import { param } from "jquery";
let rows: any = [];
let columns: GridColDef[] = [];
let filterData: any = [];

function BookshelfTable(props) {
  let apiEndPoint = "https://api.aimosa.io/BookShelf";
  let pageload = true;
  const [apiLoading, setApiLoading] = useState(false);
  const [apiLoading1, setApiLoading1] = useState("");
  const [tagVal, setName] = useState("");
  const [tagData, setTagData] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [selectedRowid, setSelectedRows] = useState<any>([]);
  const [valus, setValus] = useState<any>([]);
  const [tagacos, setTagacos] = useState("");
  const [asin, setAsin] = useState("");
  // work 1 change TO ARRAY
  const [tagInput, setTagInputValue] = useState("");
  const [clickedId, setClickedId] = useState("");
  const [selectedAsin, setSelectedAsin] = useState("");
  const [listData, setListData] = useState([]);

  //const [listData, setlistData] = ([]);      //this.setState({ listData: responceData.result.data });

  // const [tagText, settagText] = useState("");
  // const [tagasin, settagasin] = useState("");
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
      //getAdsCreationListData();
      pageload = false;
    }
  }, [props.reloadTableData, pageload, props.daatareloading]);
  useEffect(() => {
    if (props.currPage || props.perPage) {
      fetchData();
    }
    if (props.filterData || props.searchKey) {
      fetchData();
    }
  }, [props.currPage, props.perPage, props.filterData, props.searchKey]);
  useEffect(() => {
    let newRowSelectedArr: any = [];
    if (selectedRowid && selectedRowid.length > 0) {
      for (let index = 0; index < selectedRowid.length; index++) {
        const rowObj = rows.find((row) => row.id === selectedRowid[index]);
        console.log("Selected row obj: ", rowObj);
        newRowSelectedArr.push(rowObj.asin);
      }
      console.log("New Row Array Asin: ", newRowSelectedArr);
      props.parentSlectedRowCallBack(newRowSelectedArr);
    }
  }, [selectedRowid]);
  // const tagInputValue = (e) => {
  //   this.setState( tagInput: e.target.value}};
  const tagInputValue = (e) => {
    setTagInputValue(e.target.value);
  };
  // tagInputValue = (e) => {
  //   this.setState({ tagText: e.target.value });
  // };
  // addTagValue = (e) => {
  //   this.setState({ tagText: e.target.value });
  // };

  const clickedIdValue = (data: any) => {
    setSelectedAsin(data.row.asin);

    console.log("clicked id " + data.row.asin);
    //console.log("data id" + data.id);
    var idValue = data.id;
    setClickedId(idValue);
    console.log("setSelectedAsin" + selectedAsin);
  };
  //
  //
  const removeTag = async (tag, id) => {
    let userToken = localStorage.getItem("userToken");
    let AuthToken = "Bearer " + userToken;
    console.log("Remove Click Tage" + tag);
    const response = await fetch(
      "https://api.aimosa.io/BookShelf/" + id + "/Tag",
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: AuthToken,
        },
        body: JSON.stringify({
          tag: [tag],
        }),
      }
    );
    const responceData = await response.json();
    console.log("best=s", responceData);
    fetchData();
  };

  // work 3
  const removeClick = async (tag, id) => {
    confirmAlert({
      customUI: ({ onClose }) => (
        <div className="custom-ui">
          <div className="logo-del-tag">
            <img
              src={NotificationIcon}
              alt="Notification Icon"
              style={{ width: "80px", height: "80px" }}
            />
          </div>
          <h1>Are you sure you want to delete "{id}" tag?</h1>
          <p>If you delete this, you will no longer be able to restore it.</p>
          <div className="buttons-container">
            <button onClick={onClose}>Cancel</button>
            <button
              onClick={() => {
                deleteDataTags(tag, id);
                onClose();
              }}
            >
              Delete
            </button>
          </div>
        </div>
      ),
    });
  };

  /// aaa add tage
  const patchTagData = async () => {
    setTagData(tagInput);
    console.log("add input selectedAsin " + selectedAsin);
    console.log("add input data " + tagInput);
    let userToken = localStorage.getItem("userToken");
    let AuthToken = "Bearer " + userToken;
    const response = await fetch(
      "https://api.aimosa.io/BookShelf/Bulkoperation",
      //"https://api.aimosa.io/BookShelf/" + clickedId + "/Tag",
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: AuthToken,
        },
        body: JSON.stringify({
          asin: [selectedAsin],
          tags: [tagInput],
        }),
        // abc
      }
    );
    const responceData = await response;
    console.log("best    =s    pathh ", responceData);
    fetchData();
    //getAdsCreationListData();
  };
  //

  // delete
  const deleteDataTags = async (asin, tags) => {
    let userToken = localStorage.getItem("userToken");
    let AuthToken = "Bearer " + userToken;
    console.log("delete row asin " + asin);
    console.log("delete  data tags : " + tags);
    //let url = "https://api.aimosa.io/Tag";
    let url = "https://api.aimosa.io/BookShelf/Tag";
    // Make a PATCH request to delete the specified tag
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: AuthToken,
      },
      // Include list.asin and the tag to be deleted in the body
      body: JSON.stringify({
        // asin: [this.state.tagasin],
        asin: asin,
        tag: tags,
        // tags: [tagText],
        //tags:
      }),
    });
    console.log(`delete tag response: ${response}`);
    try {
      const responseData = await response.json();
      // Handle the response data as needed
      console.log("delete api response += " + responseData);

      // Update the state or perform any other actions after tag deletion
      fetchData();
    } catch (error) {
      console.error("Error deleting tag:", error);
    }
  };
  // Acos
  const handleAdds = async (e) => {
    console.log("handleAdds=" + tagacos);
    console.log("Asin " + asin);
    let userToken = localStorage.getItem("userToken");
    let AuthToken = "Bearer " + userToken;
    const response = await fetch(
      "https://api.aimosa.io/BookShelf/Bulkoperation",

      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: AuthToken,
        },
        body: JSON.stringify({
          asin: [asin],
          tags: [""],
          targetAcos: parseInt(tagacos),
          addAdExpenses: null,
        }),
        // abc
      }
    );
    const responceData = await response;
    console.log("best    =s    pathh ", responceData);
    if (responceData.status == 200) {
      let result = responceData;
      toast("Record updated successfully");
      setTagacos("");
      fetchData();
    } else {
      toast("Unable to update");
    }
    // this.setState({ apiLoading: false });

    console.log("datas " + setTagacos);
  };
  const dataloading = (datadsi) => {
    setAsin(datadsi.asin);
    setTagacos(datadsi.targetAcos);
    console.log("datassa " + JSON.stringify(datadsi.tagacos));
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
          pageNumber: props.currPage,
          pageSize: props.perPage,
          globalFilters: {
            searchText: props.searchKey,
            advancedFilters: advancedFilters,
          },
        }),
      };

      try {
        const response = await fetch(url, requestOptions);
        const responceData = await response.json();
        console.log("bookself=   fatch ", responceData);

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
        console.log("Bookshelf API Response: ", responceData);
        if (columns.length < 1) {
          let headers = responceData.result.headers;
          for (let i = 0; headers.length > i; i++) {
            if (headers[i]["keyName"] === "product") {
              columns.push({
                field: headers[i]["keyName"],
                headerName: headers[i]["displayName"],
                width: 200,
                renderCell: (params) => {
                  return (
                    <>
                      <div className="bookself-product-column">
                        <div className="bookshelf-bookcover">
                          <img
                            src={params.row.product.bookCoverImage}
                            alt={params.row.product.bookName}
                          />
                        </div>
                        <div className="product-column-content">
                          <HtmlTooltip
                            placement="bottom-start"
                            title={
                              <React.Fragment>
                                <Typography color="inherit">
                                  {params.row.product.author}
                                </Typography>
                                <p>{params.row.product.bookName}</p>
                              </React.Fragment>
                            }
                          >
                            <div>
                              <div className="product-column-title">
                                {params.row.product.bookName}
                              </div>
                              {/* abc */}
                              <p>{params.row.product.author}</p>
                            </div>
                          </HtmlTooltip>
                        </div>
                      </div>
                    </>
                  );
                },
              });
              //getAdsCreationListData();
            } else if (headers[i]["keyName"] === "tags") {
              columns.push({
                field: headers[i]["keyName"],
                headerName: headers[i]["displayName"],
                width: 200,
                renderCell: (params) => {
                  return (
                    <>
                      <div className="bookself-product-tags">
                        <button
                          className="add-tag"
                          data-bs-target="#addTagModel"
                          data-bs-toggle="modal"
                          data-bs-dismiss="modal"
                          onClick={() => clickedIdValue(params)}
                        >
                          Add Tag
                        </button>
                        {params.row.tags.map((tag, i) => (
                          <span className="tags" key={i}>
                            {tag}
                            <button
                              className="delete-tag-button"
                              value={(params.row.asin, tag)}
                              onClick={(e) => removeClick(params.row.asin, tag)}
                            >
                              <i />
                            </button>
                          </span>
                        ))}
                      </div>
                    </>
                  );
                },
              });
            } else if (headers[i]["keyName"] === "bsr") {
              columns.push({
                field: headers[i]["keyName"],
                headerName: headers[i]["displayName"],
                minWidth: 150,
                renderCell: (params) => {
                  return (
                    <>
                      <div className="bsr-tag-container">
                        {params.row.bsr.map((bsr, i) => (
                          <div className="bsr-tags">
                            {bsr} <u></u>
                          </div>
                        ))}
                        {params.row.bsr > 4 && (
                          <div className="view-all">View All</div>
                        )}
                      </div>
                    </>
                  );
                },
              });
            } else if (headers[i]["keyName"] === "targetACOS") {
              columns.push({
                field: headers[i]["keyName"],
                headerName: headers[i]["displayName"],
                minWidth: 100,
                editable: true,
                type: "number",
                renderCell: (params) => {
                  return (
                    <>
                      <div className="input-editable-container">
                        {/* <input
                          className="input-inside-table-colum"
                          value={params.row.targetAcos}
                        />{" "}
                        <span>%</span> */}
                        <button
                          style={{
                            backgroundColor: "#fff",
                            border: "1px solid light-gray",
                          }}
                          data-bs-toggle="modal"
                          data-bs-target="#addTagModel25"
                          onClick={(e) => dataloading(params.row)}
                        >
                          {params.row.targetAcos}%
                        </button>
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
    <div className="mt-4">
      <div style={{ height: 450, width: "100%" }}>
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
                    <Col className="addTagModelContainers">
                      <h4>Add Tag</h4>
                      <p>
                        You will add this tag to the products that you have
                        selected.
                      </p>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="add tag here"
                        //value={tagText}
                        onChange={(e) => tagInputValue(e)}
                        //onChange={(e) => this.addTagValue(e)}
                        // abc
                      />
                      <div className="addTagBtnContainer">
                        <button
                          className="addTagCancell"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                        >
                          Cancel
                        </button>
                        <button
                          // abc
                          className="addTagSave"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                          onClick={patchTagData}
                        >
                          Save
                        </button>
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>
            </div>

            <DataGrid
              rows={rows}
              columns={columns}
              checkboxSelection={true}
              onRowSelectionModelChange={(ids) => {
                const selectedIDs = new Set(ids);
                const selectedRowsData = ids.map((id) =>
                  rows.find((row) => row.id === id)
                );

                setSelectedRows(ids);
                console.log("after" + valus);
              }}
              hideFooter={true}
              rowHeight={100}
              disableRowSelectionOnClick
            />
          </>
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
      <div
        className="modal fade"
        id="addTagModel25"
        aria-hidden="true"
        aria-labelledby="exampleModalToggleLabel3"
      >
        <div className="modal-dialog ">
          <div className="modal-content addTagModel">
            <Row className="addTagInputContainer">
              <Col className="addTagModelContainers">
                <h4>Set Target ACoS</h4>
                <p>
                  You will add this ACoS to the product that you have selected.
                </p>
                <input
                  type="text"
                  className="form-control"
                  placeholder="enter target AcoS here"
                  onChange={(e) => setTagacos(e.target.value)}
                  value={tagacos}
                />
                <div className="addTagBtnContainer">
                  <button
                    className="addTagCancell"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  >
                    Cancel
                  </button>
                  <button
                    // abc
                    className="addTagSave"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    onClick={handleAdds}
                  >
                    Save
                  </button>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </div>
  );
}
export default BookshelfTable;
