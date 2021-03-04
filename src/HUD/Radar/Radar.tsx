import React from "react";
import { CSGO } from "csgogsi";
import LexoRadarContainer from './LexoRadar/LexoRadarContainer';



interface Props { radarSize: number, game: CSGO }


export default class Radar extends React.Component<Props> {
    render() {
        const { players, player, bomb, grenades, map } = this.props.game; 
        return <LexoRadarContainer
            players={players}
            player={player}
            bomb={bomb}
            grenades={grenades}
            size={this.props.radarSize}
            mapName={map.name.substring(map.name.lastIndexOf('/')+1)}
        />
    }
}
