import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { freelancerApi, adminApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';
import {
  Shield,
  Users,
  Briefcase,
  FileText,
  TrendingUp,
  Crown,
  User,
  Loader2,
} from 'lucide-react';

export default function AdminPanel() {
  const { role, user } = useAuth();
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingRole, setUpdatingRole] = useState(null);

  useEffect(() => {
    if (role === 'admin') {
      loadData();
    }
  }, [role]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Get users via API
      const { data: usersData } = await adminApi.getUsers();
      if (usersData && Array.isArray(usersData)) {
        setUsers(usersData);
      }

      // Get stats via API
      const { data: statsData } = await adminApi.getStats();
      if (statsData) {
        setStats(statsData);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    setUpdatingRole(userId);
    try {
      const { error } = await adminApi.setUserRole(userId, newRole);

      if (error) throw error;

      setUsers((prev) =>
        prev.map((u) => (u.user_id === userId ? { ...u, role: newRole } : u))
      );
      toast.success(`User role updated to ${newRole}`);
    } catch (error) {
      console.error('Error updating role:', error);
      toast.error(error.message || 'Failed to update role');
    } finally {
      setUpdatingRole(null);
    }
  };

  // Redirect non-admin users
  if (role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  const statCards = [
    {
      title: 'Total Freelancers',
      value: stats?.totalFreelancers || 0,
      icon: Briefcase,
      color: 'from-accent to-accent/80',
    },
    {
      title: 'Active Freelancers',
      value: stats?.freelancersByStatus?.active || 0,
      icon: TrendingUp,
      color: 'from-green-500 to-green-600',
    },
    {
      title: 'Inactive Freelancers',
      value: stats?.freelancersByStatus?.inactive || 0,
      icon: FileText,
      color: 'from-orange-500 to-orange-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/80 p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-foreground">Admin Panel</h1>
              <p className="text-muted-foreground mt-2">Manage users and platform settings</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`bg-gradient-to-br ${stat.color} border-0`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">
                    {stat.title}
                  </CardTitle>
                  <stat.icon className="w-5 h-5 text-white/80" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">
                  {loading ? '...' : stat.value}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Users Management */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>Manage user roles and permissions</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-5 h-5 animate-spin" />
              </div>
            ) : users.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Role</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence>
                      {users.map((userProfile, index) => (
                        <motion.tr
                          key={userProfile.user_id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-accent/80 flex items-center justify-center text-white text-xs font-bold">
                                {(userProfile.full_name || userProfile.email)?.[0]?.toUpperCase() || 'U'}
                              </div>
                              <div>
                                <p className="font-medium">{userProfile.full_name || 'Unknown'}</p>
                                {userProfile.user_id === user?.id && (
                                  <span className="text-xs text-muted-foreground">(You)</span>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{userProfile.email}</TableCell>
                          <TableCell>
                            {new Date(userProfile.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {userProfile.user_id === user?.id ? (
                              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-accent to-accent/80 text-white text-sm">
                                <Crown className="w-4 h-4" />
                                Admin
                              </div>
                            ) : (
                              <Select
                                value={userProfile.role || 'user'}
                                onValueChange={(value) =>
                                  handleRoleChange(userProfile.user_id, value)
                                }
                                disabled={updatingRole === userProfile.user_id}
                              >
                                <SelectTrigger className="w-24">
                                  {updatingRole === userProfile.user_id ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                  ) : (
                                    <SelectValue />
                                  )}
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="user">
                                    <div className="flex items-center gap-2">
                                      <User className="w-4 h-4" />
                                      User
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="admin">
                                    <div className="flex items-center gap-2">
                                      <Shield className="w-4 h-4" />
                                      Admin
                                    </div>
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            )}
                          </TableCell>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No users found</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}