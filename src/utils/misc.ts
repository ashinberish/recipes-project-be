export function base64UrlDecode(data: string): string {
	return Buffer.from(data, "base64url").toString();
}
