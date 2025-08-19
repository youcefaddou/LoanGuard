import authService from './authService';

const userService = {
  getUsers: async function() {
    try {
      const response = await authService.secureRequest('/api/users');
      
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.log('Error response:', errorData);
        throw new Error(errorData.message || 'Erreur lors de la récupération des utilisateurs');
      }
      
      const data = await response.json();
      console.log('Success data:', data);
      return data;
    } catch (error) {
      console.error('Erreur getUsers:', error);
      throw error;
    }
  },

  createUser: async function(userData) {
    try {
      const response = await authService.secureRequest('/api/users', {
        method: 'POST',
        body: JSON.stringify(userData)
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la création de l\'utilisateur');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur createUser:', error);
      throw error;
    }
  },

  updateUser: async function(userId, userData) {
    try {
      const response = await authService.secureRequest('/api/users/' + userId, {
        method: 'PUT',
        body: JSON.stringify(userData)
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la modification de l\'utilisateur');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur updateUser:', error);
      throw error;
    }
  },

  deleteUser: async function(userId) {
    try {
      const response = await authService.secureRequest('/api/users/' + userId, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la suppression de l\'utilisateur');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur deleteUser:', error);
      throw error;
    }
  }
};

export default userService;