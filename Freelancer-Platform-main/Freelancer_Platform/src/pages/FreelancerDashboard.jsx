import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { freelancerApi, reportsApi } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AnimatedBackground from "@/components/AnimatedBackground";
import {
  Users,
  Briefcase,
  TrendingUp,
  Star,
  CheckCircle,
  Plus,
  BarChart3,
  Settings,
  DollarSign,
  Calendar,
  Activity,
  Bell,
  MessageSquare,
  Clock,
  Award,
  Target,
  FileText,
  Sparkles,
  Zap,
  Shield,
  User,
  Edit,
  Eye,
  Search,
  TrendingUp as TrendingIcon,
} from "lucide-react";

export default function FreelancerDashboard() {
  const { user, role } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalProjects: 0,
    completedProjects: 0,
    earnings: 0,
    rating: 0,
    activeProjects: 0,
  });

  const [profile, setProfile] = useState(null);
  const [recentProjects, setRecentProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // For now, we'll simulate freelancer data since we don't have individual freelancer profiles
      // In a real app, this would fetch the freelancer's own profile and projects
      const freelancersRes = await freelancerApi.getAll({ limit: 100 });
      const freelancers = freelancersRes?.data?.data || [];

      // Mock data for freelancer dashboard
      setStats({
        totalProjects: 12,
        completedProjects: 8,
        earnings: 8500,
        rating: 4.8,
        activeProjects: 2,
      });

      setProfile({
        name: user?.email?.split("@")[0] || "Freelancer",
        skills: ["React", "Node.js", "Python"],
        hourlyRate: 50,
        status: "active",
      });

      // Mock recent projects
      setRecentProjects([
        { id: 1, title: "E-commerce Website", status: "completed", earnings: 1200, client: "TechCorp" },
        { id: 2, title: "Mobile App UI", status: "in_progress", earnings: 800, client: "StartupXYZ" },
        { id: 3, title: "API Development", status: "pending", earnings: 600, client: "DataFlow Inc" },
      ]);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Earnings",
      value: `$${stats.earnings.toLocaleString()}`,
      icon: DollarSign,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Projects Completed",
      value: stats.completedProjects,
      icon: CheckCircle,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Active Projects",
      value: stats.activeProjects,
      icon: Briefcase,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "Your Rating",
      value: stats.rating,
      icon: Star,
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/10",
    },
  ];

  const quickActions = [
    {
      title: "Update Profile",
      description: "Manage your skills & portfolio",
      icon: User,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-500/10",
      action: () => navigate("/dashboard/freelancers/add"),
    },
    {
      title: "Find Projects",
      description: "Browse available opportunities",
      icon: Search,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-500/10",
      action: () => navigate("/dashboard/freelancers"),
    },
    {
      title: "View Earnings",
      description: "Track your income",
      icon: TrendingIcon,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-500/10",
      action: () => navigate("/dashboard/reports"),
    },
    {
      title: "Messages",
      description: "Client communications",
      icon: MessageSquare,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-500/10",
      action: () => navigate("/dashboard/freelancers"),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <AnimatedBackground variant="dark" />

      {/* Header */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-700 p-8 relative z-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Welcome back, {profile?.name || user?.email?.split("@")[0]}!
            </h1>
            <p className="text-gray-300 text-lg">
              Manage your freelance career and find new opportunities
            </p>
            <div className="flex items-center space-x-4 mt-4">
              <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/30">
                <DollarSign className="w-3 h-3 mr-1" />
                ${stats.earnings.toLocaleString()} Earned
              </Badge>
              <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                <Star className="w-3 h-3 mr-1" />
                {stats.rating} Rating
              </Badge>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-full flex items-center justify-center border border-gray-600">
              <Award className="w-10 h-10 text-green-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="p-8 space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => (
            <Card key={index} className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-all duration-200">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-sm font-medium text-gray-300">
                  {stat.title}
                </CardTitle>
                <div className={`p-3 rounded-xl ${stat.bgColor} border border-gray-600`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white mb-2">
                  {loading ? "..." : stat.value}
                </div>
                <div className="text-xs text-gray-400">
                  {stat.title === "Total Earnings" ? "This month" :
                   stat.title === "Projects Completed" ? "Successfully delivered" :
                   stat.title === "Active Projects" ? "Currently working on" :
                   "Average rating"}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <Card
                key={index}
                className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-all duration-200 cursor-pointer group"
                onClick={action.action}
              >
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className={`p-4 bg-gradient-to-br ${action.color} rounded-xl group-hover:scale-110 transition-transform duration-200`}>
                      <action.icon className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-lg">{action.title}</h3>
                      <p className="text-sm text-gray-400">
                        {action.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Profile & Projects */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Overview */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="border-b border-gray-700">
              <CardTitle className="text-xl font-semibold text-white flex items-center justify-between">
                <div className="flex items-center">
                  <User className="w-5 h-5 mr-2 text-blue-400" />
                  Your Profile
                </div>
                <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard/freelancers/add")}>
                  <Edit className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center border border-gray-600">
                    <User className="w-8 h-8 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{profile?.name}</h3>
                    <p className="text-gray-400">{user?.email}</p>
                    <div className="flex items-center mt-2">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-300 ml-1">{stats.rating} rating</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-700">
                  <div>
                    <p className="text-sm text-gray-400">Hourly Rate</p>
                    <p className="text-lg font-bold text-green-400">${profile?.hourlyRate}/hr</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Status</p>
                    <Badge className={`${
                      profile?.status === 'active'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {profile?.status}
                    </Badge>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-400 mb-2">Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {profile?.skills?.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="bg-blue-500/20 text-blue-300">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Projects */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="border-b border-gray-700">
              <CardTitle className="text-xl font-semibold text-white flex items-center">
                <Briefcase className="w-5 h-5 mr-2 text-green-400" />
                Recent Projects
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {recentProjects.map((project) => (
                  <div key={project.id} className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors duration-200">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        project.status === 'completed' ? 'bg-green-500/20' :
                        project.status === 'in_progress' ? 'bg-blue-500/20' :
                        'bg-yellow-500/20'
                      }`}>
                        {project.status === 'completed' ? (
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        ) : project.status === 'in_progress' ? (
                          <Clock className="w-4 h-4 text-blue-400" />
                        ) : (
                          <Clock className="w-4 h-4 text-yellow-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-white">{project.title}</p>
                        <p className="text-sm text-gray-400">{project.client}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-green-400">${project.earnings}</p>
                      <Badge className={`text-xs ${
                        project.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                        project.status === 'in_progress' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {project.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                ))}
                <Button
                  variant="outline"
                  className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
                  onClick={() => navigate("/dashboard/reports")}
                >
                  View All Projects
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-green-600/20 to-blue-600/20 border-green-500/30">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Ready to Find Your Next Project?</h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Browse available opportunities and connect with clients looking for your skills.
            </p>
            <Button
              size="lg"
              className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
              onClick={() => navigate("/dashboard/freelancers")}
            >
              <Search className="w-5 h-5 mr-2" />
              Browse Available Projects
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
