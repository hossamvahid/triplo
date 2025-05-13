import React from "react"
import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = ({ children }) => {

    return (
        <>
            <div className="flex flex-col min-h-screen bg-[#FAF9F6]">
                <Navbar />
                <main> {children} </main>
                <Footer/>
            </div>
        </>
    )
}


export default Layout;