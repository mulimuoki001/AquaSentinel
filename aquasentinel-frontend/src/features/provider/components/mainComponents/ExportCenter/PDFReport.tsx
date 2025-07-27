import { Document, Page, StyleSheet, Text, View, Image } from "@react-pdf/renderer";

const styles = StyleSheet.create({
    page: {
        padding: 30,
        fontSize: 12,
        fontFamily: "Helvetica",
    },
    title: {
        fontSize: 18,
        marginBottom: 10,
        textAlign: "center",
        color: "#1565c0",
    },
    section: {
        marginBottom: 10,
    },
    cardRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        flexWrap: "wrap",
    },
    card: {
        backgroundColor: "#e3f2fd",
        padding: 10,
        borderRadius: 6,
        margin: 5,
        width: "45%",
    },
    label: {
        fontSize: 11,
        color: "#1976d2",
    },
    value: {
        fontSize: 14,
        fontWeight: "bold",
    },
    chartTitle: {
        marginTop: 15,
        fontSize: 13,
        fontWeight: "bold",
    },
    chartImage: {
        marginTop: 10,
        height: 180,
    },
});

interface PDFReportProps {
    chartImage: string;
    totalFarms: number;
    totalWater: string;
    avgEfficiency: string;
    alerts: number;
}

const PDFReport: React.FC<PDFReportProps> = ({ chartImage, totalFarms, totalWater, avgEfficiency, alerts }) => {
    const date = new Date().toLocaleString();

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <Text style={styles.title}>AquaSentinel Summary Report</Text>
                <Text style={styles.section}>Generated on: {date}</Text>

                <View style={styles.cardRow}>
                    <View style={styles.card}>
                        <Text style={styles.label}>Total Farms</Text>
                        <Text style={styles.value}>{totalFarms}</Text>
                    </View>
                    <View style={styles.card}>
                        <Text style={styles.label}>Water Used Today</Text>
                        <Text style={styles.value}>{totalWater} L</Text>
                    </View>
                    <View style={styles.card}>
                        <Text style={styles.label}>Average Efficiency</Text>
                        <Text style={styles.value}>{avgEfficiency}%</Text>
                    </View>
                    <View style={styles.card}>
                        <Text style={styles.label}>Active Alerts</Text>
                        <Text style={styles.value}>{alerts}</Text>
                    </View>
                </View>

                <Text style={styles.chartTitle}>Efficiency by District</Text>
                {/* ✅ Embed the base64 image here */}
                {chartImage && <Image src={chartImage} style={styles.chartImage} />}
            </Page>
        </Document>
    );
};

export default PDFReport;
