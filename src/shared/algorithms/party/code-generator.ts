const CHARS = ["A", "B", "C", "D", "E", "F", "G", "H", "J", "K", "M", "N", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "2", "3", "4", "5", "6", "7", "8", "9"];

export function generatePartyCode(): string {
	let code = "";
	for (let i = 0; i < 6; i++) {
		const index = math.random(0, CHARS.size() - 1);
		code += CHARS[index];
	}
	return code;
}
