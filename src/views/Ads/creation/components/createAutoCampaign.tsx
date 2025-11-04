/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from "react";
import { Routes, Route, useParams } from "react-router-dom";
import DashboardLayout from "../../../../layouts/DashboardLayout";
import { Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import "../index.css";
import LinkIcon from "../../../../assets/images/icons/link-icon.svg";
import BackArrow from "../../../../assets/images/icons/back-arrow-icon.svg";
import ThreeDots from "../../../../assets/images/icons/more-action-icon.svg";
import DeleteIcon from "../../../../assets/images/icons/trash-icon.svg";

import Moment from "moment";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

class CreateAutoCampaign extends Component {
  state = {
    isopen: false,
    portfolioData: [],
    marketPlacesList: [{ countryCode: "" }],
    createCampaignFormData: {
      asin: [],
      campaignName: "",
      adGroups: [
        {
          name: "",
        },
      ],
      targetingStrategy: "Auto Campaign",
      dynamicBidding: {
        defaultBid: 0,
        targetingBid: 0,
        close: 0,
        loose: 0,
        substitutes: 0,
        complements: 0,
        broad: 0,
        phrase: 0,
        exact: 0,
        product: 0,
      },
      negativeKeywordTargeting: {
        targetingType: "",
        keywords: [
          {
            type: "",
            keyword: "",
          },
        ],
      },
      campaignBiddingStrategy: "",
      settings: {
        portfolio: "",
        dailyBudget: "",
      },
      targets: null,
      postToAmazon: true,
      marketPlaces: ["US"],
    },
    adGroupsTemp: "",
    adGroups: [],
    adKeywordType: "",
    adKeywordsTemp: "",
    adKeywords: [],
    negativeKeywordTargeting: {},
    matchTypeSelect: false,
    matchTypeCheckedlist: [""],
    editTab: false,
    lastUpdatedDate: localStorage.getItem("lastUpdatedDate") || null,
  };
  componentDidMount() {
    const queryParams = window.location.pathname;
    let queryParamsArr = queryParams.split("/");
    const asin = queryParamsArr[4];
    const comapaignRuleId = queryParamsArr[5];
    if (comapaignRuleId) {
      let newFormEditObj: any = this.state.createCampaignFormData;
      newFormEditObj["id"] = queryParamsArr[5];
      console.log("Edit rule obj : ", newFormEditObj);
      this.setState({ createCampaignFormData: newFormEditObj });
      this.setState({ editTab: true });
      this.getCampainById(comapaignRuleId);
      this.getPortfolioData();
      this.getMarketplaceData();
    } else {
      this.setState({ editTab: false });
      console.log("createCamapaing Asin ID: ", asin);
      let newCreateCampaignFormData: any = this.state.createCampaignFormData;
      if (newCreateCampaignFormData.asin.length < 1) {
        newCreateCampaignFormData.asin.push(asin);
        this.setState({ newCreateCampaignFormData: newCreateCampaignFormData });
      }
      this.getPortfolioData();
      this.getMarketplaceData();
    }
  }
  getCampainById = async (id: any) => {
    console.log(id);

    let userToken = localStorage.getItem("userToken");
    let AuthToken = "Bearer " + userToken;
    let url = "https://api.aimosa.io/Campaign/" + id;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: AuthToken,
      },
    });

    try {
      const responceData = await response.json();
      this.setState({
        adKeywords: responceData.result.negativeKeywordTargeting.keywords,
      });
      // console.log("data"+responceData.result.adGroups[0].name);
      let newCreateCampaignFormData: any = this.state.createCampaignFormData;
      newCreateCampaignFormData.id = responceData.result.id;
      newCreateCampaignFormData.asin = responceData.result.asins;
      newCreateCampaignFormData.campaignName =
        responceData.result.campaignName.name;
      newCreateCampaignFormData.adGroups = responceData.result.adGroups;
      newCreateCampaignFormData.marketPlaces = responceData.result.marketPlaces;
      newCreateCampaignFormData.targetingStrategy =
        responceData.result.targetingStrategy;
      newCreateCampaignFormData.campaignBiddingStrategy =
        responceData.result.campaignBiddingStrategy;
      newCreateCampaignFormData.dynamicBidding.defaultBid =
        responceData.result.dynamicBidding.defaultBid;
      newCreateCampaignFormData.dynamicBidding.targetingBid =
        responceData.result.dynamicBidding.targetingBid;
      newCreateCampaignFormData.dynamicBidding.close =
        responceData.result.dynamicBidding.close;
      newCreateCampaignFormData.dynamicBidding.loose =
        responceData.result.dynamicBidding.loose;
      newCreateCampaignFormData.dynamicBidding.substitutes =
        responceData.result.dynamicBidding.substitutes;
      newCreateCampaignFormData.dynamicBidding.complements =
        responceData.result.dynamicBidding.complements;
      newCreateCampaignFormData.dynamicBidding.broad =
        responceData.result.dynamicBidding.broad;
      newCreateCampaignFormData.dynamicBidding.phrase =
        responceData.result.dynamicBidding.phrase;
      newCreateCampaignFormData.dynamicBidding.exact =
        responceData.result.dynamicBidding.exact;
      newCreateCampaignFormData.dynamicBidding.product =
        responceData.result.dynamicBidding.product;
      newCreateCampaignFormData.settings.dailyBudget =
        responceData.result.settings.dailyBudget;
      newCreateCampaignFormData.settings.portfolio =
        responceData.result.settings.portfolio;
      newCreateCampaignFormData.negativeKeywordTargeting.keywords =
        responceData.result.negativeKeywordTargeting.keywords;
      // newCreateCampaignFormData.negativeKeywordTargeting.keywords.keyword=responceData.result.negativeKeywordTargeting.keywords[0].keyword;
      newCreateCampaignFormData.negativeKeywordTargeting.targetingType =
        responceData.result.negativeKeywordTargeting.targetingType;

      this.setState({ newCreateCampaignFormData: newCreateCampaignFormData });
      // this.setState({ portfolioData: responceData.result });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  handleChange = (name, e) => {
    let newFormValues = this.state.createCampaignFormData;
    let genKey = name.split(".");
    if (genKey.length === 1) {
      newFormValues[genKey[0]] = e.target.value;
    }
    if (genKey.length === 2) {
      newFormValues[genKey[0]][genKey[1]] = e.target.value;
    }
    console.log("New Form Data: ", newFormValues);
    this.setState({ createCampaignFormData: newFormValues });
  };
  handleChangeDecimal = (name, e) => {
    let newFormValues = this.state.createCampaignFormData;
    let genKey = name.split(".");
    if (genKey.length === 1) {
      newFormValues[genKey[0]] = parseFloat(e.target.value);
    }
    if (genKey.length === 2) {
      newFormValues[genKey[0]][genKey[1]] = parseFloat(e.target.value);
    }
    console.log("New Form Data: ", newFormValues);
    this.setState({ createCampaignFormData: newFormValues });
  };
  addTempAdgroup = (e) => {
    this.setState({ adGroupsTemp: e.target.value });
  };
  adGroupsData = () => {
    this.setState({ isopen: !this.state.isopen });
    let newAdGroups: any = this.state.adGroups;
    let val = { name: this.state.adGroupsTemp };
    if (this.state.adGroupsTemp) {
      newAdGroups.push(val);
    }
    this.setState({ adGroups: newAdGroups });
    let newCreateCampaignFormData: any = this.state.createCampaignFormData;
    newCreateCampaignFormData.adGroups = newAdGroups;
    this.setState({ newCreateCampaignFormData: newCreateCampaignFormData });
    this.setState({ adGroupsTemp: "" });
  };
  addKeyWordType = (e) => {
    this.setState({ adKeywordType: e.target.value });
  };
  addTempAdKeywords = (e) => {
    this.setState({ adKeywordsTemp: e.target.value });
  };
  removeFormFields = (i) => {
    if (this.state.editTab == false) {
      let newFormValues = this.state.adKeywords;
      newFormValues.splice(i, 1);
      this.setState({ adKeywords: newFormValues });
      let newCreateCampaignFormData: any = this.state.createCampaignFormData;
      newCreateCampaignFormData.negativeKeywordTargeting.keywords =
        newFormValues;
      this.setState({ newCreateCampaignFormData: newCreateCampaignFormData });
    } else {
      let newFormValues = this.state.adKeywords;
      newFormValues.splice(i, 1);
      this.setState({ adKeywords: newFormValues });
      let newCreateCampaignFormData: any = this.state.createCampaignFormData;
      newCreateCampaignFormData.negativeKeywordTargeting.keywords =
        newFormValues;
      this.setState({ newCreateCampaignFormData: newCreateCampaignFormData });
    }
  };
  adkeyWordSubmit = () => {
    if (this.state.adKeywordsTemp) {
      let adKeywordsListStr = this.state.adKeywordsTemp;
      let newAdKeywords: any = this.state.adKeywords;
      let adKeywordsListArr = adKeywordsListStr.split(",");
      for (let i = 0; i < adKeywordsListArr.length; i++) {
        let val: any = {
          type: this.state.adKeywordType,
          keyword: adKeywordsListArr[i],
        };
        if (this.state.adKeywordsTemp) {
          newAdKeywords.push(val);
        }
        this.setState({ adGroups: newAdKeywords });
      }
      let newCreateCampaignFormData: any = this.state.createCampaignFormData;
      newCreateCampaignFormData.negativeKeywordTargeting.keywords =
        newAdKeywords;
      this.setState({ newCreateCampaignFormData: newCreateCampaignFormData });
      this.setState({ adKeywordsTemp: "" });
    }
  };
  removeAllAdkeyWords = () => {
    let newFormValues = this.setState({ adKeywords: [] });
    let newCreateCampaignFormData: any = this.state.createCampaignFormData;
    newCreateCampaignFormData.negativeKeywordTargeting.keywords = newFormValues;
    this.setState({ newCreateCampaignFormData: newCreateCampaignFormData });
  };
  getPortfolioData = async () => {
    let userToken = localStorage.getItem("userToken");
    let AuthToken = "Bearer " + userToken;
    let url = "https://api.aimosa.io/Campaign/Portfolios";
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: AuthToken,
      },
    });

    try {
      const responceData = await response.json();
      this.setState({ portfolioData: responceData.result });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  getMarketplaceData = async () => {
    let userToken = localStorage.getItem("userToken");
    let AuthToken = "Bearer " + userToken;
    let url = "https://api.aimosa.io/Campaign/Marketplaces";
    const requestOptions = {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        Authorization: AuthToken,
      },
      // body: JSON.stringify(this.state.createCampaignFormData),
    };

    try {
      const response = await fetch(url, requestOptions);
      const responceData = await response.json();
      if (responceData.success) {
        let result = responceData.result;
        this.setState({ marketPlacesList: result });
        console.error(result);
      } else {
        // toast("Unable to create");
      }
      // setRedirect("/onboarding");
    } catch (error) {
      console.error("Error fetching data:", error);
      // toast("Error On Creating");
    }
  };
  submitCreateCampaing = async () => {
    if (this.state.editTab == false) {
      let userToken = localStorage.getItem("userToken");
      let AuthToken = "Bearer " + userToken;
      let url = "https://api.aimosa.io/Campaign/Auto";
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: AuthToken,
        },
        body: JSON.stringify(this.state.createCampaignFormData),
      };

      try {
        const response = await fetch(url, requestOptions);
        const responceData = await response.json();
        if (responceData.success) {
          let result = responceData.result;
          console.error(result);
          toast("Successfully created");
        } else {
          toast("Unable to create");
        }
        // setRedirect("/onboarding");
      } catch (error) {
        console.error("Error fetching data:", error);
        toast("Error On Creating");
      }
    } else {
      let userToken = localStorage.getItem("userToken");
      let AuthToken = "Bearer " + userToken;
      let url = "https://api.aimosa.io/Campaign/Auto";
      const requestOptions = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: AuthToken,
        },
        body: JSON.stringify(this.state.createCampaignFormData),
      };

      try {
        const response = await fetch(url, requestOptions);
        const responceData = await response.json();
        console.log(responceData);

        if (responceData.success) {
          let result = responceData.result;
          console.error(result);
          toast("Successfully Updated");
        } else {
          toast("Unable to update");
        }
        // setRedirect("/onboarding");
      } catch (error) {
        console.error("Error fetching data:", error);
        toast("Error On Creating");
      }
    }
  };
  matchTypeSelectAllClick = (check) => {
    this.setState({ matchTypeSelect: check });
    let matchTypeChecklistArr = [
      "Close",
      "Loose",
      "Substitutes",
      "Complements",
    ];
    if (check) {
      this.setState({ matchTypeCheckedlist: matchTypeChecklistArr });
    } else {
      this.setState({ matchTypeCheckedlist: [] });
    }
  };
  matchTypeCheckBoxClick = (e) => {
    const ischecked = e.target.checked;
    const newSelectedList = this.state.matchTypeCheckedlist;
    if (ischecked === false) {
      const index = newSelectedList.indexOf(e.target.value);
      if (index > -1) {
        newSelectedList.splice(index, 1);
      }
      this.setState({ matchTypeCheckedlist: newSelectedList });
    } else {
      const newArray = this.state.matchTypeCheckedlist;
      newArray.push(e.target.value);
      this.setState({ matchTypeCheckedlist: newArray });
    }
  };
  matchTypeDelete = (name, e) => {
    e.target.parentElement.firstChild.value = "";
    let newFormValues = this.state.createCampaignFormData;
    let genKey = name.split(".");
    if (genKey.length === 1) {
      newFormValues[genKey[0]] = "";
    }
    if (genKey.length === 2) {
      newFormValues[genKey[0]][genKey[1]] = "";
    }
    console.log("Remove type Form Data: ", newFormValues);
    this.setState({ createCampaignFormData: newFormValues });
  };
  render() {
    const marketplaces = this.state.marketPlacesList.map((item, index) => (
      <div key={index} className="marketplace-item">
        {item.countryCode === "US" ? (
          <>
            <div className="d-flex align-items-center">
              <img
                src="https://cdn-icons-png.flaticon.com/512/323/323310.png"
                alt="US Flag"
                className="flag-icons"
              />
              &nbsp;
              {item.countryCode}
            </div>
          </>
        ) : item.countryCode === "CA" ? (
          <>
            <div className="d-flex align-items-center">
              <img
                src="https://cdn-icons-png.flaticon.com/512/197/197430.png"
                alt="US Flag"
                className="flag-icons"
              />
              &nbsp;
              {item.countryCode}
            </div>
          </>
        ) : item.countryCode === "ES" ? (
          <>
            <div className="d-flex align-items-center">
              <img
                src="https://cdn-icons-png.flaticon.com/512/197/197593.png"
                alt="US Flag"
                className="flag-icons"
              />
              &nbsp;
              {item.countryCode}
            </div>
          </>
        ) : item.countryCode === "FR" ? (
          <>
            <div className="d-flex align-items-center">
              <img
                src="https://cdn-icons-png.flaticon.com/512/197/197560.png"
                alt="US Flag"
                className="flag-icons"
              />
              &nbsp;
              {item.countryCode}
            </div>
          </>
        ) : item.countryCode === "DE" ? (
          <>
            <div className="d-flex align-items-center">
              <img
                src="https://cdn-icons-png.flaticon.com/512/197/197571.png"
                alt="US Flag"
                className="flag-icons"
              />
              &nbsp;
              {item.countryCode}
            </div>
          </>
        ) : item.countryCode === "IT" ? (
          <>
            <div className="d-flex align-items-center">
              <img
                src="https://cdn-icons-png.flaticon.com/512/323/323325.png"
                alt="US Flag"
                className="flag-icons"
              />
              &nbsp;
              {item.countryCode}
            </div>
          </>
        ) : item.countryCode === "AU" ? (
          <>
            <div className="d-flex align-items-center">
              <img
                src="https://cdn-icons-png.flaticon.com/512/323/323367.png"
                alt="US Flag"
                className="flag-icons"
              />
              &nbsp;
              {item.countryCode}
            </div>
          </>
        ) : (
          <> {item.countryCode}</>
        )}
      </div>
    ));
    return (
      <DashboardLayout>
        <div className="main-cont-header bookself-container">
          <Row className="page-header">
            <Col>
              <div className="main-con-page-title-container">
                <div className="back-arrow-container">
                  <Link to={"/ads/ads-creation"}>
                    <i>
                      <img src={BackArrow} alt="refresh icon" />
                    </i>
                    Back
                  </Link>
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
          <div className="create-campaign-container padding-lr-30">
            <h5>{this.state.editTab ? <>Edit</> : <>Add</>} Auto Campaign</h5>
            <p>
              Set dynamic campaign names. You can check the alternative
              placeholders{" "}
              <a>
                here.
                <div className="popup-custom-box">
                  <p>Alternative Placeholders:</p>
                  <ul>
                    <li>&#10100;ASIN&#10101;</li>
                    <li>&#10100;Layer&#10101;</li>
                    <li>&#10100;Match Type&#10101;</li>
                    <li>&#10100;Tag&#10101;</li>
                    <li>&#10100;Targeting Type&#10101;</li>
                  </ul>
                </div>
              </a>
            </p>
          </div>
          <div className="create-campaing-form padding-lr-30">
            <form>
              <div className="form-group col-md-8">
                <label>Campaign Name</label>
                <input
                  className="form-control"
                  name="createCampaignFormData.campaignName"
                  placeholder="{Layer} | {Targeting Type} | {Match Type} | {ASIN} | Romance Book 1"
                  onChange={(e) => this.handleChange("campaignName", e)}
                  defaultValue={this.state.createCampaignFormData.campaignName}
                />
              </div>
              <div className="form-group col-md-8">
                <label>Ad Group(s)</label>
                {/* <input
                  className="form-control"
                  name=""
                  placeholder="insert ad group name here"
                  onChange={(e) => this.addTempAdgroup(e)}
                  value={this.state.adGroupsTemp}
                /> */}
                {/* <div className="added-groups-list">
                  {this.state.adGroups.map((adGroup: any, i) => (
                    <div>
                      {adGroup.name}
                      <img src={ThreeDots} alt="" />
                    </div>
                  ))}
                </div> */}
                <div>
                  <button
                    type="button"
                    className="btn btn-outline mt-2"
                    onClick={(e) => this.adGroupsData()}
                  >
                    <div className="d-flex align-items-center">
                      Ad Group
                      <FontAwesomeIcon
                        icon={faPlus}
                        className="add-plus ms-1"
                      />
                    </div>
                  </button>
                </div>
              </div>
              {this.state.isopen ? (
                <div>
                  <Row>
                    <Col md={3}>
                      <div className="border-dashed-right">
                        <div className="form-group">
                          <label>Targeting Bid</label>
                          <input
                            className="form-control"
                            name=""
                            placeholder="0.00"
                            onChange={(e) =>
                              this.handleChangeDecimal(
                                "dynamicBidding.targetingBid",
                                e
                              )
                            }
                            value={
                              this.state.createCampaignFormData.dynamicBidding
                                .targetingBid
                            }
                          />
                        </div>
                        <div className="form-group">
                          <label>Default Bid</label>
                          <input
                            className="form-control"
                            name=""
                            placeholder="0.00"
                            onChange={(e) =>
                              this.handleChangeDecimal(
                                "dynamicBidding.defaultBid",
                                e
                              )
                            }
                            value={
                              this.state.createCampaignFormData.dynamicBidding
                                .defaultBid
                            }
                          />
                        </div>
                      </div>
                    </Col>
                    <Col md={5}>
                      <Row>
                        <Col md={12} className="mb-2">
                          <div className="select-deselect-container">
                            <label>Match Types</label>
                            <div className="select-deselect-all">
                              {!this.state.matchTypeSelect ? (
                                <span
                                  onClick={() =>
                                    this.matchTypeSelectAllClick(true)
                                  }
                                >
                                  Select All
                                </span>
                              ) : (
                                <span
                                  onClick={() =>
                                    this.matchTypeSelectAllClick(false)
                                  }
                                >
                                  Deselect All
                                </span>
                              )}
                            </div>
                          </div>
                        </Col>
                        <Col md={6}>
                          <div>
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                value="Close"
                                id="flexCheckIndeterminate1"
                                checked={this.state.matchTypeCheckedlist.includes(
                                  "Close"
                                )}
                                onChange={this.matchTypeCheckBoxClick}
                              />
                              <label
                                className="form-check-label"
                                htmlFor="flexCheckIndeterminate1"
                              >
                                Close
                              </label>
                            </div>
                            <div className="input-group mb-3">
                              <input
                                type="text"
                                className="form-control"
                                aria-label="Recipient's username"
                                aria-describedby="basic-addon2"
                                placeholder="0.00"
                                onChange={(e) =>
                                  this.handleChangeDecimal(
                                    "dynamicBidding.close",
                                    e
                                  )
                                }
                                value={
                                  this.state.createCampaignFormData
                                    .dynamicBidding.close
                                }
                              />
                              <span
                                className="input-group-text input-btn-close"
                                id="basic-addon2"
                                onClick={(e) =>
                                  this.matchTypeDelete(
                                    "dynamicBidding.close",
                                    e
                                  )
                                }
                              >
                                x
                              </span>
                            </div>
                          </div>
                        </Col>
                        <Col md={6}>
                          <div>
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                value="Loose"
                                id="flexCheckIndeterminate2"
                                checked={this.state.matchTypeCheckedlist.includes(
                                  "Loose"
                                )}
                                onChange={this.matchTypeCheckBoxClick}
                              />
                              <label
                                className="form-check-label"
                                htmlFor="flexCheckIndeterminate2"
                              >
                                Loose
                              </label>
                            </div>
                            <div className="input-group mb-3">
                              <input
                                type="text"
                                className="form-control"
                                aria-label="Recipient's username"
                                aria-describedby="basic-addon2"
                                placeholder="0.00"
                                onChange={(e) =>
                                  this.handleChangeDecimal(
                                    "dynamicBidding.loose",
                                    e
                                  )
                                }
                                value={
                                  this.state.createCampaignFormData
                                    .dynamicBidding.loose
                                }
                              />
                              <span
                                className="input-group-text input-btn-close"
                                id="basic-addon2"
                                onClick={(e) =>
                                  this.matchTypeDelete(
                                    "dynamicBidding.loose",
                                    e
                                  )
                                }
                              >
                                x
                              </span>
                            </div>
                          </div>
                        </Col>
                        <Col md={6}>
                          <div>
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                value="Substitutes"
                                id="flexCheckIndeterminate3"
                                checked={this.state.matchTypeCheckedlist.includes(
                                  "Substitutes"
                                )}
                                onChange={this.matchTypeCheckBoxClick}
                              />
                              <label
                                className="form-check-label"
                                htmlFor="flexCheckIndeterminate3"
                              >
                                Substitutes
                              </label>
                            </div>
                            <div className="input-group mb-3">
                              <input
                                type="text"
                                className="form-control"
                                aria-label="Recipient's username"
                                aria-describedby="basic-addon2"
                                placeholder="0.00"
                                onChange={(e) =>
                                  this.handleChangeDecimal(
                                    "dynamicBidding.substitutes",
                                    e
                                  )
                                }
                                value={
                                  this.state.createCampaignFormData
                                    .dynamicBidding.substitutes
                                }
                              />
                              <span
                                className="input-group-text input-btn-close"
                                id="basic-addon2"
                                onClick={(e) =>
                                  this.matchTypeDelete(
                                    "dynamicBidding.substitutes",
                                    e
                                  )
                                }
                              >
                                x
                              </span>
                            </div>
                          </div>
                        </Col>
                        <Col md={6}>
                          <div>
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                value="Complements"
                                id="flexCheckIndeterminate4"
                                checked={this.state.matchTypeCheckedlist.includes(
                                  "Complements"
                                )}
                                onChange={this.matchTypeCheckBoxClick}
                              />
                              <label
                                className="form-check-label"
                                htmlFor="flexCheckIndeterminate4"
                              >
                                Complements
                              </label>
                            </div>
                            <div className="input-group mb-3">
                              <input
                                type="text"
                                className="form-control"
                                aria-label="Recipient's username"
                                aria-describedby="basic-addon2"
                                placeholder="0.00"
                                onChange={(e) =>
                                  this.handleChangeDecimal(
                                    "dynamicBidding.complements",
                                    e
                                  )
                                }
                                value={
                                  this.state.createCampaignFormData
                                    .dynamicBidding.complements
                                }
                              />
                              <span
                                className="input-group-text input-btn-close"
                                id="basic-addon2"
                                onClick={(e) =>
                                  this.matchTypeDelete(
                                    "dynamicBidding.complements",
                                    e
                                  )
                                }
                              >
                                x
                              </span>
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </div>
              ) : (
                <div>
                  <Row>
                    <Col md={8}>
                      <div className="marketplaces-id">{marketplaces}</div>
                    </Col>
                  </Row>
                </div>
              )}
              <div className="mt-3">
                <Row>
                  <Col md={4}>
                    <div>
                      <label>Set Level</label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="level"
                        id="inlineRadio1"
                        value="Campaign level"
                        checked={
                          this.state.createCampaignFormData
                            .negativeKeywordTargeting.targetingType ==
                          "Campaign level"
                        }
                        onChange={(e) =>
                          this.handleChange(
                            "negativeKeywordTargeting.targetingType",
                            e
                          )
                        }
                      />
                      <label
                        className="form-check-label"
                        htmlFor="inlineRadio1"
                      >
                        Campaign level
                      </label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="level"
                        id="inlineRadio2"
                        value="Ad group level"
                        checked={
                          this.state.createCampaignFormData
                            .negativeKeywordTargeting.targetingType ==
                          "Ad group level"
                        }
                        onChange={(e) =>
                          this.handleChange(
                            "negativeKeywordTargeting.targetingType",
                            e
                          )
                        }
                      />
                      <label
                        className="form-check-label"
                        htmlFor="inlineRadio2"
                      >
                        Ad group level
                      </label>
                    </div>
                  </Col>
                  <Col md={4}>
                    <div>
                      <label>Negative Keyword Targeting</label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="negativeKeyword"
                        id="inlineRadio3"
                        value="Negative exact"
                        // checked={this.state.createCampaignFormData.negativeKeywordTargeting.keywords[0].type=="Negative exact"}
                        onChange={(e) => this.addKeyWordType(e)}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="inlineRadio3"
                      >
                        Negative exact
                      </label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="negativeKeyword"
                        id="inlineRadio4"
                        value="Negative phrase"
                        // checked={this.state.createCampaignFormData.negativeKeywordTargeting.keywords[0].type=="Negative phrase"}
                        onChange={(e) => this.addKeyWordType(e)}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="inlineRadio4"
                      >
                        Negative phrase
                      </label>
                    </div>
                  </Col>
                  <Col md={8}>
                    <div className="add-keyword-container">
                      <textarea
                        name=""
                        id="addKeywordsText"
                        className="form-control mb-3"
                        onChange={(e) => this.addTempAdKeywords(e)}
                        value={this.state.adKeywordsTemp}
                      ></textarea>
                      <button
                        type="button"
                        className="btn btn-outline mb-2 add-keyword-btn"
                        onClick={(e) => this.adkeyWordSubmit()}
                        disabled={!this.state.adKeywordType}
                      >
                        Add Keyword
                      </button>
                    </div>
                  </Col>
                  <Col md={8}>
                    <div className="table-responsive">
                      <table className="table">
                        <thead>
                          <tr>
                            <th>Keyword</th>
                            <th>Match Type</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {this.state.adKeywords.map((adKeyword: any, i) => (
                            <tr>
                              <td>{adKeyword.keyword}</td>
                              <td>{adKeyword.type}</td>
                              <td className="text-center more-action">
                                <i onClick={() => this.removeFormFields(i)}>
                                  <img src={DeleteIcon} alt="" />
                                </i>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <Row>
                      <Col>
                        <p>{this.state.adKeywords.length} keyword added</p>
                      </Col>
                      <Col className="text-end remove-all-link">
                        <span onClick={this.removeAllAdkeyWords}>
                          Remove All
                        </span>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </div>
              <div>
                <Row>
                  <Col md={10}>
                    <label>Settings</label>
                  </Col>
                  <Col md={4}>
                    <div>
                      <label>Campaign Bidding Strategy</label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="flexRadioDefault"
                        id="flexRadioDefault1"
                        onChange={(e) =>
                          this.handleChange("campaignBiddingStrategy", e)
                        }
                        checked={
                          this.state.createCampaignFormData
                            .campaignBiddingStrategy == "Down only"
                        }
                        value={"Down only"}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="flexRadioDefault1"
                      >
                        Down only
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="flexRadioDefault"
                        id="flexRadioDefault2"
                        onChange={(e) =>
                          this.handleChange("campaignBiddingStrategy", e)
                        }
                        checked={
                          this.state.createCampaignFormData
                            .campaignBiddingStrategy == "Up & Down"
                        }
                        value={"Up & Down"}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="flexRadioDefault2"
                      >
                        Up & Down
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="flexRadioDefault"
                        id="flexRadioDefault2"
                        onChange={(e) =>
                          this.handleChange("campaignBiddingStrategy", e)
                        }
                        checked={
                          this.state.createCampaignFormData
                            .campaignBiddingStrategy == "Fixed"
                        }
                        value={"Fixed"}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="flexRadioDefault2"
                      >
                        Fixed
                      </label>
                    </div>
                  </Col>
                  <Col md={4}>
                    <div>
                      <label htmlFor="basic-url" className="form-label">
                        Daily Budget
                      </label>
                      <div className="input-group mb-3">
                        <span className="input-group-text" id="basic-addon1">
                          $
                        </span>
                        <input
                          type="text"
                          className="form-control"
                          defaultValue={""}
                          aria-label="Username"
                          placeholder="0.00"
                          aria-describedby="basic-addon1"
                          value={
                            this.state.createCampaignFormData.settings
                              .dailyBudget
                          }
                          onChange={(e) =>
                            this.handleChangeDecimal("settings.dailyBudget", e)
                          }
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="basic-url" className="form-label">
                        Portfolio
                      </label>
                      <select
                        className="form-select"
                        aria-label="Default select example"
                        onChange={(e) =>
                          this.handleChange("settings.portfolio", e)
                        }
                        defaultValue={""}
                        value={
                          this.state.createCampaignFormData.settings.portfolio
                        }
                      >
                        <option value="">Choose Portfolio</option>
                        {this.state.portfolioData.map((list: any, i) => (
                          <option value={list.name}>{list.name}</option>
                        ))}
                      </select>
                    </div>
                  </Col>
                </Row>
              </div>
            </form>
          </div>
          <hr />
          <div className="form-button-group">
            <Link to={"/ads/ads-creation"} className="btn btn-outline-primary">
              Back
            </Link>
            <button
              className="btn btn-primary"
              type="submit"
              onClick={this.submitCreateCampaing}
            >
              Save Changes
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }
}

export default CreateAutoCampaign;
