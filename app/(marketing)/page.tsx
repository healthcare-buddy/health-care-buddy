"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Brain,
  Calendar,
  Pill,
  BarChart3,
  ChevronDown,
  ChevronUp,
  Stethoscope,
  FileText,
  Clock,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

const faqs = [
  {
    question: "How do I use the app?",
    answer:
      "Simply upload your discharge summary. Our AI will analyze it and generate a personalized recovery plan. You can then track your medications, appointments, and progress within the app.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Yes, we use enterprise-grade encryption and comply with HIPAA regulations to ensure your medical data is completely secure and private.",
  },
  {
    question: "Can I connect with my healthcare provider?",
    answer:
      "Healthcare Buddy seamlessly integrates with existing healthcare systems and Electronic Medical Records (EMRs) to streamline data exchange and improve care coordination.",
  },
];

function AccordionItem({
  faq,
  isOpen,
  onToggle,
}: {
  faq: (typeof faqs)[0];
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <Card className="border border-gray-200 dark:border-gray-700 overflow-hidden">
      <CardContent className="p-0">
        <button
          onClick={onToggle}
          className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200"
        >
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
            {faq.question}
          </h3>
          {isOpen ? (
            <ChevronUp className="h-5 w-5 text-gray-500 transition-transform duration-200" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-500 transition-transform duration-200" />
          )}
        </button>
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-6 pb-6">
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {faq.answer}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function HomePage() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [isAutheticated, setisAutheticated] = useState(false);

  useEffect(() => {
    authClient.getSession().then((session) => {
      setisAutheticated(!!session.data?.session);
    });
  });

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };
  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="relative py-8 lg:py-16 min-h-[90vh] space-y-16 overflow-hidden">
        {/* Animated Blurred Gradient Background */}
        <div className="absolute inset-0 -z-10">
          <motion.div
            className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-blue-400 to-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-30"
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
          <motion.div
            className="absolute top-40 right-20 w-80 h-80 bg-gradient-to-r from-teal-400 to-blue-600 rounded-full mix-blend-multiply filter blur-xl opacity-30"
            animate={{
              x: [0, -120, 0],
              y: [0, 100, 0],
              scale: [1, 0.8, 1],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
          <motion.div
            className="absolute bottom-20 left-40 w-60 h-60 bg-gradient-to-r from-purple-400 to-pink-600 rounded-full mix-blend-multiply filter blur-xl opacity-30"
            animate={{
              x: [0, 80, 0],
              y: [0, -80, 0],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        </div>

        <motion.div
          className="text-center space-y-8 max-w-4xl mx-auto relative z-10"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Hero Badge */}
          <motion.div
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-200/50 dark:border-blue-500/30 rounded-full text-sm font-medium text-blue-700 dark:text-blue-300 backdrop-blur-sm"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <motion.span
              className="w-2 h-2 bg-green-500 rounded-full mr-2"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
            Introducing Support For AI Models
          </motion.div>

          {/* Main Heading */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <motion.h1
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 dark:text-white leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Modern Solutions for{" "}
              <motion.span
                className="block text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                Patient Engagement
              </motion.span>
            </motion.h1>

            <motion.p
              className="text-lg lg:text-xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
            >
              Highly customizable components for building modern healthcare
              applications that look and feel the way you mean it.
            </motion.p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                asChild
                className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 px-8 py-4 text-lg font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
              >
                <Link href={isAutheticated ? "/dashboard" : "/sign-up"}>
                  {isAutheticated ? "Go to Dashboard" : "Start Building"}
                </Link>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="px-8 py-4 text-lg font-medium rounded-lg transition-all duration-200"
              >
                <Link href="/ai-assistant">Ai Assistant</Link>
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Dashboard Preview */}
        <motion.div
          className="relative max-w-6xl mx-auto"
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, delay: 1.4 }}
        >
          {/* Background decorative elements */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-teal-600/5 rounded-3xl blur-3xl"></div>

          <motion.div
            className="absolute -top-4 -left-4 w-8 h-8 bg-blue-500/20 rounded-full"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
          <motion.div
            className="absolute -top-2 -right-6 w-6 h-6 bg-purple-500/20 rounded-full"
            animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.7, 0.3] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatType: "reverse",
              delay: 1,
            }}
          />
          <motion.div
            className="absolute -bottom-4 -left-2 w-5 h-5 bg-teal-500/20 rounded-full"
            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{
              duration: 5,
              repeat: Infinity,
              repeatType: "reverse",
              delay: 2,
            }}
          />

          {/* Dashboard Image Container */}
          <motion.div
            className="relative bg-gray-900 dark:bg-gray-800 rounded-2xl lg:rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden backdrop-blur-sm"
            whileHover={{ scale: 1.02, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {/* Browser Header */}
            <motion.div
              className="flex items-center justify-between px-4 py-3 bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.6 }}
            >
              <div className="flex items-center space-x-2">
                <motion.div
                  className="w-3 h-3 bg-red-500 rounded-full"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.div
                  className="w-3 h-3 bg-yellow-500 rounded-full"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                />
                <motion.div
                  className="w-3 h-3 bg-green-500 rounded-full"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
                />
              </div>
              <motion.div
                className="flex-1 max-w-md mx-4"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 1.8 }}
              >
                <div className="bg-white dark:bg-gray-600 rounded-md px-3 py-1 text-sm text-gray-600 dark:text-gray-300 text-center">
                  healthcare-buddy.vercel.app
                </div>
              </motion.div>
              <div className="w-16"></div>
            </motion.div>

            {/* Dashboard Content */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 2.0 }}
            >
              <motion.div
                className="relative z-10"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src="/dashboard.png"
                  alt="Healthcare Buddy Dashboard"
                  width={1200}
                  height={800}
                  className="w-full h-auto object-cover"
                  priority
                />
              </motion.div>

              {/* Animated overlay gradient */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-gray-900/20 via-transparent to-transparent"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.0, delay: 2.2 }}
              />

              {/* Subtle animated glow effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-teal-500/10 rounded-lg"
                animate={{
                  opacity: [0, 0.3, 0],
                  scale: [0.98, 1.02, 0.98],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Enhanced Feature highlights */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.4 }}
        >
          <motion.div
            className="flex items-center justify-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800 backdrop-blur-sm"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 2.6 }}
            whileHover={{ scale: 1.05, y: -5 }}
          >
            <motion.div
              className="w-2 h-2 bg-green-500 rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
            <span className="text-sm font-medium text-green-700 dark:text-green-300">
              AI-Powered Analysis
            </span>
          </motion.div>

          <motion.div
            className="flex items-center justify-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 backdrop-blur-sm"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 2.8 }}
            whileHover={{ scale: 1.05, y: -5 }}
          >
            <motion.div
              className="w-2 h-2 bg-blue-500 rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
                delay: 0.5,
              }}
            />
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
              Personalized Care Plans
            </span>
          </motion.div>

          <motion.div
            className="flex items-center justify-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800 backdrop-blur-sm"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 3.0 }}
            whileHover={{ scale: 1.05, y: -5 }}
          >
            <motion.div
              className="w-2 h-2 bg-purple-500 rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
                delay: 1,
              }}
            />
            <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
              24/7 Support
            </span>
          </motion.div>
        </motion.div>
      </section>

      {/* Key Features Section */}
      <motion.section
        className="space-y-12"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className="text-center space-y-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.h2
            className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Key Features
          </motion.h2>
          <motion.p
            className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Healthcare Buddy offers a comprehensive suite of tools to support
            your recovery journey.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Button variant="outline" className="mt-6" asChild>
              <Link href={"/dashboard"}>Explore All Features</Link>
            </Button>
          </motion.div>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: Brain,
              title: "AI Analysis",
              description:
                "Our AI analyzes your discharge summary to provide personalized recommendations.",
              color: "blue",
              delay: 0.1,
            },
            {
              icon: Calendar,
              title: "Follow-up Planning",
              description:
                "Generate & organize follow-up plans with reminders and guidance for a smooth recovery.",
              color: "green",
              delay: 0.2,
            },
            {
              icon: Pill,
              title: "Medication Tracking",
              description:
                "Keep track your medications, dosages, and schedules to ensure adherence.",
              color: "purple",
              delay: 0.3,
            },
            {
              icon: BarChart3,
              title: "Progress Monitoring",
              description:
                "Monitor your progress over time with detailed reports and analytics.",
              color: "orange",
              delay: 0.4,
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="text-center space-y-4"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: feature.delay }}
              whileHover={{ scale: 1.05, y: -10 }}
            >
              <motion.div
                className={`w-16 h-16 mx-auto bg-${feature.color}-100 dark:bg-${feature.color}-900/30 rounded-2xl flex items-center justify-center`}
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <feature.icon className={`h-8 w-8 text-${feature.color}-600`} />
              </motion.div>
              <motion.h3
                className="text-xl font-semibold"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: feature.delay + 0.1 }}
              >
                {feature.title}
              </motion.h3>
              <motion.p
                className="text-gray-600 dark:text-gray-300 text-sm"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: feature.delay + 0.2 }}
              >
                {feature.description}
              </motion.p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* The Science Behind Our AI */}
      <motion.section
        className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-8 lg:p-12 space-y-6"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <motion.h2
          className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          The Science Behind Our AI
        </motion.h2>
        <motion.p
          className="text-lg text-gray-600 dark:text-gray-300 max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Our AI algorithms are based on cutting-edge research in medical
          informatics and machine learning. We utilize natural language
          processing (NLP) to analyze discharge summaries and predict individual
          patient outcomes. Our models are trained on a large dataset of patient
          outcomes to ensure accuracy and effectiveness.{" "}
        </motion.p>
      </motion.section>

      {/* Integration Section */}
      <motion.section
        className="space-y-8"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className="text-center space-y-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.h2
            className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Integration with Healthcare Systems
          </motion.h2>
          <motion.p
            className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Healthcare Buddy seamlessly integrates with existing healthcare
            systems and Electronic Medical Records (EMRs) to streamline data
            exchange and improve care coordination. Our platform supports secure
            data transfer and adheres to industry standards for patient privacy
            and data security.
          </motion.p>
        </motion.div>
      </motion.section>

      {/* FAQ Section */}
      <motion.section
        className="space-y-8"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className="text-center space-y-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.h2
            className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Frequently Asked Questions
          </motion.h2>
        </motion.div>

        <motion.div
          className="space-y-4 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
            >
              <AccordionItem
                faq={faq}
                isOpen={openFAQ === index}
                onToggle={() => toggleFAQ(index)}
              />
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Trusted by Healthcare Professionals */}
      <motion.section
        className="space-y-8"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className="text-center space-y-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.h2
            className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Trusted by Healthcare Professionals
          </motion.h2>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-3">
          {[
            {
              icon: Stethoscope,
              title: "Medical Professionals",
              description: "Trusted by doctors and nurses worldwide",
              color: "teal",
              delay: 0.1,
            },
            {
              icon: FileText,
              title: "Clinical Evidence",
              description: "Backed by peer-reviewed research",
              color: "blue",
              delay: 0.2,
            },
            {
              icon: Clock,
              title: "24/7 Support",
              description: "Round-the-clock healthcare assistance",
              color: "green",
              delay: 0.3,
            },
          ].map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: card.delay }}
              whileHover={{ scale: 1.05, y: -10 }}
            >
              <Card className="bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700 h-full">
                <CardContent className="p-8 text-center">
                  <motion.div
                    className={`w-16 h-16 mx-auto bg-${card.color}-100 dark:bg-${card.color}-900/30 rounded-2xl flex items-center justify-center mb-4`}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <card.icon className={`h-8 w-8 text-${card.color}-600`} />
                  </motion.div>
                  <motion.h3
                    className="font-semibold text-lg mb-2"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: card.delay + 0.1 }}
                  >
                    {card.title}
                  </motion.h3>
                  <motion.p
                    className="text-gray-600 dark:text-gray-300 text-sm"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: card.delay + 0.2 }}
                  >
                    {card.description}
                  </motion.p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Final CTA */}
      <motion.section
        className="text-center space-y-6 py-16 bg-gradient-to-r from-blue-50 to-teal-50 dark:from-blue-900/20 dark:to-teal-900/20 rounded-2xl"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <motion.h2
          className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Ready to Take Control of Your Recovery?
        </motion.h2>
        <motion.p
          className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Join thousands of patients and healthcare providers using Healthcare
          Buddy for better outcomes.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          whileHover={{ scale: 1.05 }}
        >
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
            <Link href="/sign-up">Get Started</Link>
          </Button>
        </motion.div>
      </motion.section>
    </div>
  );
}
