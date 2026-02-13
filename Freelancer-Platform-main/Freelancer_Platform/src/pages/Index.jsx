import { Link, Navigate } from 'react-router-dom';
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
    description: 'Complete REST API with MongoDB integration for all CRUD operations.',
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

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Navbar */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-40 glass-strong border-b"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="p-2 rounded-lg gradient-primary">
                <Briefcase className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl hidden sm:inline gradient-text">
                FreelanceHub
              </span>
            </Link>

            <div className="flex items-center gap-4">
              <Button variant="ghost" asChild>
                <Link to="/auth">Sign In</Link>
              </Button>
              <Button asChild>
                <Link to="/auth">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </motion.nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="py-20 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6">
            <span className="gradient-text">Freelancer</span> Platform
          </h1>

          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            A complete full-stack solution for managing freelancers with JWT authentication,
            role-based access control, and comprehensive CRUD operations.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/auth">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/auth">View Demo</Link>
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 border-t">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="gradient-text">Platform Features</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Everything you need to manage a freelancer platform with modern web technologies.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature) => (
              <Card key={feature.title} className="h-full hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t mt-20 py-12 text-center text-muted-foreground">
          <div className="flex justify-center mb-4">
            <Briefcase className="h-5 w-5" />
          </div>
          <p>© 2026 FreelanceHub - Freelancer Platform with JWT & CRUD</p>
        </footer>
      </div>
    </div>
  );
}
