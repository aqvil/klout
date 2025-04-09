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
import { User, Settings, Shield, Heart, Loader2 } from "lucide-react";
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
    <div className="container max-w-6xl mx-auto py-10">
      <div className="space-y-8">
        <div className="flex items-center gap-3 border-b pb-5">
          <User className="h-7 w-7 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Fan Profile</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Left Column - Profile Summary & Navigation */}
          <div className="md:col-span-4 lg:col-span-3 space-y-6">
            <Card className="shadow-md border-0 overflow-hidden">
              <div className="bg-gradient-to-r from-secondary to-primary/80 h-32 relative flex justify-center items-center">
                <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                  <AvatarImage 
                    src={profile?.avatarUrl || ""} 
                    alt={profile?.displayName || user.username} 
                    className="object-cover"
                  />
                  <AvatarFallback className="text-3xl bg-primary text-white">
                    {profile?.displayName?.[0]?.toUpperCase() || user.username[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
              <CardContent className="p-6 text-center">
                <h2 className="text-2xl font-bold mt-2">{profile?.displayName || user.username}</h2>
                <p className="text-muted-foreground text-sm">@{user.username}</p>
                
                {profile?.country && (
                  <Badge variant="outline" className="mt-3 bg-primary/10 text-primary">
                    {profile.country}
                  </Badge>
                )}
                
                {profile?.bio && (
                  <p className="mt-4 text-muted-foreground text-sm leading-relaxed border-t border-b py-4 my-4">
                    {profile.bio}
                  </p>
                )}
                
                {profile?.favoriteTeam && (
                  <div className="mt-4 inline-flex items-center gap-2 bg-muted/50 px-3 py-2 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" x2="9.01" y1="9" y2="9"/><line x1="15" x2="15.01" y1="9" y2="9"/></svg>
                    <span className="text-sm">{profile.favoriteTeam}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="grid gap-1.5">
              <Button variant="secondary" className="w-full justify-start font-medium">
                <User className="mr-2 h-4 w-4" />
                Profile
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link to="/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </Button>
              {user.isAdmin && (
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link to="/admin">
                    <Shield className="mr-2 h-4 w-4" />
                    Admin Dashboard
                  </Link>
                </Button>
              )}
            </div>
            
            <Card className="shadow-sm border-0">
              <CardHeader className="pb-3">
                <div className="flex items-center">
                  <span className="bg-primary/10 text-primary p-1.5 rounded-md mr-2.5">
                    <Heart className="h-4 w-4" />
                  </span>
                  <CardTitle>Following</CardTitle>
                </div>
                <CardDescription>
                  Players you're following
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                {isFollowingLoading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-14 w-full" />
                    <Skeleton className="h-14 w-full" />
                    <Skeleton className="h-14 w-full" />
                  </div>
                ) : following.length === 0 ? (
                  <div className="text-center py-6 bg-muted/30 rounded-md">
                    <Heart className="h-10 w-10 mx-auto text-muted-foreground/50 mb-2" />
                    <p className="text-sm text-muted-foreground">
                      You're not following any players yet.
                    </p>
                    <Link to="/players">
                      <Button variant="link" className="mt-2 text-primary">
                        Discover players
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[300px] overflow-auto pr-2">
                    {following.map((follow: Follow) => (
                      <div key={follow.id} className="flex items-center gap-3 p-3 hover:bg-muted/30 rounded-md transition-colors">
                        <Avatar className="h-8 w-8">
                          {follow.player?.profileImg ? (
                            <AvatarImage src={follow.player.profileImg} alt={follow.playerName || `Player ${follow.playerId}`} />
                          ) : (
                            <AvatarFallback className="text-xs bg-secondary text-white">
                              {follow.playerName ? follow.playerName[0].toUpperCase() : 'P'}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <Link 
                            to={follow.playerSlug 
                              ? `/player/${follow.playerSlug}` 
                              : `/player/${follow.playerId}`
                            } 
                            className="hover:underline font-medium text-sm block truncate"
                          >
                            {follow.playerName || `Player ${follow.playerId}`}
                          </Link>
                          <p className="text-xs text-muted-foreground">
                            Following since {new Date(follow.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Profile Form */}
          <div className="md:col-span-8 lg:col-span-9">
            <Card className="shadow-sm border-0">
              <CardHeader className="border-b pb-6">
                <div className="flex items-center">
                  <span className="bg-primary/10 text-primary p-1.5 rounded-md mr-2.5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                  </span>
                  <div>
                    <CardTitle className="text-xl font-bold">Edit Your Profile</CardTitle>
                    <CardDescription>
                      Customize how others see you on the platform
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <FormField
                          control={form.control}
                          name="displayName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Display Name</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  className="bg-background" 
                                  placeholder="How you want to be known"
                                />
                              </FormControl>
                              <FormDescription>
                                This is how others will see you on the site.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div>
                        <FormField
                          control={form.control}
                          name="avatarUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Profile Picture URL</FormLabel>
                              <FormControl>
                                <Input 
                                  type="url" 
                                  {...field} 
                                  value={field.value || ""} 
                                  className="bg-background"
                                  placeholder="https://example.com/your-photo.jpg"
                                />
                              </FormControl>
                              <FormDescription>
                                Enter a URL for your profile picture.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bio</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Tell us a bit about yourself and your interests in soccer"
                              className="min-h-32 bg-background resize-none"
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormDescription>
                            A short description about yourself to share with the community.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                                <SelectTrigger className="bg-background">
                                  <SelectValue placeholder="Select your country" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent position="popper">
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
                            <FormDescription>
                              Which country are you supporting?
                            </FormDescription>
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
                              <Input 
                                {...field} 
                                value={field.value || ""} 
                                className="bg-background"
                                placeholder="Your favorite soccer team"
                              />
                            </FormControl>
                            <FormDescription>
                              Which team do you support the most?
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="flex justify-end pt-4 border-t">
                      <Button 
                        type="submit" 
                        className="px-8"
                        disabled={isCreating || isUpdating}
                      >
                        {isCreating || isUpdating ? (
                          <div className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            {profile ? "Updating..." : "Creating..."}
                          </div>
                        ) : (
                          profile ? "Update Profile" : "Create Profile"
                        )}
                      </Button>
                    </div>
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