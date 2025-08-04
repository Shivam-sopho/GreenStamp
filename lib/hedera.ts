import {
  Client,
  AccountId,
  PrivateKey,
  TopicMessageSubmitTransaction,
  TopicCreateTransaction,
  Hbar,
  Status,
} from "@hashgraph/sdk";

export interface ProofRecord {
  cid: string;
  originalName: string;
  size: number;
  type: string;
  timestamp: number;
  proofHash: string;
  topicId?: string;
  sequenceNumber?: number;
}

export class HederaService {
  private client: Client | null = null;
  private topicId: string | null = null;

  private initializeClient(): Client {
    if (this.client) {
      return this.client;
    }

    // Initialize Hedera client
    const accountId = process.env.HEDERA_ACCOUNT_ID;
    const privateKey = process.env.HEDERA_PRIVATE_KEY;

    if (!accountId || !privateKey) {
      throw new Error("Hedera credentials not configured");
    }

    this.client = Client.forTestnet() // Use mainnet for production
      .setOperator(AccountId.fromString(accountId), PrivateKey.fromString(privateKey));
    
    return this.client;
  }

  /**
   * Create a new topic for storing proof records
   */
  async createTopic(): Promise<string> {
    try {
      const client = this.initializeClient();
      
      const transaction = new TopicCreateTransaction()
        .setTopicMemo("GreenStamp Proof Records")
        .setMaxTransactionFee(new Hbar(2));

      const response = await transaction.execute(client);
      const receipt = await response.getReceipt(client);
      const topicId = receipt.topicId;

      if (!topicId) {
        throw new Error("Failed to create topic");
      }

      this.topicId = topicId.toString();
      console.log(`Created topic: ${this.topicId}`);
      return this.topicId;
    } catch (error) {
      console.error("Error creating topic:", error);
      throw error;
    }
  }

  /**
   * Store proof record on Hedera
   */
  async storeProof(proof: ProofRecord): Promise<{ topicId: string; sequenceNumber: number }> {
    try {
      const client = this.initializeClient();
      
      // Create topic if it doesn't exist
      if (!this.topicId) {
        this.topicId = await this.createTopic();
      }

      // Create proof message
      const proofMessage = JSON.stringify({
        cid: proof.cid,
        originalName: proof.originalName,
        size: proof.size,
        type: proof.type,
        timestamp: proof.timestamp,
        proofHash: proof.proofHash,
        action: "PROOF_STORED"
      });

      // Submit message to topic
      const transaction = new TopicMessageSubmitTransaction()
        .setTopicId(this.topicId)
        .setMessage(proofMessage)
        .setMaxTransactionFee(new Hbar(1));

      const response = await transaction.execute(client);
      const receipt = await response.getReceipt(client);

      if (receipt.status !== Status.Success) {
        throw new Error(`Transaction failed with status: ${receipt.status}`);
      }

      // Get sequence number
      const sequenceNumber = receipt.topicSequenceNumber;
      
      if (!sequenceNumber) {
        throw new Error("Failed to get sequence number");
      }

      console.log(`Stored proof on topic ${this.topicId} with sequence ${sequenceNumber}`);
      
      return {
        topicId: this.topicId,
        sequenceNumber: sequenceNumber.toNumber()
      };
    } catch (error) {
      console.error("Error storing proof:", error);
      throw error;
    }
  }

  /**
   * Generate a unique proof hash
   */
  generateProofHash(cid: string, timestamp: number, originalName: string): string {
    const data = `${cid}-${timestamp}-${originalName}`;
    // Simple hash function - in production, use crypto.createHash('sha256')
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return `proof-${Math.abs(hash).toString(16)}`;
  }
}

// Export singleton instance
export const hederaService = new HederaService(); 