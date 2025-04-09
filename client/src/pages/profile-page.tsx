import React from "react";
import { useAuth } from "@/hooks/use-auth";
import { useFanProfile } from "@/hooks/use-fan-profile";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Settings, Shield, Heart } from "lucide-react";
import { Link } from "wouter";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { Follow } from "@shared/schema";

const profileSchema = z.object({
  displayName: z.string().min(2, {
    message: "Display name must be at least 2 characters.",
  }),
  bio: z.string().optional(),
  country: z.string().optional(),
  avatarUrl: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
  favoriteTeam: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { user } = useAuth();
  const { profile, isLoading, createProfile, updateProfile, isCreating, isUpdating } = useFanProfile();
  
  const { data: following = [], isLoading: isFollowingLoading } = useQuery<Follow[]>({
    queryKey: ["/api/follows/user"],
    enabled: !!user,
  });
  
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: profile?.displayName || user?.username || "",
      bio: profile?.bio || "",
      country: profile?.country || "",
      avatarUrl: profile?.avatarUrl || "",
      favoriteTeam: profile?.favoriteTeam || "",
    },
  });
  
  React.useEffect(() => {
    if (profile) {
      form.reset({
        displayName: profile.displayName || user?.username || "",
        bio: profile.bio || "",
        country: profile.country || "",
        avatarUrl: profile.avatarUrl || "",
        favoriteTeam: profile.favoriteTeam || "",
      });
    }
  }, [profile, user, form]);
  
  const onSubmit = (data: ProfileFormValues) => {
    if (profile) {
      updateProfile(data);
    } else {
      createProfile(data);
    }
  };
  
  if (!user) {
    return null;
  }

  return (
    <div className="container py-8">
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <User className="h-6 w-6" />
          <h1 className="text-3xl font-bold">My Profile</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column - Nav Links & Profile Summary */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center gap-4 text-center">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={profile?.avatarUrl || ""} alt={profile?.displayName || user.username} />
                    <AvatarFallback className="text-2xl">
                      {profile?.displayName?.[0]?.toUpperCase() || user.username[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-2xl font-bold">{profile?.displayName || user.username}</h2>
                    
                    {profile?.country && (
                      <Badge variant="outline" className="mt-1">
                        {profile.country}
                      </Badge>
                    )}
                    
                    {profile?.bio && (
                      <p className="mt-2 text-muted-foreground">
                        {profile.bio}
                      </p>
                    )}
                    
                    {profile?.favoriteTeam && (
                      <div className="mt-2">
                        <span className="text-sm text-muted-foreground">Favorite Team: </span>
                        <span className="font-medium">{profile.favoriteTeam}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-2">
              <Button variant="default" className="w-full justify-start">
                <User className="mr-2 h-4 w-4" />
                Profile
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link to="/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </Button>
              {user.isAdmin && (
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/admin">
                    <Shield className="mr-2 h-4 w-4" />
                    Admin Panel
                  </Link>
                </Button>
              )}
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="mr-2 h-4 w-4" />
                  Following
                </CardTitle>
                <CardDescription>
                  Players you're following
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isFollowingLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                ) : following.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    You're not following any players yet.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {following.map((follow: Follow & { playerName?: string | null }) => (
                      <div key={follow.id} className="flex items-center justify-between">
                        <Link to={`/player/${follow.playerName ? follow.playerName.toLowerCase().replace(/\s+/g, '-') : follow.playerId}`} className="hover:underline">
                          {follow.playerName || `Player ${follow.playerId}`}
                        </Link>
                        <Badge variant="secondary">
                          {new Date(follow.createdAt).toLocaleDateString()}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Profile Form */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Edit Profile</CardTitle>
                <CardDescription>
                  Update your profile information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="displayName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Display Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormDescription>
                            This is how others will see you on the site.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bio</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Tell us a bit about yourself"
                              className="min-h-32"
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormDescription>
                            A short description about yourself.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="country"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Country</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value || ""}
                              value={field.value || ""}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select your country" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="United States">United States</SelectItem>
                                <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                                <SelectItem value="Canada">Canada</SelectItem>
                                <SelectItem value="Australia">Australia</SelectItem>
                                <SelectItem value="Germany">Germany</SelectItem>
                                <SelectItem value="France">France</SelectItem>
                                <SelectItem value="Spain">Spain</SelectItem>
                                <SelectItem value="Italy">Italy</SelectItem>
                                <SelectItem value="Brazil">Brazil</SelectItem>
                                <SelectItem value="Argentina">Argentina</SelectItem>
                                <SelectItem value="Portugal">Portugal</SelectItem>
                                <SelectItem value="Netherlands">Netherlands</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="favoriteTeam"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Favorite Team</FormLabel>
                            <FormControl>
                              <Input {...field} value={field.value || ""} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="avatarUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Profile Picture URL</FormLabel>
                          <FormControl>
                            <Input type="url" {...field} value={field.value || ""} />
                          </FormControl>
                          <FormDescription>
                            Enter a URL for your profile picture.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full md:w-auto"
                      disabled={isCreating || isUpdating}
                    >
                      {isCreating || isUpdating ? (
                        <div className="flex items-center">
                          <span className="animate-spin mr-2">⟳</span>
                          {profile ? "Updating..." : "Creating..."}
                        </div>
                      ) : (
                        profile ? "Update Profile" : "Create Profile"
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}