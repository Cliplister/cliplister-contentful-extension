interface ContentType {
  name: string;
  fields: {
    id: string;
    type: 'Object';
  }[];
  sys: {
    id: string;
  };
}

interface AppParameters {
  cliplisterApiToken: string;
  cliplisterBaseUrl: string;
}

interface TargetStateConfig {
  parameters: AppParameters;
  targetState: {
    EditorInterface: {
      [key: string]: {
        controls: {
          fieldId: string;
        }[];
      };
    };
  };
}

interface CliplisterResult {
    title: string;
    uuid: string;
    fileName: string;
    fileType: string;
    fileExt: string;
    uniqueId: string;
}

interface CliplisterStored{
    assets: CliplisterResult[];
}

interface CliplisterResponse {
  amount: number;
  limit: number;
  offset: number;
  assets: CliplisterResult[];
}

interface CliplisterSearchResponse {
  error: boolean;
  photos: CliplisterResult[];
}

type AppConfig = TargetStateConfig | false;