import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../Sections/Navbar";

function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <div>
        <Navbar />
      </div>

      <div className="w-full">
        <div className="absolute z-10 top-[45%] text-[clamp(64px,10vw,152px)] left-[38%] w-fit text-transparent bg-clip-text bg-linear-to-r from-white/90 via-white/40 to-white/50 tracking-[-0.06em]">
          FINSTREET
        </div>
        {/* Hero background image */}
        <div className="absolute top-[40%]">
          <img
            src="./heroSection.svg"
            alt="Hero_Background"
            className="opacity-100 w-fit max-w-full"
          />
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
                <div className="font-normal text-[clamp(2px,8vw,20px)] ">
                  PRESENTS
                </div>
              </div>
            </div>
          </div>

          {/* HERO BACKGROUND */}

          <div className="absolute top-full border border-white/25 rounded-[10px] bg-[#0B0B0D80] backdrop-blur-lg shadow-xl p-5">
            <p className="bg-linear-to-r from-[#D4AF37] via-[#00000079] to-[#00000079] bg-clip-text text-transparent text-4xl tracking-[-0.05em]">
              DOLLAR
            </p>
            <p className="max-w-md text-white/80 py-4">
              A Tool that can cut both ways — Creating Wealth or Causing Harm
            </p>
            <div className="flex gap-4">
              <Link
                to={isAuthenticated ? "/create-team" : "/login?redirect=/create-team"}
                className="flex gap-2 bg-[#EDEDED1A] text-amber-100 rounded-[5px] py-1.5 px-3 cursor-pointer border-[0.5px] border-[#ffffff5a] hover:scale-105 transition-all duration-200 text-xs"
              >
                SIGN UP YOUR TEAM
                <img src="./SideArrowVector.svg" className="" />
              </Link>

              <button className="flex gap-2 bg-[#EDEDED1A] text-amber-100 rounded-[5px] py-1.5 px-3 cursor-pointer border-[0.5px] border-[#ffffff5a] hover:scale-105 transition-all duration-200 text-xs">
                CONTACT US
                <img src="./SideArrowVector.svg" className="" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
