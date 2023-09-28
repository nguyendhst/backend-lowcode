export interface Configuration {
	database: DatabaseConfig;
	app: AppConfig;
}

export interface DatabaseConfig {
	host: string;
	port: number;
	uri: string;
}

export interface AppConfig {
	port: number;
}