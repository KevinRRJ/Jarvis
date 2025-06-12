import React, { useState } from "react";
import logo from "../assets/logo-j.png";

const sections = [
  { text: "Inicio", id: "inicio" },
  { text: "Qué ofrecemos", id: "ofrecemos" },
  { text: "Acerca de", id: "acerca" },
  { text: "Contacto", id: "contacto" },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  // Función para hacer scroll suave
  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
      setMenuOpen(false); // Cierra menú móvil si estaba abierto
    }
  };

  return (
    <nav className="bg-transparent w-full px-6 py-4 max-w-7xl mx-auto relative z-50 flex items-center justify-between">
      {/* Logo */}
      <div className="flex items-center">
        <img src={logo} alt="Logo" className="w-36 h-auto" />
      </div>

      {/* Hamburger Button (solo en móvil) */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="md:hidden text-white text-3xl focus:outline-none"
      >
        ☰
      </button>

      {/* Links para escritorio */}
      <ul className="hidden md:flex items-center gap-8">
        {sections.map(({ text, id }) => (
          <li key={id}>
            <button
              onClick={() => scrollToSection(id)}
              className="relative text-white after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-purple-500 after:transition-all after:duration-300 hover:after:w-full"
            >
              {text}
            </button>
          </li>
        ))}
      </ul>

      {/* Botón de sesión (solo en escritorio) */}
      <button
        id="btnLogin"
        className="hidden md:block bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
      >
        Inicia sesión
      </button>

      {/* Menú desplegable en móvil */}
      <div
        className={`lg:hidden absolute top-full left-0 w-full transition-[max-height] duration-500 overflow-hidden bg-transparent ${
          menuOpen ? "max-h-60" : "max-h-0"
        }`}
      >
        <ul className="flex flex-col items-start px-6 pt-2">
          {sections.map(({ text, id }) => (
            <li key={id} className="py-2">
              <button
                onClick={() => scrollToSection(id)}
                className="relative text-white after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-purple-500 after:transition-all after:duration-800 hover:after:w-full"
              >
                {text}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;