import React from "react";
import { useState,useEffect } from "react";
import { useContext } from "react";
import { AppContext } from "../../contexts/AppContext";
import { api } from "../utilities";
import blankProfilePicture from '../assets/blank-profile-picture-973460_640.png';

export default function MyProfilePage() {
  const { user, setUser } = useContext(AppContext);
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState(user.password);
  const [description, setDescription] = useState(user.description);
  const [profile_picture, setProfilePicture] = useState(user.profile_picture);
  const [showProfilePictureForm, setShowProfilePictureForm] = useState(false);
  const [showUsernameForm, setShowUsernameForm] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showDescriptionForm, setShowDescriptionForm] = useState(false);
  const toggleProfilePictureForm = () => setShowProfilePictureForm(!showProfilePictureForm);
  const toggleUsernameForm = () => setShowUsernameForm(!showUsernameForm);
  const toggleEmailForm = () => setShowEmailForm(!showEmailForm);
  const togglePasswordForm = () => setShowPasswordForm(!showPasswordForm);
  const toggleDescriptionForm = () => setShowDescriptionForm(!showDescriptionForm);   
  const [refresh, setRefresh] = useState(0)
  const [error, setError] = useState(null);
  
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
        if (response.status === 200) {
          setUser(response.data);
        }
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

  return (
    <div className='pt-2 w-screen h-screen flex justify-center items-start bg-gradient-to-br from-purple-700 to-gray-800' style={{ maxHeight: '100vh', overflowY: 'auto' }}>
      <div className="w-5/6 h-auto flex flex-row flex-wrap items-center bg-slate-900 p-10 pt-16 pb-16 ring-2 ring-gray-500 rounded-xl text-neutral-300 m-10 mt-20">

        <div className="w-full flex flex-row flex-wrap items-center mb-10 justify-between">
          <div className="w-fit flex flex-row flex-wrap items-center text-center">
            <img 
                className="w-40 h-40 object-cover rounded-full ring-2 ring-gray-500 mr-8" 
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

            <div className="w-fit text-4xl text-center" onClick={toggleUsernameForm}>{user.username}</div>
            {/* checking state to see if username was clicked */}
            {showUsernameForm && (
                <form onSubmit={(e) => { e.preventDefault(); editField("username", username); }}>
                    <input value={username} onChange={(e) => setUsername(e.target.value)} />
                    <button type="submit">Update Username</button>
                </form>
            )}
          </div>

          <div className="w-fit flex flex-row justify-center items-center flex-wrap">

            <div className="w-fit flex flex-col justify-center items-center text-center p-10">
              <div className="text-2xl" >{user.followers.length}</div>
              <div className="text-xl">Followers</div>
            </div>

            <div className="w-fit flex flex-col justify-center items-center text-center p-10">
              <div className="text-2xl">{user.following.length}</div>
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
    </div>
  );
}