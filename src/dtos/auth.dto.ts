type LoginDto = {
  AccessToken: string;
};

type RefreshDto = {
  RefreshToken: string;
};

type RegisterDto = {
  Username: string;
  Password: string;
};

type RegisterResponseDto = {
  AccessToken: string;
  RefreshToken: string;
};

type AuthPayloadDto = {
  id: number;
  name: string;
  email: string;
  accessToken: string;
  refreshToken: string;
}

export { LoginDto, RegisterDto, RefreshDto, RegisterResponseDto, AuthPayloadDto };
