/**
 * Wallet Utilities
 */

export function shortenAddress(address: string, chars: number = 4): string {
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

export function isAddress(value: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(value);
}

export function compareAddresses(addr1: string, addr2: string): boolean {
  return addr1.toLowerCase() === addr2.toLowerCase();
}

export function toChecksumAddress(address: string): string {
  // Simple implementation - in production use ethers.getAddress
  return address.toLowerCase();
}

