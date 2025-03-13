const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="flex items-start space-x-4 py-4">
    <div className="flex flex-col items-center">
      <Icon className="text-green-500 text-3xl mb-2" />
      <div className="w-1 h-12 bg-gray-300"></div>
    </div>
    <div>
      <h3 className="text-3xl font-semibold text-black">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  </div>
);

export default FeatureCard;
