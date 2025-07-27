import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import cellGeoData from "../MockData/gadm41_RWA_4.json";
import mockFarmsData from "../MockData/mockFarmsData";

const getColor = (eff: number) => {
    return eff >= 85 ? "#00c853" :
        eff >= 70 ? "#ffd600" :
            eff >= 50 ? "#ff6d00" : "#d50000";
};

const CellLevelMap = () => {
    const onEachCell = (feature: any, layer: any) => {
        const cellName = feature.properties.NAME_4;
        const districtName = feature.properties.NAME_2;
        const sectorName = feature.properties.NAME_3;

        const farms = mockFarmsData.filter(f =>
            f.cell.toLowerCase() === cellName.toLowerCase() &&
            f.district.toLowerCase() === districtName.toLowerCase()
        );

        if (farms.length > 0) {
            const avgEfficiency = (
                farms.reduce((sum, f) => sum + f.avgEfficiency, 0) / farms.length
            ).toFixed(1);

            const moistureAvg = (
                farms.reduce((sum, f) => sum + f.moisture, 0) / farms.length
            ).toFixed(1);

            layer.setStyle({
                fillColor: getColor(parseFloat(avgEfficiency)),
                fillOpacity: 0.7,
                color: "#444",
                weight: 1,
            });

            const tooltipContent = `
        <strong>Cell: ${cellName}</strong><br/>
        Sector: ${sectorName}<br/>
        District: ${districtName}<br/>
        Registered Farms: ${farms.length}<br/>
        Avg Moisture: ${moistureAvg}%<br/>
        Avg Efficiency: ${avgEfficiency}%
      `;
            layer.bindTooltip(tooltipContent);
        } else {
            layer.setStyle({
                fillColor: "#ccc",
                fillOpacity: 0.4,
                color: "#999",
                weight: 1,
            });

            layer.bindTooltip(`<strong>${cellName}</strong><br/>No farm data`);
        }
    };

    return (
        <div className="map-container-leaflet">
            <h2>Cell Level Monitoring Map</h2>

            <MapContainer
                style={{ height: "500px", width: "100%", marginTop: "2rem" }}
                center={[-1.94, 30.06]}
                zoom={9}
                zoomControl={false}
            >
                <TileLayer
                    attribution='&copy; OpenStreetMap'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <GeoJSON data={cellGeoData as any} onEachFeature={onEachCell} />
            </MapContainer>
        </div>
    );
};

export default CellLevelMap;
