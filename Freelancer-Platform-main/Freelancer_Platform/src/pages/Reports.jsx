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

{
  id: string;
  title: string;
  description;
  type: string;
  data: any;
  created_at: string;
}

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
        const freelancers = freelancersRes.data;
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

  const handleSubmit = async (e: React.FormEvent) => {
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
    
      {/* Header */}
      
        
          Reports</h1>
          View and generate platform reports</p>
        </div>
        
          
            
              
              Generate Report
            </Button>
          </DialogTrigger>
          
            
              Generate New Report</DialogTitle>
              
                Create a new report based on current platform data.
              </DialogDescription>
            </DialogHeader>
            
              
                Report Title *</Label>
                 setFormData({ ...formData, title: e.target.value })}
                  placeholder="Monthly Performance Report"
                  required
                />
              </div>
              
                Report Type</Label>
                 setFormData({ ...formData, type: value })}
                >
                  
                    
                  </SelectTrigger>
                  
                    General</SelectItem>
                    Analytics</SelectItem>
                    Performance</SelectItem>
                    Users</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
                Description</Label>
                 setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of the report..."
                  rows={3}
                />
              </div>
              
                 setIsDialogOpen(false)}>
                  Cancel
                </Button>
                
                  {saving ? (
                    <>
                      
                      Generating...
                    </>
                  ) : (
                    'Generate Report'
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Stats Overview */}
      
        {statsCards.map((stat, index) => (
          
            
              
                
                  
                    {stat.label}</p>
                    
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
      
        
          
            
              
              Generated Reports
            </CardTitle>
            
              View all generated reports and their details
            </CardDescription>
          </CardHeader>
          
            {loading ? (
              
                
              </div>
            ) : reports.length > 0 ? (
              
                {reports.map((report, index) => {
                  const Icon = getReportIcon(report.type);
                  return (
                    
                      
                        
                          
                        </div>
                        
                          {report.title}</h3>
                          
                            {report.description || 'No description'}
                          </p>
                          
                            
                              
                              {new Date(report.created_at).toLocaleDateString()}
                            </span>
                            
                              {report.type}
                            </span>
                          </div>
                        </div>
                      </div>
                      {role === 'admin' && (
                         handleDelete(report.id)}
                        >
                          
                        </Button>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              
                
                No reports yet</p>
                Generate your first report to get started</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}