import React from "react";

const TOPICS = ["STOCK MARKET", "PERSONAL FINANCE", "ENTREPRENEURSHIP"];

const SPEAKERS = [
  {
    name: "Sakchi Jain",
    image: "/SakchiJain.jpg",
    role: "Speaker",
  },
  {
    name: "Koyesha Mukherjee",
    image: "/Koyesha.jpg",
    role: "Speaker",
  },
  {
    name: "Virendra Verma",
    image: "/Virendra.jpg",
    role: "Speaker",
  },
  {
    name: "Abhishek Kumar",
    image: "/Abhishek.jpg",
    role: "Speaker",
  },
  {
    name: "Uzair Ahmad",
    image: "/Uzair.jpg",
    role: "Speaker",
  },
];

function OurSpeaker() {
  return (
    <section className="relative w-full overflow-hidden py-24 text-white">
      <div className="absolute inset-0 z-10 ">
        <div className="w-screen" />
        <img
          src="/OurSpeaker_Bck.png"
          alt="Speakers Background"
          className=" h-full w-full object-fill opacity-75"
        />
      </div>

      <div className="relative z-10 mx-auto max-w-[90%] md:max-w-[85%]">
        <div className="mb-16">
          <h1 className="font-antonio text-[12vw] font-medium leading-none text-transparent uppercase bg-clip-text bg-linear-to-r from-[#EDEDED] to-[#2a2a2eac] md:text-8xl">
            Our Speakers
          </h1>
        </div>

        <div className="flex flex-col gap-16 lg:flex-row lg:justify-between">
          <div className="flex flex-col gap-8 lg:w-1/3">
            <h2 className="text-2xl font-bold tracking-tight text-[#D4AF37] md:text-4xl">
              // ALL TOPICS
            </h2>
            <div className="flex flex-col gap-6">
              {TOPICS.map((topic, index) => (
                <div key={index} className="group cursor-default">
                  <span className="text-xl font-light tracking-widest text-gray-400 transition-colors group-hover:text-white md:text-2xl">
                    {topic}
                  </span>
                  <div className="mt-2 h-px w-full bg-white/20 transition-all duration-500 group-hover:w-full group-hover:bg-[#D4AF37] group-hover:shadow-[0px_2px_15px_4px_rgba(212,175,55,0.5)]" />
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-3 lg:w-1/2">
            {SPEAKERS.map((speaker, index) => (
              <div
                key={index}
                className="group flex flex-col items-center gap-4 transition-transform hover:-translate-y-2"
              >
                <div className="relative h-32 w-32 overflow-hidden rounded-full border-2 border-[#D4AF37]/30 transition-all duration-300 group-hover:border-[#D4AF37] group-hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] md:h-40 md:w-40">
                  <img
                    src={speaker.image}
                    alt={speaker.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="text-center">
                  <h3 className="font-antonio text-xl tracking-wide text-white md:text-2xl">
                    {speaker.name}
                  </h3>
                  <p className="text-xs font-medium tracking-widest text-[#D4AF37] uppercase opacity-80">
                    {speaker.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default OurSpeaker;
