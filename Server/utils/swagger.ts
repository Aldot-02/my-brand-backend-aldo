import { Express, Request, Response } from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Application } from 'express';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "My Brand Rest APIs",
      version: "1.0.0",
      description: 'API documentation for your RESTful APIs',
    },
    servers: [
      {
        url: 'https://my-brand-backend-aldo-1.onrender.com',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "apiKey",
          name: "Authorization",
          in: "header",
          description: "Bearer token authorization"
        },
      },
    },
  },
  apis: ["./dist/server.js", "./dist/Routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

function swaggerDocs(app: Application, port: number) {

  app.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
  );
  
  app.get("/docs.json", (req: Request, res: Response) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });

  console.log((`Swagger docs available at http://localhost:${port}/docs`));
}

export default swaggerDocs;