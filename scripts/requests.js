const axios = require('axios');
const fs = require('fs');
const client_id = "vhi1naj8p96yrzjdazi7adwodeypv3"
const client_secret = "e0j6jzvkktw33z3wyn5r5dyc4vv7xu"
var token = "w53de851aawvdspck9g9fzl388o9la"

async function getGenres() {
    return axios({
        url: "https://api.igdb.com/v4/genres",
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Client-ID': client_id,
            'Authorization': 'Bearer ' + token,
        },
        data: "fields *; limit 500;"
    })
}

async function getEnginesPage(page) {
    console.log("Engine page: " + page)
    let itemCount = 0
    r = await axios({
        url: "https://api.igdb.com/v4/game_engines",
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Client-ID': client_id,
            'Authorization': 'Bearer ' + token,
        },
        data: `fields *; limit 500; offset ${page * 500};`
    })
        .then(response => {
            str = "engine_id,engine_name,engine_platforms,engines_companies\r\n"
            response.data.forEach(engine => {
                platforms = engine["platforms"]
                if (platforms) {
                    platforms = platforms.map(engine => `${engine};`)
                    platforms = platforms.reduce((a, b) => a + b)
                }

                companies = engine["companies"]
                if (companies) {
                    companies = companies.map(engine => `${engine};`)
                    companies = companies.reduce((a, b) => a + b)
                }

                str += `${engine["id"]},${engine["name"]},${platforms},${companies}\r\n`
                }
            )

            fs.writeFile(`./enginesfolder/engines-${page}.csv` , str, 'utf-8', (err) => {
                if (err)
                    console.log(err);
                else {
                    // console.log("File written successfully\n");
                }
            });

            itemCount = response.headers["x-count"]
        })
        .catch(err => {
            console.log("Error: " + err)
        })

    return {
        nextPage: itemCount - (page+1)* 500 > 0 ? page + 1 : undefined
  };
}

async function getEngines(page = 0) {
    const fragment = await getEnginesPage(page)

    if (fragment.nextPage) {
        await getEngines(fragment.nextPage)
    } else {
        console.log("End engines")
    }
}

async function getGamesPage(page) {
    console.log("Engine page: " + page)
    let itemCount = 0
    r = await axios({
        url: "https://api.igdb.com/v4/games",
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Client-ID': client_id,
            'Authorization': 'Bearer ' + token,
        },
        data: `fields *; limit 500; offset ${page * 500}; where parent_game = null;`
    })
        .then(response => {

            str = "game_id\tgame_name\tgame_engines\tgame_genres\tgame_platforms\r\n"
            response.data.forEach( game => {

                engines = game["engines"]
                if (engines) {
                    engines = engines.map(a => `${a};`)
                    engines = engines.reduce((a, b) => a + b)
                }

                genres = game["genres"]
                if (genres) {
                    genres = genres.map(a => `${a};`)
                    genres = genres.reduce((a, b) => a + b)
                }

                platforms = game["platforms"]
                if (platforms) {
                    platforms = platforms.map(a => `${a};`)
                    platforms = platforms.reduce((a, b) => a + b)
                }
                str += `${game["id"]}\t${game["name"]}\t${platforms}\t${genres}\t${platforms}\r\n`
            })

            fs.writeFile(`./games/games-${page}.csv` , str, 'utf-8', (err) => {
                if (err)
                    console.log(err);
                else {
                    // console.log("File written successfully\n");
                }
            });

            itemCount = response.headers["x-count"]
        })
        .catch(err => {
            console.log("deu erro")
            console.log(err)
            throw err
        })

    return {
        nextPage: itemCount - (page+1)* 500 > 0 ? page + 1 : undefined
  };
}

async function getGames(page = 0) {
    const fragment = await getGamesPage(page)
    if (fragment.nextPage) {
        await getGames(fragment.nextPage)
    } else {
        console.log("End games")
    }
}

// async function getEngines(page = 0) {
//     return axios({
//         url: "https://api.igdb.com/v4/game_engines",
//         method: 'POST',
//         headers: {
//             'Accept': 'application/json',
//             'Client-ID': client_id,
//             'Authorization': 'Bearer ' + token,
//         },
//         data: `fields *; limit 500; offset ${page * 500};`
//     })
// }

// async function getGames(page = 0) {
//     return axios({
//         url: "https://api.igdb.com/v4/games",
//         method: 'POST',
//         headers: {
//             'Accept': 'application/json',
//             'Client-ID': client_id,
//             'Authorization': 'Bearer ' + token,
//         },
//         data: `fields *; limit 500; offset ${page * 500}; where parent_game = null;`
//     })
// }

(async () => {
    let genres = []
    let engines = []

    // getGenres()
    //     .then(response => {
    //         str = "genre_id,genre_name\r\n"
    //         response.data.forEach(genre =>
    //             str += `${genre["id"]},${genre["name"]}\r\n`
    //         )

    //         fs.writeFile('genres.csv', str, 'utf-8', (err) => {
    //             if (err)
    //                 console.log(err);
    //             else {
    //                 // console.log("File written successfully\n");
    //             }
    //         });
    //     })
    //     .catch(err => {
    //         console.error("error: " + err);
    //     });

    // getEngines(0)
    //     .catch(err => {
    //         console.error(err);
    //     });


    getGames(0)
        .catch(err => {
            console.error(err.status);
        });
})();





// const getSentenceFragment = async function(offset = 0) {
//   const pageSize = 3;
//   const sentence = [...'hello world'];

//   await wait(500);

//   return {
//     data: sentence.slice(offset, offset + 3),
//     nextPage: offset + 3 < sentence.length ? offset + 3 : undefined
//   };
// };

// const getSentence = async function(offset = 0) {
//   const fragment = await getSentenceFragment(offset)
//   if (fragment.nextPage) {
//     return fragment.data.concat(await getSentence(fragment.nextPage));
//   } else {
//     return fragment.data;
//   }
// }
