import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import "./index.css";
import Root from "./Layout/Main/Root";
import Dashboard from "./Pages/Dashboard/Dashboard";
import EnrollmentRequest from "./Pages/Enrollment Request/EnrollmentRequest";
import PatientManagement from "./Pages/Patient Management/PatientManagement";
import VaccineManagement from "./Pages/Vaccine Management/VaccineManagement";
import SiteManagement from "./Pages/Site Management/SiteManagement";
import UserManagement from "./Pages/User Management/UserManagement";
import AccessManagement from "./Pages/Access Management/AccessManagement";
import ReferenceData from "./Pages/Reference Data/ReferenceData";
import VaccineForecasting from "./Pages/Vaccine Forecasting/VaccineForecating";
import Reports from "./Pages/Reports/Reports";
import User from "./Pages/User/User";
import Organization from "./Pages/Organization/Organization";
import Faculty from "./Pages/Faculty/Faculty";
import VaccineProgram from "./Pages/Vaccine Program/VaccineProgram";
import DataTable from "./components/Data Table/DataTable";
import LoginPage from "./Pages/LoginPage/LoginPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate replace to="/login" />, // Redirect to /login
  },
  {
    path: "/login",
    element: <LoginPage/>
  },
  {
    path: "/",
    element: <Root/>,
    children: [
      {
        path: '/page/dashboard',
        element: <Dashboard />
      },
      {
        path: '/page/enrollment-request',
        element: <EnrollmentRequest />
      },
      {
        path: '/page/patient-management',
        element: <PatientManagement />
      },
      {
        path: '/page/vaccine-management',
        element: <VaccineManagement />
      },
      {
        path: '/page/site-management',
        element: <SiteManagement />
      },
      {
        path: '/page/access-management',
        element: <AccessManagement />
      },
      {
        path: '/page/user-management',
        element: <UserManagement />
      },
      {
        path: '/page/reference-data',
        element: <ReferenceData />
      },
      {
        path: '/page/vaccine-forecasting',
        element: <VaccineForecasting />
      },
      {
        path: '/page/reports',
        element: <Reports />
      },
      {
        path: '/page/users',
        element: <User/>
      },
      {
        path: '/page/organization',
        element: <Organization />
      },
      {
        path: '/page/faculty',
        element: <Faculty />
      },
      {
        path: '/page/vaccine-program',
        element: <VaccineProgram/>
      },
      {
        path: '/page/data-table',
        element: <DataTable/>
      }

    ]
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
