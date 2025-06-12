import React from "react";

const AcercaDe = () => {
  return (
    <section id="acerca" className="max-w-4xl mx-auto px-4 py-20 text-white">
      <h2 className="text-3xl font-bold text-center mb-8">ACERCA DE MÍ</h2>
      <div className="bg-zinc-800 p-6 rounded-xl border border-zinc-700 shadow-md">
        <p className="mb-4 text-lg">
          ¡Hola! Soy Kevinn, Ingeniero Mecatrónico egresado de la <strong>Facultad de Ingeniería de la UNAM</strong>.
          Me apasiona la tecnología, el desarrollo de soluciones inteligentes y la creación de proyectos que integran <strong>software y hardware</strong>.
        </p>
        <p className="mb-4 text-lg">
          Me gusta trabajar con <strong>inteligencia artificial</strong>, microcontroladores como el <strong>ESP32</strong> y la <strong>Raspberry Pi</strong>, así como explorar nuevas formas de interacción con la tecnología, como lo hago con <strong>Jarvis</strong>, mi asistente de voz personalizado.
        </p>
        <p className="text-lg">
          También disfruto de la música urbana, el diseño, el trabajo en equipo y los retos tecnológicos que requieren creatividad y lógica. Mi meta es seguir creciendo como ingeniero y como creador.
        </p>
      </div>
    </section>
  );
};

export default AcercaDe;