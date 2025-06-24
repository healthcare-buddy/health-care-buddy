import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Heart,
  Brain,
  Calendar,
  Pill,
  MessageSquare,
  BarChart3,
  Shield,
  Globe,
} from "lucide-react";
import TiltedCard from "@/components/ui/tilted-card";

export default function HomePage() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-6 py-12">
        <div className="flex justify-center mb-6">
          <Heart className="h-16 w-16 text-primary" />
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          Healthcare Buddy
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
          Your Smart Recovery Partner - AI-Powered Discharge & Follow-Up Care
          Planner
        </p>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Automate discharge planning, generate personalized follow-up
          schedules, and ensure better patient outcomes with our intelligent
          healthcare assistant.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Button size="lg" asChild>
            <Link href="/sign-up">Get Started</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/sign-in">Sign In</Link>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold">Key Features</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive healthcare management powered by AI and designed for
            better patient outcomes
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <TiltedCard
            icon={<Brain className="h-8 w-8" />}
            title="AI Discharge Summary Parser"
            description="Uses NLP to extract key data from discharge documents and summarize medical terms in simple language"
            containerHeight="180px"
            rotateAmplitude={10}
            scaleOnHover={1.05}
            showMobileWarning={false}
            showTooltip={false}
          />

          <TiltedCard
            icon={<Calendar className="h-8 w-8" />}
            title="Personalized Follow-Up Plans"
            description="Auto-generates customized follow-up schedules aligned with clinical guidelines (ICMR, WHO)"
            containerHeight="180px"
            rotateAmplitude={10}
            scaleOnHover={1.05}
            showMobileWarning={false}
            showTooltip={false}
          />

          <TiltedCard
            icon={<Pill className="h-8 w-8" />}
            title="Medication Reminders"
            description="Daily reminders with dosage, timing, and side-effect warnings in your preferred language"
            containerHeight="180px"
            rotateAmplitude={10}
            scaleOnHover={1.05}
            showMobileWarning={false}
            showTooltip={false}
          />

          <TiltedCard
            icon={<MessageSquare className="h-8 w-8" />}
            title="Multilingual Voice Assistant"
            description="AI nurse explains follow-up plans verbally in Hindi, English, or Gujarati"
            containerHeight="180px"
            rotateAmplitude={10}
            scaleOnHover={1.05}
            showMobileWarning={false}
            showTooltip={false}
          />

          <TiltedCard
            icon={<BarChart3 className="h-8 w-8" />}
            title="Progress Tracking"
            description="Comprehensive dashboard to monitor appointments, medications, and recovery progress"
            containerHeight="180px"
            rotateAmplitude={10}
            scaleOnHover={1.05}
            showMobileWarning={false}
            showTooltip={false}
          />

          <TiltedCard
            icon={<Shield className="h-8 w-8" />}
            title="Automated Scheduling"
            description="Seamless appointment booking with hospital calendars and SMS/email confirmations"
            containerHeight="180px"
            rotateAmplitude={10}
            scaleOnHover={1.05}
            showMobileWarning={false}
            showTooltip={false}
          />
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-muted/50 rounded-lg p-8 space-y-6">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold">Expected Outcomes</h2>
          <p className="text-lg text-muted-foreground">
            Transforming healthcare delivery with measurable results
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="text-center space-y-2">
            <div className="text-3xl font-bold text-primary">↓ 30%</div>
            <p className="text-sm text-muted-foreground">
              Reduced Readmissions
            </p>
          </div>
          <div className="text-center space-y-2">
            <div className="text-3xl font-bold text-primary">↑ 85%</div>
            <p className="text-sm text-muted-foreground">
              Patient Understanding
            </p>
          </div>
          <div className="text-center space-y-2">
            <div className="text-3xl font-bold text-primary">↑ 70%</div>
            <p className="text-sm text-muted-foreground">Treatment Adherence</p>
          </div>
          <div className="text-center space-y-2">
            <div className="text-3xl font-bold text-primary">↓ 50%</div>
            <p className="text-sm text-muted-foreground">Staff Time Saved</p>
          </div>
        </div>
      </section>

      {/* Language Support */}
      <section className="text-center space-y-6">
        <div className="flex justify-center">
          <Globe className="h-12 w-12 text-primary" />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold">Multilingual Support</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Available in English, Hindi, and Gujarati to serve diverse patient
          populations
        </p>
        <div className="flex justify-center gap-8 text-2xl">
          <span>🇺🇸 English</span>
          <span>🇮🇳 हिंदी</span>
          <span>🇮🇳 ગુજરાતી</span>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center space-y-6 py-12 bg-primary/5 rounded-lg">
        <h2 className="text-3xl md:text-4xl font-bold">
          Ready to Transform Your Healthcare Experience?
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Join thousands of patients and healthcare providers using Healthcare
          Buddy for better outcomes
        </p>
        <Button size="lg" asChild>
          <Link href="/sign-up">Start Your Journey</Link>
        </Button>
      </section>
    </div>
  );
}
