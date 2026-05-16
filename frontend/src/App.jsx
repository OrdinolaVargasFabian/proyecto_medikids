import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './app/router';

export default function App() {
  // App.jsx ahora es solo un inyector de rutas, como debe ser en producción.
  return <RouterProvider router={router} />;
}