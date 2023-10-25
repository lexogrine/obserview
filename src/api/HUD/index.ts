import { CSGOGSI, PlayerExtension } from 'csgogsi';
import api, { isDev } from '..';

export const hudIdentity = {
	name: '',
	isDev
};

export const GSI = new CSGOGSI();
GSI.regulationMR = 12;

GSI.on("data", data => {
    loadPlayers(data.players.map(player => player.steamid));
});

const requestedSteamIDs: string[] = [];

const loadPlayers = async (steamids: string[]) => {
    const leftOvers = steamids.filter(steamid => !requestedSteamIDs.includes(steamid));

    if(!leftOvers.length) return;

    requestedSteamIDs.push(...leftOvers);

    const extensions = await api.players.get(leftOvers);

    const players: PlayerExtension[] = extensions.map(player => (
        {
            id: player._id,
            name: player.username,
            realName: `${player.firstName} ${player.lastName}`,
            steamid: player.steamid,
            country: player.country,
            avatar: player.avatar,
            extra: player.extra,
        })
    )

    GSI.players.push(...players);

    
    steamids.forEach(steamid => {
        loadAvatarURL(steamid);
    });
}


interface AvatarLoader {
    loader: Promise<string>,
    url: string,
}

export const avatars: { [key: string]: AvatarLoader } = {};

const loadAvatarURL = (steamid: string) => {
    if(!steamid) return;
    if(avatars[steamid]) return avatars[steamid].url;
    avatars[steamid] = {
        url: '',
        loader: new Promise((resolve) => {
            api.players.getAvatarURLs(steamid).then(result => {
                avatars[steamid].url = result.custom || result.steam;
                resolve(result.custom || result.custom);
            }).catch(() => {
                delete avatars[steamid];
                resolve('');
            });
        })
    }
}