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
    data: isFollowing = false, 
    isLoading: isCheckingFollow,
    refetch: refetchFollowStatus 
  } = useQuery<boolean>({
    queryKey: [`/api/follows/check/${playerId}`],
    enabled: !!user && !!playerId,
  });

  // Follow a player
  const followMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", `/api/follows/${playerId}`);
      return await res.json();
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
      const res = await apiRequest("DELETE", `/api/follows/${playerId}`);
      return await res.json();
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
    isLoading: isCheckingFollow || followMutation.isPending || unfollowMutation.isPending,
    toggleFollow,
    followMutation,
    unfollowMutation,
    refetchFollowStatus
  };
}