import React, { Component, SyntheticEvent } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { Row, Col } from "react-bootstrap";
import "./index.css";
import { DateRangePicker } from "rsuite";
import isAfter from "date-fns/isAfter";
import Moment from "moment";

import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";

// === Import Tables ===
import MarketplaceTable from "./table/marketplace-table";
import AdGroupTable from "./table/adgroup-table";
import CampaignTable from "./table/campaign-table";
import PortfoliosTable from "./table/portfolio-table";
import ProductsTable from "./table/products-table";
import TargetingTable from "./table/targeting-table";

//  Define your own DateRange type
type DateRange = [Date, Date];

// === Props Interface ===
interface ResultProps {
  searchResult: string;
}

// === State Interface ===
interface State {
  globalFilterFromData: any[];
  searchKeyFilter: string;
  globalFilterDateRange: DateRange;
  metaData: any[];
  lastUpdatedDate: string | null;
  selectedAccount: string;
  activeTab: string;
  selectedProfile: "SP" | "SB" | "SD";
  cachedData: Record<string, any[]>; // e.g. { SP: [...], SB: [...], SD: [...] }
}

class AdsCompaignManager extends Component<ResultProps, State> {
  current = new Date();
  startDate = new Date(this.current.setDate(this.current.getDate() - 30));
  endDate = new Date();

  constructor(props: ResultProps) {
    super(props);
    this.state = {
      globalFilterFromData: [],
      searchKeyFilter: "",
      globalFilterDateRange: [this.startDate, this.endDate],
      metaData: [],
      lastUpdatedDate: localStorage.getItem("lastUpdatedDate") || null,
      selectedAccount: "",
      activeTab: "marketplace",
      selectedProfile: "SP",
      cachedData: {},
    };
  }

  componentDidMount() {
    const accountId = localStorage.getItem("account");
    this.getMetaData();

    this.setState({
      selectedAccount: this.props.searchResult || accountId || "",
    });
  }

  componentDidUpdate(prevProps: ResultProps) {
    if (this.props.searchResult !== prevProps.searchResult) {
      this.setState({ selectedAccount: this.props.searchResult });
    }
  }

  /** === Fetch Metadata === */
  getMetaData = async (): Promise<void> => {
    try {
      const userToken = localStorage.getItem("userToken");
      const AuthToken = "Bearer " + userToken;

      const response = await fetch("https://finnapi.sellingpartnerservices.com/MasterData/meta", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: AuthToken,
        },
      });

      const responseData = await response.json();
      this.setState({ metaData: responseData.result || [] });
    } catch (error) {
      console.error("Error fetching metadata:", error);
    }
  };

  /** === Handle Date Range Change === */
  onChangeDateRangeSubmitGlobal = (
    value: DateRange | null,
    _event?: SyntheticEvent<Element, Event>
  ): void => {
    if (value && value.length === 2) {
      this.setState({ globalFilterDateRange: value });
    }
  };

  /** === Handle SP/SB/SD Change === */
  handleProfileChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    const newProfile = e.target.value as "SP" | "SB" | "SD";
    this.setState({ selectedProfile: newProfile });
  };

  /** === Cache Table Data from Child Tables === */
  handleTableCache = (profileKey: string, data: any[]): void => {
    this.setState((prevState) => ({
      cachedData: {
        ...prevState.cachedData,
        [profileKey]: data,
      },
    }));
  };

  /** === Handle Tab Switching === */
  handleTabChange = (tabKey: string | null): void => {
    if (tabKey) this.setState({ activeTab: tabKey });
  };

  render() {
    const {
      globalFilterFromData,
      searchKeyFilter,
      globalFilterDateRange,
      metaData,
      selectedAccount,
      selectedProfile,
      activeTab,
      cachedData,
    } = this.state;

    return (
      <DashboardLayout>
        <div className="main-cont-header">
          <Row className="page-header">
            <Col sm={12}>
              <div className="main-con-page-title-container p-2">
                <div className="title">
                  <h3 className="page-title">Campaign Manager</h3>
                </div>

                {/* === Date Range Picker === */}
                <div className="filters">
                  <DateRangePicker
                    className="pager-title"
                    placeholder="Select Date Range"
                    onChange={this.onChangeDateRangeSubmitGlobal}
                    format="yyyy-MM-dd"
                    disabledDate={(date) => isAfter(date, new Date())}
                    defaultValue={[this.startDate, new Date()]}
                  />
                </div>

                {/* === SP/SB/SD Dropdown === */}
                <div className="accounts ms-2 page-title">
                  <select
                    className="form-select"
                    name="accountSelect"
                    id="accountSelect"
                    value={selectedProfile}
                    onChange={this.handleProfileChange}
                  >
                    <option value="SP">Sponsored Product</option>
                    <option value="SB">Sponsored Brand</option>
                    <option value="SD">Sponsored Display</option>
                  </select>
                </div>
              </div>
            </Col>
          </Row>
        </div>

        {/* === Tabs Section === */}
        <div className="main-content-container mt-4">
          <hr />
          <div className="dashboard-container padding-lr-30 campaing-manger">
            <div className="tab-container">
              <Tabs
                defaultActiveKey="marketplace"
                activeKey={activeTab}
                onSelect={this.handleTabChange}
              >
                {/* === Summary Tab === */}
                <Tab eventKey="marketplace" title="Summary">
                  {activeTab === "marketplace" && (
                    <MarketplaceTable
                      checkBox={false}
                      tabName="Marketplaces"
                      filterData={globalFilterFromData}
                      condition={selectedAccount}
                      searchKey={searchKeyFilter}
                      filterDateRange={globalFilterDateRange}
                      metaData={metaData}
                      selectedProfiles={selectedProfile}
                    />
                  )}
                </Tab>

                {/* === Portfolios Tab === */}
                <Tab eventKey="portfolios" title="Portfolios">
                  {activeTab === "portfolios" && (
                    <PortfoliosTable
                      checkBox={false}
                      tabName="Portfolios"
                      filterData={globalFilterFromData}
                      condition={selectedAccount}
                      searchKey={searchKeyFilter}
                      filterDateRange={globalFilterDateRange}
                      metaData={metaData}
                      selectedProfiles={selectedProfile}
                    />
                  )}
                </Tab>

                {/* === Campaign Tab === */}
                <Tab eventKey="campaign" title="Campaign">
                  {activeTab === "campaign" && (
                    <CampaignTable
                      checkBox={true}
                      tabName="Campaigns"
                      filterData={globalFilterFromData}
                      condition={selectedAccount}
                      searchKey={searchKeyFilter}
                      filterDateRange={globalFilterDateRange}
                      metaData={metaData}
                      selectedProfiles={selectedProfile}
                    />
                  )}
                </Tab>

                {/* === Ad Group Tab === */}
                <Tab eventKey="adgroup" title="Ad Group">
                  {activeTab === "adgroup" && (
                    <AdGroupTable
                      checkBox={true}
                      tabName="AdGroups"
                      filterData={globalFilterFromData}
                      condition={selectedAccount}
                      searchKey={searchKeyFilter}
                      filterDateRange={globalFilterDateRange}
                      metaData={metaData}
                      selectedProfiles={selectedProfile}
                    />
                  )}
                </Tab>

                {/* === Products Tab === */}
               
                {selectedProfile !== "SB" && (
                  <Tab eventKey="Products" title="Products">
                    {activeTab === "Products" && (
                      <ProductsTable
                        checkBox={true}
                        tabName="Products"
                        filterData={globalFilterFromData}
                        condition={selectedAccount}
                        searchKey={searchKeyFilter}
                        filterDateRange={globalFilterDateRange}
                        metaData={metaData}
                        selectedProfiles={selectedProfile}
                        onCache={this.handleTableCache}
                        cachedData={cachedData[selectedProfile]}
                      />
                    )}
                  </Tab>
                )}


                {/* === Targeting Tab === */}
                <Tab eventKey="targeting" title="Targeting">
                  {activeTab === "targeting" && (
                    <TargetingTable
                      checkBox={true}
                      tabName="Targets"
                      filterData={globalFilterFromData}
                      condition={selectedAccount}
                      searchKey={searchKeyFilter}
                      filterDateRange={globalFilterDateRange}
                      metaData={metaData}
                      selectedProfiles={selectedProfile}
                    />
                  )}
                </Tab>
              </Tabs>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }
}

export default AdsCompaignManager;
