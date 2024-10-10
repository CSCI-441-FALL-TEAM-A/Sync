# Sync

## Installation Instructions

To get started with the project, follow these steps:

1. Clone the repository:<br/>
   -`git clone https://github.com/CSCI-441-FALL-TEAM-A/Sync.git`<br/>
   -`cd Sync`
2. Install dependencies<br/>
   -`npm install`
3. To run the server in develop mode using nodemon<br/>
   -`npm run dev`
4. To run the server in production mode<br/>
   -`npm start`

## Dependenencies:<br/>

  express: a minimal and flexible Node.js web application framework.<br/>
  sqlite3: for interacting with an SQLite database<br/>
  dotenv: for managing environment variables<br/>
  pg: PostgreSQL client for Node.js<br/>

## Development Dependencies<br/>

  nodemon: a tool that helps develop Node.js applications by automatically restarting the server when it sees a file change.<br/>


## User Type Management<br/>

Operations to manage user types in the Sync system, including creating, reading, updating, and deleting user types.<br/>
   -Endpoint: `/api/user-types/:name`<br/>
   -Method: `GET`<br/>
   -Description: Gets the details of the user type by name.<br/>
   -Example Request: `curl http://localhost:3000/api/user-types/Groupie`<br/>
   -Successful Response: `{
  "id": 1,
  "name": "Groupie",
  "created_at": "2023-01-01T00:00:00.000Z",
  "updated_at": "2023-01-01T00:00:00.000Z",
  "deleted_at": null
}`<br/>

   -EndPoint: `/api/user-types`<br/>
   -Method: `POST`<br/>
   -Description: Posts a new user type.<br/>
   -Example Request: `curl -X POST http://localhost:3000/api/user-types \
-H "Content-Type: application/json" \
-d '{"name": "SuperAdmin"}'`<br/>
   -Successful Response: `{
  "message": "User type 'SuperAdmin' created successfully."
}`<br/>

   -EndPoint: `/api/user-types/:name`<br/>
   -Method: `PUT`<br/>
   -Description: Update a usr type.<br/>
   -Example Request: `curl -X PUT http://localhost:3000/api/user-types/Groupie \
-H "Content-Type: application/json" \
-d '{"newName": "Admin"}'`<br/>
   -Successful Response: `{
  "message": "User type 'Groupie' updated to 'Admin'."
}`

   -EndPoint: `/api/user-trypes/:name`<br/>
   -Method: `DELETE`<br/>
   -Description: Soft delete a user type by setting the deleted_at timestamp<br/>
   -Example Request: `curl -X DELETE http://localhost:3000/api/user-types/Groupie`<br/>
   -Successful Response: `{
  "message": "User type 'Groupie' successfully deleted."
}`
