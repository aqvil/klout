import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Player } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export default function PlayersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Fetch all players
  const { data: players, isLoading } = useQuery<Player[]>({
    queryKey: ["/api/players"],
  });
  
  // Filter the data based on search term
  const filteredPlayers = players
    ? players.filter((player) => {
        if (searchTerm) {
          return (
            player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            player.team.toLowerCase().includes(searchTerm.toLowerCase()) ||
            player.country.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
        return true;
      })
    : [];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-800 mb-4">Soccer Players</h1>
        <p className="text-neutral-600 max-w-3xl">
          Browse through all players and check their detailed profiles, stats, and influence scores.
        </p>
      </div>

      <div className="mb-6 flex justify-between items-center">
        <div className="relative w-full sm:w-64">
          <Input
            type="text"
            placeholder="Search players, clubs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-3 pr-10 py-2"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {isLoading ? (
          // Loading skeletons
          Array(8).fill(0).map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <div className="aspect-square bg-neutral-100">
                <Skeleton className="h-full w-full" />
              </div>
              <CardContent className="p-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-4" />
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          ))
        ) : filteredPlayers.length > 0 ? (
          // Player cards
          filteredPlayers.map((player) => (
            <Link key={player.id} href={`/player/${player.name.toLowerCase().replace(/\s+/g, '-')}`}>
              <Card className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow">
                <div className="aspect-square bg-neutral-100">
                  <img
                    src={player.profileImg}
                    alt={player.name}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      // Fallback to a placeholder if the image fails to load
                      const target = e.target as HTMLImageElement;
                      target.onerror = null; // Prevent infinite loop
                      target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(player.name)}&size=300&background=random`;
                    }}
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-1 text-neutral-800">{player.name}</h3>
                  <p className="text-neutral-500 text-sm mb-2">{player.team}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-600">{player.country}</span>
                    <Button variant="outline" size="sm" className="text-xs">
                      View Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        ) : (
          // No results
          <div className="col-span-full py-12 text-center">
            <div className="mx-auto w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
              <Search className="h-12 w-12 text-neutral-300" />
            </div>
            <h3 className="text-xl font-medium text-neutral-700 mb-2">No players found</h3>
            <p className="text-neutral-500 mb-6">
              Try adjusting your search criteria or browse all players.
            </p>
            <Button onClick={() => setSearchTerm("")}>Clear Search</Button>
          </div>
        )}
      </div>
    </main>
  );
}