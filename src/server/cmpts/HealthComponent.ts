import { Component, BaseComponent } from "@flamework/components";
import { HealthLogic } from "../../shared/algorithms/health";

@Component({ tag: "Health" })
export class HealthComponent extends BaseComponent<object, BasePart> {
    private logic = new HealthLogic(100, 100);
    
    onStart() {
        this.instance.SetAttribute("Health", this.logic.getHealth());
        this.instance.SetAttribute("MaxHealth", this.logic.getMaxHealth());
    }

    public takeDamage(amount: number) {
        if (this.logic.damage(amount)) {
            this.instance.SetAttribute("Health", 0);
            this.instance.Destroy(); 
        } else {
            this.instance.SetAttribute("Health", this.logic.getHealth());
        }
    }
}
