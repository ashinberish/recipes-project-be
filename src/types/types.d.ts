type ExpressRequest = import("express").Request;

declare namespace RATypes {
  interface Configuration {
    maintenance: boolean;
    admin: {
      endpointsEnabled: boolean;
    };
    apeKeys: {
      endpointsEnabled: boolean;
      acceptKeys: boolean;
      maxKeysPerUser: number;
      apeKeyBytes: number;
      apeKeySaltRounds: number;
    };
  }
  interface DecodedToken {
    type: "Bearer" | "ApeKey" | "None";
    uid: string;
    email: string;
  }

  interface Context {
    configuration: Configuration;
    decodedToken: DecodedToken;
  }

  type Request = {
    ctx: Readonly<Context>;
  } & ExpressRequest;
}
