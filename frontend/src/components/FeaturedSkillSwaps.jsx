import React from "react";

const features = [
  {
    title: "1-to-1 Skill Exchange",
    desc: "Teach what you know and learn what you need without spending money.",
    icon: "🔁",
  },
  {
    title: "Smart Matching",
    desc: "Get matched with users who want your skills and offer what you need.",
    icon: "🤝",
  },
  {
    title: "Verified Profiles",
    desc: "Real users with ratings and trusted profiles.",
    icon: "⭐",
  },
  {
    title: "Flexible Learning",
    desc: "Learn anytime based on your availability.",
    icon: "⏱",
  },
  {
    title: "Global Community",
    desc: "Connect with learners and teachers from around the world.",
    icon: "🌍",
  },
  {
    title: "Completely Free",
    desc: "No payments. Only knowledge exchange.",
    icon: "🆓",
  },
];

const FeaturedSkillSwapFeatures = () => {
  return (
    <div className="py-12 bg-slate-900 text-white">
      <div className="max-w-6xl mx-auto px-4">

        <h2 className="text-3xl font-bold text-center mb-10">
          Why Choose SkillSwap?
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {features.map((item, index) => (
            <div
              key={index}
              className="bg-slate-800 p-6 rounded-xl shadow hover:scale-105 transition"
            >
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-slate-400 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default FeaturedSkillSwapFeatures;
