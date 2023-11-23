import React from 'react'
import Header from '../Header/Header'
import Footer from '../Footer/Footer'
import Sidebar from '../Sidebar/Sidebar'
import { Outlet } from 'react-router-dom'
import LoginPage from '../../Pages/LoginPage/LoginPage'


const Root = () => {
    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex flex-col w-full">
                <Header />
                <div className="flex-grow overflow-auto p-5 bg-gray-100">
                    <Outlet />
                </div>
                <Footer />
            </div>
        </div>
    )
}

export default Root
