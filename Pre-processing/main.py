import pymongo
import pandas as pd
from json import dumps

client = pymongo.MongoClient("mongodb+srv://senac:senac@cd-ep.uytpn.mongodb.net/pi?retryWrites=true&w=majority")
db = client["pi"]


def main():
  games_dataframe = pd.read_csv("./igdbData/games.csv", sep="\t")
  engines_dataframe = pd.read_csv("./igdbData/engines.csv")
  genres_dataframe = pd.read_csv("./igdbData/genres.csv")
  platforms_dataframe = pd.read_csv("./igdbData/platforms.csv", sep="\t")
  
  game_array = []
  for game_i, game in games_dataframe.iterrows():
    # engines
    if game["game_engines"] != "undefined":
      engines = game["game_engines"][:-1]
      engines = engines.split(";")

      for i, e_id in enumerate(engines):
        # try:
        engine_data = engines_dataframe.loc[engines_dataframe["engine_id"] == int(e_id)].to_dict("records")

        if len(engine_data) == 0:
          engines.pop(i)
        else:
          engines[i] = engine_data[0]["engine_name"]
      game["game_engines"] = engines

        # Genres
    if game["game_genres"] != "undefined":
      genres = game["game_genres"][:-1]
      genres = genres.split(";")

      for i, g_id in enumerate(genres):
        genres[i] = genres_dataframe.loc[genres_dataframe["genre_id"] == int(g_id)].to_dict("records")[0]["genre_name"]

      game["game_genres"] = genres

        # Platforms
    if game["game_platforms"] != "undefined":
      platforms = game["game_platforms"][:-1]
      platforms = platforms.split(";")

      for i, p_id in enumerate(platforms):
        platform_data = platforms_dataframe.loc[platforms_dataframe["platform_id"] == int(p_id)].to_dict("records")

        if len(platform_data) == 0:
          platforms.pop(i)
        else:
          platforms[i] = platform_data[0]["platform_name"]

      game["game_platforms"] = platforms

    print(game_i)
    game_array.append({
      "id": game["game_id"],
      "name": game["game_name"],
      "engines": game["game_engines"],
      "genres": game["game_genres"],
      "platforms": game["game_platforms"],
    })

    insert_mongo(game_array)


def insert_mongo(data, delete=True):
    if delete:
        db["igdb"].delete_many({})
    db["igdb"].insert_many(data)

def popular_engine_by_genre():
  return db.igdb.aggregate([
    {
      "$unwind": "$genres",
    },
    {
      "$unwind": "$engines",
    },
    {
      "$group": {
        "_id": {
          "genre": "$genres",
          "engine": "$engines"
        },
        "count": {
          "$sum": 1
        }
      }
    },
    {
      "$sort": {
        "_id.genres": 1,
        "count": -1
      }
    },
    {
      "$group": {
        "_id": "$_id.genre",
        "popular_engines": {
          "$first": "$_id.engine"
        },
        "count": {
          "$first": "$count"
        }
      }
    },
    {
    "$project": {
      "genre": "$_id",
      "engine": "$popular_engines",
      "_id": 0
    }
  }
  ])

def genXgameEngine():
  return db.igdb.aggregate([
  {
    "$unwind": "$genres",
  },
  {
    "$unwind": "$engines",
  },
  {
    "$group": {
      "_id": {
        "genre": "$genres",
        "engine": "$engines"
      },
      "count": {
        "$sum": 1
      }
    }
  },
  {
    "$sort": {
      "_id.genres": 1,
      "count": -1
    }
  },
  {
    "$group": {
      "_id": "$_id.genre",
      "engines": {
        "$push": {
          "engine_name": "$_id.engine",
          "tot": "$count"
        }
      }
    }
  },
  {
    "$project": {
      "genre": "$_id",
      "engines": "$engines",
      "_id": 0
    }
  }
])

def popular_engine_by_platform():
  return db.igdb.aggregate([
  {
    "$unwind": "$engines",
    
  },
  {
    "$unwind": "$platforms",
    
  },
  {
    "$group": {
      "_id": {
        "platform": "$platforms",
        "engine": "$engines"
      },
      "count": {
        "$sum": 1
      }
    }
  },
  {
    "$sort": {
      "_id.platform": 1,
      "count": -1
    }
  },
  {
    "$group": {
      "_id": "$_id.platform",
      "engine": {
        "$push": {
          "engine_name": "$_id.engine",
          "tot": "$count"
        }
      }
    }
  },
  {
    "$project": {
      "platform": "$_id",
      "engines": "$engine",
      "_id": 0
    }
  }
])
def popular_genre_by_platform():
  return db.igdb.aggregate([
  {
    "$unwind": "$genres",
  },
  {
    "$unwind": "$platforms",
  },
  {
    "$group": {
      "_id": {
        "platform": "$platforms",
        "genre": "$genres"
      },
      "count": {
        "$sum": 1
      }
    }
  },
  {
    "$sort": {
      "_id.platform": 1,
      "count": -1
    }
  },
  {
    "$group": {
      "_id": "$_id.platform",
      "genre": {
        "$push": {
          "genre_name": "$_id.genre",
          "tot": "$count"
        }
      }
    }
  },
  {
    "$project": {
      "platform": "$_id",
      "genres": "$genre",
      "_id": 0
    }
  }
])

def popular_platform_by_genre():
  return db.igdb.aggregate([
  {
    "$unwind": "$genres",
  },
  {
    "$unwind": "$platforms",
  },
  {
    "$group": {
      "_id": {
        "platform": "$platforms",
        "genre": "$genres"
      },
      "count": {
        "$sum": 1
      }
    }
  },
  {
    "$sort": {
      "_id.genre": 1,
      "count": -1
    }
  },
  {
    "$group": {
      "_id": "$_id.genre",
      "platform": {
        "$push": {
          "platform_name": "$_id.platform",
          "tot": "$count"
        }
      }
    }
  },
  {
    "$project": {
      "genre": "$_id",
      "platforms": "$platform",
      "_id": 0
    }
  }
])

if __name__ == "__main__":
    # main()

    # total = 0

    # results = []
    # for result in genXgameEngine():
      # result["engines"] = result["engines"][:7]
      # results.append(result)
    # print(dumps(results))

    # results = []
    # for result in popular_genre_by_platform():
    #   result["genres"] = result["genres"][:7]
    #   results.append(result)
    # print(dumps(results))

    # results = []
    # for result in popular_engine_by_platform():
    #   result["engines"] = result["engines"][:7]
    #   results.append(result)
    # print(dumps(results))
    
    results = []
    for result in popular_platform_by_genre():
      result["platforms"] = result["platforms"][:7]
      results.append(result)
    print(dumps(results))
    
    

    # print("Total de jogos agrupados: ", total)

    # i = 0
    # for a in db.igdb.find({}):
    #   print(a)
    #   if i > 500: break
    #   i += 1

    
