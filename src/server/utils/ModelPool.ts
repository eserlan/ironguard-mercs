export class ModelPool {
	private pool: Model[] = [];
	private template: Model;
	private parent: Instance;

	constructor(template: Model, initialSize: number, parent: Instance) {
		this.template = template;
		this.parent = parent;

		for (let i = 0; i < initialSize; i++) {
			this.pool.push(this.create());
		}
	}

	private create(): Model {
		const clone = this.template.Clone();
		clone.Parent = this.parent;
		// Move far away to hide
		clone.PivotTo(new CFrame(0, 100000, 0));
		return clone;
	}

	public Get(): Model {
		const model = this.pool.pop() ?? this.create();
		return model;
	}

	public Return(model: Model) {
		model.PivotTo(new CFrame(0, 100000, 0));
		this.pool.push(model);
	}
}
