import { FaSearch, FaChartBar, FaStar, FaUsers } from "react-icons/fa";

const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="flex items-start space-x-4 py-4">
    <div className="flex flex-col items-center">
      <Icon className="text-green-500 text-3xl mb-2" />
      <div className="w-1 h-12 bg-gray-300"></div>
    </div>
    <div>
      <h3 className="text-lg font-semibold text-black">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  </div>
);

export default function SecPage() {
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
    <div className="flex flex-col p-10">
      <div className="max-w-4xl mb-20 mr-40%">
        <h2 className="text-5xl md:text-6xl font-bold text-black leading-tight">
          A complementary suite of specialized, best in class tools
        </h2>
      </div>
      <div className="flex flex-col md:flex-row items-center justify-between w-full">
        <div className=" text-6xl md:text-7xl max-w-lg md:w-1/2 ">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
        <div className="md:w-1/2 flex items-center justify-center">
          <img
            src="logo.jpg"
            alt="Feature preview"
            className="rounded-xl shadow-lg max-w-full"
          />
        </div>
      </div>
    </div>
  );
}
