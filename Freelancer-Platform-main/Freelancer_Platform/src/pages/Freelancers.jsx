import { useState, useEffect } from 'react';
import { freelancerApi } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AnimatedBackground from '@/components/AnimatedBackground';
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
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [editingFreelancer, setEditingFreelancer] = useState(null);
  const [viewingFreelancer, setViewingFreelancer] = useState(null);
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
      setFreelancers(data?.data || []);
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
        const { error } = await freelancerApi.update(editingFreelancer._id || editingFreelancer.id, freelancerData);
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

  const handleDelete = async (freelancer) => {
    console.log('Deleting freelancer:', freelancer);
    console.log('Freelancer ID:', freelancer._id || freelancer.id);

    const id = freelancer._id || freelancer.id;
    if (!id) {
      console.error('No ID found on freelancer object:', freelancer);
      toast.error('Invalid freelancer ID');
      return;
    }

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

  const handleViewDetails = (freelancer) => {
    setViewingFreelancer(freelancer);
    setIsDetailDialogOpen(true);
  };

  const openNewDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <AnimatedBackground variant="dark" />

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Freelancers</h1>
            <p className="text-gray-400">Manage your freelancer directory</p>
            <p className="text-sm text-gray-500 mt-1">
              Total Freelancers: {freelancers.length}
            </p>
          </div>
          {(role === 'admin' || role === 'manager') && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={openNewDialog} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Freelancer
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-800 border-gray-700 text-white">
                <DialogHeader>
                  <DialogTitle className="text-white">
                    {editingFreelancer ? 'Edit Freelancer' : 'Add New Freelancer'}
                  </DialogTitle>
                  <DialogDescription className="text-gray-400">
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
                        <Label htmlFor="name" className="text-white">Full Name *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="John Doe"
                          required
                          className="bg-gray-700 border-gray-600 text-white"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="email" className="text-white">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="john@example.com"
                          required
                          className="bg-gray-700 border-gray-600 text-white"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="phone" className="text-white">Phone</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+1 (555) 123-4567"
                          className="bg-gray-700 border-gray-600 text-white"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="hourly_rate" className="text-white">Hourly Rate ($) *</Label>
                        <Input
                          id="hourly_rate"
                          type="number"
                          step="0.01"
                          min="0"
                          value={formData.hourly_rate}
                          onChange={(e) => setFormData({ ...formData, hourly_rate: e.target.value })}
                          placeholder="50.00"
                          required
                          className="bg-gray-700 border-gray-600 text-white"
                        />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="skills" className="text-white">Skills (comma-separated)</Label>
                      <Input
                        id="skills"
                        value={formData.skills}
                        onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                        placeholder="React, Node.js, MongoDB, etc."
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="experience_years" className="text-white">Experience (years)</Label>
                        <Input
                          id="experience_years"
                          type="number"
                          min="0"
                          value={formData.experience_years}
                          onChange={(e) => setFormData({ ...formData, experience_years: e.target.value })}
                          placeholder="5"
                          className="bg-gray-700 border-gray-600 text-white"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="status" className="text-white">Status</Label>
                        <select
                          id="status"
                          value={formData.status}
                          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                          className="flex h-10 w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white"
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                          <option value="pending">Pending</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="bio" className="text-white">Bio</Label>
                      <Textarea
                        id="bio"
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        placeholder="Brief description about the freelancer..."
                        rows={3}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="portfolio_url" className="text-white">Portfolio URL</Label>
                      <Input
                        id="portfolio_url"
                        type="url"
                        value={formData.portfolio_url}
                        onChange={(e) => setFormData({ ...formData, portfolio_url: e.target.value })}
                        placeholder="https://portfolio.example.com"
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                      <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="border-gray-600 text-gray-300 hover:bg-gray-700">
                        Cancel
                      </Button>
                      <Button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-700">
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

          {/* Detail Dialog */}
          <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
            <DialogContent className="bg-gray-800 border-gray-700 text-white">
              <DialogHeader>
                <DialogTitle className="text-white">Freelancer Details</DialogTitle>
                <DialogDescription className="text-gray-400">
                  Detailed information about {viewingFreelancer?.name}
                </DialogDescription>
              </DialogHeader>
              {viewingFreelancer && (
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center border border-gray-600">
                      <Users className="h-8 w-8 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">{viewingFreelancer.name}</h3>
                      <p className="text-gray-400">{viewingFreelancer.email}</p>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                        viewingFreelancer.status === 'active'
                          ? 'bg-green-500/20 text-green-400'
                          : viewingFreelancer.status === 'inactive'
                          ? 'bg-red-500/20 text-red-400'
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {viewingFreelancer.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {viewingFreelancer.phone && (
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span className="text-white">{viewingFreelancer.phone}</span>
                      </div>
                    )}
                    {viewingFreelancer.hourly_rate && (
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-4 w-4 text-gray-400" />
                        <span className="text-white">${viewingFreelancer.hourly_rate}/hour</span>
                      </div>
                    )}
                    {viewingFreelancer.experience_years && (
                      <div className="flex items-center space-x-2">
                        <Briefcase className="h-4 w-4 text-gray-400" />
                        <span className="text-white">{viewingFreelancer.experience_years} years experience</span>
                      </div>
                    )}
                  </div>

                  {viewingFreelancer.skills && viewingFreelancer.skills.length > 0 && (
                    <div>
                      <h4 className="font-medium text-white mb-2">Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {viewingFreelancer.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm border border-gray-600"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {viewingFreelancer.bio && (
                    <div>
                      <h4 className="font-medium text-white mb-2">Bio</h4>
                      <p className="text-gray-400">{viewingFreelancer.bio}</p>
                    </div>
                  )}

                  {viewingFreelancer.portfolio_url && (
                    <div>
                      <h4 className="font-medium text-white mb-2">Portfolio</h4>
                      <a
                        href={viewingFreelancer.portfolio_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:underline"
                      >
                        {viewingFreelancer.portfolio_url}
                      </a>
                    </div>
                  )}

                  <div className="flex justify-end gap-2">
                    {(role === 'admin' || role === 'manager') && (
                      <Button
                        variant="destructive"
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this freelancer?')) {
                            handleDelete(viewingFreelancer);
                            setIsDetailDialogOpen(false);
                          }
                        }}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Freelancer
                      </Button>
                    )}
                    <Button variant="outline" onClick={() => setIsDetailDialogOpen(false)} className="border-gray-600 text-gray-300 hover:bg-gray-700">
                      Close
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Freelancers List */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="border-b border-gray-700">
          <CardTitle className="text-xl font-semibold text-white">Freelancer Directory</CardTitle>
          <CardDescription className="text-gray-400">
            Browse and manage all registered freelancers on the platform
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
            </div>
          ) : freelancers.length > 0 ? (
            <div className="space-y-4">
              {freelancers.map((freelancer) => (
                <Card key={freelancer.id} className="bg-gray-700/50 border-gray-600 p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center border border-gray-600">
                        <Users className="h-6 w-6 text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-semibold text-white">{freelancer.name}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            freelancer.status === 'active'
                              ? 'bg-green-500/20 text-green-400'
                              : freelancer.status === 'inactive'
                              ? 'bg-red-500/20 text-red-400'
                              : 'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {freelancer.status}
                          </span>
                        </div>
                        <div className="space-y-2 text-sm text-gray-400">
                          <div className="flex items-center space-x-2">
                            <Mail className="h-4 w-4" />
                            <span className="text-gray-300">{freelancer.email}</span>
                          </div>
                          {freelancer.phone && (
                            <div className="flex items-center space-x-2">
                              <Phone className="h-4 w-4" />
                              <span className="text-gray-300">{freelancer.phone}</span>
                            </div>
                          )}
                          {freelancer.hourly_rate && (
                            <div className="flex items-center space-x-2">
                              <DollarSign className="h-4 w-4" />
                              <span className="text-gray-300">{freelancer.hourly_rate}/hour</span>
                            </div>
                          )}
                          {freelancer.experience_years && (
                            <div className="flex items-center space-x-2">
                              <Briefcase className="h-4 w-4" />
                              <span className="text-gray-300">{freelancer.experience_years} years experience</span>
                            </div>
                          )}
                          {freelancer.skills && freelancer.skills.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {freelancer.skills.map((skill, skillIndex) => (
                                <span
                                  key={skillIndex}
                                  className="px-2 py-1 bg-gray-600 text-gray-300 rounded-md text-xs"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        {freelancer.bio && (
                          <p className="text-sm text-gray-400 mt-2">
                            {freelancer.bio}
                          </p>
                        )}
                        {freelancer.portfolio_url && (
                          <div className="flex items-center space-x-2 mt-2">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <a
                              href={freelancer.portfolio_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:underline text-sm"
                            >
                              View Portfolio
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDetails(freelancer)}
                        className="text-gray-400 hover:text-white hover:bg-gray-600"
                      >
                        View Details
                      </Button>
                      {(role === 'admin' || role === 'manager') && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(freelancer)}
                          className="text-gray-400 hover:text-white hover:bg-gray-600"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(freelancer)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-600/20"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">No freelancers found</p>
              <p className="text-sm text-gray-500">
                {(role === 'admin' || role === 'manager')
                  ? 'Add your first freelancer to get started'
                  : 'No freelancers have been added to the platform yet'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
