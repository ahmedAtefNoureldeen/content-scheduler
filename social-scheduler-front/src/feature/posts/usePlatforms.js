import { useQuery } from "@tanstack/react-query";
import PlatformService from "../../services/platForm";

export function usePlatform() {
  const { isLoading, data: platformsValues } = useQuery({
    queryKey: ["platform"],
    queryFn: PlatformService.getAllPlatforms,
  });

  return { isLoading, platformsValues};
}