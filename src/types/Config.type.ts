export type ConfigType = {
    text?: string;
    entity?: EntityType;
    card_style: object;
    html_element?: boolean;

}

export type EntityType = string | EntityArrayElement[];
export type EntityArrayElement = string | { entity: string, unit: string };