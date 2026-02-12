import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import {
  Briefcase,
  Users,
  Shield,
  TrendingUp,
  ArrowRight,
  CheckCircle,
  Star,
  Zap,
} from 'lucide-react';

const features = [
  {
    icon: Users,
    title: 'Freelancer Management',
    description: 'Full CRUD operations for managing freelancer profiles, skills, and rates.',
  },
  {
    icon: Shield,
    title: 'JWT Authentication',
    description: 'Secure authentication with role-based access control for Admin and Users.',
  },
  {
    icon: TrendingUp,
    title: 'Reports & Analytics',
    description: 'Generate and view platform reports with comprehensive analytics.',
  },
  {
    icon: Zap,
    title: 'REST API Backend',
    description: 'Complete REST API with edge functions for all CRUD operations.',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function Index() {
  const { user } = useAuth();

  return (
    
      {/* Background Effects */}
      
      
      
      

      {/* Navbar */}
      
        
          
            
              
                
              </div>
              FreelanceHub</span>
            </div>
            
              {user ? (
                
                  
                    Go to Dashboard 
                  </Link>
                </Button>
              ) : (
                <>
                  
                    Sign In</Link>
                  </Button>
                  
                    Get Started</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      
        
          
            
            Placement Project - Freelancer Platform</span>
          </motion.div>
          
          
            Freelancer</span>{' '}
            Platform</span>
          </h1>
          
          
            A complete full-stack solution for managing freelancers with JWT authentication,
            role-based access control, and comprehensive CRUD operations.
          </p>

          
            
              
                Get Started 
              </Link>
            </Button>
            
              View Demo</Link>
            </Button>
          </motion.div>
        </motion.div>

        {/* Floating Elements */}
        
          
            
          </div>
        </motion.div>
        
          
            
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      
        
          
            
              Platform Features</span>
            </h2>
            
              Everything you need to manage a freelancer platform with modern web technologies.
            </p>
          </motion.div>

          
            {features.map((feature) => (
              
                
                  
                    
                      
                    </div>
                    {feature.title}</h3>
                    {feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Tech Stack Section */}
      
        
          
            
              Built with Modern Stack</span>
            </h2>
          </motion.div>

          
            {['React', 'TypeScript', 'Tailwind CSS', 'Supabase', 'Edge Functions', 'Framer Motion'].map(
              (tech) => (
                
                  
                  {tech}</span>
                </div>
              )
            )}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      
        
          
            
            
              
                Ready to Get Started?
              </h2>
              
                Sign up now to explore the full-featured freelancer management platform.
              </p>
              
                
                  Create Account 
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      
        
          
            
              
                
              </div>
              FreelanceHub</span>
            </div>
            
              Placement Project - Freelancer Platform with JWT & CRUD
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}