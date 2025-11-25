import swaggerJSDoc from 'swagger-jsdoc'

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'WidgetDock App',
            version: '1.0.0',
            description: 'API and page routes for WidgetDock (JSON APIs and HTML pages)',
        },
    },
    apis: [
        'src/routes/*.ts', // paths to files containing Swagger comments
    ],
}

export const swaggerSpec = swaggerJSDoc(options)
