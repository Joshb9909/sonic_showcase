import React, { useState } from 'react';
import { api } from '../utilities';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function NewPostPage() {
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postFile, setPostFile] = useState(null);
  const [trackSearch, setTrackSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedTrackId, setSelectedTrackId] = useState(null);
  const [offset, setOffset] = useState(0);
  const [selectedTrack, setSelectedTrack] = useState(null)
  const navigate = useNavigate();

  const createPost = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('post_title', postTitle);
    formData.append('post_content', postContent);
    if (selectedTrackId) {
      formData.append('track_id', selectedTrackId);
    }
    if (postFile) {
      formData.append('post_file', postFile);
    }

    try {
      const response = await api.post('/post/new-post/', formData, { 
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.status === 201) {
        alert('Post created successfully!');
        navigate('/home');
      }
    } catch (error) {
      console.error('An error occurred while creating the post:', error);
      alert('Failed to create the post. Please try again.');
    }
  };

  const searchSpotify = async () => {
    try {
        const response = await api.get('/post/search-for-track/', { 
          params: { 
            track_name: trackSearch,
            offset: offset
          }});
        setSearchResults(response.data.tracks.items);
    } catch (error) {
        console.error('Failed to search Spotify:', error);
        alert('Failed to search for tracks. Please try again.');
    }
};

  const getNextTracks = () => {
    setOffset(prevOffset => prevOffset + 10);
    searchSpotify();
  }

  const getPrevTracks = () => {
    setOffset(prevOffset => Math.max(prevOffset - 10, 0));
    searchSpotify();
  }

  const handleTrackSelect = (track) => {
    setSelectedTrackId(track.id)
    setSearchResults([])
    setTrackSearch('')
  }

  useEffect(() => {
    const renderSelectedTrack = async () => {
      if (selectedTrackId) {
        try {
          const response = await api.get(`/post/get-track-by-id/${selectedTrackId}/`)
          setSelectedTrack(response.data)
        } catch (error) {
          console.error('failed to load selected track:', error)
        }
      }
    }

    renderSelectedTrack();
  }, [selectedTrackId])

  return (
    <div className="h-screen overflow-scroll bg-slate-900">

        <div className="flex flex-col justify-around items-center w-screen max-w-screen pt-40 bg-slate-900 rounded-lg text-neutral-300 overflow-scroll min-h-screen">

            <h3 className=" text-xl">Create a New Post</h3>
            <form className="w-11/12 flex flex-col overflow-scroll" onSubmit={createPost}>

                <div className="m-5 flex justify-center">
                    <input id="postTitle" className='w-1/2 bg-gray-700 ring-1 ring-gray-500 rounded-md text-center' placeholder='Post Title' value={postTitle} onChange={(e) => setPostTitle(e.target.value)} required />
                </div>

                <div className="m-5 flex justify-center">
                    <textarea id="postContent" className='w-1/2 bg-gray-700 ring-1 ring-gray-500 rounded-md text-center h-32' placeholder='Post Content' value={postContent} onChange={(e) => setPostContent(e.target.value)} required />
                </div>

                <div className="flex justify-center m-5">
                    <label className="block bg-gray-700 ring-1 ring-gray-500 rounded-md text-center text-white cursor-pointer relative overflow-hidden">
                        <span className="px-4 py-2">Upload Image or Video</span>
                        <input className='absolute inset-0 opacity-0 cursor-pointer w-full h-full' id="postFile" type="file" accept="image/*,video/*" onChange={(e) => setPostFile(e.target.files[0])} />
                    </label>
                </div>

                <div className="flex flex-col items-center justify-center">
                    <input className='flex w-1/2 bg-gray-700 ring-1 ring-gray-500 rounded-md text-center mr-2' placeholder='Link a Spotify Track' value={trackSearch} onChange={(e) => setTrackSearch(e.target.value)} />
                    <button type='button' onClick={searchSpotify} className="bg-gradient-to-br from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white p-1 mt-4 rounded-md">Search</button>
                </div>

                <div className="m-2 grid grid-cols-2 gap-4">
                  {/* renders searched tracks */}
                    {searchResults.map(track => (
                        <div key={track.id} className="flex items-center gap-4 cursor-pointer p-2 bg-gray-700 rounded-md" onClick={() => handleTrackSelect(track)}>
                            <img className="w-16 h-16 rounded-md" src={track.album.images[1].url} alt={`Album cover for ${track.name}`} />
                            <span className='text-sm'>{track.name} by {track.artists[0].name}</span>
                        </div>
                    ))}
                </div>

                <div className='flex justify-center items-center'>
                  {/* renders if a track is selected */}
                  {selectedTrack && selectedTrack.album && selectedTrack.name && selectedTrack.artists && (
                    <div className='flex flex-col justify-center items-center w-1/3'>
                        <img className='ring-2 ring-gray-500 rounded-md' src={selectedTrack.album.images[1].url} />
                        <span className='m-4 bg-gray-700 rounded-md text-center'>{selectedTrack.name} by {selectedTrack.artists[0].name}</span>
                    </div>
                  )}
                </div>

                <div className='flex flex-row justify-center'>
                  <button type='button' className='w-1/4 mr-2 inline-flex items-center justify-center p-2 font-medium text-white rounded-lg bg-gradient-to-br from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800' onClick={getPrevTracks} disabled={offset === 0}>Previous</button>
                  <button type='button' className='w-1/4 ml-2 inline-flex items-center justify-center p-2 font-medium text-white rounded-lg bg-gradient-to-br from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800' onClick={getNextTracks}>Next</button>
                </div>
                
                <div className="mt-5 mb-5 flex justify-around">
                    <button type="submit" className="w-1/2 inline-flex items-center justify-center p-2 font-medium text-white rounded-lg bg-gradient-to-br from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800">
                        Create Post
                    </button>
                </div>
            </form>
        </div>
    </div>
  );
}

