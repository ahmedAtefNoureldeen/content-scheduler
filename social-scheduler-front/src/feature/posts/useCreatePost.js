import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import PostService from "../../services/postService";
import { useNavigate } from "react-router-dom";

export function useCreatePost() {
  const navigate = useNavigate();

  const { mutate: createPost, isLoading: isPosting } = useMutation({
    mutationFn: PostService.createPost,
    onSuccess: () => {
      toast.success("New post successfully created");
      navigate("/", { replace: true });

    },
    onError: (err) => toast.error(err.message),
  });

  return { isPosting, createPost };
}
