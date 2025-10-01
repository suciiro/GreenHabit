"use client";

export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 w-full bg-green-700 text-white py-3 text-center z-50">
      <p className="text-sm text-green-200 mb-1">
        © {new Date().getFullYear()} GreenHabit
      </p>
    </footer>
  );
}
