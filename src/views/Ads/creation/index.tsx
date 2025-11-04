/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from "react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { Row, Col, Button } from "react-bootstrap";
import "./index.css";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

import LinkIcon from "../../../assets/images/icons/link-icon.svg";
import { Link, Navigate } from "react-router-dom";

import FilterIcon from "../../../assets/images/icons/filter-icon.svg";
import PauseIcon from "../../../assets/images/icons/pause.svg";
import ExportIcon from "../../../assets/images/icons/export.svg";
import TagIcon from "../../../assets/images/icons/tag-icon.svg";
import MoreActionDot from "../../../assets/images/icons/more-action-icon.svg";
import GlobIcon from "../../../assets/images/icons/global-icon.svg";
import DownArrow from "../../../assets/images/icons/profile-down-arrow.svg";
import MoveIcon from "../../../assets/images/icons/sort-move-icon.svg";
import NotificationIcon from "../../../assets/images/icons/tag-del-notification.png";
import TrashIcon from "../../../assets/images/icons/trash-icon.svg";
import ColumnFilter from "../../../components/Filters/cloumn-filter";
import ConditionFilter from "../../../components/Filters/condition-filter";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
class AdsCreations extends Component {
  filterData: any = [];
  state = {
    manageTags: [{ tag: "", initialTag: "", count: "" }],
    globalFilterFromData: [],
    searchKeyFilter: "",
    globalFilterDateRange: [],
    filterOptionData: [],
    paginationList: [],
    perPage: 10,
    total: 0,
    currPage: 1,
    pageSize: 10,
    lastPage: 0,
    nextPage: 0,
    prevPage: 0,
    dropdownDatas: [],
    getSelectedRules: [],
    pageReload: false,
    getRulesByStatus: "",
    redirectLocation: "",
    redirect: "",
    redirectId: "",
    searchText: "",
    advancedFilters: [],
    listData: [],
    tagText: "",
    tagasin: "",
    lastUpdatedDate: localStorage.getItem("lastUpdatedDate") || null,
  };

  // abc
  addTagValue = (e) => {
    this.setState({ tagText: e.target.value });
  };

  getTagAsignValue = (e) => {
    this.setState({ tagasin: e.target.value });
    console.log(`getTagAsignValue ${this.state.tagasin}`);
  };

  componentDidMount() {
    this.getAdsCreationListData();
    this.manageHandler();
  }
  handleChange = (event, value) => {
    this.setState({ currPage: value }, () => {
      this.getAdsCreationListData();
    });
  };

  handleNvEnter = (event) => {
    console.log("Nv Enter:", event);
  };
  handleCallback = (childData) => {};
  handleKeyDown = (event: any) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const searchText = event.target.value;
      this.setState({ searchText }, () => {
        this.getAdsCreationListData();
        console.log(searchText);
      });
    }
  };
  updateRulesStatus = (statusType) => {
    if (this.state.getSelectedRules.length > 0) {
      this.setState({ pageReload: false });
      console.log("Enable Rules list: ", this.state.getSelectedRules);
    }
  };
  deleteRule = async () => {};
  applyDataLength = async (e) => {
    const newPerPage = parseInt(e.target.value);

    this.setState({ pageSize: newPerPage }, async () => {
      console.log("Updated perPage:", this.state.pageSize);
      console.log("Now calling API...");
      await this.getAdsCreationListData();
    });
  };

  campaignEditClick = async (data: any) => {
    console.log(data.asin);

    const url = "/ads/ads-creation/auto-campaign/" + data.id;
    this.setState({ redirect: url });
  };
  redirectPage = (panelName, eve) => {
    const selectedPlan: any = document.querySelectorAll(
      ".create-ads-modal-radio"
    );
    if (selectedPlan.length > 0) {
      const clearEle: any = document.querySelectorAll(
        ".create-ads-modal-radio.selected"
      );
      for (var i = 0; i < clearEle.length; i++) {
        clearEle[i].classList.remove("selected");
      }
      for (let i = 0; i < selectedPlan.length; i++) {
        if (selectedPlan[i].contains(eve.target)) {
          selectedPlan[i].classList.add("selected");
        }
      }
    }
    if (panelName === "auto") {
      const url = "/ads/ads-creation/auto-campaign/" + this.state.redirectId;
      this.setState({ redirectLocation: url });
    }
    if (panelName === "manual") {
      const url = "/ads/ads-creation/manual-campaign/" + this.state.redirectId;
      this.setState({ redirectLocation: url });
    }
  };

  getAdsCreationListData = async () => {
    console.log(
      "Current pageSize in getAdsCreationListData:",
      this.state.pageSize
    );

    let userToken = localStorage.getItem("userToken");
    let AuthToken = "Bearer " + userToken;
    let url = "https://api.aimosa.io/Campaign/All";

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: AuthToken,
        },
        body: JSON.stringify({
          pageNumber: this.state.currPage,
          pageSize: this.state.pageSize,
          globalFilters: {
            searchText: this.state.searchText,
            advancedFilters: [],
          },
        }),
      });

      const responceData = await response.json();
      console.log(responceData);
      if (responceData.success) {
        const { data, total, lastPage, nextPage } = responceData.result;

        this.setState({
          listData: data,
          total: total,
          lastPage: lastPage,
          nextPage: nextPage,
        });

        console.log(data);
      } else {
        console.error("API request failed:", responceData.error);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  addDataTags = async () => {
    let userToken = localStorage.getItem("userToken");
    let AuthToken = "Bearer " + userToken;
    let url = "https://api.aimosa.io/BookShelf/Bulkoperation";
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: AuthToken,
      },
      body: JSON.stringify({
        asin: [this.state.tagasin],
        tags: [this.state.tagText],
        targetAcos: 0,
        addAdExpenses: 0,
      }),
    });
    try {
      const responseData = await response.json();
      this.getAdsCreationListData();
      this.setState({ tagText: "" });
      toast("Tag added successfully");
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  //
  deleteDataTags = async (asin, tags) => {
    let userToken = localStorage.getItem("userToken");
    let AuthToken = "Bearer " + userToken;
    let url = "https://api.aimosa.io/BookShelf/Tag";
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: AuthToken,
      },
      body: JSON.stringify({
        asin: asin,
        tag: tags,
      }),
    });
    try {
      const responseData = await response.json();
      this.getAdsCreationListData();
      if (responseData.success) {
        toast("Tag Deleted successfully");
      } else {
        toast(responseData.message);
      }
    } catch (error) {
      console.error("Error deleting tag:", error);
    }
  };

  //
  openCreateAdsModelPopup = (id, eve) => {
    console.log("id", id);
    this.setState({ redirectId: id });
    let ele = document.getElementById("createAdsModelPopup");
    if (ele) {
      ele.classList.add("open");
    }
  };
  handleModelRedirectClick = () => {
    let ele = document.getElementById("createAdsModelPopup");
    if (ele) {
      ele.classList.remove("open");
    }
    this.setState({ redirect: this.state.redirectLocation });
  };
  closeModalPopUp = () => {
    let ele = document.getElementById("createAdsModelPopup");
    if (ele) {
      ele.classList.remove("open");
    }
  };
  removeClick(tag, id) {
    // confirmAlert({
    //   title: "Confirm to Delete",
    //   message: "Are you sure to do this.",
    //   buttons: [
    //     {
    //       label: "Yes",
    //       onClick: () => this.deleteDataTags(tag, id),
    //     },
    //     {
    //       label: "No",
    //     },
    //   ],
    // });
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
                this.deleteDataTags(tag, id);
                onClose();
              }}
            >
              Delete
            </button>
          </div>
        </div>
      ),
    });
  }
  campaignAdsRegionCampaings = (props, asin) => {
    console.log("Campaing List :", props);
    return props.map((campaignDetails, i) => (
      <Col md={6} className="mb-3 create-campaing-form">
        <div className="accordion-item rules-list-item">
          <div className="accordion-header rules-list-item-summary">
            <div>
              <img src={MoveIcon} alt="" />
            </div>
            <div className="rule-title-name">
              {campaignDetails.campaignName.name}
            </div>
            <div
              className="down-arrow collapsed"
              data-bs-toggle="collapse"
              data-bs-target={"#collapse-" + campaignDetails.id}
              aria-expanded="false"
              aria-controls="collapseOne"
            >
              <img src={DownArrow} alt="" />
            </div>
          </div>
          <div
            className="rules-list-item-details accordion-collapse collapse"
            id={"collapse-" + campaignDetails.id}
            aria-labelledby="headingOne"
            data-bs-parent="#accordionExample"
          >
            <div className="edit-link">
              <Link
                to={
                  "/ads/ads-creation/auto-campaign/" +
                  asin +
                  "/" +
                  campaignDetails.id
                }
              >
                Edit
              </Link>
              {/* <Link to="" onClick={(e)=>this.campaignEditClick(campaignDetails)}>Edit</Link> */}
            </div>
            <Row>
              {campaignDetails.campaignName && (
                <Col md={12}>
                  <h6>Campaign Name</h6>
                  <p className="overflow-ellipse">
                    {campaignDetails.campaignName.name}
                  </p>
                </Col>
              )}
              {campaignDetails.adGroups && (
                <Col md={12}>
                  <h6>Ad Group Name</h6>
                  <div className="added-groups-list">
                    {campaignDetails.adGroups.map((adgroups, index) => (
                      <div>{adgroups.name}</div>
                    ))}
                  </div>
                </Col>
              )}
              {campaignDetails.dynamicBidding && (
                <Col md={4}>
                  <h6>Targeting Bid</h6>
                  <p>{campaignDetails.dynamicBidding.targetingBid}</p>
                </Col>
              )}
              {campaignDetails.dynamicBidding && (
                <Col md={4}>
                  <h6>Close</h6>
                  <p>{campaignDetails.dynamicBidding.close}</p>
                </Col>
              )}
              {campaignDetails.dynamicBidding && (
                <Col md={4}>
                  <h6>Loose</h6>
                  <p>{campaignDetails.dynamicBidding.loose}</p>
                </Col>
              )}
              {campaignDetails.dynamicBidding && (
                <Col md={4}>
                  <h6>Default Bid</h6>
                  <p>{campaignDetails.dynamicBidding.defaultBid}</p>
                </Col>
              )}
              {campaignDetails.dynamicBidding && (
                <Col md={4}>
                  <h6>Substitutes</h6>
                  <p>{campaignDetails.dynamicBidding.substitutes}</p>
                </Col>
              )}
              {campaignDetails.dynamicBidding && (
                <Col md={4}>
                  <h6>Complements</h6>
                  <p>{campaignDetails.dynamicBidding.complements}</p>
                </Col>
              )}
              {campaignDetails.negativeKeywordTargeting && (
                <Col md={4}>
                  <h6>Level</h6>
                  <p>
                    {campaignDetails.negativeKeywordTargeting.targetingType}
                  </p>
                </Col>
              )}
              {campaignDetails.negativeKeywordTargeting.keywords.length > 0 && (
                <Col md={8}>
                  <h6>Negative Keyword Targeting</h6>
                  <p>
                    {campaignDetails.negativeKeywordTargeting.keywords[0].type}
                  </p>
                </Col>
              )}
              <Col md={8}>
                {campaignDetails.negativeKeywordTargeting && (
                  <div className="table-responsive">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Keyword</th>
                          <th>Match Type</th>
                          <th></th>
                        </tr>
                      </thead>
                      {campaignDetails.negativeKeywordTargeting.keywords
                        .length > 0 && (
                        <tbody>
                          {campaignDetails.negativeKeywordTargeting.keywords.map(
                            (adKeyword: any, i) => (
                              <tr>
                                <td>{adKeyword.keyword}</td>
                                <td>{adKeyword.type}</td>
                                <td></td>
                              </tr>
                            )
                          )}
                        </tbody>
                      )}
                    </table>
                  </div>
                )}
              </Col>
              <Col md={12}>
                <h6>Campaign Bidding Strategy</h6>
                <p>{campaignDetails.campaignBiddingStrategy}</p>
              </Col>
              {campaignDetails.settings && (
                <Col md={12}>
                  <h6>Portfolio</h6>
                  <p>{campaignDetails.settings.portfolio}</p>
                </Col>
              )}
              {campaignDetails.settings && (
                <Col md={12}>
                  <h6>Daily Budget</h6>
                  <p>{campaignDetails.settings.dailyBudget}</p>
                </Col>
              )}
            </Row>
          </div>
        </div>
      </Col>
    ));
  };
  handleRegionDisplay = (id, region, eve) => {
    const activeTab = ".campaign-region-tab-" + id;
    const activeCont = ".campaign-region-content-" + id;

    const clearTabEle: any = document.querySelectorAll(activeTab + ".active");
    for (var i = 0; i < clearTabEle.length; i++) {
      clearTabEle[i].classList.remove("active");
    }
    const clearContEle: any = document.querySelectorAll(activeCont + ".active");
    for (var j = 0; j < clearContEle.length; j++) {
      clearContEle[j].classList.remove("active");
    }

    const activeTabEle: any = document.querySelectorAll(
      activeTab + "." + region
    );
    for (let k = 0; k < activeTabEle.length; k++) {
      activeTabEle[k].classList.add("active");
    }

    const activeContEle: any = document.querySelectorAll(
      activeCont + "." + region
    );
    for (let l = 0; l < activeContEle.length; l++) {
      activeContEle[l].classList.add("active");
    }
  };

  duplicateRow = () => {};

  deleteRow = () => {};
  manageHandler = async () => {
    let userToken = localStorage.getItem("userToken");
    let AuthToken = "Bearer " + userToken;
    const response = await fetch("https://api.aimosa.io/Tag", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: AuthToken,
      },
    });
    const responceData = await response.json();
    const initialTags = responceData.result.map((tag) => ({
      tag: tag.tag,
      initialTag: tag.tag,
      count: tag.count,
    }));
    this.setState({ manageTags: initialTags });
    this.setState({ DataLoading: false });
  };

  remove = async (item: any) => {
    let userToken = localStorage.getItem("userToken");
    let AuthToken = "Bearer " + userToken;
    const response = await fetch("https://api.aimosa.io/Tag", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: AuthToken,
      },
      body: JSON.stringify({
        tag: item,
      }),
    });

    if (!response.ok) {
      toast("Unable to Delete");
    } else {
      toast("Record Deleted Successfully");
    }

    this.setState({ DataLoading: false });
  };

  handleEditTags = async () => {
    let userToken = localStorage.getItem("userToken");
    let AuthToken = "Bearer " + userToken;
    const requestBody = {
      item: this.state.manageTags.map(({ initialTag, tag }) => ({
        oldTag: initialTag,
        tags: tag,
      })),
    };
    const response = await fetch("https://api.aimosa.io/Tag", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: AuthToken,
      },
      body: JSON.stringify({
        item: requestBody.item,
      }),
    });

    if (!response.ok) {
      toast("Unable to Updated");
    } else {
      toast("Record Updated Successfully");
    }

    this.setState({ DataLoading: false });
  };

  render() {
    if (this.state.redirect) {
      return <Navigate to={this.state.redirect} />;
    }
    const manageTagsListEdit = this.state.manageTags.map((item, index) => {
      return (
        <>
          <div className="d-flex align-items-start">
            <input
              type="text"
              className="form-control mb-2 mx-2"
              onChange={(e) => handleTagInputChange(e, index)}
              value={item.tag}
            />

            <div
              style={{ cursor: "pointer" }}
              className="addTagCancell trash"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={() => this.remove(item.tag)}
            >
              <i>
                <img src={TrashIcon} alt="trash-icon" className="trash-icon" />
              </i>
            </div>
          </div>{" "}
          <p className="m-0 mb-1 p-0">this tag is {item.count}x Used</p>
        </>
      );
    });
    const handleTagInputChange = (e, index) => {
      const updatedTagsList = [...this.state.manageTags];
      const newValue = e.target.value;
      updatedTagsList[index].tag = newValue;
      this.setState({ manageTags: updatedTagsList });
    };
    return (
      <DashboardLayout>
        <div className="main-cont-header bookself-container">
          <Row className="page-header">
            <Col>
              <div className="main-con-page-title-container">
                <div className="title">
                  <h3 className="page-title">Ads</h3>
                </div>
              </div>
            </Col>
            <Col className="text-end last-sync">
              <span>Last App Sync :</span>

              <span className="time-summery">
                {" "}
                {this.state.lastUpdatedDate || "Not available"}
              </span>
            </Col>
          </Row>
        </div>
        <div className="main-content-container">
          <hr />
          <div className="dashboard-container padding-lr-30">
            <Row>
              <Col md={7}>
                <div className="table-global-action-container align-items-center">
                  <div className="mx-2">
                    <input type="checkbox" name="globalSearch" />
                  </div>
                  <div className="search-filter-container width-200 mx-2">
                    <i className="fa fa-search"></i>
                    <input
                      type="text"
                      placeholder="Search"
                      id="globalSearch"
                      name="globalSearch"
                      onKeyDown={this.handleKeyDown}
                    />
                  </div>
                  <div className="bulk-operation-container width-200 mx-2">
                    <div className="dropdownContent width-200">
                      <p
                        id="dropdownMenuButton1"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        Bulk Operation
                        <i
                          className="fa fa-angle-down down-arrow-right"
                          aria-hidden="true"
                        ></i>
                        <i
                          className="fa fa-angle-up up-arrow-right"
                          aria-hidden="true"
                        ></i>
                      </p>
                      <ul
                        className="dropdown-menu shadow rounded"
                        aria-labelledby="dropdownMenuButton1"
                      >
                        <li onClick={(e) => this.updateRulesStatus("Enabled")}>
                          Ads Creation
                        </li>
                        <li onClick={(e) => this.updateRulesStatus("Paused")}>
                          Add Targets
                        </li>
                        <li onClick={(e) => this.deleteRule()}> Add Tags</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </Col>
              <Col>
                <div className="filter-container">
                  <Row>
                    <Col md={12} className="padding-lr-10">
                      <div className="filter-item filter-link-container dropdownContent">
                        {/* <p
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
                        </p> */}
                        <div
                          className="dropdown-menu dropdown-menu-lg-end"
                          aria-labelledby="dropdownMenuButton1"
                        >
                          <ConditionFilter
                            parentCallback={this.handleCallback}
                            dropdownData={this.state.dropdownDatas}
                            metaData={""}
                          />
                        </div>
                      </div>

                      <div className="filter-item column-link-container dropdownContent">
                        {/* <p
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
                        </p> */}
                        <div
                          className="dropdown-menu dropdown-menu-lg-start"
                          aria-labelledby="dropdownMenuButton1"
                        >
                          <form>
                            <div className="set-max-height-400">
                              <ColumnFilter
                                columnList={this.state.dropdownDatas}
                              />
                            </div>
                            <hr />
                            <div className="footer">
                              <button type="button" className="btn btn-default">
                                Cancel
                              </button>
                              <button type="button" className="btn btn-primary">
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
                          <span>Export</span>
                        </p>
                      </div>
                      <div
                        className="filter-item export-link-container last"
                        data-bs-target="#addManageTags"
                        data-bs-toggle="modal"
                        data-bs-dismiss="modal"
                      >
                        <p>
                          <i>
                            <img src={TagIcon} alt="filter icon" />
                          </i>
                          <span>Manage Tags</span>
                        </p>
                      </div>
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>
          </div>
          <hr className="mt-2" />
          {this.state.listData.map((list: any, index) => (
            <div className="ads-container-row">
              <div className="ads-creation-list-container padding-lr-30">
                <Row>
                  <Col md={10}>
                    <div className="ads-creation-list-container-left">
                      <div className="ads-content-row  align-items-center">
                        <div>
                          <input type="checkbox" />
                        </div>
                        <div className="product-details width-300">
                          <div className="product-details-img">
                            <img src={list.bookCoverImage} alt="" />
                          </div>
                          <div className="product-details-cont">
                            <div className="product-title">{list.bookName}</div>
                            <div className="product-subtitle">
                              {list.asin}{" "}
                              <div className="bullet-point">{list.author}</div>
                            </div>
                          </div>
                        </div>
                        <div>
                          <div className="bookself-product-tags">
                            <button
                              className="add-tag"
                              data-bs-target="#addTagModel"
                              data-bs-toggle="modal"
                              data-bs-dismiss="modal"
                              onClick={(e) => this.getTagAsignValue(e)}
                              value={list.asin}
                            >
                              Add Tag
                            </button>
                            {list.tags.map((tags, index) => (
                              <span className="tags" key={index}>
                                {tags}
                                <button
                                  className="delete-tag-button"
                                  onClick={(e) =>
                                    this.removeClick(list.asin, tags)
                                  }
                                >
                                  <i />
                                </button>
                              </span>
                            ))}
                       
                          </div>
                        </div>
                        <hr />
                      </div>
                    </div>
                  </Col>
                  <Col>
                    <div className="ads-creation-list-container-right text-end justify-content-end align-items-center">
                      <button
                        className="btn btn-primary add-rules-btn mt-1"
                        onClick={(eve) =>
                          this.openCreateAdsModelPopup(list.asin, eve)
                        }
                      >
                        Create Ads
                      </button>
                      <div className="three-dot">
                        <img src={MoreActionDot} alt="" />
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
              <hr className="mt-2" />
              <div className="tab">
                <ul>
                  {list.adsCampaigns.map((campaign: any, i) => (
                    <li
                      className={
                        "campaign-region-tab-" +
                        list.id +
                        " " +
                        campaign.marketPlace +
                        " " +
                        (i === 0 ? "active " : "")
                      }
                      onClick={(ele) =>
                        this.handleRegionDisplay(
                          list.id,
                          campaign.marketPlace,
                          ele
                        )
                      }
                    >
                      <i className={"flag-" + campaign.marketPlace} />
                      {campaign.marketPlace}
                    </li>
                  ))}

                  <li className="advertise-anywhere">
                    <img src={GlobIcon} alt="" /> Advertise Elsewhere
                  </li>
                </ul>
                <div className="ads-rules-list-container">
                  {list.adsCampaigns.map((campaignRegions: any, i) => (
                    <div
                      className={
                        "accordion campaign-region-content-" +
                        list.id +
                        " " +
                        campaignRegions.marketPlace +
                        " " +
                        (i === 0 ? "active" : "")
                      }
                    >
                      <Row>
                        {this.campaignAdsRegionCampaings(
                          campaignRegions.campaigns,
                          list.asin
                        )}
                      </Row>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}

          <div className="custom-table-footer">
            <Row>
              <Col md={5}>
                <form className="table-footer-left">
                  <span>Show </span>
                  <label>
                    <select
                      className="form-select"
                      defaultValue={this.state.perPage}
                      onChange={(event) => this.applyDataLength(event)}
                    >
                      <option value="10">10</option>
                      <option value="50">50</option>
                      <option value="100">100</option>
                      <option value="150">150</option>
                      <option value="200">200</option>
                    </select>
                  </label>
                  <span> of {this.state.total} total entries</span>
                </form>
              </Col>
              <Col md={7}>
                <div className="table-footer-right">
                  <Stack spacing={2}>
                    <Pagination
                      count={this.state.lastPage}
                      variant="outlined"
                      shape="rounded"
                      defaultPage={this.state.currPage || 1}
                      onChange={this.handleChange}
                    />
                  </Stack>
                </div>
              </Col>
            </Row>
          </div>
        </div>
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
                    You will add this tag to the product that you have selected.
                  </p>

                  {/* <input
                    type="text"
                    className="form-control"
                    placeholder="add tag here"
                    value={tagText}
                    onChange={(e) => (e.target.value)}                  
                    //onClick={ }
                  /> */}
                  <input
                    type="text"
                    className="form-control"
                    placeholder="add tag here"
                    value={this.state.tagText}
                    //value={this.state.tagText}
                    //placeholder="add tag here"
                    //value={tagText}
                    onChange={(e) => this.addTagValue(e)}
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
                      className="addTagSave"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                      onClick={this.addDataTags}
                    >
                      Save
                    </button>
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        </div>
        <div
          className="modal createAdsModel"
          id="createAdsModelPopup"
          aria-hidden="true"
          aria-labelledby="exampleModalToggleLabel3"
        >
          <div className="modal-dialog ">
            <div className="modal-content addTagModel">
              <Row className="addTagInputContainer">
                <Col className="addTagModelContainers">
                  <h4>
                    Create Ads
                    <span
                      className="close-modal"
                      aria-label="Close"
                      onClick={this.closeModalPopUp}
                    >
                      x
                    </span>
                  </h4>
                  <p>You can choose auto campaign or manual campaign.</p>
                  <div
                    className="create-ads-modal-radio"
                    onClick={(eve) => this.redirectPage("auto", eve)}
                  >
                    Auto Campaign
                    <i className="radio-icon"></i>
                  </div>
                  <div
                    className="create-ads-modal-radio"
                    onClick={(eve) => this.redirectPage("manual", eve)}
                  >
                    Manual Campaign
                    <i className="radio-icon"></i>
                  </div>
                  <div className="createCampaindBtnContainer">
                    <button
                      className="btn btn-primary width-100p"
                      onClick={this.handleModelRedirectClick}
                    >
                      Create Ads
                    </button>
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        </div>
        <div
          className="modal fade"
          id="addManageTags"
          aria-hidden="true"
          aria-labelledby="exampleModalToggleLabel3"
        >
          <div className="modal-dialog ">
            <div className="modal-content addTagModels">
              <Row className="addTagInputContainer">
                <Col className="addTagModelContainers">
                  <h4>Add Tag</h4>
                  <p>
                    You will add this tag to the product that you have selected.
                  </p>
                  {manageTagsListEdit}
                  {/* <input
                    type="text"
                    className="form-control"
                    placeholder="add tag here"
                    value={tagText}
                    onChange={(e) => (e.target.value)}                  
                    //onClick={ }
                  /> */}
                  {/* <input
                    type="text"
                    className="form-control"
                    placeholder="add tag heres"
                    value={this.state.tagText}
                    //value={this.state.tagText}
                    //placeholder="add tag here"
                    //value={tagText}
                    onChange={(e) => this.addTagValue(e)}
                  /> */}

                  <div className="addTagBtnContainer">
                    <button
                      className="addTagCancell"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    >
                      Cancel
                    </button>
                    <button
                      className="addTagSave"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                      onClick={this.handleEditTags}
                    >
                      Save
                    </button>
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }
}

export default AdsCreations;
