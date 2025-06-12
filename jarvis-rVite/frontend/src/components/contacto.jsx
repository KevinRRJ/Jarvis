import React, { useState } from "react";

const Contacto = () => {
  const [form, setForm] = useState({ nombre: "", correo: "", mensaje: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes integrar emailjs o tu backend si quieres enviar el mensaje.
    console.log("Mensaje enviado:", form);
    alert("¡Gracias por tu mensaje! Me pondré en contacto pronto.");
    setForm({ nombre: "", correo: "", mensaje: "" });
  };

  return (
    <section id="contacto" className="max-w-4xl mx-auto px-4 py-20 text-white">
      <h2 className="text-3xl font-bold text-center mb-8">CONTACTO</h2>
      <form
        onSubmit={handleSubmit}
        className="bg-zinc-800 p-6 rounded-xl border border-zinc-700 shadow-md space-y-4"
      >
        <div>
          <label className="block text-sm mb-1" htmlFor="nombre">
            Nombre
          </label>
          <input
            id="nombre"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded bg-zinc-900 border border-zinc-600 text-white focus:outline-none focus:ring-2 focus:ring-pink-600"
            placeholder="Tu nombre"
          />
        </div>

        <div>
          <label className="block text-sm mb-1" htmlFor="correo">
            Correo Electrónico
          </label>
          <input
            id="correo"
            name="correo"
            type="email"
            value={form.correo}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded bg-zinc-900 border border-zinc-600 text-white focus:outline-none focus:ring-2 focus:ring-pink-600"
            placeholder="tucorreo@example.com"
          />
        </div>

        <div>
          <label className="block text-sm mb-1" htmlFor="mensaje">
            Mensaje
          </label>
          <textarea
            id="mensaje"
            name="mensaje"
            rows="5"
            value={form.mensaje}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded bg-zinc-900 border border-zinc-600 text-white focus:outline-none focus:ring-2 focus:ring-pink-600"
            placeholder="¿Cómo puedo ayudarte?"
          ></textarea>
        </div>

        <button
          type="submit"
          className="bg-pink-600 hover:bg-pink-700 transition-colors px-6 py-2 rounded text-white font-semibold"
        >
          Enviar Mensaje
        </button>
      </form>
    </section>
  );
};

export default Contacto;