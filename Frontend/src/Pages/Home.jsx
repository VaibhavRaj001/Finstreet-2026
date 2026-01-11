import Navbar from "../Sections/Navbar";

function Home() {
  return (
    <>
      <div>
        <Navbar />
      </div>
      <div className="ml-10 mt-9">
        <div className="flex flex-col">
          <div className="text-[clamp(48px,8vw,110px)] w-fit font-normal bg-linear-to-r from-[#ddb944] to-[#4d3a06] bg-clip-text text-transparent leading- tracking-[-0.05em] ">
            FINANCE
          </div>
          <div className="flex gap-1 items-center absolute top-[17%] md:top-[19%] sm:top-[16.5%] lg:top-[32.5%]">
            <div className="text-[clamp(48px,8vw,110px)] font-normal bg-linear-to-r from-[#ddb944] to-[#4d3a06] bg-clip-text text-transparent tracking-[-0.05em]">
              CLUB
            </div>
            <div className="flex flex-col absolute top-[30%] left-full items-end">
              <div className="bg-linear-to-r from-[#D4AF37] to-[#6E5B1D] lg:w-40 md:min-w-40 h-[0.05em]"></div>
              <div className="font-normal text-[clamp(2px,8vw,20px)] ">PRESENTS</div>
            </div>
          </div>
        </div>

        {/* HERO BACKGROUND */}
        <div className="w-full">
          <div className="absolute z-10 top-[45%] text-[clamp(64px,10vw,152px)] left-[38%] w-fit text-transparent bg-clip-text bg-linear-to-r from-white/90 via-white/40 to-white/70 tracking-[-0.06em]">
            FINSTREET
          </div>
          {/* Hero background image */}
          <div className="absolute top-[45%]">
            <img
              src="./heroSection.png"
              alt="Hero_Background"
              className="opacity-74 w-fit max-w-full"
            />
          </div>

          <div className=""></div>
        </div>
      </div>
    </>
  );
}

export default Home;
