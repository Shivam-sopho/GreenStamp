import { ImageAnnotatorClient } from '@google-cloud/vision';

export interface AIValidationResult {
  success: boolean;
  confidence: number;
  detectedObjects: string[];
  environmentalScore: number;
  safetyScore: number;
  textContent: string[];
  labels: string[];
  error?: string;
}

export interface EnvironmentalCategory {
  name: string;
  keywords: string[];
  score: number;
}

export class AIValidationService {
  private client: ImageAnnotatorClient | null = null;

  constructor() {
    // Initialize client only if credentials are available
    if (process.env.GOOGLE_CLOUD_CREDENTIALS) {
      try {
        this.client = new ImageAnnotatorClient({
          credentials: JSON.parse(process.env.GOOGLE_CLOUD_CREDENTIALS),
        });
      } catch (error) {
        console.error('Failed to initialize Google Cloud Vision client:', error);
      }
    }
  }

  /**
   * Analyze an image for environmental content and safety
   */
  async analyzeImage(imageBuffer: Buffer): Promise<AIValidationResult> {
    if (!this.client) {
      return {
        success: false,
        confidence: 0,
        detectedObjects: [],
        environmentalScore: 0,
        safetyScore: 0,
        textContent: [],
        labels: [],
        error: 'Google Cloud Vision not configured'
      };
    }

    const client = this.client; // Store reference to avoid null check issues

    try {
      // Perform multiple analyses
      const [labelResult, objectResult, textResult, safeSearchResult] = await Promise.all([
        client.labelDetection(imageBuffer),
        client.objectLocalization(imageBuffer),
        client.textDetection(imageBuffer),
        client.safeSearchDetection(imageBuffer),
      ]);

      // Extract labels
      const labels = labelResult[0].labelAnnotations?.map(label => label.description || '') || [];
      
      // Extract detected objects
      const detectedObjects = objectResult[0].localizedObjectAnnotations?.map(obj => obj.name || '') || [];
      
      // Extract text content
      const textContent = textResult[0].textAnnotations?.slice(1).map(text => text.description || '') || [];
      
      // Calculate safety score
      const safetyScores = safeSearchResult[0].safeSearchAnnotation || {};
      const safetyScore = this.calculateSafetyScore(safetyScores);
      
      // Calculate environmental score
      const environmentalScore = this.calculateEnvironmentalScore(labels, detectedObjects);
      
      // Calculate overall confidence
      const confidence = this.calculateConfidence(labels, detectedObjects, textContent);

      return {
        success: true,
        confidence,
        detectedObjects,
        environmentalScore,
        safetyScore,
        textContent,
        labels,
      };

    } catch (error) {
      console.error('AI validation error:', error);
      return {
        success: false,
        confidence: 0,
        detectedObjects: [],
        environmentalScore: 0,
        safetyScore: 0,
        textContent: [],
        labels: [],
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Calculate environmental relevance score
   */
  private calculateEnvironmentalScore(labels: string[], objects: string[]): number {
    const environmentalKeywords = [
      // Nature and environment
      'tree', 'plant', 'forest', 'garden', 'park', 'beach', 'ocean', 'river', 'lake',
      'mountain', 'wildlife', 'animal', 'bird', 'fish', 'flower', 'grass', 'soil',
      
      // Environmental activities
      'planting', 'cleaning', 'recycling', 'conservation', 'sustainability',
      'renewable', 'solar', 'wind', 'water', 'energy', 'waste', 'compost',
      
      // Environmental objects
      'bin', 'container', 'tool', 'equipment', 'vehicle', 'bicycle', 'bus',
      'sign', 'poster', 'banner', 'flag', 'symbol', 'logo',
      
      // People and actions
      'person', 'people', 'group', 'team', 'volunteer', 'worker', 'student',
      'activity', 'event', 'meeting', 'workshop', 'training', 'education'
    ];

    const allTerms = [...labels, ...objects].map(term => term.toLowerCase());
    let score = 0;
    let matches = 0;

    for (const keyword of environmentalKeywords) {
      for (const term of allTerms) {
        if (term.includes(keyword) || keyword.includes(term)) {
          score += 10;
          matches++;
          break;
        }
      }
    }

    // Normalize score to 0-100
    const normalizedScore = Math.min(100, (score / environmentalKeywords.length) * 100);
    
    // Bonus for multiple matches
    const bonus = Math.min(20, matches * 2);
    
    return Math.min(100, normalizedScore + bonus);
  }

  /**
   * Calculate safety score from SafeSearch results
   */
  private calculateSafetyScore(safeSearch: any): number {
    const safetyLevels: Record<string, number> = {
      'VERY_LIKELY': 0,
      'LIKELY': 25,
      'POSSIBLE': 50,
      'UNLIKELY': 75,
      'VERY_UNLIKELY': 100
    };

    const categories = ['adult', 'racy', 'violence', 'medical'];
    let totalScore = 0;
    let validCategories = 0;

    for (const category of categories) {
      const level = safeSearch[category];
      if (level && typeof level === 'string' && safetyLevels[level] !== undefined) {
        totalScore += safetyLevels[level];
        validCategories++;
      }
    }

    return validCategories > 0 ? totalScore / validCategories : 100;
  }

  /**
   * Calculate overall confidence score
   */
  private calculateConfidence(labels: string[], objects: string[], text: string[]): number {
    let confidence = 0;
    
    // Label confidence (Google provides confidence scores)
    if (labels.length > 0) {
      confidence += 40;
    }
    
    // Object detection confidence
    if (objects.length > 0) {
      confidence += 30;
    }
    
    // Text detection confidence
    if (text.length > 0) {
      confidence += 20;
    }
    
    // Bonus for multiple detection types
    const detectionTypes = [labels.length > 0, objects.length > 0, text.length > 0];
    const activeDetections = detectionTypes.filter(Boolean).length;
    confidence += activeDetections * 10;
    
    return Math.min(100, confidence);
  }

  /**
   * Get environmental category suggestions based on AI analysis
   */
  getEnvironmentalCategory(labels: string[], objects: string[]): string | null {
    const categoryMappings = {
      'tree_planting': ['tree', 'plant', 'planting', 'sapling', 'seedling', 'garden', 'forest'],
      'beach_cleanup': ['beach', 'ocean', 'sea', 'sand', 'trash', 'cleaning', 'cleanup', 'litter'],
      'recycling': ['recycling', 'bin', 'container', 'waste', 'plastic', 'paper', 'metal', 'glass'],
      'energy_conservation': ['solar', 'wind', 'energy', 'light', 'bulb', 'power', 'electricity'],
      'water_conservation': ['water', 'tap', 'faucet', 'drip', 'irrigation', 'rain', 'conservation'],
      'wildlife_protection': ['animal', 'wildlife', 'bird', 'fish', 'habitat', 'protection', 'conservation'],
      'community_garden': ['garden', 'community', 'vegetable', 'fruit', 'plant', 'soil', 'compost'],
      'plastic_reduction': ['plastic', 'reduction', 'alternative', 'bamboo', 'reusable', 'sustainable'],
      'sustainable_transport': ['bicycle', 'bus', 'walking', 'transport', 'vehicle', 'green', 'eco'],
      'education': ['education', 'training', 'workshop', 'meeting', 'presentation', 'learning']
    };

    const allTerms = [...labels, ...objects].map(term => term.toLowerCase());
    let bestCategory = null;
    let bestScore = 0;

    for (const [category, keywords] of Object.entries(categoryMappings)) {
      let score = 0;
      for (const keyword of keywords) {
        for (const term of allTerms) {
          if (term.includes(keyword) || keyword.includes(term)) {
            score += 1;
          }
        }
      }
      
      if (score > bestScore) {
        bestScore = score;
        bestCategory = category;
      }
    }

    return bestScore > 0 ? bestCategory : null;
  }

  /**
   * Check if image is safe for environmental platform
   */
  isImageSafe(safetyScore: number): boolean {
    return safetyScore >= 70; // Require 70%+ safety score
  }

  /**
   * Check if image is environmentally relevant
   */
  isEnvironmentallyRelevant(environmentalScore: number): boolean {
    return environmentalScore >= 30; // Require 30%+ environmental relevance
  }
}

// Export singleton instance
export const aiValidationService = new AIValidationService(); 