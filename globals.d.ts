declare global {
    interface Window {
        phantom?: {
            solana?: {
                isPhantom: boolean;
            };
        };
    }
}

// This export is needed to make the TypeScript compiler aware of the augmented types
export {};