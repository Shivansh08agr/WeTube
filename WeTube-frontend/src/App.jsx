import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import Home from './pages/home/Home';
import Layout from './layout/Layout';
import AuthLayout from './layout/AuthLayout';
import './App.scss';
import Video from './pages/video/Video';
import Register from './pages/register/Register';
import Login from './pages/login/Login';
import store from './store';
import {Provider} from 'react-redux'
import Profile from './pages/profile/Profile';
import LikedVideos from './pages/likedVideos/LikedVideos';
import WatchHistory from './pages/watch-history/WatchHistory';
import MyVideos from './pages/myVideos/MyVideos';
import UploadVideo from './pages/uploadVideo/UploadVideo';
import EditVideo from './pages/editVideo/EditVideo';

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path='/' element={<Layout />}>
          <Route path='' element={<Home />} />
          <Route path='profile' element={<Profile />} />
          <Route path='videos/:videoId' element={<Video />} />
          <Route path='my-videos/videos/edit-video/:videoId' element={<EditVideo />} />
          <Route path='liked-videos' element={<LikedVideos />} />
          <Route path='watch-history' element={<WatchHistory />} />
          <Route path='upload-video' element={<UploadVideo />} />
          <Route path='my-videos' element={<MyVideos />} />
        </Route>
        <Route path='/' element={<AuthLayout />}>
          <Route path='register' element={<Register />} />
          <Route path='login' element={<Login />} />
        </Route>
      </>
    )
  );

  return (
    <Provider store = {store}>
      <RouterProvider router={router}/> 
    </Provider>
  );
}

export default App;