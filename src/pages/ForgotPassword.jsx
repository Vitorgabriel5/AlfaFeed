import { useState } from "react";
import api from "../services/api";

function ForgotPassword() {

  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      await api.post(
        `/auth/forgot-password?email=${email}`
      );

      alert("Email enviado com sucesso");

    } catch (error) {

      console.error(error);

      alert("Erro ao enviar email");
    }
  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">

        <h1 className="text-2xl font-bold mb-6 text-center">
          Recuperar senha
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          <input
            type="email"
            placeholder="Digite seu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-3 rounded-lg"
          />

          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-3 rounded-lg"
          >
            Enviar email
          </button>

        </form>

      </div>

    </div>
  );
}

export default ForgotPassword;