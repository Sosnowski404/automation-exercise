type Environment = 'prod'
const urls: Record<Environment, Record<string, string>> = {
    prod: {
        ui_url: 'https://automationexercise.com',
        api_url: 'https://automationexercise.com/api',
    },
}
const environment: Environment = process.env.ENV as Environment;

if (!environment) {
    throw new Error('ENV is not set');
}
const selectedEnvironment = urls[environment];
export const uiUrl = selectedEnvironment.ui_url;
export const apiUrl = selectedEnvironment.api_url;