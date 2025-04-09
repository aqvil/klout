import { useQuery } from "@tanstack/react-query";
import { PlayerWithStats, Score } from "@shared/schema";
import { useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { FaTwitter, FaInstagram, FaFacebook } from "react-icons/fa";
import { useEffect, useMemo, useState } from "react";
import { PlayerImage } from "@/components/ui/player-image";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar
} from 'recharts';

export default function PlayerPage() {
  const { slug } = useParams<{ slug: string }>();
  const numberId = Number(slug);
  const isIdFormat = !isNaN(numberId);

  const { 
    data: playerDetails, 
    isLoading: isLoadingPlayer,
    error: playerError,
    isError: isPlayerError 
  } = useQuery<PlayerWithStats>({
    queryKey: [`/api/player-details/${slug}`],
    onError: (error: any) => {
      console.error("Error fetching player details:", error);
      console.log("Slug used:", slug);
      if (error.response) {
        console.log("Response status:", error.response.status);
        console.log("Response data:", error.response.data);
      }
    }
  });
  
  // Once we have player details, use the actual ID for getting scores
  const playerId = playerDetails?.player?.id;
  
  const { data: scoreHistory, isLoading: isLoadingScores } = useQuery<Score[]>({
    queryKey: [`/api/players/${playerId}/scores`],
    enabled: !!playerId,
    // Don't retry if we have a valid player but no scores
    retry: (failureCount, error: any) => {
      return failureCount < 2 && error?.response?.status !== 404;
    },
  });
  
  const isLoading = isLoadingPlayer || isLoadingScores;

  // Prepare chart data for recharts
  const chartData = useMemo(() => {
    if (!scoreHistory || scoreHistory.length === 0) {
      // If no score history, create a single data point with current score if available
      if (playerDetails?.score) {
        return [{
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          totalScore: playerDetails.score.totalScore,
          socialScore: playerDetails.score.socialScore,
          performanceScore: playerDetails.score.performanceScore,
          engagementScore: playerDetails.score.engagementScore
        }];
      }
      return [];
    }
    
    return scoreHistory.map(score => ({
      date: score.date ? new Date(score.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '',
      totalScore: score.totalScore,
      socialScore: score.socialScore,
      performanceScore: score.performanceScore,
      engagementScore: score.engagementScore
    }));
  }, [scoreHistory, playerDetails?.score]);
  
  // Format follower count
  const formatFollowers = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };
  
  // Handle player not found or error situations
  if (isPlayerError) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">Player Not Found</h2>
          <p className="mt-2 text-gray-600">
            The player you're looking for doesn't exist or couldn't be loaded.
          </p>
          <Link href="/rankings">
            <Button className="mt-4">Go to Rankings</Button>
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link href="/rankings">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Rankings
          </Button>
        </Link>
      </div>
      
      <Card className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Player Info */}
          <div className="md:col-span-1 p-6 border-b md:border-b-0 md:border-r border-neutral-200">
            <div className="flex flex-col items-center">
              {isLoading ? (
                <>
                  <Skeleton className="w-32 h-32 rounded-full mb-4" />
                  <Skeleton className="h-6 w-40 mb-1" />
                  <Skeleton className="h-4 w-32 mb-4" />
                  <Skeleton className="h-16 w-16 rounded-full mb-4" />
                  <Skeleton className="h-4 w-24 mb-4" />
                </>
              ) : (
                <>
                  <div className="w-32 h-32 rounded-full overflow-hidden mb-4">
                    <PlayerImage
                      src={playerDetails?.player.profileImg || ''}
                      alt={playerDetails?.player.name || ''}
                      className="w-full h-full object-cover"
                      size={256}
                    />
                  </div>
                  <h3 className="text-xl font-bold text-neutral-800 mb-1">{playerDetails?.player.name}</h3>
                  <p className="text-neutral-500 mb-4">{playerDetails?.player.team} • {playerDetails?.player.country}</p>
                  <div className="inline-flex bg-primary text-white text-xl font-bold rounded-full w-16 h-16 items-center justify-center mb-4">
                    {Math.round(playerDetails?.score.totalScore || 0)}
                  </div>
                  <p className="text-sm text-neutral-500 mb-4">Influence Score</p>
                </>
              )}
              
              <div className="flex space-x-4 mb-6">
                {playerDetails?.player.twitterUrl && (
                  <a 
                    href={playerDetails.player.twitterUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-500 hover:text-blue-600"
                    title={`${playerDetails.player.name} on Twitter`}
                  >
                    <FaTwitter className="text-xl" />
                  </a>
                )}
                {playerDetails?.player.instagramUrl && (
                  <a 
                    href={playerDetails.player.instagramUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-pink-600 hover:text-pink-700"
                    title={`${playerDetails.player.name} on Instagram`}
                  >
                    <FaInstagram className="text-xl" />
                  </a>
                )}
                {playerDetails?.player.facebookUrl && (
                  <a 
                    href={playerDetails.player.facebookUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-800 hover:text-blue-900"
                    title={`${playerDetails.player.name} on Facebook`}
                  >
                    <FaFacebook className="text-xl" />
                  </a>
                )}
              </div>
              
              <div className="w-full flex justify-between text-sm border-t border-neutral-200 pt-4">
                {isLoading ? (
                  <>
                    <div className="text-center">
                      <Skeleton className="h-6 w-20 mx-auto mb-1" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <div className="text-center">
                      <Skeleton className="h-6 w-10 mx-auto mb-1" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                    <div className="text-center">
                      <Skeleton className="h-6 w-10 mx-auto mb-1" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-neutral-800">
                        {formatFollowers(
                          (playerDetails?.stats.instagramFollowers || 0) + 
                          (playerDetails?.stats.facebookFollowers || 0) + 
                          (playerDetails?.stats.twitterFollowers || 0)
                        )}
                      </div>
                      <p className="text-neutral-500">Social Followers</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-neutral-800">
                        {playerDetails?.stats.goals || 0}
                      </div>
                      <p className="text-neutral-500">Goals</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-neutral-800">
                        {playerDetails?.stats.assists || 0}
                      </div>
                      <p className="text-neutral-500">Assists</p>
                    </div>
                  </>
                )}
              </div>
              
              {!isLoading && playerDetails?.player.bio && (
                <div className="mt-6 border-t border-neutral-200 pt-4 w-full">
                  <h4 className="font-medium text-neutral-800 mb-2">Player Bio</h4>
                  <p className="text-sm text-neutral-600">{playerDetails.player.bio}</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Player Stats & Charts */}
          <div className="md:col-span-2 p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-neutral-800 mb-4">Influence Score History</h3>
              <div className="bg-neutral-50 p-4 rounded-lg" style={{ height: "280px" }}>
                {isLoading ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <Skeleton className="h-4/5 w-full rounded-lg" />
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={chartData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="totalScoreGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="socialScoreGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6D28D9" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#6D28D9" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fontSize: 12, fill: '#6B7280' }}
                        tickMargin={10}
                      />
                      <YAxis 
                        tick={{ fontSize: 12, fill: '#6B7280' }}
                        tickMargin={10}
                        domain={[0, 100]}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#FFF', 
                          borderRadius: '0.5rem',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                          border: 'none'
                        }}
                        labelStyle={{ fontWeight: 'bold', color: '#111827' }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="totalScore" 
                        stroke="#3B82F6" 
                        fill="url(#totalScoreGradient)" 
                        strokeWidth={3}
                        name="Total Score"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="socialScore" 
                        stroke="#6D28D9" 
                        fill="url(#socialScoreGradient)" 
                        strokeWidth={2}
                        name="Social Score"
                        opacity={0.7}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-neutral-800 mb-4">Game Performance</h3>
                {isLoading ? (
                  <div className="space-y-4">
                    {Array(4).fill(0).map((_, i) => (
                      <div key={i}>
                        <div className="flex justify-between mb-1">
                          <Skeleton className="h-4 w-20" />
                          <Skeleton className="h-4 w-10" />
                        </div>
                        <Skeleton className="h-2 w-full" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-neutral-700">Goals</span>
                        <span className="text-sm font-medium text-neutral-700">{playerDetails?.stats.goals}</span>
                      </div>
                      <ProgressBar 
                        value={Math.min(playerDetails?.stats.goals || 0, 50) * 2} 
                        color="secondary" 
                        showLabel={false}
                      />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-neutral-700">Assists</span>
                        <span className="text-sm font-medium text-neutral-700">{playerDetails?.stats.assists}</span>
                      </div>
                      <ProgressBar 
                        value={Math.min(playerDetails?.stats.assists || 0, 40) * 2.5} 
                        color="secondary" 
                        showLabel={false}
                      />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-neutral-700">Yellow Cards</span>
                        <span className="text-sm font-medium text-neutral-700">{playerDetails?.stats.yellowCards}</span>
                      </div>
                      <ProgressBar 
                        value={Math.min(playerDetails?.stats.yellowCards || 0, 20) * 5} 
                        color="accent" 
                        showLabel={false}
                      />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-neutral-700">Red Cards</span>
                        <span className="text-sm font-medium text-neutral-700">{playerDetails?.stats.redCards}</span>
                      </div>
                      <ProgressBar 
                        value={Math.min(playerDetails?.stats.redCards || 0, 5) * 20} 
                        color="accent" 
                        showLabel={false}
                      />
                    </div>
                  </div>
                )}
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-neutral-800 mb-4">Social Influence</h3>
                {isLoading ? (
                  <div className="space-y-4">
                    {Array(4).fill(0).map((_, i) => (
                      <div key={i}>
                        <div className="flex justify-between mb-1">
                          <Skeleton className="h-4 w-20" />
                          <Skeleton className="h-4 w-16" />
                        </div>
                        <Skeleton className="h-2 w-full" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-neutral-700">Instagram</span>
                        <span className="text-sm font-medium text-neutral-700">
                          {formatFollowers(playerDetails?.stats.instagramFollowers || 0)}
                        </span>
                      </div>
                      <ProgressBar 
                        value={Math.min(
                          Math.log10(playerDetails?.stats.instagramFollowers || 1) / 8 * 100, 
                          100
                        )} 
                        color="primary" 
                        showLabel={false}
                      />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-neutral-700">Facebook</span>
                        <span className="text-sm font-medium text-neutral-700">
                          {formatFollowers(playerDetails?.stats.facebookFollowers || 0)}
                        </span>
                      </div>
                      <ProgressBar 
                        value={Math.min(
                          Math.log10(playerDetails?.stats.facebookFollowers || 1) / 8 * 100, 
                          100
                        )} 
                        color="primary" 
                        showLabel={false}
                      />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-neutral-700">Twitter</span>
                        <span className="text-sm font-medium text-neutral-700">
                          {formatFollowers(playerDetails?.stats.twitterFollowers || 0)}
                        </span>
                      </div>
                      <ProgressBar 
                        value={Math.min(
                          Math.log10(playerDetails?.stats.twitterFollowers || 1) / 7 * 100, 
                          100
                        )} 
                        color="primary" 
                        showLabel={false}
                      />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-neutral-700">Fan Engagement</span>
                        <span className="text-sm font-medium text-neutral-700">
                          {playerDetails?.stats.fanEngagement ? `${playerDetails.stats.fanEngagement * 100}%` : 'N/A'}
                        </span>
                      </div>
                      <ProgressBar 
                        value={playerDetails?.stats.fanEngagement ? playerDetails.stats.fanEngagement * 100 : 0} 
                        color="primary" 
                        showLabel={false}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-8 pt-4 border-t border-neutral-200">
              <h3 className="text-lg font-semibold text-neutral-800 mb-4">Score Breakdown</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {isLoading ? (
                  <>
                    <div className="space-y-4">
                      {Array(4).fill(0).map((_, i) => (
                        <div key={i} className="flex items-center">
                          <Skeleton className="h-5 w-32 mr-4" />
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-10 ml-4" />
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-center">
                      <Skeleton className="h-64 w-64 rounded-full" />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center mb-1">
                          <span className="text-sm font-medium text-neutral-700 w-32">Overall Score:</span>
                          <ProgressBar 
                            value={playerDetails?.score.totalScore || 0} 
                            color="primary" 
                            size="lg"
                            className="flex-grow"
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center mb-1">
                          <span className="text-sm font-medium text-neutral-700 w-32">Social Media:</span>
                          <ProgressBar 
                            value={playerDetails?.score.socialScore || 0} 
                            color="secondary" 
                            size="md"
                            className="flex-grow"
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center mb-1">
                          <span className="text-sm font-medium text-neutral-700 w-32">Game Performance:</span>
                          <ProgressBar 
                            value={playerDetails?.score.performanceScore || 0} 
                            color="secondary" 
                            size="md"
                            className="flex-grow"
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center mb-1">
                          <span className="text-sm font-medium text-neutral-700 w-32">Fan Engagement:</span>
                          <ProgressBar 
                            value={playerDetails?.score.engagementScore || 0} 
                            color="secondary" 
                            size="md"
                            className="flex-grow"
                          />
                        </div>
                      </div>
                    </div>
                    {playerDetails && (
                      <div className="h-64 flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={[
                                { name: 'Social', value: playerDetails.score.socialScore },
                                { name: 'Performance', value: playerDetails.score.performanceScore },
                                { name: 'Engagement', value: playerDetails.score.engagementScore }
                              ]}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={3}
                              dataKey="value"
                              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                              labelLine={false}
                            >
                              <Cell fill="#3B82F6" />
                              <Cell fill="#6D28D9" />
                              <Cell fill="#8B5CF6" />
                            </Pie>
                            <Tooltip 
                              formatter={(value) => [`${value} points`, '']}
                              contentStyle={{ 
                                backgroundColor: '#FFF', 
                                borderRadius: '0.5rem',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                                border: 'none'
                              }}
                            />
                            <Legend verticalAlign="bottom" />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </main>
  );
}
