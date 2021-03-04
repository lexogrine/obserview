import { Side, Player } from "csgogsi-socket";

export interface RadarPlayerObject {
    id: string,
    label: string | number,
    visible: boolean,
    side: Side,
    position: number[],
    forward: number,
    isActive: boolean,
    isAlive: boolean,
    steamid: string,
    hasBomb: boolean,
}

export interface BombObject {
    state: "carried" | "planted" | "dropped" | "defused" | "defusing" | "planting" | "exploded";
    countdown?: string;
    player?: Player;
    site?: 'A' | 'B';
    position: number[];
    id: string;
}

export interface RadarGrenadeObject {
    state: 'inair' | 'landed' | 'exploded'
    type: 'decoy' | 'smoke' | 'frag' | 'firebomb' | 'flashbang' | 'inferno',
    position: number[],
    visible: boolean,
    id: string,
} 
export interface GrenadeBase {
    owner: string,
    type: 'decoy' | 'smoke' | 'frag' | 'firebomb' | 'flashbang' | 'inferno'
    lifetime: string
}

export interface DecoySmokeGrenade extends GrenadeBase {
    position: string,
    velocity: string,
    type: 'decoy' | 'smoke',
    effecttime: string,
}

export interface DefaultGrenade extends GrenadeBase {
    position: string,
    type: 'frag' | 'firebomb' | 'flashbang',
    velocity: string,
}

export interface InfernoGrenade extends GrenadeBase {
    type: 'inferno',
    flames: { [key: string]: string }
}

export type Grenade = DecoySmokeGrenade | DefaultGrenade | InfernoGrenade;

export type ExtendedGrenade = Grenade & { id: string };