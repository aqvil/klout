import React from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useFollow } from "@/hooks/use-follow";
import { Loader2, Heart, HeartOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface FollowButtonProps {
  playerId: number;
  showCount?: boolean;
  className?: string;
  variant?: "default" | "secondary" | "outline" | "destructive" | "ghost" | "link";
}

export function FollowButton({ 
  playerId, 
  showCount = true, 
  className = "",
  variant = "default"
}: FollowButtonProps) {
  const { user } = useAuth();
  const { 
    isFollowing, 
    followerCount, 
    follow, 
    unfollow, 
    isFollowingLoading 
  } = useFollow(playerId);

  const handleClick = () => {
    if (isFollowing) {
      unfollow();
    } else {
      follow();
    }
  };

  if (!user) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="inline-flex">
              <Button 
                variant="outline" 
                size="sm" 
                className={className}
                onClick={() => window.location.href = "/auth"}
              >
                <Heart className="h-4 w-4 mr-1" />
                Follow{showCount && ` (${followerCount})`}
              </Button>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Sign in to follow this player</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button 
        variant={isFollowing ? "outline" : variant}
        size="sm"
        className={className}
        onClick={handleClick}
        disabled={isFollowingLoading}
      >
        {isFollowingLoading ? (
          <Loader2 className="h-4 w-4 animate-spin mr-1" />
        ) : isFollowing ? (
          <HeartOff className="h-4 w-4 mr-1" />
        ) : (
          <Heart className="h-4 w-4 mr-1" />
        )}
        {isFollowing ? "Unfollow" : "Follow"}
      </Button>
      
      {showCount && (
        <Badge variant="secondary" className="text-xs px-2">
          {followerCount} {followerCount === 1 ? "follower" : "followers"}
        </Badge>
      )}
    </div>
  );
}