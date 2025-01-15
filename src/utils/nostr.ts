export const checkNostrExtension = (): boolean => {
  if (typeof window === 'undefined') return false;
  return 'nostr' in window;
};

export const getExtensionName = (): string => {
  if (typeof window === 'undefined') return '';
  
  // Check common Nostr extension identifiers
  if ('alby' in window) return 'Alby';
  if ('nos2x' in window) return 'nos2x';
  if ('getalby' in window) return 'GetAlby';
  
  return 'nostr' in window ? 'Unknown Nostr Extension' : '';
};

export const getNostrErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    if (error.message.includes('NIP-07')) {
      return 'Please install a Nostr extension like Alby or nos2x to continue';
    }
    return error.message;
  }
  return 'An unknown error occurred';
};
