import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../utilities';
import { useContext } from 'react';
import { AppContext } from '../../contexts/AppContext';
import CommentIcon from '../assets/CommentIcon';
import AutoGrowingTextarea from '../assets/AutoGrowingTextField';
import ArrowIcon from '../assets/ArrowIcon';
import { useNavigate } from 'react-router-dom';
import blankProfilePicture from '../assets/blank-profile-picture-973460_640.png';

export default function OnePost() {
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const { postId } = useParams();
  const [likes, setLikes] = useState('0')
  const { user, userLoading } = useContext(AppContext)
  const [ isLiked, setIsLiked ] = useState(false)
  const [ fillColor, setFillColor ] = useState('')
  const [ outline, setOutline ] = useState('')
  const [ commentText, setCommentText ] = useState('')
  const [ comments, setComments ] = useState([])
  const [ commentsUpdated, setCommentsUpdated] = useState(false);
  const navigate = useNavigate()

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        // requesting post
        const response = await api.get(`/post/get-post/${postId}/`);
        const fetchedPost = response.data;
  
        // fetching track data if exists
        if (fetchedPost.track_id) {
          try {
            const trackResponse = await api.get(`/post/get-track-by-id/${fetchedPost.track_id}/`);
            fetchedPost.track = trackResponse.data;
          } catch (error) {
            console.error('Failed to load track for post:', fetchedPost.id, error);
          }
        }
  
        // fetching user information for the user who made the post
        try {
          const userResponse = await api.get(`/user/get-user-by-id/${fetchedPost.user_id}/`);
          fetchedPost.userDetails = userResponse.data;
        } catch (error) {
          console.error('Failed to load user details for post:', fetchedPost.id, error);
        }
  
        setPost(fetchedPost);

        setLoading(false);
        
      } catch (error) {
        console.error('An error occurred while fetching the post:', error);
        if (user) {
          setLoading(false);
        }
      }
  };
  
    fetchPostDetails();
  }, [postId]);
  


    const fetchAndInitiateLikes = async () => {
        try {

        if (userLoading || !user) {
            console.warn('User or user.id is not available')
            return;
        }
        // getting the likes of the post
        const response = await api.get(`/post/${postId}/likes/`);

        // checking to see if the current user has liked the post and returning a boolean response
        const likedByCurrentUser = response.data.some(like => {
            return like.user_id === user.id;
        });
        setLikes(response.data.length);
        setIsLiked(likedByCurrentUser);

        // setting colors of like icon
        if (likedByCurrentUser) {
            setFillColor('#9C27B0');
            setOutline('#9C27B0');
        } else {
            setFillColor('none');
            setOutline('#FFFFFF');
        }
        } catch (error) {
        console.error('An error occurred while fetching the likes:', error);
        }
    };

    const likePost = async () => {
        try {
        await api.post(`/like/like-a-post/${postId}/`);
        fetchAndInitiateLikes();
        } catch (error) {
        console.error('An error occurred while like the post:', error);
        }
    };

    useEffect(() => {

        if(!user){
            return
        }

        fetchAndInitiateLikes();
    }, [postId, user, userLoading]);

    useEffect(() => {

        if(!user){
            return
        }

        if (isLiked) {
          setFillColor('#9C27B0');
          setOutline('#9C27B0');
        } else {
          setFillColor('none');
          setOutline('#FFFFFF');
        }
      }, [isLiked, user]);

      const handleSubmitComment = async () => {
        const data = {
            post_id: postId,
            comment_content: commentText
        }
        try {
            const response = await api.post('/comment/create-a-comment/', data)
            
            if(response.status === 201) {
                setCommentText('')
                setCommentsUpdated(!commentsUpdated)
            }
        } catch(error){
            console.error("error creating comment", error.response.data)
        }
    };

    const handleProfileClick = () => {
      if(post.userDetails.id === user.id){
        navigate('/home/my-profile')
      } else {
        navigate(`/home/user/${post.userDetails.username}`)
      }
    }

    useEffect(() => {
        const getAllComments = async () => {
            try {
                const response = await api.get(`/post/${postId}/comments/`)
                setComments(response.data)
            } catch(error) {
                console.error('an error occurred getting comments:', error)
            }
        }

        getAllComments();
    },[commentsUpdated])

    if (loading) {
        return <div className='w-screen h-screen bg-black'>Loading...</div>;
    }

    if (!post) {
        return <div className='w-screen h-screen bg-black'>Post not found.</div>;
    }

    return (
        <div className='md:pt-16 md:pb-6 pb-20 w-screen h-screen flex flex-col items-center bg-black overflow-y-scroll overflow-x-hidden'>

            <div className="mt-5 w-5/6 h-fit ring-1 ring-purple-700 rounded-xl bg-gray-900 text-neutral-300">

                {/* displaying only after the user promise has been completed */}
                {post.userDetails &&(
                    <div onClick={handleProfileClick} className='flex flex-row justify-start items-center w-full border-b-2 border-gray-700 p-4 hover:cursor-pointer hover:bg-gray-700 rounded-tr-xl rounded-tl-xl'>
                        <img className='w-10 h-10 ring-1 ring-gray-500 rounded-full object-cover' src={post.userDetails.profile_picture ? post.userDetails.profile_picture : blankProfilePicture} />
                        <p className='pl-4 text-xl'>{post.userDetails.username}</p>
                    </div>
                )}

            <div className='pl-4 pt-4 text-xl font-semibold underline overflow-ellipsis overflow-hidden'>{post.post_title}</div>

            <div className='flex flex-row flex-wrap justify-between'>

                <div className='pt-4 pb-2 pl-4 pr-3 overflow-ellipsis overflow-hidden' >{post.post_content}</div>

                <div className='flex md:flex-row flex-col justify-around items-center w-full md:pb-8'>

                {/* checking if a file exists for the post */}
                {post.post_file && (
                  <div className='w-auto md:w-1/2 max-w-2xl pl-6 pr-6 pt-3'>
                    {post.post_file.endsWith('.mp4') ? (
                      <video src={post.post_file} className='object-cover ring-2 ring-gray-500 h-5/6 w-full rounded-xl' controls />
                    ) : (
                      <img src={post.post_file} className='object-cover ring-2 ring-gray-500 h-5/6 w-full rounded-xl' />
                    )}
                  </div>
                )}

                {/* checking if there is a track linked with the post */}
                {post.track && (
                  <div className='w-auto md:w-1/3 pl-0 ml-4 pr-0 mr-4 pt-0 md:pb-2 md:mt-2 rounded-lg flex flex-col justify-center bg-purple-800 ring-2 ring-purple-500 items-center text-center'>
                    <a href={post.track.external_urls.spotify} className='flex justify-center items-center' target='_blank' rel='noopener noreferrer'><img className='w-32 h-20' src='https://upload.wikimedia.org/wikipedia/commons/4/47/Spotify_Badge_White.svg' /></a>
                    <a href={post.track.external_urls.spotify} className='flex justify-center items-center' target='_blank' rel='noopener noreferrer'><img className='ring-2 md:w-2/3 ring-gray-500 rounded-md' src={post.track.album.images[1].url} alt={`Album cover for ${post.track.name}`} /></a>
                    <div className='m-4 bg-gray-700 rounded-md text-center'>{post.track.name} by {post.track.artists[0].name}</div>
                  </div>
                )}

              </div>
            </div>
                <div className='flex flex-row flexwrap justify-between items-center p-2'>

                    <div className='flex flex-row justify-center text-center items-center'>

                        <button onClick={likePost}>

                            <svg className='w-10 h-10 ml-2' viewBox="0 0 48 48" id="b" xmlns="http://www.w3.org/2000/svg">
                                <defs>
                                    <style>{`.c { fill: ${fillColor}; stroke: ${outline}; stroke-linecap: round; stroke-linejoin: round; }`}</style>
                                </defs>
                                <path className="c" d="m43,17.0766c0-5.6539-4.5835-10.2373-10.2374-10.2373-3.7223,0-6.9708,1.9932-8.7626,4.964-1.7919-2.9708-5.0403-4.964-8.7626-4.964-5.6539,0-10.2373,4.5834-10.2373,10.2373,0,1.2925.2496,2.524.6866,3.6627,3.3851,9.7368,18.3134,20.4215,18.3134,20.4215,0,0,14.9282-10.6847,18.3134-20.4215.437-1.1386.6867-2.3702.6867-3.6627Z"/>
                            </svg>
                        </button>

                        <div className='pl-2 text-lg'>{likes}</div>
                    </div>

                        <div className='flex flex-row md:w-full h-10 ml-3 mt-0.5 justify-between items-center'>
                            <CommentIcon className='md:w-10 md:h-10 w-12 h-12 md:pt-0'/>
                            <AutoGrowingTextarea text={commentText} setText={setCommentText} />
                            <button onClick={handleSubmitComment}><ArrowIcon className='ml-2 mr-2 w-10 h-10'/></button>
                        </div>
                    </div>

                    {/* mapping comments through use effect when comment is added by user */}
                    {comments.map((comment) => (
                        <div key={comment.id} className='flex flex-row p-4 border-t border-gray-500'>
                            <div>{comment.user_username}:</div>
                            <div className='ml-2'>{comment.comment_content}</div>
                        </div>
                    ))}
            </div>
        </div>
    );
}
