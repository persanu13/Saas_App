// common/hooks/useLogout.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../stores/auth.store";
import { logoutCall } from "@/api/auth/auth";

export const useLogout = () => {
  const { clearAuth } = useAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutCall,
    onSuccess: () => {
      clearAuth();
      queryClient.clear();
      router.push("/auth");
    },
    onError: () => {
      clearAuth();
      queryClient.clear();
      router.push("/auth");
    },
  });
};
