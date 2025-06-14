"use client";
import React from "react";
import { TextEffect } from "@/components/ui/text-effect";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <>
      <main className="overflow-hidden [--color-primary-foreground:var(--color-white)] [--color-primary:var(--color-green-600)]">
        <section>
          <div className="relative mx-auto max-w-screen  px-6 pb-20 pt-32 lg:pt-48">
            <div className="relative z-10 mx-auto max-w-4xl text-center">
              <TextEffect
                preset="fade-in-blur"
                speedSegment={0.3}
                as="h1"
                className="text-balance text-5xl font-medium md:text-6xl"
              >
                Healthier Daily Routine
              </TextEffect>
              <TextEffect
                per="line"
                preset="fade-in-blur"
                speedSegment={0.3}
                delay={0.5}
                as="p"
                className="mx-auto mt-6 max-w-2xl text-pretty text-lg"
              >
                Discover how to improve your daily routine with our
                comprehensive guide. From nutrition to exercise, we cover it
                all.
              </TextEffect>
            </div>
          </div>
        </section>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="flex items-center justify-center max-w-96 max-sm:px-3 sm:max-w-xl md:max-w-3xl xl:max-w-5xl mx-auto  overflow-hidden lg:h-[35rem] rounded-2xl"
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
            className="absolute bg-gradient-to-l from-blue-500/50 to-cyan-400/50 h-[30rem] w-full max-w-96 max-sm:px-3 sm:max-w-xl md:max-w-3xl xl:max-w-5xl mx-auto -z-10 blur-3xl"
          />
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, ease: "easeOut", delay: 0.4 }}
            className="w-full"
          >
            <Image
              src={"/hero.jpg"}
              alt="Hero Image"
              width={1200}
              height={800}
              className="object-contain rounded-2xl"
            />
          </motion.div>
        </motion.div>
      </main>
    </>
  );
}
