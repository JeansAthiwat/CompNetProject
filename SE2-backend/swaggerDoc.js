/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Registers a new user and returns a JWT token on successful registration.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User registered successfully and JWT token generated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "User registered successfully"
 *                 token:
 *                   type: string
 *                   example: "your_jwt_token_here"
 *       400:
 *         description: Validation errors or user already exists.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       msg:
 *                         type: string
 *                         example: "User already exists"
 *                       param:
 *                         type: string
 *                         example: "email"
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Server error"
 *                 err:
 *                   type: string
 *                   example: "Error message"
 * /auth/login:
 *   post:
 *     summary: User login
 *     description: Authenticates a user with email and password and returns a JWT token if successful.
 *     tags:
 *      - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email address.
 *                 example: "math.tutor@example.com"
 *               password:
 *                 type: string
 *                 description: The user's password.
 *                 example: "SecurePass123"
 *     responses:
 *       200:
 *         description: Successfully logged in and JWT token generated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Logged in successfully"
 *                 token:
 *                   type: string
 *                   example: "your_jwt_token_here"
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "user_id_here"
 *                     email:
 *                       type: string
 *                       example: "user@example.com"
 *                     role:
 *                       type: string
 *                       example: "learner"
 *                     profilePicture:
 *                       type: string
 *                       example: "/images/profile.jpg"
 *       400:
 *         description: Invalid credentials or login restrictions (e.g., Google users).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Invalid Credentials"
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Server error"
 */





/**
 * @swagger
 * /course:
 *   get:
 *     summary: Get all courses
 *     description: Retrieve a list of all courses.
 *     tags:
 *       - Course
 *     parameters:
 *       - in: query
 *         name: sort
 *         description: Field to sort by (e.g., title, date).
 *         required: false
 *         schema:
 *           type: string
 *           example: "title"
 *       - in: query
 *         name: select
 *         description: Comma-separated list of fields to select (e.g., title, description).
 *         required: false
 *         schema:
 *           type: string
 *           example: "title,description"
 *       - in: query
 *         name: page
 *         description: Page number for pagination.
 *         required: false
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         description: Number of courses per page.
 *         required: false
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: A list of courses with pagination and sorting.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 courses:
 *                   type: array
 *                   items:
 *                     type: object
 *                     $ref: '#/components/schemas/Course'
 *                 totalCourses:
 *                   type: integer
 *                   example: 100
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 totalPages:
 *                   type: integer
 *                   example: 10
 *       500:
 *         description: Internal server error.
 *   post:
 *     summary: Create a new course
 *     description: Add a new course with an optional supplementary file upload.
 *     tags:
 *       - Course
 *     security:
 *       - bearerAuth: []  # Assuming you use JWT for authentication
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             $ref: '#/components/schemas/Course'
 *     responses:
 *       201:
 *         description: Course successfully created.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/components/schemas/Course'
 *       400:
 *         description: Invalid input or missing required fields.
 *       500:
 *         description: Internal server error.
 * /course/{id}:
 *   get:
 *     summary: Get a course by ID
 *     description: Retrieve the details of a specific course by its ID.
 *     tags:
 *       - Course
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the course to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Course details retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/components/schemas/Course'
 *       400:
 *         description: Invalid course ID.
 *       404:
 *         description: Course not found.
 *       500:
 *         description: Internal server error.
 *   put:
 *     summary: Update a course
 *     description: Update the details of a specific course by its ID.
 *     tags:
 *       - Course
 *     security:
 *       - bearerAuth: []  # JWT required for authorization
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the course to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/Course'
 *               - type: object
 *                 not:
 *                   properties:
 *                     id: {}
 *     responses:
 *       200:
 *         description: Course updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/components/schemas/Course'
 *       400:
 *         description: Invalid course ID or request body.
 *       404:
 *         description: Course not found.
 *   delete:
 *     summary: Delete a course
 *     description: Delete a specific course by its ID.
 *     tags:
 *       - Course
 *     security:
 *       - bearerAuth: []  # JWT required for authorization
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the course to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Course deleted successfully.
 *       400:
 *         description: Invalid course ID.
 *       404:
 *         description: Course not found.
 * /course/tutor/{id}:
 *   get:
 *     summary: Get courses by their creator(tutor)
 *     description: Retrieve the details of a specific courses by their creator's ID.
 *     tags:
 *       - Course
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the tutor who created the courses.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Courses detail retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/components/schemas/Course'
 *       500:
 *         description: Internal server error.
 */




/**
 * @swagger
 * /user:
 *   get:
 *     summary: Retrieve all users
 *     description: Fetches a list of all users in the system.
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 *   post:
 *     summary: Create a new user
 *     description: Adds a new user to the system.
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request, invalid input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid input"
 * /user/{email}:
 *   get:
 *     summary: Retrieve user with email
 *     description: Fetches the user with the specified email.
 *     tags:
 *       - User
 *     parameters:
 *       - name: email
 *         in: path
 *         required: true
 *         description: The email of the user to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: '#/components/schemas/User'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 *   put:
 *     summary: Update a user
 *     description: Update the details of a specific user by their email.
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []  # JWT required for authorization
 *     parameters:
 *       - name: email
 *         in: path
 *         required: true
 *         description: The email of the course to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Course updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 *   delete:
 *     summary: Delete a user
 *     description: Delete a specific user by their email.
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []  # JWT required for authorization
 *     parameters:
 *       - name: email
 *         in: path
 *         required: true
 *         description: The email of the user to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /conversation:
 *   get:
 *     summary: Get all conversations of every user
 *     tags: [Conversations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of all conversations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Conversation'
 *       401:
 *         description: Unauthorized, user not authenticated
 *       403:
 *         description: Unauthorized, user not authenticated
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /conversation/user:
 *   get:
 *     summary: Get all conversations of the logged in user
 *     tags: [Conversations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: A list of all conversations for the logged in user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Conversation'
 *       401:
 *         description: Unauthorized, user not authenticated
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /conversation:
 *   post:
 *     summary: Create a new conversation
 *     tags: [Conversations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               participants:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of participant IDs (tutor & student)
 *               courseId:
 *                 type: string
 *                 description: The associated course ID (optional)
 *               lastMessage:
 *                 type: string
 *                 description: ID of the last message (optional)
 *     responses:
 *       201:
 *         description: Conversation created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Conversation'
 *       401:
 *         description: Unauthorized, user not authenticated
 */


/**
 * @swagger
 * /message/{conversationId}:
 *   get:
 *     summary: Get messages for a specific conversation
 *     tags: [Messages]
 *     parameters:
 *       - name: conversationId
 *         in: path
 *         required: true
 *         description: The conversation ID to retrieve messages for
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of messages in the specified conversation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Message'
 *       404:
 *         description: Conversation not found
 *       401:
 *         description: Unauthorized, user not authenticated
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /message:
 *   post:
 *     summary: Send a new message
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               conversationId:
 *                 type: string
 *                 description: The ID of the conversation the message belongs to
 *               sender:
 *                 type: string
 *                 description: The ID of the sender
 *               text:
 *                 type: string
 *                 description: The content of the message
 *     responses:
 *       201:
 *         description: Message sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 *       400:
 *         description: Bad request, invalid data
 *       401:
 *         description: Unauthorized, user not authenticated
 */