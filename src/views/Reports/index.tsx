import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { Col, Row } from "react-bootstrap";
import "./reports.css";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import Session from "./session";
import Sales from "./sales";
import BuyBox from "./buybox";
import Orders from "./orders";

import Revenue from "./revenue";
import Cvr from "./cvr";
import Tacos from "./tacos";

interface ResultProps {
  searchResult: any;
  selectedAccountCountry:string;
}
const Report: React.FunctionComponent<ResultProps> = (props) => {
  console.log(props)
  const [activeTab, setActiveTab] = useState("sales");
  const handleTabChange = (tabkey) => {
    setActiveTab(tabkey);
  };

  return (
    <DashboardLayout>
      <Row className="ms-1 me-1">
        <div className="main-content-container mt-3">
          <div className="dashboard-container campaing-manger ">
            <div className="tab-container">
              <Tabs
                defaultActiveKey="session"
                activeKey={activeTab}
                onSelect={handleTabChange}
                className="px-4"
              >
              
                <Tab eventKey="sales" title="Sales" >
                  {activeTab === "sales" && (
                    <Sales tabName="Sales" profileId={props.searchResult} />
                  )}
                </Tab>
                <Tab eventKey="buybox" title="Inventory" >
                  {activeTab === "buybox" && (
                    <BuyBox
                       tabName="Buybox"
                       profileId={props.searchResult}
                       selectedAccountCountry={props.selectedAccountCountry}
                    />
                  )}
                </Tab>
              </Tabs>
            </div>
          </div>
        </div>
      </Row>
    </DashboardLayout>
  );
};

export default Report;
