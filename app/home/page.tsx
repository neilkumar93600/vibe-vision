// app/page.tsx
"use client"

import React from "react"
import { cn } from "../../lib/utils";
import Marquee from "../../components/animata/container/marquee";
import FlickeringGrid from "../../components/ui/flickering-grid";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { GoogleGeminiEffect } from "../../components/ui/google-gemini-effect";
import {
  Users,
  CheckCircle2,
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
]

const GoogleGeminiEffectDemo = () => {
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const pathLengthFirst = useTransform(scrollYProgress, [0, 0.8], [0.2, 1.2]);
  const pathLengthSecond = useTransform(scrollYProgress, [0, 0.8], [0.15, 1.2]);
  const pathLengthThird = useTransform(scrollYProgress, [0, 0.8], [0.1, 1.2]);
  const pathLengthFourth = useTransform(scrollYProgress, [0, 0.8], [0.05, 1.2]);
  const pathLengthFifth = useTransform(scrollYProgress, [0, 0.8], [0, 1.2]);

  return (
    <div
      className="h-[400vh] bg-black w-full dark:border dark:border-white/[0.1] rounded-md relative pt-40 overflow-clip"
      ref={ref}
    >
      <GoogleGeminiEffect
        pathLengths={[
          pathLengthFirst,
          pathLengthSecond,
          pathLengthThird,
          pathLengthFourth,
          pathLengthFifth,
        ]}
      />
    </div>
  );
}

const ENTERTAINMENT_ITEMS = [
  {
    title: "Music Creation",
    icon: Music,
    gradient: "from-purple-500 to-indigo-600"
  },
  {
    title: "Voice Generation",
    icon: Mic,
    gradient: "from-pink-500 to-rose-600"
  },
  {
    title: "Video Content",
    icon: Video,
    gradient: "from-blue-500 to-cyan-600"
  },
  {
    title: "Audio Effects",
    icon: Headphones,
    gradient: "from-green-500 to-emerald-600"
  },
  {
    title: "Live Streaming",
    icon: Radio,
    gradient: "from-orange-500 to-red-600"
  },
  // Second row
  {
    title: "Comedy Writing",
    icon: MessageSquare,
    gradient: "from-violet-500 to-purple-600"
  },
  {
    title: "Visual Effects",
    icon: Palette,
    gradient: "from-fuchsia-500 to-pink-600"
  },
  {
    title: "Sound Design",
    icon: Speaker,
    gradient: "from-cyan-500 to-blue-600"
  },
  {
    title: "Content Library",
    icon: Library,
    gradient: "from-teal-500 to-green-600"
  },
  {
    title: "Live Shows",
    icon: PartyPopper,
    gradient: "from-red-500 to-orange-600"
  }
];

const EntertainmentHero = () => {
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const springConfig = { stiffness: 300, damping: 30, bounce: 100 };

  const translateX = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 1000]),
    springConfig
  );
  const translateXReverse = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -1000]),
    springConfig
  );
  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [0.2, 1]),
    springConfig
  );
  const rotateZ = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [20, 0]),
    springConfig
  );
  const translateY = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [-700, 300]),
    springConfig
  );

  const firstRow = ENTERTAINMENT_ITEMS.slice(0, 5);
  const secondRow = ENTERTAINMENT_ITEMS.slice(5, 10);

  return (
    <div
      ref={ref}
      className="h-[200vh] py-20 overflow-hidden antialiased relative flex flex-col self-auto [perspective:1000px] [transform-style:preserve-3d]"
    >
      <div className="max-w-7xl relative mx-auto py-20 px-4 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center text-center"
        >
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple via-black to-purple bg-clip-text">
            Create. Perform. Entertain.
          </h1>
          <p className="max-w-2xl text-base md:text-xl mt-8 text-muted-foreground">
            Transform your ideas into music and comedy with our AI-powered platform.
            Create custom songs, generate comedy content, and share your creativity.
          </p>
        </motion.div>
      </div>

      <motion.div
        style={{
          rotateZ,
          translateY,
          opacity,
        }}
        className="relative"
      >
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-20 mb-20">
          {firstRow.map((item) => (
            <ContentCard
              key={item.title}
              item={item}
              translate={translateX}
            />
          ))}
        </motion.div>
        <motion.div className="flex flex-row mb-20 space-x-20">
          {secondRow.map((item) => (
            <ContentCard
              key={item.title}
              item={item}
              translate={translateXReverse}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

const ContentCard = ({ item, translate }: any) => {
  const Icon = item.icon;

  return (
    <motion.div
      style={{
        x: translate,
      }}
      whileHover={{
        y: -20,
        scale: 1.05,
      }}
      className="group relative h-64 w-64 flex-shrink-0"
    >
      <div className={`h-full w-full rounded-xl bg-gradient-to-br ${item.gradient} p-8 
                      flex flex-col items-center justify-center gap-4
                      transition-all duration-300 shadow-lg
                      group-hover:shadow-2xl`}>
        <div className="p-4 bg-white/10 rounded-full">
          <Icon className="h-12 w-12 text-white" />
        </div>
        <h2 className="text-white text-xl font-semibold text-center">
          {item.title}
        </h2>
      </div>
    </motion.div>
  );
};

export default function HomePage() {

  return (
    <Layout>
      {/* Hero Section */}
      <EntertainmentHero />

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
        {/* Adjusted FlickeringGrid with fixed dimensions */}
        <FlickeringGrid
          className="z-0 absolute top-0 mx-auto inset-0 w-full h-full"
          squareSize={4}
          gridGap={6}
          color="#672F83"
          maxOpacity={0.5}
          flickerChance={0.1}
          // Use larger height to accommodate stacked cards on mobile
          height={2500}
          // Use a fixed width that works across breakpoints
          width={1800}
        />

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
      {/* GoogleGeminiEffect */}
      <GoogleGeminiEffectDemo />

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
