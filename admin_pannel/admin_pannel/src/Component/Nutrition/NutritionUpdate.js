import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function NutritionUpdate() {
  const { id } = useParams(); // Get the ID from route parameters
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    user_id: "",
    date: new Date(),
    meal_type: "breakfast",
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/Nutrition/${id}`);
        setFormData(response.data);
      } catch (error) {
        console.error("There was an error fetching the nutrition log!", error);
      }
    };
    fetchData();
  }, [id]);

  const formatDate = (date) => {
    return new Date(date).toISOString(); // Outputs in format: 2024-08-07T00:00:00.000Z
  };

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
    
    if (name.startsWith('macros')) {
      const [macroType, macroName] = name.split('_');
      newFoods[index].macros[macroName] = value;
    } else {
      newFoods[index][name] = value;
    }
    
    setFormData(prevState => ({
      ...prevState,
      foods: newFoods
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedData = {
        ...formData,
        date: formatDate(formData.date) // Format date
      };

      await axios.put(`http://localhost:8000/api/Nutrition/${id}`, updatedData);
      navigate('/Nutrition_Show'); // Navigate to a success page or home
    } catch (error) {
      console.error("There was an error updating the nutrition log!", error);
    }
  };

  return (
    <div className="content-body">
      <div className="col-lg-12">
        <div className="card">
          <div className="card-body">
            <h4 className="card-title">Update Nutrition Log</h4>
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
              {formData.foods.map((food, index) => (
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
              <button type="submit" className="btn btn-primary">Update</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NutritionUpdate;
