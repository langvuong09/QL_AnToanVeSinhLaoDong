export default function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="block lg:flex justify-between h-screen">
      {/* hinh minh hoa */}
      <div className="hidden md:block md:flex-4 lg:flex-6">
        <img
          className="w-full h-full object-cover p-10"
          src="login.png"
          alt="login image"
        />
      </div>

      {/* pages (login/signup)*/}
      <div className="flex-4">
        {children}
      </div>
    </div>
  )
}