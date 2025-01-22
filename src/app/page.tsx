'use client';

import { MainLayout } from '@/components/layouts/MainLayout';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles, Music, Users, Palette, Laugh, Heart, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.2
    }
  }
};

export default function LandingPage() {
  return (
    <MainLayout>
      <div className="relative">
        {/* Animated Background */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-orange-500/20 backdrop-blur-3xl" />
          <div className="absolute -top-[40rem] -left-[40rem] h-[80rem] w-[80rem] rounded-full bg-gradient-to-br from-purple-600 via-pink-600 to-orange-600 opacity-30 blur-3xl" />
          <div className="absolute -bottom-[40rem] -right-[40rem] h-[80rem] w-[80rem] rounded-full bg-gradient-to-br from-purple-600 via-pink-600 to-orange-600 opacity-30 blur-3xl" />
        </div>

        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/5 backdrop-blur-lg border-b border-white/10">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center py-4">
              <Link href="/" className="flex items-center space-x-2">
                {/* <Image src="/logo.svg" alt="MemeMates Logo" width={40} height={40} className="rounded-lg" /> */}
                <span className="text-2xl font-bold text-white">MemeMates</span>
              </Link>
              <div className="hidden md:flex items-center space-x-8">
                <Link href="#features" className="text-white/90 hover:text-white transition-colors">Features</Link>
                <Link href="#how-it-works" className="text-white/90 hover:text-white transition-colors">How it Works</Link>
                <Link href="/login" className="text-white/90 hover:text-white transition-colors">Login</Link>
                <Button asChild size="lg" variant="secondary" className="bg-white text-purple-600 hover:bg-white/90">
                  <Link href="/signup">Get Started</Link>
                </Button>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="pt-32 pb-20 px-4">
          <motion.div 
            className="container mx-auto text-center"
            initial="initial"
            animate="animate"
            variants={staggerContainer}
          >
            <motion.div
              variants={fadeIn}
              className="max-w-4xl mx-auto space-y-6"
            >
              <h1 className="text-6xl md:text-7xl font-bold text-white leading-tight">
                Where Memes Meet{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">
                  Meaningful Connections
                </span>
              </h1>
              <p className="text-xl text-white/90 max-w-2xl mx-auto">
                Join the next generation of social connection. Create, share, and connect through memes, music, and mood boards.
              </p>
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center pt-8"
                variants={fadeIn}
              >
                <Button asChild size="lg" className="bg-white text-purple-600 hover:bg-white/90 h-14 px-8 rounded-full">
                  <Link href="/signup" className="inline-flex items-center text-lg">
                    Start Creating
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 h-14 px-8 rounded-full">
                  <Link href="/discover" className="text-lg">
                    Explore Trending Memes
                  </Link>
                </Button>
              </motion.div>
            </motion.div>

            {/* Stats Section */}
            <motion.div
              variants={fadeIn}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mt-20 pt-10 border-t border-white/10"
            >
              <StatCard number="1M+" label="Active Users" />
              <StatCard number="5M+" label="Memes Created" />
              <StatCard number="500K+" label="Connections Made" />
              <StatCard number="10K+" label="Daily Matches" />
            </motion.div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-32 bg-white/5 backdrop-blur-lg">
          <div className="container mx-auto px-4">
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="text-center mb-16"
            >
              <motion.h2 
                variants={fadeIn}
                className="text-4xl md:text-5xl font-bold text-white mb-6"
              >
                Everything You Need to Express Yourself
              </motion.h2>
              <motion.p 
                variants={fadeIn}
                className="text-xl text-white/80 max-w-2xl mx-auto"
              >
                Create, share, and connect with a suite of powerful tools designed for modern social interaction.
              </motion.p>
            </motion.div>

            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <FeatureCard 
                icon={<Laugh className="h-8 w-8 text-purple-400" />}
                title="AI-Powered Meme Creation"
                description="Generate hilarious memes instantly with our AI technology. Perfect for any mood or moment."
              />
              <FeatureCard 
                icon={<Music className="h-8 w-8 text-pink-400" />}
                title="Music Integration"
                description="Share your favorite tunes and create the perfect anthem for your profile."
              />
              <FeatureCard 
                icon={<Heart className="h-8 w-8 text-orange-400" />}
                title="Meaningful Connections"
                description="Find and connect with people who share your sense of humor and taste in memes."
              />
            </motion.div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-32">
          <div className="container mx-auto px-4">
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="text-center mb-16"
            >
              <motion.h2 
                variants={fadeIn}
                className="text-4xl md:text-5xl font-bold text-white mb-6"
              >
                How MemeMates Works
              </motion.h2>
              <motion.p 
                variants={fadeIn}
                className="text-xl text-white/80 max-w-2xl mx-auto"
              >
                Join our community in four simple steps
              </motion.p>
            </motion.div>

            <motion.div 
              className="grid grid-cols-1 md:grid-cols-4 gap-8"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <StepCard 
                number="1"
                title="Create Your Profile"
                description="Sign up and customize your profile with your favorite memes and music"
              />
              <StepCard 
                number="2"
                title="Generate Memes"
                description="Use our AI-powered tools to create and customize memes"
              />
              <StepCard 
                number="3"
                title="Connect"
                description="Find and connect with others who share your sense of humor"
              />
              <StepCard 
                number="4"
                title="Share & Engage"
                description="Share your creations and engage with the community"
              />
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-lg">
          <motion.div 
            className="container mx-auto px-4 text-center"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.h2 
              variants={fadeIn}
              className="text-4xl md:text-5xl font-bold text-white mb-6"
            >
              Ready to Join the Fun?
            </motion.h2>
            <motion.p 
              variants={fadeIn}
              className="text-xl text-white/90 mb-8 max-w-2xl mx-auto"
            >
              Start creating and sharing memes with a community that gets you.
            </motion.p>
            <motion.div variants={fadeIn}>
              <Button asChild size="lg" className="bg-white text-purple-600 hover:bg-white/90 h-14 px-8 rounded-full">
                <Link href="/signup" className="inline-flex items-center text-lg">
                  Get Started Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="bg-black/20 backdrop-blur-lg text-white py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <Image src="/logo.svg" alt="MemeMates Logo" width={32} height={32} className="rounded-lg" />
                  <span className="text-xl font-bold">MemeMates</span>
                </div>
                <p className="text-white/60">Making connections through creativity.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Features</h3>
                <ul className="space-y-3">
                  <li><Link href="#" className="text-white/60 hover:text-white transition-colors">Meme Generator</Link></li>
                  <li><Link href="#" className="text-white/60 hover:text-white transition-colors">Music Integration</Link></li>
                  <li><Link href="#" className="text-white/60 hover:text-white transition-colors">Mood Boards</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Company</h3>
                <ul className="space-y-3">
                  <li><Link href="#" className="text-white/60 hover:text-white transition-colors">About Us</Link></li>
                  <li><Link href="#" className="text-white/60 hover:text-white transition-colors">Privacy Policy</Link></li>
                  <li><Link href="#" className="text-white/60 hover:text-white transition-colors">Terms of Service</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Connect</h3>
                <ul className="space-y-3">
                  <li><Link href="#" className="text-white/60 hover:text-white transition-colors">Twitter</Link></li>
                  <li><Link href="#" className="text-white/60 hover:text-white transition-colors">Instagram</Link></li>
                  <li><Link href="#" className="text-white/60 hover:text-white transition-colors">Discord</Link></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-white/10 mt-12 pt-8 text-center text-white/60">
              <p>&copy; {new Date().getFullYear()} MemeMates. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </MainLayout>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <motion.div 
      variants={fadeIn}
      className="p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors"
    >
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2 text-white">{title}</h3>
      <p className="text-white/70">{description}</p>
    </motion.div>
  );
}

function StepCard({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <motion.div 
      variants={fadeIn}
      className="p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 text-center relative"
    >
      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
        {number}
      </div>
      <h3 className="text-xl font-semibold mb-2 text-white">{title}</h3>
      <p className="text-white/70">{description}</p>
    </motion.div>
  );
}

function StatCard({ number, label }: { number: string; label: string }) {
  return (
    <div className="text-center">
      <p className="text-3xl font-bold text-white mb-1">{number}</p>
      <p className="text-white/70">{label}</p>
    </div>
  );
}
