import { useQuery } from "@tanstack/react-query";
import AuthService from "../../services/authService";

export function useUser() {
  const { isLoading, data: user } = useQuery({
    queryKey: ["user"],
    queryFn: AuthService.getCurrentUser,
  });

  const auth = user ? true : false;

  return { isLoading, user, isAuthenticated: auth };
}