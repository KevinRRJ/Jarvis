import React from "react";
import { ArrowRight } from "lucide-react";

const features = [
  {
    title: "Control de Spotify por Voz",
    description:
      "Jarvis puede reproducir música, cambiar de canción, pausar, subir o bajar el volumen en Spotify usando solo tu voz. Disfruta tu música sin mover un dedo.",
  },
  {
    title: "Asistente Personal Inteligente",
    description:
      "Te dice la hora, te saluda cuando te conectas y se despide cuando te vas. Jarvis está diseñado para interactuar contigo de forma natural y fluida.",
  },
  {
    title: "Automatización de Aplicaciones",
    description:
      "Abre y cierra tus aplicaciones favoritas con simples comandos. Ahorra tiempo y mantén tu entorno de trabajo bajo control sin usar el teclado.",
  },
  {
    title: "Funciones Futuras: Reportes e IoT",
    description:
      "Estamos trabajando en funciones como generación automática de reportes en PDF, HTML o Docs, presentaciones y control de dispositivos IoT desde una sola plataforma.",
  },
];

const Ofrecemos = () => {
  return (
    <section id="ofrecemos" className="max-w-7xl mx-auto px-4 py-20">
      <h2 className="text-3xl font-bold text-center text-white mb-12">
        ¿QUÉ PUEDE HACER JARVIS POR TI?
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, idx) => (
          <div
            key={idx}
            className="bg-zinc-800 p-6 rounded-xl border-2 border-transparent hover:border-white transition-all duration-300"
          >
            <span className="inline-block bg-pink-600 text-white px-3 py-1 mb-4 rounded text-2xl">
              {idx + 1}
            </span>
            <h4 className="text-white text-lg font-semibold mb-2">
              {feature.title}
            </h4>
            <p className="text-gray-300 mb-4 text-sm">{feature.description}</p>
            <a
              href="#"
              className="text-white flex items-center gap-1 hover:text-pink-600 transition-all"
            >
              Únete Ahora <ArrowRight size={16} />
            </a>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Ofrecemos;
