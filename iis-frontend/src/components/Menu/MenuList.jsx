import { Menu } from 'antd';
import React from 'react';
import accessManagement from '../../assets/icons/accessManagement.png';
import dashboard from '../../assets/icons/dashboard.png'
import enrollmentRequest from '../../assets/icons/enrollmentRequest.png'
import patientManagement from '../../assets/icons/patientManagement.png'
import vaccineManagement from '../../assets/icons/vaccineManagement.png'
import siteManagement from '../../assets/icons/siteManagement.png'
import userManagement from '../../assets/icons/userManagement.png'
import referenceData from '../../assets/icons/referenceData.png'
import vaccineForecasting from '../../assets/icons/vaccineForecasting.png'
import userImg from '../../assets/icons/user@2x.png'
import reports from '../../assets/icons/reports.png'
import { Link, NavLink } from "react-router-dom";
import { HomeOutlined } from '@ant-design/icons'

const MenuList = () => {
    return (
        <Menu>
            <Menu.Item key="home" icon={<HomeOutlined />}>
                <Link to={"/page/dashboard"} className={({ isActive, isPending }) =>
                    isPending ? "pending" : isActive ? "active" : ""
                }> Dashboard</Link>
            </Menu.Item>
            <Menu.SubMenu key="enrollment-request" icon={<HomeOutlined />}  title={"Enrollment Request"}>
                <Menu.Item key="enrollment-request" icon={<HomeOutlined />}>
                <Link to={"/page/users"}> User </Link>
                </Menu.Item>
            </Menu.SubMenu>
            
            <Menu.Item key="patient-management" icon={<HomeOutlined />}>
                <Link to={"/page/patient-management"}> Patient Management</Link>
            </Menu.Item>
            <Menu.Item key="vaccine-management" icon={<HomeOutlined />}>
                <Link to={"/page/vaccine-management"}> Vaccine Management</Link>
            </Menu.Item>
            <Menu.Item key="site-management" icon={<HomeOutlined />}>
                <Link to={"/page/site-management"}> Site Management</Link>
            </Menu.Item>
            <Menu.Item key="user-management" icon={<HomeOutlined />}>
                <Link to={"/page/user-management"}> User Management</Link>
            </Menu.Item>
            <Menu.Item key="access-management" icon={<HomeOutlined />}>
                <Link to={"/page/access-management"}> Access Management</Link>
            </Menu.Item>
            <Menu.Item key="reference-data" icon={<HomeOutlined />}>
                <Link to={"/page/reference-data"}>Reference Data</Link>
            </Menu.Item>
            <Menu.Item key="vaccine-forecasting" icon={<HomeOutlined />}>
                <Link to={"/page/vaccine-forecasting"}>Vaccine Forecasting</Link>
            </Menu.Item>
            <Menu.Item key="reports" icon={<HomeOutlined />}>
                <Link to={"/page/reports"}>Reports</Link>
            </Menu.Item>
        </Menu>
    );
};

export default MenuList;