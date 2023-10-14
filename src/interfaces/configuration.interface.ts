export type Configuration = {
  database: DatabaseConfig;
  app: AppConfig;
}

export type DatabaseConfig = {
  host: string;
  port: number;
  uri: string;
}

export type OAuth = {
  clientUrl: string;
  google: OAuthGoogle;
}

export type OAuthGoogle = {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

export type JWT = {
  secret: string;
  expiresIn: string;
  accessTokenExpiresIn: string;
  refreshTokenExpiresIn: string;
}

export type PASETO = {
  secret: string;
  expiresIn: string;
  accessTokenExpiresIn: string;
  refreshTokenExpiresIn: string;
}

export type AuthConfig = {
  strategy: string;
  jwt: JWT;
  paseto: PASETO;
}

export type AppConfig = {
  port: number;
}
