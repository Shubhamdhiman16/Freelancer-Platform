import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import {
  User,
  Mail,
  Phone,
  Briefcase,
  DollarSign,
  FileText,
  ArrowLeft,
  CheckCircle,
  Award,
  TrendingUp,
} from 'lucide-react';

export default function JoinAsFreelancer() {
  const { signUp, user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    phone: '',
    skills: '',
    hourlyRate: '',
    experience: '',
    bio: '',
    portfolioUrl: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password || !formData.fullName) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    const { error } = await signUp(formData.email, formData.password, formData.fullName);
    setIsLoading(false);

    if (error) {
      toast.error(error.message || 'Failed to create account');
      return;
    }

    toast.success('Account created successfully! Welcome to FreelanceHub!');
  };

  const benefits = [
    {
      icon: DollarSign,
      title: 'Competitive Rates',
      description: 'Set your own rates and earn what you deserve',
    },
    {
      icon: Briefcase,
      title: 'Flexible Projects',
      description: 'Choose projects that match your skills and schedule',
    },
    {
      icon: TrendingUp,
      title: 'Grow Your Career',
      description: 'Build your portfolio and reputation with successful projects',
    },
    {
      icon: Award,
      title: 'Top-Rated Platform',
      description: 'Join thousands of successful freelancers worldwide',
    },
  ];

  if (user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <Card className="max-w-md w-full bg-gray-800 border-gray-700">
          <CardContent className="pt-6 text-center">
            <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Welcome to FreelanceHub!</h2>
            <p className="text-gray-400 mb-6">
              Your account has been created successfully. You can now access the dashboard to complete your profile.
            </p>
            <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
              <Link to="/dashboard">Go to Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Join as a Freelancer
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Start your freelance journey today. Create your profile and connect with clients worldwide.
            </p>
            <Button variant="outline" size="lg" className="border-gray-600 text-gray-300 hover:bg-gray-700" asChild>
              <Link to="/">
                <ArrowLeft className="mr-2 h-5 w-5" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Benefits Section */}
          <div>
            <h2 className="text-3xl font-bold text-white mb-8">Why Join FreelanceHub?</h2>
            <div className="space-y-6">
              {benefits.map((benefit, index) => (
                <div key={benefit.title} className="flex items-start space-x-4 p-6 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 hover:bg-gray-800 transition-colors duration-200">
                  <div className="p-4 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-xl border border-gray-600">
                    <benefit.icon className="h-7 w-7 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{benefit.title}</h3>
                    <p className="text-gray-300 leading-relaxed">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="mt-10 p-8 bg-gray-800/50 rounded-xl border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-gray-400" />
                Platform Statistics
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-4 bg-gray-700 rounded-lg border border-gray-600">
                  <div className="text-3xl font-bold text-green-400 mb-1">10K+</div>
                  <div className="text-sm font-medium text-gray-300">Active Freelancers</div>
                </div>
                <div className="text-center p-4 bg-gray-700 rounded-lg border border-gray-600">
                  <div className="text-3xl font-bold text-blue-400 mb-1">50K+</div>
                  <div className="text-sm font-medium text-gray-300">Projects Completed</div>
                </div>
              </div>
            </div>
          </div>

          {/* Registration Form */}
          <div>
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-2xl text-white">Create Your Freelancer Account</CardTitle>
                <p className="text-gray-400">
                  Fill in your details to get started. You can complete your profile later.
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="text-white">Full Name *</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="fullName"
                          type="text"
                          placeholder="John Doe"
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          className="pl-10 bg-gray-700 border-gray-600 text-white"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-white">Email *</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="john@example.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="pl-10 bg-gray-700 border-gray-600 text-white"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-white">Password *</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="bg-gray-700 border-gray-600 text-white"
                        required
                      />
                      <p className="text-xs text-gray-400">Minimum 6 characters</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-white">Phone</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+1 (555) 123-4567"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="pl-10 bg-gray-700 border-gray-600 text-white"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="hourlyRate" className="text-white">Hourly Rate ($)</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="hourlyRate"
                          type="number"
                          placeholder="50"
                          value={formData.hourlyRate}
                          onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                          className="pl-10 bg-gray-700 border-gray-600 text-white"
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="experience" className="text-white">Years of Experience</Label>
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="experience"
                          type="number"
                          placeholder="3"
                          value={formData.experience}
                          onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                          className="pl-10 bg-gray-700 border-gray-600 text-white"
                          min="0"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="skills" className="text-white">Skills (comma-separated)</Label>
                    <Input
                      id="skills"
                      placeholder="React, Node.js, Python, etc."
                      value={formData.skills}
                      onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio" className="text-white">Bio</Label>
                    <Textarea
                      id="bio"
                      placeholder="Tell clients about yourself, your experience, and what makes you unique..."
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      rows={3}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="portfolioUrl" className="text-white">Portfolio URL</Label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="portfolioUrl"
                        type="url"
                        placeholder="https://yourportfolio.com"
                        value={formData.portfolioUrl}
                        onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                        className="pl-10 bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" size="lg" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Creating Account...
                      </>
                    ) : (
                      <>
                        <User className="mr-2 h-5 w-5" />
                        Join as Freelancer
                      </>
                    )}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-400">
                    Already have an account?{' '}
                    <Link to="/auth" className="text-blue-400 hover:underline">
                      Sign in here
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
