import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("responsable");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Bienvenue " + data.user.name + " (" + data.user.role + ")");
        // Redirige vers le dashboard, stocke le token, etc.
      } else {
        setMessage(data.message);
      }
    } catch {
      setMessage("Erreur de connexion");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-20 p-6 bg-white rounded shadow">
      <h2 className="text-xl mb-4">Connexion</h2>
      <input
        type="email"
        required
        placeholder="Email"
        className="block w-full mb-2 border p-2"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <input
        type="password"
        required
        placeholder="Mot de passe"
        className="block w-full mb-2 border p-2"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <select
        className="block w-full mb-4 border p-2"
        value={role}
        onChange={e => setRole(e.target.value)}
      >
        <option value="responsable">Responsable d'agence</option>
        <option value="charge">Chargé de risques</option>
      </select>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Se connecter</button>
      {message && <div className="mt-4 text-red-500">{message}</div>}
    </form>
  );
}