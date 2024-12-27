import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

export const carrosService = {
  getAll: () => api.get('/carros'),
  getById: (id) => api.get(`/carros/${id}`),
  create: (data) => api.post('/carros', data),
  update: (id, data) => api.put(`/carros/${id}`, data),
  delete: (id) => api.delete(`/carros/${id}`),
  getDisponiveis: () => api.get('/carros/disponiveis')
};

export const marcasService = {
  getAll: () => api.get('/marcas'),
  create: (data) => api.post('/marcas', data),
  update: (id, data) => api.put(`/marcas/${id}`, data),
  delete: (id) => api.delete(`/marcas/${id}`)
};

export const modelosService = {
  getAll: () => api.get('/modelos'),
  create: async (data) => {
    try {
      console.log('Payload enviado para criar modelo:', data);
      const response = await api.post('/modelos', data);
      console.log('Resposta bem sucedida:', response.data);
      return response;
    } catch (error) {
      console.error('Detalhes do erro:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        payload: data
      });
      throw error;
    }
  }
};