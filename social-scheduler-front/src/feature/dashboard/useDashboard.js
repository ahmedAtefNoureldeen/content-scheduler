import { useQuery } from "@tanstack/react-query";
import PostService from "../../services/postService";

export function useDashboard(page = 1) {
    const { isLoading, data: posts, refetch } = useQuery({
      queryKey: ['post', page], // Include page in queryKey to refetch on page change
      queryFn: () => PostService.getAllPosts({ page }),
    });
  
    return { isLoading, posts, refetch };
  }