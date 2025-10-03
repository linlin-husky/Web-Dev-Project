export const SERVER = {
    AUTH_MISSING: 'auth-missing',
    AUTH_INSUFFICIENT: 'auth-insufficient',
    REQUIRED_USERNAME: 'required-username',
    REQUIRED_MESSAGE: 'required-message',
    MESSAGE_MISSING: 'noSuchId',
};

export const CLIENT = {
    NETWORK_ERROR: 'networkError',
    NO_SESSION: 'noSession',
};

export const ERROR_MESSAGES = {
    [CLIENT.NETWORK_ERROR]: 'Trouble connecting to the network. Please try again!',
    [SERVER.AUTH_MISSING]: 'Please log in to continue.',
    [SERVER.AUTH_INSUFFICIENT]: 'User not allowed.',
    [SERVER.REQUIRED_USERNAME]: 'Please enter a valid (letters and/or numbers) username.',
    [SERVER.REQUIRED_MESSAGE]: "Please enter a valid message, can't be empty.",
    default: 'Something went wrong. Please try again.',
};

export const POLL_TIMING_MSECS = 5 * 1000;