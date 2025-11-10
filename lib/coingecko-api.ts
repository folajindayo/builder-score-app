// CoinGecko API utility for token price conversion
// WCT (WalletConnect Token) contract: 0x6a39909e805A3eaDd2b61fFf61147796ca6abb47

const COINGECKO_API_BASE = "https://api.coingecko.com/api/v3";

export interface TokenPrice {
  usd: number;
  usd_24h_change?: number;
}

export async function getWCTPrice(): Promise<number> {
  try {
    // WalletConnect Token (WCT) contract address on Ethereum
    const contractAddress = "0x6a39909e805A3eaDd2b61fFf61147796ca6abb47";
    const url = `${COINGECKO_API_BASE}/simple/token_price/ethereum?contract_addresses=${contractAddress}&vs_currencies=usd`;
    
    const response = await fetch(url, {
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.statusText}`);
    }

    const data = await response.json();
    const price = data[contractAddress.toLowerCase()]?.usd;
    
    if (!price) {
      throw new Error("WCT price not found");
    }

    return price;
  } catch (error) {
    console.error("Error fetching WCT price:", error);
    // Return a fallback price if API fails
    return 0.1249; // Approximate fallback price
  }
}

export async function convertWCTToUSD(wctAmount: number): Promise<number> {
  try {
    const wctPrice = await getWCTPrice();
    return wctAmount * wctPrice;
  } catch (error) {
    console.error("Error converting WCT to USD:", error);
    // Fallback calculation with approximate price
    return wctAmount * 0.1249;
  }
}

