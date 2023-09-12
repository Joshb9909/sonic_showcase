import React from "react";
import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../../contexts/AppContext";
import { api } from "../utilities";
import blankProfilePicture from '../assets/blank-profile-picture-973460_640.png';

export default function MyProfilePage() {
  const { user, setUser } = useContext(AppContext);
  const [showProfilePictureForm, setShowProfilePictureForm] = useState(false);
  const [showUsernameForm, setShowUsernameForm] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState(user?.password || '');
  const [description, setDescription] = useState(user?.description || '');
  const [profile_picture, setProfilePicture] = useState(user?.profile_picture || blankProfilePicture);
  const [showDescriptionForm, setShowDescriptionForm] = useState(false);
  const [ posts, setPosts ] = useState([]);
  const toggleProfilePictureForm = () => setShowProfilePictureForm(!showProfilePictureForm);
  const toggleUsernameForm = () => setShowUsernameForm(!showUsernameForm);
  const toggleEmailForm = () => setShowEmailForm(!showEmailForm);
  const togglePasswordForm = () => setShowPasswordForm(!showPasswordForm);
  const toggleDescriptionForm = () => setShowDescriptionForm(!showDescriptionForm);   
  const [refresh, setRefresh] = useState(0)
  const [error, setError] = useState(null);
  const [ loading, setLoading ] = useState(true)
  const navigate = useNavigate();
  
  // for updating the information of a specific field of user
  const updateUserContext = (updatedUser) => {
    setUser({ ...user, ...updatedUser });
    pageRefresh()
  };

  const pageRefresh = () => {
    setRefresh(prevRefresh => prevRefresh + 1)
  }

  // patches a specific field change to the api
  const editField = async (field, value) => {
    try {
      let response = await api.patch(`user/edit-${field}/`, { [field]: value });
      if (response.status === 201) {
        updateUserContext({ [field]: value });
      }
    } catch (error) {
      setError(`An error occurred while updating the ${field}.`);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get('/user/info/');
        console.log('got user')
        setUser(response.data);
        const postResponse = await api.get(`/user/${response.data.id}/all-posts/`)
        console.log('got posts')
        const fetchedPosts = postResponse.data

        const postsWithTracks = await Promise.all(
          fetchedPosts.map(async (post) => {
            if (post.track_id) {
              try {
                const trackResponse = await api.get(`/post/get-track-by-id/${post.track_id}/`)
                post.track = trackResponse.data
              } catch(error) {
                console.error('Failed to load track for post:', post.title, error)
              }
            }
            post.userDetails = response.data
            return post;
          })
        )

        setPosts(postsWithTracks)
        setLoading(false)
        
      } catch (error) {
        console.error('Failed to fetch updated user data', error);
      }
    };
  
    fetchUserData();
  }, [refresh]);

  

  const editProfilePicture = async (e) => {
      e.preventDefault();
    
      const formData = new FormData();
      if (profile_picture) {
        formData.append("profile_picture", profile_picture);
      }
    
      try {
        let response = await api.patch("user/edit-profile-picture/", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
    
        if (response.status === 200) {
          const imageUrl = URL.createObjectURL(profile_picture);
          updateUserContext({ profile_picture });
          editProfilePictureUrl(imageUrl);
          console.log(imageUrl)
        }
      } catch (error) {
        setError("An error occurred while updating the profile picture.");
      }
    };

  const handlePostClick = (postId) => {
    navigate(`/home/post/${postId}`);
  };
  
  const editProfilePictureUrl = async (imageUrl) => {
      try {
        console.log(imageUrl)
        let response = await api.patch("user/edit-profile-picture-url/", { profile_picture_url: imageUrl });
        if (response.status === 200) {
          updateUserContext({ profile_picture_url: imageUrl });
        }
      } catch (error) {
        console.error(error.response.data)
        setError("An error occurred while updating the profile picture URL.");
      }
    };

  if (!user) {
  return <div className='w-screen h-screen bg-black'>Loading...</div>;
  }

  if (loading) {
    return <div className='w-screen h-screen bg-black'>Loading...</div>;
  }

  return (
    <div className='pt-2 w-screen h-screen flex flex-col pb-16 md:pb-0 items-center bg-black overflow-x-hidden overflow-y-scroll'>
      <div className="w-11/12 md:w-4/6 md:h-auto h-auto flex flex-col md:flex-row flex-wrap items-center bg-gray-900 md:p-10 p-10 md:pt-16 pb-16 ring-1 ring-purple-700 rounded-md md:rounded-xl text-neutral-300 m-1 mt-5 md:m-10 md:mt-20">

        <div className="w-full flex lg:flex-row flex-col items-center lg:mb-10 lg:justify-between justify-center">
          <div className="w-full flex flex-row flex-wrap lg:flex-nowrap justify-center lg:justify-normal items-center text-center">
            <img 
                className="w-40 h-40 object-cover rounded-full ml-8 lg:ml-0 ring-2 ring-gray-500 mr-8" 
                src={user.profile_picture ? user.profile_picture : blankProfilePicture} 
                onClick={toggleProfilePictureForm}
            />
            {/* checking state to see if profile picture was clicked */}
            {showProfilePictureForm && (
                <form className='w-2/6' onSubmit={editProfilePicture}>
                    <input type="file" accept="image/*" onChange={(e) => setProfilePicture(e.target.files[0])} />
                    <button type="submit">Update Profile Picture</button>
                </form>
            )}

            <div className="w-full lg:w-fit pt-1 lg:pt-0 text-4xl text-center" onClick={toggleUsernameForm}>{user.username}</div>
            {/* checking state to see if username was clicked */}
            {showUsernameForm && (
                <form onSubmit={(e) => { e.preventDefault(); editField("username", username); }}>
                    <input value={username} onChange={(e) => setUsername(e.target.value)} />
                    <button type="submit">Update Username</button>
                </form>
            )}
          </div>

          <div className="w-fit flex flex-row justify-center items-center">

            <div className="w-fit flex flex-col justify-center items-center text-center p-4 md:p-10">
              <div className="text-2xl" >{(user.followers && user.followers.length) ? user.followers.length : 0}</div>
              <div className="text-xl">Followers</div>
            </div>

            <div className="w-fit flex flex-col justify-center items-center text-center p-4 md:p-10">
              <div className="text-2xl">{(user.following && user.following.length) ? user.following.length : 0}</div>
              <div className="text-xl">Following</div>
            </div>
          </div>
        </div>
  
        <div className="flex flex-col justify-start border-t-2 w-full border-gray-500">
          <div className="mt-10 lg:text-2xl sm:text-xl" onClick={toggleEmailForm}>{user.email}</div>
          {/* checking state to see if email was clicked */}
          {showEmailForm && (
            <form onSubmit={(e) => { e.preventDefault(); editField("email", email); }}>
              <input value={email} onChange={(e) => setEmail(e.target.value)} />
              <button type="submit">Update Email</button>
            </form>
          )}
          
          <div className="mt-5 lg:text-2xl sm:text-xl" onClick={toggleDescriptionForm}>
            {user.description ? user.description : 'Create Description'}
          </div>
          {/* checking state to see if description was clicked */}
          {showDescriptionForm && (
            <form onSubmit={(e) => { e.preventDefault(); editField("description", description); }}>
              <input value={description} onChange={(e) => setDescription(e.target.value)} />
              <button type="submit">Update Description</button>
            </form>
          )}

          <div className="mt-5 lg:text-2xl sm:text-xl" onClick={togglePasswordForm}>Reset Password</div>
          {/* checking state to see if reset password was click */}
          {/* inted on updating this to a proper password reset function in the future */}
          {showPasswordForm && (
            <form onSubmit={(e) => { e.preventDefault(); editField("password", password); }}>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              <button type="submit">Update Password</button>
            </form>
          )}
        </div>
  
        {error && <div className="error">{error}</div>}
      </div>

      {posts.map((post) => (
        <div key={post.id} onClick={() => handlePostClick(post.id)} className="cursor-pointer mt-3 mb-3 md:mt-20 md:mb-5 md:w-4/6 md:h-auto w-11/12 h-auto ring-1 break-words ring-purple-700 hover:shadow-neon hover:translate-y-4 transition transform duration-150 rounded-md md:rounded-xl hover:ring-4 bg-gray-900 text-neutral-300">

          <div className='flex flex-row justify-start break-words items-center w-full p-4'>

            <img className='w-10 h-10 ring-1 ring-gray-700 rounded-full object-cover' src={profile_picture} />

            <p className='pl-4 text-xl'>{post.userDetails.username}</p>
          </div>

          <div className='pl-4 pt-4 text-sm md:text-lg font-semibold underline overflow-ellipsis overflow-hidden'>{post.post_title}</div>

          <div className='flex flex-row h-5/6 break-words flex-wrap'>

            <div className='pt-4 pl-4 h-auto pr-3 overflow-hidden break-words'>{post.post_content}</div>
            
            <div className='flex md:flex-row flex-col justify-center md:justify-around items-center w-full pb-8'>

              {/* checking if there is a file for the post */}
              {post.post_file && (
                <div className='w-auto max-w-md pl-6 pr-6 pt-6'>
                  {post.post_file.endsWith('.mp4') ? (
                    <video src={post.post_file} className='object-cover mb-4 ring-2 ring-gray-500 h-5/6 w-full rounded-xl' controls />
                  ) : (
                    <img src={post.post_file} className='object-cover ring-2 ring-gray-500 h-5/6 w-full rounded-xl' />
                  )}
                </div>
              )}

              {/* checking if there is a track linked to the post */}
              {post.track && (
                <div className='w-auto pl-6 pr-6 pt-6 flex flex-col justify-center'>
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
