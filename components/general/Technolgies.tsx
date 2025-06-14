import { InfiniteSlider } from "@/components/ui/infinite-slider";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";
import Image from "next/image";

const IMAGES = ["/framer.png", "/next-js.png", "/neon.png", "/prisma.png"];

export default function Technolgies() {
  return (
    <section className=" overflow-hidden my-20">
      <div className="group relative m-auto max-w-[90rem] px-6">
        <div className="flex flex-col items-center md:flex-row">
          <div className="md:max-w-44 md:border-r md:pr-6">
            <p className="text-end text-sm">Powered By Best Technologies</p>
          </div>
          <div className="relative py-6 md:w-[calc(100%-11rem)]">
            <InfiniteSlider speedOnHover={20} speed={40} gap={112}>
              {IMAGES.map((image, index) => (
                <div className="flex" key={index}>
                  <Image
                    className="mx-auto h-20 w-fit dark:invert"
                    src={image}
                    alt={`Logo ${index + 1}`}
                    height="1000"
                    width="1000"
                  />
                </div>
              ))}
            </InfiniteSlider>

            <div className="bg-linear-to-r from-background absolute inset-y-0 left-0 w-20"></div>
            <div className="bg-linear-to-l from-background absolute inset-y-0 right-0 w-20"></div>
            <ProgressiveBlur
              className="pointer-events-none absolute left-0 top-0 h-full w-20"
              direction="left"
              blurIntensity={1}
            />
            <ProgressiveBlur
              className="pointer-events-none absolute right-0 top-0 h-full w-20"
              direction="right"
              blurIntensity={1}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
