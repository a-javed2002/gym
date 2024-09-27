import express from 'express';
import UserController from '../controllers/UserController.js';
import multer from 'multer'; // Import multer for file uploads
import fs from 'fs'; // Import fs module for file system operations
import path from 'path'; // Import the path module
import ProductController from '../controllers/ProductController.js';
import OrderController from '../controllers/OrderController.js';
import FeeController from '../controllers/FeeController.js';
import ExerciseController from '../controllers/ExerciseController.js';
import NutritionController from '../controllers/NutritionController.js';
import Workout from '../controllers/Workout.js';
import TodoController from '../controllers/TodoController.js';
import ChatController from '../controllers/a.js';
import DashboardController from '../controllers/DashboardController.js';
import ExpenseController from '../controllers/ExpenseController.js';
const router = express.Router();

// Create the destination directory if it doesn't exist
const destinationDir = './Images/Products';
if (!fs.existsSync(destinationDir)) {
  fs.mkdirSync(destinationDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, destinationDir); // Use the destination directory
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + '-' + file.originalname); // Generate unique filename
  },
});

const fileFilter = (req, file, cb) => {
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.pdf', '.ogg', '.mp3', '.wav'];
  const fileExtension = path.extname(file.originalname).toLowerCase();
  if (allowedExtensions.includes(fileExtension)) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error('Invalid file type. Only JPG, JPEG, PNG, PDF, OGG, MP3, and WAV files are allowed.'), false); // Reject the file/ Reject the file
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

//Dashboard
router.get('/Dashboard/:id?',DashboardController.getData);

// User Routes
router.get('/User', UserController.getData);
router.get('/Contact', UserController.getcontact);
router.get('/TrainerContact/:loginid', UserController.getTrainercontact);
router.get('/UserContact/:loginid', UserController.getUsercontact);
router.get('/Trainer', UserController.getTrainer);
router.get('/Trainer/:id', UserController.getTrainerId);
router.get('/TrainerEdit/:id', UserController.viewSingleTrainer);
router.put('/TrainerUpdateTimeSlots/:id', UserController.updateTrainerTimeSlots);

router.get('/Client/:id', UserController.getClient);
router.post('/User', upload.single('User_Image'), UserController.addData); // Changed 'User_Images' to 'User_Image' if only one image
router.delete('/User/:id', UserController.deleteData);
router.get('/User/:id', UserController.viewSingleData);
router.put('/User/:id', upload.single('User_Image'), UserController.updateData);
router.put('/UserStatus/:id', UserController.updateStatus);
router.put('/updateUserData/:id', UserController.updateUserData);
router.post('/login', UserController.login);



// Product Routes
router.get('/Product', ProductController.getData);
router.post('/Product', upload.single('image'), ProductController.addData);
router.delete('/Product/:id', ProductController.deleteData);
router.get('/Product/:id', ProductController.viewSingleData);
router.put('/ProductStatus/:id', ProductController.updateStatus);
router.put('/Product/:id', upload.single('image'), ProductController.updateData);

router.post('/orders', OrderController.createOrder);
router.get('/orders', OrderController.getAllOrders);
router.get('/sale', OrderController.getSalesData);
router.get('/orders/:id', OrderController.getOrderById);
router.put('/orders/:id', OrderController.updateOrder);
router.delete('/orders/:id', OrderController.deleteOrder);



router.post('/Fees',upload.single('pdf'), FeeController.createFee);
router.get('/Feesuser/:userId', FeeController.getFeeByuserId);

router.get('/Fees/:id', FeeController.getFeeById);
router.get('/Fees', FeeController.getAllFees);
router.put('/Fees/:id', FeeController.updateFee);
router.delete('/Fees/:id', FeeController.deleteFee);
router.get('/Search', FeeController.SearchData);


router.get('/Exercise', ExerciseController.getData);




router.get('/Workout', Workout.getData);
router.post('/Workout', Workout.addData);
router.post('/TrainerWorkout', Workout.addData2);
router.get('/Workout/:id', Workout.viewSingleData);
router.get('/UserWorkout/:id', Workout.viewAllDocumentsById);
router.put('/WorkoutDateUpdate/:id', Workout.DateUpdate);
router.put('/TrainerWorkoutDateUpdate/:id', Workout.DateUpdate2);
router.put('/Workout/:id', Workout.updateData);
router.delete('/Workout/:id', Workout.deleteData);
// User Routes


router.post('/Nutrition', NutritionController.createNutritionLog);
router.get('/Nutrition', NutritionController.getAllNutritionLogs);
router.get('/Nutrition/:id', NutritionController.getNutritionLogById);
router.get('/NutritionUser/:id', NutritionController.getNutritionLogByUserId);
router.put('/Nutrition/:id', NutritionController.updateNutritionLog);
router.delete('/Nutrition/:id', NutritionController.deleteNutritionLog);
router.put('/NutritionDateUpdate/:id', NutritionController.DateUpdate);





router.get('/todosuser/:id', TodoController.getData);
router.post('/todos', TodoController.addData);
router.delete('/todos/:id', TodoController.deleteData);
router.get('/todos/:id', TodoController.viewSingleData);
router.put('/todos/:id', TodoController.updateData);








router.post('/send',upload.array('attachments'), ChatController.sendMessage);
router.get('/chat/messages/direct/:loggedInUserId/:receiver', ChatController.getDirectMessages);
router.get('/chat/messages/group/:groupId', ChatController.getGroupMessages);
router.get('/user/:userId/groups', ChatController.getUserGroups);
router.post('/group', ChatController.createGroup)
router.get('/groups', ChatController.getGroups);
router.post('/delete/messages', ChatController.delete);
router.post('/delete/chat/:id', ChatController.deleteid);
// Corrected route
router.get('/member/:groupid/:loginid', ChatController.members);


// Expense Routes
router.get('/Expense', ExpenseController.getData);
router.post('/Expense', ExpenseController.addData);
router.delete('/Expense/:id', ExpenseController.deleteData);
router.get('/Expense/:id', ExpenseController.viewSingleData);
router.put('/Expense/:id', ExpenseController.updateData);







export default router;
