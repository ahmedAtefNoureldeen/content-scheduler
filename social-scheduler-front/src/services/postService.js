import api from './api';

const PostService = {
  getAllPosts: async (filters = {}) => {
    const response = await api.get('/posts', { params: filters });
    return response.data;
  },

  getPost: async (id) => {
    const response = await api.get(`/posts/${id}`);
    return response.data;
  },

  createPost: async (postData) => {
    const formData = new FormData();
    
    // Add text fields
    Object.keys(postData).forEach(key => {
      if (key !== 'image' && postData[key] !== undefined) {
        if (key === 'platforms') {
          // Handle platforms array
          postData.platforms.forEach(platform => {
            formData.append('platforms[]', platform);
          });
        } else {
          formData.append(key, postData[key]);
        }
      }
    });
    
    // Add image if present
    if (postData.image) {
      formData.append('image', postData.image);
    }
    
    const response = await api.post('/posts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return response.data;
  },

  updatePost: async (id, postData) => {
    
    // Handle if we're using FormData for image uploads
    if (postData instanceof FormData) {
      const response = await api.post(`/posts/${id}?_method=PUT`, postData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    }
    
    // Otherwise, standard JSON update
    const response = await api.put(`/posts/${id}`, postData);
    return response.data;
  },

  deletePost: async (id) => {
    const response = await api.delete(`/posts/${id}`);
    return response.data;
  }
};

export default PostService;
