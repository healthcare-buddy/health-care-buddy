import { Card } from "@/components/ui/card";
import {
  CalendarCheck,
  Globe,
  Play,
  Signature,
  Sparkles,
  Target,
} from "lucide-react";
import { TextEffect } from "../ui/text-effect";

const FEATURES = [
  {
    title: "AI Healthcare Assistant",
    description:
      "An AI-powered assistant that provides personalized healthcare recommendations and insights.",
    icon: Sparkles,
  },
  {
    title: "AI HealthChat Bot",
    description:
      "Chat with an intelligent AI bot for instant answers to your health-related questions and concerns.",
    icon: Play,
  },
  {
    title: "AI Healthcare Suggestions",
    description:
      "Receive smart, data-driven suggestions for improving your health and wellness routines.",
    icon: Target,
  },
  {
    title: "Smart AI Schedules",
    description:
      "Let AI organize your appointments, medication reminders, and daily health tasks efficiently.",
    icon: CalendarCheck,
  },
  {
    title: "Personalized Health Insights",
    description:
      "Get tailored insights and analytics based on your health data and habits.",
    icon: Signature,
  },
  {
    title: "Global Health Monitoring",
    description:
      "Monitor your health trends and metrics from anywhere in the world, powered by AI.",
    icon: Globe,
  },
];

export default function Features() {
  return (
    <section>
      <div className="py-24">
        <div className="mx-auto w-full max-w-[90rem] px-6">
          <div>
            <TextEffect
              preset="fade-in-blur"
              speedSegment={0.3}
              as="h2"
              className="text-foreground text-4xl font-semibold text-center"
            >
              Transforming Healthcare with AI
            </TextEffect>

            <TextEffect
              preset="fade-in-blur"
              speedSegment={0.5}
              as="p"
              className="text-muted-foreground mt-4 text-balance text-lg text-center"
            >
              Experience the future of healthcare—where intelligent suggestions,
              instant insights, and personalized care are powered by advanced
              artificial intelligence.
            </TextEffect>
          </div>
          <div className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature, index) => (
              <Card key={index} className="overflow-hidden p-6">
                <feature.icon className="text-primary size-5" />
                <h3 className="text-foreground mt-5 text-lg font-semibold">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground mt-3 text-balance">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
