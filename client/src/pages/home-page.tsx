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
  
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <section className="mb-12">
        <div className="bg-primary rounded-xl shadow-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2 p-8 md:p-12">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Soccer Players Influence Ranking</h1>
              <p className="text-neutral-100 mb-6">Track and compare the influence of your favorite players based on their social presence, game performance, and fan engagement.</p>
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
              <img 
                src="https://images.unsplash.com/photo-1575361204480-aadea25e6e68?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Soccer players celebrating" 
                className="absolute inset-0 w-full h-full object-cover object-center" 
              />
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
                              <img className="h-10 w-10 rounded-full object-cover" src={item.player.profileImg} alt={item.player.name} />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-neutral-900">{item.player.name}</div>
                              <div className="text-sm text-neutral-500">{item.player.country}</div>
                            </div>
                          </div>
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-700">{item.player.club}</td>
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
                        <TrendIndicator value={Math.random() > 0.5 ? 3 : -2} />
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
                  Showing <span className="font-medium">1</span> to <span className="font-medium">5</span> of <span className="font-medium">100</span> players
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
                            <p className="text-xs text-neutral-500">{item.player.club}</p>
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
                            <p className="text-xs text-neutral-500">{item.player.club}</p>
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
                            <p className="text-xs text-neutral-500">{item.player.club}</p>
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
              <span className="inline-block bg-secondary/20 text-secondary text-xs font-semibold px-3 py-1 rounded-full mb-4">New Feature</span>
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
              <div className="absolute inset-0 flex items-center justify-center bg-neutral-800 p-8">
                <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-6 w-full max-w-sm">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-white">Score Breakdown</h3>
                    <div className="text-2xl font-bold text-secondary">92</div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-neutral-300">Social Media</span>
                        <span className="text-sm font-medium text-neutral-300">95%</span>
                      </div>
                      <div className="w-full bg-neutral-700 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: "95%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-neutral-300">Game Performance</span>
                        <span className="text-sm font-medium text-neutral-300">88%</span>
                      </div>
                      <div className="w-full bg-neutral-700 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: "88%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-neutral-300">Fan Engagement</span>
                        <span className="text-sm font-medium text-neutral-300">93%</span>
                      </div>
                      <div className="w-full bg-neutral-700 rounded-full h-2">
                        <div className="bg-purple-500 h-2 rounded-full" style={{ width: "93%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-neutral-300">Media Presence</span>
                        <span className="text-sm font-medium text-neutral-300">91%</span>
                      </div>
                      <div className="w-full bg-neutral-700 rounded-full h-2">
                        <div className="bg-yellow-500 h-2 rounded-full" style={{ width: "91%" }}></div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 pt-6 border-t border-neutral-700">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-neutral-400">Updated 2 days ago</span>
                      <Link href="/about">
                        <span className="text-secondary hover:text-secondary-light text-sm cursor-pointer">View Details</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
