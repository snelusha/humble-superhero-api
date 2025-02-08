## API Endpoints

### GET /superheroes

- **Purpose:** Retrieve a list of superheroes sorted by humility score (highest first).
- **Usage:** `GET http://localhost:4000/superheroes`

### POST /superheroes

- **Purpose:** Add a new superhero.
- **Usage:** `POST http://localhost:4000/superheroes`
- **Example Body:**
  ```json
  {
    "name": "Batman",
    "superpower": "Detective skills",
    "humilityScore": 9
  }
  ```

### PATCH /superheroes/:name

- **Purpose**: Update details of an existing superhero.
- **Usage**: PATCH `http://localhost:4000/superheroes/Batman`
- **Example Body**:
  ```json
  {
    "humilityScore": 7
  }
  ```

### DELETE /superheroes/:name

- **Purpose**: Remove a superhero.
- **Usage**: DELETE `http://localhost:4000/superheroes/Batman`

### GET /superheroes/ws

- **Purpose**: Open a WebSocket connection for real-time updates.
- **Usage**: Connect to `ws://localhost:4000/superheroes/ws`

## Running the Server and Client

This project is split into two main directories: `server` and `client`.

### Server

```bash
git clone https://github.com/snelusha/humble-superhero-api
cd humble-superhero-api
```

Navigate to the server directory

```bash
cd server
```

Install server dependencies

```bash
bun install
# or
npm install
```

Run the server

```bash
bun run test
# or
npm run test
```

Start the server

```bash
bun run dev
# or
npm run dev
```

The server will run at [http://localhost:4000](http://localhost:4000)

### Client

Navigate to the client directory
in a new terminal window, run

```bash
cd client
```

Install client dependencies

```bash
bun install
# or
npm install
```

Start the client

```bash
bun run dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the interface.

### Technical Skills

- **Code Quality & Simplicity:**

  I used Hono to handle HTTP requests and Zod for input validation. The code is clean and structured with each endpoint clearly defined and proper error handling implemented.

- **Functionality:**

  Besides the basic GET and POST endpoints, I also added PATCH and DELETE endpoints. This means you can update or remove superheroes too, making the API more flexible.

  I setup a WebSocket connection so that any changes whether it’s creating, updating, or deleting a superhero—are instantly pushed out to connected clients.

- **Validation**

  The API uses Zod schemas to ensure the data meets the requirements. This prevents invalid data from entering the system.

### Team Player Attitude

I love collaborating with others! If I were collaborating with a teammate on this project, we would start by pair programming to review the current implementation and brainstorm enhancements. We would discuss ideas like integrating persistent storage, improving security with authentication, or refining the real time updates through WebSockets. Code reviews and open feedback sessions would help ensure our code remains clean. I am excuted to share ideas, learn from others and build on our collective strengths to make this project even better.

### Eagerness to Learn

If I had more time:

I am really happy with what I have built so far, but I have plenty of ideas on how to take it even further:

- **Persistent Storage:**  
  Replace the in-memory array with a database (PostgreSQL or MongoDB) so the data persists across server restarts.

- **Enhanced Security:**  
  Add authentication and authorization to secure the API endpoints.

- **Expanded Testing:**  
  Increase test coverage with more comprehensive unit and integration tests using Jest.

- **Performance Optimizations:**  
  Fine tune the WebSocket handling and overall API performance to support more concurrent connections.

- **Frontend Improvements:**  
  Enhance the Next.js interface with improved accessibility and a more polished UI.

### Humility and Communication

I believe that clear, honest communication is key to building great software. In this project, I've included detailed comments and thorough documentation in the README to explain my thought process, design choices, and how everything works. This transparency not only makes the code more accessible to others but also demonstrates my commitment to continuous improvement through feedback. I’m always open to suggestions and eager to learn, so please feel free to share any ideas or insights that could help make this project even better.
