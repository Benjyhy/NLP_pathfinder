import React from 'react';
import { Navigate } from 'react-router-dom';
export function RequireAuth({
  children,
}: {
  children: JSX.Element;
}): JSX.Element {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    localStorage.setItem('Unauthorized', 'true');
    return <Navigate to='/' replace />;
  } else {
    localStorage.removeItem('Unauthorized');
    return children;
  }
}
