type LoginDto = {
  AccessToken: string;
};

type TokenSuccessResponse = {
  AccessToken: string;
  RefreshToken?: string;
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
  email: string;
  accessToken: string;
  refreshToken: string;
};

export {
  LoginDto,
  RegisterDto,
  RefreshDto,
  RegisterResponseDto,
  AuthPayloadDto,
  TokenSuccessResponse,
};
