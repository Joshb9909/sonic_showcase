import { createBrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import HomePage from "./components/HomePage.jsx";
import LoginPage from "./components/LoginPage.jsx";
import RegisterPage from "./components/RegisterPage.jsx";
import PostCard from "./components/PostCard.jsx";
import NewPostPage from "./components/NewPostPage.jsx";
import OnePost from "./components/OnePost.jsx";
import MyProfilePage from "./components/MyProfilePage.jsx";
import OtherUsersPage from "./components/otherUsersPage.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <LoginPage />,
      },
      {
        path: "/register",
        element: <RegisterPage />,
      },
      {
        path: "/home",
        element: <HomePage />,
        children: [
            {
                index: true,
                element: <PostCard />,
            },
            {
                path: "/home/newpost",
                element: <NewPostPage />,
            },
            {
                path: "/home/post/:postId",
                element: <OnePost />,
            },
            {
                path: "/home/my-profile",
                element: <MyProfilePage />,
            },
            {
                path: "/home/user/:username",
                element: <OtherUsersPage />,
            },
        ]
      },
    ],
  },
]);

export default router;
