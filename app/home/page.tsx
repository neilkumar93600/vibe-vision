// app/page.tsx
"use client"

import React from "react"
import { cn } from "../../lib/utils";
import Marquee from "../../components/animata/container/marquee";
import FlickeringGrid from "../../components/ui/flickering-grid";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import {
  Users,
  CheckCircle2,
  ArrowRight,
  Calendar,
  Music2,
  Star,
  Award,
  Zap,
  Download,
  Globe,
  Rocket,
  Wand2,
  Clock,
  Gift,
  Sparkles,
  Music,
  Mic,
  Video,
  Headphones,
  Radio,
  MessageSquare,
  Palette,
  Speaker,
  Library,
  PartyPopper,
} from "lucide-react"

import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Layout } from "../../components/layout/layout"
import { Separator } from "../../components/ui/separator"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../components/ui/accordion"
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { HeroHighlight, Highlight } from "@/components/ui/hero-highlight";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect"

const words = `Transform your creative vision into reality with AI-powered music and comedy production.`;
const advancedPricingPlans = [
  {
    name: "Starter",
    price: "0",
    billingType: "Forever Free",
    features: [
      "5 AI generations per month",
      "Basic content types",
      "Community support",
      "Watermarked outputs"
    ],
    limitations: [
      "Limited content complexity",
      "Standard generation speed",
      "No commercial use"
    ],
    recommended: false,
    icon: <Rocket className="h-6 w-6 text-blue-500" />
  },
  {
    name: "Creator Pro",
    price: "29",
    billingType: "Monthly",
    features: [
      "Unlimited AI generations",
      "Advanced content types",
      "Priority support",
      "No watermarks",
      "Commercial rights",
      "Custom branding"
    ],
    limitations: [
      "Individual use only",
      "Faster generation times"
    ],
    recommended: true,
    icon: <Wand2 className="h-6 w-6 text-purple-500" />
  },
  {
    name: "Enterprise",
    price: "99",
    billingType: "Monthly",
    features: [
      "All Creator Pro features",
      "Team collaboration",
      "Dedicated support",
      "API access",
      "Custom AI models",
      "Advanced analytics"
    ],
    limitations: [
      "Requires annual commitment",
      "Customization consultation"
    ],
    recommended: false,
    icon: <Globe className="h-6 w-6 text-green-500" />
  }
]

const faqs = [
  {
    question: "How does the AI content generation work?",
    answer: "Our AI-powered platform uses advanced machine learning algorithms to analyze your input and generate unique, high-quality content tailored to your needs. Whether it's music or comedy, the AI understands context and style to create engaging content.",
  },
  {
    question: "What type of content can I create?",
    answer: "You can create various types of content including music tracks, comedy scripts, short videos, and live show materials. Our platform supports multiple formats and styles to suit your creative needs.",
  },
  {
    question: "How do I get started?",
    answer: "Simply sign up for a free account, choose your content type, and start creating! Our intuitive interface guides you through the process, and our AI assists you at every step.",
  },
  {
    question: "Can I collaborate with other creators?",
    answer: "Yes! Our platform includes collaboration features that allow you to work with other creators, share projects, and create content together in real-time.",
  },
]

const testimonials = [
  {
    name: "Alex Thompson",
    role: "Professional Musician",
    content: "This platform has revolutionized my creative process. The AI-powered tools are incredible!",
    image: "/api/placeholder/64/64",
    rating: 5,
  },
  {
    name: "Maria Garcia",
    role: "Comedy Writer",
    content: "The comedy generation features are surprisingly good. It's like having a writing partner available 24/7.",
    image: "/api/placeholder/64/64",
    rating: 5,
  },
  {
    name: "David Chen",
    role: "Content Creator",
    content: "From ideation to execution, this platform has everything I need to create engaging content.",
    image: "/api/placeholder/64/64",
    rating: 4,
  },
]// Animated particle component for the background
const Particle = ({ className }:any) => {
  const randomDelay = Math.random() * 5;
  return (
    <motion.div
      className={`absolute w-1 h-1 rounded-full bg-primary/20 ${className}`}
      animate={{
        y: [-20, 20],
        opacity: [0.2, 0.5, 0.2],
        scale: [1, 1.5, 1],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        delay: randomDelay,
      }}
    />
  );
};

// Floating element component for hero section
const FloatingElement = ({ children, delay = 0 }:any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{
      duration: 0.8,
      delay,
      type: "spring",
      stiffness: 100,
    }}
  >
    {children}
  </motion.div>
);

// Enhanced Hero Section
const HeroSection = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 300], [0, 50]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  
  // Generate particles
  const particles = Array.from({ length: 50 }).map((_, i) => (
    <Particle 
      key={i} 
      className={`left-[${Math.random() * 100}%] top-[${Math.random() * 100}%]`}
    />
  ));

  return (
    <BackgroundBeamsWithCollision>
    <section className="min-h-screen relative overflow-hidden flex items-center justify-center py-20 px-8">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        {particles}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/50 to-background" />
      </div>

      {/* Main content */}
      <motion.div
        style={{ y, opacity }}
        className="relative max-w-screen-xl mx-auto text-center z-10"
      >
        <FloatingElement delay={0.2}>
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight">
            <span className="inline-block bg-gradient-to-r from-primary via-purple-500 to-blue-500 bg-clip-text text-transparent animate-gradient">
              Driving growth
            </span>
            <br />
            <span className="inline-block bg-gradient-to-r from-blue-500 via-purple-500 to-primary bg-clip-text text-transparent animate-gradient">
              with AI
            </span>
          </h1>
        </FloatingElement>

        <FloatingElement delay={0.4}>
          <p className="mt-8 text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            We turn businesses into industry leaders with AI-driven solutions
          </p>
        </FloatingElement>

        <FloatingElement delay={0.6}>
          <div className="mt-10 flex gap-4 justify-center">
            <Button
              size="lg"
              className="text-lg px-8 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 transition-all duration-300"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 border-2 hover:bg-primary/5 transition-all duration-300"
            >
              Learn More
            </Button>
          </div>
        </FloatingElement>
      </motion.div>
    </section>
    </BackgroundBeamsWithCollision>
  );
};

export default function HomePage() {

  return (
    <Layout>
      {/* Hero Section */}
      <HeroHighlight>
      <motion.h1
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: [20, -5, 0],
        }}
        transition={{
          duration: 0.5,
          ease: [0.4, 0.0, 0.2, 1],
        }}
        className="text-2xl px-4 md:text-4xl lg:text-5xl font-bold text-neutral-700 dark:text-white max-w-4xl leading-relaxed lg:leading-snug text-center mx-auto "
      >
        
        <Highlight className="text-black dark:text-white">
        Create.
Perform.
Entertain.
        </Highlight>
        <TextGenerateEffect words={words} />
      </motion.h1>
    </HeroHighlight>

      {/* Stats Section */}
      <section className="py-16 px-8 bg-muted/50">
        <div className="max-w-screen-xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Users, label: "Active Users", value: "50K+" },
            { icon: Calendar, label: "Daily Visits", value: "100K+" },
            { icon: Video, label: "Videos Created", value: "1M+" },
            { icon: Music2, label: "Songs Generated", value: "2M+" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-full">
                      <stat.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-8">
        <div className="max-w-screen-xl mx-auto relative">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Powerful Features</h2>
            <p className="mt-4 text-xl text-muted-foreground">
              Everything you need to create amazing content
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: "AI-Powered Creation",
                description: "Generate unique content with advanced AI algorithms",
              },
              {
                icon: Users,
                title: "Collaboration Tools",
                description: "Work together with creators worldwide",
              },
              {
                icon: Award,
                title: "Professional Quality",
                description: "Industry-standard output for all your content",
              },
              {
                icon: Clock,
                title: "Real-time Generation",
                description: "Get instant results as you create",
              },
              {
                icon: Download,
                title: "Easy Export",
                description: "Download your content in multiple formats",
              },
              {
                icon: MessageSquare,
                title: "Community Feedback",
                description: "Get insights from other creators",
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardHeader>
                    <div className="p-3 bg-primary/10 rounded-full w-fit">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="mt-4">{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-8 sm:py-12 lg:py-16 px-4 sm:px-6 bg-muted/20 relative">
        <div className="max-w-[320px] sm:max-w-2xl lg:max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">
            Flexible Pricing for Every Creator
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {advancedPricingPlans.map(plan => (
              <Card
                key={plan.name}
                className={`relative h-full ${plan.recommended ? 'border-primary' : ''}`}
              >
                {plan.recommended && (
                  <Badge className="absolute top-2 right-2 bg-primary">
                    Most Popular
                  </Badge>
                )}

                <CardHeader className="space-y-4">
                  <div className="flex items-center gap-4">
                    {plan.icon}
                    <div>
                      <CardTitle className="text-lg sm:text-xl">{plan.name}</CardTitle>
                      <CardDescription>{plan.billingType}</CardDescription>
                    </div>
                  </div>

                  <div className="text-3xl sm:text-4xl font-bold">
                    ${plan.price}
                    <span className="text-xs sm:text-sm font-normal text-muted-foreground">
                      /month
                    </span>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-2 mb-4">
                    <h4 className="font-semibold">Features:</h4>
                    {plan.features.map(feature => (
                      <div
                        key={feature}
                        className="flex items-center gap-2 text-xs sm:text-sm"
                      >
                        <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
                        {feature}
                      </div>
                    ))}
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-2">
                    <h4 className="font-semibold text-xs sm:text-sm text-muted-foreground">
                      Limitations:
                    </h4>
                    {plan.limitations.map(limitation => (
                      <div
                        key={limitation}
                        className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground"
                      >
                        <Star className="h-2.5 w-2.5 sm:h-3 sm:w-3 opacity-50" />
                        {limitation}
                      </div>
                    ))}
                  </div>
                </CardContent>

                <CardFooter>
                  <Button
                    variant={plan.recommended ? 'default' : 'outline'}
                    className="w-full text-sm sm:text-base"
                  >
                    Choose {plan.name}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-8 bg-muted/50">
        <div className="max-w-screen-xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">What Creators Say</h2>
            <p className="mt-4 text-xl text-muted-foreground">
              Hear from our community of creators
            </p>
          </div>
          <div className="relative flex h-[500px] w-full flex-col items-center justify-center gap-6 overflow-hidden rounded-lg border bg-background md:shadow-xl">
            <Marquee pauseOnHover className="[--duration:40s]">
              {testimonials.map((review) => (
                <figure
                  key={review.name}
                  className={cn(
                    "relative w-64 shrink-0 cursor-pointer overflow-hidden rounded-xl border p-4 mx-4",
                    "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
                    "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]"
                  )}
                >
                  <div className="flex flex-row items-center gap-2">
                    <img
                      className="rounded-full"
                      width="32"
                      height="32"
                      alt={review.name}
                      src={review.image}
                    />
                    <div className="flex flex-col">
                      <figcaption className="text-sm font-medium dark:text-white">
                        {review.name}
                      </figcaption>
                      <p className="text-xs font-medium dark:text-white/40">{review.role}</p>
                    </div>
                  </div>
                  <blockquote className="mt-2 text-sm">{review.content}</blockquote>
                  <div className="flex mt-2">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                </figure>
              ))}
            </Marquee>
            <Marquee reverse pauseOnHover className="[--duration:40s]">
              {testimonials.map((review) => (
                <figure
                  key={review.name}
                  className={cn(
                    "relative w-64 shrink-0 cursor-pointer overflow-hidden rounded-xl border p-4 mx-4",
                    "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
                    "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]"
                  )}
                >
                  <div className="flex flex-row items-center gap-2">
                    <img
                      className="rounded-full"
                      width="32"
                      height="32"
                      alt={review.name}
                      src={review.image}
                    />
                    <div className="flex flex-col">
                      <figcaption className="text-sm font-medium dark:text-white">
                        {review.name}
                      </figcaption>
                      <p className="text-xs font-medium dark:text-white/40">{review.role}</p>
                    </div>
                  </div>
                  <blockquote className="mt-2 text-sm">{review.content}</blockquote>
                  <div className="flex mt-2">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                </figure>
              ))}
            </Marquee>
            <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-background"></div>
            <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-background"></div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-8">
        <div className="max-w-screen-xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
            <p className="mt-4 text-xl text-muted-foreground">
              Get answers to common questions about our platform
            </p>
          </div>
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible>
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 px-8 bg-primary/5">
        <div className="max-w-screen-xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold">Ready to Start Creating?</h2>
            <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto">
              Join our community of creators and start making amazing content today.
              No credit card required.
            </p>
            <div className="flex gap-4 justify-center mt-8">
              <Button size="lg" className="gap-2">
                <Sparkles className="h-4 w-4" />
                Get Started Free
              </Button>
              <Button size="lg" variant="outline" className="gap-2">
                <Gift className="h-4 w-4" />
                View Plans
              </Button>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Free trial available. No credit card required.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 px-8">
        <div className="max-w-screen-xl mx-auto">
          <Card className="bg-primary/5">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-bold">Stay Updated</h3>
                  <p className="mt-2 text-muted-foreground">
                    Get the latest updates, tips, and inspiration delivered to your inbox.
                  </p>
                </div>
                <div className="flex gap-4">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  <Button>Subscribe</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </Layout>
  )
}
