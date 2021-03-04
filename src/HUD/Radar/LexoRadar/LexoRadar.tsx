import React from 'react';
import maps, { ScaleConfig, MapConfig } from './maps';
import './index.css';
import { RadarPlayerObject, RadarGrenadeObject, BombObject } from './interface';
import config from './config';
import { avatars } from '../../../api/avatars';
interface IProps {
  players: RadarPlayerObject[];
  grenades: RadarGrenadeObject[];
  bomb?: BombObject[] | null;
  mapName: string;
  mapConfig: MapConfig,
  parsePosition: (position: number[], size: number, config: ScaleConfig) => number[],
  avatars?: boolean
}
class App extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      players: [],
      grenades: [],
      bomb: null
    }
  }

  renderGrenade = (grenade: RadarGrenadeObject) => {
    if ("flames" in grenade) {
      return null;
    }
    return (
      <div key={grenade.id} className={`grenade ${grenade.type} ${grenade.state} ${grenade.visible ? 'visible':'hidden'}`}
        style={{
          transform: `translateX(${grenade.position[0]}px) translateY(${grenade.position[1]}px)`,
        }}>
          <div className="explode-point"></div>
          <div className="background"></div>
      </div>
    )
  }
  renderDot = (player: RadarPlayerObject) => {
    const label = this.props.avatars && avatars[player.steamid] && avatars[player.steamid].url ? <img src={avatars[player.steamid].url} alt={player.steamid} /> : player.label;
    return (
      <div key={player.id}
        className={`player ${player.side} ${player.hasBomb ? 'hasBomb':''} ${player.isActive ? 'active' : ''} ${!player.isAlive ? 'dead' : ''} ${player.visible ? 'visible':'hidden'}`}
        style={{
          transform: `translateX(${player.position[0]}px) translateY(${player.position[1]}px)`,
          width: config.playerSize,
          height: config.playerSize,
        }}>
        <div className="background" style={{ transform: `rotate(${45 + player.position[2]}deg)` }}></div>
        <div className="label">{label}</div>
      </div>
    )
  }
  renderBomb = (bomb: BombObject) => {
    if(!bomb) return null;
    if(bomb.state === "carried" || bomb.state === "planting") return null;
    return (
      <div className={`bomb ${bomb.state} visible`}
        style={{
          transform: `translateX(${bomb.position[0]}px) translateY(${bomb.position[1]}px)`
        }}>
        <div className="explode-point"></div>
        <div className="background"></div>
      </div>
    )
  }
  render() {
    const { players, grenades, bomb } = this.props;
    //if(players.length === 0) return null;
    return <div className="map" style={{ backgroundImage: `url(${maps[this.props.mapName].file})` }}>
        {players.map(this.renderDot)}
        {grenades.map(this.renderGrenade)}
        {bomb ? bomb.map(this.renderBomb) : null}
      </div>;
  }
}

export default App;
