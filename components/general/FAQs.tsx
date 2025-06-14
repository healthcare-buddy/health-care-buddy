"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQs() {
  const faqItems = [
    {
      id: "item-1",
      question: "How does the AI generate my personalized health schedule?",
      answer:
        "Our AI analyzes your health data, preferences, and goals to create a tailored schedule for medication, appointments, and wellness activities. The recommendations are regularly updated based on your feedback and new information.",
    },
    {
      id: "item-2",
      question: "Can I chat with a medical AI for advice?",
      answer:
        "Yes, our AI-powered chatbot is available 24/7 to answer your health-related questions, provide guidance, and help you navigate the app. For urgent or serious concerns, we always recommend consulting a healthcare professional.",
    },
    {
      id: "item-3",
      question: "Is my health data secure and private?",
      answer:
        "Absolutely. We use advanced encryption and follow strict privacy protocols to ensure your health information is safe and confidential. You have full control over your data and can manage your privacy settings at any time.",
    },
    {
      id: "item-4",
      question: "Can I sync the app with my wearable devices?",
      answer:
        "Yes, you can connect popular wearable devices and health apps to automatically import activity, sleep, and vital sign data. This helps our AI provide even more accurate and personalized recommendations.",
    },
    {
      id: "item-5",
      question: "How do I update or change my health goals?",
      answer:
        "You can update your health goals anytime in your profile settings. The AI will immediately adjust your schedule and recommendations to align with your new objectives.",
    },
  ];

  return (
    <section className=" py-16 md:py-24">
      <div className="mx-auto max-w-[90rem] px-4 md:px-6">
        <div>
          <h2 className="text-foreground text-4xl font-semibold text-center">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground mt-4 text-balance text-lg text-center">
            Discover quick and comprehensive answers to common questions about
            our platform, services, and features.
          </p>
        </div>

        <div className="mt-12">
          <Accordion
            type="single"
            collapsible
            className="bg-card ring-foreground/5 rounded-(--radius) w-full border border-transparent px-8 py-3 shadow ring-1"
          >
            {faqItems.map((item) => (
              <AccordionItem
                key={item.id}
                value={item.id}
                className="border-dotted"
              >
                <AccordionTrigger className="cursor-pointer text-base hover:no-underline">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-base">{item.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
