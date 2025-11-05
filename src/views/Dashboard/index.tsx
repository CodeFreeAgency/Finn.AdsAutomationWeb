import DashboardLayout from "../../layouts/DashboardLayout";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { CircularProgress, Pagination, Stack } from "@mui/material";
import { useEffect, useState } from "react";

let columns: GridColDef[] = [];
var targetId = "";
interface Report {
  dateRange: string;
  impressions: number;
  clicks: number;
  orders: number;
  acos: number;
}
interface ResultProps {
  searchResult: any;
}
const Dashboard: React.FunctionComponent<ResultProps> = (props) => {
  let currPage = 1;
  let dataLength = 50;
  const [apiLoading, setApiLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [rows, setRows] = useState([]);
  const [perPage, setPerPage] = useState(50);
  const [lastPage, setLastPage] = useState(1);
  const [activePage, setActivePage] = useState(1);
  const [totalRow, setTotalRow] = useState(0);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    setApiLoading(true);
    if (props.searchResult !== "") {
      backgroundsync();
    }
  }, [searchText, props.searchResult]);

  const applyDataLength = (e) => {
    dataLength = parseInt(e.target.value);
    setPerPage(e.target.value);
    currPage = activePage;
    backgroundsync();
  };

  const backgroundsync = async () => {
    setApiLoading(true);
    let userToken = localStorage.getItem("userToken");
    let AuthToken = "Bearer " + userToken;
    let url = "https://finnapi.sellingpartnerservice.com/BackgroundServices/Reports/All ";
   
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: AuthToken,
      },
      body: JSON.stringify({
        profileId: props.searchResult,
        pageNumber: currPage,
        pageSize: dataLength,
        globalFilters: {
          searchText: searchText,
          advancedFilters: null,
        },
      }),
    };

    try {
      const response = await fetch(url, requestOptions);
      const responceData = await response.json();
      if (responceData.success) {
        setApiLoading(false);
        let result = responceData.result;
        setRows(result.data);
        setTotalRow(result.filteredCount);
        setPerPage(result.perPage);
        setActivePage(result.currPage);
        setLastPage(result.lastPage);

        if (columns.length < 1) {
          let headers = responceData.result.headers;
          for (let i = 0; headers.length > i; i++) {
            if (headers[i]["keyName"] === "campaignName") {
              columns.push({
                field: headers[i]["keyName"],
                headerName: headers[i]["displayName"],
                flex: 0.5,
                minWidth: 200,
                renderCell: (params) => {
                  return (
                    <>
                      <div className="col-rulename">
                        <div
                          className="col-title"
                          style={{ overflow: "hidden", whiteSpace: "normal" }}
                        >
                          {params.row.campaignName}
                        </div>
                      </div>
                    </>
                  );
                },
              });
            } else {
              columns.push({
                field: headers[i]["keyName"],
                headerName: headers[i]["displayName"],
                minWidth: 150,
                flex: 1,
              });
            }
          }
        }
        console.log(columns);
      } else {
        setRows([]);
        setApiLoading(false);
      }
    } catch (error) {
      setApiLoading(false);
      console.error("Error fetching data:", error);
    }
  };

  const handleChange = (event, value: number) => {
    currPage = value;
    setActivePage(value);
    dataLength = perPage;
    backgroundsync();
  };

  const handleKeyDown = (event: any) => {
    if (event.key === "Enter") {
      setSearchText(event.target.value);
      event.preventDefault();
    }
  };

  // useEffect(() => {
  //   setApiLoading(true);
  //   fetch("https://jsonplaceholder.typicode.com/users")
  //     .then((response) => response.json())
  //     .then((data) => {
  //       const flattenedData = data.map((user) => ({
  //         id: user.id,
  //         name: user.name,
  //         username: user.username,
  //         email: user.email,
  //         phone: user.phone,
  //         website: user.website,
  //         street: user.address.street,
  //         suite: user.address.suite,
  //         city: user.address.city,
  //         zipcode: user.address.zipcode,
  //         lat: user.address.geo.lat,
  //         lng: user.address.geo.lng,
  //         companyName: user.company.name,
  //         catchPhrase: user.company.catchPhrase,
  //         bs: user.company.bs,
  //       }));
  //       setUsers(flattenedData);
  //       setApiLoading(false);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching users:", error);
  //       setApiLoading(false);
  //     });
  // }, []);

  // const generateColumns = () => {
  //   if (users.length === 0) return [];
  //   const firstUser = users[0];
  //   return Object.keys(firstUser)
  //     .filter((key) => key !== "id") 
  //     .map((key) => ({
  //       field: key,
  //       headerName: key.toUpperCase(),
  //       minWidth: 150,
  //     }));
  // }
  

  return (
    <DashboardLayout>
      <div className="action-row d-flex justify-content-between mt-5 ">
        <div className="back-arrow-container d-flex align-items-center mt-4 ps-3 ">
          <span className="title px-3">Dashboard</span>
        </div>
      </div>
      <div className="main-cont-header pt-3 ">
        <Row className="d-flex justify-content-center ">
          <div className="top-box d-flex page-title text-white">
            <div
              className="box text-center"
           
            >
              <div className="pt-2">50000</div>
              
              <div>Impression</div>
            </div>
            <div
              className="box text-center "
          
            >
              <div className="pt-2">30000</div>
              <div>Clicks</div>
            </div>
            <div
              className="box text-center"
              
            >
              <div className="pt-2">10000</div>
              <div>Sales</div>
            </div>
            <div
              className="box text-center"
              
            >
              <div className="pt-2">$8000</div>
              <div>ROI</div>
            </div>
          </div>
        </Row>
      </div>

      <Row className="ms-2 me-3">
        <div className="action-row d-flex justify-content-between mt-4 ">
          <div className="back-arrow-container d-flex align-items-center  "></div>
          {/* <div className="d-flex">
            <form className="me-3">
              <div className="search-filter-container ">
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
          </div> */}
        </div>
        {!apiLoading ? (
          <div
            style={{ height: "calc(70vh - 120px)", width: "100%",maxHeight:"100%" }}
            className="mt-2 px-4"
          >
            {/* <DataGrid
              className="mt-3"
              rows={rows}
              columns={columns}
              disableRowSelectionOnClick
              hideFooter={true}
              rowHeight={40}
            /> */}
            {/* <DataGrid
              rows={users}
              columns={generateColumns()}
              // checkboxSelection={props.checkBox}
              hideFooter={true}
              rowHeight={40}
            /> */}
            {/* <div className="custom-table-footer">
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
            </div> */}
          </div>
        ) : (
          <div className="loading-container">
            <div 
              style={{
                marginBottom: "250px",
                marginTop: "250px",
              }}
            >
              <CircularProgress
                className="loading"
                style={{ margin: "auto" }}
              />
            </div>
          </div>
        )}
      </Row>
    </DashboardLayout>
  );
};

export default Dashboard;
