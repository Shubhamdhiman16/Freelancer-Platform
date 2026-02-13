import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { freelancerApi } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Briefcase, TrendingUp, Star, Clock, CheckCircle } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function Dashboard() {
  const { user, role } = useAuth();
  const [stats, setStats] = useState({
    totalFreelancers: 0,
    activeFreelancers: 0,
    averageRating: 0,
    totalProjects: 0,
  });
  const [recentFreelancers, setRecentFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { data: freelancers } = await freelancerApi.getAll({ limit: 100 });
      
      if (freelancers) {
        const active = freelancers.filter((f) => f.status === 'active').length;
        const avgRating = freelancers.length > 0
          ? freelancers.reduce((acc, f) => acc + (f.rating || 0), 0) / freelancers.length
          : 0;
        const totalProjects = freelancers.reduce((acc, f) => acc + (f.total_projects || 0), 0);

        setStats({
          totalFreelancers: freelancers.length,
          activeFreelancers: active,
          averageRating: Number(avgRating.toFixed(1)),
          totalProjects,
        });

        setRecentFreelancers(freelancers.slice(0, 5));
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Freelancers',
      value: stats.totalFreelancers,
      icon: Users,
      color: 'from-primary to-primary/80',
    },
    {
      title: 'Active Freelancers',
      value: stats.activeFreelancers,
      icon: CheckCircle,
      color: 'from-green-500 to-green-600',
    },
    {
      title: 'Average Rating',
      value: stats.averageRating,
      icon: Star,
      color: 'from-yellow-500 to-orange-500',
    },
    {
      title: 'Total Projects',
      value: stats.totalProjects,
      icon: Briefcase,
      color: 'from-accent to-accent/80',
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Welcome Header */}
      <motion.div variants={itemVariants} className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-6 rounded-lg">
        <h1 className="text-3xl font-bold mb-2">
          <span>Welcome back, {user?.email?.split('@')[0]}</span>!
        </h1>
        <p className="text-lg opacity-90">
          Here's what's happening with your freelancer platform today.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div key={index} variants={itemVariants}>
            <Card className={`bg-gradient-to-br ${stat.color} text-white border-0`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <div className="h-4 w-4 text-white/70">
                  <stat.icon />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{loading ? '...' : stat.value}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Recent Freelancers */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle>
              Recent Freelancers
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-32"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : recentFreelancers.length > 0 ? (
              <div className="space-y-4">
                {recentFreelancers.map((freelancer, index) => (
                  <motion.div key={freelancer._id} variants={itemVariants} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold">
                        {freelancer.name[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium">{freelancer.name}</p>
                        <p className="text-sm text-muted-foreground">{freelancer.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{freelancer.rating || 0}</span>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${freelancer.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {freelancer.status}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No freelancers yet. Add your first freelancer!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Add Freelancer</h3>
                <p className="text-sm text-muted-foreground">Register a new freelancer</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold">View Reports</h3>
                <p className="text-sm text-muted-foreground">Check platform analytics</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <h3 className="font-semibold">Manage Projects</h3>
                <p className="text-sm text-muted-foreground">View ongoing work</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}