export const AuthLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen w-full font-sans bg-white text-gray-900 selection:bg-medi-900 selection:text-white">

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
