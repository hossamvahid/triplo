import React from "react"
import Navbar from "./Navbar";

const Layout = ({ children }) => {

    return (
        <>
            <div className="flex flex-col min-h-screen bg-[#FAF9F6]">
                <Navbar />
                <main> {children} </main>
            </div>
        </>
    )
}


export default Layout;