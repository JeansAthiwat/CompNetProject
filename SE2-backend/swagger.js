import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import 'dotenv/config';

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "TEWME API",
      version: "1.0.0",
      description: "API documentation for TEWME education platform",
    },
    components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
        schemas: {
          User: {
            type: "object",
            properties: {
                id: {
                    type: "string",
                    example: "6603f2e3c9b7a9a7aeb47c12", // MongoDB ObjectId example
                },
                email: {
                    type: "string",
                    format: "email",
                    example: "john@example.com",
                },
                password: {
                    type: "string",
                    description: "Hashed password, required for non-Google users",
                    example: "$2b$10$abcdef1234567890",
                },
                isGoogleUser: {
                    type: "boolean",
                    description: "Flag to check if the user is from Google OAuth",
                    example: true,
                },
                firstname: {
                    type: "string",
                    example: "John",
                },
                lastname: {
                    type: "string",
                    example: "Doe",
                },
                birthdate: {
                    type: "string",
                    format: "date",
                    example: "1990-01-01",
                },
                role: {
                    type: "string",
                    enum: ["learner", "tutor", "admin", "google_user"],
                    example: "tutor",
                },
                profilePicture: {
                    type: "string",
                    format: "uri",
                    example: "https://example.com/profile.jpg",
                },
                phone: {
                    type: "string",
                    example: "+66123456789",
                },
                bio: {
                    type: "string",
                    example: "Passionate tutor in mathematics.",
                },
                balance: {
                    type: "number",
                    format: "float",
                    example: 100.50,
                },
                learning_style: {
                    type: "array",
                    items: { type: "string" },
                    example: ["Visual", "Auditory"],
                },
                interest: {
                    type: "array",
                    items: { type: "string" },
                    example: ["Machine Learning", "Mathematics"],
                },
                teaching_style: {
                    type: "array",
                    items: { type: "string" },
                    example: ["Interactive", "Hands-on"],
                },
                educations: {
                    type: "array",
                    items: { type: "string" },
                    example: ["B.Sc. Computer Science", "M.Ed. Teaching"],
                },
                specialization: {
                    type: "array",
                    items: { type: "string" },
                    example: ["Data Science", "Physics"],
                },
                verification_status: {
                    type: "boolean",
                    example: true,
                },
                createdAt: {
                    type: "string",
                    format: "date-time",
                    example: "2024-03-20T12:00:00Z",
                },
                updatedAt: {
                    type: "string",
                    format: "date-time",
                    example: "2024-03-21T14:30:00Z",
                },
            },
            required: ["id", "email", "role"],
          },
          Course: {
            type: "object",
            properties: {
              id: {
                type: "string",
                example: "6603f2e3c9b7a9a7aeb47c12"
              },
              tutor: {
                type: "string",
                description: "Reference to the tutor (User ID)",
                example: "6603f2e3c9b7a9a7aeb47c10"
              },
              course_name: {
                type: "string",
                maxLength: 64,
                example: "Introduction to Machine Learning"
              },
              subject: {
                type: "string",
                maxLength: 128,
                example: "Computer Science"
              },
              course_description: {
                type: "string",
                maxLength: 1024,
                example: "A beginner-friendly course covering ML fundamentals."
              },
              price: {
                type: "number",
                format: "float",
                minimum: 0,
                maximum: 99999999.99,
                example: 99.99
              },
              course_length: {
                type: "number",
                format: "float",
                minimum: 0,
                maximum: 999.99,
                example: 10.5
              },
              course_capacity: {
                type: "integer",
                minimum: 1,
                example: 50
              },
              session_status: {
                type: "string",
                enum: ["Schedule", "Ongoing", "Closed", "TutorConfirm"],
                example: "Ongoing"
              },
              created_date: {
                type: "string",
                format: "date-time",
                example: "2024-03-20T12:00:00Z"
              },
              is_publish: {
                type: "boolean",
                example: true
              },
              course_type: {
                type: "string",
                enum: ["Live", "Video"],
                example: "Live"
              },
              t_email: {
                type: "string",
                format: "email",
                example: "tutor@example.com"
              },
              tags: {
                type: "array",
                items: {
                  type: "string"
                },
                example: ["Math", "AI"]
              },
              live_detail: {
                type: "object",
                properties: {
                  location: {
                    type: "string",
                    example: "Online"
                  },
                  start_time: {
                    type: "string",
                    format: "date-time",
                    example: "2024-03-25T09:00:00Z"
                  }
                }
              },
              videos: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    video_id: {
                      type: "string",
                      example: "abc123"
                    },
                    video_title: {
                      type: "string",
                      example: "Introduction to Python"
                    },
                    video_urls: {
                      type: "string",
                      format: "uri",
                      example: "https://example.com/video.mp4"
                    },
                    created_date: {
                      type: "string",
                      format: "date-time",
                      example: "2024-03-20T12:00:00Z"
                    }
                  }
                }
              },
              supplementary_file: {
                type: "object",
                properties: {
                  data: {
                    type: "string",
                    format: "binary"
                  },
                  contentType: {
                    type: "string",
                    example: "application/pdf"
                  },
                  fileName: {
                    type: "string",
                    example: "syllabus.pdf"
                  }
                }
              },
              ratings: {
                type: "object",
                properties: {
                  average: {
                    type: "number",
                    format: "float",
                    example: 4.5
                  },
                  totalReviews: {
                    type: "integer",
                    example: 200
                  }
                }
              },
              course_profile: {
                type: "string",
                format: "uri",
                example: "https://d138zd1ktt9iqe.cloudfront.net/media/seo_landing_files/file-teaching-skills-1605625101.jpg"
              }
            },
            required: [
              "tutor",
              "course_name",
              "price",
              "course_length",
              "course_capacity",
              "session_status",
              "is_publish",
              "course_type",
              "t_email"
            ]
          },
          "Conversation": {
            "type": "object",
            "required": [
              "participants",
              "lastMessage"
            ],
            "properties": {
              "_id": {
                "type": "string",
                "description": "The unique identifier for the conversation"
              },
              "participants": {
                "type": "array",
                "items": {
                  "type": "string",
                  "description": "The IDs of the participants (Tutor & Student)"
                }
              },
              "courseId": {
                "type": "string",
                "description": "The ID of the course associated with the conversation (optional)"
              },
              "lastMessage": {
                "type": "string",
                "description": "The ID of the last message in the conversation"
              },
              "createdAt": {
                "type": "string",
                "format": "date-time",
                "description": "The timestamp when the conversation was created"
              },
              "updatedAt": {
                "type": "string",
                "format": "date-time",
                "description": "The timestamp when the conversation was last updated"
              }
            }
          },
          "Message": {
            "type": "object",
            "required": [
              "conversationId",
              "sender",
              "text"
            ],
            "properties": {
              "_id": {
                "type": "string",
                "description": "The unique identifier for the message"
              },
              "conversationId": {
                "type": "string",
                "description": "The ID of the associated conversation"
              },
              "sender": {
                "type": "string",
                "description": "The ID of the sender of the message"
              },
              "text": {
                "type": "string",
                "description": "The content of the message"
              },
              "createdAt": {
                "type": "string",
                "format": "date-time",
                "description": "The timestamp when the message was created"
              },
              "updatedAt": {
                "type": "string",
                "format": "date-time",
                "description": "The timestamp when the message was last updated"
              }
            }
          }
        },
      },
    security: [
        {
          bearerAuth: [],
        },
    ],
    servers: [{ url: `http://localhost:${process.env.PORT}` }], // Update with your backend URL
  },
  apis: ["./swaggerDoc.js"], // Path to API route files
};

const swaggerSpec = swaggerJsdoc(options);

const setupSwagger = (app) => {
  if (process.env.NODE_ENV !== "production") {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    console.log(`📕 Swagger Docs enabled at http://localhost:${process.env.PORT}/api-docs`);
  }
};

export default setupSwagger;