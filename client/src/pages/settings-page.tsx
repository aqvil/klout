import React from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Settings, Shield, User, LogOut } from "lucide-react";
import { Link } from "wouter";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useFanProfile } from "@/hooks/use-fan-profile";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function SettingsPage() {
  const { user, logoutMutation } = useAuth();
  const { profile } = useFanProfile();
  const { toast } = useToast();
  const [darkMode, setDarkMode] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmitPassword = (data: PasswordFormValues) => {
    console.log(data);
    // In a real app, we would call an API endpoint to change the password
    // For now, just show success message
    toast({
      title: "Password updated",
      description: "Your password has been updated successfully.",
    });
    passwordForm.reset();
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  if (!user) {
    return (
      <div className="container py-10 flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container max-w-6xl py-10">
      <div className="space-y-8">
        <div className="flex items-center gap-3 border-b pb-5">
          <Settings className="h-7 w-7 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Left Column - User Info & Nav Links */}
          <div className="md:col-span-4 lg:col-span-3 space-y-6">
            <Card className="shadow-md border-0 overflow-hidden">
              <div className="bg-gradient-to-r from-primary to-primary/80 h-20 relative">
                <Avatar className="h-20 w-20 absolute bottom-0 left-6 transform translate-y-1/2 border-4 border-white shadow-lg">
                  <AvatarImage src={profile?.avatarUrl || ""} alt={profile?.displayName || user?.username} />
                  <AvatarFallback className="text-2xl bg-secondary text-white">
                    {(profile?.displayName || user?.username || "?")[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
              <CardContent className="pt-12 pb-4 px-6">
                <div>
                  <h3 className="font-bold text-lg">{profile?.displayName || user?.username}</h3>
                  <p className="text-muted-foreground text-sm">@{user.username}</p>
                  {user.isAdmin && (
                    <Badge variant="outline" className="mt-2 bg-primary/10 text-primary">
                      Administrator
                    </Badge>
                  )}
                </div>
              </CardContent>
              <div className="bg-muted/30 px-6 py-3">
                <p className="text-xs text-muted-foreground">Member since {new Date().toLocaleDateString()}</p>
              </div>
            </Card>

            <div className="grid gap-1.5">
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link to="/profile">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </Button>
              <Button variant="secondary" className="w-full justify-start font-medium">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
              {user.isAdmin && (
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link to="/admin">
                    <Shield className="mr-2 h-4 w-4" />
                    Admin Dashboard
                  </Link>
                </Button>
              )}
              <Separator className="my-2" />
              <Button
                variant="ghost"
                className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>

          {/* Right Column - Settings */}
          <div className="md:col-span-8 lg:col-span-9 space-y-8">
            <Card className="shadow-sm border-0">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold">Account Preferences</CardTitle>
                <CardDescription>Manage your display and notification settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-5">
                  <h3 className="text-base font-medium flex items-center">
                    <span className="bg-primary/10 text-primary p-1.5 rounded-md mr-2.5">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/><path d="M12 6a6 6 0 0 0-6 6c0 4 6 10 6 10s6-6 6-10a6 6 0 0 0-6-6Z"/>
                      </svg>
                    </span>
                    Interface Preferences
                  </h3>
                  <div className="flex items-center justify-between px-4 py-3 rounded-lg border bg-card shadow-sm">
                    <div className="space-y-0.5">
                      <Label htmlFor="dark-mode" className="text-base">Dark Mode</Label>
                      <p className="text-sm text-muted-foreground">
                        Switch between light and dark theme
                      </p>
                    </div>
                    <Switch
                      id="dark-mode"
                      checked={darkMode}
                      onCheckedChange={setDarkMode}
                      className="scale-110"
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-5">
                  <h3 className="text-base font-medium flex items-center">
                    <span className="bg-primary/10 text-primary p-1.5 rounded-md mr-2.5">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                    </span>
                    Notification Settings
                  </h3>
                  <div className="grid gap-4">
                    <div className="flex items-center justify-between px-4 py-3 rounded-lg border bg-card shadow-sm">
                      <div className="space-y-0.5">
                        <Label htmlFor="email-notifications" className="text-base">Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive important updates via email
                        </p>
                      </div>
                      <Switch
                        id="email-notifications"
                        checked={emailNotifications}
                        onCheckedChange={setEmailNotifications}
                        className="scale-110"
                      />
                    </div>

                    <div className="flex items-center justify-between px-4 py-3 rounded-lg border bg-card shadow-sm">
                      <div className="space-y-0.5">
                        <Label htmlFor="push-notifications" className="text-base">Push Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive updates in real-time
                        </p>
                      </div>
                      <Switch
                        id="push-notifications"
                        checked={pushNotifications}
                        onCheckedChange={setPushNotifications}
                        className="scale-110"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-0">
              <CardHeader className="pb-4">
                <div className="flex items-center">
                  <span className="bg-primary/10 text-primary p-1.5 rounded-md mr-2.5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 16V8a2 2 0 0 1 2-2h8"/><path d="M6 16v-2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-2"/><path d="M10 8V4a2 2 0 0 1 2-2h8"/><path d="M14 6v-2a2 2 0 0 1 2-2h6"/></svg>
                  </span>
                  <CardTitle className="text-xl font-bold ml-2">Change Password</CardTitle>
                </div>
                <CardDescription>Secure your account with a strong password</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...passwordForm}>
                  <form onSubmit={passwordForm.handleSubmit(onSubmitPassword)} className="space-y-5">
                    <FormField
                      control={passwordForm.control}
                      name="currentPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} className="bg-background" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={passwordForm.control}
                        name="newPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>New Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="••••••••" {...field} className="bg-background" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={passwordForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm New Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="••••••••" {...field} className="bg-background" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Button type="submit" className="mt-2">
                      {passwordForm.formState.isSubmitting && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Update Password
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-0 border-red-200 bg-red-50">
              <CardHeader className="pb-4">
                <div className="flex items-center text-red-600">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
                  <CardTitle className="text-xl font-bold text-red-600">Danger Zone</CardTitle>
                </div>
                <CardDescription className="text-red-500">
                  Permanent and irreversible actions for your account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="destructive" className="bg-red-600 hover:bg-red-700">
                  Delete Account
                </Button>
                <p className="text-sm text-red-500 mt-2">This action cannot be undone. All your data will be permanently deleted.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}