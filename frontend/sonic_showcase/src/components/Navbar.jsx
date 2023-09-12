import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import NewPostPage from "./NewPostPage";
import Logo from "../assets/logo";
import SearchLogo from "../assets/searchLogo";
import MessageIcon from "../assets/MessageLogo";
import NewPostIcon from "../assets/NewPostIcon";
import SonicShowcaseLogo from "../assets/SonicLogo";
import blankProfilePicture from '../assets/blank-profile-picture-973460_640.png';
import { api } from '../utilities';
import { useNavigate } from 'react-router-dom';



export default function Navbar() {
    const [showSearch, setShowSearch] = useState(false);
    const [recentUsers, setRecentUsers] = useState([]);
    const [ searchText, setSearchText ] = useState('');
    const navigate = useNavigate()

    // gets 10 users to display when the searchbar pops down
    useEffect(() => {
        const getRecentUsers = async () => {
            const response = await api.get('/user/recent-users/')
            setRecentUsers(response.data)
        }

        getRecentUsers()
    }, [])

    const handleProfileClick = (username) => {
        navigate(`/home/user/${username}`)
    }

    // debounce function automatically refreshing the search results on a time delay
    function debounce(fn, delay) {
        let timer;
        return function (...args) {
            clearTimeout(timer);
            timer = setTimeout(() => {
                fn(...args);
            }, delay);
        };
    }

    const debouncedSearch = debounce(async (query) => {
        if (query) {
            try {
                const response = await api.get(`/user/search-users/?q=${query}`);
                setRecentUsers(response.data);
            } catch (error) {
                console.error('Error searching users:', error);
            }
        } else {
            setRecentUsers([]);
        }
    }, 300);
    
    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchText(query);
        debouncedSearch(query);
    };
    
    return (
        // <>
        //     <div className="fixed top-0 left-0 right-0 flex items-center justify-between z-10 pl-3 pr-3 h-10" style={{ marginTop: '3vh' }}>
        //         <Link to='/home'><SonicShowcaseLogo /></Link>
        //         <div className="flex flex-row justify-evenly items-center space-x-4 pr-4">
        //             <div>
        //                 <Link to='/home/newpost'><NewPostIcon /></Link>
        //             </div>
        //             {/* <div><MessageIcon /></div> */}
        //             {/* plan to implement message functionallity later */}
        //             <div className="relative">
        //                 <div onClick={() => setShowSearch(!showSearch)} className='hover:cursor-pointer'><SearchLogo /></div>
        //                 {showSearch && (
        //                     <div className="absolute top-full w-64 -left-52 h-64 overflow-scroll rounded-md shadow-lg bg-slate-900 ring-1 ring-gray-500">
        //                         <div className="rounded-md bg-slate-900 text-neutral-300 shadow-xs">
        //                             <input className="w-full bg-slate-900 px-3 py-2 border border-gray-500 rounded-tl-md rounded-tr-md" type="text" placeholder="Search..." value={searchText} onChange={handleSearchChange}/>
        //                             <div className='flex flex-col'>
        //                                 {recentUsers.map((user) => (
        //                                     <div key={user.id} onClick={() => handleProfileClick(user.username)} className='p-1 pl-2 pr-2 text-ellipsis bg-slate-900 hover:bg-slate-500 flex flex-row overflow-hidden items-center border-t-2 border-slate-700'>
        //                                         <img className='w-10 h-10 ring-1 ring-gray-500 rounded-full object-cover' src={user.profile_picture ? user.profile_picture : blankProfilePicture} />
        //                                         <p className='ml-2'>{user.username}</p>
        //                                     </div>  
        //                                 ))}
        //                             </div>
        //                         </div>
        //                     </div>
        //                 )}
        //             </div>
        //             <div className="pl-1">
        //                 <Link to='/home/my-profile'><Logo /></Link>
        //             </div>
        //         </div>
        //     </div>
        // </>
        <>
            <div className="fixed bottom-0 md:top-0 md:border-t-0 md:border-b-2 left-0 right-0 flex items-center justify-between border-t-2 border-gray-800 bg-gray-900 z-10 pl-3 pr-3 h-16">
                <Link to='/home' className=''><SonicShowcaseLogo className='w-24 sm:w-32 md:w-40 lg:w-40 xl:w-40 2xl:w-48'/></Link>
                <div className="flex flex-row justify-evenly items-center space-x-4 pr-4">
                    <div>
                        <Link to='/home/newpost'><NewPostIcon className='w-8 sm:w-9'/></Link>
                    </div>
                    {/* <div><MessageIcon /></div> */}
                    {/* plan to implement message functionallity later */}
                    <div className="relative" onMouseEnter={() => setShowSearch(!showSearch)} onMouseLeave={() => setShowSearch(!showSearch)}>
                        <div className='hover:cursor-pointer'><SearchLogo className='w-9'/></div>
                        {showSearch && (
                            <div className="absolute bottom-full md:top-full w-64 -left-52 h-64 overflow-scroll rounded-md shadow-lg bg-slate-900 ring-1 ring-gray-500">
                                <div className="rounded-md bg-slate-900 text-neutral-300 shadow-xs">
                                    <input className="w-full bg-slate-900 px-3 py-2 border border-gray-500 rounded-tl-md rounded-tr-md" type="text" placeholder="Search..." value={searchText} onChange={handleSearchChange}/>
                                    <div className='flex flex-col'>
                                        {recentUsers.map((user) => (
                                            <div key={user.id} onClick={() => handleProfileClick(user.username)} className='p-1 pl-2 pr-2 text-ellipsis bg-slate-900 hover:bg-slate-500 flex flex-row overflow-hidden items-center border-t-2 border-slate-700'>
                                                <img className='w-10 h-10 ring-1 ring-gray-500 rounded-full object-cover' src={user.profile_picture ? user.profile_picture : blankProfilePicture} />
                                                <p className='ml-2'>{user.username}</p>
                                            </div>  
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="pl-1">
                        <Link to='/home/my-profile'><Logo className='w-7'/></Link>
                    </div>
                </div>
            </div>
        </>
    )
}
