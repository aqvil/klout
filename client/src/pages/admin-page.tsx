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
import { RefreshCcw, Save, Trash, UserPlus, Download, BarChart, Users, Zap, Key, Eye, EyeOff } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
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

// Test API Connection Component
function TestApiConnection() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState<{
    success: boolean;
    message: string;
    rateLimit?: boolean;
    leagues?: any[];
  } | null>(null);
  
  const testApiConnection = async () => {
    setIsLoading(true);
    setApiStatus(null);
    
    try {
      const response = await apiRequest("GET", "/api/test-football-api");
      
      // Check for rate limit response (429)
      if (response.status === 429) {
        const data = await response.json();
        setApiStatus({
          success: false,
          message: data.message || "API rate limit exceeded. The API allows only 50 requests per day.",
          rateLimit: true
        });
        
        toast({
          title: "Rate Limit Exceeded",
          description: "You've reached the daily limit of 50 API requests. Please try again tomorrow.",
          variant: "destructive",
        });
        return;
      }
      
      if (!response.ok) {
        let errorMessage = `API responded with status: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          // If we can't parse JSON, try to get text
          try {
            const errorText = await response.text();
            errorMessage = `${errorMessage}. Response: ${errorText.substring(0, 100)}...`;
          } catch (textError) {
            // If we can't get text either, just use the status
          }
        }
        
        setApiStatus({
          success: false,
          message: errorMessage
        });
        
        toast({
          title: "Connection Failed",
          description: errorMessage,
          variant: "destructive",
        });
        return;
      }
      
      // If we got here, we have a successful response
      const data = await response.json();
      setApiStatus(data);
      
      if (data.success) {
        toast({
          title: "Success",
          description: "Football API connection is working properly",
        });
      } else {
        toast({
          title: "Connection Failed",
          description: data.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      let message = error instanceof Error ? error.message : "Unknown error";
      
      // Special handling for the HTML parsing error
      if (message.includes("Unexpected token '<'") || message.includes("<!DOCTYPE")) {
        message = "API returned HTML instead of JSON. This usually indicates an authentication error with the API key.";
        
        setApiStatus({
          success: false,
          message: `API Authentication Error: The API key may be invalid or expired.`,
          rateLimit: false
        });
        
        toast({
          title: "API Authentication Error",
          description: "The Football API key appears to be invalid or expired. Please check your API key configuration.",
          variant: "destructive",
        });
      } else {
        setApiStatus({
          success: false,
          message: `API test failed: ${message}`,
        });
        
        toast({
          title: "Connection Error",
          description: message,
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="space-y-4">
      <Button 
        onClick={testApiConnection}
        disabled={isLoading}
        variant="outline"
        className="w-full"
      >
        {isLoading ? (
          <>
            <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
            Testing API Connection...
          </>
        ) : (
          <>Test Football API Connection</>
        )}
      </Button>
      
      {apiStatus && (
        <div className={`p-4 border rounded-md ${apiStatus.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
          <div className="font-medium mb-2">
            {apiStatus.success ? 'API Connection Successful' : 'API Connection Failed'}
          </div>
          <div className="text-sm">
            {apiStatus.message}
          </div>
          {apiStatus.rateLimit && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <div className="font-medium text-yellow-800 mb-1">API Rate Limit Information</div>
              <div className="text-sm text-yellow-700">
                The Football API limits us to 50 requests per day. Please use the API calls carefully:
                <ul className="list-disc pl-5 mt-2">
                  <li>Each player import uses multiple API calls</li>
                  <li>Try importing just a few players at a time</li>
                  <li>Test connections only when necessary</li>
                  <li>Rate limits reset every 24 hours</li>
                </ul>
              </div>
            </div>
          )}
          {apiStatus.success && apiStatus.leagues && (
            <div className="mt-4">
              <div className="font-medium mb-2">Sample Leagues from API:</div>
              <ul className="text-sm space-y-1">
                {apiStatus.leagues.slice(0, 3).map((league: any, index: number) => (
                  <li key={index}>
                    {league.league.name} ({league.country.name})
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Import Local Players Mutation Component
function ImportLocalPlayersMutation() {
  const { toast } = useToast();
  
  const importLocalPlayersMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/import-local-players", {});
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
    <div className="space-y-4">
      <div className="border rounded-lg p-4 bg-neutral-50">
        <h3 className="text-lg font-medium mb-2">About Local Player Database</h3>
        <p className="text-sm text-neutral-600 mb-2">
          This feature imports a curated database of real football players from major leagues 
          worldwide. It provides complete player profiles with:
        </p>
        <ul className="text-sm text-neutral-600 space-y-1 list-disc pl-5 mb-4">
          <li>Performance statistics (goals, assists, cards)</li>
          <li>Social media metrics from various platforms</li>
          <li>Profile information and images</li>
        </ul>
        <p className="text-sm text-neutral-600 mb-2">
          Unlike the Football API, this data isn't rate-limited and will be automatically updated.
        </p>
      </div>
      <Button
        onClick={() => importLocalPlayersMutation.mutate()}
        disabled={importLocalPlayersMutation.isPending}
        className="w-full"
      >
        {importLocalPlayersMutation.isPending ? (
          <>
            <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
            Importing Players...
          </>
        ) : (
          <>
            <Download className="mr-2 h-4 w-4" />
            Import Players from Database
          </>
        )}
      </Button>
      {importLocalPlayersMutation.isSuccess && (
        <Alert className="bg-green-50">
          <AlertTitle>Import started successfully</AlertTitle>
          <AlertDescription>
            Players are being imported in the background. Data will be available shortly.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

// Auto Update Management Component
function AutoUpdateManagement() {
  const { toast } = useToast();
  const [updateInterval, setUpdateInterval] = useState<number>(60);
  const [isRunning, setIsRunning] = useState<boolean>(true);
  
  // Start automatic updates mutation
  const startUpdatesMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/auto-updates/start", { interval: updateInterval });
      return await response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Automatic updates started",
        description: data.message,
      });
      setIsRunning(true);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to start updates",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Stop automatic updates mutation
  const stopUpdatesMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/auto-updates/stop", {});
      return await response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Automatic updates stopped",
        description: data.message,
      });
      setIsRunning(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to stop updates",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Run updates now mutation
  const runNowMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/auto-updates/run-now", {});
      return await response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Manual update started",
        description: data.message,
      });
      
      // After a delay, invalidate queries to refresh the data
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["/api/rankings"] });
      }, 10000);
    },
    onError: (error: Error) => {
      toast({
        title: "Manual update failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const handleStartStop = () => {
    if (isRunning) {
      stopUpdatesMutation.mutate();
    } else {
      startUpdatesMutation.mutate();
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="border rounded-lg p-4 bg-neutral-50">
        <h3 className="text-lg font-medium mb-2">Automatic Data Updates</h3>
        <p className="text-sm text-neutral-600 mb-2">
          Player data is automatically updated to ensure the most current statistics and social metrics:
        </p>
        <ul className="text-sm text-neutral-600 space-y-1 list-disc pl-5">
          <li>Social media metrics (followers, engagement)</li>
          <li>Performance statistics</li>
          <li>Influence scores (recalculated with fresh data)</li>
        </ul>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <Label htmlFor="updateInterval">Update Interval (minutes)</Label>
            <div className="flex items-center gap-2 mt-1">
              <Input
                id="updateInterval"
                type="number"
                min="15"
                max="1440"
                value={updateInterval}
                onChange={(e) => setUpdateInterval(parseInt(e.target.value) || 60)}
                className="w-24"
                disabled={startUpdatesMutation.isPending || stopUpdatesMutation.isPending}
              />
              <Button
                onClick={handleStartStop}
                disabled={startUpdatesMutation.isPending || stopUpdatesMutation.isPending}
                variant={isRunning ? "destructive" : "default"}
                className="flex-1"
              >
                {startUpdatesMutation.isPending || stopUpdatesMutation.isPending ? (
                  <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
                ) : isRunning ? (
                  <>Stop Updates</>
                ) : (
                  <>Start Updates</>
                )}
              </Button>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label>Current Status</Label>
          <div className={`p-3 rounded-md ${isRunning ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'}`}>
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-2 ${isRunning ? 'bg-green-500' : 'bg-amber-500'}`}></div>
              <span className="text-sm font-medium">
                {isRunning ? 'Automatic updates are running' : 'Automatic updates are stopped'}
              </span>
            </div>
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Manual Update</h3>
          <p className="text-sm text-neutral-600">
            Run an immediate update of all player data without waiting for the automatic interval.
          </p>
          <Button
            onClick={() => runNowMutation.mutate()}
            disabled={runNowMutation.isPending}
            variant="outline"
            className="w-full"
          >
            {runNowMutation.isPending ? (
              <>
                <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
                Updating All Players...
              </>
            ) : (
              <>
                <BarChart className="mr-2 h-4 w-4" />
                Update All Players Now
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

// Import Football API Player Mutation Component
function ImportPlayersMutation() {
  const { toast } = useToast();
  const [limit, setLimit] = useState(10);
  const [inputEl, setInputEl] = useState<HTMLInputElement | null>(null);
  
  const importPlayersMutation = useMutation({
    mutationFn: async () => {
      // Get the limit value from the input field
      const limitValue = inputEl ? parseInt(inputEl.value) || 10 : limit;
      
      // Validate the limit
      if (limitValue < 1 || limitValue > 200) {
        throw new Error("Please enter a number between 1 and 200");
      }
      
      const response = await apiRequest("POST", "/api/import-players", { limit: limitValue });
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
    <div className="space-y-4">
      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
        <div className="font-medium text-yellow-800 mb-1">API Rate Limit Warning</div>
        <div className="text-sm text-yellow-700">
          The Football API has a daily limit of 50 requests. To conserve requests:
          <ul className="list-disc pl-5 mt-2">
            <li>Start with 10-20 players to test the import</li>
            <li>Each player requires multiple API calls</li>
            <li>You can import up to 200 players, but it will use more API calls</li>
            <li>If you hit rate limits, you'll need to wait until tomorrow</li>
          </ul>
        </div>
      </div>
    
      <div className="flex items-center gap-2">
        <Input
          id="playerLimitInput"
          type="number"
          min="1"
          max="200"
          defaultValue="10"
          ref={setInputEl}
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
              Import Real Players
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

// API Key Management Component
function ApiKeyManagement() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [isApiKeyHidden, setIsApiKeyHidden] = useState(true);
  
  // Fetch current API key
  const { data, isLoading: isLoadingSettings, refetch } = useQuery<{ value: string | null }>({
    queryKey: ["/api/settings/FOOTBALL_API_KEY"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/settings/FOOTBALL_API_KEY");
      if (!response.ok) {
        throw new Error("Failed to fetch API key setting");
      }
      return await response.json();
    }
  });
  
  // Update API key display when data changes
  useEffect(() => {
    if (data?.value) {
      // Only show first few and last few characters
      const value = data.value;
      if (value.length > 8) {
        const masked = `${value.substring(0, 4)}...${value.substring(value.length - 4)}`;
        setApiKey(isApiKeyHidden ? masked : value);
      } else {
        setApiKey(isApiKeyHidden ? "****" : value);
      }
    } else {
      setApiKey("");
    }
  }, [data, isApiKeyHidden]);
  
  // Update API key mutation
  const updateApiKeyMutation = useMutation({
    mutationFn: async (newKey: string) => {
      const response = await apiRequest("PUT", "/api/settings/FOOTBALL_API_KEY", { value: newKey });
      if (!response.ok) {
        throw new Error("Failed to update API key");
      }
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "API Key Updated",
        description: "The Football API key has been successfully updated.",
      });
      refetch(); // Refresh the API key data
      setIsApiKeyHidden(true); // Re-hide the API key
    },
    onError: (error) => {
      toast({
        title: "Failed to update API key",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    }
  });
  
  const handleUpdateApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      updateApiKeyMutation.mutate(apiKey);
    } else {
      toast({
        title: "API Key Required",
        description: "Please enter a valid API key.",
        variant: "destructive",
      });
    }
  };
  
  const toggleApiKeyVisibility = () => {
    if (isApiKeyHidden && data?.value) {
      // When revealing the API key, set the full value
      setApiKey(data.value);
    } else if (!isApiKeyHidden && data?.value) {
      // When hiding the API key, mask it
      const value = data.value;
      const masked = value.length > 8 
        ? `${value.substring(0, 4)}...${value.substring(value.length - 4)}`
        : "****";
      setApiKey(masked);
    }
    setIsApiKeyHidden(!isApiKeyHidden);
  };
  
  return (
    <div className="space-y-6">
      <div className="border rounded-lg p-4 bg-neutral-50">
        <h3 className="text-lg font-medium mb-2">Football API Key</h3>
        <p className="text-sm text-neutral-600 mb-4">
          The application requires an API key from <a href="https://www.api-football.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">API-Football</a> or RapidAPI. Register for a free account to get an API key with 50 daily requests. The key is stored securely and used for all API requests.
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4">
          <p className="text-sm text-blue-700">
            <strong>API Options:</strong> You can use either:
            <ul className="list-disc ml-5 mt-1">
              <li>API-Football direct key (format: <code className="bg-blue-100 px-1 rounded">abcd1234...</code>)</li> 
              <li>RapidAPI key (longer format: <code className="bg-blue-100 px-1 rounded">a1b2c3d4e5f6...</code>)</li>
            </ul>
          </p>
        </div>
        <form onSubmit={handleUpdateApiKey} className="space-y-4">
          <div className="flex flex-col space-y-2">
            <Label htmlFor="apiKey">API Key</Label>
            <div className="flex">
              <Input
                id="apiKey"
                type={isApiKeyHidden ? "password" : "text"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="flex-1"
                placeholder="Enter your Football API key"
              />
              <Button 
                type="button" 
                variant="outline" 
                onClick={toggleApiKeyVisibility}
                className="ml-2"
              >
                {isApiKeyHidden ? (
                  <>
                    <Eye className="h-4 w-4 mr-1" />
                    Show
                  </>
                ) : (
                  <>
                    <EyeOff className="h-4 w-4 mr-1" />
                    Hide
                  </>
                )}
              </Button>
            </div>
          </div>
          <Button 
            type="submit" 
            disabled={updateApiKeyMutation.isPending || isLoadingSettings}
            className="w-full"
          >
            {updateApiKeyMutation.isPending ? (
              <>
                <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
                Updating API Key...
              </>
            ) : (
              <>
                <Key className="mr-2 h-4 w-4" />
                Update API Key
              </>
            )}
          </Button>
        </form>
      </div>
      <Alert className="bg-amber-50 border-amber-200">
        <AlertTitle>Important Information About the API Key</AlertTitle>
        <AlertDescription>
          <ul className="list-disc space-y-1 pl-5 text-sm text-amber-800">
            <li>The API key is used to authenticate with the Football API service</li>
            <li>The free tier of the API has a limit of 50 requests per day</li>
            <li>The key is securely stored in the database</li>
            <li>After updating the key, test the connection to verify it works</li>
          </ul>
        </AlertDescription>
      </Alert>
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
          <div className="text-xs text-neutral-500">{player.team}</div>
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
                            <TableCell>{player.team}</TableCell>
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
                            <div className="text-xs text-neutral-500">{player.team}</div>
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
                          <TableCell>{item.player.team}</TableCell>
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
                <CardTitle>Player Database</CardTitle>
                <CardDescription>
                  Import player data and manage automatic updates.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <ImportLocalPlayersMutation />
                  <Separator />
                  <AutoUpdateManagement />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>API Configuration</CardTitle>
                <CardDescription>
                  Manage API keys and test external services.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <ApiKeyManagement />
                  
                  <Separator />
                  
                  <div className="border rounded-lg p-4 bg-neutral-50">
                    <h3 className="text-lg font-medium mb-2">About the Football API</h3>
                    <p className="text-sm text-neutral-600 mb-4">
                      This application uses real-time football data from <a href="https://www.api-football.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">API-Football</a>. The free tier provides 50 requests per day, which is enough to import and update a few players daily.
                    </p>
                    <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4">
                      <p className="text-sm text-blue-700">
                        <strong>Getting Started:</strong>
                        <ol className="list-decimal ml-5 mt-1 space-y-1">
                          <li>Register for a free API key at <a href="https://www.api-football.com/register" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">API-Football</a></li> 
                          <li>Enter your API key in the configuration section above</li>
                          <li>Test your connection using the button below</li>
                          <li>Import players from top leagues</li>
                        </ol>
                      </p>
                    </div>
                    <p className="text-sm text-neutral-600">
                      The built-in local player database is recommended for most use cases, but you can
                      still use the API for testing or specific player lookups.
                    </p>
                  </div>
                  
                  <TestApiConnection />
                  
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-md">
                    <div className="font-medium text-amber-800 mb-1">Legacy Import Method</div>
                    <div className="text-sm text-amber-700 mb-2">
                      The Football API import feature is limited by API rate restrictions. 
                      We recommend using the Local Player Database import instead.
                    </div>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="show-legacy">
                        <AccordionTrigger className="text-sm text-amber-800">
                          Show Football API Import
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="pt-4 space-y-4">
                            <ImportPlayersMutation />
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
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
