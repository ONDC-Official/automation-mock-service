type AckResponse = {
	context?: any;
	message: {
		ack: {
			status: "ACK" | "NACK";
		};
	};
	error?: any;
};

export const setAckResponse = (
	ack: boolean = true,
	error?: string,
	errorCode?: string
): AckResponse => {
	const resp: AckResponse = {
		message: {
			ack: {
				status: ack ? "ACK" : "NACK",
			},
		},
	};

	if (error && errorCode) {
		resp.error = {
			code: errorCode,
			message: error,
		};
	}

	return resp;
};

export const setInternalServerNack = {
	message: {
		status: "NACK",
		error: {
			code: "23001",
			message: "Internal Server Error",
		},
	},
};

export const setBadRequestNack = (message = "") => {
	return {
		message: {
			status: "NACK",
			error: {
				code: "10000",
				message: "Bad Request " + message,
			},
		},
	};
};
