export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} RoadCare. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
