// src\types\onesdk-shim.ts

const sdk = (typeof window !== 'undefined') ? window.OneSDK : undefined;
export default sdk;
