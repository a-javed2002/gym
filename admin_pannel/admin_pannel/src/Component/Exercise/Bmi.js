import React, { useState } from 'react';
import './BMI.css'; // Import the CSS file for styling
import ReactSpeedometer from 'react-d3-speedometer';
import { FaExclamationTriangle, FaCheckCircle, FaArrowUp, FaSkull } from 'react-icons/fa'; // Import icons

const BMICalculator = () => {
  const [height, setHeight] = useState('');
  const [heightUnit, setHeightUnit] = useState('m'); // Default unit is meters
  const [weight, setWeight] = useState('');
  const [weightUnit, setWeightUnit] = useState('kg'); // Default unit is kilograms
  const [bmi, setBMI] = useState(null);
  const [category, setCategory] = useState('');

  // Function to convert height to meters
  const convertHeightToMeters = (height, unit) => {
    switch (unit) {
      case 'cm':
        return height / 100; // Convert cm to meters
      case 'in':
        return height * 0.0254; // Convert inches to meters
      case 'ft':
        return height * 0.3048; // Convert feet to meters
      default:
        return height; // Already in meters
    }
  };

  // Function to convert weight to kilograms
  const convertWeightToKilograms = (weight, unit) => {
    if (unit === 'lb') {
      return weight * 0.453592; // Convert pounds to kilograms
    }
    return weight; // Already in kilograms
  };

  // BMI Calculation Logic
  const calculateBMI = () => {
    const h = convertHeightToMeters(parseFloat(height), heightUnit);
    const w = convertWeightToKilograms(parseFloat(weight), weightUnit);
    if (h > 0 && w > 0) {
      const bmiValue = w / (h * h);
      setBMI(bmiValue.toFixed(2));
      determineCategory(bmiValue);
    } else {
      setBMI(null);
      setCategory('');
    }
  };

  // Determine BMI Category
  const determineCategory = (bmiValue) => {
    if (bmiValue < 16) {
      setCategory('Severe Thinness');
    } else if (bmiValue >= 16 && bmiValue < 17) {
      setCategory('Moderate Thinness');
    } else if (bmiValue >= 17 && bmiValue < 18.5) {
      setCategory('Mild Thinness');
    } else if (bmiValue >= 18.5 && bmiValue < 25) {
      setCategory('Normal');
    } else if (bmiValue >= 25 && bmiValue < 30) {
      setCategory('Overweight');
    } else if (bmiValue >= 30 && bmiValue < 35) {
      setCategory('Obese Class I');
    } else if (bmiValue >= 35 && bmiValue < 40) {
      setCategory('Obese Class II');
    } else {
      setCategory('Obese Class III');
    }
  };

  return (
    <div className='content-body' style={{ overflowY: 'auto', height: '800px', maxHeight: '2000px', }}>
      <div className="bmi-calculator"   >
        <h1>BMI Calculator</h1>

        {/* Input Fields for Height */}
        <div className="inputs">
          <input
            type="number"
            placeholder={`Height (${heightUnit})`}
            value={height}
            onChange={(e) => setHeight(e.target.value)}
          />
          <select value={heightUnit} onChange={(e) => setHeightUnit(e.target.value)}>
            <option value="cm">CM</option>
            <option value="m">METER</option>
            <option value="in">INCHES</option>
            <option value="ft">FEET</option>
          </select>

          {/* Input Fields for Weight */}
          <input
            type="number"
            placeholder={`Weight (${weightUnit})`}
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />
          <select value={weightUnit} onChange={(e) => setWeightUnit(e.target.value)}>
            <option value="kg">KG</option>
            <option value="lb">POUNDS</option>
          </select>

          <button onClick={calculateBMI}>Calculate BMI</button>
        </div>

        {/* BMI Result */}
        {bmi && (
          <div className="result">
            <h2>Your BMI: {bmi}</h2>
            <p>Category: {category}</p>
          </div>
        )}

        {/* Speedometer Indicator */}
        {bmi && (
          <ReactSpeedometer
            value={parseFloat(bmi)}
            minValue={10}
            maxValue={50}
            segments={7}
            needleColor="steelblue"
            needleHeightRatio={0.7}
            segmentColors={[
              '#FF6347', // Severe Thinness
              '#FF8C00', // Thinness
              '#28a745', // Normal
              '#FFD700', // Overweight
              '#FF4500', // Obese Class I
              '#DC143C', // Obese Class II
              '#8B0000', // Obese Class III
            ]}
            customSegmentStops={[10, 16, 18.5, 25, 30, 35, 40, 50]}
            valueTextFontSize="20px"
            currentValueText={`BMI: ${bmi}`}
            fluidWidth={true}
          />
        )}

        {/* BMI Classification Information */}
        <div className="bmi-info">
          <h3>BMI Classifications:</h3>
          <ul>
            <li><FaExclamationTriangle style={{ color: '#FF6347' }} /> Severe Thinness: BMI &lt; 16</li>
            <li><FaExclamationTriangle style={{ color: '#FF8C00' }} /> Moderate Thinness: BMI 16 - 17</li>
            <li><FaExclamationTriangle style={{ color: '#FFA500' }} /> Mild Thinness: BMI 17 - 18.5</li>
            <li><FaCheckCircle style={{ color: '#28a745' }} /> Normal: BMI 18.5 - 25</li>
            <li><FaArrowUp style={{ color: '#FFD700' }} /> Overweight: BMI 25 - 30</li>
            <li><FaArrowUp style={{ color: '#FF4500' }} /> Obese Class I: BMI 30 - 35</li>
            <li><FaArrowUp style={{ color: '#DC143C' }} /> Obese Class II: BMI 35 - 40</li>
            <li><FaSkull style={{ color: '#8B0000' }} /> Obese Class III: BMI &gt; 40</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BMICalculator;
