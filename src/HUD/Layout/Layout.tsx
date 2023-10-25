import RadarMaps from "./../Radar/RadarMaps";
import { CSGO } from "csgogsi";
import { Match } from "../../api/types";

interface Props {
  game: CSGO,
  match: Match | null
}
/*
interface State {
  winner: Team | null,
  showWin: boolean,
  forceHide: boolean
}*/

const Layout = ({game,match}: Props) => {


  return (
    <div className="layout">
      <RadarMaps match={match} map={game.map} game={game} />

    </div>
  );
}
export default Layout;
