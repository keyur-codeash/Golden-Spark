// src/hooks/useUsers.js
import { useQuery } from '@tanstack/react-query';
import userService from '../services/productService';

const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => userService.getAll().then(res => res.data),
  });
};

export default useUsers;
