import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { freelancerApi } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import {
  Plus,
  Users,
  Edit,
  Trash2,
  Loader2,
  Mail,
  Phone,
  MapPin,
  DollarSign,
  Briefcase,
  Star,
} from 'lucide-react';

export default function Freelancers() {
  const { user, role } = useAuth();
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFreelancer, setEditingFreelancer] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    skills: '',
    hourly_rate: '',
    experience_years: '',
    bio: '',
    portfolio_url: '',
    status: 'active',
  });

  useEffect(() => {
    loadFreelancers();
  }, []);

  const loadFreelancers = async () => {
    setLoading(true);
    try {
      const { data, error } = await freelancerApi.getAll();
      if (error) throw error;
      setFreelancers(data || []);
    } catch (error) {
      console.error('Error loading freelancers:', error);
      toast.error('Failed to load freelancers');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const freelancerData = {
        ...formData,
        skills: formData.skills.split(',').map(s => s.trim()).filter(s => s),
        hourly_rate: parseFloat(formData.hourly_rate) || 0,
        experience_years: parseInt(formData.experience_years) || 0,
      };

      if (editingFreelancer) {
        const { error } = await freelancerApi.update(editingFreelancer.id, freelancerData);
        if (error) throw error;
        toast.success('Freelancer updated successfully');
      } else {
        const { error } = await freelancerApi.create(freelancerData);
        if (error) throw error;
        toast.success('Freelancer created successfully');
      }

      resetForm();
      loadFreelancers();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving freelancer:', error);
      toast.error(error.message || 'Failed to save freelancer');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (freelancer) => {
    setEditingFreelancer(freelancer);
    setFormData({
      name: freelancer.name,
      email: freelancer.email,
      phone: freelancer.phone || '',
      skills: freelancer.skills?.join(', ') || '',
      hourly_rate: freelancer.hourly_rate?.toString() || '',
      experience_years: freelancer.experience_years?.toString() || '',
      bio: freelancer.bio || '',
      portfolio_url: freelancer.portfolio_url || '',
      status: freelancer.status || 'active',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this freelancer?')) return;

    try {
      const { error } = await freelancerApi.delete(id);
      if (error) throw error;
      toast.success('Freelancer deleted successfully');
      loadFreelancers();
    } catch (error) {
      console.error('Error deleting freelancer:', error);
      toast.error(error.message || 'Failed to delete freelancer');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      skills: '',
      hourly_rate: '',
      experience_years: '',
      bio: '',
      portfolio_url: '',
      status: 'active',
    });
    setEditingFreelancer(null);
  };

  const openNewDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

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
            <h1 className="text-3xl font-bold">Freelancers</h1>
            <p className="text-muted-foreground">Manage your freelancer directory</p>
          </div>
          {(role === 'admin' || role === 'manager') && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={openNewDialog}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Freelancer
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingFreelancer ? 'Edit Freelancer' : 'Add New Freelancer'}
                  </DialogTitle>
                  <DialogDescription>
                    {editingFreelancer 
                      ? 'Update the freelancer information below.'
                      : 'Fill in the details to add a new freelancer to the platform.'
                    }
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="John Doe"
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="john@example.com"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="hourly_rate">Hourly Rate ($) *</Label>
                        <Input
                          id="hourly_rate"
                          type="number"
                          step="0.01"
                          min="0"
                          value={formData.hourly_rate}
                          onChange={(e) => setFormData({ ...formData, hourly_rate: e.target.value })}
                          placeholder="50.00"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="skills">Skills (comma-separated)</Label>
                      <Input
                        id="skills"
                        value={formData.skills}
                        onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                        placeholder="React, Node.js, MongoDB, etc."
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="experience_years">Experience (years)</Label>
                        <Input
                          id="experience_years"
                          type="number"
                          min="0"
                          value={formData.experience_years}
                          onChange={(e) => setFormData({ ...formData, experience_years: e.target.value })}
                          placeholder="5"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="status">Status</Label>
                        <select
                          id="status"
                          value={formData.status}
                          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                          <option value="pending">Pending</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        placeholder="Brief description about the freelancer..."
                        rows={3}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="portfolio_url">Portfolio URL</Label>
                      <Input
                        id="portfolio_url"
                        type="url"
                        value={formData.portfolio_url}
                        onChange={(e) => setFormData({ ...formData, portfolio_url: e.target.value })}
                        placeholder="https://portfolio.example.com"
                      />
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                      <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={saving}>
                        {saving ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            {editingFreelancer ? 'Updating...' : 'Creating...'}
                          </>
                        ) : (
                          <>
                            {editingFreelancer ? 'Update Freelancer' : 'Create Freelancer'}
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </motion.div>

      {/* Freelancers List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Freelancer Directory</CardTitle>
            <CardDescription>
              Browse and manage all registered freelancers on the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : freelancers.length > 0 ? (
              <div className="space-y-4">
                {freelancers.map((freelancer, index) => (
                  <motion.div
                    key={freelancer.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.05 }}
                  >
                    <Card className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <Users className="h-6 w-6 text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="text-lg font-semibold">{freelancer.name}</h3>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                freelancer.status === 'active' 
                                  ? 'bg-green-100 text-green-800'
                                  : freelancer.status === 'inactive'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {freelancer.status}
                              </span>
                            </div>
                            <div className="space-y-2 text-sm text-muted-foreground">
                              <div className="flex items-center space-x-2">
                                <Mail className="h-4 w-4" />
                                <span>{freelancer.email}</span>
                              </div>
                              {freelancer.phone && (
                                <div className="flex items-center space-x-2">
                                  <Phone className="h-4 w-4" />
                                  <span>{freelancer.phone}</span>
                                </div>
                              )}
                              {freelancer.hourly_rate && (
                                <div className="flex items-center space-x-2">
                                  <DollarSign className="h-4 w-4" />
                                  <span>{freelancer.hourly_rate}/hour</span>
                                </div>
                              )}
                              {freelancer.experience_years && (
                                <div className="flex items-center space-x-2">
                                  <Briefcase className="h-4 w-4" />
                                  <span>{freelancer.experience_years} years experience</span>
                                </div>
                              )}
                              {freelancer.skills && freelancer.skills.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                  {freelancer.skills.map((skill, skillIndex) => (
                                    <span
                                      key={skillIndex}
                                      className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-xs"
                                    >
                                      {skill}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                            {freelancer.bio && (
                              <p className="text-sm text-muted-foreground mt-2">
                                {freelancer.bio}
                              </p>
                            )}
                            {freelancer.portfolio_url && (
                              <div className="flex items-center space-x-2 mt-2">
                                <MapPin className="h-4 w-4" />
                                <a
                                  href={freelancer.portfolio_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary hover:underline text-sm"
                                >
                                  View Portfolio
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
                        {(role === 'admin' || role === 'manager') && (
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(freelancer)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(freelancer.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No freelancers found</p>
                <p className="text-sm text-muted-foreground">
                  {(role === 'admin' || role === 'manager') 
                    ? 'Add your first freelancer to get started'
                    : 'No freelancers have been added to the platform yet'
                  }
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
