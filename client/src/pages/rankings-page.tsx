import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { PlayerWithStats } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-bar";
import { TrendIndicator } from "@/components/ui/trend-indicator";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowDown, ArrowRight, ArrowUp, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

// Type for sort options
type SortOption = "totalScore" | "socialScore" | "performanceScore" | "engagementScore";

export default function RankingsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLeague, setSelectedLeague] = useState("all");
  const [selectedTimeframe, setSelectedTimeframe] = useState("week");
  const [sortBy, setSortBy] = useState<SortOption>("totalScore");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const itemsPerPage = 10;

  // Fetch all rankings data
  const { data: rankingsResponse, isLoading } = useQuery<{
    players: PlayerWithStats[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalPlayers: number;
      playersPerPage: number;
    };
  }>({
    queryKey: ["/api/rankings"],
  });

  // Filter and sort the data based on user selections
  const filteredAndSortedData = rankingsResponse?.players
    ? rankingsResponse.players
        .filter((item) => {
          // Filter by search term (case insensitive)
          if (searchTerm) {
            return (
              item.player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              item.player.team.toLowerCase().includes(searchTerm.toLowerCase()) ||
              item.player.country.toLowerCase().includes(searchTerm.toLowerCase())
            );
          }
          
          // Filter by league if not "all"
          if (selectedLeague !== "all") {
            // This is a simplification - in a real app we would have proper league data
            // For now, we'll just check if the club name contains the league name
            const leagueToClubMapping: Record<string, string[]> = {
              premier: ["Manchester", "Liverpool", "Chelsea", "Arsenal", "Tottenham"],
              laliga: ["Barcelona", "Real Madrid", "Atletico", "Sevilla", "Valencia"],
              bundesliga: ["Bayern", "Dortmund", "Leipzig", "Leverkusen", "Frankfurt"],
              seriea: ["Juventus", "Milan", "Inter", "Roma", "Napoli"],
            };
            
            const clubsInLeague = leagueToClubMapping[selectedLeague] || [];
            return clubsInLeague.some(club => item.player.team.includes(club));
          }
          
          return true;
        })
        .sort((a, b) => {
          // Sort by the selected metric
          const valueA = a.score[sortBy];
          const valueB = b.score[sortBy];
          
          return sortDirection === "desc" 
            ? valueB - valueA 
            : valueA - valueB;
        })
    : [];

  // Calculate pagination
  const totalItems = filteredAndSortedData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredAndSortedData.slice(startIndex, startIndex + itemsPerPage);

  // Handle sort click
  const handleSortClick = (column: SortOption) => {
    if (sortBy === column) {
      // If already sorting by this column, toggle direction
      setSortDirection(sortDirection === "desc" ? "asc" : "desc");
    } else {
      // Otherwise, set new sort column and default to descending
      setSortBy(column);
      setSortDirection("desc");
    }
  };

  // Get sort icon
  const getSortIcon = (column: SortOption) => {
    if (sortBy !== column) {
      return <ArrowRight className="ml-1 h-4 w-4 text-muted-foreground/60" />;
    }
    
    return sortDirection === "desc" 
      ? <ArrowDown className="ml-1 h-4 w-4 text-primary" />
      : <ArrowUp className="ml-1 h-4 w-4 text-primary" />;
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-4">Player Rankings</h1>
        <p className="text-muted-foreground max-w-3xl">
          Explore the comprehensive rankings of soccer players based on their influence score, 
          which combines social media presence, game performance, and fan engagement.
        </p>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-64">
          <Input
            type="text"
            placeholder="Search players, clubs..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page on new search
            }}
            className="pl-3 pr-10 py-2"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 w-full sm:w-auto">
          <Select value={selectedLeague} onValueChange={(value) => {
            setSelectedLeague(value);
            setCurrentPage(1); // Reset to first page on filter change
          }}>
            <SelectTrigger className="w-full sm:w-40">
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
          
          <Select value={selectedTimeframe} onValueChange={(value) => {
            setSelectedTimeframe(value);
            setCurrentPage(1); // Reset to first page on filter change
          }}>
            <SelectTrigger className="w-full sm:w-40">
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
      
      <Card className="card-elevated mb-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted/50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Rank</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Player</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Club</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground transition-colors duration-200" onClick={() => handleSortClick("totalScore")} data-testid="header-total-score">
                  <div className="flex items-center">
                    Influence Score
                    {getSortIcon("totalScore")}
                  </div>
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground transition-colors duration-200" onClick={() => handleSortClick("socialScore")} data-testid="header-social-score">
                  <div className="flex items-center">
                    Social Media
                    {getSortIcon("socialScore")}
                  </div>
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground transition-colors duration-200" onClick={() => handleSortClick("performanceScore")} data-testid="header-performance-score">
                  <div className="flex items-center">
                    Game Performance
                    {getSortIcon("performanceScore")}
                  </div>
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Trend</th>
              </tr>
            </thead>
            <tbody className="bg-card divide-y divide-border">
              {isLoading ? (
                Array(10).fill(0).map((_, index) => (
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
              ) : paginatedData.length > 0 ? (
                paginatedData.map((item, index) => (
                  <tr key={item.player.id} className="hover:bg-neutral-50 cursor-pointer">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-neutral-700">{startIndex + index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link href={`/player/${item.player.slug || item.player.name.toLowerCase().replace(/\s+/g, '-')}`}>
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
                      <TrendIndicator value={Math.round((Math.random() * 20) - 10)} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-neutral-500">
                    <div className="flex flex-col items-center justify-center">
                      <svg className="w-12 h-12 text-neutral-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-lg font-medium">No players found</p>
                      <p className="text-sm mt-1">Try adjusting your search or filters</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="bg-white px-6 py-4 border-t border-neutral-200 flex items-center justify-between">
          <div className="flex-1 flex justify-between sm:hidden">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              Next
            </Button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-neutral-700">
                Showing <span className="font-medium">{totalItems === 0 ? 0 : startIndex + 1}</span> to{" "}
                <span className="font-medium">{Math.min(startIndex + itemsPerPage, totalItems)}</span> of{" "}
                <span className="font-medium">{totalItems}</span> players
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-neutral-300 bg-white text-sm font-medium text-neutral-500 hover:bg-neutral-50"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  <span className="sr-only">Previous</span>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                {/* Simplified pagination with first, current, and last page */}
                {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                  let pageNum;
                  
                  if (totalPages <= 5) {
                    // If 5 or fewer pages, show all
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    // If near the start
                    pageNum = i + 1;
                    if (i === 4) pageNum = totalPages;
                    if (i === 3 && totalPages > 5) pageNum = -1; // Ellipsis
                  } else if (currentPage >= totalPages - 2) {
                    // If near the end
                    pageNum = totalPages - 4 + i;
                    if (i === 0) pageNum = 1;
                    if (i === 1 && totalPages > 5) pageNum = -1; // Ellipsis
                  } else {
                    // In the middle
                    pageNum = currentPage - 2 + i;
                    if (i === 0) pageNum = 1;
                    if (i === 1 && currentPage > 3) pageNum = -1; // Left ellipsis
                    if (i === 4) pageNum = totalPages;
                    if (i === 3 && currentPage < totalPages - 2) pageNum = -2; // Right ellipsis
                  }
                  
                  // Render ellipsis
                  if (pageNum === -1) {
                    return (
                      <span 
                        key={`ellipsis-left`}
                        className="relative inline-flex items-center px-4 py-2 border border-neutral-300 bg-white text-sm font-medium text-neutral-700"
                      >
                        ...
                      </span>
                    );
                  } else if (pageNum === -2) {
                    return (
                      <span 
                        key={`ellipsis-right`}
                        className="relative inline-flex items-center px-4 py-2 border border-neutral-300 bg-white text-sm font-medium text-neutral-700"
                      >
                        ...
                      </span>
                    );
                  }
                  
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === pageNum
                          ? "bg-primary border-primary text-white"
                          : "bg-white border-neutral-300 text-neutral-500 hover:bg-neutral-50"
                      }`}
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-neutral-300 bg-white text-sm font-medium text-neutral-500 hover:bg-neutral-50"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages || totalPages === 0}
                >
                  <span className="sr-only">Next</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </nav>
            </div>
          </div>
        </div>
      </Card>
    </main>
  );
}
