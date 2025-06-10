// components/FarmerProfile.tsx
import useFarmerData from "../hooks/farmerData";

const FarmerProfile = () => {
    const { data, error } = useFarmerData();
    if (error) {
      return <div>Error: {error.message}</div>;
    }
  
    if (!data) {
      return <div>Loading...</div>;
    }
  return (
    <div>
      <h2>Farmer Profile</h2>
          <ul>
            {data.map((farmer) => (
              <li key={farmer.id}>{farmer.name}</li>
            ))}
      </ul>
    </div>
  );
};

export default FarmerProfile;