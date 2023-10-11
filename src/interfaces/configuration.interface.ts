export interface Configuration {
	database: DatabaseConfig;
	app: AppConfig;
}

export interface DatabaseConfig {
	host: string;
	port: number;
	uri: string;
}

export interface OAuth {
	google: OAuthGoogle;
}

export interface OAuthGoogle {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
}

export interface AppConfig {
	port: number;
}