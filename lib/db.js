// lib/db.js
import mysql from 'mysql2/promise';

export async function connectToDB() {
  // Afficher les informations de configuration (sans les mots de passe)
  console.log('Tentative de connexion à la base de données avec les paramètres :');
  console.log(`- Hôte: ${process.env.DB_HOST}`);
  console.log(`- Utilisateur: ${process.env.DB_USER}`);
  console.log(`- Base de données: ${process.env.DB_NAME}`);
  console.log(`- SSL activé: ${process.env.DB_SSL === 'true' ? 'Oui' : 'Non'}`);
  
  try {
    // Vérifier si les variables d'environnement sont définies
    if (!process.env.DB_HOST) {
      throw new Error('Variable d\'environnement DB_HOST manquante');
    }
    if (!process.env.DB_USER) {
      throw new Error('Variable d\'environnement DB_USER manquante');
    }
    if (!process.env.DB_NAME) {
      throw new Error('Variable d\'environnement DB_NAME manquante');
    }
    // Note: DB_PASSWORD peut être vide dans certaines configurations
    
    // Configuration de connexion
    const config = {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME,
      // Configuration conditionnelle du SSL
      ...(process.env.DB_SSL === 'true' 
        ? { ssl: { rejectUnauthorized: false } } 
        : {})
    };
    
    // Ajout du port s'il est spécifié
    if (process.env.DB_PORT) {
      config.port = parseInt(process.env.DB_PORT, 10);
    }
    
    // Tentative de connexion
    console.log('Création de la connexion...');
    const connection = await mysql.createConnection(config);
    
    // Test simple pour vérifier que la connexion fonctionne
    console.log('Test de la connexion...');
    await connection.query('SELECT 1');
    console.log('✅ Connexion à la base de données établie avec succès');
    
    return connection;
  } catch (error) {
    // Afficher des informations détaillées sur l'erreur
    console.error('❌ Échec de connexion à la base de données:');
    console.error(`- Code erreur: ${error.code}`);
    console.error(`- Errno: ${error.errno}`);
    console.error(`- SQL State: ${error.sqlState}`);
    console.error(`- Message: ${error.message}`);
    
    // Messages d'erreur personnalisés selon le type d'erreur
    if (error.code === 'ECONNREFUSED') {
      throw new Error(`Impossible de se connecter au serveur MySQL à ${process.env.DB_HOST}. Vérifiez que le serveur est en cours d'exécution et accessible.`);
    }
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      throw new Error(`Accès refusé: nom d'utilisateur ou mot de passe incorrect.`);
    }
    if (error.code === 'ER_BAD_DB_ERROR') {
      throw new Error(`La base de données '${process.env.DB_NAME}' n'existe pas.`);
    }
    if (error.code === 'ER_DBACCESS_DENIED_ERROR') {
      throw new Error(`L'utilisateur '${process.env.DB_USER}' n'a pas accès à la base de données '${process.env.DB_NAME}'.`);
    }
    
    // Pour les autres types d'erreurs
    throw new Error(`Échec de connexion à la base de données: ${error.message}`);
  }
}