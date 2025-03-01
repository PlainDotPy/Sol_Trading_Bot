import { LAMPORTS_PER_SOL, clusterApiUrl, Keypair } from "@solana/web3.js";
import { ArbBot, SwapToken } from './bot.ts';
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

const defaultConfig = {
  solanaEndpoint: clusterApiUrl("mainnet-beta"),
  jupiter: "https://quote-api.jup.ag/v6",
};

async function main() {
  if (!process.env.SECRET_KEY) {
    throw new Error("SECRET_KEY environment variable not set");
  }

  const decodedSecretKey = Uint8Array.from(JSON.parse(process.env.SECRET_KEY));

  const wallet = Keypair.fromSecretKey(decodedSecretKey);
  console.log("Connected Wallet Public Address:", wallet.publicKey.toBase58());

  const bot = new ArbBot({
    solanaEndpoint: process.env.SOLANA_ENDPOINT ?? defaultConfig.solanaEndpoint,
    metisEndpoint: process.env.METIS_ENDPOINT ?? defaultConfig.jupiter,
    secretKey: decodedSecretKey,
    firstTradePrice: 0.0000, 
    // EX. TOKEN1 has a price 11 USDC 
    // I want to buy 1 USDC worth of TOKEN1 at 10 USDC
    // & has 6 Decimals like USDC 
    // the firsttradeprice would then be 100_000 which represents .1 of the token 
    // So firsttradeprice is the amount of the token at the price you are seeking
    targetGainPercentage: 5, 
    // PERCENT TARGET
    initialInputToken: SwapToken.USDC,
    // Buying Power Token
    initialInputAmount: 1_000_000, 
    // 1 USDC EXAMPLE
  });
  

  await bot.init();
}

main().catch(console.error);
