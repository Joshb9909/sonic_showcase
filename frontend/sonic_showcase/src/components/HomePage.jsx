import React from "react"
import Navbar from "./Navbar"
import PostCard from "./PostCard"
import { Outlet } from "react-router-dom"

export default function HomePage(){

    return (
        <>
        <Navbar />
        <Outlet />
        </>
    )
}