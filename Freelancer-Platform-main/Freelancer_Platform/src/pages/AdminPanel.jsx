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
      // Get users with roles via direct query
      const { data: profiles } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      const { data: roles } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (profiles && roles) {
        const rolesMap = roles.reduce((acc: Record, r) => {
          acc[r.user_id] = r.role;
          return acc;
        }, {});

        const usersvia API
      const { data: usersData } = await adminApi.getUsers();
      if (usersData && Array.isArray(usersData)) {
        setUsers(usersData);
      }

      // Get stats via API
      const { data: statsData } = await adminApi.getStats();
      if (statsData) {
        setStats(statsDataeq('user_id', userId);

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
    return ;
  }

  const statCards = [
    {) => {
    setUpdatingRole(userId);
    try {
      const { error } = await adminApi.setUserRole(userId, newRole);
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
    
      {/* Header */}
      
        
          
        </div>
        
          Admin Panel</h1>
          Manage users and platform settings</p>
        </div>
      </motion.div>

      {/* Stats Grid */}
      
        {statCards.map((stat, index) => (
          
            
              
                
                  {stat.title}
                </CardTitle>
                
                  
                </div>
              </CardHeader>
              
                
                  {loading ? '...' : stat.value}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Users Management */}
      
        
          
            
              
              User Management
            </CardTitle>
            
              Manage user roles and permissions
            </CardDescription>
          </CardHeader>
          
            {loading ? (
              
                
              </div>
            ) : users.length > 0 ? (
              
                
                  
                    
                      User</TableHead>
                      Email</TableHead>
                      Joined</TableHead>
                      Role</TableHead>
                    </TableRow>
                  </TableHeader>
                  
                    
                      {users.map((userProfile, index) => (
                        
                          
                            
                              
                                {(userProfile.full_name || userProfile.email)?.[0]?.toUpperCase() || 'U'}
                              </div>
                              
                                
                                  {userProfile.full_name || 'Unknown'}
                                </p>
                                {userProfile.user_id === user?.id && (
                                  (You)</span>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          {userProfile.email}</TableCell>
                          
                            {new Date(userProfile.created_at).toLocaleDateString()}
                          </TableCell>
                          
                            
                              {userProfile.user_id === user?.id ? (
                                
                                  
                                  Admin
                                </span>
                              ) : (
                                
                                    handleRoleChange(userProfile.user_id, value)
                                  }
                                  disabled={updatingRole === userProfile.user_id}
                                >
                                  
                                    {updatingRole === userProfile.user_id ? (
                                      
                                    ) : (
                                      
                                    )}
                                  </SelectTrigger>
                                  
                                    
                                      
                                        
                                        User
                                      </div>
                                    </SelectItem>
                                    
                                      
                                        
                                        Admin
                                      </div>
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
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
              
                
                No users found</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}