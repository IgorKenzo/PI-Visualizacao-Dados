import pandas as pd

NUM_ENGINES = 3
NUM_GAMES = 315


def joinEngines():
    engines = pd.read_csv(f"./dados/engines-0.csv")
    for i in range(1, NUM_ENGINES):
        engines_partial = pd.read_csv(f"./dados/engines-{i}.csv")
        engines = pd.merge(engines, engines_partial, how='outer')

    print(engines.tail())
    engines.to_csv("./dados/results/engines.csv", index=False)


def joinGames():
    games = pd.read_csv(f"./dados/games-0.csv", sep="\t")
    for i in range(1, NUM_GAMES):
        print(i)
        games_partial = pd.read_csv(f"./dados/games-{i}.csv", sep="\t")
        games = pd.merge(games, games_partial, how='outer')

    print(games.tail())
    games.to_csv("./dados/results/games.csv", sep="\t", index=False)


def main():
    # joinEngines()
    joinGames()


if __name__ == "__main__":
    main()
