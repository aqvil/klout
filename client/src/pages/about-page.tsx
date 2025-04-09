import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon, Trophy, Users, BarChart2, TrendingUp, Instagram, Tv, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Link } from "wouter";

export default function AboutPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-12">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-neutral-800 mb-4">About SoccerInfluence</h1>
          <p className="text-xl text-neutral-600">
            Understanding how we measure and rank soccer player influence in the digital era
          </p>
        </div>
      </div>

      <div className="mb-12">
        <Card>
          <CardContent className="p-0">
            <div className="grid md:grid-cols-2">
              <div className="p-8 md:p-12">
                <h2 className="text-2xl font-bold mb-4">What is SoccerInfluence?</h2>
                <p className="text-neutral-600 mb-6">
                  SoccerInfluence is a comprehensive platform that measures and ranks soccer players 
                  based on their overall influence both on and off the field. 
                  Inspired by Klout.com's approach to measuring social influence, 
                  we've created a specialized system for the world of soccer.
                </p>
                <p className="text-neutral-600 mb-6">
                  Our platform combines data from multiple sources to calculate a player's total influence score, 
                  providing fans, analysts, and industry professionals with valuable insights into a player's 
                  overall impact and reach.
                </p>
                <div className="flex flex-wrap gap-4 mt-8">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                      <BarChart2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">Data-Driven</h4>
                      <p className="text-sm text-neutral-500">Comprehensive metrics</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                      <TrendingUp className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">Real-Time</h4>
                      <p className="text-sm text-neutral-500">Updated regularly</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                      <Trophy className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">Competitive</h4>
                      <p className="text-sm text-neutral-500">Global rankings</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-neutral-100 p-8 md:p-12 flex items-center">
                <div className="bg-white rounded-xl p-6 shadow-sm w-full">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-neutral-800">Example Score</h3>
                    <div className="text-2xl font-bold text-primary">87</div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-neutral-700">Social Media</span>
                        <span className="text-sm font-medium text-neutral-700">92%</span>
                      </div>
                      <ProgressBar value={92} color="primary" showLabel={false} />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-neutral-700">Game Performance</span>
                        <span className="text-sm font-medium text-neutral-700">85%</span>
                      </div>
                      <ProgressBar value={85} color="secondary" showLabel={false} />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-neutral-700">Fan Engagement</span>
                        <span className="text-sm font-medium text-neutral-700">81%</span>
                      </div>
                      <ProgressBar value={81} color="accent" showLabel={false} />
                    </div>
                  </div>
                  <div className="mt-6 pt-4 border-t border-neutral-100">
                    <Link href="/rankings">
                      <Button className="w-full">View All Rankings</Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-neutral-800 mb-4">How We Calculate Influence Scores</h2>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            Our proprietary algorithm takes into account multiple factors to generate a comprehensive influence score.
          </p>
        </div>

        <Tabs defaultValue="overview">
          <div className="flex justify-center mb-8">
            <TabsList>
              <TabsTrigger value="overview">Score Overview</TabsTrigger>
              <TabsTrigger value="social">Social Media</TabsTrigger>
              <TabsTrigger value="performance">Game Performance</TabsTrigger>
              <TabsTrigger value="engagement">Fan Engagement</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview">
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                    <Instagram className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle>Social Media Impact (40%)</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-neutral-600">
                    We analyze a player's presence across major social platforms including Instagram, Facebook, and Twitter.
                    The score is calculated based on total follower count, growth rate, and overall reach.
                  </p>
                  <ul className="mt-4 space-y-2 text-sm text-neutral-600">
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      Total followers across platforms
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      Follower growth trends
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      Audience demographics and reach
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center mb-4">
                    <Tv className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle>Game Performance (40%)</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-neutral-600">
                    On-field performance is a critical component of a player's influence. We track key statistics 
                    like goals, assists, and disciplinary records to measure impact.
                  </p>
                  <ul className="mt-4 space-y-2 text-sm text-neutral-600">
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      Goals and assists
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      Yellow and red cards
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      Position-specific performance metrics
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                  <CardTitle>Fan Engagement (20%)</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-neutral-600">
                    How fans interact with a player determines their cultural impact. We measure fan engagement through 
                    various metrics including interaction rates and sentiment.
                  </p>
                  <ul className="mt-4 space-y-2 text-sm text-neutral-600">
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      Comment and interaction rates
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      Content engagement metrics
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      Fan sentiment analysis
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="social">
            <Card>
              <CardHeader>
                <CardTitle>Social Media Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <p className="text-neutral-600 mb-6">
                      In today's digital era, a soccer player's influence extends far beyond the field. Social media presence 
                      plays a crucial role in defining a player's global impact and commercial value.
                    </p>
                    <p className="text-neutral-600 mb-6">
                      Our algorithm uses a logarithmic scale to measure social media influence, acknowledging that followers 
                      don't grow linearly and that the difference between 1 million and 2 million followers is not the same as 
                      between 100 million and 101 million.
                    </p>
                    <div className="mb-6">
                      <h4 className="font-semibold mb-2">The formula:</h4>
                      <Alert>
                        <AlertTitle className="font-mono">Social Score = (log10(totalFollowers) / 8) * 80 + fanEngagement * 20</AlertTitle>
                        <AlertDescription>
                          This creates a balanced score between 0-100 that reflects both reach and engagement quality.
                        </AlertDescription>
                      </Alert>
                    </div>
                    <p className="text-neutral-600">
                      This metric makes up 40% of the total influence score, reflecting the critical importance of social media 
                      in a player's overall impact in modern soccer.
                    </p>
                  </div>
                  <div className="bg-neutral-50 p-6 rounded-lg">
                    <h4 className="font-semibold mb-4">Examples</h4>
                    <div className="space-y-6">
                      <div>
                        <div className="flex justify-between mb-1">
                          <div>
                            <span className="font-medium">High Social Influence</span>
                            <p className="text-sm text-neutral-500">300M followers, high engagement</p>
                          </div>
                          <span className="font-bold text-primary">95</span>
                        </div>
                        <ProgressBar value={95} color="primary" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <div>
                            <span className="font-medium">Medium Social Influence</span>
                            <p className="text-sm text-neutral-500">50M followers, medium engagement</p>
                          </div>
                          <span className="font-bold text-primary">78</span>
                        </div>
                        <ProgressBar value={78} color="primary" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <div>
                            <span className="font-medium">Growing Social Influence</span>
                            <p className="text-sm text-neutral-500">5M followers, high engagement</p>
                          </div>
                          <span className="font-bold text-primary">65</span>
                        </div>
                        <ProgressBar value={65} color="primary" />
                      </div>
                    </div>
                    <div className="mt-8 border-t border-neutral-200 pt-6">
                      <h4 className="font-semibold mb-2">Platforms We Track</h4>
                      <div className="flex flex-wrap gap-3">
                        <div className="bg-white px-3 py-2 rounded border flex items-center">
                          <Instagram className="h-4 w-4 mr-2 text-pink-500" />
                          Instagram
                        </div>
                        <div className="bg-white px-3 py-2 rounded border flex items-center">
                          <svg className="h-4 w-4 mr-2 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                          </svg>
                          Facebook
                        </div>
                        <div className="bg-white px-3 py-2 rounded border flex items-center">
                          <svg className="h-4 w-4 mr-2 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                          </svg>
                          Twitter
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance">
            <Card>
              <CardHeader>
                <CardTitle>Game Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <p className="text-neutral-600 mb-6">
                      On-field performance remains a fundamental aspect of a player's influence. 
                      Great performances in important matches increase a player's visibility 
                      and overall influence in the sport.
                    </p>
                    <p className="text-neutral-600 mb-6">
                      Our performance metrics give positive weight to offensive contributions like goals and assists,
                      while negative weight is assigned to disciplinary issues like yellow and red cards.
                    </p>
                    <div className="mb-6">
                      <h4 className="font-semibold mb-2">The formula:</h4>
                      <Alert>
                        <AlertTitle className="font-mono">Performance Score = ((goals * 5) + (assists * 3) - (yellowCards * 1) - (redCards * 3)) / 2</AlertTitle>
                        <AlertDescription>
                          This creates a balanced performance metric that rewards positive contributions and penalizes disciplinary issues.
                        </AlertDescription>
                      </Alert>
                    </div>
                    <p className="text-neutral-600">
                      Game performance constitutes 40% of the total influence score, emphasizing that a player's on-field impact 
                      is equally important to their social media presence.
                    </p>
                  </div>
                  <div className="bg-neutral-50 p-6 rounded-lg">
                    <h4 className="font-semibold mb-4">Performance Examples</h4>
                    <div className="space-y-6">
                      <div>
                        <div className="flex justify-between mb-1">
                          <div>
                            <span className="font-medium">Prolific Striker</span>
                            <p className="text-sm text-neutral-500">30 goals, 8 assists, 4 yellow cards</p>
                          </div>
                          <span className="font-bold text-secondary">94</span>
                        </div>
                        <ProgressBar value={94} color="secondary" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <div>
                            <span className="font-medium">Creative Midfielder</span>
                            <p className="text-sm text-neutral-500">12 goals, 22 assists, 6 yellow cards</p>
                          </div>
                          <span className="font-bold text-secondary">88</span>
                        </div>
                        <ProgressBar value={88} color="secondary" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <div>
                            <span className="font-medium">Disciplined Defender</span>
                            <p className="text-sm text-neutral-500">3 goals, 5 assists, 2 yellow cards</p>
                          </div>
                          <span className="font-bold text-secondary">62</span>
                        </div>
                        <ProgressBar value={62} color="secondary" />
                      </div>
                    </div>
                    <div className="mt-8 border-t border-neutral-200 pt-6">
                      <h4 className="font-semibold mb-2">Future Metric Additions</h4>
                      <ul className="space-y-2 text-sm text-neutral-600">
                        <li className="flex items-start">
                          <span className="text-blue-500 mr-2">→</span>
                          Position-specific performance metrics
                        </li>
                        <li className="flex items-start">
                          <span className="text-blue-500 mr-2">→</span>
                          Competition weighting (Champions League, World Cup, etc.)
                        </li>
                        <li className="flex items-start">
                          <span className="text-blue-500 mr-2">→</span>
                          Advanced statistics (xG, successful passes, etc.)
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="engagement">
            <Card>
              <CardHeader>
                <CardTitle>Fan Engagement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <p className="text-neutral-600 mb-6">
                      Fan engagement measures how effectively a player connects with their audience. 
                      While follower count represents reach, engagement represents depth of connection.
                    </p>
                    <p className="text-neutral-600 mb-6">
                      This metric is calculated based on interaction rates, comment sentiment, content 
                      sharing, and how responsive the player is to their fan base.
                    </p>
                    <div className="mb-6">
                      <h4 className="font-semibold mb-2">Engagement metrics include:</h4>
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <span className="text-purple-500 mr-2">•</span>
                          <div>
                            <strong>Interaction rate:</strong> Likes, comments, and shares as a percentage of followers
                          </div>
                        </li>
                        <li className="flex items-start">
                          <span className="text-purple-500 mr-2">•</span>
                          <div>
                            <strong>Comment sentiment:</strong> Positive vs. negative comments ratio
                          </div>
                        </li>
                        <li className="flex items-start">
                          <span className="text-purple-500 mr-2">•</span>
                          <div>
                            <strong>Fan content:</strong> Amount of fan-generated content about the player
                          </div>
                        </li>
                      </ul>
                    </div>
                    <p className="text-neutral-600">
                      Fan engagement makes up 20% of the total influence score, acting as a quality multiplier 
                      for the player's social media presence.
                    </p>
                  </div>
                  <div className="bg-neutral-50 p-6 rounded-lg">
                    <h4 className="font-semibold mb-4">Engagement Scale</h4>
                    <div className="space-y-6">
                      <div>
                        <div className="flex justify-between mb-1">
                          <div>
                            <span className="font-medium">Very High Engagement</span>
                            <p className="text-sm text-neutral-500">10%+ interaction rate, positive sentiment</p>
                          </div>
                          <span className="font-bold text-purple-600">95</span>
                        </div>
                        <div className="w-full bg-neutral-200 rounded-full h-2.5">
                          <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: '95%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <div>
                            <span className="font-medium">High Engagement</span>
                            <p className="text-sm text-neutral-500">5-10% interaction rate, mostly positive</p>
                          </div>
                          <span className="font-bold text-purple-600">80</span>
                        </div>
                        <div className="w-full bg-neutral-200 rounded-full h-2.5">
                          <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: '80%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <div>
                            <span className="font-medium">Average Engagement</span>
                            <p className="text-sm text-neutral-500">2-5% interaction rate, mixed sentiment</p>
                          </div>
                          <span className="font-bold text-purple-600">60</span>
                        </div>
                        <div className="w-full bg-neutral-200 rounded-full h-2.5">
                          <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: '60%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <div>
                            <span className="font-medium">Low Engagement</span>
                            <p className="text-sm text-neutral-500">&lt; 2% interaction rate</p>
                          </div>
                          <span className="font-bold text-purple-600">30</span>
                        </div>
                        <div className="w-full bg-neutral-200 rounded-full h-2.5">
                          <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: '30%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <div className="mb-12 bg-primary text-white rounded-xl overflow-hidden">
        <div className="p-8 md:p-12 text-center">
          <Zap className="h-12 w-12 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Start Exploring Player Influence Today</h2>
          <p className="text-white/80 mb-8 max-w-2xl mx-auto">
            Discover how your favorite players rank on the global influence scale, track their progress over time, 
            and gain insights into what makes them influential both on and off the field.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/rankings">
              <Button className="bg-white text-primary hover:bg-white/90">
                View Rankings
              </Button>
            </Link>
            <Link href="/auth">
              <Button variant="outline" className="border-white text-white hover:bg-white/10">
                Create Account
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-neutral-800 mb-4">Frequently Asked Questions</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-start">
                <div className="mr-3 mt-1">
                  <InfoIcon className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>How often are scores updated?</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-neutral-600">
                Influence scores are updated weekly to reflect the latest social media metrics and game performances. 
                Major events like a viral social post or an outstanding match performance can trigger more frequent updates.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="flex items-start">
                <div className="mr-3 mt-1">
                  <InfoIcon className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>Can players improve their scores?</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-neutral-600">
                Absolutely! Players can improve their influence scores by increasing their social media presence, 
                delivering strong on-field performances, and fostering more meaningful engagement with their fans.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="flex items-start">
                <div className="mr-3 mt-1">
                  <InfoIcon className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>How do you source your data?</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-neutral-600">
                Our data comes from a combination of public APIs, official statistics from leagues and tournaments, 
                and our proprietary social media analysis tools. We ensure all data is up-to-date and accurate.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="flex items-start">
                <div className="mr-3 mt-1">
                  <InfoIcon className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>Is the algorithm biased toward attackers?</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-neutral-600">
                We recognize that offensive players often get more attention, but our algorithm is designed to be position-neutral. 
                We're continuously refining our metrics to fairly evaluate players across all positions based on relevant contributions.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
