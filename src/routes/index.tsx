import React from 'react';
import { Routes, Route } from 'react-router-dom';

import SignIn from '../views/Signin'
import SignUp from '../views/Signup';
import Forgotpassword from '../views/Forgotpassword';
import Page404 from '../views/Page404';

import Dashboard from '../views/Dashboard';

/**
 * Routes component containing routes for the whole application
 */
const RoutesController = () => (
  <Routes>
    <Route path="/" element={<SignIn />} />
    <Route path="/sign-in" element={<SignIn />} />
    <Route path="/sign-up" element={<SignUp />} />
    <Route path="/forgot-password" element={<Forgotpassword />} />

    {/* <Route path="/dashboard" element={<Dashboard />} /> */}

    <Route path="*" element={<Page404 />} />
  </Routes>
);

export default RoutesController;