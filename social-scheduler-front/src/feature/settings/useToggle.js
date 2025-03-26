import { useMutation } from "@tanstack/react-query";
import PlatformService from "../../services/platForm";
import toast from "react-hot-toast";

export function useToggle() {
    
    const { mutate: toggle, isLoading: isToggle } = useMutation({
      mutationFn: PlatformService.togglePlatform,
      onSuccess: () => {
        toast.success("platform toggle successfully");
      },
      onError: (err) => toast.error(err.message),
})

return { isToggle, toggle};
}