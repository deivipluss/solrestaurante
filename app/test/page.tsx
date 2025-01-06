"use client";

import React from "react";

const Page = () => {
  return (
    <div className="font-sans bg-white text-black">
      {/* Header Section */}
      <header className="fixed top-0 left-0 w-full bg-white bg-opacity-80 p-4 shadow-md z-10">
        <div className="flex justify-between items-center max-w-6xl mx-auto">
          <div className="text-xl font-semibold text-yellow-500">Sol de Oro</div>
          <nav className="space-x-8">
            <a href="#" className="text-black">Home</a>
            <a href="#" className="text-black">Menu</a>
            <a href="#" className="text-black">About Us</a>
            <a href="#" className="text-black">Reservations</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex items-center justify-between p-16 bg-cover bg-center h-screen text-white" style={{ backgroundImage: 'url(/hero-image.jpg)' }}>
        <div className="max-w-xl">
          <h1 className="text-5xl font-bold">Tradition & Flavor Since 1975</h1>
          <p className="text-xl mt-4">Masters of Charcoal-Grilled Chicken & Premium Cuts</p>
          <div className="mt-6 space-x-4">
            <button className="bg-yellow-500 text-white px-6 py-2 rounded-full">Reserve a Table</button>
            <button className="border-2 border-yellow-500 text-yellow-500 px-6 py-2 rounded-full">Order Now</button>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-yellow-500 text-white py-4 text-center">
        <p>&copy; 2023 Sol de Oro. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Page;
