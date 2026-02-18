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
  Star,
  CheckCircle,
  Globe,
  Award,
} from 'lucide-react';

const features = [
  {
    icon: Users,
    title: 'Expert Freelancers',
    description: 'Connect with top-rated professionals across all industries and skill sets.',
  },
  {
    icon: Shield,
    title: 'Secure Platform',
    description: 'Advanced security with JWT authentication and role-based access control.',
  },
  {
    icon: TrendingUp,
    title: 'Analytics & Reports',
    description: 'Comprehensive analytics and reporting tools for data-driven decisions.',
  },
  {
    icon: Zap,
    title: 'Fast & Reliable',
    description: 'Built with modern technologies for lightning-fast performance.',
  },
];

const stats = [
  { value: '10K+', label: 'Freelancers' },
  { value: '50K+', label: 'Projects Completed' },
  { value: '98%', label: 'Client Satisfaction' },
  { value: '24/7', label: 'Support' },
];

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Product Manager',
    content: 'FreelanceHub helped us find the perfect developer for our startup. The platform is intuitive and the quality of freelancers is outstanding.',
    rating: 5,
  },
  {
    name: 'Michael Chen',
    role: 'CEO',
    content: 'The analytics and reporting features have transformed how we manage our freelance team. Highly recommended!',
    rating: 5,
  },
  {
    name: 'Emily Davis',
    role: 'Designer',
    content: 'As a freelancer, I love how easy it is to find new opportunities and manage my projects through this platform.',
    rating: 5,
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-blue-500/20 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute top-40 right-20 w-32 h-32 bg-purple-500/20 rounded-full blur-xl animate-pulse delay-1000"></div>
      <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-cyan-500/20 rounded-full blur-xl animate-pulse delay-500"></div>

      <div className="relative z-10">
        {/* Navbar */}
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-0 z-40 glass-strong border-b border-white/10 backdrop-blur-xl"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <Link to="/" className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg">
                  <Briefcase className="h-6 w-6 text-white" />
                </div>
                <span className="font-bold text-xl text-white hidden sm:inline">
                  FreelanceHub
                </span>
              </Link>

              <div className="flex items-center gap-4">
                <Button variant="ghost" className="text-white hover:bg-white/10" asChild>
                  <Link to="/auth?role=client">Sign In</Link>
                </Button>
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg" asChild>
                  <Link to="/auth?role=client">Get Started</Link>
                </Button>
              </div>
            </div>
          </div>
        </motion.nav>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <section className="py-20 text-center relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6">
                <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
                  Connect
                </span>
                <br />
                <span className="text-white">with Top Talent</span>
              </h1>

              <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                The premier platform for businesses and freelancers. Find exceptional talent,
                manage projects efficiently, and scale your operations with our comprehensive
                freelancer management solution.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-xl text-white px-8 py-4 text-lg" asChild>
                  <Link to="/auth?role=client">
                    Start Hiring Today
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 px-8 py-4 text-lg" asChild>
                  <Link to="/auth?role=client">Join as Freelancer</Link>
                </Button>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="text-center"
                >
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-400 text-sm uppercase tracking-wide">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </section>

          {/* Features Section */}
          <section className="py-20">
            <div className="text-center mb-16">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-4xl md:text-5xl font-bold mb-4"
              >
                <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  Why Choose FreelanceHub?
                </span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-gray-300 text-lg max-w-2xl mx-auto"
              >
                Built for modern businesses with cutting-edge technology and user-centric design.
              </motion.p>
            </div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid md:grid-cols-2 gap-8"
            >
              {features.map((feature, index) => (
                <motion.div key={feature.title} variants={itemVariants}>
                  <Card className="h-full bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                    <CardContent className="pt-8 pb-8 px-6">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-16 h-16 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                        <feature.icon className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                      <p className="text-gray-300 text-lg leading-relaxed">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </section>

          {/* Testimonials Section */}
          <section className="py-20">
            <div className="text-center mb-16">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-4xl md:text-5xl font-bold mb-4"
              >
                <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  What Our Users Say
                </span>
              </motion.h2>
            </div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid md:grid-cols-3 gap-8"
            >
              {testimonials.map((testimonial, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300">
                    <CardContent className="pt-6 pb-6 px-6">
                      <div className="flex mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <p className="text-gray-300 mb-6 italic">"{testimonial.content}"</p>
                      <div>
                        <div className="font-semibold text-white">{testimonial.name}</div>
                        <div className="text-gray-400 text-sm">{testimonial.role}</div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </section>

          {/* CTA Section */}
          <section className="py-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl p-12 backdrop-blur-sm border border-white/10"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                Join thousands of businesses and freelancers who trust FreelanceHub
                for their project needs.
              </p>
              <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-xl text-white px-8 py-4 text-lg" asChild>
                <Link to="/auth?role=client">
                  Create Your Account
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </motion.div>
          </section>

          {/* Footer */}
          <footer className="border-t border-white/10 mt-20 py-12 text-center">
            <div className="flex justify-center mb-6">
              <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg">
                <Briefcase className="h-6 w-6 text-white" />
              </div>
            </div>
            <p className="text-gray-400 mb-4">© 2024 FreelanceHub - Connecting Talent Worldwide</p>
            <div className="flex justify-center gap-6 text-sm text-gray-500">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Contact Us</a>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
