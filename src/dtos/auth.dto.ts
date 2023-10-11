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

export { LoginDto, RegisterDto, RefreshDto, RegisterResponseDto };
