export default function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex">
      {/* hinh minh hoa */}
      <div className="h-20 w-40">
        <img 
        className="h-full w-full"
        src="next.svg"
         alt="" 
        />
      </div>
      {/* pages (login/signup)*/}
      {children}
    </div>
  )
}