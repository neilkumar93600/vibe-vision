export default function ContentLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 p-4">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    );
  }