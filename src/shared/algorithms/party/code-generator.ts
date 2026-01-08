const CHARSET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

export function generatePartyCode(): string {
	let code = "";
	for (let i = 0; i < 6; i++) {
		const index = math.random(1, CHARSET.size());
		const char = CHARSET.sub(index, index);
		code += char;
	}
	return code;
}
