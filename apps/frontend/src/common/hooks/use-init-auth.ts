"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../stores/auth.store";
import { refreshCall } from "@/api/auth/auth";
import { useEffect } from "react";

export const useInitAuth = () => {
  const { setAuth, clearAuth } = useAuthStore();

  const query = useQuery({
    queryKey: ["auth", "refresh"],
    queryFn: refreshCall,
    retry: false,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  useEffect(() => {
    if (query.data) {
      setAuth(query.data.data.access_token, query.data.data.user);
    }
    if (query.isError) {
      clearAuth();
    }
  }, [query.data, query.isError]);

  return query;
};
