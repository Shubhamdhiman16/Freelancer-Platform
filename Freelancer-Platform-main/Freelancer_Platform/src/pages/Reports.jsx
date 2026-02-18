import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { reportsApi, freelancerApi } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import {
  Plus,
  FileText,
  BarChart3,
  TrendingUp,
  Users,
  Calendar,
  Trash2,
  Loader2,
  PieChart,
} from 'lucide-react';

export default function Reports() {
  const { role } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState({
    totalFreelancers: 0,
    activeFreelancers: 0,
    avgRate: 0,
    totalProjects: 0,
  });

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'general',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [reportsRes, freelancersRes] = await Promise.all([
        reportsApi.getAll(),
        freelancerApi.getAll({ limit: 100 }),
      ]);

      if (reportsRes.data) {
        setReports(reportsRes.data);
      }

      if (freelancersRes.data) {
        const freelancers = freelancersRes.data?.data || [];
        const active = freelancers.filter((f) => f.status === 'active').length;
        const avgRate = freelancers.length > 0
          ? freelancers.reduce((acc, f) => acc + (f.hourly_rate || 0), 0) / freelancers.length
          : 0;
        const totalProjects = freelancers.reduce((acc, f) => acc + (f.total_projects || 0), 0);

        setStats({
          totalFreelancers: freelancers.length,
          activeFreelancers: active,
          avgRate: Math.round(avgRate * 100) / 100,
          totalProjects,
        });
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { error } = await reportsApi.create({
        title: formData.title,
        description: formData.description || undefined,
        type: formData.type,
        data: { generatedAt: new Date().toISOString(), stats },
      });

      if (error) throw error;
      toast.success('Report created successfully');
      setIsDialogOpen(false);
      setFormData({ title: '', description: '', type: 'general' });
      loadData();
    } catch (error) {
      console.error('Error creating report:', error);
      toast.error(error.message || 'Failed to create report');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this report?')) return;

    try {
      const { error } = await reportsApi.delete(id);
      if (error) throw error;
      toast.success('Report deleted successfully');
      loadData();
    } catch (error) {
      console.error('Error deleting report:', error);
      toast.error(error.message || 'Failed to delete report');
    }
  };

  const getReportIcon = (type) => {
    switch (type) {
      case 'analytics':
        return BarChart3;
      case 'performance':
        return TrendingUp;
      case 'users':
        return Users;
      default:
        return FileText;
    }
  };

  const statsCards = [
    { label: 'Total Freelancers', value: stats.totalFreelancers, icon: Users, color: 'text-primary' },
    { label: 'Active Freelancers', value: stats.activeFreelancers, icon: TrendingUp, color: 'text-green-500' },
    { label: 'Avg. Hourly Rate', value: `$${stats.avgRate}`, icon: BarChart3, color: 'text-accent' },
    { label: 'Total Projects', value: stats.totalProjects, icon: PieChart, color: 'text-secondary' },
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Reports</h1>
            <p className="text-muted-foreground">View and generate platform reports</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Generate Report
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Generate New Report</DialogTitle>
                <DialogDescription>
                  Create a new report based on current platform data.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Report Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Monthly Performance Report"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="type">Report Type</Label>
                    <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="analytics">Analytics</SelectItem>
                        <SelectItem value="performance">Performance</SelectItem>
                        <SelectItem value="users">Users</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Brief description of the report..."
                      rows={3}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={saving}>
                      {saving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        'Generate Report'
                      )}
                    </Button>
                  </div>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        {statsCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.05 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className={`p-2 rounded-lg bg-primary/10 mr-4`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold">
                      {loading ? '...' : stat.value}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Reports List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Generated Reports</CardTitle>
            <CardDescription>
              View all generated reports and their details
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : reports.length > 0 ? (
              <div className="space-y-4">
                {reports.map((report, index) => {
                  const Icon = getReportIcon(report.type);
                  return (
                    <motion.div
                      key={report.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.05 }}
                    >
                      <Card className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                              <Icon className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-semibold">{report.title}</h3>
                              <p className="text-sm text-muted-foreground">
                                {report.description || 'No description'}
                              </p>
                              <div className="flex items-center space-x-4 mt-2">
                                <span className="text-xs text-muted-foreground flex items-center">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  {new Date(report.created_at).toLocaleDateString()}
                                </span>
                                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                                  {report.type}
                                </span>
                              </div>
                            </div>
                          </div>
                          {role === 'admin' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(report.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No reports yet</p>
                <p className="text-sm text-muted-foreground">Generate your first report to get started</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
