import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "./use-auth";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Follow } from "@shared/schema";

interface FollowResponse {
  isFollowing: boolean;
  playerId?: number;
}

export const useFollow = (playerIdOrSlug: number | string) => {
  // Convert to string for consistency in query keys
  const playerKey = playerIdOrSlug.toString();
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Check if the user is following this player
  const {
    data: followResponse,
    isLoading: isFollowingLoading,
  } = useQuery<FollowResponse>({
    queryKey: ["/api/follows/check", playerKey],
    enabled: !!user && !!playerIdOrSlug,
    retry: false,
  });
  
  // Get the follower count for this player
  const {
    data: followers,
    isLoading: isFollowersLoading,
  } = useQuery<Follow[]>({
    queryKey: ["/api/follows/player", playerKey],
    enabled: !!playerIdOrSlug,
  });
  
  const followMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", `/api/follow/${playerKey}`);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/follows/check", playerKey] });
      queryClient.invalidateQueries({ queryKey: ["/api/follows/player", playerKey] });
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
      const res = await apiRequest("DELETE", `/api/follow/${playerKey}`);
      return res.status === 204 ? {} : await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/follows/check", playerKey] });
      queryClient.invalidateQueries({ queryKey: ["/api/follows/player", playerKey] });
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
    isFollowing: followResponse?.isFollowing || false,
    isFollowingLoading: isFollowingLoading || followMutation.isPending || unfollowMutation.isPending,
    followerCount: followers?.length || 0,
    playerId: followResponse?.playerId,
    follow: followMutation.mutate,
    unfollow: unfollowMutation.mutate,
  };
};