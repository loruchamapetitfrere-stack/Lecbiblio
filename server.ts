import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

// Load environment variables
dotenv.config();

const distPath = path.join(process.cwd(), 'dist');

const app = express();
app.use(express.json());

const PORT = 3000; // Hardcoded port required by AI Studio environment

// Lazy init Gemini SDK
let ai: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!ai) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey === '') {
      throw new Error('GEMINI_API_KEY n\'est pas configuré. Veuillez l\'ajouter dans les secrets de l\'application.');
    }
    ai = new GoogleGenAI({ apiKey });
  }
  return ai;
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    geminiConfigured: !!(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY'),
    timestamp: new Date().toISOString(),
  });
});

// Endpoint to generate a custom Bible reading plan using Gemini
app.post('/api/generate-plan', async (req, res) => {
  try {
    const { topic, duration = 30, language = 'fr' } = req.body;
    
    if (!topic || typeof topic !== 'string' || topic.trim() === '') {
      return res.status(400).json({ error: 'Le thème ou sujet est requis pour générer un plan.' });
    }

    const requestedDuration = Math.min(Math.max(Number(duration) || 7, 3), 90); // constraint to 3-90 days

    let client: GoogleGenAI;
    try {
      client = getGeminiClient();
    } catch (keyError: any) {
      // Graceful fallback with standard mock data if Gemini API key is missing
      console.warn('Gemini key missing, providing elegant fallback plan:', keyError.message);
      return res.json(getFallbackPlan(topic, requestedDuration));
    }

    const prompt = `Génère un plan de lecture biblique quotidien personnalisé de ${requestedDuration} jours en langue française sur le thème : "${topic}".
Chaque jour doit proposer un passage précis (par exemple: "Psaumes 23:1-6", "Jean 14:1-6", etc.), un titre inspirant pour la journée, le texte abrégé du verset clé (en français, version Louis Segond ou similaire), et une courte réflexion spirituelle et pratique (3-4 phrases) pour aider l'utilisateur.

Format de retour attendu : Un objet JSON STRICT respectant exactement ce schéma TypeScript sans balises de code Markdown en dehors du JSON:
{
  "title": "Nom du plan de lecture",
  "description": "Une belle description chaleureuse du parcours de lecture",
  "duration": number,
  "days": [
    {
      "day": 1,
      "passage": "Livre Chapitre:Verset-Verset",
      "title": "Titre inspirant du jour",
      "text": "Texte complet du verset ou passage clé",
      "reflection": "Courte réflexion spirituelle, moderne et encourageante"
    }
  ]
}

Assure-toi que les passages sont pertinents par rapport au thème "${topic}".`;

    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error('Réponse vide du modèle de génération.');
    }

    const planData = JSON.parse(responseText);
    res.json(planData);
  } catch (error: any) {
    console.error('Erreur lors de la génération du plan par l\'IA:', error);
    res.status(500).json({
      error: 'Impossible de générer le plan personnalisé. Veuillez réessayer ou utiliser un plan prédéfini.',
      details: error.message
    });
  }
});

// Endpoint to generate an AI reflection or prayer for a specific passage
app.post('/api/generate-reflection', async (req, res) => {
  try {
    const { passage, currentThoughts = '' } = req.body;
    
    if (!passage) {
      return res.status(400).json({ error: 'Le passage biblique est requis.' });
    }

    let client: GoogleGenAI;
    try {
      client = getGeminiClient();
    } catch (keyError: any) {
      console.warn('Gemini key missing, providing static fallback reflection:', keyError.message);
      return res.json({
        reflection: `Prenez un moment pour méditer sur le passage ${passage}. Ce texte nous invite à faire confiance à Dieu dans toutes nos circonstances et à chercher Sa paix intérieure.`,
        prayer: `Seigneur, ouvre mes yeux sur les merveilles de Ta Parole. Aide-moi à vivre selon Tes enseignements et à trouver ma force en Toi aujourd'hui. Amen.`
      });
    }

    const prompt = `En tant que compagnon de lecture biblique encourageant et bienveillant, génère une réflexion profonde et une prière quotidienne en français pour le passage : "${passage}".
${currentThoughts ? `L'utilisateur a écrit ces notes personnelles pour aujourd'hui : "${currentThoughts}". Intègre de manière subtile et empathique des conseils ou encouragements liés à ses notes.` : ''}

Format de retour attendu : Un objet JSON STRICT respectant exactement ce schéma :
{
  "reflection": "Une réflexion spirituelle, chaleureuse et moderne d'environ 4-5 phrases.",
  "prayer": "Une belle et humble prière personnalisée (2-3 phrases) en lien direct avec le passage."
}`;

    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error('Réponse vide du modèle de génération.');
    }

    const reflectionData = JSON.parse(responseText);
    res.json(reflectionData);
  } catch (error: any) {
    console.error('Erreur de génération de réflexion:', error);
    res.status(500).json({
      error: 'Erreur lors de la génération de la réflexion.',
      details: error.message
    });
  }
});

// Fallback plans generator when API key is not configured
function getFallbackPlan(topic: string, duration: number) {
  const cleanTopic = topic.trim();
  const title = `Parcours sur la confiance : ${cleanTopic}`;
  const description = `Un parcours de ${duration} jours pour méditer sur la Parole de Dieu et approfondir notre relation avec Lui au sujet de : ${cleanTopic}.`;
  
  const passagesList = [
    { passage: "Psaumes 23:1-6", text: "L'Éternel est mon berger: je ne manquerai de rien. Il me fait reposer dans de verts pâturages, il me dirige près des eaux paisibles...", ref: "La provision de Dieu et sa paix transcendante dans l'adversité." },
    { passage: "Philippiens 4:6-7", text: "Ne vous inquiétez de rien; mais en toute chose faites connaître vos besoins à Dieu par des prières...", ref: "La prière comme arme contre l'inquiétude." },
    { passage: "Jean 14:27", text: "Je vous laisse la paix, je vous donne ma paix. Je ne vous donne pas comme le monde donne. Que votre cœur ne se trouble point...", ref: "Le cadeau de la paix divine au milieu des tempêtes." },
    { passage: "Josué 1:9", text: "Ne t'ai-je pas donné cet ordre: Fortifie-toi et prends courage? Ne t'effraie point et ne t'épouvante point...", ref: "L'appel au courage car le Seigneur est avec nous." },
    { passage: "Romains 8:28", text: "Nous savons, du reste, que toutes choses concourent au bien de ceux qui aiment Dieu, de ceux qui sont appelés selon son dessein...", ref: "La certitude de la souveraineté bienveillante de Dieu." },
    { passage: "Matthieu 11:28-30", text: "Venez à moi, vous tous qui êtes fatigués et chargés, et je vous donnerai du repos. Prenez mon joug sur vous...", ref: "L'invitation du Sauveur à trouver le vrai repos spirituel." },
    { passage: "Ésaïe 41:10", text: "Ne crains rien, car je suis avec toi; Ne promène pas des regards inquiets, car je suis ton Dieu; Je te fortifie...", ref: "L'assurance divine de la force et du secours infaillible." }
  ];

  const days = Array.from({ length: duration }, (_, i) => {
    const listIndex = i % passagesList.length;
    const item = passagesList[listIndex];
    return {
      day: i + 1,
      passage: item.passage,
      title: `Confiance & Espérance - Jour ${i + 1}`,
      text: item.text,
      reflection: `Aujourd'hui, méditons particulièrement sur le thème "${cleanTopic}". Le passage de ${item.passage} nous rappelle que ${item.ref} Que cette vérité pénètre votre cœur et renouvelle votre espérance pour cette journée.`
    };
  });

  return {
    title,
    description,
    duration,
    days
  };
}

// Serve static files from the React app build folder
app.use(express.static(distPath));

// Serve index.html for any SPA routes
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
