import type { HomeAssistant } from 'custom-card-helpers';
import { LitElement, TemplateResult, html, } from "lit-element";
import type { ConfigType, EntityArrayElement } from "./types/Config.type";
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
    private getValue(): TemplateResult[] | string {



        if (Array.isArray(this.config.entity)) {

            const res = this.config.entity.map((a) => this.getEntityValue(a));

            if (this.config.html_element) return res as TemplateResult[];

            else return res.join(",");
        }

        else if (typeof this.config.entity === "string")
            return this.getEntityValue(this.config.entity) as string;

        return "";


    };
    private getEntityValue(entity: EntityArrayElement) {

        const getEntityStatus = (entity: string, attribute?: string) => {
            const entityValue = this.hass.states[entity];
            if (
                !entityValue || entityValue.state == "unavailable" ||
                entityValue.state == "unknown"
            )
                return "NA";

            const res = attribute ? entityValue.attributes[attribute] : entityValue.state;
            return isNaN(+res) ? res : (+res).toFixed(2);
        }

        if (typeof entity === "object") {
            return this.encapsulateValue(getEntityStatus(entity.entity, entity.attribute) + entity.unit);
        }

        return this.encapsulateValue(getEntityStatus(entity, undefined));


    }

    private encapsulateValue(val: string): TemplateResult | string {
        if (this.config.html_element)
            return html`<span>${val}</span>`

        return val;
    }
    public getCardSize() {
        return 1;
    }
}
customElements.define("text-element", TextElement);
