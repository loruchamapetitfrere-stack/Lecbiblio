export interface PlanDay {
  day: number;
  passage: string;
  title: string;
  text: string;
  reflection: string;
}

export interface ReadingPlan {
  id: string;
  title: string;
  description: string;
  duration: number;
  isCustom?: boolean;
  days: PlanDay[];
}

export const PREDEFINED_PLANS: ReadingPlan[] = [
  {
    id: 'plan-30-paix',
    title: '30 Jours de Paix & Confiance',
    description: 'Un parcours de 30 jours pour surmonter l\'anxiété, trouver le calme intérieur et fortifier sa foi à travers les promesses de l\'Écriture.',
    duration: 30,
    days: [
      {
        day: 1,
        passage: 'Psaumes 23:1-6',
        title: 'Le Bon Berger',
        text: 'L\'Éternel est mon berger: je ne manquerai de rien. Il me fait reposer dans de verts pâturages, il me dirige près des eaux paisibles. Il restaure mon âme...',
        reflection: 'Même dans les vallées les plus sombres, la présence du divin Berger nous rassure et nous protège. Prenez un moment aujourd\'hui pour déposer tous vos fardeaux et lui faire entièrement confiance pour guider vos pas.'
      },
      {
        day: 2,
        passage: 'Matthieu 6:25-34',
        title: 'Ne vous inquiétez de rien',
        text: 'Regardez les oiseaux du ciel: ils ne sèment ni ne moissonnent... et votre Père céleste les nourrit. Ne valez-vous pas beaucoup plus qu\'eux ?',
        reflection: 'L\'inquiétude n\'ajoute rien à notre vie, mais elle vole la joie d\'aujourd\'hui. Dieu connaît vos moindres besoins. Cherchez d\'abord son royaume et laissez-le prendre soin de vos lendemains.'
      },
      {
        day: 3,
        passage: 'Philippiens 4:6-7',
        title: 'La paix au-delà de la raison',
        text: 'Ne vous inquiétez de rien; mais en toute chose faites connaître vos besoins à Dieu par des prières et des supplications, avec des actions de grâces. Et la paix de Dieu, qui surpasse toute intelligence, gardera vos cœurs...',
        reflection: 'La paix véritable n\'est pas l\'absence de tempête, mais la présence de Dieu au milieu d\'elle. Remplacez l\'inquiétude par la prière reconnaissante et laissez sa paix monter en vous.'
      },
      {
        day: 4,
        passage: 'Psaumes 121:1-8',
        title: 'Mon secours vient d\'en haut',
        text: 'Je lève mes yeux vers les montagnes... D\'où me viendra le secours ? Le secours me vient de l\'Éternel, qui a fait les cieux et la terre. Il ne permettra point que ton pied chancelle...',
        reflection: 'Le Créateur de l\'univers veille sur vous à chaque seconde. Il est votre ombre protectrice. Confiez-lui vos départs et vos arrivées, il prend soin de votre vie entière.'
      },
      {
        day: 5,
        passage: 'Ésaïe 40:29-31',
        title: 'Renouveler ses forces',
        text: 'Il donne de la force à celui qui est fatigué, et il augmente la vigueur de celui qui tombe en défaillance... Mais ceux qui espèrent en l\'Éternel renouvellent leur force. Ils prennent le vol comme des aigles...',
        reflection: 'La fatigue physique ou émotionnelle fait partie de la vie, mais Dieu nous propose de puiser dans son énergie illimitée. Attendez-vous à lui aujourd\'hui, laissez-le renouveler votre dynamisme.'
      },
      {
        day: 6,
        passage: 'Jean 14:27',
        title: 'Un héritage de Paix',
        text: 'Je vous laisse la paix, je vous donne ma paix. Je ne vous donne pas comme le monde donne. Que votre cœur ne se trouble point, et ne s\'alarme point.',
        reflection: 'La paix que Jésus nous offre est immuable, contrairement à la paix fragile que le monde promet à travers les circonstances matérielles. Accueillez ce don gratuit dans votre esprit aujourd\'hui.'
      },
      {
        day: 7,
        passage: 'Romains 8:28',
        title: 'Tout concourt au bien',
        text: 'Nous savons, du reste, que toutes choses concourent au bien de ceux qui aiment Dieu, de ceux qui sont appelés selon son dessein.',
        reflection: 'Même les détours compliqués, les déceptions ou les épreuves de notre vie peuvent être transformés en bénédictions à travers la sagesse de Dieu. Gardez foi en son plan global pour vous.'
      },
      {
        day: 8,
        passage: 'Psaumes 46:2-4',
        title: 'Un refuge dans la détresse',
        text: 'Dieu est pour nous un refuge et un appui, un secours toujours présent dans la détresse. C\'est pourquoi nous sommes sans crainte quand la terre est bouleversée...',
        reflection: 'Lorsque les circonstances autour de nous s\'agitent, nous pouvons trouver un sanctuaire de sécurité en Dieu. Calmez votre respiration et trouvez refuge sous sa protection.'
      },
      {
        day: 9,
        passage: 'Josué 1:9',
        title: 'Courage et Force',
        text: 'Ne t\'ai-je pas donné cet ordre: Fortifie-toi et prends courage ? Ne t\'effraie point et ne t\'épouvante point, car l\'Éternel, ton Dieu, est avec toi dans tout ce que tu entreprendras.',
        reflection: 'Le courage n\'est pas l\'absence de peur, mais la conviction que Dieu marche avec vous. Vous n\'êtes pas seul face à vos défis quotidiens.'
      },
      {
        day: 10,
        passage: 'Proverbes 3:5-6',
        title: 'Faire confiance de tout cœur',
        text: 'Confie-toi en l\'Éternel de tout ton cœur, et ne t\'appuie pas sur ta sagesse; reconnais-le dans toutes tes voies, et il aplanira tes sentiers.',
        reflection: 'Renoncer à vouloir tout contrôler ou tout comprendre est le début de la paix. Laissez la sagesse infinie orienter vos projets et aplanir les obstacles devant vous.'
      },
      {
        day: 11,
        passage: 'Psaumes 27:1-3',
        title: 'Le rempart de ma vie',
        text: 'L\'Éternel est ma lumière et mon salut: de qui aurais-je crainte ? L\'Éternel est le soutien de ma vie: de qui aurais-je peur ?',
        reflection: 'Quand la peur essaie de paralyser vos pensées, rappelez-vous que la lumière divine dissipe toutes les ténèbres. Marchez la tête haute aujourd\'hui.'
      },
      {
        day: 12,
        passage: 'Éphésiens 3:16-19',
        title: 'Enracinés dans l\'amour',
        text: 'Afin qu\'il vous donne, selon la richesse de sa gloire, d\'être puissamment fortifiés par son Esprit dans l\'homme intérieur... et de connaître l\'amour de Christ, qui surpasse toute connaissance...',
        reflection: 'L\'amour inconditionnel de Dieu est le fondement le plus solide de notre identité. Laissez-vous saturer par cet amour infini pour chasser l\'insécurité.'
      },
      {
        day: 13,
        passage: 'Matthieu 11:28-30',
        title: 'L\'invitation au Repos',
        text: 'Venez à moi, vous tous qui êtes fatigués et chargés, et je vous donnerai du repos. Prenez mon joug sur vous... car mon joug est doux, et mon fardeau léger.',
        reflection: 'Ne portez pas seul le poids du monde. Échangez vos charges lourdes contre le joug d\'amour de Jésus. Son repos restaure le corps, l\'esprit et l\'âme.'
      },
      {
        day: 14,
        passage: '2 Timothée 1:7',
        title: 'Un esprit de Force',
        text: 'Car ce n\'est pas un esprit de timidité que Dieu nous a donné, mais un esprit de force, d\'amour et de sagesse.',
        reflection: 'La peur et la timidité ne viennent pas de Dieu. Il a déposé en vous des ressources de force intérieure, d\'amour pour les autres et de clarté d\'esprit.'
      },
      {
        day: 15,
        passage: 'Psaumes 34:5-8',
        title: 'Délivré de toutes les frayeurs',
        text: 'J\'ai cherché l\'Éternel, et il m\'a répondu; il m\'a délivré de toutes mes frayeurs. Quand on tourne les yeux vers lui, on est rayonnant de joie...',
        reflection: 'Regarder vers Dieu plutôt que de fixer nos difficultés change notre rayonnement intérieur. Recherchez sa face aujourd\'hui pour retrouver un visage souriant et confiant.'
      },
      {
        day: 16,
        passage: '1 Pierre 5:7',
        title: 'Décharger ses soucis',
        text: 'Déchargez-vous sur lui de tous vos soucis, car lui-même prend soin de vous.',
        reflection: 'Imaginez-vous en train de remettre littéralement chaque préoccupation de votre liste mentale entre les mains bienveillantes de Dieu. Il a la capacité et le désir de s\'en occuper.'
      },
      {
        day: 17,
        passage: 'Hébreux 13:5-6',
        title: 'Je ne te délaisserai point',
        text: 'Dieu lui-même a dit: Je ne te délaisserai point, et je ne t\'abandonnerai point. C\'est avec assurance que nous pouvons dire: Le Seigneur est mon secours, je ne craindrai rien...',
        reflection: 'La solitude et la peur de l\'abandon peuvent peser lourdement. Mais la promesse divine est absolue : Dieu ne vous lâchera jamais la main, quoi qu\'il arrive.'
      },
      {
        day: 18,
        passage: 'Sophonie 3:17',
        title: 'Des chants d\'allégresse',
        text: 'L\'Éternel, ton Dieu, est au milieu de toi, comme un héros qui sauve; Il fera de toi sa plus grande joie; Il gardera le silence dans son amour; Il aura pour toi des transports d\'allégresse.',
        reflection: 'Dieu ne vous tolère pas simplement, il vous chérit profondément ! Imaginez-le se réjouir de votre présence avec joie et tendresse silencieuse.'
      },
      {
        day: 19,
        passage: 'Jérémie 29:11',
        title: 'Projets d\'Avenir et d\'Espérance',
        text: 'Car je connais les projets que j\'ai formés sur vous, dit l\'Éternel, projets de paix et non de malheur, afin de vous donner un avenir et de l\'espérance.',
        reflection: 'Dieu regarde votre avenir avec optimisme et bienveillance. Ses plans pour votre vie sont orientés vers la restauration, le développement spirituel et la paix.'
      },
      {
        day: 20,
        passage: 'Psaumes 91:1-4',
        title: 'Sous l\'abri du Très-Haut',
        text: 'Celui qui demeure sous l\'abri du Très-Haut repose à l\'ombre du Tout-Puissant. Je dis à l\'Éternel: Mon refuge et ma forteresse, mon Dieu en qui je me confie !',
        reflection: 'La demeure de Dieu est un lieu de paix inaccessible à l\'angoisse. Cultivez une habitude constante de passer du temps dans sa présence silencieuse pour vous ressourcer.'
      },
      {
        day: 21,
        passage: 'Jean 16:33',
        title: 'Vainqueur du monde',
        text: 'Je vous ai dit ces choses, afin que vous ayez la paix en moi. Vous aurez des tribulations dans le monde; mais prenez courage, j\'ai vaincu le monde.',
        reflection: 'Les difficultés de la vie sont inévitables, mais elles ne définissent pas votre victoire finale. En Christ, vous partagez sa victoire sur toutes les détresses du monde.'
      },
      {
        day: 22,
        passage: 'Lamentations 3:22-24',
        title: 'Bontés renouvelées',
        text: 'Les bontés de l\'Éternel ne sont pas épuisées, ses compassions ne sont pas à leur terme; elles se renouvellent chaque matin. Oh ! que ta fidélité est grande !',
        reflection: 'Chaque lever de soleil apporte une nouvelle portion de grâce divine et une page blanche pour recommencer. Le passé est effacé, aujourd\'hui est un jour de grâce.'
      },
      {
        day: 23,
        passage: 'Colossiens 3:15',
        title: 'La Paix qui arbitre les cœurs',
        text: 'Et que la paix de Christ, à laquelle vous avez été appelés pour former un seul corps, règne dans vos cœurs. Et soyez reconnaissants.',
        reflection: 'Laissez la paix divine agir comme un arbitre intérieur pour guider vos choix et vos relations. La gratitude est le terreau fertile où cette paix grandit le mieux.'
      },
      {
        day: 24,
        passage: 'Psaumes 103:1-5',
        title: 'Bénis le Seigneur',
        text: 'Mon âme, bénis l\'Éternel, et n\'oublie aucun de ses bienfaits ! C\'est lui qui pardonne toutes tes iniquités, qui guérit toutes tes maladies; c\'est lui qui délivre ta vie de la fosse...',
        reflection: 'La mémoire spirituelle est essentielle. Rappelez-vous activement des moments où Dieu vous a secouru, pardonné ou restauré pour fortifier votre confiance présente.'
      },
      {
        day: 25,
        passage: 'Jacques 1:5-6',
        title: 'Demander la Sagesse',
        text: 'Si quelqu\'un d\'entre vous manque de sagesse, qu\'il la demande à Dieu, qui donne à tous simplement et sans reproche, et elle lui sera donnée.',
        reflection: 'Face à des choix complexes, vous n\'avez pas besoin d\'avoir toutes les réponses. Demandez simplement la direction de Dieu, il se fera un plaisir de vous éclairer.'
      },
      {
        day: 26,
        passage: 'Romains 15:13',
        title: 'Déborder d\'Espérance',
        text: 'Que le Dieu de l\'espérance vous remplisse de toute joie et de toute paix dans la foi, afin que vous abondiez en espérance, par la puissance du Saint-Esprit !',
        reflection: 'Dieu ne donne pas l\'espoir avec parcimonie. Il veut que vous en débordiez, non par vos propres capacités mentales, mais par l\'énergie surnaturelle de sa présence.'
      },
      {
        day: 27,
        passage: '1 Thessaloniciens 5:16-18',
        title: 'L\'attitude de Gratitude',
        text: 'Soyez toujours joyeux. Priez sans cesse. Rendez grâces en toutes choses, car c\'est à votre égard la volonté de Dieu en Jésus-Christ.',
        reflection: 'Dire merci, même dans les moments difficiles, réaligne nos perspectives avec la bonté céleste. C\'est un puissant bouclier contre l\'amertume et l\'angoisse.'
      },
      {
        day: 28,
        passage: 'Psaumes 37:4-5',
        title: 'Le désir de votre cœur',
        text: 'Fais de l\'Éternel tes délices, et il te donnera ce que ton cœur désire. Recommande ton sort à l\'Éternel, mets en lui ta confiance, et il agira.',
        reflection: 'Trouver sa plus grande joie en Dieu transforme naturellement nos désirs pour qu\'ils s\'alignent sur ce qui est bon pour nous. Confiez-lui votre destin en toute liberté.'
      },
      {
        day: 29,
        passage: 'Ésaïe 26:3-4',
        title: 'Une fermeté inébranlable',
        text: 'À celui qui est ferme dans ses sentiments tu assures la paix, la paix, parce qu\'il se confie en toi. Confiez-vous en l\'Éternel à perpétuité, car l\'Éternel est le rocher des siècles.',
        reflection: 'La stabilité émotionnelle découle d\'un esprit focalisé sur le Rocher éternel. Quand tout change autour de vous, accrochez-vous à Celui qui ne change jamais.'
      },
      {
        day: 30,
        passage: 'Apocalypse 21:3-5',
        title: 'Toutes choses nouvelles',
        text: 'Il essuiera toute larme de leurs yeux, et la mort ne sera plus, et il n\'y aura plus ni deuil, ni cri, ni douleur... Et celui qui était assis sur le trône dit: Voici, je fais toutes choses nouvelles.',
        reflection: 'Ce magnifique voyage s\'achève sur la promesse ultime de la restauration complète de toute création. Peu importe l\'épaisseur de la nuit actuelle, l\'aube éternelle de Dieu approche.'
      }
    ]
  },
  {
    id: 'plan-15-gratitude',
    title: '15 Jours de Gratitude',
    description: 'Cultivez un cœur reconnaissant en méditant sur l\'amour constant de Dieu et apprenez à apprécier chaque bénédiction quotidienne.',
    duration: 15,
    days: [
      {
        day: 1,
        passage: 'Psaumes 100:1-5',
        title: 'Poussez des cris de joie',
        text: 'Entrez dans ses portes avec des louanges, dans ses parvis avec des cantiques ! Célébrez-le, bénissez son nom ! Car l\'Éternel est bon; sa bonté dure toujours...',
        reflection: 'La gratitude est la clé qui ouvre les portes de la présence divine. Commencez ce parcours de 15 jours en listant trois choses simples pour lesquelles vous êtes reconnaissant aujourd\'hui.'
      },
      {
        day: 2,
        passage: 'Colossiens 4:2',
        title: 'Persévérer dans la prière',
        text: 'Persévérez dans la prière, veillez-y avec actions de grâces.',
        reflection: 'Prier sans dire merci rend nos requêtes sèches. Veillez sur vos pensées pour que la gratitude accompagne toujours vos requêtes spirituelles.'
      },
      {
        day: 3,
        passage: '1 Chroniques 16:34',
        title: 'Célébrez Sa bonté',
        text: 'Louez l\'Éternel, car il est bon, car sa miséricorde dure à toujours !',
        reflection: 'La bonté de Dieu ne dépend pas de nos performances ou de nos échecs. Elle est constante. Prenez le temps de louer Dieu simplement pour qui Il est.'
      },
      {
        day: 4,
        passage: 'Psaumes 107:1-3',
        title: 'Les rachetés de l\'Éternel',
        text: 'Qu\'ils le disent, les rachetés de l\'Éternel, qu\'il a délivrés de la main de l\'ennemi, et qu\'il a rassemblés de tous les pays !',
        reflection: 'Avoir été secouru est une excellente raison de témoigner et d\'exprimer sa joie. Pensez à un moment précis où Dieu vous a tiré d\'une situation difficile.'
      },
      {
        day: 5,
        passage: 'Jacques 1:17',
        title: 'La source de tout don parfait',
        text: 'Tout grâce excellente et tout don parfait descendent d\'en haut, du Père des lumières, chez lequel il n\'y a ni changement, ni ombre de variation.',
        reflection: 'Chaque beau coucher de soleil, chaque sourire d\'ami, chaque souffle de vie est un cadeau direct de Dieu. Remerciez-le pour sa générosité infinie.'
      },
      {
        day: 6,
        passage: 'Psaumes 118:24',
        title: 'Le jour que le Seigneur a fait',
        text: 'C\'est ici le jour que l\'Éternel a fait: Qu\'il soit pour nous un sujet d\'allégresse et de joie !',
        reflection: 'Ne remettez pas votre bonheur à plus tard ou à de meilleures circonstances. Aujourd\'hui est un don de Dieu, vivez-le pleinement et joyeusement.'
      },
      {
        day: 7,
        passage: '1 Thessaloniciens 5:18',
        title: 'En toute circonstance',
        text: 'Rendez grâces en toutes choses, car c\'est à votre égard la volonté de Dieu en Jésus-Christ.',
        reflection: 'Rendre grâce "en" toutes choses ne signifie pas rendre grâce "pour" les tragédies, mais rester conscient de la présence et de la bonté de Dieu même au cœur des difficultés.'
      },
      {
        day: 8,
        passage: 'Psaumes 103:2',
        title: 'N\'oublie aucun bienfait',
        text: 'Mon âme, bénis l\'Éternel, et n\'oublie aucun de ses bienfaits !',
        reflection: 'Notre esprit a tendance à retenir le négatif plus facilement que le positif. Faites l\'effort délibéré de noter les petits miracles de votre semaine.'
      },
      {
        day: 9,
        passage: 'Éphésiens 5:19-20',
        title: 'Des chants dans vos cœurs',
        text: 'Entretenez-vous par des psaumes, par des hymnes... chantant et célébrant de tout votre cœur les louanges du Seigneur; rendez continuellement grâces...',
        reflection: 'La musique et le chant ont un pouvoir thérapeutique merveilleux sur notre homme intérieur. Écoutez ou chantez un cantique de reconnaissance aujourd\'hui.'
      },
      {
        day: 10,
        passage: 'Psaumes 136:1-9',
        title: 'Sa miséricorde éternelle',
        text: 'Louez l\'Éternel, car il est bon, car sa miséricorde dure à toujours ! Louez le Dieu des dieux... Celui qui a fait les grands luminaires...',
        reflection: 'Le psalmiste répète la même phrase 26 fois comme un refrain réconfortant. Laissez ce refrain résonner en vous : "Sa miséricorde dure à toujours".'
      },
      {
        day: 11,
        passage: 'Philippiens 4:11-13',
        title: 'Le secret du contentement',
        text: 'J\'ai appris à être satisfait de l\'état où je me trouve... Je puis tout par celui qui me fortifie.',
        reflection: 'Le contentement n\'est pas la passivité, mais la paix d\'esprit sachant que notre valeur et notre sécurité dépendent de Dieu et non de nos possessions.'
      },
      {
        day: 12,
        passage: 'Hébreux 12:28',
        title: 'Un royaume inébranlable',
        text: 'C\'est pourquoi, recevant un royaume inébranlable, montrons notre reconnaissance en rendant à Dieu un culte qui lui soit agréable...',
        reflection: 'Toutes les institutions terrestres peuvent s\'effondrer, mais le Royaume spirituel auquel nous appartenons est éternel et solide. Soyons ancrés dans cette assurance.'
      },
      {
        day: 13,
        passage: 'Psaumes 34:1-3',
        title: 'Sa louange dans ma bouche',
        text: 'Je bénirai l\'Éternel en tout temps; sa louange sera toujours dans ma bouche. Que mon âme se glorifie en l\'Éternel !',
        reflection: 'Prendre l\'habitude de parler de manière positive et reconnaissante transforme l\'atmosphère autour de nous et encourage ceux qui nous écoutent.'
      },
      {
        day: 14,
        passage: 'Colossiens 3:17',
        title: 'Tout au nom de Jésus',
        text: 'Et quoi que vous fassiez, en parole ou en œuvre, faites tout au nom du Seigneur Jésus, en rendant par lui des grâces à Dieu le Père.',
        reflection: 'Faire la vaisselle, rédiger un e-mail ou aider un voisin : chaque action quotidienne peut devenir un acte d\'adoration et de reconnaissance.'
      },
      {
        day: 15,
        passage: 'Romains 11:33-36',
        title: 'La source et la fin de tout',
        text: 'O profondeur de la richesse, de la sagesse et de la science de Dieu ! Que ses jugements sont insondables... C\'est de lui, par lui, et pour lui que sont toutes choses.',
        reflection: 'Nous concluons ce parcours de gratitude en contemplant la grandeur infinie du Créateur. Tout vient de Lui, tout subsiste par Lui. À Lui soit la gloire éternellement !'
      }
    ]
  }
];
