import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

export function useFollow(playerId: number) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Load follow status when user or playerId changes
  useEffect(() => {
    const checkFollowStatus = async () => {
      if (!user || !playerId) {
        setIsFollowing(false);
        return;
      }
      
      try {
        setIsLoading(true);
        const response = await fetch(`/api/follows/check/${playerId}`, {
          credentials: 'include'
        });
        
        if (response.ok) {
          const data = await response.json();
          setIsFollowing(data.isFollowing);
        }
      } catch (error) {
        console.error("Error checking follow status:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkFollowStatus();
  }, [user, playerId]);
  
  // Load follower count
  useEffect(() => {
    const loadFollowerCount = async () => {
      if (!playerId) return;
      
      try {
        const response = await fetch(`/api/follows/player/${playerId}`);
        
        if (response.ok) {
          const data = await response.json();
          setFollowerCount(data.length || 0);
        }
      } catch (error) {
        console.error("Error loading followers:", error);
      }
    };
    
    loadFollowerCount();
  }, [playerId, isFollowing]); // Also reload when follow status changes

  // Handle follow action
  const follow = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to follow players",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsLoading(true);
      const response = await fetch(`/api/follows/${playerId}`, {
        method: 'POST',
        credentials: 'include',
      });
      
      if (response.ok) {
        setIsFollowing(true);
        setFollowerCount(prev => prev + 1);
        toast({
          title: "Success",
          description: "You are now following this player",
        });
      } else {
        throw new Error("Failed to follow player");
      }
    } catch (error) {
      console.error("Follow error:", error);
      toast({
        title: "Error",
        description: "Failed to follow player. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle unfollow action
  const unfollow = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const response = await fetch(`/api/follows/${playerId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      
      if (response.ok) {
        setIsFollowing(false);
        setFollowerCount(prev => Math.max(0, prev - 1));
        toast({
          title: "Success",
          description: "You have unfollowed this player",
        });
      } else {
        throw new Error("Failed to unfollow player");
      }
    } catch (error) {
      console.error("Unfollow error:", error);
      toast({
        title: "Error",
        description: "Failed to unfollow player. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Toggle follow status
  const toggleFollow = () => {
    if (isFollowing) {
      unfollow();
    } else {
      follow();
    }
  };

  return {
    isFollowing,
    followerCount,
    isLoading,
    toggleFollow,
    follow,
    unfollow
  };
}