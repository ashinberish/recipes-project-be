import _ from "lodash";

interface Status {
	code: number;
	message: string;
}

interface Statuses {
	APE_KEY_INVALID: Status;
}

const statuses: Statuses = {
	APE_KEY_INVALID: {
		code: 470,
		message: "Invalid ApeKey",
	},
};

const CUSTOM_STATUS_CODES = new Set(_.map(statuses, (status: Status) => status.code));

export function isCustomCode(code: number): boolean {
	return CUSTOM_STATUS_CODES.has(code);
}
export default statuses;
