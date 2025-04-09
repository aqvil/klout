import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

export function useFollow(playerId: number) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  // Check if user is following this player
  const { 
    data: followCheckData, 
    isLoading: isCheckingFollow,
    refetch: refetchFollowStatus 
  } = useQuery<{isFollowing: boolean, playerId: number}>({
    queryKey: [`/api/follows/check/${playerId}`],
    enabled: !!user && !!playerId,
  });
  
  // Get follower count
  const {
    data: followersData,
    isLoading: isLoadingFollowers
  } = useQuery<any[]>({
    queryKey: [`/api/follows/player/${playerId}`],
    enabled: !!playerId,
  });

  const followerCount = followersData?.length || 0;
  const isFollowing = followCheckData?.isFollowing ?? false;

  // Follow a player
  const followMutation = useMutation({
    mutationFn: async () => {
      try {
        const res = await apiRequest("POST", `/api/follows/${playerId}`);
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          return await res.json();
        } else {
          // Handle non-JSON response
          const text = await res.text();
          throw new Error(`Server returned non-JSON response: ${text}`);
        }
      } catch (error) {
        console.error("Follow error:", error);
        throw error;
      }
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: [`/api/follows/check/${playerId}`] });
      queryClient.invalidateQueries({ queryKey: ["/api/follows/user"] });
      toast({
        title: "Success",
        description: "You are now following this player",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to follow player",
        variant: "destructive",
      });
    },
  });

  // Unfollow a player
  const unfollowMutation = useMutation({
    mutationFn: async () => {
      try {
        const res = await apiRequest("DELETE", `/api/follows/${playerId}`);
        // For DELETE, we often don't get a response body (204 No Content)
        if (res.status === 204) {
          return { success: true };
        }
        
        // If we do get a body, check if it's JSON
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          return await res.json();
        } else {
          // Return success for other 2xx status codes
          if (res.ok) {
            return { success: true };
          }
          // Otherwise throw error
          const text = await res.text();
          throw new Error(`Server error: ${text}`);
        }
      } catch (error) {
        console.error("Unfollow error:", error);
        throw error;
      }
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: [`/api/follows/check/${playerId}`] });
      queryClient.invalidateQueries({ queryKey: ["/api/follows/user"] });
      toast({
        title: "Success",
        description: "You have unfollowed this player",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to unfollow player",
        variant: "destructive",
      });
    },
  });

  const toggleFollow = () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to follow players",
        variant: "destructive",
      });
      return;
    }

    if (isFollowing) {
      unfollowMutation.mutate();
    } else {
      followMutation.mutate();
    }
  };

  return {
    isFollowing,
    followerCount,
    isLoading: isCheckingFollow || isLoadingFollowers || followMutation.isPending || unfollowMutation.isPending,
    toggleFollow,
    follow: () => followMutation.mutate(),
    unfollow: () => unfollowMutation.mutate(),
    followMutation,
    unfollowMutation,
    refetchFollowStatus
  };
}