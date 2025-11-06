import { Routes, Route, useLocation } from "react-router-dom";
// import PrivateRoute from './routes/privateRoutes';

import SignUp from "./views/Signup";
import SignupSuccess from "./views/Signup/signupSuccess";
import ResendActicationMail from "./views/Signup/resendActivationMail";
import ResendActicationMailSuccess from "./views/Signup/resendActivationMailSuccess";
import EmailActivation from "./views/Signup/emailActivation";

import Forgotpassword from "./views/Forgotpassword";
import ForgorpasswordSuccess from "./views/Forgotpassword/forgorpasswordSuccess";
import SetNewPassword from "./views/Forgotpassword/setNewPassword";
import Page404 from "./views/Page404";
import SignIn from "./views/Signin";

import AdsCompaignManager from "./views/Ads/adsCompaignManager";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

import AdsCreaction from "./views/Ads/creation";
import CreateManualCampaign from "./views/Ads/creation/components/createManualCampaign";
import CreateAutoCampaign from "./views/Ads/creation/components/createAutoCampaign";
import DashboardNew from "./views/Dashboard_new";

import Header from "./shared/Header";
import { useState } from "react";

import Dashboard from "./views/Dashboard";
import Report from "./views/Reports";


export const App = () => {
  const [searchResult, setSearchResult] = useState("");
  const [selectedAccountCountry, setSelectedAccountCountry] = useState("");
  const location = useLocation();
  const handleSearch = (searchTerm: any) => {
    setSearchResult(searchTerm);
  };
  const handleCountryCode = (searchTerm: any) => {
    setSelectedAccountCountry(searchTerm);
    console.log(selectedAccountCountry);
  };
  return (
    <div className="App">
      <div className="maincont">
        {location.pathname !== "/sign-in" && location.pathname !== "/" && (
          <Header
            onSearch={handleSearch}
            countryCode={handleCountryCode}
            selectedAccountCountry={selectedAccountCountry}
          />
        )}
      </div>

      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/sign-up-success" element={<SignupSuccess />} />
        <Route path="/email-activation" element={<EmailActivation />} />
        <Route
          path="/resend-activation-mail"
          element={<ResendActicationMail />}
        />
        <Route
          path="/resend-activation-mail-success"
          element={<ResendActicationMailSuccess />}
        />

        <Route path="/forgot-password" element={<Forgotpassword />} />
        <Route
          path="/forgot-password/success"
          element={<ForgorpasswordSuccess />}
        />
        <Route path="/set-new-password" element={<SetNewPassword />} />

        <Route path="/sign-in" element={<SignIn />} />

        <Route
          path="/dashboard"
          element={<Dashboard searchResult={searchResult} />}
        />

        <Route path="/dashboard-new" element={<DashboardNew/>}/>

        <Route
          path="/ads/ads-compaign-manager"
          element={<AdsCompaignManager searchResult={searchResult} />}
        />
        <Route path="/ads/ads-creation" element={<AdsCreaction />} />
        <Route
          path="/ads/ads-creation/auto-campaign/:id"
          element={<CreateAutoCampaign />}
        />
        <Route
          path="/ads/ads-creation/auto-campaign/:asin/:id"
          element={<CreateAutoCampaign />}
        />
        <Route
          path="/ads/ads-creation/manual-campaign/:id"
          element={<CreateManualCampaign />}
        />
        <Route
          path="/reports/sales"
          element={
            <Report
              searchResult={searchResult}
              selectedAccountCountry={selectedAccountCountry}
            />
          }
        />
      
      </Routes>
      <ToastContainer
        className="toast-position"
        position="bottom-center"
        autoClose={3000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        // theme="dark"
        style={{ width: "500px" }}
        // #00D26E
      />
    </div>
  );
};

export default App;
