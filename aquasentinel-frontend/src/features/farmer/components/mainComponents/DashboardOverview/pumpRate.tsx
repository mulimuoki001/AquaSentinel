import React from 'react';
import Gauge from 'react-gauge';

const PumpRateGauge = ({ waterFlow }) => {
    const pumpRate = calculatePumpRate(waterFlow);
    const gaugeOptions = {
        min: 0,
        max: 100,
        value: pumpRate,
        width: 200,
        height: 200,
        padding: 20,
        colors: ['red', 'yellow', 'green'],
    };

    return (
        <Gauge {...gaugeOptions} />
    );
};

const calculatePumpRate = (waterFlow) => {
    // Calculate the pump rate based on the water flow value
    // For example, you can use a simple formula like this:
    return (waterFlow / 10) * 100;
};


export default PumpRateGauge;