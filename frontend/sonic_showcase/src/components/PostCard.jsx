import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../utilities';
import blankProfilePicture from '../assets/blank-profile-picture-973460_640.png';

export default function PostCard() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPostsAndTracks = async () => {
        try {
            // getting all posts
            const response = await api.get('/post/all/');
            const fetchedPosts = response.data;

            // getting track details if exist and user details for the posts
            const postsWithDetails = await Promise.all(
                fetchedPosts.map(async (post) => {
                    if (post.track_id) {
                        try {
                            const trackResponse = await api.get(`/post/get-track-by-id/${post.track_id}/`);
                            post.track = trackResponse.data;
                        } catch (error) {
                            console.error('Failed to load track for post:', post.id, error);
                        }
                    }
                    try {
                        const userResponse = await api.get(`/user/get-user-by-id/${post.user_id}/`);
                        post.userDetails = userResponse.data;
                    } catch (error) {
                        console.error('Failed to load user details for post:', post.id, error);
                    }

                    return post;
                })
            );

            setPosts(postsWithDetails);
            setLoading(false);
        } catch (error) {
            console.error('An error occurred while fetching the posts:', error);
            setLoading(false);
        }
    };

    fetchPostsAndTracks();
  }, []);


  const handlePostClick = (postId) => {
    navigate(`/home/post/${postId}`);
  };

  if (loading) {
    return <div className='w-screen h-screen bg-gradient-to-br from-purple-700 to-gray-800'>Loading...</div>;
  }

  return (
    <div className='pt-2 w-screen flex flex-col items-center bg-gradient-to-br from-purple-700 to-gray-800 overflow-hidden' style={{ maxHeight: '100vh', overflowY: 'auto' }}>

      {posts.map((post) => (
        <div key={post.id} onClick={() => handlePostClick(post.id)} className="cursor-pointer mt-5 mb-5 lg:w-4/6 lg:h-1/2 sm:w-full sm:h-full ring-1 break-words ring-gray-500 rounded-xl hover:ring-4 bg-slate-900 text-neutral-300">

          <div className='flex flex-row justify-start break-words items-center w-full border-b-2 border-gray-500 p-4'>

            <img className='w-10 h-10 ring-1 ring-gray-500 rounded-full object-cover' src={post.userDetails.profile_picture ? post.userDetails.profile_picture : blankProfilePicture} />

            <p className='pl-4 text-xl'>{post.userDetails.username}</p>
          </div>

          <div className='pl-4 pt-4 text-lg font-semibold underline overflow-ellipsis overflow-hidden'>{post.post_title}</div>

          <div className='flex flex-row h-full break-words flex-wrap'>

            <div className='pt-4 pl-4 h-auto pr-3 overflow-hidden break-words'>{post.post_content}</div>
            
            <div className='flex flex-row justify-around items-center w-full pb-8'>

              {/* checking if there is a file for the post */}
              {post.post_file && (
                <div className='w-auto max-w-md pl-6 pr-6 pt-6'>
                  {post.post_file.endsWith('.mp4') ? (
                    <video src={post.post_file} className='object-cover ring-2 ring-gray-500 h-5/6 w-full rounded-xl' controls />
                  ) : (
                    <img src={post.post_file} className='object-cover ring-2 ring-gray-500 h-5/6 w-full rounded-xl' />
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
