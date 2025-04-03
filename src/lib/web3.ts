import { BrowserProvider, Contract, formatEther, parseEther } from "ethers";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "./constants";

// Window interface is already extended in WalletContext.tsx

/**
 * Checks if MetaMask is installed
 */
export const isMetaMaskInstalled = (): boolean => {
  return typeof window !== "undefined" && window.ethereum !== undefined;
};

/**
 * Get the ethereum provider
 */
export const getProvider = async () => {
  if (!isMetaMaskInstalled()) {
    throw new Error("MetaMask is not installed");
  }
  
  return new BrowserProvider(window.ethereum);
};

/**
 * Connects to MetaMask and returns the signer and address
 */
export const connectWallet = async () => {
  try {
    const provider = await getProvider();
    
    // Request account access
    const accounts = await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    
    return { 
      address: accounts[0], 
      signer 
    };
  } catch (error) {
    console.error("Error connecting to MetaMask:", error);
    throw error;
  }
};

/**
 * Get contract instance
 */
export const getContract = async (signer: any) => {
  try {
    return new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
  } catch (error) {
    console.error("Error getting contract instance:", error);
    throw new Error("Failed to connect to smart contract. Please check your connection and try again.");
  }
};

/**
 * List a new GPU resource
 */
export const listResource = async (
  specs: object,
  pricePerHour: string,
  signer: any
) => {
  try {
    console.log("Starting resource listing process...");
    const contract = await getContract(signer);
    
    console.log("Contract instance created");
    const specsString = JSON.stringify(specs);
    console.log("Specs stringified:", specsString);
    
    const priceInWei = parseEther(pricePerHour);
    console.log("Price in wei:", priceInWei.toString());
    
    console.log("Sending transaction to list resource...");
    const tx = await contract.listResource(specsString, priceInWei);
    console.log("Transaction sent:", tx);
    
    console.log("Waiting for transaction confirmation...");
    const receipt = await tx.wait();
    console.log("Transaction confirmed:", receipt);
    
    return receipt;
  } catch (error: any) {
    console.error("Error listing resource:", error);
    
    // Provide more specific error messages based on common errors
    if (error.message?.includes("user rejected")) {
      throw new Error("Transaction was rejected in your wallet");
    } else if (error.message?.includes("insufficient funds")) {
      throw new Error("Insufficient ETH in your wallet for gas fees");
    } else if (error.message?.includes("nonce")) {
      throw new Error("Transaction nonce error. Please reset your MetaMask account or try again");
    }
    
    throw error;
  }
};

/**
 * Get all GPU resources
 */
export const getAllResources = async (signer: any) => {
  try {
    const contract = await getContract(signer);
    const resourceCount = await contract.resourceCount();
    
    const resources = [];
    for (let i = 1; i <= resourceCount; i++) {
      const resource = await contract.resources(i);
      resources.push({
        id: Number(resource.id),
        provider: resource.provider,
        specs: resource.specs,
        pricePerHour: formatEther(resource.pricePerHour),
        available: resource.available
      });
    }
    
    return resources;
  } catch (error) {
    console.error("Error fetching resources:", error);
    return [];
  }
};

/**
 * Rent a GPU resource
 */
export const rentResource = async (
  resourceId: number,
  duration: number,
  totalPrice: string,
  signer: any
) => {
  try {
    const contract = await getContract(signer);
    const valueInWei = parseEther(totalPrice);
    
    const tx = await contract.rentResource(resourceId, duration, {
      value: valueInWei
    });
    
    return await tx.wait();
  } catch (error) {
    console.error("Error renting resource:", error);
    throw error;
  }
};

/**
 * Complete a rental
 */
export const completeRental = async (resourceId: number, signer: any) => {
  try {
    const contract = await getContract(signer);
    const tx = await contract.completeRental(resourceId);
    return await tx.wait();
  } catch (error) {
    console.error("Error completing rental:", error);
    throw error;
  }
};

/**
 * Check if an address is a resource provider
 */
export const isResourceProvider = async (address: string, signer: any) => {
  try {
    const resources = await getAllResources(signer);
    return resources.some(resource => 
      resource.provider.toLowerCase() === address.toLowerCase()
    );
  } catch (error) {
    console.error("Error checking if address is a provider:", error);
    return false;
  }
};

/**
 * Check if an address is the contract owner
 */
export const isContractOwner = async (address: string, signer: any) => {
  try {
    const contract = await getContract(signer);
    const owner = await contract.owner();
    return owner.toLowerCase() === address.toLowerCase();
  } catch (error) {
    console.error("Error checking if address is the owner:", error);
    return false;
  }
};

/**
 * Format address for display (shortens the address)
 */
export const formatAddress = (address: string): string => {
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

/**
 * Parse GPU specs from JSON string
 */
export const parseGPUSpecs = (specsString: string) => {
  try {
    return JSON.parse(specsString);
  } catch (error) {
    console.error("Error parsing GPU specs:", error);
    return { model: "Unknown", memory: "Unknown", cores: "Unknown", benchmark: "Unknown" };
  }
};
