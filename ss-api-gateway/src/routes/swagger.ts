import { Express } from 'express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const swaggerDocument = YAML.load(path.join(__dirname, '../../swagger.yml'));

export function swaggerRoute(app: Express) {
    /**
     * Swagger UI route.
     * Serves the Swagger UI documentation for the API.
     */
    app.use('/swagger-ui', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}