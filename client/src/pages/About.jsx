import { FaSearch, FaChartBar, FaStar, FaUsers } from "react-icons/fa";
import FeatureCard from "../components/FeatureCard";

export default function About() {
  const features = [
    {
      icon: FaSearch,
      title: "Conduct deep research",
      description:
        "Bring structure and meaning to billions of voices with game-changing AI solutions",
    },
    {
      icon: FaChartBar,
      title: "Monitor your brand",
      description: "Analyze market trends and consumer behavior efficiently.",
    },
    {
      icon: FaStar,
      title: "Create winning content",
      description: "Generate impactful content based on real insights.",
    },
    {
      icon: FaUsers,
      title: "Engage with consumers",
      description:
        "Understand audience sentiments and build strong connections.",
    },
  ];

  return (
    <div className="flex flex-col py-10" id="about">
      <div className="max-w-4xl mb-20 mr-40%">
        <h2 className="text-5xl md:text-6xl font-bold text-black leading-tight">
          A complementary suite of specialized, best in class tools
        </h2>
      </div>
      <div className="flex flex-col md:flex-row items-center justify-between w-full">
        <div className="text-8xl md:text-9xl w-full md:w-3/5">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>

        <div className="md:w-2/5 flex items-center justify-center">
          <img
            src="https://www.brandwatch.com/wp-content/themes/brandwatch/src/core/endpoints/resize.php?image=themes/brandwatch/src/site--brandwatch.com/assets/img/homepage/collaborate/collaborate_on_data-driven_content-2.jpg&width=0"
            alt="Feature preview"
            className="rounded-xl shadow-lg max-w-full"
          />
        </div>
      </div>
    </div>
  );
}
