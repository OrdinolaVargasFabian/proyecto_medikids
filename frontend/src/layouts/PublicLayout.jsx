import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar, Footer } from '../features/landing';

export const PublicLayout = () => {
  return (
    // ¡Adiós bg-white! Hola bg-transparent. 
    // Además, personalicé el color de selección para que sea verde MediKids
    <div className="min-h-screen bg-transparent selection:bg-medi-200/50 selection:text-medi-900">
      <Navbar />
      <main>
        {/* Aquí se inyectan dinámicamente las páginas (Inicio, Contacto, etc.) */}
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};