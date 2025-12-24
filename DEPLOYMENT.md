# GitHub Pages Deployment Setup Guide

## Prerequisites

Your GitHub Actions workflow has been created and is ready to deploy your site to GitHub Pages. Before the first deployment, you need to complete the following setup steps:

## Step 1: Add Contentful Secrets to GitHub

Your application uses Contentful CMS and requires API credentials to fetch content during the build process.

1. **Navigate to your repository on GitHub:**
   - Go to `https://github.com/daijabou/daijabou.github.io`

2. **Access the Secrets settings:**
   - Click on **Settings** (top menu bar)
   - In the left sidebar, click **Secrets and variables** → **Actions**

3. **Add the following repository secrets:**
   
   Click **New repository secret** for each of these:

   | Secret Name | Value |
   |-------------|-------|
   | `VITE_CONTENTFUL_SPACE_ID` | Your Contentful Space ID (from your `.env` file) |
   | `VITE_CONTENTFUL_ACCESS_TOKEN` | Your Contentful Access Token (from your `.env` file) |

   > **Note:** These secret names must match exactly as shown above, including the `VITE_` prefix.

## Step 2: Enable GitHub Pages

1. In your repository **Settings**, scroll down to **Pages** in the left sidebar
2. Under **Source**, select **GitHub Actions**
3. Click **Save**

## Step 3: Deploy Your Site

Once the secrets are configured and GitHub Pages is enabled:

1. **Commit and push your changes:**
   ```bash
   git add .github/workflows/deploy.yml
   git commit -m "Add GitHub Pages CI/CD workflow"
   git push origin main
   ```

2. **Monitor the deployment:**
   - Go to the **Actions** tab in your repository
   - You should see the "Deploy to GitHub Pages" workflow running
   - Click on it to view the build and deployment progress

3. **Access your deployed site:**
   - Once the workflow completes successfully, your site will be available at:
   - `https://daijabou.github.io/`

## Workflow Details

The GitHub Actions workflow will:
- ✅ Trigger automatically on every push to the `main` branch
- ✅ Install dependencies using npm
- ✅ Build your Vite React application with Contentful API credentials
- ✅ Deploy the built files to GitHub Pages
- ✅ Support manual triggering from the Actions tab

## Troubleshooting

**If the build fails:**
- Check the Actions tab for detailed error logs
- Verify that your secrets are correctly configured
- Ensure your Contentful Space ID and Access Token are valid

**If the site doesn't load:**
- Wait a few minutes for DNS propagation
- Check that GitHub Pages is enabled in Settings → Pages
- Verify the deployment was successful in the Actions tab

**If Contentful content doesn't load:**
- Verify the GitHub Secrets match your local `.env` file exactly
- Check the browser console for API errors
- Ensure your Contentful content is published
