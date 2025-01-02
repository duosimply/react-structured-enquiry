import { create } from 'zustand';

const useAuthStore = create((set) => ({
  token: null,
  role: null, // Add role to the store
  company: null, // Add company to the store for employers
  login: (userData) => set({ 
    token: userData.token, 
    role: userData.role,
    company: userData.company || null, // Set company only if available
  }),
  logout: () => set({ 
    token: null, 
    role: null, 
    company: null, // Clear company on logout
  }),
}));

export default useAuthStore;
