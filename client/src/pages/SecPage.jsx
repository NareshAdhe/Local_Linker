import { FaSearch, FaChartBar, FaStar, FaUsers } from "react-icons/fa";

const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="flex items-start space-x-4 py-4">
    <div className="flex flex-col items-center">
      <Icon className="text-green-500 text-3xl mb-2" />
      <div className="w-1 h-12 bg-gray-300"></div>
    </div>
    <div>
      <h3 className="text-3xl font-semibold text-black">{title}</h3>
      <p className="text-gray-600 text-lg">{description}</p>
    </div>
  </div>
);

export default function SecPage() {
  const features = [
    { icon: FaSearch, title: "Conduct deep research", description: "Bring structure and meaning to billions of voices with game-changing AI solutions" },
    { icon: FaChartBar, title: "Monitor your brand", description: "Analyze market trends and consumer behavior efficiently." },
    { icon: FaStar, title: "Create winning content", description: "Generate impactful content based on real insights." },
    { icon: FaUsers, title: "Engage with consumers", description: "Understand audience sentiments and build strong connections." },
  ];

  return (
    <div className="flex flex-col p-10">
    <div className="max-w-4xl mb-20 mr-40%">
      <h2 className="text-5xl md:text-6xl font-bold text-black leading-tight">
        A complementary suite of specialized, best in class tools
      </h2>
    </div>
    <div className="flex flex-col md:flex-row items-center justify-between w-full">
  {/* Left Content */}
  <div className="text-8xl md:text-9xl w-full md:w-3/5">
    {features.map((feature, index) => (
      <FeatureCard key={index} {...feature} />
    ))}
  </div>

  {/* Right Image */}
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
