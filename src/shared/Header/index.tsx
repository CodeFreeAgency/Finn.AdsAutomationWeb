import React, { Component, ChangeEvent } from "react";
import "./index.css";
import BellIcon from "../../assets/images/icons/bell-icon.svg";
import ProfileIcon from "../../assets/images/icons/profile-icon.svg";
import ProfileDropIcon from "../../assets/images/icons/profile-down-arrow.svg";
import logouticon from "../../assets/images/icons/logout.png";
import { Nav, Navbar, Container, NavDropdown } from "react-bootstrap";

interface ProfileOption {
  value: string;
  label: string;
  countryCode: string;
}

interface ProfileId {
  onSearch: (selectedAccount: string) => void;
}

interface HeaderProps extends ProfileId {
  countryCode: (selectedAccountCountry: string) => void;
  selectedAccountCountry: string;
}

interface HeaderState {
  userNames: string | null;
  profileOptions: ProfileOption[];
  selectedAccount: ProfileOption | null;
  selectedAccountCountry: string;
  isOpen: boolean; // to manage dropdown visibility
}

class Header extends Component<HeaderProps, HeaderState> {
  constructor(props: HeaderProps) {
    super(props);
    this.state = {
      userNames: null,
      profileOptions: [],
      selectedAccount: null,
      selectedAccountCountry: "",
      isOpen: false,
    };
    this.handleAccountChange = this.handleAccountChange.bind(this);
  }

  handleAccountChange(event: ChangeEvent<HTMLSelectElement>) {
    const selectedValue = event.target.value;
    const selectedOption = event.target.options[event.target.selectedIndex];
    const selectedCountryCode =
      selectedOption.getAttribute("data-country-code") || "";

    const selectedProfile = this.state.profileOptions.find(
      (profile) => profile.value === selectedValue
    );

    if (selectedProfile) {
      this.props.countryCode(selectedProfile.countryCode);
      this.props.onSearch(selectedProfile.value);
      this.setState({ selectedAccount: selectedProfile }, () => {
        this.logSelectedLabel(); // Log the label of the selected option
      });
    }
  }

  handleDropdownToggle = () => {
    this.setState((prevState) => ({
      isOpen: !prevState.isOpen,
    }));
  };

  handleOptionClick = (option: ProfileOption) => {
    this.setState(
      {
        selectedAccount: option,
        isOpen: false,
      },
      () => {
        this.logSelectedLabel(); // Log the label of the selected option
        this.props.countryCode(option.countryCode);
        this.props.onSearch(option.value);
      }
    );
  };

  componentDidMount() {
    this.getProfile();
  }

getProfile = () => {
  const userName = localStorage.getItem("userName");
  const profiles = JSON.parse(localStorage.getItem("profiles") || "[]");

  const profileOptions = profiles.map((profile: any) => ({
    value: profile.profileId,
    label: profile.name,
    countryCode: profile.countryCode,
  }));

  const selectedAccount = profileOptions[0] || null;
  const selectedAccountCountry = selectedAccount
    ? selectedAccount.countryCode
    : "";

  this.setState(
    {
      userNames: userName,
      profileOptions,
      selectedAccount,
      selectedAccountCountry,
    },
    () => {
      if (selectedAccount) {
        this.props.countryCode(selectedAccount.countryCode);
        this.props.onSearch(selectedAccount.value);
      }
    }
  );
};


  logoutHandler = () => {
    localStorage.clear();
  };

  logSelectedLabel = () => {
    const { selectedAccount } = this.state;

    if (selectedAccount && selectedAccount.label) {
      const { label, countryCode } = selectedAccount;
      console.log("Selected Account Label:", label);
      localStorage.setItem("Country", countryCode);
      localStorage.setItem("selectedAccountLabel", label);
    } else {
      console.error("No selected account or label found.");
    }
  };
  

  render() {
    const { selectedAccount, isOpen, profileOptions } = this.state;

    return (
      <Navbar expand="lg" className="bg-body-tertiary page-top-bar">
        <Container fluid>
          {/* <div className="account ms-2">
            <div className="custom-dropdown">
              <div
                className="custom-dropdown-selected"
                onClick={this.handleDropdownToggle}
              >
                {selectedAccount ? (
                  <>
                    {selectedAccount.label} | {selectedAccount.countryCode}
                  </>
                ) : (
                  "Select an option"
                )}

                <i
                  className={`fa fa-angle-down dropdown-icon ${
                    isOpen ? "open" : ""
                  }`}
                ></i>
              </div>
              {isOpen && (
                <div className="custom-dropdown-options">
                  {profileOptions.map((option) => (
                    <div
                      key={option.value}
                      className="custom-dropdown-option"
                      onClick={() => this.handleOptionClick(option)}
                    >
                      {`${option.label} | ${option.countryCode}`}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div> */}
          <Nav className="me-auto my-2 my-lg-0" navbarScroll />
          <Nav className="profile-view justify-content-end">
            {/* <div className="vr"></div> */}
            {/* <Nav.Link href="#" className="bell ms-2 me-2 mt-1">
              <img src={BellIcon} alt="" />
            </Nav.Link> */}
            {/* <div className="vr"></div> */}
            <NavDropdown
              className="ms-4"
              title={
                <div>
                  <div className="profile-icon">
                    <div className="profile-img">
                      <div className="profile-icon d-flex align-items-center">
                        <img src={ProfileIcon} alt="img" />
                        <span
                          className="ms-2"
                          style={{
                            color: "#6b7280",
                            textDecoration: "none !important",
                          }}
                        >
                          {this.state.userNames}
                        </span>
                        <span>
                          <img src={ProfileDropIcon} alt="drop icon" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              }
              id="navbarScrollingDropdown"
            >
              {/* <NavDropdown.Item>
                <div
                  className="myProfileLogo"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "8px",
                  }}
                >
                  <i className="profile-logo" />
                  Profile
                </div>
              </NavDropdown.Item> */}
              <NavDropdown.Item
                href="/sign-in"
                className=""
                onClick={this.logoutHandler}
              >
                <div
                  className="myProfileLogo"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "20px",
                    padding: "8px",
                  }}
                >
                  <img
                    src={logouticon}
                    style={{ width: "20px", height: "20px", marginLeft: "1px" }}
                    alt="logout"
                  />
                  Logout
                </div>
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Container>
      </Navbar>
    );
  }
}

export default Header;
