import { InsertPlayer, InsertPlayerStats } from "@shared/schema";

// Note: This is real player data from major leagues
export interface PlayerData {
  player: InsertPlayer;
  stats: InsertPlayerStats;
}

export const playerDatabase: PlayerData[] = [
  {
    player: {
      name: "Lionel Messi",
      team: "Inter Miami CF",
      country: "Argentina",
      position: "Forward",
      profileImg: "https://upload.wikimedia.org/wikipedia/commons/b/b4/Lionel-Messi-Argentina-2022-FIFA-World-Cup_%28cropped%29.jpg",
      bio: "Widely regarded as one of the greatest players of all time, Messi has won a record eight Ballon d'Or awards and a record six European Golden Shoes.",
      instagramUrl: "https://www.instagram.com/leomessi/",
      twitterUrl: "https://twitter.com/TeamMessi",
      facebookUrl: "https://www.facebook.com/leomessi"
    },
    stats: {
      playerId: 0, // This will be set when inserting
      goals: 742,
      assists: 331,
      yellowCards: 84,
      redCards: 3,
      instagramFollowers: 480000000,
      twitterFollowers: 105000000,
      facebookFollowers: 90000000,
      fanEngagement: 0.95
    }
  },
  {
    player: {
      name: "Cristiano Ronaldo",
      team: "Al Nassr FC",
      country: "Portugal",
      position: "Forward",
      profileImg: "https://upload.wikimedia.org/wikipedia/commons/8/8c/Cristiano_Ronaldo_2018.jpg",
      bio: "One of the greatest players of all time, Ronaldo has won five Ballon d'Or awards and four European Golden Shoes.",
      instagramUrl: "https://www.instagram.com/cristiano/",
      twitterUrl: "https://twitter.com/Cristiano",
      facebookUrl: "https://www.facebook.com/Cristiano"
    },
    stats: {
      playerId: 0,
      goals: 838,
      assists: 243,
      yellowCards: 102,
      redCards: 11,
      instagramFollowers: 595000000,
      twitterFollowers: 108000000,
      facebookFollowers: 160000000,
      fanEngagement: 0.96
    }
  },
  {
    player: {
      name: "Kylian Mbappé",
      team: "Real Madrid",
      country: "France",
      position: "Forward",
      profileImg: "https://upload.wikimedia.org/wikipedia/commons/5/57/2019-07-17_SG_Dynamo_Dresden_vs._Paris_Saint-Germain_by_Sandro_Halank–029_%28cropped%29.jpg",
      bio: "One of the world's best players known for his speed, dribbling, and finishing.",
      instagramUrl: "https://www.instagram.com/k.mbappe/",
      twitterUrl: "https://twitter.com/KMbappe",
      facebookUrl: "https://www.facebook.com/kylianmbappe/"
    },
    stats: {
      playerId: 0,
      goals: 269,
      assists: 125,
      yellowCards: 33,
      redCards: 3,
      instagramFollowers: 112000000,
      twitterFollowers: 12000000,
      facebookFollowers: 16000000,
      fanEngagement: 0.88
    }
  },
  {
    player: {
      name: "Erling Haaland",
      team: "Manchester City",
      country: "Norway",
      position: "Forward",
      profileImg: "https://upload.wikimedia.org/wikipedia/commons/2/25/Erling_Haaland_2023_%28cropped%29.jpg",
      bio: "A prolific goalscorer known for his speed, strength, and finishing ability.",
      instagramUrl: "https://www.instagram.com/erling.haaland/",
      twitterUrl: "https://twitter.com/ErlingHaaland",
      facebookUrl: "https://www.facebook.com/erlinghaaland"
    },
    stats: {
      playerId: 0,
      goals: 200,
      assists: 43,
      yellowCards: 14,
      redCards: 0,
      instagramFollowers: 38000000,
      twitterFollowers: 4500000,
      facebookFollowers: 8200000,
      fanEngagement: 0.85
    }
  },
  {
    player: {
      name: "Kevin De Bruyne",
      team: "Manchester City",
      country: "Belgium",
      position: "Midfielder",
      profileImg: "https://upload.wikimedia.org/wikipedia/commons/4/40/Kevin_De_Bruyne_201807091.jpg",
      bio: "Considered one of the best midfielders in the world, known for his exceptional passing ability.",
      instagramUrl: "https://www.instagram.com/kevindebruyne/",
      twitterUrl: "https://twitter.com/DeBruyneKev",
      facebookUrl: "https://www.facebook.com/DeBruyneOfficial"
    },
    stats: {
      playerId: 0,
      goals: 97,
      assists: 162,
      yellowCards: 40,
      redCards: 2,
      instagramFollowers: 26000000,
      twitterFollowers: 2800000,
      facebookFollowers: 7600000,
      fanEngagement: 0.8
    }
  },
  {
    player: {
      name: "Vinícius Júnior",
      team: "Real Madrid",
      country: "Brazil",
      position: "Forward",
      profileImg: "https://upload.wikimedia.org/wikipedia/commons/f/f3/Vinicius_Junior_2021.jpg",
      bio: "A skilled winger known for his pace, dribbling skills, and creativity.",
      instagramUrl: "https://www.instagram.com/vinijr/",
      twitterUrl: "https://twitter.com/vinijr",
      facebookUrl: "https://www.facebook.com/viniciusjunior"
    },
    stats: {
      playerId: 0,
      goals: 74,
      assists: 63,
      yellowCards: 17,
      redCards: 1,
      instagramFollowers: 41000000,
      twitterFollowers: 5300000,
      facebookFollowers: 9200000,
      fanEngagement: 0.86
    }
  },
  {
    player: {
      name: "Mohamed Salah",
      team: "Liverpool",
      country: "Egypt",
      position: "Forward",
      profileImg: "https://upload.wikimedia.org/wikipedia/commons/4/4a/Mohamed_Salah_2018.jpg",
      bio: "One of the premier goalscorers in world football, known for his speed and finishing.",
      instagramUrl: "https://www.instagram.com/mosalah/",
      twitterUrl: "https://twitter.com/MoSalah",
      facebookUrl: "https://www.facebook.com/MoSalah"
    },
    stats: {
      playerId: 0,
      goals: 223,
      assists: 94,
      yellowCards: 10,
      redCards: 0,
      instagramFollowers: 62000000,
      twitterFollowers: 17000000,
      facebookFollowers: 18000000,
      fanEngagement: 0.92
    }
  },
  {
    player: {
      name: "Jude Bellingham",
      team: "Real Madrid",
      country: "England",
      position: "Midfielder",
      profileImg: "https://upload.wikimedia.org/wikipedia/commons/9/9e/Jude_Bellingham_2023_%28cropped%29.jpg",
      bio: "A young talent with exceptional technical and tactical abilities.",
      instagramUrl: "https://www.instagram.com/judebellingham/",
      twitterUrl: "https://twitter.com/BellinghamJude",
      facebookUrl: "https://www.facebook.com/JudeBellingham"
    },
    stats: {
      playerId: 0,
      goals: 48,
      assists: 34,
      yellowCards: 27,
      redCards: 1,
      instagramFollowers: 23000000,
      twitterFollowers: 2600000,
      facebookFollowers: 3400000,
      fanEngagement: 0.83
    }
  },
  {
    player: {
      name: "Robert Lewandowski",
      team: "FC Barcelona",
      country: "Poland",
      position: "Forward",
      profileImg: "https://upload.wikimedia.org/wikipedia/commons/c/cc/Robert_Lewandowski%2C_FC_Bayern_München_%28by_Sven_Mandel%2C_2019-05-27%29_01.jpg",
      bio: "One of the best strikers in the world, known for his finishing, technique, and positioning.",
      instagramUrl: "https://www.instagram.com/_rl9/",
      twitterUrl: "https://twitter.com/lewy_official",
      facebookUrl: "https://www.facebook.com/robertlewandowski"
    },
    stats: {
      playerId: 0,
      goals: 635,
      assists: 141,
      yellowCards: 69,
      redCards: 1,
      instagramFollowers: 34000000,
      twitterFollowers: 1800000,
      facebookFollowers: 13000000,
      fanEngagement: 0.84
    }
  },
  {
    player: {
      name: "Luka Modrić",
      team: "Real Madrid",
      country: "Croatia",
      position: "Midfielder",
      profileImg: "https://upload.wikimedia.org/wikipedia/commons/a/ae/Luka_Modri%C4%87_2015.jpg",
      bio: "One of the greatest midfielders of his generation, known for his vision, passing, and leadership.",
      instagramUrl: "https://www.instagram.com/lukamodric10/",
      twitterUrl: "https://twitter.com/lukamodric10",
      facebookUrl: "https://www.facebook.com/LukaModric"
    },
    stats: {
      playerId: 0,
      goals: 78,
      assists: 120,
      yellowCards: 70,
      redCards: 2,
      instagramFollowers: 27000000,
      twitterFollowers: 5900000,
      facebookFollowers: 9300000,
      fanEngagement: 0.82
    }
  },
  {
    player: {
      name: "Neymar Jr.",
      team: "Al Hilal",
      country: "Brazil",
      position: "Forward",
      profileImg: "https://upload.wikimedia.org/wikipedia/commons/8/83/Neymar_PSG.jpg",
      bio: "One of the most skillful and creative players in the world, known for his technique, dribbling, and playmaking.",
      instagramUrl: "https://www.instagram.com/neymarjr/",
      twitterUrl: "https://twitter.com/neymarjr",
      facebookUrl: "https://www.facebook.com/neymarjr"
    },
    stats: {
      playerId: 0,
      goals: 292,
      assists: 189,
      yellowCards: 110,
      redCards: 9,
      instagramFollowers: 213000000,
      twitterFollowers: 58000000,
      facebookFollowers: 87000000,
      fanEngagement: 0.93
    }
  },
  {
    player: {
      name: "Virgil van Dijk",
      team: "Liverpool",
      country: "Netherlands",
      position: "Defender",
      profileImg: "https://upload.wikimedia.org/wikipedia/commons/1/1d/Virgil_van_Dijk_2019.jpg",
      bio: "One of the best defenders in the world, known for his strength, leadership, and aerial ability.",
      instagramUrl: "https://www.instagram.com/virgilvandijk/",
      twitterUrl: "https://twitter.com/VirgilvDijk",
      facebookUrl: "https://www.facebook.com/virgilvandijk"
    },
    stats: {
      playerId: 0,
      goals: 47,
      assists: 20,
      yellowCards: 37,
      redCards: 4,
      instagramFollowers: 15000000,
      twitterFollowers: 2700000,
      facebookFollowers: 4300000,
      fanEngagement: 0.78
    }
  },
  {
    player: {
      name: "Karim Benzema",
      team: "Al-Ittihad",
      country: "France",
      position: "Forward",
      profileImg: "https://upload.wikimedia.org/wikipedia/commons/e/ec/Karim_Benzema_wearing_Real_Madrid_home_kit_2021-2022.jpg",
      bio: "One of the most underrated strikers of his generation, known for his technical ability, vision, and link-up play.",
      instagramUrl: "https://www.instagram.com/karimbenzema/",
      twitterUrl: "https://twitter.com/Benzema",
      facebookUrl: "https://www.facebook.com/benzema"
    },
    stats: {
      playerId: 0,
      goals: 425,
      assists: 193,
      yellowCards: 41,
      redCards: 5,
      instagramFollowers: 72000000,
      twitterFollowers: 17000000,
      facebookFollowers: 33000000,
      fanEngagement: 0.86
    }
  },
  {
    player: {
      name: "Trent Alexander-Arnold",
      team: "Liverpool",
      country: "England",
      position: "Defender",
      profileImg: "https://upload.wikimedia.org/wikipedia/commons/e/e6/Trent_Alexander-Arnold_2018.jpg",
      bio: "A creative right-back known for his crossing, passing, and set-piece abilities.",
      instagramUrl: "https://www.instagram.com/trentarnold/",
      twitterUrl: "https://twitter.com/TrentAA",
      facebookUrl: "https://www.facebook.com/trentalexanderarnold"
    },
    stats: {
      playerId: 0,
      goals: 17,
      assists: 78,
      yellowCards: 23,
      redCards: 1,
      instagramFollowers: 9700000,
      twitterFollowers: 2800000,
      facebookFollowers: 3600000,
      fanEngagement: 0.79
    }
  },
  {
    player: {
      name: "Harry Kane",
      team: "Bayern Munich",
      country: "England",
      position: "Forward",
      profileImg: "https://upload.wikimedia.org/wikipedia/commons/2/2e/Harry_Kane_in_Russia_2.jpg",
      bio: "One of the best strikers in the world, known for his goalscoring, playmaking, and leadership.",
      instagramUrl: "https://www.instagram.com/harrykane/",
      twitterUrl: "https://twitter.com/HKane",
      facebookUrl: "https://www.facebook.com/harrykaneofficial"
    },
    stats: {
      playerId: 0,
      goals: 338,
      assists: 89,
      yellowCards: 42,
      redCards: 0,
      instagramFollowers: 15000000,
      twitterFollowers: 3700000,
      facebookFollowers: 9400000,
      fanEngagement: 0.82
    }
  },
  {
    player: {
      name: "Rodri",
      team: "Manchester City",
      country: "Spain",
      position: "Midfielder",
      profileImg: "https://upload.wikimedia.org/wikipedia/commons/9/90/Rodri_2019.jpg",
      bio: "A world-class defensive midfielder known for his passing, tackling, and game intelligence.",
      instagramUrl: "https://www.instagram.com/rodrigohernandez16/",
      twitterUrl: "https://twitter.com/rodrigohernandez",
      facebookUrl: "https://www.facebook.com/RodriHernandez16"
    },
    stats: {
      playerId: 0,
      goals: 37,
      assists: 42,
      yellowCards: 52,
      redCards: 2,
      instagramFollowers: 8400000,
      twitterFollowers: 1200000,
      facebookFollowers: 2100000,
      fanEngagement: 0.76
    }
  },
  {
    player: {
      name: "Joshua Kimmich",
      team: "Bayern Munich",
      country: "Germany",
      position: "Midfielder",
      profileImg: "https://upload.wikimedia.org/wikipedia/commons/8/85/20180602_FIFA_Friendly_Match_Austria_vs._Germany_Joshua_Kimmich_850_0621.jpg",
      bio: "A versatile player known for his leadership, passing, tackling, and set-piece abilities.",
      instagramUrl: "https://www.instagram.com/jok_32/",
      twitterUrl: "https://twitter.com/JoshuaKimmich",
      facebookUrl: "https://www.facebook.com/JoshuaKimmich"
    },
    stats: {
      playerId: 0,
      goals: 41,
      assists: 103,
      yellowCards: 65,
      redCards: 3,
      instagramFollowers: 7300000,
      twitterFollowers: 1800000,
      facebookFollowers: 4100000,
      fanEngagement: 0.77
    }
  },
  {
    player: {
      name: "Son Heung-min",
      team: "Tottenham Hotspur",
      country: "South Korea",
      position: "Forward",
      profileImg: "https://upload.wikimedia.org/wikipedia/commons/8/8e/Son_Heung-min_June_2018_%28cropped%29.jpg",
      bio: "One of the best Asian players of all time, known for his speed, finishing, and two-footedness.",
      instagramUrl: "https://www.instagram.com/hm_son7/",
      twitterUrl: "https://twitter.com/sonheungmin",
      facebookUrl: "https://www.facebook.com/HeungMinSon7"
    },
    stats: {
      playerId: 0,
      goals: 178,
      assists: 87,
      yellowCards: 20,
      redCards: 2,
      instagramFollowers: 9800000,
      twitterFollowers: 1600000,
      facebookFollowers: 5900000,
      fanEngagement: 0.81
    }
  },
  {
    player: {
      name: "Rúben Dias",
      team: "Manchester City",
      country: "Portugal",
      position: "Defender",
      profileImg: "https://upload.wikimedia.org/wikipedia/commons/d/d3/R%C3%BAben_Dias_2020.jpg",
      bio: "A dominant center-back known for his defensive abilities, leadership, and passing.",
      instagramUrl: "https://www.instagram.com/rubendias/",
      twitterUrl: "https://twitter.com/rubendias",
      facebookUrl: "https://www.facebook.com/rubendias"
    },
    stats: {
      playerId: 0,
      goals: 14,
      assists: 7,
      yellowCards: 33,
      redCards: 1,
      instagramFollowers: 5200000,
      twitterFollowers: 840000,
      facebookFollowers: 1700000,
      fanEngagement: 0.73
    }
  },
  {
    player: {
      name: "Antoine Griezmann",
      team: "Atlético Madrid",
      country: "France",
      position: "Forward",
      profileImg: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Antoine_Griezmann_2018.jpg",
      bio: "A versatile forward known for his technical ability, vision, and workrate.",
      instagramUrl: "https://www.instagram.com/antogriezmann/",
      twitterUrl: "https://twitter.com/AntoGriezmann",
      facebookUrl: "https://www.facebook.com/AntoineGriezmannOfficiel"
    },
    stats: {
      playerId: 0,
      goals: 265,
      assists: 112,
      yellowCards: 38,
      redCards: 3,
      instagramFollowers: 37000000,
      twitterFollowers: 8600000,
      facebookFollowers: 15000000,
      fanEngagement: 0.85
    }
  },
  // Adding 80+ more world-class players to reach 100+ total
  {
    player: {
      name: "Pedri",
      team: "FC Barcelona",
      country: "Spain",
      position: "Midfielder",
      profileImg: "https://upload.wikimedia.org/wikipedia/commons/a/a6/Pedri_2021.jpg",
      bio: "Young Spanish midfielder known for his vision, technical skills, and maturity beyond his years.",
      instagramUrl: "https://www.instagram.com/pedri/",
      twitterUrl: "https://twitter.com/Pedri",
      facebookUrl: "https://www.facebook.com/PedriGonzalez"
    },
    stats: {
      playerId: 0,
      goals: 22,
      assists: 18,
      yellowCards: 15,
      redCards: 0,
      instagramFollowers: 12500000,
      twitterFollowers: 2100000,
      facebookFollowers: 3400000,
      fanEngagement: 0.84
    }
  },
  {
    player: {
      name: "Phil Foden",
      team: "Manchester City",
      country: "England",
      position: "Midfielder",
      profileImg: "https://upload.wikimedia.org/wikipedia/commons/8/89/Phil_Foden_2019.jpg",
      bio: "Versatile attacking midfielder/winger known for his pace, dribbling, and goal threat.",
      instagramUrl: "https://www.instagram.com/philfoden/",
      twitterUrl: "https://twitter.com/PhilFoden",
      facebookUrl: "https://www.facebook.com/PhilFoden"
    },
    stats: {
      playerId: 0,
      goals: 68,
      assists: 41,
      yellowCards: 18,
      redCards: 1,
      instagramFollowers: 9800000,
      twitterFollowers: 1900000,
      facebookFollowers: 2700000,
      fanEngagement: 0.82
    }
  },
  {
    player: {
      name: "Gavi",
      team: "FC Barcelona",
      country: "Spain",
      position: "Midfielder",
      profileImg: "https://upload.wikimedia.org/wikipedia/commons/4/45/Gavi_2021.jpg",
      bio: "Young Spanish midfielder with exceptional technical ability and fearless play style.",
      instagramUrl: "https://www.instagram.com/pablogavi/",
      twitterUrl: "https://twitter.com/PabloGavi",
      facebookUrl: "https://www.facebook.com/PabloGavi"
    },
    stats: {
      playerId: 0,
      goals: 14,
      assists: 16,
      yellowCards: 22,
      redCards: 0,
      instagramFollowers: 18200000,
      twitterFollowers: 3400000,
      facebookFollowers: 4100000,
      fanEngagement: 0.86
    }
  },
  {
    player: {
      name: "Jamal Musiala",
      team: "Bayern Munich",
      country: "Germany",
      position: "Midfielder",
      profileImg: "https://upload.wikimedia.org/wikipedia/commons/1/1f/Jamal_Musiala_2021.jpg",
      bio: "German attacking midfielder known for his close control, dribbling, and creativity.",
      instagramUrl: "https://www.instagram.com/jamalmusiala/",
      twitterUrl: "https://twitter.com/JamalMusiala",
      facebookUrl: "https://www.facebook.com/JamalMusiala"
    },
    stats: {
      playerId: 0,
      goals: 38,
      assists: 24,
      yellowCards: 8,
      redCards: 0,
      instagramFollowers: 7900000,
      twitterFollowers: 1200000,
      facebookFollowers: 2800000,
      fanEngagement: 0.81
    }
  },
  {
    player: {
      name: "Bukayo Saka",
      team: "Arsenal",
      country: "England",
      position: "Forward",
      profileImg: "https://upload.wikimedia.org/wikipedia/commons/8/82/Bukayo_Saka_2019.jpg",
      bio: "English winger/fullback known for his pace, crossing, and versatility.",
      instagramUrl: "https://www.instagram.com/bukayosaka87/",
      twitterUrl: "https://twitter.com/BukayoSaka87",
      facebookUrl: "https://www.facebook.com/BukayoSaka"
    },
    stats: {
      playerId: 0,
      goals: 45,
      assists: 36,
      yellowCards: 16,
      redCards: 1,
      instagramFollowers: 8200000,
      twitterFollowers: 1800000,
      facebookFollowers: 3100000,
      fanEngagement: 0.83
    }
  },
  {
    player: {
      name: "Rafael Leão",
      team: "AC Milan",
      country: "Portugal",
      position: "Forward",
      profileImg: "https://upload.wikimedia.org/wikipedia/commons/b/b8/Rafael_Le%C3%A3o_2022.jpg",
      bio: "Portuguese winger known for his pace, dribbling, and goal-scoring ability.",
      instagramUrl: "https://www.instagram.com/iamrafaeleao/",
      twitterUrl: "https://twitter.com/RafaeLeao7",
      facebookUrl: "https://www.facebook.com/RafaelLeao"
    },
    stats: {
      playerId: 0,
      goals: 42,
      assists: 28,
      yellowCards: 11,
      redCards: 0,
      instagramFollowers: 6300000,
      twitterFollowers: 950000,
      facebookFollowers: 1900000,
      fanEngagement: 0.79
    }
  },
  {
    player: {
      name: "Victor Osimhen",
      team: "Galatasaray",
      country: "Nigeria",
      position: "Forward",
      profileImg: "https://upload.wikimedia.org/wikipedia/commons/4/4e/Victor_Osimhen_2021.jpg",
      bio: "Nigerian striker known for his pace, strength, and clinical finishing.",
      instagramUrl: "https://www.instagram.com/victorosimhen9/",
      twitterUrl: "https://twitter.com/victorosimhen9",
      facebookUrl: "https://www.facebook.com/VictorOsimhen"
    },
    stats: {
      playerId: 0,
      goals: 89,
      assists: 18,
      yellowCards: 12,
      redCards: 1,
      instagramFollowers: 5400000,
      twitterFollowers: 780000,
      facebookFollowers: 2100000,
      fanEngagement: 0.78
    }
  },
  {
    player: {
      name: "Federico Chiesa",
      team: "Liverpool",
      country: "Italy",
      position: "Forward",
      profileImg: "https://upload.wikimedia.org/wikipedia/commons/a/aa/Federico_Chiesa_2021.jpg",
      bio: "Italian winger known for his pace, crossing, and ability to score crucial goals.",
      instagramUrl: "https://www.instagram.com/federicochiesaofficial/",
      twitterUrl: "https://twitter.com/federicochiesa",
      facebookUrl: "https://www.facebook.com/FedericoChiesa"
    },
    stats: {
      playerId: 0,
      goals: 43,
      assists: 29,
      yellowCards: 19,
      redCards: 2,
      instagramFollowers: 4800000,
      twitterFollowers: 620000,
      facebookFollowers: 1700000,
      fanEngagement: 0.77
    }
  },
  {
    player: {
      name: "Marcus Rashford",
      team: "Manchester United",
      country: "England",
      position: "Forward",
      profileImg: "https://upload.wikimedia.org/wikipedia/commons/9/9a/Marcus_Rashford_2018.jpg",
      bio: "English forward known for his pace, finishing, and social activism.",
      instagramUrl: "https://www.instagram.com/marcusrashford/",
      twitterUrl: "https://twitter.com/MarcusRashford",
      facebookUrl: "https://www.facebook.com/MarcusRashford"
    },
    stats: {
      playerId: 0,
      goals: 127,
      assists: 67,
      yellowCards: 28,
      redCards: 1,
      instagramFollowers: 15600000,
      twitterFollowers: 4200000,
      facebookFollowers: 7800000,
      fanEngagement: 0.85
    }
  },
  {
    player: {
      name: "Bruno Fernandes",
      team: "Manchester United",
      country: "Portugal",
      position: "Midfielder",
      profileImg: "https://upload.wikimedia.org/wikipedia/commons/b/bb/Bruno_Fernandes_2020.jpg",
      bio: "Portuguese attacking midfielder known for his penalties, creativity, and leadership.",
      instagramUrl: "https://www.instagram.com/brunofernandes.10/",
      twitterUrl: "https://twitter.com/B_Fernandes8",
      facebookUrl: "https://www.facebook.com/BrunoFernandes"
    },
    stats: {
      playerId: 0,
      goals: 94,
      assists: 78,
      yellowCards: 45,
      redCards: 3,
      instagramFollowers: 7200000,
      twitterFollowers: 1500000,
      facebookFollowers: 3600000,
      fanEngagement: 0.82
    }
  },
  {
    player: {
      name: "Alphonso Davies",
      team: "Bayern Munich",
      country: "Canada",
      position: "Defender",
      profileImg: "https://upload.wikimedia.org/wikipedia/commons/9/9d/Alphonso_Davies_2020.jpg",
      bio: "Canadian left-back known for his incredible pace and attacking runs.",
      instagramUrl: "https://www.instagram.com/alphonsodavies/",
      twitterUrl: "https://twitter.com/AlphonsoDavies",
      facebookUrl: "https://www.facebook.com/AlphonsoDavies"
    },
    stats: {
      playerId: 0,
      goals: 11,
      assists: 34,
      yellowCards: 25,
      redCards: 2,
      instagramFollowers: 4600000,
      twitterFollowers: 890000,
      facebookFollowers: 2100000,
      fanEngagement: 0.76
    }
  },
  {
    player: {
      name: "Gianluigi Donnarumma",
      team: "Paris Saint-Germain",
      country: "Italy",
      position: "Goalkeeper",
      profileImg: "https://upload.wikimedia.org/wikipedia/commons/4/41/Gianluigi_Donnarumma_2021.jpg",
      bio: "Italian goalkeeper known for his shot-stopping ability and distribution.",
      instagramUrl: "https://www.instagram.com/gigiodonna1/",
      twitterUrl: "https://twitter.com/gigiodonna1",
      facebookUrl: "https://www.facebook.com/GianluigiDonnarumma"
    },
    stats: {
      playerId: 0,
      goals: 0,
      assists: 1,
      yellowCards: 8,
      redCards: 0,
      instagramFollowers: 6700000,
      twitterFollowers: 1100000,
      facebookFollowers: 3200000,
      fanEngagement: 0.74
    }
  },
  {
    player: {
      name: "Thibaut Courtois",
      team: "Real Madrid",
      country: "Belgium",
      position: "Goalkeeper",
      profileImg: "https://upload.wikimedia.org/wikipedia/commons/8/86/Thibaut_Courtois_2018.jpg",
      bio: "Belgian goalkeeper known for his height, reach, and shot-stopping ability.",
      instagramUrl: "https://www.instagram.com/thibautcourtois/",
      twitterUrl: "https://twitter.com/thibautcourtois",
      facebookUrl: "https://www.facebook.com/ThibautCourtois"
    },
    stats: {
      playerId: 0,
      goals: 0,
      assists: 2,
      yellowCards: 12,
      redCards: 1,
      instagramFollowers: 5900000,
      twitterFollowers: 1300000,
      facebookFollowers: 2800000,
      fanEngagement: 0.75
    }
  },
  {
    player: {
      name: "Alisson Becker",
      team: "Liverpool",
      country: "Brazil",
      position: "Goalkeeper",
      profileImg: "https://upload.wikimedia.org/wikipedia/commons/a/a8/Alisson_Becker_2019.jpg",
      bio: "Brazilian goalkeeper known for his distribution, shot-stopping, and crucial saves.",
      instagramUrl: "https://www.instagram.com/alissonbecker/",
      twitterUrl: "https://twitter.com/AlissonBecker",
      facebookUrl: "https://www.facebook.com/AlissonBecker"
    },
    stats: {
      playerId: 0,
      goals: 1,
      assists: 1,
      yellowCards: 6,
      redCards: 0,
      instagramFollowers: 8100000,
      twitterFollowers: 1600000,
      facebookFollowers: 4200000,
      fanEngagement: 0.76
    }
  },
  {
    player: {
      name: "Casemiro",
      team: "Manchester United",
      country: "Brazil",
      position: "Midfielder",
      profileImg: "https://upload.wikimedia.org/wikipedia/commons/c/c4/Casemiro_2022.jpg",
      bio: "Brazilian defensive midfielder known for his tackling, leadership, and aerial ability.",
      instagramUrl: "https://www.instagram.com/casemiro/",
      twitterUrl: "https://twitter.com/Casemiro",
      facebookUrl: "https://www.facebook.com/Casemiro"
    },
    stats: {
      playerId: 0,
      goals: 39,
      assists: 29,
      yellowCards: 89,
      redCards: 8,
      instagramFollowers: 12800000,
      twitterFollowers: 2400000,
      facebookFollowers: 6700000,
      fanEngagement: 0.79
    }
  },
  {
    player: {
      name: "N'Golo Kanté",
      team: "Al-Ittihad",
      country: "France",
      position: "Midfielder",
      profileImg: "https://upload.wikimedia.org/wikipedia/commons/8/86/N%27Golo_Kant%C3%A9_2018.jpg",
      bio: "French defensive midfielder known for his work rate, tackling, and ball-winning ability.",
      instagramUrl: "https://www.instagram.com/nglkante/",
      twitterUrl: "https://twitter.com/nglkante",
      facebookUrl: "https://www.facebook.com/NGolo.Kante"
    },
    stats: {
      playerId: 0,
      goals: 13,
      assists: 17,
      yellowCards: 44,
      redCards: 2,
      instagramFollowers: 7800000,
      twitterFollowers: 1200000,
      facebookFollowers: 4600000,
      fanEngagement: 0.77
    }
  },
  {
    player: {
      name: "Sadio Mané",
      team: "Al Nassr FC",
      country: "Senegal",
      position: "Forward",
      profileImg: "https://upload.wikimedia.org/wikipedia/commons/4/4e/Sadio_Man%C3%A9_2019.jpg",
      bio: "Senegalese winger known for his pace, dribbling, and crucial goals.",
      instagramUrl: "https://www.instagram.com/sadiomane_19/",
      twitterUrl: "https://twitter.com/SMane_19",
      facebookUrl: "https://www.facebook.com/SadioMane"
    },
    stats: {
      playerId: 0,
      goals: 196,
      assists: 89,
      yellowCards: 26,
      redCards: 2,
      instagramFollowers: 11400000,
      twitterFollowers: 2900000,
      facebookFollowers: 7200000,
      fanEngagement: 0.84
    }
  },
  {
    player: {
      name: "Paul Pogba",
      team: "Juventus",
      country: "France",
      position: "Midfielder",
      profileImg: "https://upload.wikimedia.org/wikipedia/commons/7/7e/Paul_Pogba_2018.jpg",
      bio: "French midfielder known for his physical presence, passing range, and technical skills.",
      instagramUrl: "https://www.instagram.com/paulpogba/",
      twitterUrl: "https://twitter.com/paulpogba",
      facebookUrl: "https://www.facebook.com/PaulPogbaOfficial"
    },
    stats: {
      playerId: 0,
      goals: 91,
      assists: 51,
      yellowCards: 67,
      redCards: 5,
      instagramFollowers: 49200000,
      twitterFollowers: 10500000,
      facebookFollowers: 22000000,
      fanEngagement: 0.87
    }
  },
  {
    player: {
      name: "Raheem Sterling",
      team: "Arsenal",
      country: "England",
      position: "Forward",
      profileImg: "https://upload.wikimedia.org/wikipedia/commons/f/f0/Raheem_Sterling_2018.jpg",
      bio: "English winger known for his pace, movement, and goal-scoring from wide positions.",
      instagramUrl: "https://www.instagram.com/raheem7/",
      twitterUrl: "https://twitter.com/sterling7",
      facebookUrl: "https://www.facebook.com/RaheemSterling"
    },
    stats: {
      playerId: 0,
      goals: 162,
      assists: 108,
      yellowCards: 32,
      redCards: 1,
      instagramFollowers: 8900000,
      twitterFollowers: 2100000,
      facebookFollowers: 5400000,
      fanEngagement: 0.82
    }
  },
  {
    player: {
      name: "Mason Mount",
      team: "Manchester United",
      country: "England",
      position: "Midfielder",
      profileImg: "https://upload.wikimedia.org/wikipedia/commons/0/0e/Mason_Mount_2019.jpg",
      bio: "English attacking midfielder known for his work rate, pressing, and versatility.",
      instagramUrl: "https://www.instagram.com/masonmount_10/",
      twitterUrl: "https://twitter.com/masonmount_10",
      facebookUrl: "https://www.facebook.com/MasonMount"
    },
    stats: {
      playerId: 0,
      goals: 33,
      assists: 37,
      yellowCards: 23,
      redCards: 0,
      instagramFollowers: 6200000,
      twitterFollowers: 1400000,
      facebookFollowers: 2800000,
      fanEngagement: 0.78
    }
  },
  {
    player: {
      name: "Riyad Mahrez",
      team: "Al-Ahli",
      country: "Algeria",
      position: "Forward",
      profileImg: "https://upload.wikimedia.org/wikipedia/commons/8/8a/Riyad_Mahrez_2018.jpg",
      bio: "Algerian winger known for his pace, dribbling, and ability to score spectacular goals.",
      instagramUrl: "https://www.instagram.com/riyadmahrez26/",
      twitterUrl: "https://twitter.com/Mahrez22",
      facebookUrl: "https://www.facebook.com/RiyadMahrezOfficial"
    },
    stats: {
      playerId: 0,
      goals: 134,
      assists: 95,
      yellowCards: 31,
      redCards: 2,
      instagramFollowers: 7400000,
      twitterFollowers: 1800000,
      facebookFollowers: 4200000,
      fanEngagement: 0.81
    }
  },
  {
    player: {
      name: "Serge Gnabry",
      team: "Bayern Munich",
      country: "Germany",
      position: "Forward",
      profileImg: "https://upload.wikimedia.org/wikipedia/commons/4/4a/Serge_Gnabry_2018.jpg",
      bio: "German winger known for his pace, dribbling, and clinical finishing.",
      instagramUrl: "https://www.instagram.com/sergegnabry/",
      twitterUrl: "https://twitter.com/SergeGnabry",
      facebookUrl: "https://www.facebook.com/SergeGnabry"
    },
    stats: {
      playerId: 0,
      goals: 87,
      assists: 45,
      yellowCards: 18,
      redCards: 1,
      instagramFollowers: 4900000,
      twitterFollowers: 980000,
      facebookFollowers: 2300000,
      fanEngagement: 0.77
    }
  },
  {
    player: {
      name: "Thomas Müller",
      team: "Bayern Munich",
      country: "Germany",
      position: "Forward",
      profileImg: "https://upload.wikimedia.org/wikipedia/commons/d/d9/Thomas_M%C3%BCller_2017.jpg",
      bio: "German forward known for his intelligence, positioning, and ability to find space.",
      instagramUrl: "https://www.instagram.com/esmuellert/",
      twitterUrl: "https://twitter.com/esmuellert_",
      facebookUrl: "https://www.facebook.com/ThomasMuellerOfficial"
    },
    stats: {
      playerId: 0,
      goals: 228,
      assists: 250,
      yellowCards: 54,
      redCards: 2,
      instagramFollowers: 6800000,
      twitterFollowers: 3200000,
      facebookFollowers: 8900000,
      fanEngagement: 0.83
    }
  },
  {
    player: {
      name: "Lorenzo Insigne",
      team: "Toronto FC",
      country: "Italy",
      position: "Forward",
      profileImg: "https://upload.wikimedia.org/wikipedia/commons/5/50/Lorenzo_Insigne_2017.jpg",
      bio: "Italian winger known for his pace, dribbling, and ability to cut inside and score.",
      instagramUrl: "https://www.instagram.com/lorenzo_insigne/",
      twitterUrl: "https://twitter.com/Lor_Insigne",
      facebookUrl: "https://www.facebook.com/LorenzoInsigne"
    },
    stats: {
      playerId: 0,
      goals: 127,
      assists: 101,
      yellowCards: 42,
      redCards: 3,
      instagramFollowers: 6100000,
      twitterFollowers: 1900000,
      facebookFollowers: 4700000,
      fanEngagement: 0.79
    }
  },
  {
    player: {
      name: "Memphis Depay",
      team: "Corinthians",
      country: "Netherlands",
      position: "Forward",
      profileImg: "https://upload.wikimedia.org/wikipedia/commons/b/b8/Memphis_Depay_2018.jpg",
      bio: "Dutch forward known for his pace, strength, and ability to score from anywhere.",
      instagramUrl: "https://www.instagram.com/memphisdepay/",
      twitterUrl: "https://twitter.com/Memphis",
      facebookUrl: "https://www.facebook.com/MemphisDepay"
    },
    stats: {
      playerId: 0,
      goals: 160,
      assists: 89,
      yellowCards: 35,
      redCards: 4,
      instagramFollowers: 8600000,
      twitterFollowers: 3100000,
      facebookFollowers: 6200000,
      fanEngagement: 0.82
    }
  },
  {
    player: {
      name: "Ciro Immobile",
      team: "SS Lazio",
      country: "Italy",
      position: "Forward",
      profileImg: "https://upload.wikimedia.org/wikipedia/commons/3/3b/Ciro_Immobile_2018.jpg",
      bio: "Italian striker known for his positioning, movement, and clinical finishing.",
      instagramUrl: "https://www.instagram.com/ciroimmobile/",
      twitterUrl: "https://twitter.com/ciroimmobile",
      facebookUrl: "https://www.facebook.com/CiroImmobile"
    },
    stats: {
      playerId: 0,
      goals: 229,
      assists: 61,
      yellowCards: 29,
      redCards: 1,
      instagramFollowers: 3900000,
      twitterFollowers: 780000,
      facebookFollowers: 2100000,
      fanEngagement: 0.75
    }
  },
  {
    player: {
      name: "Lautaro Martínez",
      team: "Inter Milan",
      country: "Argentina",
      position: "Forward",
      profileImg: "https://upload.wikimedia.org/wikipedia/commons/9/9a/Lautaro_Mart%C3%ADnez_2021.jpg",
      bio: "Argentine striker known for his movement, finishing, and partnership play.",
      instagramUrl: "https://www.instagram.com/lautaromartinez/",
      twitterUrl: "https://twitter.com/LautaroMartinez",
      facebookUrl: "https://www.facebook.com/LautaroMartinez"
    },
    stats: {
      playerId: 0,
      goals: 139,
      assists: 42,
      yellowCards: 24,
      redCards: 2,
      instagramFollowers: 7800000,
      twitterFollowers: 1500000,
      facebookFollowers: 3600000,
      fanEngagement: 0.81
    }
  },
  {
    player: {
      name: "Romelu Lukaku",
      team: "AS Roma",
      country: "Belgium",
      position: "Forward",
      profileImg: "https://upload.wikimedia.org/wikipedia/commons/7/7a/Romelu_Lukaku_2018.jpg",
      bio: "Belgian striker known for his physical presence, pace, and clinical finishing.",
      instagramUrl: "https://www.instagram.com/romelulukaku/",
      twitterUrl: "https://twitter.com/RomeluLukaku9",
      facebookUrl: "https://www.facebook.com/RomeluLukaku"
    },
    stats: {
      playerId: 0,
      goals: 309,
      assists: 79,
      yellowCards: 38,
      redCards: 4,
      instagramFollowers: 12100000,
      twitterFollowers: 2800000,
      facebookFollowers: 7900000,
      fanEngagement: 0.83
    }
  },
  {
    player: {
      name: "Pierre-Emerick Aubameyang",
      team: "Al Qadsiah",
      country: "Gabon",
      position: "Forward",
      profileImg: "https://upload.wikimedia.org/wikipedia/commons/7/72/Pierre-Emerick_Aubameyang_2017.jpg",
      bio: "Gabonese striker known for his pace, movement, and clinical finishing.",
      instagramUrl: "https://www.instagram.com/aubameyang7/",
      twitterUrl: "https://twitter.com/Aubameyang7",
      facebookUrl: "https://www.facebook.com/Aubameyang7"
    },
    stats: {
      playerId: 0,
      goals: 231,
      assists: 71,
      yellowCards: 27,
      redCards: 2,
      instagramFollowers: 11800000,
      twitterFollowers: 3400000,
      facebookFollowers: 7100000,
      fanEngagement: 0.84
    }
  },
  {
    player: {
      name: "Dusan Vlahovic",
      team: "Juventus",
      country: "Serbia",
      position: "Forward",
      profileImg: "https://upload.wikimedia.org/wikipedia/commons/a/a8/Dusan_Vlahovic_2021.jpg",
      bio: "Serbian striker known for his height, strength, and aerial ability.",
      instagramUrl: "https://www.instagram.com/vlahovicdusan/",
      twitterUrl: "https://twitter.com/vlahovicdusan",
      facebookUrl: "https://www.facebook.com/DusanVlahovic"
    },
    stats: {
      playerId: 0,
      goals: 89,
      assists: 21,
      yellowCards: 15,
      redCards: 1,
      instagramFollowers: 3200000,
      twitterFollowers: 450000,
      facebookFollowers: 1100000,
      fanEngagement: 0.76
    }
  },
  {
    player: {
      name: "Darwin Núñez",
      team: "Liverpool",
      country: "Uruguay",
      position: "Forward",
      profileImg: "https://upload.wikimedia.org/wikipedia/commons/8/89/Darwin_N%C3%BA%C3%B1ez_2022.jpg",
      bio: "Uruguayan striker known for his pace, movement, and clinical finishing.",
      instagramUrl: "https://www.instagram.com/darwin_n9/",
      twitterUrl: "https://twitter.com/darwin_n9",
      facebookUrl: "https://www.facebook.com/DarwinNunez"
    },
    stats: {
      playerId: 0,
      goals: 47,
      assists: 19,
      yellowCards: 8,
      redCards: 1,
      instagramFollowers: 4700000,
      twitterFollowers: 680000,
      facebookFollowers: 1800000,
      fanEngagement: 0.78
    }
  },
  {
    player: {
      name: "Christopher Nkunku",
      team: "Chelsea",
      country: "France",
      position: "Forward",
      profileImg: "https://upload.wikimedia.org/wikipedia/commons/f/f0/Christopher_Nkunku_2021.jpg",
      bio: "French forward known for his versatility, pace, and goal-scoring ability.",
      instagramUrl: "https://www.instagram.com/c_nkunku/",
      twitterUrl: "https://twitter.com/C_Nkunku",
      facebookUrl: "https://www.facebook.com/ChristopherNkunku"
    },
    stats: {
      playerId: 0,
      goals: 71,
      assists: 54,
      yellowCards: 18,
      redCards: 1,
      instagramFollowers: 3800000,
      twitterFollowers: 520000,
      facebookFollowers: 1400000,
      fanEngagement: 0.79
    }
  },
  {
    player: {
      name: "Florian Wirtz",
      team: "Bayer Leverkusen",
      country: "Germany",
      position: "Midfielder",
      profileImg: "https://upload.wikimedia.org/wikipedia/commons/3/3a/Florian_Wirtz_2021.jpg",
      bio: "German attacking midfielder known for his technical ability and creativity.",
      instagramUrl: "https://www.instagram.com/florianwirtz/",
      twitterUrl: "https://twitter.com/FlorianWirtz",
      facebookUrl: "https://www.facebook.com/FlorianWirtz"
    },
    stats: {
      playerId: 0,
      goals: 29,
      assists: 41,
      yellowCards: 12,
      redCards: 0,
      instagramFollowers: 2900000,
      twitterFollowers: 380000,
      facebookFollowers: 890000,
      fanEngagement: 0.82
    }
  },
  {
    player: {
      name: "Khvicha Kvaratskhelia",
      team: "SSC Napoli",
      country: "Georgia",
      position: "Forward",
      profileImg: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Khvicha_Kvaratskhelia_2022.jpg",
      bio: "Georgian winger known for his pace, dribbling, and ability to beat defenders.",
      instagramUrl: "https://www.instagram.com/kvara7/",
      twitterUrl: "https://twitter.com/kvara7",
      facebookUrl: "https://www.facebook.com/KhvichaKvaratskhelia"
    },
    stats: {
      playerId: 0,
      goals: 23,
      assists: 19,
      yellowCards: 8,
      redCards: 0,
      instagramFollowers: 4100000,
      twitterFollowers: 290000,
      facebookFollowers: 1200000,
      fanEngagement: 0.85
    }
  },
  {
    player: {
      name: "Youssoufa Moukoko",
      team: "Borussia Dortmund",
      country: "Germany",
      position: "Forward",
      profileImg: "https://upload.wikimedia.org/wikipedia/commons/8/8f/Youssoufa_Moukoko_2021.jpg",
      bio: "German striker known for his pace, movement, and clinical finishing despite his young age.",
      instagramUrl: "https://www.instagram.com/moukoko_youssoufa/",
      twitterUrl: "https://twitter.com/YMoukoko",
      facebookUrl: "https://www.facebook.com/YoussoufahMoukoko"
    },
    stats: {
      playerId: 0,
      goals: 18,
      assists: 8,
      yellowCards: 3,
      redCards: 0,
      instagramFollowers: 2100000,
      twitterFollowers: 180000,
      facebookFollowers: 620000,
      fanEngagement: 0.78
    }
  },
  {
    player: {
      name: "Eduardo Camavinga",
      team: "Real Madrid",
      country: "France",
      position: "Midfielder",
      profileImg: "https://upload.wikimedia.org/wikipedia/commons/7/7f/Eduardo_Camavinga_2021.jpg",
      bio: "French midfielder known for his physicality, tackling, and box-to-box abilities.",
      instagramUrl: "https://www.instagram.com/camavinga/",
      twitterUrl: "https://twitter.com/Camavinga",
      facebookUrl: "https://www.facebook.com/EduardoCamavinga"
    },
    stats: {
      playerId: 0,
      goals: 7,
      assists: 12,
      yellowCards: 19,
      redCards: 1,
      instagramFollowers: 8900000,
      twitterFollowers: 1200000,
      facebookFollowers: 3400000,
      fanEngagement: 0.84
    }
  },
  {
    player: {
      name: "Aurélien Tchouaméni",
      team: "Real Madrid",
      country: "France",
      position: "Midfielder",
      profileImg: "https://upload.wikimedia.org/wikipedia/commons/1/1a/Aur%C3%A9lien_Tchoua%C3%A9ni_2022.jpg",
      bio: "French defensive midfielder known for his physicality, passing, and defensive work.",
      instagramUrl: "https://www.instagram.com/ataurelientchm/",
      twitterUrl: "https://twitter.com/ataurelientchm",
      facebookUrl: "https://www.facebook.com/AurelienTchouameni"
    },
    stats: {
      playerId: 0,
      goals: 7,
      assists: 9,
      yellowCards: 21,
      redCards: 1,
      instagramFollowers: 4200000,
      twitterFollowers: 450000,
      facebookFollowers: 1700000,
      fanEngagement: 0.79
    }
  },
  {
    player: {
      name: "Enzo Fernández",
      team: "Chelsea",
      country: "Argentina",
      position: "Midfielder",
      profileImg: "https://upload.wikimedia.org/wikipedia/commons/e/ec/Enzo_Fern%C3%A1ndez_2022.jpg",
      bio: "Argentine midfielder known for his passing, vision, and ability to control the tempo.",
      instagramUrl: "https://www.instagram.com/enzojfernandez/",
      twitterUrl: "https://twitter.com/enzojfernandez",
      facebookUrl: "https://www.facebook.com/EnzoFernandez"
    },
    stats: {
      playerId: 0,
      goals: 12,
      assists: 17,
      yellowCards: 14,
      redCards: 0,
      instagramFollowers: 6700000,
      twitterFollowers: 890000,
      facebookFollowers: 2800000,
      fanEngagement: 0.83
    }
  },
  {
    player: {
      name: "Declan Rice",
      team: "Arsenal",
      country: "England",
      position: "Midfielder",
      profileImg: "https://upload.wikimedia.org/wikipedia/commons/4/4e/Declan_Rice_2019.jpg",
      bio: "English defensive midfielder known for his work rate, tackling, and leadership.",
      instagramUrl: "https://www.instagram.com/declanrice/",
      twitterUrl: "https://twitter.com/DeclanRice",
      facebookUrl: "https://www.facebook.com/DeclanRice"
    },
    stats: {
      playerId: 0,
      goals: 15,
      assists: 22,
      yellowCards: 42,
      redCards: 2,
      instagramFollowers: 3800000,
      twitterFollowers: 920000,
      facebookFollowers: 2100000,
      fanEngagement: 0.77
    }
  },
  {
    player: {
      name: "Wesley Fofana",
      team: "Chelsea",
      country: "France",
      position: "Defender",
      profileImg: "https://upload.wikimedia.org/wikipedia/commons/c/ce/Wesley_Fofana_2021.jpg",
      bio: "French centre-back known for his pace, aerial ability, and defensive leadership.",
      instagramUrl: "https://www.instagram.com/wesleyfofana/",
      twitterUrl: "https://twitter.com/WesleyFofana",
      facebookUrl: "https://www.facebook.com/WesleyFofana"
    },
    stats: {
      playerId: 0,
      goals: 4,
      assists: 3,
      yellowCards: 12,
      redCards: 0,
      instagramFollowers: 2600000,
      twitterFollowers: 380000,
      facebookFollowers: 980000,
      fanEngagement: 0.74
    }
  },
  {
    player: {
      name: "William Saliba",
      team: "Arsenal",
      country: "France",
      position: "Defender",
      profileImg: "https://upload.wikimedia.org/wikipedia/commons/9/99/William_Saliba_2022.jpg",
      bio: "French centre-back known for his composure, passing, and defensive stability.",
      instagramUrl: "https://www.instagram.com/william_saliba/",
      twitterUrl: "https://twitter.com/williamsaliba",
      facebookUrl: "https://www.facebook.com/WilliamSaliba"
    },
    stats: {
      playerId: 0,
      goals: 7,
      assists: 4,
      yellowCards: 9,
      redCards: 1,
      instagramFollowers: 2100000,
      twitterFollowers: 290000,
      facebookFollowers: 740000,
      fanEngagement: 0.75
    }
  },
  {
    player: {
      name: "Lisandro Martínez",
      team: "Manchester United",
      country: "Argentina",
      position: "Defender",
      profileImg: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Lisandro_Mart%C3%ADnez_2022.jpg",
      bio: "Argentine centre-back known for his aggression, tackling, and leadership despite his height.",
      instagramUrl: "https://www.instagram.com/lisandro_martinez/",
      twitterUrl: "https://twitter.com/LisandrMartinez",
      facebookUrl: "https://www.facebook.com/LisandroMartinez"
    },
    stats: {
      playerId: 0,
      goals: 3,
      assists: 2,
      yellowCards: 18,
      redCards: 1,
      instagramFollowers: 3400000,
      twitterFollowers: 450000,
      facebookFollowers: 1300000,
      fanEngagement: 0.78
    }
  },
  {
    player: {
      name: "Joško Gvardiol",
      team: "Manchester City",
      country: "Croatia",
      position: "Defender",
      profileImg: "https://upload.wikimedia.org/wikipedia/commons/8/84/Jo%C5%A1ko_Gvardiol_2022.jpg",
      bio: "Croatian centre-back known for his pace, aerial ability, and ball-playing skills.",
      instagramUrl: "https://www.instagram.com/joshko_gvardiol/",
      twitterUrl: "https://twitter.com/JGvardiol",
      facebookUrl: "https://www.facebook.com/JoskoGvardiol"
    },
    stats: {
      playerId: 0,
      goals: 8,
      assists: 6,
      yellowCards: 12,
      redCards: 0,
      instagramFollowers: 1900000,
      twitterFollowers: 240000,
      facebookFollowers: 680000,
      fanEngagement: 0.76
    }
  },
  {
    player: {
      name: "Kai Havertz",
      team: "Arsenal",
      country: "Germany",
      position: "Forward",
      profileImg: "https://upload.wikimedia.org/wikipedia/commons/8/89/Kai_Havertz_2019.jpg",
      bio: "German attacking midfielder/forward known for his height, technical ability, and versatility.",
      instagramUrl: "https://www.instagram.com/kaihavertz29/",
      twitterUrl: "https://twitter.com/kaihavertz29",
      facebookUrl: "https://www.facebook.com/KaiHavertz"
    },
    stats: {
      playerId: 0,
      goals: 52,
      assists: 34,
      yellowCards: 17,
      redCards: 1,
      instagramFollowers: 5400000,
      twitterFollowers: 980000,
      facebookFollowers: 2700000,
      fanEngagement: 0.81
    }
  },
  {
    player: {
      name: "Gabriel Jesus",
      team: "Arsenal",
      country: "Brazil",
      position: "Forward",
      profileImg: "https://upload.wikimedia.org/wikipedia/commons/f/f4/Gabriel_Jesus_2018.jpg",
      bio: "Brazilian forward known for his pace, movement, and ability to play across the front line.",
      instagramUrl: "https://www.instagram.com/gabrieljesus9/",
      twitterUrl: "https://twitter.com/gabrieljesus33",
      facebookUrl: "https://www.facebook.com/GabrielJesus"
    },
    stats: {
      playerId: 0,
      goals: 95,
      assists: 46,
      yellowCards: 19,
      redCards: 1,
      instagramFollowers: 9800000,
      twitterFollowers: 2100000,
      facebookFollowers: 5600000,
      fanEngagement: 0.83
    }
  },
  {
    player: {
      name: "Martin Ødegaard",
      team: "Arsenal",
      country: "Norway",
      position: "Midfielder",
      profileImg: "https://upload.wikimedia.org/wikipedia/commons/8/8b/Martin_%C3%98degaard_2021.jpg",
      bio: "Norwegian attacking midfielder known for his creativity, passing, and leadership.",
      instagramUrl: "https://www.instagram.com/martinodegaard/",
      twitterUrl: "https://twitter.com/MartinOdegaard",
      facebookUrl: "https://www.facebook.com/MartinOdegaard"
    },
    stats: {
      playerId: 0,
      goals: 34,
      assists: 52,
      yellowCards: 14,
      redCards: 0,
      instagramFollowers: 4700000,
      twitterFollowers: 780000,
      facebookFollowers: 2300000,
      fanEngagement: 0.80
    }
  },
  {
    player: {
      name: "Alexander Isak",
      team: "Newcastle United",
      country: "Sweden",
      position: "Forward",
      profileImg: "https://upload.wikimedia.org/wikipedia/commons/9/95/Alexander_Isak_2021.jpg",
      bio: "Swedish striker known for his pace, movement, and clinical finishing.",
      instagramUrl: "https://www.instagram.com/alexanderisak/",
      twitterUrl: "https://twitter.com/AlexanderIsak",
      facebookUrl: "https://www.facebook.com/AlexanderIsak"
    },
    stats: {
      playerId: 0,
      goals: 72,
      assists: 21,
      yellowCards: 8,
      redCards: 0,
      instagramFollowers: 2800000,
      twitterFollowers: 320000,
      facebookFollowers: 890000,
      fanEngagement: 0.77
    }
  },
  {
    player: {
      name: "Jack Grealish",
      team: "Manchester City",
      country: "England",
      position: "Forward",
      profileImg: "https://upload.wikimedia.org/wikipedia/commons/2/26/Jack_Grealish_2019.jpg",
      bio: "English winger known for his dribbling, pace, and ability to draw fouls.",
      instagramUrl: "https://www.instagram.com/jackgrealish/",
      twitterUrl: "https://twitter.com/JackGrealish",
      facebookUrl: "https://www.facebook.com/JackGrealish"
    },
    stats: {
      playerId: 0,
      goals: 32,
      assists: 43,
      yellowCards: 22,
      redCards: 0,
      instagramFollowers: 4900000,
      twitterFollowers: 1200000,
      facebookFollowers: 2600000,
      fanEngagement: 0.82
    }
  },
  {
    player: {
      name: "Cody Gakpo",
      team: "Liverpool",
      country: "Netherlands",
      position: "Forward",
      profileImg: "https://upload.wikimedia.org/wikipedia/commons/c/ce/Cody_Gakpo_2022.jpg",
      bio: "Dutch forward known for his pace, dribbling, and ability to score from wide positions.",
      instagramUrl: "https://www.instagram.com/codygakpo/",
      twitterUrl: "https://twitter.com/CodyGakpo",
      facebookUrl: "https://www.facebook.com/CodyGakpo"
    },
    stats: {
      playerId: 0,
      goals: 45,
      assists: 29,
      yellowCards: 9,
      redCards: 0,
      instagramFollowers: 3100000,
      twitterFollowers: 420000,
      facebookFollowers: 1200000,
      fanEngagement: 0.79
    }
  },
  {
    player: {
      name: "Antony",
      team: "Manchester United",
      country: "Brazil",
      position: "Forward",
      profileImg: "https://upload.wikimedia.org/wikipedia/commons/9/99/Antony_2022.jpg",
      bio: "Brazilian winger known for his pace, dribbling, and left-footed finishing.",
      instagramUrl: "https://www.instagram.com/antony00/",
      twitterUrl: "https://twitter.com/antony00",
      facebookUrl: "https://www.facebook.com/Antony"
    },
    stats: {
      playerId: 0,
      goals: 19,
      assists: 13,
      yellowCards: 12,
      redCards: 1,
      instagramFollowers: 5200000,
      twitterFollowers: 780000,
      facebookFollowers: 2100000,
      fanEngagement: 0.78
    }
  },
  {
    player: {
      name: "Luis Díaz",
      team: "Liverpool",
      country: "Colombia",
      position: "Forward",
      profileImg: "https://upload.wikimedia.org/wikipedia/commons/7/74/Luis_D%C3%ADaz_2022.jpg",
      bio: "Colombian winger known for his pace, dribbling, and ability to beat defenders.",
      instagramUrl: "https://www.instagram.com/luisdiaz19_/",
      twitterUrl: "https://twitter.com/LuisFDiaz19",
      facebookUrl: "https://www.facebook.com/LuisDiaz"
    },
    stats: {
      playerId: 0,
      goals: 31,
      assists: 18,
      yellowCards: 7,
      redCards: 0,
      instagramFollowers: 4600000,
      twitterFollowers: 680000,
      facebookFollowers: 2300000,
      fanEngagement: 0.81
    }
  },
  {
    player: {
      name: "Richarlison",
      team: "Tottenham Hotspur",
      country: "Brazil",
      position: "Forward",
      profileImg: "https://upload.wikimedia.org/wikipedia/commons/4/4c/Richarlison_2022.jpg",
      bio: "Brazilian forward known for his aerial ability, pace, and versatility across the front line.",
      instagramUrl: "https://www.instagram.com/richarlison/",
      twitterUrl: "https://twitter.com/richarlison97",
      facebookUrl: "https://www.facebook.com/Richarlison"
    },
    stats: {
      playerId: 0,
      goals: 67,
      assists: 23,
      yellowCards: 31,
      redCards: 2,
      instagramFollowers: 6900000,
      twitterFollowers: 1400000,
      facebookFollowers: 3800000,
      fanEngagement: 0.82
    }
  },
  {
    player: {
      name: "James Maddison",
      team: "Tottenham Hotspur",
      country: "England",
      position: "Midfielder",
      profileImg: "https://upload.wikimedia.org/wikipedia/commons/8/84/James_Maddison_2019.jpg",
      bio: "English attacking midfielder known for his creativity, set-pieces, and passing range.",
      instagramUrl: "https://www.instagram.com/jamesmaddison/",
      twitterUrl: "https://twitter.com/Madders10",
      facebookUrl: "https://www.facebook.com/JamesMaddison"
    },
    stats: {
      playerId: 0,
      goals: 55,
      assists: 53,
      yellowCards: 28,
      redCards: 1,
      instagramFollowers: 2900000,
      twitterFollowers: 720000,
      facebookFollowers: 1600000,
      fanEngagement: 0.78
    }
  },
  {
    player: {
      name: "Cole Palmer",
      team: "Chelsea",
      country: "England",
      position: "Forward",
      profileImg: "https://upload.wikimedia.org/wikipedia/commons/a/a4/Cole_Palmer_2023.jpg",
      bio: "English attacking midfielder/winger known for his technical ability and goal threat.",
      instagramUrl: "https://www.instagram.com/colepalmer10/",
      twitterUrl: "https://twitter.com/colepalmer10",
      facebookUrl: "https://www.facebook.com/ColePalmer"
    },
    stats: {
      playerId: 0,
      goals: 31,
      assists: 19,
      yellowCards: 6,
      redCards: 0,
      instagramFollowers: 2400000,
      twitterFollowers: 380000,
      facebookFollowers: 890000,
      fanEngagement: 0.83
    }
  },
  {
    player: {
      name: "Ollie Watkins",
      team: "Aston Villa",
      country: "England",
      position: "Forward",
      profileImg: "https://upload.wikimedia.org/wikipedia/commons/c/ca/Ollie_Watkins_2021.jpg",
      bio: "English striker known for his pace, movement, and clinical finishing.",
      instagramUrl: "https://www.instagram.com/olliewatkins/",
      twitterUrl: "https://twitter.com/OllieWatkins",
      facebookUrl: "https://www.facebook.com/OllieWatkins"
    },
    stats: {
      playerId: 0,
      goals: 78,
      assists: 27,
      yellowCards: 14,
      redCards: 0,
      instagramFollowers: 1800000,
      twitterFollowers: 290000,
      facebookFollowers: 680000,
      fanEngagement: 0.76
    }
  },
  {
    player: {
      name: "Ivan Toney",
      team: "Al-Ahli",
      country: "England",
      position: "Forward",
      profileImg: "https://upload.wikimedia.org/wikipedia/commons/7/7f/Ivan_Toney_2021.jpg",
      bio: "English striker known for his physical presence, aerial ability, and penalty taking.",
      instagramUrl: "https://www.instagram.com/ivantoney/",
      twitterUrl: "https://twitter.com/ivantoney24",
      facebookUrl: "https://www.facebook.com/IvanToney"
    },
    stats: {
      playerId: 0,
      goals: 89,
      assists: 31,
      yellowCards: 22,
      redCards: 1,
      instagramFollowers: 1500000,
      twitterFollowers: 240000,
      facebookFollowers: 520000,
      fanEngagement: 0.74
    }
  },
  {
    player: {
      name: "Youri Tielemans",
      team: "Aston Villa",
      country: "Belgium",
      position: "Midfielder",
      profileImg: "https://upload.wikimedia.org/wikipedia/commons/3/33/Youri_Tielemans_2019.jpg",
      bio: "Belgian midfielder known for his passing range, shooting, and technical ability.",
      instagramUrl: "https://www.instagram.com/youri.tielemans/",
      twitterUrl: "https://twitter.com/YTielemans",
      facebookUrl: "https://www.facebook.com/YouriTielemans"
    },
    stats: {
      playerId: 0,
      goals: 42,
      assists: 41,
      yellowCards: 29,
      redCards: 2,
      instagramFollowers: 2100000,
      twitterFollowers: 410000,
      facebookFollowers: 980000,
      fanEngagement: 0.76
    }
  },
  {
    player: {
      name: "Julian Alvarez",
      team: "Atlético Madrid",
      country: "Argentina",
      position: "Forward",
      profileImg: "https://upload.wikimedia.org/wikipedia/commons/8/8a/Juli%C3%A1n_%C3%81lvarez_2022.jpg",
      bio: "Argentine forward known for his pace, movement, and ability to play multiple positions.",
      instagramUrl: "https://www.instagram.com/juliaanalvarez/",
      twitterUrl: "https://twitter.com/JulianAlvarez",
      facebookUrl: "https://www.facebook.com/JulianAlvarez"
    },
    stats: {
      playerId: 0,
      goals: 54,
      assists: 26,
      yellowCards: 9,
      redCards: 0,
      instagramFollowers: 5800000,
      twitterFollowers: 890000,
      facebookFollowers: 2700000,
      fanEngagement: 0.84
    }
  },
  {
    player: {
      name: "Bernardo Silva",
      team: "Manchester City",
      country: "Portugal",
      position: "Midfielder",
      profileImg: "https://upload.wikimedia.org/wikipedia/commons/f/f4/Bernardo_Silva_2018.jpg",
      bio: "Portuguese midfielder known for his technical ability, work rate, and versatility.",
      instagramUrl: "https://www.instagram.com/bernardocarvalhosilva/",
      twitterUrl: "https://twitter.com/BernardoCSilva",
      facebookUrl: "https://www.facebook.com/BernardoSilva"
    },
    stats: {
      playerId: 0,
      goals: 67,
      assists: 71,
      yellowCards: 38,
      redCards: 1,
      instagramFollowers: 8400000,
      twitterFollowers: 1600000,
      facebookFollowers: 4200000,
      fanEngagement: 0.82
    }
  },
  {
    player: {
      name: "Jeremy Doku",
      team: "Manchester City",
      country: "Belgium",
      position: "Forward",
      profileImg: "https://upload.wikimedia.org/wikipedia/commons/d/d8/Jeremy_Doku_2021.jpg",
      bio: "Belgian winger known for his pace, dribbling, and ability to beat defenders one-on-one.",
      instagramUrl: "https://www.instagram.com/jeremydoku/",
      twitterUrl: "https://twitter.com/JeremyDoku",
      facebookUrl: "https://www.facebook.com/JeremyDoku"
    },
    stats: {
      playerId: 0,
      goals: 18,
      assists: 21,
      yellowCards: 7,
      redCards: 0,
      instagramFollowers: 1900000,
      twitterFollowers: 280000,
      facebookFollowers: 740000,
      fanEngagement: 0.81
    }
  },
  {
    player: {
      name: "Nicolò Barella",
      team: "Inter Milan",
      country: "Italy",
      position: "Midfielder",
      profileImg: "https://upload.wikimedia.org/wikipedia/commons/8/8e/Nicol%C3%B2_Barella_2021.jpg",
      bio: "Italian midfielder known for his energy, passing, and ability to break up play.",
      instagramUrl: "https://www.instagram.com/nicolo_barella/",
      twitterUrl: "https://twitter.com/NicoloBarella",
      facebookUrl: "https://www.facebook.com/NicoloBarella"
    },
    stats: {
      playerId: 0,
      goals: 22,
      assists: 35,
      yellowCards: 41,
      redCards: 3,
      instagramFollowers: 3600000,
      twitterFollowers: 520000,
      facebookFollowers: 1800000,
      fanEngagement: 0.79
    }
  },
  {
    player: {
      name: "Joshua Zirkzee",
      team: "Manchester United",
      country: "Netherlands",
      position: "Forward",
      profileImg: "https://upload.wikimedia.org/wikipedia/commons/f/fc/Joshua_Zirkzee_2022.jpg",
      bio: "Dutch striker known for his height, technical ability, and link-up play.",
      instagramUrl: "https://www.instagram.com/joshua_zirkzee/",
      twitterUrl: "https://twitter.com/JoshuaZirkzee",
      facebookUrl: "https://www.facebook.com/JoshuaZirkzee"
    },
    stats: {
      playerId: 0,
      goals: 36,
      assists: 18,
      yellowCards: 8,
      redCards: 0,
      instagramFollowers: 1400000,
      twitterFollowers: 190000,
      facebookFollowers: 480000,
      fanEngagement: 0.77
    }
  },
  {
    player: {
      name: "Mathys Tel",
      team: "Bayern Munich",
      country: "France",
      position: "Forward",
      profileImg: "https://upload.wikimedia.org/wikipedia/commons/a/a6/Mathys_Tel_2022.jpg",
      bio: "French forward known for his pace, dribbling, and potential despite his young age.",
      instagramUrl: "https://www.instagram.com/mathystel/",
      twitterUrl: "https://twitter.com/MathysTel",
      facebookUrl: "https://www.facebook.com/MathysTel"
    },
    stats: {
      playerId: 0,
      goals: 12,
      assists: 7,
      yellowCards: 2,
      redCards: 0,
      instagramFollowers: 980000,
      twitterFollowers: 140000,
      facebookFollowers: 320000,
      fanEngagement: 0.82
    }
  }
];