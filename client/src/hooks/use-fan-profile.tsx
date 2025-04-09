import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "./use-auth";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { FanProfile, InsertFanProfile } from "@shared/schema";

export const useFanProfile = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  
  const {
    data: profile,
    isLoading,
    error,
  } = useQuery<FanProfile>({
    queryKey: ["/api/fan-profile"],
    enabled: !!user,
    retry: false,
    // Handle 404 errors silently
    gcTime: 0,
    staleTime: 30000
  });

  const createProfileMutation = useMutation({
    mutationFn: async (profileData: Omit<InsertFanProfile, "userId">) => {
      const res = await apiRequest("POST", "/api/fan-profile", profileData);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/fan-profile"] });
      toast({
        title: "Profile created",
        description: "Your fan profile has been created successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create profile",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (profileData: Partial<InsertFanProfile>) => {
      const res = await apiRequest("PUT", "/api/fan-profile", profileData);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/fan-profile"] });
      toast({
        title: "Profile updated",
        description: "Your fan profile has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update profile",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    profile,
    isLoading,
    error,
    createProfile: createProfileMutation.mutate,
    updateProfile: updateProfileMutation.mutate,
    isCreating: createProfileMutation.isPending,
    isUpdating: updateProfileMutation.isPending,
  };
};