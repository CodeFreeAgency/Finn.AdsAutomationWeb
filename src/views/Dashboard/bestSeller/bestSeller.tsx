import React, { Component } from "react";
import { Col, Row } from "react-bootstrap";
import "./bestSeller.css";
import LogoIcon from "../../../assets/brand/logo-icon.svg";
import Image1 from "../../../assets/images/Image-1.png";
import Stack from "@mui/material/Stack";
import Pagination from "@mui/material/Pagination";
export default class BestSeller extends Component {
  state = {
    bestSellerData: [],
    apiLoading: false,
    lastPage: 1
  };
  componentDidMount(): void {
    this.getBestSellerData();
  }
  getBestSellerData = async () => {
    this.setState({ apiLoading: true });
    let userToken = localStorage.getItem("userToken");
    let AuthToken = "Bearer " + userToken;
    const response = await fetch(
      "https://api.aimosa.io/Dashboard/BestSeller",
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
    console.log("best=s", responceData.result);
    this.setState({ bestSellerData: responceData.result });
    console.log("bookcoverdata=", this.state.bestSellerData);
    this.setState({ apiLoading: false });
  };
  handleChange = (event, value: number) => {
    this.setState({setcurrPage: value});
  };
  render() {
    return (
      <div>
        {!this.state.apiLoading ? (
          <>
          {
            this.state.bestSellerData &&
          <Row>
            {this.state.bestSellerData.map((list: any, i) => (
              <Col>
                <div className="top-seller-widget mt-2" key={i}>
                  <Row>
                    <Col>
                      {list.bookCover == null ? (
                        <img src={Image1} alt="image1" />
                      ) : (
                        <img src={list.bookCover} alt="image1" />
                      )}
                    </Col>
                    <Col className="p-0">
                      <span className="tag-info">#{i + 1} Bestseller</span>
                      <div className="top-seller-cont-title">
                        {list.bookName}
                      </div>

                      {list.grossRoyalties == null ? (
                        <p>Gross Royalties:$0</p>
                      ) : (
                        <p>Gross Royalties:${list.grossRoyalties}</p>
                      )}
                      {list.spending == null ? (
                        <p> Spending:$0</p>
                      ) : (
                        <p> Spending:${list.spending}</p>
                      )}
                      {list.netRoyalties == null ? (
                        <p>Net Royalties:$0</p>
                      ) : (
                        <p>Net Royalties:${list.netRoyalties}</p>
                      )}
                    </Col>
                  </Row>
                </div>
              </Col>
            ))}
            <div className="custom-table-footer">
            <Row>
              <Col md={12}>
                <div className="table-footer-right">
                  <Stack spacing={2}>
                    <Pagination
                      count={this.state.lastPage}
                      variant="outlined"
                      shape="rounded"
                      onChange={this.handleChange}
                    />
                  </Stack>
                </div>
              </Col>
            </Row>
          </div>
          </Row>

          }
          </>
        ) : (
          <div className="loading-container bestSellerLoading mb-2">
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
    );
  }
}
