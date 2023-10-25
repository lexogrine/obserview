import React from "react";
import "./radar.scss";
import { Map, CSGO } from 'csgogsi';
import Radar from './Radar'
import { Match } from "../../api/types";

interface Props { match: Match | null, map: Map, game: CSGO }
interface State { showRadar: boolean, radarSize: number }

export default class RadarMaps extends React.Component<Props, State> {
    state = {
        showRadar: true,
        radarSize: 1100
    }
    render() {
        return (
            <div id={`radar_maps_container`} className={`${!this.state.showRadar ? 'hide':''}`}>
                <Radar radarSize={this.state.radarSize} game={this.props.game}/>
                {/*match ? <MapsBar match={this.props.match} map={this.props.map}  game={this.props.game}/>:null*/}
            </div>
        );
    }
}


