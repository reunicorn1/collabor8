declare var process: {
  env: {
    NODE_ENV: string;
    [key: string]: string | undefined;
  };
};

interface Window {
  dataLayer: any[];
  gtag: (...args: any[]) => void;
}
