#!/usr/bin/env node

/**
 * @file Semi-automated merge helper for dependency PRs
 * This script helps merge dependency PRs by testing them locally first
 */

import { execSync } from 'child_process';
import { readFileSync } from 'fs';

// Configuration
const LOW_RISK_PRS = [115, 114, 109, 107];
const MEDIUM_RISK_PRS = [113, 108, 106];

/**
 * Execute command and return output
 * @param {string} command - Command to execute
 * @returns {string} Command output
 */
function exec(command) {
  try {
    return execSync(command, { encoding: 'utf8', stdio: 'pipe' });
  } catch (error) {
    console.error(`❌ Command failed: ${command}`);
    console.error(error.message);
    throw error;
  }
}

/**
 * Test a PR by fetching and testing it locally
 * @param {number} prNumber - PR number to test
 * @returns {boolean} Whether the PR passes tests
 */
async function testPR(prNumber) {
  console.log(`🧪 Testing PR #${prNumber} locally...`);
  
  try {
    // Fetch the PR branch
    console.log(`   📥 Fetching PR #${prNumber}...`);
    exec(`git fetch origin refs/pull/${prNumber}/head:pr-${prNumber}`);
    
    // Create a test branch from main
    console.log(`   🌿 Creating test branch...`);
    exec(`git checkout main`);
    exec(`git checkout -b test-pr-${prNumber}`);
    
    // Merge the PR branch
    console.log(`   🔀 Merging PR branch...`);
    exec(`git merge pr-${prNumber} --no-edit`);
    
    // Install dependencies
    console.log(`   📦 Installing dependencies...`);
    exec(`npm install`);
    
    // Run tests
    console.log(`   🧪 Running tests...`);
    const testOutput = exec(`npm test`);
    
    // Check if tests passed
    const testsPassed = testOutput.includes('Tests:') && !testOutput.includes('failed');
    
    if (testsPassed) {
      console.log(`   ✅ PR #${prNumber} tests passed!`);
      return true;
    } else {
      console.log(`   ❌ PR #${prNumber} tests failed!`);
      return false;
    }
    
  } catch (error) {
    console.log(`   ❌ Error testing PR #${prNumber}: ${error.message}`);
    return false;
  } finally {
    // Cleanup
    try {
      exec(`git checkout main`);
      exec(`git branch -D test-pr-${prNumber}`);
      exec(`git branch -D pr-${prNumber}`);
    } catch (e) {
      // Ignore cleanup errors
    }
  }
}

/**
 * Generate merge instructions for a PR
 * @param {number} prNumber - PR number
 * @param {string} description - PR description
 */
function generateMergeInstructions(prNumber, description) {
  console.log(`📋 MERGE INSTRUCTIONS FOR PR #${prNumber}`);
  console.log(`   Description: ${description}`);
  console.log(`   GitHub CLI: gh pr merge ${prNumber} --squash --body "Auto-merge dependency update"`);
  console.log(`   Web UI: https://github.com/paicaloid/github-readme-stats/pull/${prNumber}`);
  console.log();
}

/**
 * Main function
 */
async function main() {
  const action = process.argv[2];
  
  if (action === 'test-low-risk') {
    console.log('🧪 Testing low-risk dependency PRs locally...\n');
    
    const prDescriptions = {
      115: '@testing-library/jest-dom: 6.6.3 → 6.7.0',
      114: 'lint-staged: 16.1.2 → 16.1.5', 
      109: '@testing-library/dom: 10.4.0 → 10.4.1',
      107: 'jest-environment-jsdom: 30.0.4 → 30.0.5'
    };
    
    const passedPRs = [];
    
    for (const prNumber of LOW_RISK_PRS) {
      const passed = await testPR(prNumber);
      if (passed) {
        passedPRs.push(prNumber);
        generateMergeInstructions(prNumber, prDescriptions[prNumber]);
      }
    }
    
    console.log(`\n✅ Summary: ${passedPRs.length}/${LOW_RISK_PRS.length} low-risk PRs passed local testing`);
    console.log(`   Ready to merge: ${passedPRs.join(', ')}`);
    
  } else if (action === 'generate-commands') {
    console.log('⚡ GitHub CLI merge commands for dependency PRs:\n');
    
    console.log('# Low-risk PRs (safe to merge):');
    LOW_RISK_PRS.forEach(pr => {
      console.log(`gh pr merge ${pr} --squash --body "Auto-merge dependency update"`);
    });
    
    console.log('\n# Medium-risk PRs (review first):');
    MEDIUM_RISK_PRS.forEach(pr => {
      console.log(`# gh pr merge ${pr} --squash --body "Auto-merge dependency update" # Review first!`);
    });
    
  } else {
    console.log('🚀 Dependency PR Merge Helper');
    console.log('===============================');
    console.log();
    console.log('Usage:');
    console.log('  node scripts/dependency-merge-helper.js test-low-risk    # Test low-risk PRs locally');
    console.log('  node scripts/dependency-merge-helper.js generate-commands # Generate merge commands');
    console.log();
    console.log('Available PRs:');
    console.log('  Low-risk:    115, 114, 109, 107 (testing libraries, dev tools)');
    console.log('  Medium-risk: 113, 108, 106 (eslint, axios, dotenv - review needed)');
    console.log();
    console.log('All PRs have passed CI and are technically ready to merge!');
  }
}

main().catch(console.error);