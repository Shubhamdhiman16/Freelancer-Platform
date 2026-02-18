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
  Search,
  Filter,
} from "lucide-react";

export default function ClientDashboard() {
  const { user, role } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalFreelancers: 0,
    activeFreelancers: 0,
    averageRating: 0,
    totalProjects: 0,
    totalRevenue: 0,
    pendingProjects: 0,
  });

  const [recentFreelancers, setRecentFreelancers] = useState([]);
  const [recentReports, setRecentReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [freelancersRes, reportsRes] = await Promise.all([
        freelancerApi.getAll({ limit: 100 }),
        reportsApi.getAll({ limit: 5 }),
      ]);

      const freelancers = freelancersRes?.data?.data || [];
      const reports = reportsRes?.data || [];

      const active = freelancers.filter((f) => f.status === "active").length;
      const avgRating = freelancers.length > 0
        ? freelancers.reduce((acc, f) => acc + (f.rating || 0), 0) / freelancers.length
        : 0;
      const totalProjects = freelancers.reduce((acc, f) => acc + (f.total_projects || 0), 0);
      const totalRevenue = freelancers.reduce((acc, f) => acc + ((f.hourly_rate || 0) * (f.total_projects || 0)), 0);
      const pendingProjects = freelancers.filter(f => f.status === 'pending').length;

      setStats({
        totalFreelancers: freelancers.length,
        activeFreelancers: active,
        averageRating: Number(avgRating.toFixed(1)),
        totalProjects,
        totalRevenue,
        pendingProjects,
      });

      setRecentFreelancers(freelancers.slice(0, 3));
      setRecentReports(reports.slice(0, 3));
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Available Freelancers",
      value: stats.activeFreelancers,
      icon: Users,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Active Projects",
      value: stats.pendingProjects,
      icon: Briefcase,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Total Spent",
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "Avg. Rating",
      value: stats.averageRating,
      icon: Star,
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/10",
    },
  ];

  const quickActions = [
    {
      title: "Browse Freelancers",
      description: "Find perfect talent",
      icon: Search,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-500/10",
      action: () => navigate("/dashboard/freelancers"),
    },
    {
      title: "Post Project",
      description: "Create new opportunity",
      icon: Plus,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-500/10",
      action: () => navigate("/dashboard/freelancers/add"),
    },
    {
      title: "View Reports",
      description: "Project analytics",
      icon: BarChart3,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-500/10",
      action: () => navigate("/dashboard/reports"),
    },
    {
      title: "Messages",
      description: "Communicate with freelancers",
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
              Welcome back, {user?.email?.split("@")[0]}!
            </h1>
            <p className="text-gray-300 text-lg">
              Find and hire top freelance talent
            </p>
            <div className="flex items-center space-x-4 mt-4">
              <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                <Users className="w-3 h-3 mr-1" />
                {stats.activeFreelancers} Available
              </Badge>
              <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/30">
                <Target className="w-3 h-3 mr-1" />
                {stats.pendingProjects} Active Projects
              </Badge>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center border border-gray-600">
              <Briefcase className="w-10 h-10 text-blue-400" />
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
                  Ready to work with you
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

        {/* Freelancer Discovery */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Featured Freelancers */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="border-b border-gray-700">
              <CardTitle className="text-xl font-semibold text-white flex items-center">
                <Star className="w-5 h-5 mr-2 text-yellow-400" />
                Featured Freelancers
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
                </div>
              ) : recentFreelancers.length > 0 ? (
                <div className="space-y-4">
                  {recentFreelancers.map((freelancer) => (
                    <div key={freelancer.id} className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors duration-200">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-full flex items-center justify-center border border-gray-600">
                          <Users className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                          <p className="font-medium text-white">{freelancer.name}</p>
                          <p className="text-sm text-gray-400">{freelancer.skills?.join(', ')}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-green-400">${freelancer.hourly_rate}/hr</p>
                        <div className="flex items-center">
                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          <span className="text-xs text-gray-400 ml-1">{freelancer.rating || 0}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
                    onClick={() => navigate("/dashboard/freelancers")}
                  >
                    Browse All Freelancers
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">No freelancers available</h3>
                  <p className="text-gray-400 mb-4">
                    Check back later for new talent
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Project Status */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="border-b border-gray-700">
              <CardTitle className="text-xl font-semibold text-white flex items-center">
                <Activity className="w-5 h-5 mr-2 text-green-400" />
                Your Projects
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    </div>
                    <div>
                      <p className="font-medium text-white">Website Redesign</p>
                      <p className="text-sm text-gray-400">Completed - $2,500</p>
                    </div>
                  </div>
                  <Badge className="bg-green-500/20 text-green-400">Completed</Badge>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                      <Clock className="w-4 h-4 text-blue-400" />
                    </div>
                    <div>
                      <p className="font-medium text-white">Mobile App Development</p>
                      <p className="text-sm text-gray-400">In Progress - $5,000</p>
                    </div>
                  </div>
                  <Badge className="bg-blue-500/20 text-blue-400">In Progress</Badge>
                </div>
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
        <Card className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-blue-500/30">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Ready to Hire Top Talent?</h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Browse our curated list of skilled freelancers and find the perfect match for your next project.
            </p>
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              onClick={() => navigate("/dashboard/freelancers")}
            >
              <Search className="w-5 h-5 mr-2" />
              Start Browsing Freelancers
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
