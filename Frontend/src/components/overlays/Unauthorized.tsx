const Unauthorized = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full z-50 bg-[#2C2926] bg-opacity-95 flex flex-col items-center justify-center text-white">
      <h1 className="text-3xl font-bold mb-4">403 - Forbidden</h1>
      <p className="text-lg text-gray-300">
        You are not authorized to access this page.
      </p>
    </div>
  );
};

export default Unauthorized;
