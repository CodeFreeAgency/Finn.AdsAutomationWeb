/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from 'react';
import { Row, Col } from "react-bootstrap";
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Nav from 'react-bootstrap/Nav';
import Tab from 'react-bootstrap/Tab';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Moment from 'moment';

import ColumnFilter from '../Filters/cloumn-filter';
import ConditionFilter from '../Filters/condition-filter';

import './index.css';
import LogoIcon from "../../assets/brand/logo-icon.svg";

import FilterIcon from "../../assets/images/icons/filter-icon.svg";
import PauseIcon from "../../assets/images/icons/pause.svg";
import ExportIcon from "../../assets/images/icons/export.svg";

let rows:any = [];
let columns: GridColDef[] = [];


function AdsCompaignTable(props) {
  let apiEndPoint = "https://api.aimosa.io/Ads/CampaignManager/" + props.tabName;
  let pageload = true;
  let paginationCounts:any = [];
  let currPage = 1;
  let dataLength = 50;
  const [metaData, setMetaData] = useState<any>([]);
  const [apiLoading,setApiLoading]=useState(false);
  const [perPage, setPerPage] = useState(50);
  const [totalPage, setTotalPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [activePage, setActivePage] = useState(1);
  const [totalRow, setTotalRow] = useState(0);
  const [paginationList, setPaginationList] = useState<any>([]);
  const [searchKeyValue, setSearchKeyValue] = useState('');
  const [filterDateRange, setFilterDateRange] = useState<any[]>([]);
  const [dropdownDatas, setDropdownDatas] = useState<any[]>([]);

  let filterData:any = [];
  const [globalFilterFromData, setGlobalFilterFromData] = useState<any[]>([]);
  const [searchKeyFilter, setSearchKeyFilter] = useState('');
  let searchKey = "";
  useEffect(() => {
    setMetaData(props.metaData);
  }, [props.metaData, metaData]);
  useEffect(() => {
    if(props.filterDateRange){
    if(props.filterDateRange.length > 0) {
      if(filterDateRange !== props.filterDateRange){
        setFilterDateRange(props.filterDateRange);
        pageload = true;
        fetchData();
        pageload = false;
      }
    }}
  });
  useEffect(() => {
    if(props.tabName && pageload){
      fetchData();
      pageload = false;
    }
  }, []);
  const fetchData = async () => {
    setApiLoading(true);

    let userToken = localStorage.getItem('userToken')
    let AuthToken = "Bearer " + userToken;
    let url = apiEndPoint;
    let advancedFilters:any = [];
    let advancedFilterDateRange:any = {};

    if(filterData.length > 0){
      advancedFilters = filterData;
    }
    if(props.filterDateRange.length> 0){
      advancedFilterDateRange = {
        dateRange: "Custom",
        startDate: Moment(props.filterDateRange[0]).format('YYYY-MM-DD') + "T13:32:30.064Z",
        endDate: Moment(props.filterDateRange[1]).format('YYYY-MM-DD') + "T13:32:30.064Z",
      }
    }
    const requestOptions = {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': AuthToken
      },
      body: JSON.stringify({
        pageNumber: currPage,
        pageSize: dataLength,
        globalFilters: {
          searchText: searchKey,
          advancedFilters: advancedFilters,
          dateRanges: advancedFilterDateRange
        },
      }),
    };
    try {
      const response = await fetch(url, requestOptions);
      const responceData = await response.json();
      let result = responceData.result;
      setTotalRow(result.total);
      setLastPage(result.lastPage);
      setPerPage(result.perPage);
      setActivePage(result.currPage);
      let headers = responceData.result.headers;
      setDropdownDatas(headers);

      if(columns.length < 1) {
        for (let i=0; headers.length > i; i++  ){
          if(headers[i]['keyName'] === "campaignStatus"){
            columns.push(
              { field: headers[i]['keyName'], headerName: headers[i]['displayName'], width: 80,
                renderCell: (params) => (
                  <i className={'status ' + params.row.campaignStatus}></i>
                ),
              }
            )
          } else  if(headers[i]['keyName'] === "marketplace"){
            columns.push(
              { field: headers[i]['keyName'], headerName: headers[i]['displayName'], width: 80,
                renderCell: (params) => (
                  <i className={'flag-' + params.row.marketplace}></i>
                ),
              }
            )
          } else  if(headers[i]['keyName'] === "campaign"){
            columns.push({ field: headers[i]['keyName'], headerName: headers[i]['displayName'], minWidth: 250 });
          } else {
            columns.push({ field: headers[i]['keyName'], headerName: headers[i]['displayName'], minWidth: 100 });
          }
        }
      }
      for (let i = 1; i <= result.total; i += result.perPage){
        if(i < (20 * perPage)){
          paginationCounts.push(i);
        }
      }
      setTotalPage(paginationCounts.length);
      setPaginationList(paginationCounts);
      console.log("pagination: ", paginationList);
      rows = responceData.result.data;  
      setApiLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  
  const applyPagination = (e, pageNo:any) =>{
    console.log("pagination no: ", pageNo);
    currPage = pageNo;
    fetchData();
  }

  const applyDataLength = (e) =>{
    console.log("dataSize: ", e.target.value);
    dataLength = parseInt(e.target.value);
    fetchData();
  }

  const handleNvEnter = (event) => {
    console.log("Nv Enter:", event);
  }
  const handleCallback = (childData) => {
    setGlobalFilterFromData( childData );
    filterData = childData;
    fetchData();
  }
  const handleKeyDown = (event:any) => {
    if (event.key === 'Enter') {
      searchKey = event.target.value;
      setSearchKeyFilter(event.target.value);
      fetchData();
      event.preventDefault();
    }
  };
  const cancelDropdown = () => {
    const eleRm:any = document.getElementById('dropdownCon');
    eleRm.classList.remove('open');

    const eleRm2:any = document.getElementById('dropdownCon2');
    eleRm2.classList.remove('open');
  }

  function openDropdown(e){
    const eleRm:any = document.getElementById('dropdownCon2');
    eleRm.classList.remove('open');

    const ele:any = document.getElementById('dropdownCon');
    ele.classList.add('open');
  }
  function openDropdown2(e){
    const eleRm:any = document.getElementById('dropdownCon');
    eleRm.classList.remove('open');

    const ele:any = document.getElementById('dropdownCon2');
    ele.classList.add('open');
  }
  const handleChange = (event, value: number) =>{
    currPage = value;
    fetchData();
  };

  return (
    <div style={{ height: 500, width: '100%' }}>
      <Row className='mt-2 mb-2'>
        <Col md={5}>
          { props.checkBox &&
          <div className='bulk-operations'>
            <div className="cus-dropdown">
              <span>Bulk operation</span>
              <i className="fa fa-angle-down down-arrow-right" aria-hidden="true"></i>
              <div className="dropdown-container">
                <form>
                <Tab.Container id="left-tabs-example" defaultActiveKey="first">
                    <Row>
                        <Col sm={4}>
                        <Nav variant="pills" className="flex-column">
                            <Nav.Item>
                            <Nav.Link eventKey="first">Status</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                            <Nav.Link eventKey="second">Daily Budget</Nav.Link>
                            </Nav.Item>
                        </Nav>
                        </Col>
                        <Col sm={8}>
                        <Tab.Content>
                            <Tab.Pane eventKey="first">
                                <select className="form-select" id="bulkaction-status">
                                    <option selected>Status</option>
                                    <option value="Enabled">Enabled</option>
                                    <option value="Paused">Paused</option>
                                    <option value="Archived">Archived</option>
                                </select>
                            </Tab.Pane>
                            <Tab.Pane eventKey="second">
                                <div>
                                    <label>Daily Budget</label>
                                    <select className="form-select" id="bulkaction-daily-budget">
                                        <option selected>Select</option>
                                        <option value="Increase daily budget by">Increase daily budget by</option>
                                        <option value="Lower daily budget by">Lower daily budget by</option>
                                        <option value="Set daily budget to">Set daily budget to</option>
                                    </select>
                                </div>
                                <div>
                                    <label>Daily Budget Value</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter Value"
                                        aria-label="value"
                                        aria-describedby="addon-wrapping"
                                    />
                                </div>
                                <div>
                                    <label>Adjust bid value options</label>
                                    <select className="form-select" id="bulkaction-value-options">
                                        <option selected>Select</option>
                                        <option value="%">%</option>
                                        <option value="$">$</option>
                                    </select>
                                </div>
                            </Tab.Pane>
                        </Tab.Content>
                        </Col>
                    </Row>
                    </Tab.Container>
                    <hr />
                    <div className="footer">
                        <button type="button" className="btn btn-default">Cancel</button>
                        <button type="button" className="btn btn-primary" disabled>Apply</button>
                    </div>
                </form>
              </div>
            </div>
          </div>
        }
        </Col>
        <Col>
        <div className="filer-container">
            <Row>
              <Col md={5} className="padding-lr-10">
                <form>
                  <div className="search-filter-container">
                    <i className="fa fa-search"></i>
                    <input type="text" placeholder="Search" id="globalSearch" name="globalSearch" onKeyDown={handleKeyDown} />
                  </div>
                </form>
              </Col>
              <Col md={2} className="padding-lr-10">
                <div className="filter-link-container cus-dropdown">
                  <i><img src={FilterIcon} alt="filter icon" /></i>
                  <span style={{backgroundColor:"white"}}>Filter</span>
                  <i className="fa fa-angle-down down-arrow-right" aria-hidden="true"></i>
                  <div className="dropdown-container" id="dropdownCon" onClick={openDropdown}>
                  <ConditionFilter parentCallback={handleCallback} dropdownData={dropdownDatas} metaData={metaData} />
                  </div>
                </div>
              </Col>
              <Col md={3} className="padding-lr-10">
                <div className="column-link-container cus-dropdown">
                  <i><img src={PauseIcon} alt="filter icon" /></i>
                  <span>Columns</span>
                  <i className="fa fa-angle-down down-arrow-right" aria-hidden="true"></i>
                  <div className="dropdown-container" id="dropdownCon2" onClick={openDropdown2}>
                    <form>
                      <div className="set-max-height-400">
                        <ColumnFilter columnList={dropdownDatas} />
                      </div>
                      <hr />
                      <div className="footer">
                          <button type="button" className="btn btn-default">Cancel</button>
                          <button type="button" className="btn btn-primary">Apply</button>
                      </div>
                    </form>
                  </div>
                </div>
              </Col>
              <Col md={2} className="padding-lr-10 padding-r-0">
                <div className="export-link-container">
                  <i><img src={ExportIcon} alt="filter icon" /></i>
                  <span  style={{backgroundColor:"white"}}>Export</span>
                </div>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
      {!apiLoading?
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          checkboxSelection = {props.checkBox}
          hideFooter={true}
          rowHeight={40}
        />
        <div className='custom-table-footer'>
          <Row>
            <Col md={5}>
              <form className='table-footer-left'>
                <span>Show </span>
                <label>
                  <select className="form-select" defaultValue={perPage} onChange={event =>applyDataLength(event)}>
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
              <div  className='table-footer-right justify-content-end'>
                <Stack spacing={2}>
                  <Pagination count={lastPage} page={activePage} variant="outlined" shape="rounded" onChange={handleChange} />
                </Stack>
              </div>
            </Col>
          </Row>
        </div>
      </div>
      : 
      <div className="loading-container">
        <div className="loading-text">
          <span className='logicon'><img src={LogoIcon} alt='logo-small'></img></span>
          <span>L</span>
          <span>O</span>
          <span>A</span>
          <span>D</span>
          <span>I</span>
          <span>N</span>
          <span>G</span>
        </div>
      </div>
      }
    </div>
  );
}
export default AdsCompaignTable;