import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "./use-auth";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Follow } from "@shared/schema";

export const useFollow = (playerId: number) => {
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Check if the user is following this player
  const {
    data: isFollowing,
    isLoading: isFollowingLoading,
  } = useQuery<boolean>({
    queryKey: ["/api/follows/check", playerId],
    enabled: !!user && !!playerId,
    retry: false,
  });
  
  // Get the follower count for this player
  const {
    data: followers,
    isLoading: isFollowersLoading,
  } = useQuery<Follow[]>({
    queryKey: ["/api/follows/player", playerId],
    enabled: !!playerId,
  });
  
  const followMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/follows", { playerId });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/follows/check", playerId] });
      queryClient.invalidateQueries({ queryKey: ["/api/follows/player", playerId] });
      queryClient.invalidateQueries({ queryKey: ["/api/follows/user"] });
      toast({
        title: "Success",
        description: "Player followed successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to follow",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const unfollowMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("DELETE", `/api/follows/${playerId}`);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/follows/check", playerId] });
      queryClient.invalidateQueries({ queryKey: ["/api/follows/player", playerId] });
      queryClient.invalidateQueries({ queryKey: ["/api/follows/user"] });
      toast({
        title: "Success",
        description: "Player unfollowed successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to unfollow",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  return {
    isFollowing: isFollowing || false,
    isFollowingLoading: isFollowingLoading || followMutation.isPending || unfollowMutation.isPending,
    followerCount: followers?.length || 0,
    follow: followMutation.mutate,
    unfollow: unfollowMutation.mutate,
  };
};