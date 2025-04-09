import { useQuery } from "@tanstack/react-query";
import { PlayerWithStats } from "@shared/schema";
import { useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { FaTwitter, FaInstagram, FaFacebook } from "react-icons/fa";
import { useEffect, useRef } from "react";
import { PlayerImage } from "@/components/ui/player-image";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";

// Mock chart function (would be replaced with Chart.js in production)
const drawChart = (canvasRef: React.RefObject<HTMLCanvasElement>, scores: number[] = []) => {
  if (!canvasRef.current) return;
  
  const ctx = canvasRef.current.getContext('2d');
  if (!ctx) return;
  
  // Simple placeholder visualization
  const width = canvasRef.current.width;
  const height = canvasRef.current.height;
  
  ctx.clearRect(0, 0, width, height);
  
  // Fill background
  ctx.fillStyle = "#f5f7fa";
  ctx.fillRect(0, 0, width, height);
  
  // Draw grid lines
  ctx.strokeStyle = "#e2e8f0";
  ctx.beginPath();
  for (let i = 0; i <= 5; i++) {
    const y = height - (i / 5) * height;
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
  }
  
  for (let i = 0; i <= 12; i++) {
    const x = (i / 12) * width;
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
  }
  ctx.stroke();
  
  // Use the scores or create mock data if none provided
  const data = scores.length > 0 ? scores : [75, 78, 80, 79, 82, 85, 84, 88, 90, 92, 91, 92];
  
  // Draw line
  ctx.strokeStyle = "#0F4C81";
  ctx.lineWidth = 3;
  ctx.beginPath();
  
  const xStep = width / (data.length - 1);
  
  for (let i = 0; i < data.length; i++) {
    const x = i * xStep;
    const y = height - (data[i] / 100) * height;
    
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  
  ctx.stroke();
  
  // Add points
  ctx.fillStyle = "#0F4C81";
  for (let i = 0; i < data.length; i++) {
    const x = i * xStep;
    const y = height - (data[i] / 100) * height;
    
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();
  }
};

export default function PlayerPage() {
  const { id } = useParams<{ id: string }>();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const numberId = Number(id);

  const { data: playerDetails, isLoading } = useQuery<PlayerWithStats>({
    queryKey: [`/api/player-details/${id}`],
    enabled: !isNaN(numberId),
  });

  // Draw chart when component mounts or data changes
  useEffect(() => {
    if (playerDetails) {
      drawChart(canvasRef);
    }
  }, [playerDetails]);
  
  // Format follower count
  const formatFollowers = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };
  
  if (isNaN(numberId)) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">Invalid Player ID</h2>
          <p className="mt-2 text-gray-600">The player ID provided is not valid.</p>
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
                  <p className="text-neutral-500 mb-4">{playerDetails?.player.club} • {playerDetails?.player.country}</p>
                  <div className="inline-flex bg-primary text-white text-xl font-bold rounded-full w-16 h-16 items-center justify-center mb-4">
                    {Math.round(playerDetails?.score.totalScore || 0)}
                  </div>
                  <p className="text-sm text-neutral-500 mb-4">Influence Score</p>
                </>
              )}
              
              <div className="flex space-x-4 mb-6">
                <a href="#" className="text-blue-500 hover:text-blue-600">
                  <FaTwitter className="text-xl" />
                </a>
                <a href="#" className="text-pink-600 hover:text-pink-700">
                  <FaInstagram className="text-xl" />
                </a>
                <a href="#" className="text-blue-800 hover:text-blue-900">
                  <FaFacebook className="text-xl" />
                </a>
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
                  <canvas 
                    ref={canvasRef} 
                    width={800} 
                    height={280} 
                    className="w-full h-full"
                  />
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
              {isLoading ? (
                <div className="space-y-4">
                  {Array(3).fill(0).map((_, i) => (
                    <div key={i} className="flex items-center">
                      <Skeleton className="h-5 w-32 mr-4" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-10 ml-4" />
                    </div>
                  ))}
                </div>
              ) : (
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
              )}
            </div>
          </div>
        </div>
      </Card>
    </main>
  );
}
