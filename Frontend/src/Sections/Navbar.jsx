// function Navbar() {
//   return (
//     <div className="mx-10 my-4 py-2 px-4 border rounded-[10px] text-xs items-center bg-linear-to-r from-white/5 via-white/20 to-white/5 backdrop-blur-lg border-white/25 shadow-xl">
//       <div className="flex justify-between items-center text-amber-100">
//         <div className="logo cursor-pointer">
//           <img src="./FCLogo.png" alt="Club_Logo" className="h-8" />
//         </div>
//         <div className="flex gap-15 items-center cursor-pointer">
//           <div className="hover:bg-[#474028] hover:scale-110 hover:border-[2.5px] hover:p-[3.5px]  border-[#4C3C0C] transition-all duration-200 rounded-lg ease-in-out">
//             Home
//           </div>
//           <div className="hover:bg-[#474028] hover:scale-110 hover:border-[2.5px] hover:p-[3.5px]  border-[#4C3C0C] transition-all duration-200 rounded-lg ease-in-out">
//             About
//           </div>
//           <div className="flex gap-2 items-center p-2 hover:bg-[#474028] cursor-pointer border-[1.34px] rounded-[5px] border-[#4C3C0C]">
//             Contact
//             <img
//               src="./arrowDown.png"
//               alt="Arrow_Down"
//               className="h-1.0 w-2.0"
//             />
//           </div>
//           <div className="bg-[#474028] text-amber-100 rounded-[5px] py-1 px-5 cursor-pointer border border-[#886F1C] hover:scale-110 transition-all duration-200">
//             JOIN US
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Navbar;

function Navbar() {
  return (
    <div className="mx-auto my-4 px-6 py-2 max-w-7xl">
      <div
        className="
        p-2
        px-4
        flex items-center justify-between
        border border-white/25
        rounded-[10px]
        bg-linear-to-r from-white/5 via-white/20 to-white/5
        backdrop-blur-lg
        shadow-xl
        text-xs
        text-amber-100
      "
      >
        {/* Logo */}
        <div className="cursor-pointer">
          <img src="./FCLogo.png" alt="Club_Logo" className="h-8 w-auto" />
        </div>

        {/* Nav Links */}
        <div className="flex items-center gap-8 whitespace-nowrap">
          {["Home", "About"].map((item) => (
            <div
              key={item}
              className="
                cursor-pointer
                px-3 py-1
                rounded-lg
                transition-all duration-200 ease-in-out
                hover:scale-105
                hover:bg-[#474028]
                hover:ring-2 hover:ring-[#4C3C0C]
              "
            >
              {item}
            </div>
          ))}

          <div
            className="
            flex items-center gap-2
            px-3 py-1
            rounded-[5px]
            border border-[#4C3C0C]
            hover:bg-[#474028]
            transition-all duration-200
          "
          >
            Contact
            <img src="./arrowDown.png" alt="Arrow_Down" className="h-[4px]" />
          </div>

          <div
            className="
            px-5 py-1
            rounded-[5px]
            bg-[#474028]
            border border-[#886F1C]
            transition-all duration-200
            hover:bg-[#5a5234]
          "
          >
            JOIN US
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
