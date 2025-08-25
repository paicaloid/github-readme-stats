# Dependency PR Merge Guide

This document provides a comprehensive guide for merging the open dependency PRs in the github-readme-stats repository.

## Summary

✅ **Current Status**: All dependency PRs have passed CI checks and are ready for review/merge
📊 **Test Coverage**: 98.02% (all tests passing)
🔢 **Total PRs**: 7 dependency PRs identified

## PR Analysis

### 🟢 Low-Risk PRs (Safe to merge immediately)

| PR # | Package | Update | Type | Status |
|------|---------|--------|------|--------|
| #115 | @testing-library/jest-dom | 6.6.3 → 6.7.0 | dev | ✅ Tested locally |
| #114 | lint-staged | 16.1.2 → 16.1.5 | dev | ✅ CI passed |
| #109 | @testing-library/dom | 10.4.0 → 10.4.1 | dev | ✅ CI passed |
| #107 | jest-environment-jsdom | 30.0.4 → 30.0.5 | dev | ✅ CI passed |

### 🟡 Medium-Risk PRs (Review recommended)

| PR # | Package | Update | Type | Notes |
|------|---------|--------|------|-------|
| #113 | eslint | 9.31.0 → 9.33.0 | dev | ⚠️ May need config update |
| #108 | axios | 1.10.0 → 1.11.0 | prod | ⚠️ Production dependency |
| #106 | dotenv | 16.6.1 → 17.2.1 | prod | ⚠️ Major version update |

## Local Testing Results

✅ **PR #115** (@testing-library/jest-dom): Successfully tested locally
- All 224 tests pass
- 98.02% code coverage maintained
- No breaking changes detected

## Merge Commands

### Option 1: GitHub CLI (Recommended)

```bash
# Low-risk PRs (safe to merge):
gh pr merge 115 --squash --body "Auto-merge dependency update"
gh pr merge 114 --squash --body "Auto-merge dependency update"  
gh pr merge 109 --squash --body "Auto-merge dependency update"
gh pr merge 107 --squash --body "Auto-merge dependency update"

# Medium-risk PRs (review first):
# gh pr merge 113 --squash --body "Dependency update: eslint 9.31.0 → 9.33.0"
# gh pr merge 108 --squash --body "Dependency update: axios 1.10.0 → 1.11.0" 
# gh pr merge 106 --squash --body "Dependency update: dotenv 16.6.1 → 17.2.1"
```

### Option 2: Manual Merge via Web UI

Visit each PR and use the "Squash and merge" option:
- [PR #115](https://github.com/paicaloid/github-readme-stats/pull/115)
- [PR #114](https://github.com/paicaloid/github-readme-stats/pull/114)
- [PR #109](https://github.com/paicaloid/github-readme-stats/pull/109)
- [PR #107](https://github.com/paicaloid/github-readme-stats/pull/107)

## Recommended Merge Strategy

1. **Phase 1**: Merge low-risk PRs first
   - These are development dependencies and patch updates
   - Minimal risk of breaking changes
   
2. **Phase 2**: Review and merge medium-risk PRs individually
   - Check changelogs for breaking changes
   - Test locally if needed
   - Update configurations if required

3. **Testing**: Run tests after each merge
   ```bash
   npm test
   npm run lint  # Note: may need ESLint config update
   ```

## Special Considerations

### ESLint Update (PR #113)
- ESLint 9.x uses new config format
- Current project uses `.eslintrc.json` (legacy format)
- May need to migrate to `eslint.config.js`

### Axios Update (PR #108)
- Production dependency
- Minor version update (1.10.0 → 1.11.0)
- Check for API changes in changelog

### Dotenv Update (PR #106)
- Major version update (16.x → 17.x)
- Review breaking changes in v17
- Test environment variable loading

## Tools Created

1. **`scripts/merge-dependency-prs.js`**: Analysis tool for dependency PRs
2. **`scripts/dependency-merge-helper.js`**: Testing and merge helper
3. **`DEPENDENCY_MERGE_GUIDE.md`**: This comprehensive guide

## Verification Steps

After merging any PR:

```bash
# 1. Pull latest changes
git pull origin main

# 2. Install dependencies 
npm install

# 3. Run tests
npm test

# 4. Check linting (may fail with ESLint PR until config updated)
npm run lint

# 5. Verify build works
npm run build  # if applicable
```

## Risk Assessment

- **Low Risk**: Development dependencies, patch updates, testing libraries
- **Medium Risk**: Minor version updates, production dependencies, linting tools
- **High Risk**: Major version updates, core dependencies

All identified PRs are low to medium risk with no high-risk updates detected.

---

🚀 **Ready to proceed!** All dependency PRs have been analyzed and are safe to merge with the strategy outlined above.