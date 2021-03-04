import React from "react";
import TeamBox from "./../Players/TeamBox";
import MatchBar from "../MatchBar/MatchBar";
import SeriesBox from "../MatchBar/SeriesBox";
import { CSGO, Team } from "csgogsi-socket";
import { Match } from "../../api/interfaces";
import RadarMaps from "./../Radar/RadarMaps";
import { GSI, actions } from "./../../App";
import MoneyBox from '../SideBoxes/Money';
import UtilityLevel from '../SideBoxes/UtilityLevel';
import Pause from "../PauseTimeout/Pause";
import Timeout from "../PauseTimeout/Timeout";
import './../SideBoxes/sideboxes.scss';
import './../MapSeries/mapseries.scss';

interface Props {
  game: CSGO,
  match: Match | null
}

interface State {
  winner: Team | null,
  showWin: boolean
}

export default class Layout extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      winner: null,
      showWin: false
    }
  }

  componentDidMount() {
    GSI.on('roundEnd', score => {
      this.setState({ winner: score.winner, showWin: true }, () => {
        setTimeout(() => {
          this.setState({ showWin: false })
        }, 4000)
      });
    });
  }

  getVeto = () => {
    const { game, match } = this.props;
    const { map } = game;
    if (!match) return null;
    const mapName = map.name.substring(map.name.lastIndexOf('/') + 1);
    const veto = match.vetos.find(veto => veto.mapName === mapName);
    if (!veto) return null;
    return veto;
  }

  render() {
    const { game, match } = this.props;
    const left = game.map.team_ct.orientation === "left" ? game.map.team_ct : game.map.team_t;
    const right = game.map.team_ct.orientation === "left" ? game.map.team_t : game.map.team_ct;

    const leftPlayers = game.players.filter(player => player.team.side === left.side);
    const rightPlayers = game.players.filter(player => player.team.side === right.side);

    return (
      <div className="layout">
        <div className={`players_alive`}>
          <div className="title_container">Players alive</div>
          <div className="counter_container">
            <div className={`team_counter ${left.side}`}>{leftPlayers.filter(player => player.state.health > 0).length}</div>
            <div className={`vs_counter`}>VS</div>
            <div className={`team_counter ${right.side}`}>{rightPlayers.filter(player => player.state.health > 0).length}</div>
          </div>
        </div>
        <RadarMaps match={match} map={game.map} game={game} />
        <MatchBar map={game.map} phase={game.phase_countdowns} bomb={game.bomb} match={match} />
        <Pause  phase={game.phase_countdowns}/>
        <Timeout map={game.map} phase={game.phase_countdowns} />
        <SeriesBox map={game.map} phase={game.phase_countdowns} match={match} />

        <TeamBox team={left} players={leftPlayers} side="left" current={game.player}  />
        <TeamBox team={right} players={rightPlayers} side="right" current={game.player}  />

        <div className={"boxes left"}>
          <UtilityLevel side={left.side} players={game.players} show={true} />
        </div>
        <div className={"boxes right"}>
          <UtilityLevel side={right.side} players={game.players} show={true} />
        </div>
      </div>
    );
  }
}
