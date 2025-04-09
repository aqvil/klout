import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ProgressBar } from "@/components/ui/progress-bar";
import { TrendIndicator } from "@/components/ui/trend-indicator";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ArrowRight, CheckCircle, Download, Share2 } from "lucide-react";
import { useState } from "react";
import { PlayerWithStats } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function HomePage() {
  const [selectedLeague, setSelectedLeague] = useState("all");
  const [selectedTimeframe, setSelectedTimeframe] = useState("week");
  
  // Fetch top ranked players
  const { data: rankings, isLoading: isLoadingRankings } = useQuery<PlayerWithStats[]>({
    queryKey: ["/api/rankings", { limit: 5 }],
  });
  
  // Fetch top performers by category
  const { data: topSocialPlayers, isLoading: isLoadingSocial } = useQuery<PlayerWithStats[]>({
    queryKey: ["/api/top-players/social", { limit: 5 }],
  });
  
  const { data: topPerformancePlayers, isLoading: isLoadingPerformance } = useQuery<PlayerWithStats[]>({
    queryKey: ["/api/top-players/performance", { limit: 5 }],
  });
  
  const { data: topEngagementPlayers, isLoading: isLoadingEngagement } = useQuery<PlayerWithStats[]>({
    queryKey: ["/api/top-players/engagement", { limit: 5 }],
  });
  
  // Helper function to format large numbers
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };
  
  // Count total players
  const { data: playerCount } = useQuery<number>({
    queryKey: ["/api/player-count"],
    select: (data) => data || 0,
    initialData: 0
  });
  
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <section className="mb-12">
        <div className="bg-primary rounded-xl shadow-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2 p-8 md:p-12">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Klout.soccer Player Influence</h1>
              <p className="text-neutral-100 mb-6">
                Tracking real-time influence metrics for {playerCount || "thousands of"} soccer players based on performance, 
                social media presence, and fan engagement.
              </p>
              <div className="flex space-x-4">
                <Link href="/rankings">
                  <Button className="bg-secondary hover:bg-secondary-dark text-white px-6 py-3 rounded-lg font-medium">
                    View Rankings
                  </Button>
                </Link>
                <Link href="/about">
                  <Button variant="outline" className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-medium">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 relative" style={{ minHeight: "240px" }}>
              {topPerformancePlayers && topPerformancePlayers.length > 0 ? (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-primary to-primary-dark p-4">
                  <div className="text-center text-white">
                    <h2 className="text-2xl font-bold mb-3">Top Player: {topPerformancePlayers[0]?.player.name}</h2>
                    <div className="flex justify-center">
                      <img 
                        src={topPerformancePlayers[0]?.player.profileImg || `https://ui-avatars.com/api/?name=${encodeURIComponent(topPerformancePlayers[0]?.player.name)}&size=100&background=random`}
                        alt={topPerformancePlayers[0]?.player.name} 
                        className="w-24 h-24 rounded-full object-cover border-4 border-white" 
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null; 
                          target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(topPerformancePlayers[0]?.player.name)}&size=100&background=random`;
                        }}
                      />
                    </div>
                    <p className="mt-2 opacity-90">Team: {topPerformancePlayers[0]?.player.team}</p>
                    <div className="mt-3 flex justify-center space-x-4">
                      <div>
                        <div className="text-2xl font-bold">{Math.round(topPerformancePlayers[0]?.score.totalScore)}%</div>
                        <div className="text-xs opacity-75">Overall</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold">{Math.round(topPerformancePlayers[0]?.score.performanceScore)}%</div>
                        <div className="text-xs opacity-75">Performance</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold">{Math.round(topPerformancePlayers[0]?.score.socialScore)}%</div>
                        <div className="text-xs opacity-75">Social</div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="absolute inset-0 bg-primary-dark flex items-center justify-center">
                  <div className="text-white text-center p-6">
                    <h2 className="text-2xl font-bold mb-2">Loading Player Data...</h2>
                    <p>Real-time metrics from top leagues worldwide</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Rankings Overview */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-neutral-800">Top Ranked Players</h2>
          <div className="flex items-center space-x-4">
            <Select value={selectedLeague} onValueChange={setSelectedLeague}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Leagues" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Leagues</SelectItem>
                <SelectItem value="premier">Premier League</SelectItem>
                <SelectItem value="laliga">La Liga</SelectItem>
                <SelectItem value="bundesliga">Bundesliga</SelectItem>
                <SelectItem value="seriea">Serie A</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Last Week" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Last Week</SelectItem>
                <SelectItem value="month">Last Month</SelectItem>
                <SelectItem value="quarter">Last 3 Months</SelectItem>
                <SelectItem value="season">This Season</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Card className="mb-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-200">
              <thead className="bg-neutral-100">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">Rank</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">Player</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">Club</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                    <div className="flex items-center cursor-pointer">
                      Influence Score
                      <ArrowRight className="ml-1 h-4 w-4 rotate-90 text-primary" />
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                    <div className="flex items-center cursor-pointer">
                      Social Media
                      <ArrowRight className="ml-1 h-4 w-4 text-neutral-400" />
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                    <div className="flex items-center cursor-pointer">
                      Game Performance
                      <ArrowRight className="ml-1 h-4 w-4 text-neutral-400" />
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">Trend</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-neutral-200">
                {isLoadingRankings ? (
                  Array(5).fill(0).map((_, index) => (
                    <tr key={index} className="hover:bg-neutral-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-neutral-700">
                        <Skeleton className="h-6 w-6" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Skeleton className="h-10 w-10 rounded-full" />
                          <div className="ml-4">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-3 w-16 mt-1" />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Skeleton className="h-4 w-24" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Skeleton className="h-6 w-12" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Skeleton className="h-4 w-32" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Skeleton className="h-4 w-32" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Skeleton className="h-4 w-16" />
                      </td>
                    </tr>
                  ))
                ) : (
                  rankings?.map((item, index) => (
                    <tr key={item.player.id} className="hover:bg-neutral-50 cursor-pointer">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-neutral-700">{index + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link href={`/players/${item.player.id}`}>
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <img 
                                className="h-10 w-10 rounded-full object-cover" 
                                src={item.player.profileImg} 
                                alt={item.player.name}
                                onError={(e) => {
                                  // Fallback to a placeholder if the image fails to load
                                  const target = e.target as HTMLImageElement;
                                  target.onerror = null; // Prevent infinite loop
                                  target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.player.name)}&size=100&background=random`;
                                }}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-neutral-900">{item.player.name}</div>
                              <div className="text-sm text-neutral-500">{item.player.country}</div>
                            </div>
                          </div>
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-700">{item.player.team}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-lg font-bold text-primary">{Math.round(item.score.totalScore)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-700">
                        <ProgressBar value={Math.round(item.score.socialScore)} color="secondary" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-700">
                        <ProgressBar value={Math.round(item.score.performanceScore)} color="secondary" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-700">
                        <TrendIndicator value={Math.round((item.score.totalScore - 50) / 10)} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="bg-white px-6 py-4 border-t border-neutral-200 flex items-center justify-between">
            <div className="flex-1 flex justify-between sm:hidden">
              <Button variant="outline" size="sm">Previous</Button>
              <Button variant="outline" size="sm">Next</Button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-neutral-700">
                  Showing <span className="font-medium">1</span> to <span className="font-medium">{rankings?.length || 0}</span> of <span className="font-medium">{playerCount || 0}</span> players
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <Link href="/rankings">
                    <Button variant="outline" size="sm" className="relative inline-flex items-center px-4 py-2 border border-neutral-300 text-sm font-medium">
                      View All Rankings
                    </Button>
                  </Link>
                </nav>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* Top Performers By Category */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-neutral-800">Top Performers by Category</h2>
          <div className="flex space-x-2">
            <Button variant="outline" className="inline-flex items-center justify-center">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
            <Button variant="outline" className="inline-flex items-center justify-center">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {/* Social Media Stars */}
          <Card>
            <div className="p-6 border-b border-neutral-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-neutral-800">Social Media Stars</h3>
                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">Top 5</span>
              </div>
            </div>
            <CardContent className="p-6">
              <ul className="divide-y divide-neutral-200">
                {isLoadingSocial ? (
                  Array(5).fill(0).map((_, index) => (
                    <li key={index} className="py-3 flex justify-between items-center">
                      <div className="flex items-center">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <div className="ml-3">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-3 w-16 mt-1" />
                        </div>
                      </div>
                      <Skeleton className="h-4 w-10" />
                    </li>
                  ))
                ) : (
                  topSocialPlayers?.map((item) => (
                    <li key={item.player.id} className="py-3 flex justify-between items-center">
                      <Link href={`/players/${item.player.id}`}>
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8">
                            <img className="h-8 w-8 rounded-full" src={item.player.profileImg} alt={item.player.name} />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-neutral-900">{item.player.name}</p>
                            <p className="text-xs text-neutral-500">{item.player.team}</p>
                          </div>
                        </div>
                      </Link>
                      <div className="text-sm font-bold text-primary">{Math.round(item.score.socialScore)}%</div>
                    </li>
                  ))
                )}
              </ul>
            </CardContent>
          </Card>
          
          {/* Game Performers */}
          <Card>
            <div className="p-6 border-b border-neutral-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-neutral-800">Game Performers</h3>
                <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded">Top 5</span>
              </div>
            </div>
            <CardContent className="p-6">
              <ul className="divide-y divide-neutral-200">
                {isLoadingPerformance ? (
                  Array(5).fill(0).map((_, index) => (
                    <li key={index} className="py-3 flex justify-between items-center">
                      <div className="flex items-center">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <div className="ml-3">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-3 w-16 mt-1" />
                        </div>
                      </div>
                      <Skeleton className="h-4 w-10" />
                    </li>
                  ))
                ) : (
                  topPerformancePlayers?.map((item) => (
                    <li key={item.player.id} className="py-3 flex justify-between items-center">
                      <Link href={`/players/${item.player.id}`}>
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8">
                            <img className="h-8 w-8 rounded-full" src={item.player.profileImg} alt={item.player.name} />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-neutral-900">{item.player.name}</p>
                            <p className="text-xs text-neutral-500">{item.player.team}</p>
                          </div>
                        </div>
                      </Link>
                      <div className="text-sm font-bold text-secondary">{Math.round(item.score.performanceScore)}%</div>
                    </li>
                  ))
                )}
              </ul>
            </CardContent>
          </Card>
          
          {/* Fan Engagement */}
          <Card>
            <div className="p-6 border-b border-neutral-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-neutral-800">Fan Engagement</h3>
                <span className="bg-purple-100 text-purple-800 text-xs font-semibold px-2.5 py-0.5 rounded">Top 5</span>
              </div>
            </div>
            <CardContent className="p-6">
              <ul className="divide-y divide-neutral-200">
                {isLoadingEngagement ? (
                  Array(5).fill(0).map((_, index) => (
                    <li key={index} className="py-3 flex justify-between items-center">
                      <div className="flex items-center">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <div className="ml-3">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-3 w-16 mt-1" />
                        </div>
                      </div>
                      <Skeleton className="h-4 w-10" />
                    </li>
                  ))
                ) : (
                  topEngagementPlayers?.map((item) => (
                    <li key={item.player.id} className="py-3 flex justify-between items-center">
                      <Link href={`/players/${item.player.id}`}>
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8">
                            <img className="h-8 w-8 rounded-full" src={item.player.profileImg} alt={item.player.name} />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-neutral-900">{item.player.name}</p>
                            <p className="text-xs text-neutral-500">{item.player.team}</p>
                          </div>
                        </div>
                      </Link>
                      <div className="text-sm font-bold text-purple-600">{Math.round(item.score.engagementScore)}%</div>
                    </li>
                  ))
                )}
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Feature Highlight */}
      <section className="mb-12">
        <div className="bg-neutral-900 rounded-xl shadow-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2 p-8 md:p-12">
              <span className="inline-block bg-secondary/20 text-secondary text-xs font-semibold px-3 py-1 rounded-full mb-4">Klout Analytics</span>
              <h2 className="text-3xl font-bold text-white mb-4">Score Calculation Transparency</h2>
              <p className="text-neutral-300 mb-6">Understand exactly how player influence scores are calculated with our transparent algorithm and detailed metrics breakdown.</p>
              <ul className="space-y-3 text-neutral-300 mb-8">
                <li className="flex items-start">
                  <span className="mr-2 text-secondary"><CheckCircle className="h-5 w-5" /></span>
                  <span>Detailed social media engagement metrics</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-secondary"><CheckCircle className="h-5 w-5" /></span>
                  <span>Game performance statistics and benchmarks</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-secondary"><CheckCircle className="h-5 w-5" /></span>
                  <span>Media presence and commercial value indicators</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-secondary"><CheckCircle className="h-5 w-5" /></span>
                  <span>Historical trend analysis and predictions</span>
                </li>
              </ul>
              <Link href="/about">
                <Button className="bg-secondary hover:bg-secondary-dark text-white px-6 py-3 rounded-lg font-medium">
                  Learn More
                </Button>
              </Link>
            </div>
            <div className="md:w-1/2 relative" style={{ minHeight: "320px" }}>
              {rankings && rankings.length > 0 ? (
                <div className="absolute inset-0 flex items-center justify-center bg-neutral-800 p-8">
                  <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-6 w-full max-w-sm">
                    <div className="flex items-center mb-4">
                      <div className="h-12 w-12 mr-3">
                        <img 
                          className="h-12 w-12 rounded-full object-cover border-2 border-secondary" 
                          src={rankings[0]?.player.profileImg} 
                          alt={rankings[0]?.player.name}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.onerror = null;
                            target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(rankings[0]?.player.name)}&size=100&background=random`;
                          }}
                        />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{rankings[0]?.player.name}</h3>
                        <p className="text-xs text-neutral-400">{rankings[0]?.player.team} • {rankings[0]?.player.country}</p>
                      </div>
                      <div className="ml-auto">
                        <div className="text-2xl font-bold text-secondary">{Math.round(rankings[0]?.score.totalScore)}</div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium text-neutral-300">Social Media</span>
                          <span className="text-sm font-medium text-neutral-300">{Math.round(rankings[0]?.score.socialScore)}%</span>
                        </div>
                        <div className="w-full bg-neutral-700 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${Math.round(rankings[0]?.score.socialScore)}%` }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium text-neutral-300">Game Performance</span>
                          <span className="text-sm font-medium text-neutral-300">{Math.round(rankings[0]?.score.performanceScore)}%</span>
                        </div>
                        <div className="w-full bg-neutral-700 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: `${Math.round(rankings[0]?.score.performanceScore)}%` }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium text-neutral-300">Fan Engagement</span>
                          <span className="text-sm font-medium text-neutral-300">{Math.round(rankings[0]?.score.engagementScore)}%</span>
                        </div>
                        <div className="w-full bg-neutral-700 rounded-full h-2">
                          <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${Math.round(rankings[0]?.score.engagementScore)}%` }}></div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 pt-6 border-t border-neutral-700">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-neutral-400">Live data</span>
                        <Link href={`/players/${rankings[0]?.player.id}`}>
                          <span className="text-secondary hover:text-secondary-light text-sm cursor-pointer">View Profile</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-neutral-800 p-8">
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-white mb-2">Loading Score Data...</h3>
                    <p className="text-neutral-400 mb-4">Fetching real-time metrics from our database</p>
                    <div className="w-12 h-12 border-4 border-neutral-600 border-t-secondary rounded-full animate-spin mx-auto"></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
