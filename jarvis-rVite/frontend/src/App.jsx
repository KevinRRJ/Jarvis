import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./App.css";
import Navbar from './components/Navbar';
import Ofrecemos from "./components/caracteristicas";
import AcercaDe from "./components/about";
import Contacto from "./components/contacto";

const App = () => {
  const WAKE_WORDS = useMemo(() => ["jarvis", "yarbis", "yarvis"], []);
  const DEFAULT_WAKE_WORD = useMemo(() => "jarvis", []);

  const [listening, setListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [log, setLog] = useState([]);
  const [autoScroll, setAutoScroll] = useState(true);
  const recognitionRef = useRef(null);
  const voiceEnabledRef = useRef(voiceEnabled);
  const logEndRef = useRef(null);
  const logContainerRef = useRef(null);

  useEffect(() => {
    voiceEnabledRef.current = voiceEnabled;
  }, [voiceEnabled]);

  useEffect(() => {
    if (autoScroll && logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [log, autoScroll]);

  const speak = useCallback((text) => {
    if (!voiceEnabledRef.current) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "es-MX";
    utterance.pitch = 1.2;
    utterance.rate = 1;
    const voices = speechSynthesis.getVoices();
    utterance.voice = voices.find(v => v.lang === "es-MX") || voices[0];
    speechSynthesis.speak(utterance);
  }, []);

  const initializeRecognition = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Tu navegador no soporta reconocimiento de voz");
      return null;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "es-MX";
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);

    recognition.onresult = async (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();
      const detectedWord = WAKE_WORDS.find(word => transcript.includes(word));
      
      if (detectedWord) {
        const command = transcript.replace(detectedWord, "").trim();
        setLog(prev => [...prev, `🗣️ ${command}`]);

        try {
          const res = await fetch("http://localhost:5000/command", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ command }),
          });

          const data = await res.json();
          
          if (data.es_saludo || data.es_hora || data.es_despedida) {
            setLog(prev => [...prev, `🤖 ${data.message}`]);
            speak(data.message);
            return;
          }

          setLog(prev => [...prev, `🤖 ${data.message}`]);
          speak(data.message);
        } catch (error) {
          setLog(prev => [...prev, `❌ Error enviando comando`]);
        }
      }
    };

    return recognition;
  }, [speak, WAKE_WORDS]);

  useEffect(() => {
    if (!recognitionRef.current) {
      recognitionRef.current = initializeRecognition();
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
    };
  }, [initializeRecognition]);

  useEffect(() => {
    if (!recognitionRef.current) return;

    if (listening) {
      recognitionRef.current.start();
    } else {
      recognitionRef.current.stop();
    }
  }, [listening]);

  const toggleListening = () => setListening(prev => !prev);

  const toggleVoice = () => {
    setVoiceEnabled(prev => {
      const newVal = !prev;
      setLog(log => [...log, `🔈 Voz ${newVal ? "activada" : "desactivada"}`]);
      return newVal;
    });
  };

  const clearLog = () => {
    setLog([]);
    setAutoScroll(true);
  };

  const handleScroll = () => {
    if (logContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = logContainerRef.current;
      setAutoScroll(scrollHeight - (scrollTop + clientHeight) < 50);
    }
  };

  return (
    <>
    
      <Navbar />

      <div className="blur" style={{ top: "20%", left: "10%" }}></div>
      <div className="blur" style={{ bottom: "20%", right: "10%" }}></div>

      <div className="flex flex-col items-center justify-center w-full px-4 pt-24 text-white max-w-4xl mx-auto mb-36">
        <h1 className="mb-8 text-4xl md:text-5xl font-bold text-center">🧠 {DEFAULT_WAKE_WORD.charAt(0).toUpperCase() + DEFAULT_WAKE_WORD.slice(1)}</h1>
        
        <p className="mb-8 text-center text-gray-300 text-base md:text-lg px-2">
          Di <span className="font-semibold text-purple-400">"{DEFAULT_WAKE_WORD}"</span> seguido de un comando.
        </p>

        <div className="mb-6 flex flex-col sm:flex-row gap-3">
          <button
            onClick={toggleListening}
            className="px-6 py-2 font-semibold text-white bg-purple-600 rounded hover:bg-purple-700 transition"
          >
            {listening ? "🛑 Detener escucha" : "🎙️ Iniciar escucha"}
          </button>

          <button
            onClick={toggleVoice}
            className="px-6 py-2 font-semibold text-white bg-gray-600 rounded hover:bg-gray-700 transition"
          >
            {voiceEnabled ? "🔇 Desactivar voz" : "🔊 Activar voz"}
          </button>
        </div>

        <div className="mb-6">
          <h2 className="text-center text-green-400 text-lg md:text-xl">
            {listening ? "🎙️ Escuchando..." : "🛑 Detenido"}
          </h2>
        </div>

        <div className="w-full max-w-xl p-6 bg-gray-800 rounded-lg shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">📝 Log:</h3>
            <button
              onClick={clearLog}
              className="px-3 py-1 text-sm text-white bg-purple-600 rounded hover:bg-purple-700 transition"
            >
              Limpiar
            </button>
          </div>
          <div
            ref={logContainerRef}
            onScroll={handleScroll}
            className="space-y-1 overflow-y-auto text-sm max-h-64 scroll-smooth"
          >
            {log.map((line, idx) => (
              <div key={idx}>{line}</div>
            ))}
            <div ref={logEndRef} />
          </div>
        </div>
      </div>
      
      

      <Ofrecemos />
      <AcercaDe />
      <Contacto />

    </>
  );
};

export default App;