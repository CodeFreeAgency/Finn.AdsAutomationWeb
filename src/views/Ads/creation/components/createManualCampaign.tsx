/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from "react";
import { Routes, Route, useParams } from 'react-router-dom';
import DashboardLayout from "../../../../layouts/DashboardLayout";
import { Row, Col } from "react-bootstrap";
import "../index.css";

import LinkIcon from "../../../../assets/images/icons/link-icon.svg";
import BackArrow from "../../../../assets/images/icons/back-arrow-icon.svg";
import ThreeDots from "../../../../assets/images/icons/more-action-icon.svg";
import DeleteIcon from "../../../../assets/images/icons/trash-icon.svg";

import Moment from 'moment';
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

class CreateManualCampaign extends Component {
  state = {
    portfolioData: [],
    createCampaignFormData : {asin:[], campaignName:"",adGroups:[], targetingStrategy: "Auto Campaign",dynamicBidding:{},negativeKeywordTargeting:{targetingType: "", keywords: []}, campaignBiddingStrategy: "", settings: {},"targets": null,
    postToAmazon: true,
    marketPlaces: ["US"]},
    adGroupsTemp: "",
    adGroups: [],
    adKeywordType: "",
    adKeywordsTemp: "",
    adKeywords: [],
    negativeKeywordTargeting: {},
    matchTypeSelect : false,
    matchTypeCheckedlist : [""]
  }
  componentDidMount() {
    const queryParams = window.location.pathname;
    let queryParamsArr = queryParams.split("/");
    const asin = queryParamsArr[4];
    console.log("createCamapaing Asin ID: ", asin)
    let newCreateCampaignFormData:any = this.state.createCampaignFormData;
    if(newCreateCampaignFormData.asin.length < 1){
      newCreateCampaignFormData.asin.push(asin);
      this.setState({newCreateCampaignFormData: newCreateCampaignFormData});
    }
    this.getPortfolioData ();
  }

  handleChange = (name, e) => {
    let newFormValues = this.state.createCampaignFormData;
    let genKey = name.split(".");
    if(genKey.length === 1){
      newFormValues[genKey[0]] = e.target.value;
    }
    if(genKey.length === 2){
      newFormValues[genKey[0]][genKey[1]] = e.target.value;
    }
    console.log("New Form Data: ",newFormValues);
    this.setState({createCampaignFormData: newFormValues});
  }
  handleChangeDecimal = (name, e) => {
    let newFormValues = this.state.createCampaignFormData;
    let genKey = name.split(".");
    if(genKey.length === 1){
      newFormValues[genKey[0]] = parseFloat(e.target.value);
    }
    if(genKey.length === 2){
      newFormValues[genKey[0]][genKey[1]] = parseFloat(e.target.value);
    }
    console.log("New Form Data: ",newFormValues);
    this.setState({createCampaignFormData: newFormValues});
  }
  addTempAdgroup = (e) => {
    this.setState({adGroupsTemp: e.target.value})
  }
  adGroupsData = () => {
    let newAdGroups:any = this.state.adGroups;
    let val = {"name": this.state.adGroupsTemp};
    if(this.state.adGroupsTemp){
      newAdGroups.push(val);
    }
    this.setState({adGroups: newAdGroups});
    let newCreateCampaignFormData:any = this.state.createCampaignFormData;
    newCreateCampaignFormData.adGroups = newAdGroups;
    this.setState({newCreateCampaignFormData: newCreateCampaignFormData})
    this.setState({adGroupsTemp: ""});
  }
  addKeyWordType = (e) => {
    this.setState({adKeywordType: e.target.value})
  }
  addTempAdKeywords = (e) => {
    this.setState({adKeywordsTemp: e.target.value})
  }
  removeFormFields = (i) => {
    let newFormValues = this.state.adKeywords;
    newFormValues.splice(i, 1);
    this.setState({adKeywords: newFormValues});
    let newCreateCampaignFormData:any = this.state.createCampaignFormData;
    newCreateCampaignFormData.negativeKeywordTargeting.keywords = newFormValues;
    this.setState({newCreateCampaignFormData: newCreateCampaignFormData});
  }
  adkeyWordSubmit = () => {
    if(this.state.adKeywordsTemp){
      let adKeywordsListStr = this.state.adKeywordsTemp;
      let newAdKeywords:any = this.state.adKeywords;
      let adKeywordsListArr =  adKeywordsListStr.split(",");
      for(let i =0; i < adKeywordsListArr.length; i++){
        let val:any = {"type": this.state.adKeywordType, "keyword": adKeywordsListArr[i]};
        if(this.state.adKeywordsTemp){
          newAdKeywords.push(val);
        }
        this.setState({adGroups: newAdKeywords});
      }
      let newCreateCampaignFormData:any = this.state.createCampaignFormData;
      newCreateCampaignFormData.negativeKeywordTargeting.keywords = newAdKeywords;
      this.setState({newCreateCampaignFormData: newCreateCampaignFormData});
      this.setState({adKeywordsTemp: ""});
    }
  }
  removeAllAdkeyWords = () => {
    let newFormValues = this.setState({adKeywords: []});
    let newCreateCampaignFormData:any = this.state.createCampaignFormData;
    newCreateCampaignFormData.negativeKeywordTargeting.keywords = newFormValues;
    this.setState({newCreateCampaignFormData: newCreateCampaignFormData});
  }
  getPortfolioData = async () => {
    let userToken = localStorage.getItem('userToken')
    let AuthToken = "Bearer " + userToken;
    let url = "https://api.aimosa.io/Campaign/Portfolios";
    const response = await fetch(
      url,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: AuthToken,
        },
      }
    );

    try {
      const responceData = await response.json();
      this.setState({portfolioData: responceData.result });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  submitCreateCampaing = async () => {
    let userToken = localStorage.getItem('userToken')
    let AuthToken = "Bearer " + userToken;
    let url = "https://api.aimosa.io/Campaign/Manual";
    const requestOptions = {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': AuthToken
      },
      body: JSON.stringify(this.state.createCampaignFormData),
    };

    try {
      const response = await fetch(url, requestOptions);
      const responceData = await response.json();
      if(responceData.success){
        let result = responceData.result;
        console.error(result);
        toast("Successfully created");
      } else {
        toast("Unable to create");
      }
      // setRedirect("/onboarding");
    } catch (error) {
      console.error('Error fetching data:', error);
      toast("Error On Creating");
    }
  };
  matchTypeSelectAllClick = (check) =>{
    this.setState({matchTypeSelect: check});
    let matchTypeChecklistArr = ['Product', 'Broad', 'Phrase', 'Exact'];
    if(check){
      this.setState({matchTypeCheckedlist: matchTypeChecklistArr});
    } else {
      this.setState({matchTypeCheckedlist: []});
    }
  }
  matchTypeCheckBoxClick = (e) =>{
    const ischecked = e.target.checked;
    const newSelectedList = this.state.matchTypeCheckedlist;
    if (ischecked === false) {
      const index = newSelectedList.indexOf(e.target.value);
      if (index > -1) {
        newSelectedList.splice(index, 1);
      }
      this.setState({matchTypeCheckedlist:newSelectedList});
    } else {
      const newArray = this.state.matchTypeCheckedlist;
      newArray.push(e.target.value);
      this.setState({matchTypeCheckedlist:newArray});
    }
  }
  matchTypeDelete = (name,e) => {
    e.target.parentElement.firstChild.value = "";
    let newFormValues = this.state.createCampaignFormData;
    let genKey = name.split(".");
    if(genKey.length === 1){ newFormValues[genKey[0]] = ""; }
    if(genKey.length === 2){ newFormValues[genKey[0]][genKey[1]] = ""; }
    console.log("Remove type Form Data: ",newFormValues);
    this.setState({createCampaignFormData: newFormValues});
  }
  render() {
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
              <span>
                <i>
                  <img src={LinkIcon} alt="refresh icon" />
                </i>
                Last App Sync
              </span>
              <span className="time-summery">Wed, Nov 2, 10:57</span>
            </Col>
            
          </Row>
        </div>
        <div className="main-content-container">
          <hr />
          <div className="create-campaign-container padding-lr-30">
            <h5>Add Manual Campaign</h5>
            <p>Set dynamic campaign names. You can check the alternative placeholders <a>here.
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
              </a></p>
            
          </div>
          <div className="create-campaing-form padding-lr-30">
            <form>
              <div className="form-group col-md-8">
                <label>Campaign Name</label>
                <input className="form-control" name="createCampaignFormData.campaignName" placeholder="{Layer} | {Targeting Type} | {Match Type} | {ASIN} | Romance Book 1" onChange={e => this.handleChange("campaignName", e)} defaultValue={this.state.createCampaignFormData.campaignName} />
              </div>
              <div className="form-group col-md-8">
                <label>Ad Group Name</label>
                <input className="form-control" name="" placeholder="insert ad group name here" onChange={e => this.addTempAdgroup(e)} value={this.state.adGroupsTemp}/>
                <div className="added-groups-list">
                  
                  {this.state.adGroups.map((adGroup:any, i) => (
                    <div>
                    {adGroup.name}
                    <img src={ThreeDots} alt="" />
                  </div>))}
                </div>
                <div>
                  <button type="button" className="btn btn-outline mt-2" onClick={e => this.adGroupsData()}>Add Another Ad Group</button>
                </div>
              </div>
              <div>
                <Row>
                  <Col md={3}>
                    <div className="border-dashed-right">
                      <div className="form-group">
                        <label>Targeting Bid</label>
                        <input className="form-control" name="" placeholder="0.00" onChange={e => this.handleChangeDecimal("dynamicBidding.targetingBid", e)} />
                      </div>
                      <div className="form-group">
                        <label>Default Bid</label>
                        <input className="form-control" name="" placeholder="0.00" onChange={e => this.handleChangeDecimal("dynamicBidding.defaultBid", e)} />
                      </div>
                    </div>
                  </Col>
                  <Col md={5}>
                    <Row>
                      <Col md={12} className="mb-2">
                        <div className="select-deselect-container">
                          <label>Match Types</label>
                          <div className="select-deselect-all">
                            {!this.state.matchTypeSelect?
                              <span onClick={()=>this.matchTypeSelectAllClick(true)}>Select All</span> :
                              <span onClick={()=>this.matchTypeSelectAllClick(false)}>Deselect All</span>
                            }
                          </div>
                        </div>
                      </Col>
                      <Col md={6}>
                        <div>
                          <div className="form-check">
                            <input className="form-check-input" type="checkbox" value="Product" id="flexCheckIndeterminate1" checked={this.state.matchTypeCheckedlist.includes("Product")} onChange={this.matchTypeCheckBoxClick} />
                            <label className="form-check-label" htmlFor="flexCheckIndeterminate1">
                            Product
                            </label>
                          </div>
                          <div className="input-group mb-3">
                            <input type="text" className="form-control" aria-label="Recipient's username" aria-describedby="basic-addon2" placeholder="0.00" onChange={e => this.handleChangeDecimal("dynamicBidding.product", e)} />
                            <span className="input-group-text input-btn-close" id="basic-addon2" onClick={(e)=>this.matchTypeDelete("dynamicBidding.product",e)}>x</span>
                          </div>
                        </div>
                      </Col>
                      <Col md={6}>
                        <div>
                          <div className="form-check">
                            <input className="form-check-input" type="checkbox" value="Broad" id="flexCheckIndeterminate2" checked={this.state.matchTypeCheckedlist.includes("Broad")} onChange={this.matchTypeCheckBoxClick} />
                            <label className="form-check-label" htmlFor="flexCheckIndeterminate2">
                            Broad
                            </label>
                          </div>
                          <div className="input-group mb-3">
                            <input type="text" className="form-control" aria-label="Recipient's username" aria-describedby="basic-addon2" placeholder="0.00" onChange={e => this.handleChangeDecimal("dynamicBidding.broad", e)} />
                            <span className="input-group-text input-btn-close" id="basic-addon2" onClick={(e)=>this.matchTypeDelete("dynamicBidding.broad",e)}>x</span>
                          </div>
                        </div>
                      </Col>
                      <Col md={6}>
                        <div>
                          <div className="form-check">
                            <input className="form-check-input" type="checkbox" value="Phrase" id="flexCheckIndeterminate3" checked={this.state.matchTypeCheckedlist.includes("Phrase")} onChange={this.matchTypeCheckBoxClick} />
                            <label className="form-check-label" htmlFor="flexCheckIndeterminate3">
                            Phrase
                            </label>
                          </div>
                          <div className="input-group mb-3">
                            <input type="text" className="form-control" aria-label="Recipient's username" aria-describedby="basic-addon2" placeholder="0.00" onChange={e => this.handleChangeDecimal("dynamicBidding.phrase", e)} />
                            <span className="input-group-text input-btn-close" id="basic-addon2" onClick={(e)=>this.matchTypeDelete("dynamicBidding.phrase",e)}>x</span>
                          </div>
                        </div>
                      </Col>
                      <Col md={6}>
                        <div>
                          <div className="form-check">
                            <input className="form-check-input" type="checkbox" value="Exact" id="flexCheckIndeterminate4" checked={this.state.matchTypeCheckedlist.includes("Exact")} onChange={this.matchTypeCheckBoxClick} />
                            <label className="form-check-label" htmlFor="flexCheckIndeterminate4">
                            Exact
                            </label>
                          </div>
                          <div className="input-group mb-3">
                            <input type="text" className="form-control" aria-label="Recipient's username" aria-describedby="basic-addon2" placeholder="0.00" onChange={e => this.handleChangeDecimal("dynamicBidding.exact", e)} />
                            <span className="input-group-text input-btn-close" id="basic-addon2" onClick={(e)=>this.matchTypeDelete("dynamicBidding.exact",e)}>x</span>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </div>
              <div className="mt-3">
                <Row>
                  <Col md={4}>
                    <div><label>Set Level</label></div>
                    <div className="form-check form-check-inline">
                      <input className="form-check-input" type="radio" name="level" id="inlineRadio1" value="Campaign level" onChange={e => this.handleChange("negativeKeywordTargeting.targetingType", e)} />
                      <label className="form-check-label" htmlFor="inlineRadio1">Campaign level</label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input className="form-check-input" type="radio" name="level" id="inlineRadio2" value="Ad group level" onChange={e => this.handleChange("negativeKeywordTargeting.targetingType", e)} />
                      <label className="form-check-label" htmlFor="inlineRadio2">Ad group level</label>
                    </div>
                  </Col>
                  <Col md={4}>
                    <div><label>Negative Keyword Targeting</label></div>
                    <div className="form-check form-check-inline">
                      <input className="form-check-input" type="radio" name="negativeKeyword" id="inlineRadio3" value="Negative exact" onChange={e => this.addKeyWordType(e)} />
                      <label className="form-check-label" htmlFor="inlineRadio3">Negative exact</label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input className="form-check-input" type="radio" name="negativeKeyword" id="inlineRadio4" value="Negative phrase" onChange={e => this.addKeyWordType(e)} />
                      <label className="form-check-label" htmlFor="inlineRadio4">Negative phrase</label>
                    </div>
                  </Col>
                  <Col md={8}>
                    <div className="add-keyword-container">
                      <textarea name="" id="addKeywordsText" className="form-control mb-3" onChange={e => this.addTempAdKeywords(e)} value={this.state.adKeywordsTemp}></textarea>
                      <button type="button" className="btn btn-outline mb-2 add-keyword-btn" onClick={e => this.adkeyWordSubmit()} disabled={!this.state.adKeywordType}>Add Keyword</button>
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
                          {this.state.adKeywords.map((adKeyword:any, i) => (
                            <tr>
                              <td>{adKeyword.keyword}</td>
                              <td>{adKeyword.type}</td>
                              <td className="text-center more-action"><i  onClick={() => this.removeFormFields(i)}><img src={DeleteIcon} alt="" /></i></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <Row>
                      <Col><p>{this.state.adKeywords.length} keyword added</p></Col>
                      <Col className="text-end remove-all-link"><span onClick={this.removeAllAdkeyWords}>Remove All</span></Col>
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
                    <div><label>Campaign Bidding Strategy</label></div>
                    <div className="form-check">
                      <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" onChange={e => this.handleChange("campaignBiddingStrategy", e)} value={"Down only"} />
                      <label className="form-check-label" htmlFor="flexRadioDefault1">
                        Down only
                      </label>
                    </div>
                    <div className="form-check">
                      <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" onChange={e => this.handleChange("campaignBiddingStrategy", e)} value={"Up & Down"} />
                      <label className="form-check-label" htmlFor="flexRadioDefault2">
                        Up & Down
                      </label>
                    </div>
                    <div className="form-check">
                      <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" onChange={e => this.handleChange("campaignBiddingStrategy", e)} value={"Fixed"} />
                      <label className="form-check-label" htmlFor="flexRadioDefault2">
                      Fixed
                      </label>
                    </div>
                  </Col>
                  <Col md={4}>
                    <div>
                      <label htmlFor="basic-url" className="form-label">Daily Budget</label>
                      <div className="input-group mb-3">
                        <span className="input-group-text" id="basic-addon1">$</span>
                        <input type="text" className="form-control" defaultValue={""} aria-label="Username" placeholder="0.00" aria-describedby="basic-addon1" onChange={e => this.handleChangeDecimal("settings.dailyBudget", e)} />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="basic-url" className="form-label">Portfolio</label>
                      <select className="form-select" aria-label="Default select example" onChange={e => this.handleChange("settings.portfolio", e)} defaultValue={""}>
                        <option value="">Choose Portfolio</option>
                        {this.state.portfolioData.map( (list:any, i) =>
                            <option value={list.name}>{list.name}</option>
                        )}
                      </select>
                    </div>
                  </Col>
                </Row>
              </div>
            </form>
          </div>
          <hr />
          <div className="form-button-group">
            <Link to={"/ads/ads-creation"} className="btn btn-outline-primary">Back</Link>
            <button className="btn btn-primary" type="submit" onClick={this.submitCreateCampaing}>Save Changes</button>
          </div>
        </div>
      </DashboardLayout>
    );
  }
}

export default CreateManualCampaign;