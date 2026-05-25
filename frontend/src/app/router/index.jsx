import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { PublicLayout } from '../../layouts/PublicLayout';
import { LoginPage } from '../../features/auth';
import { AdminLoginPage } from '../../features/auth/AdminLoginPage';
import { AdminDiscoverPage } from '../../features/auth/AdminDiscoverPage';
import { LandingPage } from '../../features/landing';
import { RouteLoader } from '../components/skeletons/RouteLoader';

const PrivateRoute = lazy(() => import('../../layouts/PrivateRoute').then(m => ({ default: m.PrivateRoute })));
const DashboardLayout = lazy(() => import('../../layouts/DashboardLayout').then(m => ({ default: m.DashboardLayout })));

const DashboardHome = lazy(() => import('../../features/padres/pages/DashboardHome').then(m => ({ default: m.DashboardHome })));
const ChildrenProfiles = lazy(() => import('../../features/padres/pages/ChildrenProfiles').then(m => ({ default: m.ChildrenProfiles })));
const ConsultationHistory = lazy(() => import('../../features/padres/pages/ConsultationHistory').then(m => ({ default: m.ConsultationHistory })));
const MyProfile = lazy(() => import('../../features/padres/pages/MyProfile').then(m => ({ default: m.MyProfile })));
const BookAppointment = lazy(() => import('../../features/padres/pages/BookAppointment').then(m => ({ default: m.BookAppointment })));
const AdminDashboard = lazy(() => import('../../features/admin/pages/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const DoctorsList = lazy(() => import('../../features/admin/pages/DoctorsList').then(m => ({ default: m.DoctorsList })));
const AdminPatients = lazy(() => import('../../features/admin/pages/AdminPatients').then(m => ({ default: m.AdminPatients })));
const AdminAppointments = lazy(() => import('../../features/admin/pages/AdminAppointments').then(m => ({ default: m.AdminAppointments })));
const AdminIncidents = lazy(() => import('../../features/admin/pages/AdminIncidents').then(m => ({ default: m.AdminIncidents })));
const AdminPayments = lazy(() => import('../../features/admin/pages/AdminPayments').then(m => ({ default: m.AdminPayments })));
const AdminRoles = lazy(() => import('../../features/admin/pages/AdminRoles').then(m => ({ default: m.AdminRoles })));
const CreateAdmin = lazy(() => import('../../features/admin/pages/CreateAdmin').then(m => ({ default: m.CreateAdmin })));
const UserManagement = lazy(() => import('../../features/admin/pages/UserManagement').then(m => ({ default: m.UserManagement })));
const DoctorDashboard = lazy(() => import('../../features/doctor/pages/DoctorDashboard').then(m => ({ default: m.DoctorDashboard })));
const PatientHistory = lazy(() => import('../../features/doctor/pages/PatientHistory').then(m => ({ default: m.PatientHistory })));
const DoctorIncidents = lazy(() => import('../../features/doctor/pages/DoctorIncidents').then(m => ({ default: m.DoctorIncidents })));
const DoctorSchedules = lazy(() => import('../../features/doctor/pages/DoctorSchedules').then(m => ({ default: m.DoctorSchedules })));

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
    path: '/admin',
    element: <AdminDiscoverPage />
  },

  {
    path: '/admin/:hash',
    element: <AdminLoginPage />
  },

  {
    element: <Suspense fallback={<RouteLoader />}><PrivateRoute /></Suspense>,
    children: [
      {
        element: <Suspense fallback={<RouteLoader />}><DashboardLayout /></Suspense>,
        children: [
          {
            path: '/padres',
            element: <Suspense fallback={<RouteLoader />}><DashboardHome /></Suspense>
          },
          {
            path: '/padres/hijos',
            element: <Suspense fallback={<RouteLoader />}><ChildrenProfiles /></Suspense>
          },
          {
            path: '/padres/historial',
            element: <Suspense fallback={<RouteLoader />}><ConsultationHistory /></Suspense>
          },
          {
            path: '/padres/perfil',
            element: <Suspense fallback={<RouteLoader />}><MyProfile /></Suspense>
          },
          {
            path: '/padres/agendar',
            element: <Suspense fallback={<RouteLoader />}><BookAppointment /></Suspense>
          },
          {
            path: '/doctor',
            element: <Suspense fallback={<RouteLoader />}><DoctorDashboard /></Suspense>
          },
          {
            path: '/doctor/paciente/:id',
            element: <Suspense fallback={<RouteLoader />}><PatientHistory /></Suspense>
          },
          {
            path: '/doctor/incidencias',
            element: <Suspense fallback={<RouteLoader />}><DoctorIncidents /></Suspense>
          },
          {
            path: '/doctor/horarios',
            element: <Suspense fallback={<RouteLoader />}><DoctorSchedules /></Suspense>
          },
          {
            path: '/admin/dashboard',
            element: <Suspense fallback={<RouteLoader />}><AdminDashboard /></Suspense>
          },
          {
            path: '/admin/medicos',
            element: <Suspense fallback={<RouteLoader />}><DoctorsList /></Suspense>
          },
          {
            path: '/admin/pacientes',
            element: <Suspense fallback={<RouteLoader />}><AdminPatients /></Suspense>
          },
          {
            path: '/admin/citas',
            element: <Suspense fallback={<RouteLoader />}><AdminAppointments /></Suspense>
          },
          {
            path: '/admin/incidentes',
            element: <Suspense fallback={<RouteLoader />}><AdminIncidents /></Suspense>
          },
          {
            path: '/admin/pagos',
            element: <Suspense fallback={<RouteLoader />}><AdminPayments /></Suspense>
          },
          {
            path: '/admin/roles',
            element: <Suspense fallback={<RouteLoader />}><AdminRoles /></Suspense>
          },
          {
            path: '/admin/crear-admin',
            element: <Suspense fallback={<RouteLoader />}><CreateAdmin /></Suspense>
          },
          {
            path: '/admin/usuarios',
            element: <Suspense fallback={<RouteLoader />}><UserManagement /></Suspense>
          },
        ]
      }
    ]
  }
]);
