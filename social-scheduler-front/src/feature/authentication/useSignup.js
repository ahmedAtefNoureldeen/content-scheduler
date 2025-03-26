import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import AuthService from '../../services/authService';




export function useSignup() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: signup, isLoading } = useMutation({
    mutationFn: ({ email, password , name, password_confirmation }) => AuthService.register( name, email , password, password_confirmation),
    onSuccess: (user) => {
      queryClient.setQueryData(['user'], user.user);
      navigate('/', { replace: true });
    },
    onError: (err) => {
      console.log('ERROR', err);
      toast.error('Provided email or password are incorrect');
    },
  });

  return { signup, isLoading };
}
