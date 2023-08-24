import React from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import blankProfilePicture from '../assets/blank-profile-picture-973460_640.png';
import { api } from "../utilities";
import { useContext } from "react";
import { AppContext } from "../../contexts/AppContext";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function OtherUsersPage(){

    const { username } = useParams()
    const [ isFollowClicked, setIsFollowClicked ] = useState(false)
    const [ followerCount, setFollowerCount ] = useState(0)
    const [ viewedUser,setViewedUser ] = useState(null)
    const { user } = useContext(AppContext)
    const [ render,setRender ] = useState(false)
    const [ posts,setPosts ] = useState([])
    const navigate = useNavigate()
    const initialRender =useRef(true)

    useEffect(() => {
        const getUserAndPosts = async () => {
            try {
                // getting the users profile being viewed
                const response = await api.get(`/user/get-user-by-username/${username}/`);
                const viewedUserData = response.data;
    
                setViewedUser(viewedUserData);
                setFollowerCount(viewedUserData.followers.length);
                
                // checking if the viewing user follows the user being viewed
                if (viewedUserData.followers.includes(user.id)) {
                    setIsFollowClicked(true);
                }
    
                // getting the viewed users posts
                const postResponse = await api.get(`/user/${response.data.id}/all-posts/`);
                const fetchedPosts = postResponse.data;
                
                // if the post has a track linked loading that data
                const postsWithTracks = await Promise.all(
                    fetchedPosts.map(async (post) => {
                        if (post.track_id) {
                            try {
                                const trackResponse = await api.get(`/post/get-track-by-id/${post.track_id}/`);
                                post.track = trackResponse.data;
                            } catch (error) {
                                console.error('Failed to load track for post:', post.id, error);
                            }
                        }
                        return post;
                    })
                );
    
                setPosts(postsWithTracks);
    
            } catch (error) {
                console.error('An error occurred while fetching user data and posts:', error);
            }
        };
    
        getUserAndPosts();
    }, [username]);
    

    useEffect(() => {

        if(initialRender.current){
            initialRender.current=false
            return
        }

        if(isFollowClicked){
            setFollowerCount(prevCount => prevCount + 1);
        } else {
            setFollowerCount(prevCount => prevCount - 1);
        }

    }, [render]);
    

    const followUser = async () => {
        try {
            const response = await api.post(`/user/follow-user/${viewedUser.id}/`)
            setIsFollowClicked(prevState => !prevState);
            setRender(prevState => !prevState)
        } catch (error) {
            console.error('an error arised following this user:', error)
        }
    }

    const handlePostClick = (postId) => {
        navigate(`/home/post/${postId}`);
    };

    if (!viewedUser) {
        return <div className='w-screen h-screen bg-gradient-to-br from-purple-700 to-gray-800'>Loading...</div>;
    }

    return (
        <div className='pt-2 w-screen h-screen flex flex-col items-center bg-gradient-to-br from-purple-700 to-gray-800 overflow-scroll' style={{ maxHeight: '100vh' }}>
          
          <div className="w-5/6 h-auto flex flex-row flex-wrap items-center bg-slate-900 p-10 pt-16 pb-16 ring-2 ring-gray-500 rounded-xl text-neutral-300 m-10 mt-20">
    
        
            <div className="w-full flex flex-row flex-wrap items-center mb-10 justify-between">
                <div className="w-fit flex flex-row flex-wrap items-center text-center">
                    <img 
                        className="w-40 h-40 object-cover rounded-full ring-2 ring-gray-500 mr-8" 
                        src={viewedUser.profile_picture ? viewedUser.profile_picture : blankProfilePicture} 
                    />
    
                     <div className="w-fit text-4xl" >{viewedUser.username}</div>
                </div>
            

                <div className="w-fit flex flex-row justify-center items-center flex-wrap">

                    <div className="w-fit flex flex-col justify-center items-center text-center p-10">
                        <div className="text-2xl" >{followerCount}</div>
                        <div className="text-xl">Followers</div>
                    </div>

                    <div className="w-fit flex flex-col justify-center items-center text-center p-10">
                        <div className="text-2xl">{viewedUser.following.length}</div>
                        <div className="text-xl">Following</div>
                    </div>
                </div>
            </div>
      
            <div className="flex flex-col justify-start border-t-2 w-full border-gray-500">

                <button onClick={followUser} className="relative w-fit mt-10 inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800" >
                    <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                        Follow
                    </span>
                </button>

              <div className="mt-5 lg:text-2xl sm:text-xl" >{viewedUser.email}</div>
              
              {/* checking if the user has a description to show */}
              {viewedUser.description && (
                <div className="mt-5 lg:text-2xl sm:text-xl" >
                    {viewedUser.description}
                </div>
              )}
            </div>
          </div>

          {posts.map((post) => (
                <div key={post.id} onClick={() => handlePostClick(post.id)} className="cursor-pointer mt-5 mb-5 w-5/6 ring-1 ring-gray-500 rounded-xl hover:ring-4 bg-slate-900 text-neutral-300">

                    <div className='pl-4 pt-4 text-lg font-semibold underline overflow-ellipsis overflow-hidden'>{post.post_title}</div>

                    <div className='flex flex-row h-full flex-wrap'>

                        <div className='pt-4 pl-4 pr-3 overflow-ellipsis overflow-hidden'>{post.post_content}</div>
                        
                        <div className='flex flex-row justify-around items-center w-full pb-8'>

                        {/* checking if there is a file for the post */}
                        {post.post_file && (
                            <div className='w-auto max-w-md pl-6 pr-6 pt-6 pb-6 overflow-hidden'>
                            {post.post_file.endsWith('.mp4') ? (
                                <video src={post.post_file} className='object-cover ring-2 ring-gray-500 max-h-5/6 max-w-full rounded-xl' controls />
                            ) : (
                                <img src={post.post_file} className='object-cover ring-2 ring-gray-500 max-h-5/6 max-w-full rounded-xl' />
                            )}
                            </div>
                        )}

                        {/* checking if there is a track linked to the post */}
                        {post.track && (
                            <div className='w-auto pl-6 pr-6 pt-6'>
                                <img className='ring-2 ring-gray-500 rounded-md' src={post.track.album.images[1].url} alt={`Album cover for ${post.track.name}`} />
                                <div className='m-4 bg-gray-700 rounded-md text-center'>{post.track.name} by {post.track.artists[0].name}</div>
                            </div>
                        )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}