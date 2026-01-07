import { Component, BaseComponent } from "@flamework/components";
import { HealthLogic } from "../../shared/algorithms/health";
import { RunService } from "../services/RunService";

@Component({ tag: "Health" })
export class HealthComponent extends BaseComponent<object, BasePart> {
    private logic = new HealthLogic(100, 100);
    
    constructor(private runService: RunService) {
        super();
    }

    onStart() {
        this.instance.SetAttribute("Health", this.logic.getHealth());
        this.instance.SetAttribute("MaxHealth", this.logic.getMaxHealth());
    }

    public takeDamage(amount: number) {
        if (this.logic.damage(amount)) {
            this.instance.SetAttribute("Health", 0);
            
            // If player died, mission failed
            if (this.instance.IsA("Model") && game.GetService("Players").GetPlayerFromCharacter(this.instance)) {
                this.runService.resolveMission("Defeat");
            }

            this.instance.Destroy(); 
        } else {
            this.instance.SetAttribute("Health", this.logic.getHealth());
        }
    }
}
