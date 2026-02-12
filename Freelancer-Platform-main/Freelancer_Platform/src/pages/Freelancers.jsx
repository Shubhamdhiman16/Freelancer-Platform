import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { freelancerApi } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
  Plus,
  Search,
  Edit,
  Trash2,
  Star,
  Mail,
  Phone,
  Briefcase,
  Loader2,
  ExternalLink,
} from 'lucide-react';

{
  id: string;
  name: string;
  email: string;
  phone;
  skills: string[];
  hourly_rate;
  experience_years;
  bio;
  portfolio_url;
  availability: string;
  rating: number;
  total_projects: number;
  status: string;
  created_at: string;
}

export default function Freelancers() {
  const { role } = useAuth();
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFreelancer, setEditingFreelancer] = useState(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    skills: '',
    hourly_rate: '',
    experience_years: '',
    bio: '',
    portfolio_url: '',
    availability: 'available',
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        skills: formData.skills.split(',').map((s) => s.trim()).filter(Boolean),
        hourly_rate: formData.hourly_rate ? parseFloat(formData.hourly_rate) : undefined,
        experience_years: formData.experience_years ? parseInt(formData.experience_years) : undefined,
        bio: formData.bio || undefined,
        portfolio_url: formData.portfolio_url || undefined,
        availability: formData.availability,
      };

      if (editingFreelancer) {
        const { error } = await freelancerApi.update(editingFreelancer.id, payload);
        if (error) throw error;
        toast.success('Freelancer updated successfully');
      } else {
        const { error } = await freelancerApi.create(payload);
        if (error) throw error;
        toast.success('Freelancer added successfully');
      }

      setIsDialogOpen(false);
      resetForm();
      loadFreelancers();
    } catch (error) {
      console.error('Error saving freelancer:', error);
      toast.error(error.message || 'Failed to save freelancer');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (freelancer: Freelancer) => {
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
      availability: freelancer.availability || 'available',
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
    setEditingFreelancer(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      skills: '',
      hourly_rate: '',
      experience_years: '',
      bio: '',
      portfolio_url: '',
      availability: 'available',
    });
  };

  const filteredFreelancers = freelancers.filter((f) => {
    const matchesSearch =
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.skills?.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || f.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    
      {/* Header */}
      
        
          Freelancers</h1>
          Manage your freelancer directory</p>
        </div>
         {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          
            
              
              Add Freelancer
            </Button>
          </DialogTrigger>
          
            
              
                {editingFreelancer ? 'Edit Freelancer' : 'Add New Freelancer'}
              </DialogTitle>
              
                Fill in the details below to {editingFreelancer ? 'update' : 'add'} a freelancer.
              </DialogDescription>
            </DialogHeader>
            
              
                
                  Full Name *</Label>
                   setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                
                  Email *</Label>
                   setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                
                  Phone</Label>
                   setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                
                  Hourly Rate ($)</Label>
                   setFormData({ ...formData, hourly_rate: e.target.value })}
                  />
                </div>
                
                  Experience (Years)</Label>
                   setFormData({ ...formData, experience_years: e.target.value })}
                  />
                </div>
                
                  Availability</Label>
                   setFormData({ ...formData, availability: value })}
                  >
                    
                      
                    </SelectTrigger>
                    
                      Available</SelectItem>
                      Busy</SelectItem>
                      Unavailable</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
                Skills (comma-separated)</Label>
                 setFormData({ ...formData, skills: e.target.value })}
                />
              </div>
              
                Portfolio URL</Label>
                 setFormData({ ...formData, portfolio_url: e.target.value })}
                />
              </div>
              
                Bio</Label>
                 setFormData({ ...formData, bio: e.target.value })}
                  rows={3}
                />
              </div>
              
                 setIsDialogOpen(false)}>
                  Cancel
                </Button>
                
                  {saving ? (
                    <>
                      
                      Saving...
                    </>
                  ) : (
                    editingFreelancer ? 'Update' : 'Add Freelancer'
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Filters */}
      
        
          
           setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
          
            
          </SelectTrigger>
          
            All Status</SelectItem>
            Active</SelectItem>
            Inactive</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Freelancers Table */}
      
        
          
            {loading ? (
              
                
              </div>
            ) : filteredFreelancers.length > 0 ? (
              
                
                  
                    
                      Name</TableHead>
                      Contact</TableHead>
                      Skills</TableHead>
                      Rate</TableHead>
                      Rating</TableHead>
                      Status</TableHead>
                      Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  
                    
                      {filteredFreelancers.map((freelancer, index) => (
                        
                          
                            
                              
                                {freelancer.name[0].toUpperCase()}
                              </div>
                              
                                {freelancer.name}</p>
                                
                                  {freelancer.experience_years || 0} years exp.
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          
                            
                              
                                
                                {freelancer.email}
                              </div>
                              {freelancer.phone && (
                                
                                  
                                  {freelancer.phone}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          
                            
                              {freelancer.skills?.slice(0, 3).map((skill) => (
                                
                                  {skill}
                                </span>
                              ))}
                              {freelancer.skills?.length > 3 && (
                                
                                  +{freelancer.skills.length - 3}
                                </span>
                              )}
                            </div>
                          </TableCell>
                          
                            {freelancer.hourly_rate ? (
                              ${freelancer.hourly_rate}/hr</span>
                            ) : (
                              -</span>
                            )}
                          </TableCell>
                          
                            
                              
                              {freelancer.rating || 0}</span>
                            </div>
                          </TableCell>
                          
                            
                              {freelancer.status}
                            </span>
                          </TableCell>
                          
                            
                              {freelancer.portfolio_url && (
                                
                                  
                                    
                                  </a>
                                </Button>
                              )}
                               handleEdit(freelancer)}
                              >
                                
                              </Button>
                              {role === 'admin' && (
                                 handleDelete(freelancer.id)}
                                >
                                  
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </TableBody>
                </Table>
              </div>
            ) : (
              
                
                No freelancers found</p>
                Add your first freelancer to get started</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}