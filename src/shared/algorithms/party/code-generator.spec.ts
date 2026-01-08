import { describe, it, expect } from "vitest";
import { generatePartyCode } from "./code-generator";

describe("Party Code Generator", () => {
	it("should generate a code of length 6", () => {
		const code = generatePartyCode();
		expect(code.length).toBe(6);
	});

	it("should only contain uppercase alphanumeric characters", () => {
		const code = generatePartyCode();
		expect(code).toMatch(/^[A-Z0-9]+$/);
	});

	it("should verify string match", () => {
		const code = generatePartyCode();
		const regex = new RegExp("^[A-Z0-9]+$");
		expect(regex.test(code)).toBe(true);
	});

	it("should NOT contain confusing characters (O, 0, I, 1, L)", () => {
		// Run multiple times to increase confidence
		for (let i = 0; i < 100; i++) {
			const code = generatePartyCode();
			expect(code).not.toMatch(/[O0I1L]/);
		}
	});

	it("should generate unique codes (probabilistic)", () => {
		const codes = new Set<string>();
		for (let i = 0; i < 1000; i++) {
			codes.add(generatePartyCode());
		}
		// Collisions should be extremely rare, checking for > 99% uniqueness
		// Actually, with this space, 1000 codes should likely be unique
		expect(codes.size).toBe(1000);
	});
});
