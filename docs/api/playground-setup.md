# Interactive API Playground

Set up an interactive API playground using Swagger UI for testing AuroraMint APIs.

## Installation

```bash
npm install swagger-ui-express --save
```

## Express.js Setup

Create a file `server/swagger.js`:

```javascript
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');

// Load the OpenAPI spec
const swaggerDocument = YAML.load(path.join(__dirname, '../docs/api/openapi.yaml'));

module.exports = {
  swaggerUi,
  swaggerDocument,
  swaggerOptions: {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: "AuroraMint API Documentation",
  }
};
```

Add to your Express app (`server/index.js`):

```javascript
const express = require('express');
const { swaggerUi, swaggerDocument, swaggerOptions } = require('./swagger');

const app = express();

// Serve Swagger UI
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, swaggerOptions)
);

// Your other routes
app.get('/api/v1/health', (req, res) => {
  res.json({ status: 'healthy' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API Docs available at http://localhost:${PORT}/api-docs`);
});
```

## Next.js Setup

For Next.js applications, create `pages/api/docs.ts`:

```typescript
import { NextApiRequest, NextApiResponse } from 'next';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';

const swaggerDocument = YAML.load(
  path.join(process.cwd(), 'docs/api/openapi.yaml')
);

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // Serve the Swagger UI HTML
    const html = swaggerUi.generateHTML(swaggerDocument);
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
```

## Docker Setup

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  swagger-ui:
    image: swaggerapi/swagger-ui
    ports:
      - "8080:8080"
    volumes:
      - ./docs/api/openapi.yaml:/usr/share/nginx/html/openapi.yaml
    environment:
      SWAGGER_JSON: /usr/share/nginx/html/openapi.yaml
```

Run with:

```bash
docker-compose up swagger-ui
```

Access at: `http://localhost:8080`

## Standalone HTML Setup

Create `docs/api/index.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AuroraMint API Documentation</title>
  <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
  <style>
    body {
      margin: 0;
      padding: 0;
    }
  </style>
</head>
<body>
  <div id="swagger-ui"></div>
  
  <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
  <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-standalone-preset.js"></script>
  <script>
    window.onload = function() {
      const ui = SwaggerUIBundle({
        url: "./openapi.yaml",
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset
        ],
        plugins: [
          SwaggerUIBundle.plugins.DownloadUrl
        ],
        layout: "StandaloneLayout"
      });
      
      window.ui = ui;
    };
  </script>
</body>
</html>
```

## Testing API Calls

### Using the Playground

1. Navigate to your API docs URL (e.g., `http://localhost:3000/api-docs`)
2. Click "Authorize" button
3. Enter your JWT token
4. Try out different endpoints

### Example: Testing NFT Mint

1. Expand the `POST /nft/mint` endpoint
2. Click "Try it out"
3. Fill in the request body:

```json
{
  "collectionId": "SP2X0TZ59D5SZ8ACQ6YMCHHNR2ZN51Z32E2CJ173.stacksmint-collection-v2-1-3",
  "recipient": "SP2X0TZ59D5SZ8ACQ6YMCHHNR2ZN51Z32E2CJ173",
  "metadata": {
    "name": "Test NFT",
    "description": "Testing the API",
    "image": "ipfs://QmTest",
    "attributes": []
  }
}
```

4. Click "Execute"
5. View the response

## Customization

### Custom Theme

Add custom CSS to match your branding:

```javascript
const customCss = `
  .swagger-ui .topbar { 
    background-color: #6366f1; 
  }
  .swagger-ui .info .title {
    color: #6366f1;
  }
  .swagger-ui .opblock.opblock-post {
    border-color: #10b981;
    background: rgba(16, 185, 129, 0.1);
  }
  .swagger-ui .opblock.opblock-get {
    border-color: #3b82f6;
    background: rgba(59, 130, 246, 0.1);
  }
`;

app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    customCss,
    customSiteTitle: "AuroraMint API",
    customfavIcon: "/favicon.ico"
  })
);
```

### Add Request Interceptor

Automatically add headers to all requests:

```html
<script>
  window.onload = function() {
    const ui = SwaggerUIBundle({
      url: "./openapi.yaml",
      dom_id: '#swagger-ui',
      requestInterceptor: (request) => {
        // Add custom headers
        request.headers['X-API-Version'] = 'v1';
        return request;
      },
      // ... other config
    });
  };
</script>
```

## Deployment

### Vercel

Add to `vercel.json`:

```json
{
  "rewrites": [
    {
      "source": "/api-docs",
      "destination": "/api/docs"
    }
  ]
}
```

### Netlify

Create `netlify.toml`:

```toml
[[redirects]]
  from = "/api-docs"
  to = "/docs/api/index.html"
  status = 200
```

## Security Considerations

1. **Rate Limiting**: Implement rate limiting for API docs endpoint
2. **Authentication**: Consider password-protecting docs in production
3. **CORS**: Configure CORS properly for the docs endpoint
4. **Environment Variables**: Don't expose production URLs in public docs

Example with basic auth:

```javascript
const basicAuth = require('express-basic-auth');

app.use(
  '/api-docs',
  basicAuth({
    users: { 'admin': process.env.DOCS_PASSWORD },
    challenge: true,
  }),
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument)
);
```

## Additional Features

### Add Code Generation

Users can generate client SDKs directly from the docs:

```yaml
# In openapi.yaml
x-codegen:
  languages:
    - typescript
    - python
    - javascript
```

### Add Try-Me Links

Link to live examples:

```yaml
paths:
  /nft/mint:
    post:
      # ... endpoint definition
      externalDocs:
        description: Try this in our live demo
        url: https://demo.auroramint.io/mint
```

## Troubleshooting

### YAML Loading Issues

```bash
npm install js-yaml
```

### CORS Errors

```javascript
const cors = require('cors');
app.use('/api-docs', cors());
```

### Missing Schemas

Ensure all `$ref` references in OpenAPI spec are valid:

```bash
npx swagger-cli validate docs/api/openapi.yaml
```
