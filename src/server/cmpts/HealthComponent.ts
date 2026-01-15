import { Component, BaseComponent } from "@flamework/components";
import { HealthLogic } from "../../shared/algorithms/health";
import { RunService } from "../services/RunService";

@Component({ tag: "Health" })
export class HealthComponent extends BaseComponent<object, Model> {
    private logic = new HealthLogic(100, 100);

    constructor(private runService: RunService) {
        super();
    }

    onStart() {
        // Initialize from attributes if they exist (allows external setup)
        const maxHealth = this.instance.GetAttribute("MaxHealth") as number | undefined;
        const currentHealth = this.instance.GetAttribute("Health") as number | undefined;

        if (maxHealth !== undefined) {
            this.logic.max = maxHealth;
        } else {
            this.instance.SetAttribute("MaxHealth", this.logic.max);
        }

        if (currentHealth !== undefined) {
            this.logic.current = currentHealth;
        } else {
            this.logic.current = this.logic.max;
            this.instance.SetAttribute("Health", this.logic.current);
        }

        this.instance.SetAttribute("Shield", 0);
    }

    public takeDamage(amount: number) {
        if (this.logic.damage(amount)) {
            this.instance.SetAttribute("Health", 0);
            this.instance.SetAttribute("Shield", 0);

            // If player died, mission failed
            if (this.instance.IsA("Model") && game.GetService("Players").GetPlayerFromCharacter(this.instance)) {
                this.runService.resolveMission("Defeat");
            }

            this.instance.Destroy();
        } else {
            this.instance.SetAttribute("Health", this.logic.current);
            this.instance.SetAttribute("Shield", this.logic.shield);
        }
    }

    public heal(amount: number) {
        this.logic.heal(amount);
        this.instance.SetAttribute("Health", this.logic.current);
    }

    public addShield(amount: number) {
        this.logic.addShield(amount);
        this.instance.SetAttribute("Shield", this.logic.shield);
    }

    public setHealth(value: number) {
        this.logic.current = value;
        this.instance.SetAttribute("Health", value);
    }

    public setMaxHealth(value: number) {
        this.logic.max = value;
        this.instance.SetAttribute("MaxHealth", value);
    }
}
