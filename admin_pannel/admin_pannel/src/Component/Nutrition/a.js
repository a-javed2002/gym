import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { data } from "jquery";

function NutritionLogInsert() {
  const Id = localStorage.getItem('id');
  const [formData, setFormData] = useState({
    user_id: Id,
    date: new Date().toISOString(), // Store date as ISO string
    meal_type: "breakfast", // default value
    foods: [{
      name: "",
      quantity: 0,
      calories: 0,
      macros: {
        protein: 0,
        carbs: 0,
        fat: 0
      }
    }]
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleFoodChange = (index, e) => {
    const { name, value } = e.target;
    const newFoods = [...formData.foods];
    const [field, key] = name.split('_');
    
    if (field === 'macros') {
      newFoods[index].macros[key] = value;
    } else {
      newFoods[index][field] = value;
    }
    
    setFormData(prevState => ({
      ...prevState,
      foods: newFoods
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/api/Nutrition', formData);
      navigate('/Nutrition_Show'); // Navigate to a success page or home
    } catch (error) {
      console.error("There was an error creating the nutrition log!", error);
    }
  };

  const [query, setQuery] = useState('');
  const [nutritionData, setNutritionData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [manualEntry, setManualEntry] = useState(false);
  const [servingSize, setServingSize] = useState('');

  const handleInputChange2 = (e) => {
    setQuery(e.target.value);
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`https://api.calorieninjas.com/v1/nutrition?query=${query}`, {
        headers: {
          'X-Api-Key': 'jGIp7uZGmHky9q2xp3PR+g==TdNPLyOV2NED31xq'
        }
      });

      if (response.data.items.length === 0) {
        setManualEntry(true);
      } else {
        setNutritionData(response.data);
        i want after fetch it data save according to my fiels ae in form data  const [formData, setFormData] = useState({
          user_id: Id,
          date: new Date().toISOString(), // Store date as ISO string
          meal_type: "breakfast", // default value
          foods: [{
            name: "",
            quantity: 0,
            calories: 0,
            macros: {
              protein: 0,
              carbs: 0,
              fat: 0
            }
          }]
        });
      
        setManualEntry(false);
      }
    } catch (err) {
      setError('Error fetching data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit2 = (e) => {
    e.preventDefault();
    if (query.trim()) {
      fetchData();
    }
  };

  const calculateCalories = (item, newServingSize) => {
    if (item.serving_size_g <= 0 || newServingSize <= 0) return 0;
    return (item.calories / item.serving_size_g) * newServingSize;
  };

  return (
    <div className="content-body">
      <div style={styles.container}>
        <h1 style={styles.header}>Nutrition Finder</h1>
        <form onSubmit={handleSubmit2} style={styles.form}>
          <input
            type="text"
            value={query}
            onChange={handleInputChange2}
            placeholder="Enter food item"
            style={styles.input}
          />
          <button type="submit" style={styles.button}>Search</button>
        </form>

        {loading && <p style={styles.loading}>Loading...</p>}
        {error && <p style={styles.error}>{error}</p>}

        {nutritionData && nutritionData.items && (
          <div style={styles.resultContainer}>
            {nutritionData.items.map((item, index) => (
              <div key={index} style={styles.resultItem}>
                <h2 style={styles.resultHeader}>{item.name}</h2>
                <p>Calories: {calculateCalories(item, servingSize || item.serving_size_g)}</p>
                <p>Serving Size: {item.serving_size_g}g</p>
                <p>Fat (Total): {item.fat_total_g}g</p>
                <p>Fat (Saturated): {item.fat_saturated_g}g</p>
                <p>Protein: {item.protein_g}g</p>
                <p>Sodium: {item.sodium_mg}mg</p>
                <p>Potassium: {item.potassium_mg}mg</p>
                <p>Cholesterol: {item.cholesterol_mg}mg</p>
                <p>Carbohydrates (Total): {item.carbohydrates_total_g}g</p>
                <p>Fiber: {item.fiber_g}g</p>
                <p>Sugar: {item.sugar_g}g</p>
                <div>
                  <label htmlFor="serving_size">Enter Serving Size (g): </label>
                  <input
                    type="number"
                    id="serving_size"
                    value={servingSize}
                    onChange={(e) => setServingSize(e.target.value)}
                    placeholder={item.serving_size_g}
                    style={styles.input}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="col-lg-12">
        <div className="card">
          <div className="card-body">
            <h4 className="card-title">Create Nutrition Log</h4>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="meal_type">Meal Type</label>
                <select
                  className="form-control"
                  id="meal_type"
                  name="meal_type"
                  value={formData.meal_type}
                  onChange={handleInputChange}
                  required
                >
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                  <option value="snacks">Snacks</option>
                </select>
              </div>

              {manualEntry && formData.foods.map((food, index) => (
                <div key={index} className="food-group">
                  <h5>Food Item {index + 1}</h5>
                  <div className="form-group">
                    <label htmlFor={`food_name_${index}`}>Food Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id={`food_name_${index}`}
                      name="name"
                      placeholder="Enter Food Name"
                      value={food.name}
                      onChange={(e) => handleFoodChange(index, e)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor={`food_quantity_${index}`}>Quantity</label>
                    <input
                      type="number"
                      className="form-control"
                      id={`food_quantity_${index}`}
                      name="quantity"
                      min="0"
                      placeholder="Enter Quantity"
                      value={food.quantity}
                      onChange={(e) => handleFoodChange(index, e)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor={`food_calories_${index}`}>Calories</label>
                    <input
                      type="number"
                      className="form-control"
                      id={`food_calories_${index}`}
                      name="calories"
                      min="0"
                      placeholder="Enter Calories"
                      value={food.calories}
                      onChange={(e) => handleFoodChange(index, e)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor={`food_macros_protein_${index}`}>Protein</label>
                    <input
                      type="number"
                      className="form-control"
                      id={`food_macros_protein_${index}`}
                      name="macros_protein"
                      min="0"
                      placeholder="Enter Protein"
                      value={food.macros.protein}
                      onChange={(e) => handleFoodChange(index, e)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor={`food_macros_carbs_${index}`}>Carbs</label>
                    <input
                      type="number"
                      className="form-control"
                      id={`food_macros_carbs_${index}`}
                      name="macros_carbs"
                      min="0"
                      placeholder="Enter Carbs"
                      value={food.macros.carbs}
                      onChange={(e) => handleFoodChange(index, e)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor={`food_macros_fat_${index}`}>Fat</label>
                    <input
                      type="number"
                      className="form-control"
                      id={`food_macros_fat_${index}`}
                      name="macros_fat"
                      min="0"
                      placeholder="Enter Fat"
                      value={food.macros.fat}
                      onChange={(e) => handleFoodChange(index, e)}
                    />
                  </div>
                </div>
              ))}
              <button type="submit" className="btn btn-primary">Submit</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    textAlign: 'center',
    padding: '2rem',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f4f4f4',
  },
  header: {
    color: '#333',
    marginBottom: '2rem',
  },
  form: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '2rem',
  },
  input: {
    padding: '0.5rem',
    fontSize: '1rem',
    borderRadius: '5px',
    border: '1px solid #ccc',
    width: '300px',
    marginRight: '1rem',
  },
  button: {
    padding: '0.5rem 1rem',
    fontSize: '1rem',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#007BFF',
    color: '#fff',
    cursor: 'pointer',
  },
  loading: {
    fontSize: '1.2rem',
    color: '#007BFF',
  },
  error: {
    fontSize: '1.2rem',
    color: 'red',
  },
  resultContainer: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  resultItem: {
    backgroundColor: '#fff',
    padding: '1rem',
    borderRadius: '5px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    maxWidth: '300px',
  },
  resultHeader: {
    fontSize: '1.5rem',
    marginBottom: '0.5rem',
    color: '#007BFF',
  },
};

export default NutritionLogInsert;
