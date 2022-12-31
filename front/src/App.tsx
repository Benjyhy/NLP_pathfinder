import React, { useEffect, useState } from 'react';
import { GlobalStyles } from './styles/GlobalStyles';
import { Flex, Box } from 'reflexbox';
import { Choices } from './components/Choice';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { Register } from './pages/Register';
import { Login } from './pages/Login';
import { Recognise } from './pages/Recognise';
import { RequireAuth } from './components/RequireAuth';

const App = () => {
  return (
    <React.Fragment>
      <GlobalStyles />
      <Flex minHeight={'100vh'} pt='6' justifyContent='center'>
        <Router>
          <Routes>
            <Route path='/' element={<Choices />} />
            <Route
              path='/register'
              element={
                <RequireAuth>
                  <Register />
                </RequireAuth>
              }
            />
            <Route path='/login' element={<Login />} />
            <Route
              path='/recognise'
              element={
                <RequireAuth>
                  <Recognise />
                </RequireAuth>
              }
            />
            <Route path='*' element={<Navigate to='/' replace />} />
          </Routes>
        </Router>
      </Flex>
    </React.Fragment>
  );
};

export default App;
