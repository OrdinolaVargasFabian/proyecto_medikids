import { createBrowserRouter } from 'react-router-dom';
import { PublicLayout } from '../../layouts/PublicLayout';
import { DashboardLayout } from '../../layouts/DashboardLayout'; 
import { LandingPage } from '../../features/landing';
import { LoginPage } from '../../features/auth';
import {
  DashboardHome,
  ChildrenProfiles,
  ConsultationHistory,
  MyProfile,
  BookAppointment,
} from '../../features/padres';
import {
  AdminDashboard,
  DoctorsList,
} from '../../features/admin';
import {
  DoctorDashboard,
  PatientHistory,
  DoctorIncidents,
} from '../../features/doctor';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: <LandingPage />
      }
    ]
  },
  
  {
    path: '/login',
    element: <LoginPage />
  },

  {
    element: <DashboardLayout />,
    children: [
      {
        path: '/padres',
        element: <DashboardHome />
      },
      {
        path: '/padres/hijos',
        element: <ChildrenProfiles />
      },
      {
        path: '/padres/historial',
        element: <ConsultationHistory />
      },
      {
        path: '/padres/perfil',
        element: <MyProfile />
      },
      {
        path: '/padres/agendar',
        element: <BookAppointment />
      },
      {
        path: '/doctor',
        element: <DoctorDashboard />
      },
      {
        path: '/doctor/paciente/:id',
        element: <PatientHistory />
      },
      {
        path: '/doctor/incidencias',
        element: <DoctorIncidents />
      },
      {
        path: '/admin',
        element: <AdminDashboard />
      },
      {
        path: '/admin/medicos',
        element: <DoctorsList />
      },
    ]
  }
]);
