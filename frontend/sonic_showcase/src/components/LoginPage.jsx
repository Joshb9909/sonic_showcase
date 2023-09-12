import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { api } from "../utilities";
import { useState } from "react";
import { useContext } from "react";
import { AppContext } from "../../contexts/AppContext";
import SonicShowcaseLogo from "../assets/SonicLogo";

export default function LoginPage(){

    const { user, setUser } = useContext(AppContext)
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const logIn = async (e) => {
        e.preventDefault();
        let response = await api.post("user/login/", {
          "username": username,
          "password": password,
        });
        //let token = response.data.token;
        let userResponse = response.data;
        //console.log(userResponse)
        //localStorage.setItem("token", token);
        //api.defaults.headers.common["Authorization"] = `Token ${token}`;
        setUser(userResponse);
        navigate("/home");
      };

    return (
        <>
            <div className="w-screen h-screen bg-gradient-to-br from-purple-700 to-gray-800 flex justify-center items-center overflow-hidden">
                <div className="flex flex-col justify-center items-center w-11/12 h-5/6 md:w-2/3 md:h-5/6 bg-slate-900 text-neutral-300 ring-2 ring-gray-500 rounded-xl overflow-hidden">
                    <div className="">
                        <SonicShowcaseLogo className="h-20 w-40"/>
                    </div>
                    <form className="flex flex-col w-full justify-center items-center" onSubmit={logIn}>
                        <div className="w-5/6 m-2 flex justify-center">
                            <input className="bg-gray-700 ring-1 w-2/3 md:w-1/3 ring-gray-500 rounded-md text-center" placeholder="username" value={username} onChange={(e)=> setUsername(e.target.value)}></input>
                        </div>
                        <div className="w-5/6 m-2 flex justify-center">
                            <input className="bg-gray-700 ring-1 w-2/3 md:w-1/3 ring-gray-500 rounded-md text-center" placeholder="password" type="password" value={password} onChange={(e)=> setPassword(e.target.value)}></input>
                        </div>
                        <div className="m-2">
                            <button type="submit" className="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800" >
                                <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                                    Log In
                                </span>
                            </button>
                        </div>
                    </form>
                    <div className="">
                        <Link to='/register'>
                            <button className="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800" >
                                <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                                    Create an Account
                                </span>
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    )
}
