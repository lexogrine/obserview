import React, { useState, useEffect, useRef } from 'react';
import Layout from './HUD/Layout/Layout';
import api, { port, isDev } from './api/api';
import { loadAvatarURL } from './api/avatars';
import ActionManager, { ConfigManager } from './api/actionManager';

import CSGOGSI, { CSGO, PlayerExtension } from "csgogsi-socket";
import Canvas from './Canvas';
import { Match } from './api/interfaces';

export const { GSI, socket } = CSGOGSI(isDev ? `localhost:${port}` : '/', "update");

export const actions = new ActionManager();
export const configs = new ConfigManager();

interface DataLoader {
	match: Promise<void> | null
}

const dataLoader: DataLoader = {
	match: null
}

const App = () => {
	const [match, setMatch] = useState<Match | null>(null);
	const [game, setGame] = useState<CSGO | null>(null);
	const [steamids, setSteamids] = useState<string[]>([]);
	const [checked, setChecked] = useState<boolean>(false);
	const [ loading, setLoading ] = useState(false);

	const verifyPlayers = async (game: CSGO) => {
		if(loading) return;
		setLoading(true);
		const newSteamids = game.players.map(player => player.steamid);
		newSteamids.forEach(steamid => {
			loadAvatarURL(steamid);
		})

		if (newSteamids.every(steamid => steamids.includes(steamid))) {
			return;
		}

		const loaded = GSI.players.map(player => player.steamid);

		const extensioned = await api.players.get();

		const lacking = newSteamids.filter(steamid => !loaded.includes(steamid)).filter(steamid => extensioned.map(player => player.steamid).includes(steamid));

		const players: PlayerExtension[] = extensioned
			.filter(player => lacking.includes(player.steamid))
			.map(player => (
				{
					id: player._id,
					name: player.username,
					realName: `${player.firstName} ${player.lastName}`,
					steamid: player.steamid,
					country: player.country,
					avatar: player.avatar,
					extra: player.extra,
				})
			);

		const gsiLoaded = GSI.players;

		gsiLoaded.push(...players);

		GSI.loadPlayers(gsiLoaded);

		setSteamids(newSteamids);
		setLoading(false);
	}

	const loadMatch = async (force = false) => {
		if (!dataLoader.match || force) {
			dataLoader.match = new Promise((resolve) => {
				api.match.getCurrent().then(match => {
					if (!match) {
						dataLoader.match = null;
						return;
					}
					setMatch(match);

					let isReversed = false;
					if (GSI.last) {
						const mapName = GSI.last.map.name.substring(GSI.last.map.name.lastIndexOf('/') + 1);
						const current = match.vetos.filter(veto => veto.mapName === mapName)[0];
						if (current && current.reverseSide) {
							isReversed = true;
						}
						setChecked(true);
					}
					if (match.left.id) {
						api.teams.getOne(match.left.id).then(left => {
							const gsiTeamData = { id: left._id, name: left.name, country: left.country, logo: left.logo, map_score: match.left.wins, extra: left.extra };

							if (!isReversed) GSI.setTeamOne(gsiTeamData);
							else GSI.setTeamTwo(gsiTeamData);
						});
					}
					if (match.right.id) {
						api.teams.getOne(match.right.id).then(right => {
							const gsiTeamData = { id: right._id, name: right.name, country: right.country, logo: right.logo, map_score: match.right.wins, extra: right.extra };

							if (!isReversed) GSI.setTeamTwo(gsiTeamData);
							else GSI.setTeamOne(gsiTeamData);
						});
					}



				}).catch(() => {
					dataLoader.match = null;
				});
			});
		}
	}

	const onData = (newGame: CSGO) => {
		if (!game) verifyPlayersRef.current(newGame);
		setGame(newGame);
	}

	const verifyPlayersRef = useRef(verifyPlayers);

	const onDataRef = useRef(onData);

	useEffect(() => {
		verifyPlayersRef.current = verifyPlayers;
		onDataRef.current = onData;
	})

	useEffect(() => {
		loadMatch();
		const href = window.location.href;
		let isDev = false;
		let name = '';
		if (href.indexOf('/huds/') === -1) {
			isDev = true;
			name = (Math.random() * 1000 + 1).toString(36).replace(/[^a-z]+/g, '').substr(0, 15)
		} else {
			const segment = href.substr(href.indexOf('/huds/') + 6);
			name = segment.substr(0, segment.lastIndexOf('/'));
		}

		socket.on("readyToRegister", () => {
			console.log("A")
			socket.emit("register", name, isDev);
		});
		socket.on(`hud_config`, (data: any) => {
			configs.save(data);
		});
		socket.on(`hud_action`, (data: any) => {
			actions.execute(data.action, data.data);
		});
		socket.on('keybindAction', (action: string) => {
			actions.execute(action);
		});

		socket.on("refreshHUD", () => {
			window.top.location.reload();
		});

		GSI.on('data', onDataRef.current);
		socket.on('match', () => {
			loadMatch(true);
		});
	}, []);

	useEffect(() => {
		if (!checked) {
			loadMatch();
		}
	}, [checked]);

	if (!game) return '';
	return (
		<>
		<Layout game={game} match={match} />
		<Canvas />
		</>
	);


}

export default App;