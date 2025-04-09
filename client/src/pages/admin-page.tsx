import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { insertPlayerSchema, insertPlayerStatsSchema, Player, PlayerStats, PlayerWithStats } from "@shared/schema";
import { RefreshCcw, Save, Trash, UserPlus, Download, BarChart, Users, Zap } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Import Player Mutation Component
function ImportPlayersMutation() {
  const { toast } = useToast();
  const [limit, setLimit] = useState(10);
  
  const importPlayersMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/import-players", { limit });
      return await response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Import started",
        description: data.message,
      });
      
      // After a short delay, invalidate the players query to refresh the data
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["/api/players"] });
        queryClient.invalidateQueries({ queryKey: ["/api/rankings"] });
      }, 5000);
    },
    onError: (error: Error) => {
      toast({
        title: "Import failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Input
          type="number"
          min="1"
          max="50"
          value={limit}
          onChange={(e) => setLimit(parseInt(e.target.value) || 10)}
          className="w-24"
        />
        <Button
          onClick={() => importPlayersMutation.mutate()}
          disabled={importPlayersMutation.isPending}
          className="flex-1"
        >
          {importPlayersMutation.isPending ? (
            <>
              <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
              Importing...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Import Players
            </>
          )}
        </Button>
      </div>
      {importPlayersMutation.isSuccess && (
        <Alert className="bg-green-50">
          <AlertTitle>Import started successfully</AlertTitle>
          <AlertDescription>
            The import process is running in the background. Data will be available soon.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

// Update All Scores Mutation Component
function UpdateAllScoresMutation() {
  const { toast } = useToast();
  
  const updateAllScoresMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/update-all-scores", {});
      return await response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Score update started",
        description: data.message,
      });
      
      // After a short delay, invalidate the rankings to refresh the data
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["/api/rankings"] });
      }, 5000);
    },
    onError: (error: Error) => {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-medium mb-2">Update All Players</h3>
      <Button
        onClick={() => updateAllScoresMutation.mutate()}
        disabled={updateAllScoresMutation.isPending}
        className="w-full"
      >
        {updateAllScoresMutation.isPending ? (
          <>
            <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
            Updating All Scores...
          </>
        ) : (
          <>
            <BarChart className="mr-2 h-4 w-4" />
            Update All Player Scores
          </>
        )}
      </Button>
      {updateAllScoresMutation.isSuccess && (
        <Alert className="bg-green-50">
          <AlertTitle>Update started successfully</AlertTitle>
          <AlertDescription>
            The scores are being updated in the background. Refresh the rankings to see the latest data.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

// Update Single Player Score Mutation Component
function UpdateSinglePlayerScoreMutation({ player }: { player: Player }) {
  const { toast } = useToast();
  
  const updatePlayerScoreMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", `/api/players/${player.id}/update-scores`, {});
      return await response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Player score updated",
        description: data.message,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/rankings"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  return (
    <div className="flex items-center justify-between border rounded-md p-2">
      <div className="flex items-center">
        <img 
          src={player.profileImg} 
          alt={player.name}
          className="h-8 w-8 rounded-full mr-2 object-cover"
        />
        <div>
          <div className="font-medium">{player.name}</div>
          <div className="text-xs text-neutral-500">{player.club}</div>
        </div>
      </div>
      <Button
        size="sm"
        onClick={() => updatePlayerScoreMutation.mutate()}
        disabled={updatePlayerScoreMutation.isPending}
      >
        {updatePlayerScoreMutation.isPending ? (
          <RefreshCcw className="h-4 w-4 animate-spin" />
        ) : (
          <Zap className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}

// Extended schema with validations for the player form
const playerFormSchema = insertPlayerSchema.extend({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  club: z.string().min(2, {
    message: "Club must be at least 2 characters.",
  }),
  country: z.string().min(2, {
    message: "Country must be at least 2 characters.",
  }),
  position: z.string().min(2, {
    message: "Position must be at least 2 characters.",
  }),
  profileImg: z.string().url({
    message: "Please enter a valid URL for the profile image.",
  }),
  bio: z.string().optional(),
});

// Extended schema with validations for the stats form
const statsFormSchema = insertPlayerStatsSchema.extend({
  playerId: z.number().int().positive(),
  goals: z.number().int().min(0),
  assists: z.number().int().min(0),
  yellowCards: z.number().int().min(0),
  redCards: z.number().int().min(0),
  instagramFollowers: z.number().int().min(0),
  facebookFollowers: z.number().int().min(0),
  twitterFollowers: z.number().int().min(0),
  fanEngagement: z.number().min(0).max(1),
});

export default function AdminPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("players");
  const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [playerToDelete, setPlayerToDelete] = useState<Player | null>(null);

  // Fetch all players
  const { data: players, isLoading: isLoadingPlayers } = useQuery<Player[]>({
    queryKey: ["/api/players"],
  });

  // Fetch all players with stats and scores
  const { data: playerRankings, isLoading: isLoadingRankings } = useQuery<PlayerWithStats[]>({
    queryKey: ["/api/rankings"],
  });

  // Fetch selected player stats if a player is selected
  const { data: selectedPlayerStats, isLoading: isLoadingStats } = useQuery<PlayerStats>({
    queryKey: ["/api/players", selectedPlayerId, "stats"],
    enabled: selectedPlayerId !== null,
  });

  // Player form
  const playerForm = useForm<z.infer<typeof playerFormSchema>>({
    resolver: zodResolver(playerFormSchema),
    defaultValues: {
      name: "",
      club: "",
      country: "",
      position: "",
      profileImg: "",
      bio: "",
    },
  });

  // Stats form
  const statsForm = useForm<z.infer<typeof statsFormSchema>>({
    resolver: zodResolver(statsFormSchema),
    defaultValues: {
      playerId: 0,
      goals: 0,
      assists: 0,
      yellowCards: 0,
      redCards: 0,
      instagramFollowers: 0,
      facebookFollowers: 0,
      twitterFollowers: 0,
      fanEngagement: 0,
    },
  });

  // Create player mutation
  const createPlayerMutation = useMutation({
    mutationFn: async (data: z.infer<typeof playerFormSchema>) => {
      const response = await apiRequest("POST", "/api/players", data);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/players"] });
      playerForm.reset();
      toast({
        title: "Player created",
        description: "New player has been successfully added.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create player",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update player stats mutation
  const updateStatsMutation = useMutation({
    mutationFn: async (data: z.infer<typeof statsFormSchema>) => {
      const response = await apiRequest("POST", `/api/players/${data.playerId}/stats`, data);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/rankings"] });
      queryClient.invalidateQueries({ queryKey: ["/api/players", selectedPlayerId, "stats"] });
      toast({
        title: "Stats updated",
        description: "Player stats and score have been updated.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update stats",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete player mutation
  const deletePlayerMutation = useMutation({
    mutationFn: async (playerId: number) => {
      await apiRequest("DELETE", `/api/players/${playerId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/players"] });
      queryClient.invalidateQueries({ queryKey: ["/api/rankings"] });
      setIsDeleteDialogOpen(false);
      setPlayerToDelete(null);
      toast({
        title: "Player deleted",
        description: "Player has been successfully removed.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to delete player",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Handler for player form submission
  const onPlayerSubmit = (data: z.infer<typeof playerFormSchema>) => {
    createPlayerMutation.mutate(data);
  };

  // Handler for stats form submission
  const onStatsSubmit = (data: z.infer<typeof statsFormSchema>) => {
    updateStatsMutation.mutate(data);
  };

  // Handler for player selection (to update stats)
  const handlePlayerSelect = (player: Player) => {
    setSelectedPlayerId(player.id);
    
    // Fetch the player's stats and pre-fill the form when the data is available
    statsForm.setValue("playerId", player.id);
  };

  // Update stats form when selected player stats are loaded
  useEffect(() => {
    if (selectedPlayerStats) {
      statsForm.setValue("goals", selectedPlayerStats.goals);
      statsForm.setValue("assists", selectedPlayerStats.assists);
      statsForm.setValue("yellowCards", selectedPlayerStats.yellowCards);
      statsForm.setValue("redCards", selectedPlayerStats.redCards);
      statsForm.setValue("instagramFollowers", selectedPlayerStats.instagramFollowers);
      statsForm.setValue("facebookFollowers", selectedPlayerStats.facebookFollowers);
      statsForm.setValue("twitterFollowers", selectedPlayerStats.twitterFollowers);
      statsForm.setValue("fanEngagement", selectedPlayerStats.fanEngagement);
    }
  }, [selectedPlayerStats, statsForm]);

  // Handler for initiating player deletion
  const handleDeleteClick = (player: Player) => {
    setPlayerToDelete(player);
    setIsDeleteDialogOpen(true);
  };

  // Handler for confirming player deletion
  const confirmDelete = () => {
    if (playerToDelete) {
      deletePlayerMutation.mutate(playerToDelete.id);
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-800 mb-2">Admin Dashboard</h1>
        <p className="text-neutral-600">
          Manage players, update stats, and monitor influence scores.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-8">
          <TabsTrigger value="players">Manage Players</TabsTrigger>
          <TabsTrigger value="stats">Update Stats</TabsTrigger>
          <TabsTrigger value="rankings">View Rankings</TabsTrigger>
          <TabsTrigger value="api">Football API</TabsTrigger>
        </TabsList>

        {/* Manage Players Tab */}
        <TabsContent value="players">
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Add New Player</CardTitle>
                <CardDescription>
                  Create a new player profile with basic information.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...playerForm}>
                  <form 
                    onSubmit={playerForm.handleSubmit(onPlayerSubmit)} 
                    className="space-y-4"
                  >
                    <FormField
                      control={playerForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Player Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Lionel Messi" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={playerForm.control}
                        name="club"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Club</FormLabel>
                            <FormControl>
                              <Input placeholder="Inter Miami CF" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={playerForm.control}
                        name="country"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Country</FormLabel>
                            <FormControl>
                              <Input placeholder="Argentina" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={playerForm.control}
                      name="position"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Position</FormLabel>
                          <FormControl>
                            <Input placeholder="Forward" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={playerForm.control}
                      name="profileImg"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Profile Image URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://example.com/player-image.jpg" {...field} />
                          </FormControl>
                          <FormDescription>
                            Enter a URL to the player's profile image.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={playerForm.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Biography</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Enter player's biography and accomplishments..." 
                              className="resize-none h-32"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={createPlayerMutation.isPending}
                    >
                      {createPlayerMutation.isPending ? (
                        <>
                          <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        <>
                          <UserPlus className="mr-2 h-4 w-4" />
                          Add Player
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Existing Players</CardTitle>
                <CardDescription>
                  View and manage all players in the database.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingPlayers ? (
                  <div className="py-8 text-center">
                    <RefreshCcw className="animate-spin h-8 w-8 mx-auto text-primary mb-4" />
                    <p className="text-neutral-500">Loading players...</p>
                  </div>
                ) : players && players.length > 0 ? (
                  <div className="max-h-[500px] overflow-y-auto pr-2">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Club</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {players.map((player) => (
                          <TableRow key={player.id}>
                            <TableCell>
                              <div className="flex items-center">
                                <img 
                                  src={player.profileImg} 
                                  alt={player.name}
                                  className="h-8 w-8 rounded-full mr-2 object-cover"
                                />
                                <span>{player.name}</span>
                              </div>
                            </TableCell>
                            <TableCell>{player.club}</TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="outline"
                                size="sm"
                                className="mr-1"
                                onClick={() => {
                                  setActiveTab("stats");
                                  handlePlayerSelect(player);
                                }}
                              >
                                Edit Stats
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteClick(player)}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <p className="text-neutral-500">No players found. Add your first player!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Update Stats Tab */}
        <TabsContent value="stats">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Select Player</CardTitle>
                <CardDescription>
                  Choose a player to update their statistics.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingPlayers ? (
                  <div className="py-8 text-center">
                    <RefreshCcw className="animate-spin h-8 w-8 mx-auto text-primary mb-4" />
                    <p className="text-neutral-500">Loading players...</p>
                  </div>
                ) : players && players.length > 0 ? (
                  <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                    {players.map((player) => (
                      <Button
                        key={player.id}
                        variant={selectedPlayerId === player.id ? "default" : "outline"}
                        className="w-full justify-start"
                        onClick={() => handlePlayerSelect(player)}
                      >
                        <div className="flex items-center">
                          <img 
                            src={player.profileImg} 
                            alt={player.name}
                            className="h-8 w-8 rounded-full mr-2 object-cover"
                          />
                          <div className="text-left">
                            <div className="font-medium">{player.name}</div>
                            <div className="text-xs text-neutral-500">{player.club}</div>
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <p className="text-neutral-500">No players found. Add players first!</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Update Player Statistics</CardTitle>
                <CardDescription>
                  Update performance and social media statistics for the selected player.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedPlayerId ? (
                  isLoadingStats ? (
                    <div className="py-8 text-center">
                      <RefreshCcw className="animate-spin h-8 w-8 mx-auto text-primary mb-4" />
                      <p className="text-neutral-500">Loading player stats...</p>
                    </div>
                  ) : (
                    <Form {...statsForm}>
                      <form 
                        onSubmit={statsForm.handleSubmit(onStatsSubmit)} 
                        className="space-y-6"
                      >
                        <div>
                          <h3 className="text-lg font-medium mb-4">Game Performance</h3>
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={statsForm.control}
                              name="goals"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Goals</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      min="0"
                                      {...field}
                                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={statsForm.control}
                              name="assists"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Assists</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      min="0"
                                      {...field}
                                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={statsForm.control}
                              name="yellowCards"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Yellow Cards</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      min="0"
                                      {...field}
                                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={statsForm.control}
                              name="redCards"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Red Cards</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      min="0"
                                      {...field}
                                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div>
                          <h3 className="text-lg font-medium mb-4">Social Media</h3>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <FormField
                              control={statsForm.control}
                              name="instagramFollowers"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Instagram Followers</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      min="0"
                                      {...field}
                                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={statsForm.control}
                              name="facebookFollowers"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Facebook Followers</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      min="0"
                                      {...field}
                                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={statsForm.control}
                              name="twitterFollowers"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Twitter Followers</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      min="0"
                                      {...field}
                                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <div className="mt-4">
                            <FormField
                              control={statsForm.control}
                              name="fanEngagement"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Fan Engagement (0-1)</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      min="0"
                                      max="1"
                                      step="0.01"
                                      {...field}
                                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                    />
                                  </FormControl>
                                  <FormDescription>
                                    Enter a value between 0 and 1 to represent fan engagement percentage.
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                        
                        <Button 
                          type="submit" 
                          className="w-full"
                          disabled={updateStatsMutation.isPending}
                        >
                          {updateStatsMutation.isPending ? (
                            <>
                              <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
                              Updating...
                            </>
                          ) : (
                            <>
                              <Save className="mr-2 h-4 w-4" />
                              Save Statistics
                            </>
                          )}
                        </Button>
                      </form>
                    </Form>
                  )
                ) : (
                  <div className="py-16 text-center">
                    <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <UserPlus className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-medium text-neutral-800 mb-2">No Player Selected</h3>
                    <p className="text-neutral-500 max-w-md mx-auto">
                      Please select a player from the list on the left to update their statistics.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Rankings Tab */}
        <TabsContent value="rankings">
          <Card>
            <CardHeader>
              <CardTitle>Current Player Rankings</CardTitle>
              <CardDescription>
                View the current influence scores and rankings of all players.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingRankings ? (
                <div className="py-8 text-center">
                  <RefreshCcw className="animate-spin h-8 w-8 mx-auto text-primary mb-4" />
                  <p className="text-neutral-500">Loading rankings...</p>
                </div>
              ) : playerRankings && playerRankings.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Rank</TableHead>
                        <TableHead>Player</TableHead>
                        <TableHead>Club</TableHead>
                        <TableHead>Total Score</TableHead>
                        <TableHead>Social</TableHead>
                        <TableHead>Performance</TableHead>
                        <TableHead>Engagement</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {playerRankings.map((item, index) => (
                        <TableRow key={item.player.id}>
                          <TableCell className="font-medium">{index + 1}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <img 
                                src={item.player.profileImg} 
                                alt={item.player.name}
                                className="h-8 w-8 rounded-full mr-2 object-cover"
                              />
                              {item.player.name}
                            </div>
                          </TableCell>
                          <TableCell>{item.player.club}</TableCell>
                          <TableCell className="font-bold text-primary">
                            {Math.round(item.score.totalScore)}
                          </TableCell>
                          <TableCell>{Math.round(item.score.socialScore)}</TableCell>
                          <TableCell>{Math.round(item.score.performanceScore)}</TableCell>
                          <TableCell>{Math.round(item.score.engagementScore)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <Alert>
                  <AlertTitle>No rankings available</AlertTitle>
                  <AlertDescription>
                    Add players and update their statistics to generate rankings.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Football API Integration Tab */}
        <TabsContent value="api">
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Import Players</CardTitle>
                <CardDescription>
                  Import real players from major football leagues using the Football API.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="border rounded-lg p-4 bg-neutral-50">
                    <h3 className="text-lg font-medium mb-2">What This Does</h3>
                    <p className="text-sm text-neutral-600 mb-4">
                      This feature fetches real player data from major football leagues worldwide using
                      the Football API. It will import:
                    </p>
                    <ul className="text-sm text-neutral-600 space-y-1 list-disc pl-5 mb-4">
                      <li>Player profiles (name, club, nationality, position, photo)</li>
                      <li>Performance statistics (goals, assists, cards)</li>
                      <li>Estimated social media metrics</li>
                    </ul>
                    <p className="text-sm text-neutral-600">
                      The import process happens in the background and may take several minutes.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Label htmlFor="playerLimit">Number of Players to Import:</Label>
                      <Input 
                        id="playerLimit" 
                        type="number" 
                        className="w-24" 
                        min="1" 
                        max="50"
                        defaultValue="10"
                      />
                    </div>
                    
                    <ImportPlayersMutation />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Update Player Scores</CardTitle>
                <CardDescription>
                  Recalculate influence scores for all players or update a specific player.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="border rounded-lg p-4 bg-neutral-50">
                    <h3 className="text-lg font-medium mb-2">About Score Updates</h3>
                    <p className="text-sm text-neutral-600 mb-2">
                      Player influence scores are calculated using a weighted formula that combines:
                    </p>
                    <ul className="text-sm text-neutral-600 space-y-1 list-disc pl-5">
                      <li><strong>Social Score (40%):</strong> Based on social media followers</li>
                      <li><strong>Performance Score (40%):</strong> Based on goals, assists, and disciplinary record</li>
                      <li><strong>Engagement Score (20%):</strong> Based on fan interaction metrics</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-4">
                    <UpdateAllScoresMutation />
                    
                    <Separator className="my-4" />
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">Update Individual Player</h3>
                      <div className="space-y-4">
                        <Label>Select a player to update:</Label>
                        {isLoadingPlayers ? (
                          <div className="py-2">
                            <RefreshCcw className="animate-spin h-4 w-4 inline mr-2" />
                            Loading players...
                          </div>
                        ) : players && players.length > 0 ? (
                          <div className="grid grid-cols-1 gap-2 max-h-[250px] overflow-y-auto pr-2">
                            {players.map((player) => (
                              <UpdateSinglePlayerScoreMutation key={player.id} player={player} />
                            ))}
                          </div>
                        ) : (
                          <p className="text-neutral-500">No players found.</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Player</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {playerToDelete?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDelete}
              disabled={deletePlayerMutation.isPending}
            >
              {deletePlayerMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
