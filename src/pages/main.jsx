import React from "react";
import Menu from "../components/menu";
import Header from "../components/header";
import { Route, Routes } from "react-router-dom";
import Dashboard1 from "./dashboard-1";
import Dashboard2 from "./dashboard-2";
import Setting from "./setting";
import UserManagement from "./userManagement";
import ProjectManagement from "./projectManagement";
import Leads from "./leads";
import Quotations from "./quotations";
import Services from "./services";
import Contract from "./contract";
import useAuth from '../useAuth'; // Import the custom hook
import withAuthorization from "../withAuthorization";
import ContractItem from "./contractItem";


 // Setting User Role Page

const UserManagementWithAuth = withAuthorization(UserManagement, ["SuperAdmin", "Director", "Admin",]);
const LeadsWithAuth = withAuthorization(Leads, ["SuperAdmin", "Director" ,  "SalesAgent"]);
const ProjectManagementWithAuth = withAuthorization(ProjectManagement, ["SuperAdmin", "Director", "SalesAgent"]);
const QuotationsWithAuth = withAuthorization(Quotations, ["SuperAdmin", "Director", "SalesAgent"]);
const ServicesWithAuth = withAuthorization(Services, ["SuperAdmin", "Director" , "Admin"]);
const SettingsWithAuth = withAuthorization(Setting, ["SuperAdmin", "Director ", "Admin", "SalesAgent"]);
const Dashboard1WithAuth = withAuthorization(Dashboard1, ["SuperAdmin", "Director", "Admin", "SalesAgent"]);
const ContractWithAuth = withAuthorization(Contract, ["SuperAdmin", "Director", "Admin"]);
const ContractItemWithAuth = withAuthorization(ContractItem, ["SuperAdmin", "Director", "Admin"]);

function Main() {

  useAuth(); // Call the custom hook to check for authentication


  return (
    <>
      <div className="layoutPage">
        <div className="menu"><Menu /></div>

        <div className="mainPage">
          <div className="header"><Header /></div>

          <div className="mainContent">
            <Routes>
              <Route exact path="/" element={<Dashboard1WithAuth />} />
              <Route exact path="/dashboard-2" element={<Dashboard2 />} />
              <Route exact path="/user-management" element={<UserManagementWithAuth />} />
              <Route exact path="/project-management" element={<ProjectManagementWithAuth />} />
              <Route exact path="/leads" element={<LeadsWithAuth />} />
              <Route exact path="/quotations" element={<QuotationsWithAuth />} />
              <Route exact path="/services" element={<ServicesWithAuth />} />
              <Route exact path="/settings" element={<SettingsWithAuth />} />
              <Route path="/contract" element={<ContractWithAuth />} />
              <Route path="/contract/:contractTypeId" element={<ContractItemWithAuth />} />

            </Routes>
          </div>
        </div>
      </div>
    </>
  );
}

export default Main;
