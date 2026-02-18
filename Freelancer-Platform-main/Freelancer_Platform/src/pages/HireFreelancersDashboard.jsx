import { useState, useEffect } from 'react';
import { freelancerApi } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import AnimatedBackground from '@/components/AnimatedBackground';
import {
  Users,
  Search,
  Filter,
  Star,
  DollarSign,
  Clock,
  MapPin,
  Briefcase,
  MessageSquare,
  Heart,
  User,
  CheckCircle,
  Award,
  TrendingUp,
  Zap,
} from 'lucide-react';

export default function HireFreelancersDashboard() {
  const { user, role } = useAuth();
  const [freelancers, setFreelancers] = useState([]);
  const [filteredFreelancers, setFilteredFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [favorites, setFavorites] = useState(new Set());

  useEffect(() => {
    loadFreelancers();
  }, []);

  useEffect(() => {
    filterFreelancers();
  }, [freelancers, searchTerm, selectedSkills]);

  const loadFreelancers = async () => {
    setLoading(true);
    try {
      const { data, error } = await freelancerApi.getAll();
      if (error) throw error;

      const activeFreelancers = data?.data?.filter(f => f.status === 'active') || [];
      setFreelancers(activeFreelancers);
      setFilteredFreelancers(activeFreelancers);
    } catch (error) {
      console.error('Error loading freelancers:', error);
      toast.error('Failed to load freelancers');
    } finally {
      setLoading(false);
    }
  };

  const filterFreelancers = () => {
    let filtered = freelancers;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(freelancer =>
        freelancer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        freelancer.skills?.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
        freelancer.bio?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by selected skills
    if (selectedSkills.length > 0) {
      filtered = filtered.filter(freelancer =>
        selectedSkills.some(skill =>
          freelancer.skills?.some(freelancerSkill =>
            freelancerSkill.toLowerCase().includes(skill.toLowerCase())
          )
        )
      );
    }

    setFilteredFreelancers(filtered);
  };

  const toggleFavorite = (freelancerId) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(freelancerId)) {
      newFavorites.delete(freelancerId);
    } else {
      newFavorites.add(freelancerId);
    }
    setFavorites(newFavorites);
  };

  const handleHireFreelancer = (freelancer) => {
    toast.success(`Hire request sent to ${freelancer.name}!`);
    // In a real app, this would open a hiring modal or navigate to a project creation page
  };

  const handleMessageFreelancer = (freelancer) => {
    toast.info(`Opening chat with ${freelancer.name}`);
    // In a real app, this would open a messaging interface
  };

  // Get all unique skills for filtering
  const allSkills = [...new Set(freelancers.flatMap(f => f.skills || []))];

  const toggleSkillFilter = (skill) => {
    setSelectedSkills(prev =>
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <AnimatedBackground variant="blue" />

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 backdrop-blur-sm border-b border-white/10 p-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Hire Top Freelancers
              </h1>
              <p className="text-gray-300 text-lg">
                Find and hire the perfect freelancer for your project
              </p>
              <div className="flex items-center space-x-4 mt-4">
                <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                  <Users className="w-3 h-3 mr-1" />
                  {filteredFreelancers.length} Available Freelancers
                </Badge>
                <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/30">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Verified Profiles
                </Badge>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center border border-white/20">
                <Briefcase className="w-10 h-10 text-blue-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-8 space-y-8">
        {/* Search and Filters */}
        <Card className="bg-gray-800/50 backdrop-blur-sm border-white/10">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search freelancers by name, skills, or expertise..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  />
                </div>
              </div>

              {/* Skill Filters */}
              <div className="flex flex-wrap gap-2">
                {allSkills.slice(0, 8).map((skill) => (
                  <Button
                    key={skill}
                    variant={selectedSkills.includes(skill) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleSkillFilter(skill)}
                    className={`${
                      selectedSkills.includes(skill)
                        ? 'bg-blue-500 hover:bg-blue-600'
                        : 'border-white/20 text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    {skill}
                  </Button>
                ))}
                {allSkills.length > 8 && (
                  <Button variant="outline" size="sm" className="border-white/20 text-gray-300 hover:bg-white/10">
                    <Filter className="w-3 h-3 mr-1" />
                    More
                  </Button>
                )}
              </div>
            </div>

            {/* Active Filters */}
            {selectedSkills.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                <span className="text-sm text-gray-400">Active filters:</span>
                {selectedSkills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="bg-blue-500/20 text-blue-300 cursor-pointer hover:bg-blue-500/30"
                    onClick={() => toggleSkillFilter(skill)}
                  >
                    {skill} ×
                  </Badge>
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedSkills([])}
                  className="text-gray-400 hover:text-white"
                >
                  Clear all
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Freelancers Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredFreelancers.length === 0 ? (
          <Card className="bg-gray-800/50 backdrop-blur-sm border-white/10">
            <CardContent className="p-12 text-center">
              <Users className="h-16 w-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No freelancers found</h3>
              <p className="text-gray-400 mb-4">
                {searchTerm || selectedSkills.length > 0
                  ? "Try adjusting your search criteria or filters"
                  : "No freelancers are currently available"}
              </p>
              {(searchTerm || selectedSkills.length > 0) && (
                <Button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedSkills([]);
                  }}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  Clear filters
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFreelancers.map((freelancer) => (
              <Card
                key={freelancer._id || freelancer.id}
                className="bg-gray-800/50 backdrop-blur-sm border-white/10 hover:bg-gray-800/70 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/10"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center border border-white/20">
                        <User className="w-6 h-6 text-blue-400" />
                      </div>
                      <div>
                        <CardTitle className="text-lg text-white">{freelancer.name}</CardTitle>
                        <div className="flex items-center space-x-2 mt-1">
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-gray-300 ml-1">
                              {freelancer.rating || 4.5}
                            </span>
                          </div>
                          <span className="text-gray-500">•</span>
                          <span className="text-sm text-gray-400">
                            {freelancer.total_projects || 0} projects
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleFavorite(freelancer._id || freelancer.id)}
                      className={`${
                        favorites.has(freelancer._id || freelancer.id)
                          ? 'text-red-400 hover:text-red-300'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          favorites.has(freelancer._id || freelancer.id) ? 'fill-current' : ''
                        }`}
                      />
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Skills */}
                  <div>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {freelancer.skills?.slice(0, 3).map((skill, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="bg-blue-500/20 text-blue-300 text-xs"
                        >
                          {skill}
                        </Badge>
                      ))}
                      {freelancer.skills?.length > 3 && (
                        <Badge variant="secondary" className="bg-gray-500/20 text-gray-400 text-xs">
                          +{freelancer.skills.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Bio */}
                  {freelancer.bio && (
                    <p className="text-sm text-gray-300 line-clamp-2">
                      {freelancer.bio}
                    </p>
                  )}

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 py-3 border-t border-white/10">
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <DollarSign className="w-4 h-4 text-green-400" />
                      </div>
                      <p className="text-xs text-gray-400">Rate</p>
                      <p className="text-sm font-bold text-green-400">
                        ${freelancer.hourly_rate || freelancer.hourlyRate || 50}/hr
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <Clock className="w-4 h-4 text-blue-400" />
                      </div>
                      <p className="text-xs text-gray-400">Response</p>
                      <p className="text-sm font-bold text-blue-400">
                        {freelancer.response_time || '< 2h'}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      onClick={() => handleMessageFreelancer(freelancer)}
                      variant="outline"
                      size="sm"
                      className="flex-1 border-white/20 text-gray-300 hover:bg-white/10 hover:text-white"
                    >
                      <MessageSquare className="w-3 h-3 mr-1" />
                      Message
                    </Button>
                    <Button
                      onClick={() => handleHireFreelancer(freelancer)}
                      size="sm"
                      className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                    >
                      <Zap className="w-3 h-3 mr-1" />
                      Hire Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Call to Action */}
        {!loading && filteredFreelancers.length > 0 && (
          <Card className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-blue-500/30">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold text-white mb-4">
                Ready to Start Your Project?
              </h3>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                Connect with top freelancers and bring your ideas to life. Our platform makes hiring simple and secure.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                  <Briefcase className="w-5 h-5 mr-2" />
                  Post a Project
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <Award className="w-5 h-5 mr-2" />
                  View Success Stories
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
