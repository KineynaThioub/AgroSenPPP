"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";


export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    mot_de_passe: ""
  });
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Vérifie si un utilisateur est déjà connecté
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      try {
        const userData = JSON.parse(user);
        // Redirection vers le tableau de bord approprié
        const dashboardPath = getDashboardPath(userData.type_utilisateur);
        router.push(dashboardPath);
      } catch (error) {
        // En cas d'erreur, supprimer les données corrompues
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      }
    }
  }, [router]);

 /* const getDashboardPath = (userType) => {
    switch (userType) {
      case 'agriculteur': return '/dashboard/agriculteur';
      case 'syndic': return '/dashboard/syndic';
      default: return '/dashboard';
    }
  };*/

 const getDashboardPath = (userType) => {
      return '/decouvrir';
 };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Réinitialiser le message d'erreur quand l'utilisateur modifie les champs
    if (message.type === "error") {
      setMessage({ text: "", type: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Empêche le rechargement de la page
    await login();
  };

  const login = async () => {
    setIsSubmitting(true);
    setMessage({ text: "", type: "" });

    // Validation des champs
    if (!formData.username || !formData.mot_de_passe) {
      setMessage({ text: "Veuillez remplir tous les champs.", type: "error" });
      setIsSubmitting(false);
      return;
    }

    try {
      const loginData = {
        username: formData.username.trim(),
        mot_de_passe: formData.mot_de_passe
      };

      // Chemin d'API corrigé
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
        credentials: 'include'
      });

      // Afficher l'erreur brute si on ne peut pas parser en JSON
      if (!response.ok && response.status !== 401) {
        const text = await response.text();
        console.error('Réponse brute:', text);
        throw new Error(`Erreur ${response.status}: ${text}`);
      }

      const data = await response.json();

      if (response.ok) {
        setMessage({ 
          text: "Connexion réussie ! Redirection...", 
          type: "success" 
        });
        
        // Stockage sécurisé des informations utilisateur
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        // Redirection selon le type d'utilisateur
        const dashboardPath = getDashboardPath(data.user.type_utilisateur);
        setTimeout(() => {
          router.push(dashboardPath);
        }, 1000);
      } else {
        setMessage({ 
          text: data.message || "Nom d'utilisateur ou mot de passe incorrect", 
          type: "error" 
        });
      }
    } catch (error) {
      console.error('Erreur de connexion:', error);
      setMessage({ 
        text: `Erreur de connexion au serveur: ${error.message}`, 
        type: "error" 
      });
    } finally {
      setIsSubmitting(false);
    }

  return (
    <div className="flex justify-center min-h-screen items-center bg-gradient-to-br from-green-50 to-gray-100">
      <div className="w-full max-w-md px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Content de vous revoir
              </h1>
              <p className="text-gray-600">
                Connectez-vous à votre espace personnel
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  Nom d'utilisateur
                </label>
                <input
                  id="username"
                  type="text"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                  placeholder="Votre nom d'utilisateur"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  autoComplete="username"
                />
              </div>

              <div>
                <label htmlFor="mot_de_passe" className="block text-sm font-medium text-gray-700 mb-1">
                  Mot de passe
                </label>
                <input
                  id="mot_de_passe"
                  type="password"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                  placeholder="••••••••"
                  name="mot_de_passe"
                  value={formData.mot_de_passe}
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                />
                <div className="flex justify-end mt-1">
                  <Link 
                    href="/auth/forgot-password" 
                    className="text-sm text-green-600 hover:underline"
                  >
                    Mot de passe oublié ?
                  </Link>
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-3 px-4 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Connexion en cours..." : "Se connecter"}
              </button>

              {message.text && (
                <div className={`p-3 rounded-lg ${message.type === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}>
                  {message.text}
                </div>
              )}

              <div className="text-center text-sm text-gray-600">
                Vous n'avez pas de compte ?{" "}
                <Link href="/auth/register" className="text-green-600 font-semibold hover:underline">
                  S'inscrire
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
}