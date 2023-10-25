import { useCallback, useEffect, useState } from "react";
import ActionManager, { ActionHandler, ConfigManager } from "./managers";
import { Events } from "csgogsi";
import { GSI } from "../HUD";
import type { AllActions, GetInputsFromSection, Sections } from "./settings";

export const actions = new ActionManager();
export const configs = new ConfigManager();

type EmptyListener = () => void;

type BaseEvents = keyof Events;
type Callback<K> = K extends BaseEvents ? Events[K] | EmptyListener : EmptyListener;

export function useAction<T extends keyof AllActions>(action: T, callback: ActionHandler<T extends keyof AllActions ? AllActions[T] : never>) {
  useEffect(() => {

    actions.on(action, callback);
    return () => {
        actions.off(action, callback);
    };
  }, [action, callback]);
  return null;
}
export function useOnConfigChange<K extends keyof Sections, T = any>(section: K, callback: ActionHandler<{ [L in keyof (K extends keyof Sections ? GetInputsFromSection<Sections[K]> : T)]?: (K extends keyof Sections ? GetInputsFromSection<Sections[K]> : T)[L] } | null>){

    useEffect(() => {
      const onDataChanged = (data: any) => {
        callback(data?.[section] || null);
      };

      configs.onChange(onDataChanged);

      return () => {
        configs.off(onDataChanged);
      }
    }, [section, callback])

    return null;
}

export function onGSI<T extends BaseEvents>(event: T, callback: Callback<T>){
  useEffect(() => {
    GSI.on(event, callback);

    return () => {
      GSI.off(event, callback);
    }
  }, [event, callback])
}

/*export function useConfig<T extends { [K: string]: any } = {}>(section: string){
  const [ data, setData ] = useState<{ [K in keyof T]?: T[K] } | null>(configs.data?.[section] || null);

  const onDataChanged = useCallback((sectionData: any) => {
    setData(sectionData || null);
  }, [section]);

  useOnConfigChange(section, onDataChanged);
  return data;
}
*/
export function useConfig<K extends keyof Sections, T extends { [K: string]: any } = {}>(section: K){
  const [ data, setData ] = useState<{ [L in keyof (K extends keyof Sections ? GetInputsFromSection<Sections[K]> : T)]?: (K extends keyof Sections ? GetInputsFromSection<Sections[K]> : T)[L] } | null>(configs.data?.[section] || null);

  const onDataChanged = useCallback((sectionData: any) => {
    setData(sectionData || null);
  }, [section]);

  useOnConfigChange(section, onDataChanged);
  return data;
}
