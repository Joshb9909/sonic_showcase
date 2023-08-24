import { Link, useNavigate } from "react-router-dom"
import { api } from "../utilities"
import { Navigate } from "react-router-dom";
import { useState } from "react";
import SonicShowcaseLogo from "../assets/SonicLogo";

export default function RegisterPage() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [description, setDescription] = useState('');
    const [profilePicture, setProfilePicture] = useState(null);
  
    const signUp = async (e) => {
      e.preventDefault();
  
      const formData = new FormData();
      formData.append('username', username);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('description', description);
      if (profilePicture) {
        formData.append('profile_picture', profilePicture);
      }
  
      let response = await api.post("user/signup/", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      let user = response.data.user;
      let token = response.data.token;
      localStorage.setItem("token", token);
      api.defaults.headers.common["Authorization"] = `Token ${token}`;
      navigate("/");
    };
  
    return (
      <>
        <div className="w-screen h-screen bg-gradient-to-br from-purple-700 to-gray-800 flex justify-center items-center overflow-hidden">

          <div className="flex flex-col justify-center items-center w-full h-full bg-slate-900 text-neutral-300 overflow-hidden">

            <div className="m-2"><SonicShowcaseLogo /></div>

            <form className="flex flex-col justify-center items-center" onSubmit={signUp}>

              <div className="mt-8">
                <input className="bg-gray-700 ring-1 ring-gray-500 rounded-md text-center" placeholder="username" value={username} onChange={(e) => setUsername(e.target.value)} />
              </div>

              <div className="mt-8">
                <input className="bg-gray-700 ring-1 ring-gray-500 rounded-md text-center" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>

              <div className="mt-8">
                <input className="bg-gray-700 ring-1 ring-gray-500 rounded-md text-center" placeholder="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>

              <div className="mt-8">
                <input className="bg-gray-700 ring-1 ring-gray-500 rounded-md text-center" placeholder="description(optional)" value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>

              <div className="mt-6">

                <button type="submit" className="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800" >
                    <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                        Create Account
                    </span>
                </button>
              </div>
            </form>

            <div className="mt-6">

              <Link to="/">
                
                <button className="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800" >
                    <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                        Go Back to Login
                    </span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }