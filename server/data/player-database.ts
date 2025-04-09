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
  }
];