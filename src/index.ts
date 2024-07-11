import type { HomeAssistant } from 'custom-card-helpers';
import { LitElement, html, } from "lit-element";
import type { ConfigType } from "./types/Config.type";
class TextElement extends LitElement {
    private declare hass: HomeAssistant;
    private declare config: ConfigType;
    constructor() {
        super();
    }
    static get properties() {
        return {
            hass: {},
            config: {},
        };
    }
    public setConfig(config: ConfigType) {
        if (!config.text && !config.entity) {
            throw new Error("You need to define a text: or an entity in your configuration");
        }
        this.config = config;
    }

    public render() {
        const style = this.config.card_style
            ? Object.entries(this.config.card_style)
                .map(([k, v]) => `${k}:${v}`)
                .join(";") + ";"
            : "";
        return html`<div class="text-element" style="${style}">
      ${this.config.text ? this.config.text : this.getValue()}
    </div>`;
    }
    private getValue = (): string => {

        const getEntityValue = (entity: string) => {
            if (
                this.hass.states[entity].state == "unavailable" ||
                this.hass.states[entity].state == "unknown"
            )
                return "NA";

            return this.hass.states[entity].state;
        }

        if (Array.isArray(this.config.entity))
            return this.config.entity.map((a) => getEntityValue(a)).join(",");

        else if (typeof this.config.entity === "string")
            return getEntityValue(this.config.entity);

        return "";


    };
    public getCardSize() {
        return 1;
    }
}
customElements.define("text-element", TextElement);
