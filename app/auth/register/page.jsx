"use client"; // ✅ Ceci doit être la première ligne du fichier

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    username: "", // Ajout du champ username
    email: "",
    telephone: "", // Ajout du champ téléphone
    mot_de_passe: "",
    confirm_mot_de_passe: "",
    type_utilisateur: "utilisateur",
    // Champs spécifiques aux agriculteurs
    region: "",
    cultures: "",
    superficie: "",
    // Champs spécifiques aux syndicats
    nom_syndicat: "",
    description_syndicat: "",
    nombre_membres: "",
    regions_couvertes: ""
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [regionsSenegal, setRegionsSenegal] = useState([]);

  // Charger les régions du Sénégal
  useEffect(() => {
    const regions = [
      "Dakar", "Thiès", "Saint-Louis", "Ziguinchor", "Tambacounda",
      "Kaolack", "Kolda", "Matam", "Fatick", "Louga", "Kaffrine", 
      "Kédougou", "Sédhiou", "Diourbel"
    ];
    setRegionsSenegal(regions);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Effacer l'erreur spécifique lorsque l'utilisateur modifie le champ
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validation des champs de base
    if (!formData.nom.trim()) newErrors.nom = "Le nom est requis";
    if (!formData.prenom.trim()) newErrors.prenom = "Le prénom est requis";
    
    // Validation du username
    if (!formData.username.trim()) {
      newErrors.username = "Le nom d'utilisateur est requis";
    } else if (formData.username.length < 3) {
      newErrors.username = "Le nom d'utilisateur doit contenir au moins 3 caractères";
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = "Le nom d'utilisateur ne peut contenir que des lettres, chiffres et underscores";
    }
    
    // Validation de l'email
    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Veuillez entrer une adresse email valide";
    }
    
    // Validation du téléphone (optionnel mais validé si renseigné)
    if (formData.telephone && !/^[0-9+\s]{8,15}$/.test(formData.telephone)) {
      newErrors.telephone = "Format de téléphone invalide";
    }
    
    // Validation du mot de passe
    if (!formData.mot_de_passe) {
      newErrors.mot_de_passe = "Le mot de passe est requis";
    } else if (formData.mot_de_passe.length < 8) {
      newErrors.mot_de_passe = "Le mot de passe doit contenir au moins 8 caractères";
    }
    
    // Confirmation du mot de passe
    if (formData.mot_de_passe !== formData.confirm_mot_de_passe) {
      newErrors.confirm_mot_de_passe = "Les mots de passe ne correspondent pas";
    }

    // Validations spécifiques au type d'utilisateur
    if (formData.type_utilisateur === "agriculteur") {
      if (!formData.region) newErrors.region = "Veuillez sélectionner une région";
      if (!formData.cultures.trim()) newErrors.cultures = "Veuillez indiquer vos cultures";
    }

    if (formData.type_utilisateur === "syndic") {
      if (!formData.nom_syndicat.trim()) newErrors.nom_syndicat = "Le nom du syndicat est requis";
      if (!formData.description_syndicat.trim()) newErrors.description_syndicat = "La description est requise";
      if (!formData.nombre_membres) newErrors.nombre_membres = "Le nombre de membres est requis";
      if (!formData.regions_couvertes.trim()) newErrors.regions_couvertes = "Les régions couvertes sont requises";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    setMessage({ text: "", type: "" });
    
    if (!validateForm()) {
      setIsSubmitting(false);
      setMessage({ text: "Veuillez corriger les erreurs dans le formulaire", type: "error" });
      return;
    }

    try {
      // Préparation des données
      const userData = {
        nom: formData.nom.trim(),
        prenom: formData.prenom.trim(),
        username: formData.username.trim(),
        email: formData.email.toLowerCase().trim(),
        telephone: formData.telephone.trim() || null,
        mot_de_passe: formData.mot_de_passe,
        type_utilisateur: formData.type_utilisateur,
        date_inscription: new Date().toISOString(),
      };

      // Ajouter les champs spécifiques selon le type d'utilisateur
      if (formData.type_utilisateur === "agriculteur") {
        userData.region = formData.region;
        userData.superficie = formData.superficie ? parseFloat(formData.superficie) : null;
        userData.cultures = formData.cultures.trim();
      } else if (formData.type_utilisateur === "syndic") {
        userData.nom_syndicat = formData.nom_syndicat.trim();
        userData.description_syndicat = formData.description_syndicat.trim();
        userData.nombre_membres = formData.nombre_membres ? parseInt(formData.nombre_membres) : null;
        userData.regions_couvertes = formData.regions_couvertes.trim();
      }

      // Envoi de la requête avec gestion d'erreur améliorée
      const response = await fetch('/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      // Vérifier si la réponse est JSON avant de la parser
      const contentType = response.headers.get("content-type");
      let data;
      
      if (contentType && contentType.indexOf("application/json") !== -1) {
        data = await response.json();
      } else {
        // Si ce n'est pas du JSON, lire le texte de la réponse
        const text = await response.text();
        throw new Error(`Réponse non-JSON reçue du serveur: ${text}`);
      }

x
      // Succès
      setMessage({ 
        text: "Compte créé avec succès ! Redirection...", 
        type: "success" 
      });
      
      // Réinitialiser le formulaire
      setFormData({
        nom: "",
        prenom: "",
        username: "",
        email: "",
        telephone: "",
        mot_de_passe: "",
        confirm_mot_de_passe: "",
        type_utilisateur: "utilisateur",
        region: "",
        cultures: "",
        superficie: "",
        nom_syndicat: "",
        description_syndicat: "",
        nombre_membres: "",
        regions_couvertes: ""
      });
      
      // Stocker l'email pour la page de connexion
      sessionStorage.setItem('registrationEmail', userData.email);
      
      // Rediriger après un court délai
      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);

    } catch (error) {
      console.error('Erreur:', error);
      setMessage({ 
        text: error.message || "Erreur de connexion au serveur", 
        type: "error" 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center min-h-screen items-center bg-gradient-to-br from-green-50 to-gray-100">
      <div className="w-full max-w-md px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Créer un compte
              </h1>
              <p className="text-gray-600">
                Rejoignez notre communauté agricole
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-1">
                    Nom*
                  </label>
                  <input
                    id="nom"
                    type="text"
                    name="nom"
                    value={formData.nom}
                    onChange={handleChange}
                    placeholder="Votre nom"
                    className={`w-full px-4 py-3 rounded-lg border ${errors.nom ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-green-500 focus:border-green-500 transition`}
                  />
                  {errors.nom && <p className="text-xs text-red-500 mt-1">{errors.nom}</p>}
                </div>
                <div>
                  <label htmlFor="prenom" className="block text-sm font-medium text-gray-700 mb-1">
                    Prénom*
                  </label>
                  <input
                    id="prenom"
                    type="text"
                    name="prenom"
                    value={formData.prenom}
                    onChange={handleChange}
                    placeholder="Votre prénom"
                    className={`w-full px-4 py-3 rounded-lg border ${errors.prenom ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-green-500 focus:border-green-500 transition`}
                  />
                  {errors.prenom && <p className="text-xs text-red-500 mt-1">{errors.prenom}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  Nom d'utilisateur*
                </label>
                <input
                  id="username"
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="votre_username"
                  className={`w-full px-4 py-3 rounded-lg border ${errors.username ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-green-500 focus:border-green-500 transition`}
                />
                {errors.username && <p className="text-xs text-red-500 mt-1">{errors.username}</p>}
                <p className="text-xs text-gray-500 mt-1">Lettres, chiffres et underscores uniquement</p>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email*
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="email@exemple.com"
                  className={`w-full px-4 py-3 rounded-lg border ${errors.email ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-green-500 focus:border-green-500 transition`}
                />
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="telephone" className="block text-sm font-medium text-gray-700 mb-1">
                  Téléphone (optionnel)
                </label>
                <input
                  id="telephone"
                  type="tel"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleChange}
                  placeholder="Ex: +221 XX XXX XX XX"
                  className={`w-full px-4 py-3 rounded-lg border ${errors.telephone ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-green-500 focus:border-green-500 transition`}
                />
                {errors.telephone && <p className="text-xs text-red-500 mt-1">{errors.telephone}</p>}
              </div>

              <div>
                <label htmlFor="mot_de_passe" className="block text-sm font-medium text-gray-700 mb-1">
                  Mot de passe*
                </label>
                <input
                  id="mot_de_passe"
                  type="password"
                  name="mot_de_passe"
                  value={formData.mot_de_passe}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full px-4 py-3 rounded-lg border ${errors.mot_de_passe ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-green-500 focus:border-green-500 transition`}
                />
                <p className="text-xs text-gray-500 mt-1">Minimum 8 caractères</p>
                {errors.mot_de_passe && <p className="text-xs text-red-500 mt-1">{errors.mot_de_passe}</p>}
              </div>

              <div>
                <label htmlFor="confirm_mot_de_passe" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmer le mot de passe*
                </label>
                <input
                  id="confirm_mot_de_passe"
                  type="password"
                  name="confirm_mot_de_passe"
                  value={formData.confirm_mot_de_passe}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full px-4 py-3 rounded-lg border ${errors.confirm_mot_de_passe ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-green-500 focus:border-green-500 transition`}
                />
                {errors.confirm_mot_de_passe && <p className="text-xs text-red-500 mt-1">{errors.confirm_mot_de_passe}</p>}
              </div>

              <div>
                <label htmlFor="type_utilisateur" className="block text-sm font-medium text-gray-700 mb-1">
                  Vous êtes*
                </label>
                <select
                  id="type_utilisateur"
                  name="type_utilisateur"
                  value={formData.type_utilisateur}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                >
                  <option value="utilisateur">Utilisateur standard</option>
                  <option value="agriculteur">Agriculteur</option>
                  <option value="syndic">Représentant syndical</option>
                </select>
              </div>

              {/* Champs spécifiques aux agriculteurs */}
              {formData.type_utilisateur === "agriculteur" && (
                <div className="space-y-4 p-4 bg-green-50 rounded-lg">
                  <h3 className="font-semibold text-green-800">Informations agriculteur</h3>
                  
                  <div>
                    <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-1">
                      Région d'activité*
                    </label>
                    <select
                      id="region"
                      name="region"
                      value={formData.region}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg border ${errors.region ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-green-500 focus:border-green-500 transition`}
                    >
                      <option value="">Sélectionnez votre région</option>
                      {regionsSenegal.map(region => (
                        <option key={region} value={region}>{region}</option>
                      ))}
                    </select>
                    {errors.region && <p className="text-xs text-red-500 mt-1">{errors.region}</p>}
                  </div>

                  <div>
                    <label htmlFor="cultures" className="block text-sm font-medium text-gray-700 mb-1">
                      Cultures principales (séparées par des virgules)*
                    </label>
                    <input
                      id="cultures"
                      type="text"
                      name="cultures"
                      value={formData.cultures}
                      onChange={handleChange}
                      placeholder="Ex: Riz, Arachide, Mil"
                      className={`w-full px-4 py-3 rounded-lg border ${errors.cultures ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-green-500 focus:border-green-500 transition`}
                    />
                    {errors.cultures && <p className="text-xs text-red-500 mt-1">{errors.cultures}</p>}
                  </div>

                  <div>
                    <label htmlFor="superficie" className="block text-sm font-medium text-gray-700 mb-1">
                      Superficie cultivée (ha)
                    </label>
                    <input
                      id="superficie"
                      type="number"
                      name="superficie"
                      value={formData.superficie}
                      onChange={handleChange}
                      placeholder="Ex: 5"
                      min="0"
                      step="0.1"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                    />
                  </div>
                </div>
              )}

              {/* Champs spécifiques aux syndicats */}
              {formData.type_utilisateur === "syndic" && (
                <div className="space-y-4 p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-blue-800">Informations syndicales</h3>
                  
                  <div>
                    <label htmlFor="nom_syndicat" className="block text-sm font-medium text-gray-700 mb-1">
                      Nom du syndicat*
                    </label>
                    <input
                      id="nom_syndicat"
                      type="text"
                      name="nom_syndicat"
                      value={formData.nom_syndicat}
                      onChange={handleChange}
                      placeholder="Nom officiel du syndicat"
                      className={`w-full px-4 py-3 rounded-lg border ${errors.nom_syndicat ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition`}
                    />
                    {errors.nom_syndicat && <p className="text-xs text-red-500 mt-1">{errors.nom_syndicat}</p>}
                  </div>

                  <div>
                    <label htmlFor="description_syndicat" className="block text-sm font-medium text-gray-700 mb-1">
                      Description du syndicat*
                    </label>
                    <textarea
                      id="description_syndicat"
                      name="description_syndicat"
                      value={formData.description_syndicat}
                      onChange={handleChange}
                      placeholder="Mission et objectifs du syndicat"
                      rows={3}
                      className={`w-full px-4 py-3 rounded-lg border ${errors.description_syndicat ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition`}
                    />
                    {errors.description_syndicat && <p className="text-xs text-red-500 mt-1">{errors.description_syndicat}</p>}
                  </div>

                  <div>
                    <label htmlFor="nombre_membres" className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre de membres*
                    </label>
                    <input
                      id="nombre_membres"
                      type="number"
                      name="nombre_membres"
                      value={formData.nombre_membres}
                      onChange={handleChange}
                      placeholder="Ex: 150"
                      min="1"
                      className={`w-full px-4 py-3 rounded-lg border ${errors.nombre_membres ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition`}
                    />
                    {errors.nombre_membres && <p className="text-xs text-red-500 mt-1">{errors.nombre_membres}</p>}
                  </div>

                  <div>
                    <label htmlFor="regions_couvertes" className="block text-sm font-medium text-gray-700 mb-1">
                      Régions couvertes (séparées par des virgules)*
                    </label>
                    <input
                      id="regions_couvertes"
                      type="text"
                      name="regions_couvertes"
                      value={formData.regions_couvertes}
                      onChange={handleChange}
                      placeholder="Ex: Dakar, Thiès, Saint-Louis"
                      className={`w-full px-4 py-3 rounded-lg border ${errors.regions_couvertes ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition`}
                    />
                    {errors.regions_couvertes && <p className="text-xs text-red-500 mt-1">{errors.regions_couvertes}</p>}
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 px-4 rounded-lg text-white font-semibold ${isSubmitting ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'} transition duration-300 flex justify-center items-center`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Création en cours...
                  </>
                ) : "S'inscrire"}
              </button>

              {message.text && (
                <div className={`p-3 rounded-lg ${message.type === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}>
                  {message.text}
                </div>
              )}

              <div className="text-center text-sm text-gray-600">
                Vous avez déjà un compte ?{" "}
                <Link href="/auth/login" className="text-green-600 font-semibold hover:underline">
                  Se connecter
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}