# Migration Guide: Legacy API Removal

## Overview

The legacy API functions have been deprecated and will be removed in v2.0.0. This guide helps you migrate to the new API.

## Deprecated Functions

### `mintNFT(uri: string)` → `buildMintNFTOptions({ uri: string })`

**Old:**
```typescript
import { mintNFT } from '@/lib/contracts';

const result = await mintNFT('ipfs://QmHash...');
```

**New:**
```typescript
import { buildMintNFTOptions } from '@/lib/contracts';
import { openContractCall } from '@stacks/connect';

const options = buildMintNFTOptions({ uri: 'ipfs://QmHash...' });
await openContractCall(options);
```

### `createCollection(name: string, maxSupply: number)` → `buildCreateCollectionOptions({ name: string, maxSupply: number })`

**Old:**
```typescript
import { createCollection } from '@/lib/contracts';

const result = await createCollection('My Collection', 1000);
```

**New:**
```typescript
import { buildCreateCollectionOptions } from '@/lib/contracts';
import { openContractCall } from '@stacks/connect';

const options = buildCreateCollectionOptions({ 
  name: 'My Collection', 
  maxSupply: 1000 
});
await openContractCall(options);
```

## Timeline

- **v1.5.0** (Current): Functions deprecated with console warnings
- **v1.6.0** (Next): Functions marked with `@deprecated` JSDoc
- **v2.0.0** (Future): Functions removed entirely

## Benefits of New API

1. **More Flexibility**: Pass options objects with optional parameters
2. **Better Type Safety**: Full TypeScript support
3. **Consistent Pattern**: Aligns with other Stacks.js patterns
4. **Future-Proof**: Easier to extend with new parameters

## Breaking Changes

The new API requires you to use `openContractCall` directly instead of the old functions returning pre-configured calls.

## Need Help?

- Check the [API Documentation](./api/README.md)
- Review [Code Examples](./api/examples.md)
- Open an issue on GitHub

---

**Last Updated:** 2024-02-09
**Target Removal:** v2.0.0
