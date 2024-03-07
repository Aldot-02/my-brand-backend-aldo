import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "My Brand Rest APIs",
            version: "1.0.0",
            description: 'API documentation for your RESTful APIs',
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Development server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "apiKey",
                    name: "access_secret",
                    in: "header",
                    description: "Bearer token authorization"
                },
            },
        },
    },
    apis: ["./dist/server.js", "./dist/Routes/*.js"],
};
const swaggerSpec = swaggerJsdoc(options);
function swaggerDocs(app, port) {
    app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    app.get("/docs.json", (req, res) => {
        res.setHeader("Content-Type", "application/json");
        res.send(swaggerSpec);
    });
    console.log((`Swagger docs available at http://localhost:${port}/docs`));
}
export default swaggerDocs;
//# sourceMappingURL=swagger.js.map