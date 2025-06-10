import useProviderData from "../hooks/providerData";
const ProviderProfile = () => {
    const { data, error } = useProviderData();
    if (error) {
      return <div>Error: {error.message}</div>;
    }
  
    if (!data) {
      return <div>Loading...</div>;
    }
  return (
    <div>
      <h2>Provider Profile</h2>
          <ul>
            {data.map((provider) => (
              <li key={provider.id}>{provider.name}</li>
            ))}
     </ul>
    </div>
  );
};

export default ProviderProfile;