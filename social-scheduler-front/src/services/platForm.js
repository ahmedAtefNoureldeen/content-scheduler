import api from './api';

const PlatformService = {
  getAllPlatforms: async () => {
    const response = await api.get('/platforms');
    return response.data;
  },


  togglePlatform: async (platformId) => {
    const response = await api.post(`/platforms/${platformId}/toggle`);
    return response.data;
  },
};

export default PlatformService;