import React, { Component, useState } from "react";


import "./index.css";
import Nav from 'react-bootstrap/Nav';
import Tab from 'react-bootstrap/Tab';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import 'bootstrap/dist/css/bootstrap.min.css';

import filtericon from '../../../assets/images/icons/filter-icon.svg'
import pauseicon from '../../../assets/images/icons/pause.svg'
import Exporticon from '../../../assets/images/icons/export.svg'
import Tagsicon from '../../../assets/images/icons/tag-icon.svg'

import Moment from 'moment';
import ConditionFilter from "../../../components/Filters/condition-filter";
import ColumnFilter from "../../../components/Filters/cloumn-filter";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { Card, Col, Container, Dropdown, Row } from "react-bootstrap";
import DropdownToggle from "react-bootstrap/esm/DropdownToggle";
import DropdownMenu from "react-bootstrap/esm/DropdownMenu";
import DropdownItem from "react-bootstrap/esm/DropdownItem";
import BookshelfTable from "../../../components/CusDataTable/bookshelf-table";

// Destructure tags and removeTag directly in the component
const Tags = ({ tags, removeTag }) => (
    <div className="book-tags">
        {tags.map((tagGroup) => (
            <div key={tagGroup.id}>
                {tagGroup.labels.map((label, index) => (
                    <div key={index} className="tag mr-2">
                        {label}{" "}
                        <span
                            className="tag-remove"
                            onClick={() => removeTag(tagGroup.id, index)}
                        >
                            x
                        </span>
                    </div>
                ))}
            </div>
        ))}
    </div>
);
interface AdsCreationsState {
    isChecked: boolean;
    globalFilterFromData: any[];
    searchKeyFilter: string;
    globalFilterDateRange: any[];
    filterOptionData: any[];
    paginationList: any[];
    perPage: number;
    total: number;
    currPage: number;
    lastPage: number;
    nextPage: number;
    prevPage: number;
    dropdownDatas: any[];
    metaData: any[];
    dropdownOpen: boolean;
    tags: { id: number; labels: string[] }[];
    cards: { id: number; title: string; content: string }[];
    showCreateButton: boolean;
}

class AdsCreations extends Component<{}, AdsCreationsState> {
    filterData: any = [];

    state: AdsCreationsState = {
        isChecked: false,
        globalFilterFromData: [],
        searchKeyFilter: "",
        globalFilterDateRange: [],
        filterOptionData: [],
        paginationList: [],
        perPage: 50,
        total: 0,
        currPage: 1,
        lastPage: 0,
        nextPage: 0,
        prevPage: 0,
        dropdownDatas: [],
        metaData: [],
        dropdownOpen: false,
        tags: [
            {
                id: 1,
                labels: ["Add Tag", "Fiction", "Drama", "Romance", "Comedy"],
            },
            {
                id: 2,
                labels: ["Add Tag", "Fiction", "Drama", "Romance", "Comedy"],
            },
            {
                id: 3,
                labels: ["Add Tag", "Fiction", "Drama", "Romance", "Comedy"],
            },
        ],
        cards: [
            { id: 1, title: "LO-campaign-mpt-categories", content: "duplicate" },
            { id: 2, title: "LO-campaign-mpt-categories", content: "duplicate" },
            { id: 3, title: "LO-campaign-mpt-categories", content: "duplicate" },
            { id: 4, title: "LO-campaign-mpt-categories", content: "duplicate" },
            { id: 5, title: "LO-campaign-mpt-categories", content: "duplicate" },
            { id: 6, title: "LO-campaign-mpt-categories", content: "duplicate" },
            { id: 7, title: "LO-campaign-mpt-categories", content: "duplicate" },
            { id: 8, title: "LO-campaign-mpt-categories", content: "duplicate" },
        ],
        showCreateButton: false,
    };

    toggleCheckboxes = () => {
        this.setState((prevState) => ({
            isChecked: !prevState.isChecked,
        }));
    };

    constructor(props: any) {

        super(props);
        this.onChangeDateRangeSubmitGlobal = this.onChangeDateRangeSubmitGlobal.bind(this);
        this.removeTag = this.removeTag.bind(this);
        this.addTag = this.addTag.bind(this);
    }

    componentDidMount() {
        this.getMetaData();
    }

    handleNvEnter = (event) => {
        console.log("Nv Enter:", event);
    }

    handleCallback = (childData) => {
        this.setState({ globalFilterFromData: childData });
        this.filterData = childData;
    }

    handleKeyDown = (event: any) => {
        if (event.key === 'Enter') {
            this.setState({ searchKeyFilter: event.target.value });
            event.preventDefault();
        }
    };

    onChangeDateRangeSubmitGlobal(e) {
        console.log(Moment(e[0]).format("YYYY-MM-DD"));
        console.log(e[1]);
        let dateRange = e;
        if (dateRange.length > 0) {
            this.setState({ globalFilterDateRange: dateRange });
        }
    }

    applyDataLength = (e) => {
        console.log("dataSize: ", e.target.value);
        this.setState({ perPage: parseInt(e.target.value) });
    }

    handleCallbackTotalData = (childData) => {
        console.log("Child Bookshelf Table data: ", childData);
        this.setState({ total: childData.total });
        this.setState({ currPage: childData.currPage });
        this.setState({ lastPage: childData.lastPage });
        this.setState({ nextPage: childData.nextPage });
        this.setState({ perPage: childData.perPage });
        this.setState({ prevPage: childData.prevPage });
        this.setState({ dropdownDatas: childData.dropdownDatas });
    }

    applyPagination = (e, pageNo: any) => {
        console.log("pagination no: ", pageNo);
        this.setState({ currPage: pageNo });
    }

    handleChange = (event, value: number) => {
        this.setState({ currPage: value });
    };

    getMetaData = async () => {
        let userToken = localStorage.getItem('userToken')
        let AuthToken = "Bearer " + userToken;
        let url = "https://api.aimosa.io/MasterData/meta";
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
            this.setState({ metaData: responceData.result.data });
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    cancelDropdown = () => {
        const eleRm: any = document.getElementsByClassName("dropdown-menu");
        for(let i = 0; i < eleRm.length; i++){
            eleRm[i].classList.remove('show');
        }
    };
    

    handleCheckboxClick = (e) => {
        // Prevent the click event from propagating to the parent label
        e.stopPropagation();
    };

    removeCard = (id) => {
        // Filter out the card with the specified ID
        const updatedCards = this.state.cards.filter((card) => card.id !== id);

        // Set the state with the updated cards
        this.setState({ cards: updatedCards });
    };


    removeTag(tagId: number, index: number) {
        const { tags } = this.state;
        const updatedTags = tags.map((tagGroup) => {
            if (tagGroup.id === tagId) {
                const updatedLabels = [...tagGroup.labels];
                updatedLabels.splice(index, 1);
                return { ...tagGroup, labels: updatedLabels };
            }
            return tagGroup;
        });
        this.setState({ tags: updatedTags });
    }
    addTag() {
        const { tags } = this.state;
        const newTagGroup = {
            id: tags.length + 1, // You should use a more robust method to generate unique IDs
            labels: ["NewTag"], // Replace with your actual data
        };
        const updatedTags = [...tags, newTagGroup];
        this.setState({ tags: updatedTags, showCreateButton: false });
    }
    renderTags() {
        const { tags } = this.state;
        return <Tags tags={tags} removeTag={this.removeTag} />;
    }

    renderCreateButton() {
        const { showCreateButton } = this.state;
        return (
            showCreateButton && (
                <button onClick={() => this.addTag()} className="create-button">
                    Create
                </button>
            )
        );
    }
    render() {
        // If 'showButtons' is not used, remove it from destructuring
        const { tags } = this.state;


        return (
            <DashboardLayout>
                <div className="main-cont-header">

                    <div className="filtersheader">
                        <div className="main-cont-header bookself-container">
                            <Row className="page-header">
                                <Col>
                                    <div className="main-con-page-title-container">
                                        <div className="title">
                                            <h3 className="page-title">ADS</h3>
                                        </div>
                                    </div>
                                </Col>
                                <Col className="text-end last-sync">
                                    <span>
                                        <i>
                                            {/* <img src={LinkIcon} alt="refresh icon" /> */}
                                        </i>
                                        Last App Sync
                                    </span>
                                    <span className="time-summery">Wed, Nov 2, 10:57</span>
                                </Col>
                            </Row>
                        </div>
                        <hr />

                        <div className="dashboard-container padding-lr-30" >
                            <div className="adspage">

                                <Row>
                                    <Col md={7}>
                                        <Row>
                                            <Col md={4}>
                                                <form>
                                                    <div className="search-filter-container" style={{ marginLeft: "100px" }}>
                                                        <i className="fa fa-search"></i>
                                                        <input type="text" placeholder="Search" id="globalSearch" name="globalSearch" onKeyDown={this.handleKeyDown} />
                                                    </div>
                                                </form>
                                            </Col>
                                            <Col md={4}>
                                                <div className='bulk-operations' style={{ marginLeft: "100px" }}>
                                                    <div className="cus-dropdown">
                                                        <span>Bulk operation</span>
                                                        <i className="fa fa-angle-down down-arrow-right" aria-hidden="true"></i>
                                                        <div className="dropdown-container">
                                                            <form>

                                                                <hr />
                                                                <div className="footer">
                                                                    <button type="button" className="btn btn-default">Cancel</button>
                                                                    <button type="button" className="btn btn-primary" disabled>Apply</button>
                                                                </div>
                                                            </form>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col>

                                        <div className="filter-container" style={{ marginRight: "-20px" }}>
                                            <Row>
                                                <Col md={12} className="padding-lr-10">
                                                    <div className="filter-item filter-link-container dropdownContent">

                                                        <p
                                                            id="dropdownMenuButton1"
                                                            data-bs-toggle="dropdown"
                                                            data-bs-auto-close="outside"
                                                            aria-expanded="false"
                                                            data-bs-display="static"
                                                        >

                                                            <i><img src={filtericon} alt="filter icon" /></i>

                                                            <span>Filter</span>
                                                            <i className="fa fa-angle-down down-arrow-right" aria-hidden="true"></i>
                                                        </p>
                                                        <div
                                                            className="dropdown-menu dropdown-menu-lg-end"
                                                            aria-labelledby="dropdownMenuButton1"
                                                        >
                                                            <ConditionFilter parentCallback={this.handleCallback} dropdownData={this.state.dropdownDatas} metaData={this.state.metaData} />
                                                        </div>

                                                    </div>

                                                    <div className="filter-item column-link-container dropdownContent">
                                                        <p
                                                            id="dropdownMenuButton2"
                                                            data-bs-toggle="dropdown"
                                                            data-bs-auto-close="outside"
                                                            aria-expanded="false"
                                                            data-bs-display="static"
                                                        >
                                                            <i><img src={pauseicon} alt="filter icon" /></i>
                                                            <span>Columns</span>
                                                            <i className="fa fa-angle-down down-arrow-right" aria-hidden="true"></i>
                                                        </p>
                                                        <div
                                                            className="dropdown-menu dropdown-menu-lg-start"
                                                            aria-labelledby="dropdownMenuButton1"
                                                        >
                                                            <form>
                                                                <div className="set-max-height-400">
                                                                    <ColumnFilter columnList={this.state.dropdownDatas} />
                                                                </div>
                                                                <hr />
                                                                <div className="footer">
                                                                    <button type="button" className="btn btn-default" onClick={this.cancelDropdown}>Cancel</button>
                                                                    <button type="button" className="btn btn-primary" onClick={this.cancelDropdown}>Apply</button>
                                                                </div>
                                                            </form>
                                                        </div>
                                                    </div>
                                                    <div className="filter-item export-link-container">
                                                        <p>
                                                            <i><img src={Exporticon} alt="filter icon" /></i>
                                                            <span>Export</span>
                                                        </p>
                                                    </div>
                                                    <div className="filter-item export-link-container last">
                                                        <p>
                                                            <i><img src={Tagsicon} alt="filter icon" /></i>
                                                            <span>Manage Tags</span>
                                                        </p>

                                                    </div>
                                                    <input type="checkbox" className="check" />
                                                    <span className="checks">selectall</span>
                                                </Col>
                                            </Row>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                            <div className="dashboard-container padding-lr-30">


                            </div>
                        </div>


                        <div className="mt-3-bookads" style={{ height: '100px', width: '100%', backgroundColor: 'white' }}>
                            <div className="book-container d-flex align-items-center position-relative">
                                <input type="checkbox" className="mr-3" />
                                <img
                                    src="https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcT3AgA_TP6_BeBL9OTttT0fk_RMJdyWkrvqeK2Ns5RpJff-n9ci"
                                    alt="Book cover"
                                    className="bookcover"
                                />
                                <div className="book-info ml-3 d-flex flex-column justify-content-between">
                                    <div className="books">
                                        <div className="book-title mb-1">ThePowerof Pivotin</div>
                                        <div className="book-author mb-1">123DFF450.Monica Ortega</div>
                                    </div>
                                    <div className="book-tags">
                                        {this.state.tags
                                            .filter(tagGroup => tagGroup.id === 1)  // Filter tags for the specific ID (in this case, 2)
                                            .map((tagGroup, tagIndex) => (
                                                <div key={tagIndex} className="tag-group specific-div">
                                                    {tagGroup.labels.map((label, index) => (
                                                        <div key={index} className="tag mr-2">
                                                            {label}{' '}
                                                            <span
                                                                className="tag-remove"
                                                                onClick={() => this.removeTag(tagGroup.id, index)}
                                                            >
                                                                x
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            </div>
                            {/* Button container at the bottom right */}
                            <div className="button-container">
                                {/* Button at the bottom right */}
                                <Dropdown className="threedot-dropdown">
                                    <Dropdown.Toggle variant="light" id="dropdown-basic1">
                                        {/* You can use your three-dot image or any other icon */}
                                        <img
                                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmN2XDX7N1ldsuC0SSWEZkKWIVIMha1ey_rehGeOYa4A&s"
                                            alt="Threedots"
                                            className="threedot"
                                        />
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        {/* Dropdown items go here */}
                                        <Dropdown.Item>Action</Dropdown.Item>
                                        <Dropdown.Item>Another Action</Dropdown.Item>
                                        <Dropdown.Item>Something else here</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>

                                <button
                                    className="buttoncreate"
                                    onClick={() => {
                                        // Add your button click logic here
                                        console.log("Button Clicked");
                                    }}
                                >
                                    Create Ads
                                </button>
                            </div>
                        </div>


                        <hr />
                        <Row>
                            <Col>
                                <div className="country-selector">
                                    <div className="country-option" data-country="usa">
                                        <img src="data:image/png;base64,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" alt="USA Flag" />
                                        US
                                    </div>
                                    <div className="country-option" data-country="canada">
                                        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRJKje3oiIRo8Bp6vfjsBwBYTRmyQ5JDQr16lX-24TYg&s" alt="Canada Flag" />
                                        CA
                                    </div>

                                    <div className="content">
                                        <img src="data:image/png;base64,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"
                                            alt="Icon" className="advertiseimage"
                                        />
                                        Advertise Everywhere
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        <Row className="scrollable-cards">

                            {this.state.cards.map((card) => (
                                <Col md={6} key={card.id} className="Cardsbackground">
                                    <Card className="mb-3 card-with-shadow">
                                        <Card.Body className="custom-scrollbar">
                                            {/* Custom content */}
                                            <div className="custom-card aligncards" key={card.id}>
                                                <img
                                                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAaVBMVEX///8AAAD29vbs7Oy5ublYWFifn5/Jycnx8fGTk5ODg4Ojo6PX19enp6dRUVHm5uZ9fX2JiYljY2Pg4ODDw8PPz880NDRcXFwlJSUQEBAvLy9NTU0/Pz+NjY0YGBh3d3coKChFRUWysrIb42ebAAACRUlEQVR4nO3d227CMBBFURISroFCIFBoKYX//8heSGH8UmnGdupGe70f6Yg4JEgePBgAAAAAAAAAAAAAAAAAAID/a9hUuUd8UjXDYF1iKHbZp7IyxqvyK74rgnYKapm1pqb49CdeBu4VzD67Wxjii0d8H7xbEEUmTNTxiYynuVBfZMWROj6S8ZcI/fzJhtlSHV86+Qj9vD05DZ/V+Wcn/xShoS/nPspe1flXJ6+/jztwkA1X6vhKxg8R+vlby4qNOt7I+DpCP3+5aGh5Zpci7/PmF1Hj11B8QvoV0JHqeCtY2y5BXt/iR+t7bRfGs7KebszxzakuZ+OAfQAAAAAAAAAAAAAAAAAAwP+WF6O5z97C7XxUJLp79qbdq22ZmPmysO4R78rw7WePr22q5z5V9Jbq/JqYmDgb4udHXD+t0QkxmZVl+n3CGxm3rvO4jrLiSR0/yfgxQj9/sqFh7skZDGPu6U/kTkP9eJ17DZN8KL7LhvqxHmeoKM37sP/fpfIiWl5LxPDae+BmoQzv83m2Yez7aNch1XeaQd6+luiHgG/aUeBzkl8zrd7/tgAAAAAAAAAAAAAAAAAAAJ3q+3+y9/5/9cd+W+3FZv9EL6M8huViyF9EPslDWNxxAv1VGMt4mmeUyIa9PGfG96ygnZNPcZn2f+7JXaX6iYvSyUfo5885VmyujjvnrumH+7qwlRX1D0TnPt5G6BdA/Wh4NcSvj3gdvFsgoc6wTHONfuv9OaSD/p8lCwAAAAAAAAAAAAAAAAAAfvcByzEP5H6NBvQAAAAASUVORK5CYII="
                                                    className="sixdots"
                                                />
                                                <h5 className="aligncampaign">{card.title}</h5>
                                                <img
                                                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAb1BMVEX///8AAADMzMxwcHD4+Pjg4OApKSnw8PCwsLDR0dG4uLj8/Pzl5eXp6el2dnYhISFjY2PY2Ninp6cUFBR9fX2Tk5MNDQ1ZWVkuLi6bm5tKSkpFRUXOzs43NzdgYGA9PT0ZGRkkJCSDg4NPT0/BwcED9THZAAAEQklEQVR4nO2d23aqMBRFRVHwVtF6odWjtvr/33i07CC9CCZZxGSMNZ9ld0+bkmizSKdDCCGEEEIIIYQQQgghhBBCCCGEEEJCZTrcdc3YDSfPbr6Z3csgsmGWjZ6tUEv6aqUnrOJne9xj+A/hd8XT3+Mbyu9C79kyf/ECFIyi9/GzfX6xhApG0fbZQj9ZVJrL9z0zskOlysuzlb7Tv3X2NjUfYOMkzctCft1uTqqtT+tS5WhY+zRpnJHv+1xNqitAMRRb6SmFVJur9wtSDcJUOkLNYmqgnkH17FEdwf5wZG2boepZsykaWsIKpkXBGaygLfKWd2EFExkUvnyYStZFPwms4lim/iGsoh2Top0jcP7KipI7XEUrZEEzABr20OPeDhoaQEPH0NAAGjqGhgbQ0DE0NICGjqGhATR0DA0NoKFjaGgADR1DQwNo6BgaGkBDx9DQABo6hoYG0NAxNDSAho6hoQE0hJBM+nVUXhmi4XSxGchWrnvMbptlwzPsbu+LVSh3f4Zm2D/dl/pGmRcIzHBxX+kHH+qSsAw1giEbdU1QhjrRnvJ2GpLht3DWcVBDns3LqwIyHN70lt0krqVyWUCGZX6wp9VsOIapEtQMhoRjqNI4utGeYAy7IqgdzgrGUM0U2hcGYyi5kDftC0MxVPGsqfaVkrd4BRrui5LYvIVMhrl+AjSRWxQwMyNJUmxmZlcU3Rtcmpvdg+9jPp7qkFupSYZQMjy4MJ2sHnNYwS8sDNVSARY1k3rgOLeFYSwdvYNa+YzauNHYGKphCkhyXxlJtSOk2g0bwzKbjFA0XR43YmOoZujLQLX9W4zLUgfLSr+wMkyOqq8oGzV8sqwh6Va+RYEHSK0My2X7F6913w7UcKwW0V89PtijaaY+jbC08OAPS0OwIi75fsPWsNM91jetwwIodmvQ1rCToB4zdOo3/zAD7A0v82JW3/pDbNt6HAbC8DKdpb3c/JFm68Fmgf08UQVjeCWe1v7n8T4T3CfMv8AZ+goNw4eG4UPD8KGhCf3NR2trMH1aMCy+vvHm+YctGBbrcG+eSYY3jOXb/nY+C+nTguGAhm6hoT40dA0N9aGha2ioDw1dQ0N9aOgaGupDQ9fQUB8auoaG+tDQNTTUh4auoaE+vhlK3gJ4Pk8sW/l8OS1GMjMH3LF8ch7Out2dTo8j6SVgtkfG/QBW0JZZ0RBuh7zs2d40v9IRsnMSFsVROZNWdsMacQZ3pGIF7W2n1EY6iubNL30Ate/bp+M2V9LTGqGooj3ePCfoSlw+ksZ+oKpwVnQCNIajfN+jQZpYnCY6rTx9wpcFjVDdbH/IDE+E3eeVKv7cSIX3CEsbwRA7xlhFz870LUAePo0PZ0EYNTzk62H++XI+4y/iVXP3zRzRCVAs52xmpZcvfZrn7zAZ7rpm7IYerUQJIYQQQgghhBBCCCGEEEIIIYQQQogm/wFN7i5k+IYVwgAAAABJRU5ErkJggg=="
                                                    className="align22"
                                                />
                                                <p className="align2">{card.content}</p>
                                                <img
                                                    src="https://icons.veryicon.com/png/o/commerce-shopping/soft-designer-online-tools-icon/delete-77.png"
                                                    className="align3"
                                                />
                                                <button onClick={() => this.removeCard(card.id)} className="removebutton">
                                                    Remove
                                                </button>
                                                <img
                                                    src="https://cdn-icons-png.flaticon.com/512/7613/7613767.png"
                                                    className="align4"
                                                    alt="icon"
                                                />
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}


                        </Row>
                        <div className="boxcontent">
                            <div className="mt-3-bookads" style={{ height: '100px', width: '103%', backgroundColor: 'white' }}>
                                <div className="book-container d-flex align-items-center position-relative">
                                    <input type="checkbox" className="mr-3" />
                                    <img
                                        src="https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcT3AgA_TP6_BeBL9OTttT0fk_RMJdyWkrvqeK2Ns5RpJff-n9ci"
                                        alt="Book cover"
                                        className="bookcover"
                                    />
                                    <div className="book-info ml-3 d-flex flex-column justify-content-between">
                                        <div className="books">
                                            <div className="book-title mb-1">ThePowerof Pivotin</div>
                                            <div className="book-author mb-1">123DFF450.Monica Ortega</div>
                                        </div>
                                        <div className="book-tags">
                                            {this.state.tags
                                                .filter(tagGroup => tagGroup.id === 2)  // Filter tags for the specific ID (in this case, 2)
                                                .map((tagGroup, tagIndex) => (
                                                    <div key={tagIndex} className="tag-group specific-div">
                                                        {tagGroup.labels.map((label, index) => (
                                                            <div key={index} className="tag mr-2">
                                                                {label}{' '}
                                                                <span
                                                                    className="tag-remove"
                                                                    onClick={() => this.removeTag(tagGroup.id, index)}
                                                                >
                                                                    x
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ))}
                                        </div>


                                    </div>

                                </div>
                                {/* Button container at the bottom right */}
                                <div className="button-container">
                                    {/* Button at the bottom right */}
                                    <Dropdown className="threedot-dropdown">
                                        <Dropdown.Toggle variant="light" id="dropdown-basic1">
                                            {/* You can use your three-dot image or any other icon */}
                                            <img
                                                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmN2XDX7N1ldsuC0SSWEZkKWIVIMha1ey_rehGeOYa4A&s"
                                                alt="Threedots"
                                                className="threedot"
                                            />
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu>
                                            {/* Dropdown items go here */}
                                            <Dropdown.Item>Action</Dropdown.Item>
                                            <Dropdown.Item>Another Action</Dropdown.Item>
                                            <Dropdown.Item>Something else here</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>

                                    <button
                                        className="buttoncreates"
                                        onClick={() => {
                                            // Add your button click logic here
                                            console.log("Button Clicked");
                                        }}
                                    >
                                        Create Ads
                                    </button>
                                </div>
                            </div>



                            <hr />
                            <Row>
                                <Col>
                                    <div className="country-selector">
                                        <div className="country-option" data-country="usa">
                                            <img src="data:image/png;base64,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" alt="USA Flag" />
                                            US
                                        </div>
                                        <div className="country-option" data-country="canada">
                                            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRJKje3oiIRo8Bp6vfjsBwBYTRmyQ5JDQr16lX-24TYg&s" alt="Canada Flag" />
                                            CA
                                        </div>
                                        <div className="content">
                                            <img src="data:image/png;base64,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"
                                                alt="Icon"
                                            />
                                            Advertise Everywhere
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                            <Row className="scrollable-cards">

                                {this.state.cards.map((card) => (
                                    <Col md={6} key={card.id} className="Cardsbackground">
                                        <Card className="mb-3 card-with-shadow">
                                            <Card.Body className="custom-scrollbar">
                                                {/* Custom content */}
                                                <div className="custom-card">
                                                    <div className="aligncards">
                                                        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAaVBMVEX///8AAAD29vbs7Oy5ublYWFifn5/Jycnx8fGTk5ODg4Ojo6PX19enp6dRUVHm5uZ9fX2JiYljY2Pg4ODDw8PPz880NDRcXFwlJSUQEBAvLy9NTU0/Pz+NjY0YGBh3d3coKChFRUWysrIb42ebAAACRUlEQVR4nO3d227CMBBFURISroFCIFBoKYX//8heSGH8UmnGdupGe70f6Yg4JEgePBgAAAAAAAAAAAAAAAAAAID/a9hUuUd8UjXDYF1iKHbZp7IyxqvyK74rgnYKapm1pqb49CdeBu4VzD67Wxjii0d8H7xbEEUmTNTxiYynuVBfZMWROj6S8ZcI/fzJhtlSHV86+Qj9vD05DZ/V+Wcn/xShoS/nPspe1flXJ6+/jztwkA1X6vhKxg8R+vlby4qNOt7I+DpCP3+5aGh5Zpci7/PmF1Hj11B8QvoV0JHqeCtY2y5BXt/iR+t7bRfGs7KebszxzakuZ+OAfQAAAAAAAAAAAAAAAAAAwP+WF6O5z97C7XxUJLp79qbdq22ZmPmysO4R78rw7WePr22q5z5V9Jbq/JqYmDgb4udHXD+t0QkxmZVl+n3CGxm3rvO4jrLiSR0/yfgxQj9/sqFh7skZDGPu6U/kTkP9eJ17DZN8KL7LhvqxHmeoKM37sP/fpfIiWl5LxPDae+BmoQzv83m2Yez7aNch1XeaQd6+luiHgG/aUeBzkl8zrd7/tgAAAAAAAAAAAAAAAAAAAJ3q+3+y9/5/9cd+W+3FZv9EL6M8huViyF9EPslDWNxxAv1VGMt4mmeUyIa9PGfG96ygnZNPcZn2f+7JXaX6iYvSyUfo5885VmyujjvnrumH+7qwlRX1D0TnPt5G6BdA/Wh4NcSvj3gdvFsgoc6wTHONfuv9OaSD/p8lCwAAAAAAAAAAAAAAAAAAfvcByzEP5H6NBvQAAAAASUVORK5CYII=" className="sixdots" />
                                                        <h5 className="aligncampaign">{card.title}</h5>

                                                        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAb1BMVEX///8AAADMzMxwcHD4+Pjg4OApKSnw8PCwsLDR0dG4uLj8/Pzl5eXp6el2dnYhISFjY2PY2Ninp6cUFBR9fX2Tk5MNDQ1ZWVkuLi6bm5tKSkpFRUXOzs43NzdgYGA9PT0ZGRkkJCSDg4NPT0/BwcED9THZAAAEQklEQVR4nO2d23aqMBRFRVHwVtF6odWjtvr/33i07CC9CCZZxGSMNZ9ld0+bkmizSKdDCCGEEEIIIYQQQgghhBBCCCGEEEJCZTrcdc3YDSfPbr6Z3csgsmGWjZ6tUEv6aqUnrOJne9xj+A/hd8XT3+Mbyu9C79kyf/ECFIyi9/GzfX6xhApG0fbZQj9ZVJrL9z0zskOlysuzlb7Tv3X2NjUfYOMkzctCft1uTqqtT+tS5WhY+zRpnJHv+1xNqitAMRRb6SmFVJur9wtSDcJUOkLNYmqgnkH17FEdwf5wZG2boepZsykaWsIKpkXBGaygLfKWd2EFExkUvnyYStZFPwms4lim/iGsoh2Top0jcP7KipI7XEUrZEEzABr20OPeDhoaQEPH0NAAGjqGhgbQ0DE0NICGjqGhATR0DA0NoKFjaGgADR1DQwNo6BgaGkBDx9DQABo6hoYG0NAxNDSAho6hoQE0hJBM+nVUXhmi4XSxGchWrnvMbptlwzPsbu+LVSh3f4Zm2D/dl/pGmRcIzHBxX+kHH+qSsAw1giEbdU1QhjrRnvJ2GpLht3DWcVBDns3LqwIyHN70lt0krqVyWUCGZX6wp9VsOIapEtQMhoRjqNI4utGeYAy7IqgdzgrGUM0U2hcGYyi5kDftC0MxVPGsqfaVkrd4BRrui5LYvIVMhrl+AjSRWxQwMyNJUmxmZlcU3Rtcmpvdg+9jPp7qkFupSYZQMjy4MJ2sHnNYwS8sDNVSARY1k3rgOLeFYSwdvYNa+YzauNHYGKphCkhyXxlJtSOk2g0bwzKbjFA0XR43YmOoZujLQLX9W4zLUgfLSr+wMkyOqq8oGzV8sqwh6Va+RYEHSK0My2X7F6913w7UcKwW0V89PtijaaY+jbC08OAPS0OwIi75fsPWsNM91jetwwIodmvQ1rCToB4zdOo3/zAD7A0v82JW3/pDbNt6HAbC8DKdpb3c/JFm68Fmgf08UQVjeCWe1v7n8T4T3CfMv8AZ+goNw4eG4UPD8KGhCf3NR2trMH1aMCy+vvHm+YctGBbrcG+eSYY3jOXb/nY+C+nTguGAhm6hoT40dA0N9aGha2ioDw1dQ0N9aOgaGupDQ9fQUB8auoaG+tDQNTTUh4auoaE+vhlK3gJ4Pk8sW/l8OS1GMjMH3LF8ch7Out2dTo8j6SVgtkfG/QBW0JZZ0RBuh7zs2d40v9IRsnMSFsVROZNWdsMacQZ3pGIF7W2n1EY6iubNL30Ate/bp+M2V9LTGqGooj3ePCfoSlw+ksZ+oKpwVnQCNIajfN+jQZpYnCY6rTx9wpcFjVDdbH/IDE+E3eeVKv7cSIX3CEsbwRA7xlhFz870LUAePo0PZ0EYNTzk62H++XI+4y/iVXP3zRzRCVAs52xmpZcvfZrn7zAZ7rpm7IYerUQJIYQQQgghhBBCCCGEEEIIIYQQQogm/wFN7i5k+IYVwgAAAABJRU5ErkJggg==" className="align22" />
                                                        <p className="align2">{card.content}</p>
                                                        <img src="https://icons.veryicon.com/png/o/commerce-shopping/soft-designer-online-tools-icon/delete-77.png" className="align3" />
                                                        <button onClick={() => this.removeCard(card.id)} className="removebutton">
                                                            Remove
                                                        </button>
                                                        <img
                                                            src="https://cdn-icons-png.flaticon.com/512/7613/7613767.png"
                                                            className="align4"
                                                            alt="icon"
                                                        />
                                                    </div>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        </div>
                        <div className="boxcontent1">
                            <div className="mt-3-bookads" style={{ height: '100px', width: '103%', backgroundColor: 'white' }}>
                                <div className="book-container d-flex align-items-center position-relative">
                                    <input type="checkbox" className="mr-3" />
                                    <img
                                        src="https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcT3AgA_TP6_BeBL9OTttT0fk_RMJdyWkrvqeK2Ns5RpJff-n9ci"
                                        alt="Book cover"
                                        className="bookcover"
                                    />
                                    <div className="book-info ml-3 d-flex flex-column justify-content-between">
                                        <div className="books">
                                            <div className="book-title mb-1">ThePowerof Pivotin</div>
                                            <div className="book-author mb-1">123DFF450.Monica Ortega</div>
                                        </div>
                                        <div className="book-tags">
                                            {this.state.tags
                                                .filter(tagGroup => tagGroup.id === 3)  // Filter tags for the specific ID (in this case, 2)
                                                .map((tagGroup, tagIndex) => (
                                                    <div key={tagIndex} className="tag-group specific-div">
                                                        {tagGroup.labels.map((label, index) => (
                                                            <div key={index} className="tag mr-2">
                                                                {label}{' '}
                                                                <span
                                                                    className="tag-remove"
                                                                    onClick={() => this.removeTag(tagGroup.id, index)}
                                                                >
                                                                    x
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ))}
                                        </div>


                                    </div>
                                </div>
                                {/* Button at the bottom right */}
                                <Dropdown className="threedot-dropdown">
                                    <Dropdown.Toggle variant="light" id="dropdown-basic1">
                                        {/* You can use your three-dot image or any other icon */}
                                        <img
                                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmN2XDX7N1ldsuC0SSWEZkKWIVIMha1ey_rehGeOYa4A&s"
                                            alt="Threedots"
                                            className="threedot"
                                        />
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        {/* Dropdown items go here */}
                                        <Dropdown.Item>Action</Dropdown.Item>
                                        <Dropdown.Item>Another Action</Dropdown.Item>
                                        <Dropdown.Item>Something else here</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>

                                <button
                                    className="buttoncreates"
                                    onClick={() => {
                                        // Add your button click logic here
                                        console.log("Button Clicked");
                                    }}
                                >
                                    Create Ads
                                </button>
                            </div>
                            <hr />
                            <Row>
                                <Col>
                                    <div className="country-selector">
                                        <div className="country-option" data-country="usa">
                                            <img src="data:image/png;base64,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" alt="USA Flag" />
                                            US
                                        </div>
                                        <div className="country-option" data-country="canada">
                                            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRJKje3oiIRo8Bp6vfjsBwBYTRmyQ5JDQr16lX-24TYg&s" alt="Canada Flag" />
                                            CA
                                        </div>
                                        <div className="content">
                                            <img src="data:image/png;base64,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"
                                                alt="Icon"
                                            />
                                            Advertise Everywhere
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                            <Row className="scrollable-cards">

                                {this.state.cards.map((card) => (
                                    <Col md={6} key={card.id} className="Cardsbackground">
                                        <Card className="mb-3 card-with-shadow">
                                            <Card.Body className="custom-scrollbar">
                                                {/* Custom content */}
                                                <div className="custom-card aligncards">
                                                    <img
                                                        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAaVBMVEX///8AAAD29vbs7Oy5ublYWFifn5/Jycnx8fGTk5ODg4Ojo6PX19enp6dRUVHm5uZ9fX2JiYljY2Pg4ODDw8PPz880NDRcXFwlJSUQEBAvLy9NTU0/Pz+NjY0YGBh3d3coKChFRUWysrIb42ebAAACRUlEQVR4nO3d227CMBBFURISroFCIFBoKYX//8heSGH8UmnGdupGe70f6Yg4JEgePBgAAAAAAAAAAAAAAAAAAID/a9hUuUd8UjXDYF1iKHbZp7IyxqvyK74rgnYKapm1pqb49CdeBu4VzD67Wxjii0d8H7xbEEUmTNTxiYynuVBfZMWROj6S8ZcI/fzJhtlSHV86+Qj9vD05DZ/V+Wcn/xShoS/nPspe1flXJ6+/jztwkA1X6vhKxg8R+vlby4qNOt7I+DpCP3+5aGh5Zpci7/PmF1Hj11B8QvoV0JHqeCtY2y5BXt/iR+t7bRfGs7KebszxzakuZ+OAfQAAAAAAAAAAAAAAAAAAwP+WF6O5z97C7XxUJLp79qbdq22ZmPmysO4R78rw7WePr22q5z5V9Jbq/JqYmDgb4udHXD+t0QkxmZVl+n3CGxm3rvO4jrLiSR0/yfgxQj9/sqFh7skZDGPu6U/kTkP9eJ17DZN8KL7LhvqxHmeoKM37sP/fpfIiWl5LxPDae+BmoQzv83m2Yez7aNch1XeaQd6+luiHgG/aUeBzkl8zrd7/tgAAAAAAAAAAAAAAAAAAAJ3q+3+y9/5/9cd+W+3FZv9EL6M8huViyF9EPslDWNxxAv1VGMt4mmeUyIa9PGfG96ygnZNPcZn2f+7JXaX6iYvSyUfo5885VmyujjvnrumH+7qwlRX1D0TnPt5G6BdA/Wh4NcSvj3gdvFsgoc6wTHONfuv9OaSD/p8lCwAAAAAAAAAAAAAAAAAAfvcByzEP5H6NBvQAAAAASUVORK5CYII="
                                                        className="sixdots"
                                                    />
                                                    <h5 className="aligncampaign">{card.title}</h5>
                                                    <img
                                                        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAb1BMVEX///8AAADMzMxwcHD4+Pjg4OApKSnw8PCwsLDR0dG4uLj8/Pzl5eXp6el2dnYhISFjY2PY2Ninp6cUFBR9fX2Tk5MNDQ1ZWVkuLi6bm5tKSkpFRUXOzs43NzdgYGA9PT0ZGRkkJCSDg4NPT0/BwcED9THZAAAEQklEQVR4nO2d23aqMBRFRVHwVtF6odWjtvr/33i07CC9CCZZxGSMNZ9ld0+bkmizSKdDCCGEEEIIIYQQQgghhBBCCCGEEEJCZTrcdc3YDSfPbr6Z3csgsmGWjZ6tUEv6aqUnrOJne9xj+A/hd8XT3+Mbyu9C79kyf/ECFIyi9/GzfX6xhApG0fbZQj9ZVJrL9z0zskOlysuzlb7Tv3X2NjUfYOMkzctCft1uTqqtT+tS5WhY+zRpnJHv+1xNqitAMRRb6SmFVJur9wtSDcJUOkLNYmqgnkH17FEdwf5wZG2boepZsykaWsIKpkXBGaygLfKWd2EFExkUvnyYStZFPwms4lim/iGsoh2Top0jcP7KipI7XEUrZEEzABr20OPeDhoaQEPH0NAAGjqGhgbQ0DE0NICGjqGhATR0DA0NoKFjaGgADR1DQwNo6BgaGkBDx9DQABo6hoYG0NAxNDSAho6hoQE0hJBM+nVUXhmi4XSxGchWrnvMbptlwzPsbu+LVSh3f4Zm2D/dl/pGmRcIzHBxX+kHH+qSsAw1giEbdU1QhjrRnvJ2GpLht3DWcVBDns3LqwIyHN70lt0krqVyWUCGZX6wp9VsOIapEtQMhoRjqNI4utGeYAy7IqgdzgrGUM0U2hcGYyi5kDftC0MxVPGsqfaVkrd4BRrui5LYvIVMhrl+AjSRWxQwMyNJUmxmZlcU3Rtcmpvdg+9jPp7qkFupSYZQMjy4MJ2sHnNYwS8sDNVSARY1k3rgOLeFYSwdvYNa+YzauNHYGKphCkhyXxlJtSOk2g0bwzKbjFA0XR43YmOoZujLQLX9W4zLUgfLSr+wMkyOqq8oGzV8sqwh6Va+RYEHSK0My2X7F6913w7UcKwW0V89PtijaaY+jbC08OAPS0OwIi75fsPWsNM91jetwwIodmvQ1rCToB4zdOo3/zAD7A0v82JW3/pDbNt6HAbC8DKdpb3c/JFm68Fmgf08UQVjeCWe1v7n8T4T3CfMv8AZ+goNw4eG4UPD8KGhCf3NR2trMH1aMCy+vvHm+YctGBbrcG+eSYY3jOXb/nY+C+nTguGAhm6hoT40dA0N9aGha2ioDw1dQ0N9aOgaGupDQ9fQUB8auoaG+tDQNTTUh4auoaE+vhlK3gJ4Pk8sW/l8OS1GMjMH3LF8ch7Out2dTo8j6SVgtkfG/QBW0JZZ0RBuh7zs2d40v9IRsnMSFsVROZNWdsMacQZ3pGIF7W2n1EY6iubNL30Ate/bp+M2V9LTGqGooj3ePCfoSlw+ksZ+oKpwVnQCNIajfN+jQZpYnCY6rTx9wpcFjVDdbH/IDE+E3eeVKv7cSIX3CEsbwRA7xlhFz870LUAePo0PZ0EYNTzk62H++XI+4y/iVXP3zRzRCVAs52xmpZcvfZrn7zAZ7rpm7IYerUQJIYQQQgghhBBCCCGEEEIIIYQQQogm/wFN7i5k+IYVwgAAAABJRU5ErkJggg=="
                                                        className="align22"
                                                    />
                                                    <p className="align2">{card.content}</p>
                                                    <img
                                                        src="https://icons.veryicon.com/png/o/commerce-shopping/soft-designer-online-tools-icon/delete-77.png"
                                                        className="align3"
                                                    />
                                                    <button onClick={() => this.removeCard(card.id)} className="removebutton">
                                                        Remove
                                                    </button>
                                                    <img
                                                        src="https://cdn-icons-png.flaticon.com/512/7613/7613767.png"
                                                        className="align4"
                                                        alt="icon"
                                                    />
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        </div>
                    </div>
                </div>
            </DashboardLayout >

        );
    }
}

export default AdsCreations;
