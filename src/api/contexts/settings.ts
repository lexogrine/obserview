import { Match, Player, Team } from "../types"
import { keybindDefinition } from "./keybinds";
import { panelDefinition } from "./panel";

type Prettify<T> = {
    [K in keyof T]: T[K];
  } & {};

type Settings = typeof panelDefinition;

type Keybinds = typeof keybindDefinition;

//type X = { [K in Settings[0]["inputs"][number] as K["name"]]: any}

type InputMapper = {
    text: string;
    player: {
        type: "player",
        id: string,
        match: Player | null
    };
    match: {
        type: "match",
        id: string,
        match: Match | null
    };
    team: {
        type: "team",
        id: string,
        match: Team | null
    };
    checkbox: boolean;
    action: never;
    image: string;
    images: string[];
    select: string;
}
type NonNeverKeys<T extends { [K: string]: any }> = { [K in keyof T]: T[K] extends never ? never : K }[keyof T];


type ValueMapper<T extends Settings[number]["inputs"]> = { [K in T[number] as K["name"]]: K extends { type: "action" } ? never : (K extends { values: { name: string }[] } ? K["values"][number]["name"] | "" : InputMapper[K["type"]]) }

export type GetInputsFromSection<T extends Settings[number]["inputs"]> = { [K in NonNeverKeys<ValueMapper<T>>]: ValueMapper<T>[K]};
export type Sections = { [K in Settings[number] as K["name"]]: K["inputs"]}

type ActionValueMapper<T extends Settings[number]["inputs"]> = { [K in T[number] as K["name"]]: K extends { type: "action" } ? K["values"][number]["name"] : never }

type GetActionsFromSection<T extends Settings[number]["inputs"]> = { [K in NonNeverKeys<ActionValueMapper<T>>]: ActionValueMapper<T>[K]};

export type AllActions = Prettify<GetActionsFromSection<Settings[number]["inputs"]> & { [K in  Keybinds[number]["action"]]: never }>;
