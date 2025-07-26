import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import rwandaDistricts from '../MockData/gadm41_RWA_2.json';
import mockData from "../MockData/mockData"; // ✅ your enriched data

const getColor = (eff: number) => {
    return eff >= 85 ? "#00c853" :
        eff >= 70 ? "#ffd600" :
            eff >= 50 ? "#ff6d00" : "#d50000";
};

const DistrictZoneMap = () => {
    const onEachDistrict = (feature: any, layer: any) => {
        const districtName = feature.properties.NAME_2;
        const match = mockData.find(d => d.district.toLowerCase() === districtName.toLowerCase());

        if (match) {
            layer.setStyle({
                fillColor: getColor(match.avgEfficiency),
                fillOpacity: 0.7,
                color: "#555",
                weight: 1,
            });

            layer.bindTooltip(`
        <strong>${match.district}</strong><br/>
        Zone: ${match.zone}<br/>
        Farms: ${match.farms}<br/>
        Online: ${match.onlineFarms}<br/>
        Offline: ${match.offlineFarms}<br/>
        Efficiency: ${match.avgEfficiency}%<br/>
        Water Used: ${match.waterUsed} L
      `);
        }
    };

    return (
        <MapContainer
            style={{ height: "500px", width: "100%", marginTop: "1rem" }}
            center={[-1.94, 30.06]}
            zoom={8}
        >
            <TileLayer
                attribution='&copy; OpenStreetMap'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <GeoJSON data={rwandaDistricts as any} onEachFeature={onEachDistrict} />
        </MapContainer>
    );
};

export default DistrictZoneMap;
