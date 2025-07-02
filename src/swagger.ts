import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import express, { Application } from 'express';

const options ={
    definition:{
        openapi: "3.0.0",
        info:{
            title: "Event Ticketing and Venue Booking System API",
            version: "1.0.0",
            description: "API documentation for the Event Ticketing and Venue Booking System"
        },
        servers:[
            {
                url: "http://localhost:3000/api",
                description: "Development server"
            }
        ]
    },
    apis:['./src/**/*.ts'], // Path to the API docs
}

const swaggerSpec = swaggerJSDoc(options);

export const swaggerSetup = (app:express.Application) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    
}
