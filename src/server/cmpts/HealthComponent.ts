import { Component, BaseComponent } from "@flamework/components";
import { HealthLogic } from "../../shared/algorithms/health";

@Component({ tag: "Health" })
export class HealthComponent extends BaseComponent<object, BasePart> {
    private logic = new HealthLogic(100, 100);
    
    public takeDamage(amount: number) {
        if (this.logic.damage(amount)) {
            // Real impl: Emit Death Event, Ragdoll, Cleanup
            this.instance.Destroy(); 
        }
    }
}
