export default function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <p className="text-sm text-gray-500">
          &copy; {new Date().getFullYear()} MalesBeliGrocery. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
