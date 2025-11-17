export const UserBar = () => {
  const isMobile = window.innerWidth < 500;

  return (
    <div
      className="bg-white p-1 sm:pr-1 pr-4 rounded-3xl flex items-center gap-2 cursor-pointer
        shadow-md border border-[#d0e7ff] hover:shadow-lg hover:scale-105 transition
        "
    >
      <figure>
        <img src="/user-img.png" alt="User" />
      </figure>
      {!isMobile && <p className="text-gray-900">John Doe</p>}
    </div>
  );
};
