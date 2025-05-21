import { createSessionToken } from '@/lib/session';
import { connectToDB } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  let connection;
  
  try {
    // Connexion à la base de données
    try {
      connection = await connectToDB();
      console.log("Connexion à la base de données établie avec succès");
    } catch (dbError) {
      console.error("Erreur de connexion à la base de données:", dbError);
      return new Response(JSON.stringify({ 
        message: 'Erreur de connexion à la base de données' 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Extraction des données de la requête
    let requestData;
    try {
      requestData = await request.json();
    } catch (parseError) {
      console.error("Erreur de parsing JSON:", parseError);
      return new Response(JSON.stringify({ 
        message: 'Format de requête invalide' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const { username, mot_de_passe } = requestData;
    
    // Validation des données
    if (!username || !mot_de_passe) {
      return new Response(JSON.stringify({ 
        message: 'Nom d\'utilisateur et mot de passe requis' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Recherche de l'utilisateur
    let users;
    try {
      [users] = await connection.query(
        'SELECT * FROM utilisateurs WHERE username = ?', 
        [username.trim()]
      );
      console.log(`Recherche d'utilisateur pour: ${username}`);
    } catch (queryError) {
      console.error("Erreur SQL:", queryError);
      return new Response(JSON.stringify({ 
        message: 'Erreur lors de la recherche utilisateur' 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const user = users[0];
    
    if (!user) {
      console.log(`Utilisateur non trouvé: ${username}`);
      return new Response(JSON.stringify({ 
        message: 'Nom d\'utilisateur ou mot de passe incorrect' 
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Vérification du mot de passe
    let isPasswordValid;
    try {
      isPasswordValid = await bcrypt.compare(mot_de_passe, user.mot_de_passe);
    } catch (bcryptError) {
      console.error("Erreur bcrypt:", bcryptError);
      return new Response(JSON.stringify({ 
        message: 'Erreur de vérification du mot de passe' 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    if (!isPasswordValid) {
      console.log(`Mot de passe invalide pour: ${username}`);
      return new Response(JSON.stringify({ 
        message: 'Nom d\'utilisateur ou mot de passe incorrect' 
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Récupération des infos supplémentaires
    let additionalInfo = {};
    try {
      if (user.type_utilisateur === 'agriculteur') {
        const [cultures] = await connection.query(`
          SELECT c.nom FROM utilisateur_cultures uc 
          JOIN cultures c ON uc.culture_id = c.id 
          WHERE uc.utilisateur_id = ?
        `, [user.id]);
        
        additionalInfo = {
          region: user.region,
          superficie: user.superficie,
          cultures: cultures.map(c => c.nom)
        };
      } else if (user.type_utilisateur === 'syndic') {
        const [regions] = await connection.query(`
          SELECT region FROM syndicat_regions 
          WHERE utilisateur_id = ?
        `, [user.id]);
        
        additionalInfo = {
          nom_syndicat: user.nom_syndicat,
          description_syndicat: user.description_syndicat,
          nombre_membres: user.nombre_membres,
          regions_couvertes: regions.map(r => r.region)
        };
      }
    } catch (infoError) {
      console.error("Erreur infos supplémentaires:", infoError);
    }
    
    // Création de la session
    const token = createSessionToken({
      id: user.id,
      username: user.username,
      type_utilisateur: user.type_utilisateur
    });
    
    // Construction de la réponse
    const userResponse = {
      id: user.id,
      nom: user.nom,
      prenom: user.prenom,
      username: user.username,
      type_utilisateur: user.type_utilisateur,
      ...additionalInfo
    };
    
    console.log(`Connexion réussie pour: ${username}`);
    
    const response = new Response(JSON.stringify({
      message: 'Connexion réussie',
      user: userResponse
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

    // Ajout du cookie de session
    response.headers.append(
      'Set-Cookie',
      `authToken=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${60 * 60 * 24 * 7}`
    );

    return response;
    
  } catch (error) {
    console.error('Erreur générale:', error);
    return new Response(JSON.stringify({ 
      message: 'Erreur serveur interne',
      details: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  } finally {
    if (connection) {
      try {
        await connection.end();
        console.log("Connexion DB fermée");
      } catch (closeError) {
        console.error("Erreur fermeture DB:", closeError);
      }
    }
  }
}