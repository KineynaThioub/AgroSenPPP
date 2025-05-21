import { connectToDB } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  let connection;
  
  try {
    connection = await connectToDB();
    
    const userData = await request.json();
    
    // Validation des champs obligatoires
    const requiredFields = ['nom', 'prenom', 'username', 'email', 'mot_de_passe'];
    for (const field of requiredFields) {
      if (!userData[field]) {
        return new Response(
          JSON.stringify({ message: `Le champ '${field}' est requis` }), 
          { 
            status: 400, 
            headers: { 'Content-Type': 'application/json' } 
          }
        );
      }
    }

    // Vérifier que l'email n'est pas déjà utilisé
    const [existingEmailUsers] = await connection.query(
      'SELECT id FROM utilisateurs WHERE email = ?',
      [userData.email.toLowerCase()]
    );
    
    if (existingEmailUsers.length > 0) {
      return new Response(
        JSON.stringify({ message: 'Cette adresse email est déjà utilisée' }),
        { 
          status: 409, 
          headers: { 'Content-Type': 'application/json' } 
        }
      );
    }

    // Vérifier que le username n'est pas déjà utilisé
    const [existingUsernameUsers] = await connection.query(
      'SELECT id FROM utilisateurs WHERE username = ?',
      [userData.username]
    );
    
    if (existingUsernameUsers.length > 0) {
      return new Response(
        JSON.stringify({ message: 'Ce nom d\'utilisateur est déjà utilisé' }),
        { 
          status: 409, 
          headers: { 'Content-Type': 'application/json' } 
        }
      );
    }

    // Hachage du mot de passe
    const hashedPassword = await bcrypt.hash(userData.mot_de_passe, 10);

    // Préparation des données utilisateur de base
    const userInsertData = {
      nom: userData.nom,
      prenom: userData.prenom,
      username: userData.username,
      email: userData.email.toLowerCase(),
      mot_de_passe: hashedPassword,
      type_utilisateur: userData.type_utilisateur || 'utilisateur',
      date_inscription: new Date(),
      statut: 'en_attente',
      telephone: userData.telephone || null
    };

    // Ajouter des champs supplémentaires selon le type d'utilisateur
    if (userData.type_utilisateur === 'agriculteur') {
      userInsertData.region = userData.region;
      userInsertData.superficie = userData.superficie;
    } else if (userData.type_utilisateur === 'syndic') {
      userInsertData.nom_syndicat = userData.nom_syndicat;
      userInsertData.description_syndicat = userData.description_syndicat;
      userInsertData.nombre_membres = userData.nombre_membres;
    }

    // Insérer l'utilisateur dans la base de données
    console.log("Insertion dans utilisateurs :", userInsertData);

    const [result] = await connection.query( 
      'INSERT INTO utilisateurs SET ?',
      [userInsertData]
    );
    
    const userId = result.insertId;

    // Si c'est un agriculteur, traiter les cultures
    if (userData.type_utilisateur === 'agriculteur' && userData.cultures) {
      const cultures = userData.cultures.split(',').map(c => c.trim());
      for (const culture of cultures) {
        await connection.query(
          'INSERT INTO cultures (user_id, nom_culture) VALUES (?, ?)',
          [userId, culture]
        );
      }
    }

    return new Response(
      JSON.stringify({ message: 'Utilisateur enregistré avec succès', userId: userId }),
      { 
        status: 201, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
    
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement:', error);
    
    return new Response(
      JSON.stringify({ 
        message: 'Une erreur est survenue lors de l\'enregistrement', 
        error: error.message 
      }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
    
  } finally {
    // Fermer la connexion seulement si elle a été établie
    if (connection) {
      try {
        await connection.end();
      } catch (err) {
        console.error('Erreur lors de la fermeture de la connexion:', err);
      }
    }
  }
}