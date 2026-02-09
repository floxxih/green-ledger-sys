/**
 * ESLint rule to detect usage of deprecated legacy API
 * @type {import('eslint').Rule.RuleModule}
 */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Disallow usage of deprecated legacy API functions',
      category: 'Best Practices',
      recommended: true,
    },
    fixable: 'code',
    schema: [],
    messages: {
      deprecatedMintNFT:
        "'mintNFT' is deprecated. Use 'buildMintNFTOptions' instead. See docs/migration-guide-legacy-api.md",
      deprecatedCreateCollection:
        "'createCollection' is deprecated. Use 'buildCreateCollectionOptions' instead. See docs/migration-guide-legacy-api.md",
    },
  },

  create(context) {
    return {
      // Check for direct function calls
      CallExpression(node) {
        if (node.callee.type === 'Identifier') {
          const functionName = node.callee.name;
          
          if (functionName === 'mintNFT') {
            context.report({
              node,
              messageId: 'deprecatedMintNFT',
            });
          }
          
          if (functionName === 'createCollection') {
            context.report({
              node,
              messageId: 'deprecatedCreateCollection',
            });
          }
        }
      },

      // Check for imports
      ImportDeclaration(node) {
        if (node.source.value === '@/lib/contracts' || 
            node.source.value === './contracts' ||
            node.source.value.endsWith('/contracts')) {
          
          node.specifiers.forEach((specifier) => {
            if (specifier.type === 'ImportSpecifier') {
              const importedName = specifier.imported.name;
              
              if (importedName === 'mintNFT') {
                context.report({
                  node: specifier,
                  messageId: 'deprecatedMintNFT',
                });
              }
              
              if (importedName === 'createCollection') {
                context.report({
                  node: specifier,
                  messageId: 'deprecatedCreateCollection',
                });
              }
            }
          });
        }
      },
    };
  },
};
