import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div
      id="home"
      className="relative overflow-hidden bg-black from-[#3e1734] to-background pt-[120px] md:pt-[130px] lg:pt-[160px]"
    >
      <div className="container">
        <div className="-mx-4 flex flex-wrap items-center">
          <div className="w-full px-4 z-20">
            <div
              className="hero-content wow fadeInUp mx-auto max-w-[780px] text-center"
              data-wow-delay=".2s"
            >
              <h1 className="mb-6 font-extrabold text-transparent text-4xl bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 sm:leading-snug lg:text-5xl lg:leading-[1.2]">
                “Even the darkest night will end and the sun will rise" <br />
                <span className="text-2xl">- Victor Hugo</span>
              </h1>
              <p className="mx-auto mb-9 max-w-[600px] text-base font-medium text-white sm:text-lg sm:leading-[1.44]">
                Welcome to <span className="font-bold">Mind Care</span>, Here we
                provide support and assistance to individuals navigating
                challenging mental health issues such as depression, suicidal
                thoughts, and social anxiety.
              </p>
              <ul className="mb-10 flex flex-wrap items-center justify-center gap-5">
                <li>
                  <Link
                    to={"/login"}
                    className="inline-flex items-center   justify-center rounded-md bg-white px-7 py-[14px] text-center text-base font-semibold text-dark shadow-1 transition duration-300 ease-in-out hover:bg-gray-2 hover:text-body-color"
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    to={"/userSignup"}
                    className="flex items-center gap-4 rounded-md bg-white/[0.12] px-6 py-[14px] text-base font-medium text-white transition duration-300 ease-in-out hover:bg-primary hover:text-background"
                  >
                    Signup
                  </Link>
                </li>
                <li>
                  <Link
                    to={"/doctor/login"}
                    className="flex items-center gap-4 rounded-md bg-white/[0.12] px-6 py-[14px] text-base font-medium text-white transition duration-300 ease-in-out hover:bg-primary hover:text-background"
                  >
                    Doctor
                  </Link>
                </li>
              </ul>
              <div></div>
            </div>
          </div>
          <img
            className="absolute top-0 opacity-15 w-full"
            // src="https://wallpapercave.com/wp/wp10299388.jpg"
            src="https://media.newyorker.com/photos/64177e0c6534701061ec3f19/master/pass/Bing_Ani_Final_B_2A.gif"
            alt=""
          />
        </div>
      </div>
    </div>
  );
}
