export default function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex justify-center h-screen">
      {/* hinh minh hoa */}
      <div className="w-1/2">
        <img
          className="w-full h-full object-cover"
          src="login.png"
          alt="login image"
        />
      </div>

      {/* pages (login/signup)*/}
      <div className="w-1/2">
        {children}
      </div>
    </div>
  )
}