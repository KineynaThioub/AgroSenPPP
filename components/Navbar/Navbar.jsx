"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image"; // si tu es dans Next.js
import ProfileMenu from "./../ProfileMenu/ProfileMenu"; // assure-toi que ce composant existe
import "./Navbar.css";

const Navbar = () => {
  const [activeMenu, setActiveMenu] = useState("Home");
  const [user, setUser] = useState(null);

  const menuItems = [
    { id: "Home", label: "Home" },
    { id: "Dashboard", label: "Dashboard" },
    { id: "Exploration", label: "Exploration" },
    { id: "Forum", label: "Forum" },
    { id: "IA/Quiz", label: "IA/Quiz" }
  ];

  useEffect(() => {
    // Exemple de récupération de session (factice)
    fetch("/api/session")
      .then(res => res.json())
      .then(data => {
        if (data.user) setUser(data.user);
      });
  }, []);

  const handleMenuClick = (menuId) => {
    setActiveMenu(menuId);
  };

  return (
    <nav className="navbar">
      <div className="logo">🌿AgriSEN.</div>

      <ul className="navbar-menu">
        {menuItems.map((item) => (
          <li
            key={item.id}
            className={activeMenu === item.id ? "active" : ""}
            onClick={() => handleMenuClick(item.id)}
          >
            {item.label}
          </li>
        ))}
      </ul>

      <div className="navbar-right">
        <div className="navbar-search-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>

        {!user ? (
          <a href="/signin" className="sign-in-button">Sign In</a>
        ) : (
          <div className="relative">
            <Image
              src={user.photo || "/default-avatar.png"}
              alt="Profile"
              width={40}
              height={40}
              className="rounded-full cursor-pointer"
              onClick={() => {
                const menu = document.getElementById("profileMenu");
                if (menu) menu.classList.toggle("hidden");
              }}
            />
            <ProfileMenu user={user} />
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
