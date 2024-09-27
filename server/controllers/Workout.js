
import WorkoutModel from '../models/WorkoutModel.js'

class Workout {

    static getData = async (req, res) => {
        try {
            const result = await WorkoutModel.find()
            res.send(result)
        } catch (error) {
            console.log(error)
        }
    }
    static addData = async (req, res) => {
        try {
            console.log(`Request body: ${JSON.stringify(req.body)}`);
            const { userId, selectedExerciseIds, Calorie_Burn } = req.body;
    
            if (!userId || !selectedExerciseIds || !Array.isArray(selectedExerciseIds)) {
                return res.status(400).json({ error: "Invalid data" });
            }
    
            // Create the workout object
            const newWorkout = new WorkoutModel({
                user_id_Fk: userId,
                exercise_id: selectedExerciseIds,
            });
    
            // Only set Calorie_Burn if it's null or a valid value
            if (Calorie_Burn === null || Calorie_Burn >= 0) {
                newWorkout.Calorie_Burn = Calorie_Burn;
            } else {
                return res.status(400).json({ error: "Invalid Calorie_Burn value" });
            }
    
            await newWorkout.save(); // Save the new document
    
            res.status(201).json({ message: "Workouts added successfully", workout: newWorkout });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
    static addData2 = async (req, res) => {
        try {
            console.log(`Request body: ${JSON.stringify(req.body)}`);
            const { userId, selectedExerciseIds, date } = req.body;
    
            if (!userId || !selectedExerciseIds || !Array.isArray(selectedExerciseIds)) {
                return res.status(400).json({ error: "Invalid data" });
            }
    
            // Create the workout object
            const newWorkout = new WorkoutModel({
                user_id_Fk: userId,
                exercise_id: selectedExerciseIds,
                date: date,  // Add date here
            });
    
            // Only set Calorie_Burn if it's null or a valid value
            if (Calorie_Burn === null || Calorie_Burn >= 0) {
                newWorkout.Calorie_Burn = Calorie_Burn;
            } else {
                return res.status(400).json({ error: "Invalid Calorie_Burn value" });
            }
    
            await newWorkout.save(); // Save the new document
    
            res.status(201).json({ message: "Workouts added successfully", workout: newWorkout });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
    

    static viewAllDocumentsById = async (req, res) => {
        try {
            const id = req.params.id; // Correctly extract ID from URL parameter
            const documents = await WorkoutModel.find({ user_id_Fk: id });
            if (documents.length === 0) {
                return res.status(404).json({ error: "No documents found" });
            }
            res.status(200).json(documents);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }


    static updateData = async (req, res) => {
        try {
            const workoutId = req.params.id;
            const { Status } = req.body;
    
            if (!Status) {
                return res.status(400).json({ error: "Calorie_Burn field is required" });
            }
    
            const updatedWorkout = await WorkoutModel.findByIdAndUpdate(
                workoutId,
                {
                    Status,
           
                },
                { new: true }
            );
    
            if (!updatedWorkout) {
                return res.status(404).json({ error: "Workout not found" });
            }
    
            res.status(200).json({ message: "Workout updated successfully", Workout: updatedWorkout });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    };
    

    static DateUpdate = async (req, res) => {
        const { id } = req.params;
    
        const { date } = req.body;

        try {
            // Validate date format
            if (!Date.parse(date)) {
                return res.status(400).json({ message: 'Invalid date format' });
            }

            const updatedWorkout = await WorkoutModel.findByIdAndUpdate(id, { date: new Date(date) }, { new: true });
            if (!updatedWorkout) {
                return res.status(404).json({ message: 'Workout not found' });
            }
            res.json(updatedWorkout);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static DateUpdate2 = async (req, res) => {
        const { id } = req.params;
        const { date } = req.body;
    
        try {
            // Validate the date
            if (!Date.parse(date)) {
                return res.status(400).json({ message: 'Invalid date format' });
            }
    
            // Find the existing workout
            const workout = await WorkoutModel.findById(id);
            if (!workout) {
                return res.status(404).json({ message: 'Workout not found' });
            }
    
            // Create a duplicate of the existing workout, but exclude the _id field to avoid duplicate key error
            const duplicateWorkoutData = workout.toObject();
            delete duplicateWorkoutData._id; // Remove _id to allow MongoDB to generate a new one
            const duplicateWorkout = new WorkoutModel({
                ...duplicateWorkoutData,
                date: workout.date, // Keep the old date
            });
    
            // Save the duplicate workout
            await duplicateWorkout.save();
    
            // Update the original workout with the new date
            workout.date = new Date(date);
            await workout.save();
    
            // Respond with the updated workout
            res.json(workout);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: error.message });
        }
    };
    
    
    
    static viewSingleData = async (req, res) => {
        try {
            const CategoryId = req.params.id;
            const Category = await WorkoutModel.findById(CategoryId);
            if (!Category) {
                return res.Category_status(404).json({ error: "Category not found" });
            }
            res.status(200).json(Category);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }



    static deleteData = async (req, res) => {
        try {

            const CategoryId = req.params.id;


            await WorkoutModel.findByIdAndDelete(CategoryId);

            // Send a success response
            res.status(200).json({ message: "Category deleted successfully" });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
}


export default Workout