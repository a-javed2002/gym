import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';


import { PersistGate } from 'redux-persist/es/integration/react';

import { store, persistor } from './slices/store';



import Trainer_Show from './Component/User/Trainer_Show';
import Trainer_Insert from './Component/User/Trainer_Insert';
import Client_Show from './Component/Trainer/Client_Show';
import Client_Detail from './Component/Trainer/Client_Detail';

import Product_Show from './Component/Product/Product_Show';
import Product_Insert from './Component/Product/Product_Insert';
import Product_Edit from './Component/Product/Product_Update';

import All_Product from './Component/Product/All_Product';
import Cart from './Component/Product/Cart';
import Checkout from './Component/Product/Checkout';

import Order_Show from './Component/Order/Order_Show';
import Sale from './Component/Order/Sale';

import Fee_Insert from './Component/Fee/Fee_Insert';
import Fee_Show from './Component/Fee/Fee_Show';
import FeeCard from './Component/Fee/Fee_Card';


import BMICalculator from './Component/Exercise/Bmi';
import ExercisePage from './Component/Exercise/ExercisePage';
import All_Workout from './Component/Workout/All_Workout';
import Workout_Show from './Component/Workout/Workout_Show';
import NutritionLogInsert from './Component/Nutrition/NutritionInsert';
import Nutrition_Show from './Component/Nutrition/Nutrition_Show';
import NutritionUpdate from './Component/Nutrition/NutritionUpdate';

import ExercisePage2 from './Component/Trainer/ExercisePage2';
import Workout_Show2 from './Component/Trainer/Trainer_Workout_Show';


import User_Show from './Component/User/User_Show';
import User_Insert from './Component/User/User_Insert';
import User_Edit from './Component/User/User_Update';
import Trainer_Update from './Component/User/Trainer_Update';
import Login from './Component/User/Login';
import Logout from './Component/User/Logout';
import PasswordChange from './Component/User/Change-Password';
import ProfileForm from './Component/User/Profile';
import Dashboard from './Component/Dashboard';
import TextToSpeech from './Component/speach';
import TestEmojiPicker from './Component/Emoji';
import See_Trainer from './Component/User/See_Trainer';
import Contact_Show from './Component/User/Contact_Show';

import Nav from './Component/layout/Nav';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router, Route, Routes, Navigate, Switch, useLocation } from 'react-router-dom';
import Dasboard from './Component/Dashboard';
import Chat from './Component/Chat';


import Expense_Show from './Component/Expense/Expense_Show';
import Expense_Insert from './Component/Expense/Expense_Insert';
import Expense_Edit from './Component/Expense/Expense_Update';
import { useSelector, useDispatch } from "react-redux";
const usertoken = localStorage.getItem('User_token')

const admintoken = localStorage.getItem('Admin_token')
function Header() {
  const location = useLocation();
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  const hideIcon = location.pathname === '/chat' || location.pathname === '/login';

  return (
    <header>
      <div className={`chat-icon ${hideIcon ? 'hide' : ''}`} onClick={() => window.location.href = '/chat'}>
        <i className="fas fa-comments"></i>
      </div>
    </header>
  );
}

function AppRoutes() {
  const auth = useSelector((state) => state.auth);
  const token = auth?.token;
  const admintoken = localStorage.getItem('Admin_token');

  return (
    <Routes>
      <Route path='/Chat' element={<Chat />} />
      
      <Route path='/TextToSpeech' element={<TextToSpeech />} />

      <Route path='/' element={token != null ? (<Dasboard />) : (<Navigate to="/login" replace />)} />
      <Route path='/User_Insert' element={admintoken != null ? (<User_Insert />) : (<Navigate to="/login" replace />)} />
      <Route path='/Profile' element={<ProfileForm />} />
      <Route path='/User_Show' element={admintoken != null ? (<User_Show />) : (<Navigate to="/login" replace />)} />
      <Route path='/User_Edit/:id' element={<User_Edit />} />
      <Route path='/Login' element={<Login />} />
      <Route path='/Logout' element={<Logout />} />
      <Route path='/password-change' element={<PasswordChange />} />
      <Route path='/Contact_Show' element={<Contact_Show />} />
      <Route path='/Trainer_Update/:id' element={<Trainer_Update />} />
      <Route path='/Your_Trainer' element={<See_Trainer />} />
      <Route path='/Product_Show' element={admintoken != null ? (<Product_Show />) : (<Navigate to="/login" replace />)} />
      <Route path='/Product_Edit/:id' element={admintoken != null ? (<Product_Edit />) : (<Navigate to="/login" replace />)} />
      <Route path='/Product_Insert' element={admintoken != null ? (<Product_Insert />) : (<Navigate to="/login" replace />)} />
      <Route path='/All_Product' element={<All_Product />} />
      <Route path='/Cart' element={<Cart />} />
      <Route path='/Checkout' element={<Checkout />} />
      <Route path='/Order_Show' element={<Order_Show />} />
      <Route path='/Sale' element={<Sale />} />
      <Route path='/Fee_Insert' element={<Fee_Insert />} />
      <Route path='/Fee_Show' element={<Fee_Show />} />
      <Route path='/FeeCard' element={<FeeCard />} />
      <Route path='/NutritionInsert' element={<NutritionLogInsert />} />
      <Route path='/Nutrition_Show' element={<Nutrition_Show />} />
      <Route path='/Nutrition_Update/:id' element={<NutritionUpdate />} />
      <Route path='/ExercisePage' element={<ExercisePage />} />
      <Route path='/Bmi' element={<BMICalculator />} />
      <Route path='/Workout_Show' element={<Workout_Show />} />
      <Route path='/All_Workout' element={<All_Workout />} />
      <Route path='/TrainerExercisePage/:id' element={<ExercisePage2 />} />
      <Route path='/Workout_Show2/:id' element={<Workout_Show2 />} />
      <Route path='/Trainer_Insert' element={<Trainer_Insert />} />
      <Route path='/Trainer_Show' element={admintoken != null ? (<Trainer_Show />) : (<Navigate to="/login" replace />)} />
      <Route path='/Client_Show' element={<Client_Show />} />
      <Route path='/Client_Detail/:id' element={<Client_Detail />} />
      <Route path='/TestEmojiPicker' element={<TestEmojiPicker />} />
      <Route path='/Expense_Show' element={admintoken != null ? (<Expense_Show />) : (<Navigate to="/login" replace />)} />
      <Route path='/Expense_Edit/:id' element={admintoken != null ? (<Expense_Edit />) : (<Navigate to="/login" replace />)} />
      <Route path='/Expense_Insert' element={admintoken != null ? (<Expense_Insert />) : (<Navigate to="/login" replace />)} />
    </Routes>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
  <Router>
    <Header />
    <Nav />
    <AppRoutes />
0


  </Router>
  </PersistGate>
  </Provider>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
