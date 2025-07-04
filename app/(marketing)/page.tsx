"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
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
  Heart,
  Activity,
  Shield,
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
      <section className="py-8 lg:py-16 min-h-[80vh] lg:min-h-[70vh] space-y-12">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Hero Image */}
          <div className="flex-1 flex justify-center lg:justify-start order-2 lg:order-1">
            <div className="bg-gradient-to-br from-teal-100 to-teal-200 dark:from-teal-900/30 dark:to-teal-800/30 w-72 h-72 lg:w-80 lg:h-80 xl:w-96 xl:h-96 rounded-3xl flex items-center justify-center p-6 shadow-lg">
              <div className="relative">
                {/* Main Heart Icon */}
                <Heart className="h-28 w-28 lg:h-32 lg:w-32 xl:h-36 xl:w-36 text-pink-500 fill-pink-500 drop-shadow-sm" />

                {/* Medical Cross */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-6 h-1.5 lg:w-8 lg:h-2 bg-white rounded-full shadow-sm"></div>
                  <div className="w-1.5 h-6 lg:w-2 lg:h-8 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow-sm"></div>
                </div>

                {/* Pulse/Activity Line */}
                <Activity className="absolute -top-3 -right-3 lg:-top-4 lg:-right-4 h-6 w-6 lg:h-8 lg:w-8 text-teal-600 drop-shadow-sm" />

                {/* Stethoscope Icon */}
                <Stethoscope className="absolute -bottom-1 -left-3 lg:-bottom-2 lg:-left-4 h-8 w-8 lg:h-10 lg:w-10 text-blue-600 drop-shadow-sm" />

                {/* Shield for Security */}
                <Shield className="absolute top-1 -right-1 lg:top-2 lg:-right-2 h-5 w-5 lg:h-6 lg:w-6 text-green-600 fill-green-100 drop-shadow-sm" />

                {/* Enhanced decorative elements */}
                <div className="absolute top-6 left-1 lg:top-8 lg:left-2 w-2.5 h-2.5 lg:w-3 lg:h-3 bg-teal-400 rounded-full opacity-80 animate-pulse"></div>
                <div
                  className="absolute bottom-6 right-1 lg:bottom-8 lg:right-2 w-3 h-3 lg:w-4 lg:h-4 bg-blue-400 rounded-full opacity-60 animate-pulse"
                  style={{ animationDelay: "1s" }}
                ></div>
                <div
                  className="absolute bottom-3 left-6 lg:bottom-4 lg:left-8 w-1.5 h-1.5 lg:w-2 lg:h-2 bg-pink-400 rounded-full animate-pulse"
                  style={{ animationDelay: "2s" }}
                ></div>

                {/* Additional floating elements */}
                <div
                  className="absolute -top-1 left-4 w-2 h-2 bg-yellow-400 rounded-full opacity-70 animate-bounce"
                  style={{ animationDelay: "0.5s" }}
                ></div>
                <div
                  className="absolute -bottom-1 right-6 w-2.5 h-2.5 bg-purple-400 rounded-full opacity-60 animate-bounce"
                  style={{ animationDelay: "1.5s" }}
                ></div>
              </div>
            </div>
          </div>

          {/* Hero Content */}
          <div className="flex-1 space-y-6 lg:space-y-8 text-center lg:text-left order-1 lg:order-2 max-w-2xl lg:max-w-none">
            <div className="space-y-4 lg:space-y-6">
              <div className="inline-flex items-center px-4 py-2 bg-blue-50 dark:bg-blue-900/30 rounded-full text-sm font-medium text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                ✨ Healthcare Buddy
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                Your Smart Recovery Partner
                <span className="block text-transparent bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text mt-2">
                  AI-Powered Discharge & Follow-Up Care Planner
                </span>
              </h1>
            </div>

            <p className="text-lg lg:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Healthcare Buddy is a Next.js application that helps patients
              manage their post-discharge recovery with AI-powered personalized
              follow-up plans, medication tracking, and AI-powered healthcare
              assistance with Gemini API.
            </p>

            {isAutheticated ? (
              <Button
                size="lg"
                asChild
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
                <Button
                  size="lg"
                  asChild
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                >
                  <Link href="/sign-up">Get Started</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="border-2 border-gray-300 dark:border-gray-600 px-8 py-4 text-lg font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 transform hover:scale-105"
                >
                  <Link href="/sign-in">Sign In</Link>
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Feature highlights - Now below hero content */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6 max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-green-700 dark:text-green-300">
              AI-Powered Analysis
            </span>
          </div>
          <div className="flex items-center justify-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div
              className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"
              style={{ animationDelay: "0.5s" }}
            ></div>
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
              Personalized Care Plans
            </span>
          </div>
          <div className="flex items-center justify-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
            <div
              className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"
              style={{ animationDelay: "1s" }}
            ></div>
            <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
              24/7 Support
            </span>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
            Key Features
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Healthcare Buddy offers a comprehensive suite of tools to support
            your recovery journey.
          </p>
          <Button variant="outline" className="mt-6" asChild>
            <Link href={"/dashboard"}>Explore All Features</Link>
          </Button>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center">
              <Brain className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold">AI Analysis</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Our AI analyzes your discharge summary to provide personalized
              recommendations.
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center">
              <Calendar className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold">Follow-up Planning</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Generate & organize follow-up plans with reminders and guidance
              for a smooth recovery.
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center">
              <Pill className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold">Medication Tracking</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Keep track your medications, dosages, and schedules to ensure
              adherence.
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-orange-100 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center">
              <BarChart3 className="h-8 w-8 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold">Progress Monitoring</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Monitor your progress over time with detailed reports and
              analytics.
            </p>
          </div>
        </div>
      </section>

      {/* The Science Behind Our AI */}
      <section className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-8 lg:p-12 space-y-6">
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white text-center">
          The Science Behind Our AI
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-4xl mx-auto text-center">
          Our AI algorithms are based on cutting-edge research in medical
          informatics and machine learning. We utilize natural language
          processing (NLP) to analyze discharge summaries and predict individual
          patient outcomes. Our models are trained on a large dataset of patient
          outcomes to ensure accuracy and effectiveness.{" "}
        </p>
      </section>

      {/* Integration Section */}
      <section className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
            Integration with Healthcare Systems
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Healthcare Buddy seamlessly integrates with existing healthcare
            systems and Electronic Medical Records (EMRs) to streamline data
            exchange and improve care coordination. Our platform supports secure
            data transfer and adheres to industry standards for patient privacy
            and data security.
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4 max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              faq={faq}
              isOpen={openFAQ === index}
              onToggle={() => toggleFAQ(index)}
            />
          ))}
        </div>
      </section>

      {/* Trusted by Healthcare Professionals */}
      <section className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
            Trusted by Healthcare Professionals
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <Card className="bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 mx-auto bg-teal-100 dark:bg-teal-900/30 rounded-2xl flex items-center justify-center mb-4">
                <Stethoscope className="h-8 w-8 text-teal-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">
                Medical Professionals
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Trusted by doctors and nurses worldwide
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 mx-auto bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mb-4">
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Clinical Evidence</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Backed by peer-reviewed research
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 mx-auto bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center mb-4">
                <Clock className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">24/7 Support</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Round-the-clock healthcare assistance
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Final CTA */}
      <section className="text-center space-y-6 py-16 bg-gradient-to-r from-blue-50 to-teal-50 dark:from-blue-900/20 dark:to-teal-900/20 rounded-2xl">
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
          Ready to Take Control of Your Recovery?
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Join thousands of patients and healthcare providers using Healthcare
          Buddy for better outcomes.
        </p>
        <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
          <Link href="/sign-up">Get Started</Link>
        </Button>
      </section>
    </div>
  );
}
