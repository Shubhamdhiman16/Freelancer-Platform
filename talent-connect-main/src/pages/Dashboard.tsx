import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { freelancerApi } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Briefcase, TrendingUp, Star, Clock, CheckCircle } from 'lucide-react';

interface Stats {
  totalFreelancers: number;
  activeFreelancers: number;
  averageRating: number;
  totalProjects: number;
}

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
  const [stats, setStats] = useState<Stats>({
    totalFreelancers: 0,
    activeFreelancers: 0,
    averageRating: 0,
    totalProjects: 0,
  });
  const [recentFreelancers, setRecentFreelancers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { data: freelancers } = await freelancerApi.getAll({ limit: 100 });
      
      if (freelancers) {
        const active = freelancers.filter((f: any) => f.status === 'active').length;
        const avgRating = freelancers.length > 0
          ? freelancers.reduce((acc: number, f: any) => acc + (f.rating || 0), 0) / freelancers.length
          : 0;
        const totalProjects = freelancers.reduce((acc: number, f: any) => acc + (f.total_projects || 0), 0);

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
    <div className="space-y-8">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-2"
      >
        <h1 className="text-3xl font-bold">
          Welcome back, <span className="gradient-text">{user?.email?.split('@')[0]}</span>!
        </h1>
        <p className="text-muted-foreground">
          Here's what's happening with your freelancer platform today.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
      >
        {statCards.map((stat, index) => (
          <motion.div key={stat.title} variants={itemVariants}>
            <Card className="glass hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color}`}>
                  <stat.icon className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{loading ? '...' : stat.value}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Recent Freelancers */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Recent Freelancers
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />
                ))}
              </div>
            ) : recentFreelancers.length > 0 ? (
              <div className="space-y-3">
                {recentFreelancers.map((freelancer, index) => (
                  <motion.div
                    key={freelancer.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full gradient-primary flex items-center justify-center">
                        <span className="text-primary-foreground font-medium">
                          {freelancer.name[0].toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{freelancer.name}</p>
                        <p className="text-sm text-muted-foreground">{freelancer.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="hidden sm:flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm">{freelancer.rating || 0}</span>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          freelancer.status === 'active'
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                        }`}
                      >
                        {freelancer.status}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No freelancers yet. Add your first freelancer!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid gap-4 md:grid-cols-3"
      >
        <Card className="glass hover:shadow-lg transition-all cursor-pointer group">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Add Freelancer</h3>
                <p className="text-sm text-muted-foreground">Register a new freelancer</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass hover:shadow-lg transition-all cursor-pointer group">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-accent/10 group-hover:bg-accent/20 transition-colors">
                <TrendingUp className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h3 className="font-medium">View Reports</h3>
                <p className="text-sm text-muted-foreground">Check platform analytics</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass hover:shadow-lg transition-all cursor-pointer group">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-secondary/10 group-hover:bg-secondary/20 transition-colors">
                <Briefcase className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <h3 className="font-medium">Manage Projects</h3>
                <p className="text-sm text-muted-foreground">View ongoing work</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}