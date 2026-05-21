import { Link } from "react-router-dom";

const HeroSection = ({ isLoggedIn }) => {
  return (
    <section className="bg-slate-50 py-20">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

        {/* Left content */}
        <div>

          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-6">
            Unlock Your <br /> Potential.
          </h1>

          <p className="text-slate-600 text-lg mb-8 max-w-lg">
            Exchange skills, connect with mentors, and grow together in a
            trusted peer-to-peer learning community.
          </p>

          <div className="flex gap-4">
            <Link
              to={isLoggedIn ? "/profile" : "/login"}
              className="bg-teal-500 text-white px-6 py-3 rounded-full font-medium hover:bg-teal-600 transition"
            >
              {isLoggedIn ? "Go to Profile" : "Get Started"}
            </Link>

            <a
              href="#how-it-works"
              className="px-6 py-3 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-100 transition"
            >
              How it Works
            </a>
          </div>
        </div>

        {/* Right image */}
        <div className="relative">
          <div className="rounded-3xl shadow-xl bg-white p-4">
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f"
              alt="Learning"
              className="rounded-2xl object-cover"
            />
          </div>
        </div>

      </div>
    </section>
  );
};

export default HeroSection;
