import { Link } from 'react-router-dom';

export const AuthLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen w-full font-sans bg-white text-gray-900 selection:bg-medi-900 selection:text-white">

      {/* Botón Home */}
      <Link
        to="/"
        id="auth-home-btn"
        title="Volver al inicio"
        className="absolute top-4 left-4 z-50 flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-medi-300 hover:bg-medi-50 transition-all duration-200 text-gray-600 hover:text-medi-700 text-sm font-medium group"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-0.5">
          <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
          <polyline points="9 21 9 12 15 12 15 21" />
        </svg>
        <span className="hidden sm:inline">Inicio</span>
      </Link>

      {/* LADO IZQUIERDO: Imagen / Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-medi-50 flex-col px-12 xl:px-24 py-16 justify-center overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-medi-200/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[350px] h-[350px] rounded-full bg-medi-300/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 w-full max-w-xl mx-auto">
          <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4 leading-[1.15]">
            El cuidado de tus hijos, <span className="text-medi-600">a un clic</span>
          </h1>
          <p className="text-lg text-gray-600 font-medium leading-relaxed max-w-md">
            Agenda citas, revisa historiales y conecta con especialistas pediátricos.
          </p>
        </div>
      </div>

      {/* LADO DERECHO: Slot para formulario */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-12 md:px-20 lg:px-24 py-12 overflow-y-auto">
        <div className="w-full max-w-[380px] mx-auto lg:mx-0 lg:ml-auto lg:mr-auto">
          {children}
        </div>
      </div>
    </div>
  );
};
