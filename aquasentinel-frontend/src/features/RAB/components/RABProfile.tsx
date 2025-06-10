import useRABData from "../hooks/RABData";

const RABProfile = () => {
    const { data, error } = useRABData();
    if (error) {
        return <div>Error: {error.message}</div>;
    }

    if (!data) {
        return <div>Loading...</div>;
    }
  return (
    <div>
      <h2>RAB Profile</h2>
          <ul>
            {data.map((RAB) => (
              <li key={RAB.id}>{RAB.name}</li>
            ))}
          </ul>
    </div>
  );
};

export default RABProfile;