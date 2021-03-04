import React from "react";
import { Player, WeaponRaw } from "csgogsi-socket";
import Weapon from "./../Weapon/Weapon";
import Avatar from "./Avatar";
import Armor from "./../Indicators/Armor";
import Bomb from "./../Indicators/Bomb";
import Defuse from "./../Indicators/Defuse";

interface IProps {
  player: Player,
  isObserved: boolean,
}
export default class PlayerBox extends React.Component<IProps> {
  render() {
    const { player } = this.props;
    const isLeft = player.team.orientation === "left";
    return (
      <div className={`player ${player.state.health === 0 ? "dead" : ""} ${this.props.isObserved ? 'active' : ''}`}>
        <div className="player_data">
          <div className="dead-stats">
            <div className="labels">
              <div className="stat-label">K</div>
              <div className="stat-label">A</div>
              <div className="stat-label">D</div>
            </div>
            <div className="values">
              <div className="stat-value">{player.stats.kills}</div>
              <div className="stat-value">{player.stats.assists}</div>
              <div className="stat-value">{player.stats.deaths}</div>
            </div>
          </div>
          <div className="player_stats">
            <div className="row">
              <div className="health">
                {player.state.health}
              </div>
              <div className="username">
                <div>{isLeft ? <span>{player.observer_slot}</span> : null} {player.name} {!isLeft ? <span>{player.observer_slot}</span> : null}</div>
              </div>
            </div>
            <div className={`hp_bar ${player.state.health <= 20 ? 'low':''}`} style={{ width: `${player.state.health}%` }}></div>
            <div className="row">
              <div className="armor_and_utility">
                <Bomb player={player} />
                <Armor player={player} />
                <Defuse player={player} />
              </div>
            </div>
            <div className="active_border"></div>
          </div>
        </div>
      </div>
    );
  }
}
