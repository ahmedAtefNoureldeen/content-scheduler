import React, { useState } from 'react';
import { usePlatform } from '../feature/posts/usePlatforms';
import { useCreatePost } from '../feature/posts/useCreatePost';

const PostEditor = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    platforms: [], // Array for multiple platforms
    scheduled_time: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const { platformsValues } = usePlatform();
  const { createPost } = useCreatePost();
  
  const maxChars = 280; // Twitter-like character limit

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle multi-select platform changes
  const handlePlatformChange = (e) => {
    
    const selectedOptions = Array.from(
        e.target.selectedOptions, 
        option => Number(option.value) // Convert string values to numbers
      );
      
      setFormData(prev => ({
      ...prev,
      platforms: selectedOptions
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your post submission logic here
    createPost(formData);
  };

  const contentLength = formData.content.length;
  const charsRemaining = maxChars - contentLength;

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Post</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              name="title"
              id="title"
              value={formData.title}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md h-10 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Enter your post title"
            />
          </div>

          {/* Content */}
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700">
              Content
            </label>
            <textarea
              name="content"
              id="content"
              rows="4"
              value={formData.content}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="What's on your mind?"
              maxLength={maxChars}
            />
            <div className="mt-1 text-sm text-gray-500 text-right">
              {charsRemaining}/{maxChars} characters remaining
              {charsRemaining < 0 && (
                <span className="text-red-500 ml-2">Over limit!</span>
              )}
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700">
              Image (optional)
            </label>
            <input
              type="file"
              name="image"
              id="image"
              accept="image/*"
              onChange={handleImageUpload}
              className="mt-1 block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-indigo-50 file:text-indigo-700
                hover:file:bg-indigo-100"
            />
            {imagePreview && (
              <div className="mt-2">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="max-w-xs rounded-md"
                />
              </div>
            )}
          </div>

          {/* Platform Multi-Select */}
          <div>
            <label htmlFor="platforms" className="block text-sm font-medium text-gray-700">
              Platforms
            </label>
            <select
              name="platforms"
              id="platforms"
              multiple
              value={formData.platforms}
              onChange={handlePlatformChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              size={platformsValues?.length > 0 ? Math.min(platformsValues.length, 4) : 2}
            >
              {platformsValues ? (platformsValues.map((platform) => (
                <option key={platform.id} value={platform.id}>
                  {platform.name}
                </option>
              ))) : (
                <option disabled>No platforms available</option>
              )}
            </select>
            <p className="mt-1 text-xs text-gray-500">
              Hold Ctrl (or Cmd on Mac) to select multiple platforms
            </p>
          </div>

          {/* Date/Time Picker */}
          <div>
            <label htmlFor="scheduled_time" className="block text-sm font-medium text-gray-700">
              Schedule Post (optional)
            </label>
            <input
              type="datetime-local"
              name="scheduled_time"
              id="scheduled_time"
              value={formData.scheduled_time}
              onChange={handleChange}
              className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Create Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostEditor;