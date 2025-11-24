/**
 * Footer Component
 */

'use client';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center">
          <p>&copy; 2024 Builder Score. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="/faq" className="hover:text-pink-400">FAQ</a>
            <a href="/contact" className="hover:text-pink-400">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
