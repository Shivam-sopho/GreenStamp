# 🚀 **Google Cloud Vision API Setup Guide**

## **Step 1: Create Google Cloud Project**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Name it: `GreenStamp-AI-Validation`
4. Click "Create"

## **Step 2: Enable Vision API**

1. In your project, go to "APIs & Services" → "Library"
2. Search for "Cloud Vision API"
3. Click on it and click "Enable"

## **Step 3: Create Service Account**

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "Service Account"
3. Name: `greenstamp-vision-api`
4. Description: `AI image validation for GreenStamp platform`
5. Click "Create and Continue"

## **Step 4: Assign Roles**

1. For roles, select:
   - **Cloud Vision API User**
   - **Cloud Vision API Admin** (if needed)
2. Click "Continue"
3. Click "Done"

## **Step 5: Generate API Key**

1. Click on the service account you just created
2. Go to "Keys" tab
3. Click "Add Key" → "Create new key"
4. Choose "JSON" format
5. Click "Create"
6. **Download the JSON file** (keep it secure!)

## **Step 6: Add to Environment Variables**

Add this to your `.env.local` file:

```bash
# Google Cloud Vision API
GOOGLE_CLOUD_CREDENTIALS='{"type":"service_account","project_id":"your-project","private_key_id":"key-id","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"service-account@project.iam.gserviceaccount.com","client_id":"client-id","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"https://www.googleapis.com/robot/v1/metadata/x509/service-account%40project.iam.gserviceaccount.com"}'
```

**⚠️ Important:** Replace the entire JSON content with your downloaded service account key!

## **Step 7: Test the Integration**

1. Upload an image through the GreenStamp platform
2. Check the console for AI validation logs
3. Verify AI validation results appear in the UI

## **🎯 What You Get:**

- **Environmental Content Detection** - AI identifies nature, activities, objects
- **Safety Filtering** - Ensures content is appropriate for the platform
- **Category Suggestions** - AI recommends relevant environmental categories
- **Object Recognition** - Detects trees, plants, cleanup equipment, etc.
- **Text Extraction** - Reads signs, labels, project names
- **Confidence Scoring** - Rates analysis accuracy

## **💰 Cost Information:**

- **Free Tier**: 1,000 API calls per month
- **Paid**: $1.50 per 1,000 calls after free tier
- **Perfect for**: Development, testing, and hackathon demos

## **🔧 Troubleshooting:**

### **Error: "Google Cloud Vision not configured"**
- Check `GOOGLE_CLOUD_CREDENTIALS` environment variable
- Ensure JSON is properly formatted
- Verify service account has Vision API access

### **Error: "Invalid credentials"**
- Check service account key is correct
- Ensure project has Vision API enabled
- Verify billing is set up (required for API usage)

### **Error: "Quota exceeded"**
- Check API usage in Google Cloud Console
- Upgrade to paid plan if needed
- Implement rate limiting in production

## **🚀 Next Steps:**

1. **Test with sample images** - Try different environmental activities
2. **Monitor API usage** - Check Google Cloud Console
3. **Fine-tune thresholds** - Adjust environmental/safety score requirements
4. **Add more categories** - Extend environmental keyword mappings

---

**🎉 Congratulations!** Your GreenStamp platform now has AI-powered image validation using Google Cloud Vision API! 