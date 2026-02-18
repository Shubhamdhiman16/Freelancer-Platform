import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { freelancerApi } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import {
  Briefcase,
  Users,
  Search,
  Star,
  MapPin,
  DollarSign,
  Clock,
  ArrowLeft,
  Mail,
  Phone,
} from 'lucide-react';

export default function HireFreelancers() {
  const { user } = useAuth();
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]);

  useEffect(() => {
    loadFreelancers();
  }, []);

  const loadFreelancers = async () => {
    setLoading(true);
    try {
      const { data, error } = await freelancerApi.getAll();
      if (error) throw error;
      setFreelancers(data?.data || []);
    } catch (error) {
      console.error('Error loading freelancers:', error);
      toast.error('Failed to load freelancers');
    } finally {
      setLoading(false);
    }
  };

  const filteredFreelancers = freelancers.filter(freelancer => {
    const matchesSearch = freelancer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         freelancer.skills?.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSkills = selectedSkills.length === 0 ||
                         selectedSkills.some(skill => freelancer.skills?.includes(skill));
    return matchesSearch && matchesSkills && freelancer.status === 'active';
  });

  const allSkills = [...new Set(freelancers.flatMap(f => f.skills || []))];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Find Your Perfect Freelancer
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Connect with top-rated professionals ready to bring your projects to life with exceptional skills and expertise.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" size="lg" className="border-gray-600 text-gray-300 hover:bg-gray-700" asChild>
                <Link to="/">
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  Back to Home
                </Link>
              </Button>
              {!user && (
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 shadow-lg" asChild>
                  <Link to="/auth">Sign Up to Hire</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filters */}
        <div className="mb-10">
          <Card className="border border-gray-700 bg-gray-800 shadow-lg">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label htmlFor="search" className="text-lg font-semibold text-white">Search Freelancers</Label>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="search"
                      placeholder="Search by name, skills, or expertise..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-12 h-12 text-lg border-2 border-gray-600 bg-gray-700 text-white focus:border-blue-400 rounded-xl"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <Label className="text-lg font-semibold text-white">Filter by Skills</Label>
                  <div className="flex flex-wrap gap-3">
                    {allSkills.slice(0, 8).map(skill => (
                      <Button
                        key={skill}
                        variant={selectedSkills.includes(skill) ? "default" : "outline"}
                        size="sm"
                        className={`rounded-full px-4 py-2 ${
                          selectedSkills.includes(skill)
                            ? 'bg-blue-600 hover:bg-blue-700 shadow-md'
                            : 'border-2 border-gray-600 text-gray-300 hover:border-blue-400 hover:bg-gray-700'
                        }`}
                        onClick={() => {
                          setSelectedSkills(prev =>
                            prev.includes(skill)
                              ? prev.filter(s => s !== skill)
                              : [...prev, skill]
                          );
                        }}
                      >
                        {skill}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results Summary */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center border border-gray-600">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-gray-300 font-medium">
                Showing <span className="text-blue-400 font-bold">{filteredFreelancers.length}</span> of <span className="font-bold">{freelancers.length}</span> freelancers
              </p>
              <p className="text-sm text-gray-500">Available for your projects</p>
            </div>
          </div>
          {selectedSkills.length > 0 && (
            <Button variant="outline" onClick={() => setSelectedSkills([])} className="border-gray-600 text-gray-300 hover:bg-gray-700">
              Clear Filters
            </Button>
          )}
        </div>

        {/* Freelancers Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
          </div>
        ) : filteredFreelancers.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredFreelancers.map((freelancer) => (
              <Card key={freelancer.id} className="border border-gray-700 bg-gray-800 hover:bg-gray-750 transition-all duration-300 group">
                <CardContent className="p-8">
                  <div className="flex items-start space-x-4 mb-6">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center text-blue-400 font-bold text-xl shadow-lg border border-gray-600 group-hover:scale-110 transition-transform duration-300">
                      {freelancer.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2">{freelancer.name}</h3>
                      <div className="flex items-center text-sm text-green-400 font-medium mb-3">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Available for hire
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-gray-300">
                          <Mail className="h-4 w-4 mr-2 text-gray-400" />
                          {freelancer.email}
                        </div>
                        {freelancer.phone && (
                          <div className="flex items-center text-sm text-gray-300">
                            <Phone className="h-4 w-4 mr-2 text-gray-400" />
                            {freelancer.phone}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    {freelancer.hourly_rate && (
                      <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                        <div className="flex items-center text-sm font-medium text-green-400">
                          <DollarSign className="h-4 w-4 mr-2" />
                          Hourly Rate
                        </div>
                        <span className="text-lg font-bold text-green-400">${freelancer.hourly_rate}</span>
                      </div>
                    )}

                    {freelancer.experience_years && (
                      <div className="flex items-center justify-between p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                        <div className="flex items-center text-sm font-medium text-blue-400">
                          <Briefcase className="h-4 w-4 mr-2" />
                          Experience
                        </div>
                        <span className="text-lg font-bold text-blue-400">{freelancer.experience_years} years</span>
                      </div>
                    )}

                    {freelancer.createdAt && (
                      <div className="flex items-center justify-between p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                        <div className="flex items-center text-sm font-medium text-purple-400">
                          <Clock className="h-4 w-4 mr-2" />
                          Member Since
                        </div>
                        <span className="text-sm font-bold text-purple-400">{new Date(freelancer.createdAt).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>

                  {freelancer.skills && freelancer.skills.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-white mb-3">Skills & Expertise</h4>
                      <div className="flex flex-wrap gap-2">
                        {freelancer.skills.slice(0, 4).map((skill, skillIndex) => (
                          <span
                            key={skillIndex}
                            className="px-3 py-2 bg-gradient-to-r from-blue-500/20 to-blue-600/20 text-blue-300 rounded-full text-sm font-medium border border-blue-500/30"
                          >
                            {skill}
                          </span>
                        ))}
                        {freelancer.skills.length > 4 && (
                          <span className="px-3 py-2 bg-gray-600 text-gray-300 rounded-full text-sm font-medium border border-gray-500">
                            +{freelancer.skills.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {freelancer.bio && (
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-white mb-2">About</h4>
                      <p className="text-sm text-gray-400 line-clamp-3 leading-relaxed">
                        {freelancer.bio}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <Button className="flex-1 bg-blue-600 hover:bg-blue-700 shadow-lg" size="lg">
                      <Mail className="w-4 h-4 mr-2" />
                      Contact Freelancer
                    </Button>
                    <Button variant="outline" size="lg" className="border-2 border-gray-600 text-gray-300 hover:border-blue-400 hover:bg-gray-700">
                      View Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-600">
              <Users className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">No freelancers found</h3>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Try adjusting your search criteria or browse different skills to find the perfect match for your project.
            </p>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => { setSearchTerm(''); setSelectedSkills([]); }} className="bg-blue-600 hover:bg-blue-700">
                Clear Filters
              </Button>
              <Button variant="outline" onClick={() => window.location.reload()} className="border-gray-600 text-gray-300 hover:bg-gray-700">
                Refresh Page
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
