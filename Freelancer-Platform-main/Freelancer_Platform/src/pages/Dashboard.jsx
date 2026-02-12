import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { freelancerApi } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Briefcase, TrendingUp, Star, Clock, CheckCircle } from 'lucide-react';

{
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
    
      {/* Welcome Header */}
      
        
          Welcome back, {user?.email?.split('@')[0]}</span>!
        </h1>
        
          Here's what's happening with your freelancer platform today.
        </p>
      </motion.div>

      {/* Stats Grid */}
      
        {statCards.map((stat, index) => (
          
            
              
                
                  {stat.title}
                </CardTitle>
                
                  
                </div>
              </CardHeader>
              
                {loading ? '...' : stat.value}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Recent Freelancers */}
      
        
          
            
              
              Recent Freelancers
            </CardTitle>
          </CardHeader>
          
            {loading ? (
              
                {[...Array(3)].map((_, i) => (
                  
                ))}
              </div>
            ) : recentFreelancers.length > 0 ? (
              
                {recentFreelancers.map((freelancer, index) => (
                  
                    
                      
                        
                          {freelancer.name[0].toUpperCase()}
                        </span>
                      </div>
                      
                        {freelancer.name}</p>
                        {freelancer.email}</p>
                      </div>
                    </div>
                    
                      
                        
                        {freelancer.rating || 0}</span>
                      </div>
                      
                        {freelancer.status}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              
                
                No freelancers yet. Add your first freelancer!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      
        
          
            
              
                
              </div>
              
                Add Freelancer</h3>
                Register a new freelancer</p>
              </div>
            </div>
          </CardContent>
        </Card>

        
          
            
              
                
              </div>
              
                View Reports</h3>
                Check platform analytics</p>
              </div>
            </div>
          </CardContent>
        </Card>

        
          
            
              
                
              </div>
              
                Manage Projects</h3>
                View ongoing work</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}