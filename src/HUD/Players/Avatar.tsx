import React from 'react';
import { isDev, port } from '../../api/api';
import { actions } from '../../App';

import { avatars } from './../../api/avatars';

import { Skull } from './../../assets/Icons';

interface IProps {
  steamid: string,
  slot?: number,
  height?: number,
  width?: number,
  showSkull?: boolean,
  showCam?: boolean
}
export default class Avatar extends React.Component<IProps> {

  render(){
    //const url = avatars.filter(avatar => avatar.steamid === this.props.steamid)[0];
    const avatarData = avatars[this.props.steamid];
    if(!avatarData || !avatarData.url){
        return '';
    }
    return (
      <div className={`avatar`}>
          {
            this.props.showSkull ? <Skull height={this.props.height} width={this.props.width} /> : <img src={avatarData.url} height={this.props.height} width={this.props.width} alt={'Avatar'} />
          }
          
      </div>
    );
  }

}
