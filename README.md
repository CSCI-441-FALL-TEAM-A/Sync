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
   -Description: Update a user type.<br/>
   -Example Request: `curl -X PUT http://localhost:3000/api/user-types -H "Content-Type: application/json" -d '{"currentName": "SuperAdmin", "newName": "AdminADMIN"}'
'`<br/>
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

## Location Management<br/>

Operations to manager locations in the Sync system, including creating, reading, updating, and deleting locations.<br/>
   -Endpoint: `/api/locations/:id`<br/>
   -Method: `GET`<br/>
   -Description: Gets the details of the location by id.<br/>
   -Example Request: `curl http://localhost:3000/api/locations/3`<br/>
   -Successful Response: `{
  "id": 3,
  "city": "Knoxville",
  "state": "Tennessee",
  "created_at": "2023-01-01T00:00:00.000Z",
  "updated_at": "2023-01-01T00:00:00.000Z",
  "deleted_at": null
}`<br/>

   -EndPoint: `/api/locations/create`<br/>
   -Method: `POST`<br/>
   -Description: Posts a new location.<br/>
   -Example Request: `curl -X POST http://localhost:3000/api/locations/create \
-H "Content-Type: application/json" \
-d '{"city": "Kansas City", "state": "Missouri"}'`<br/>
   -Successful Response: `{
  "message": "Location created successfully.",
  "location": {
    "id": 4,
    "city": "Kansas City",
    "state": "Missouri",
    "created_at": "2023-01-01T00:00:00.000Z",
    "updated_at": "2023-01-01T00:00:00.000Z"
  }
}`<br/>

   -EndPoint: `/api/locations/:id`<br/>
   -Method: `PUT`<br/>
   -Description: Update a location.<br/>
   -Example Request: `curl -X PUT http://localhost:3000/api/locations/3 \
-H "Content-Type: application/json" \
-d '{"city": "Nashville", "state": "Tennessee"}''`<br/>
   -Successful Response: `{
  "message": "Location updated successfully."
}`<br/>

-EndPoint: `/api/locations/:id`<br/>
   -Method: `DELETE`<br/>
   -Description: Soft delete a location by setting the deleted_at timestamp<br/>
   -Example Request: `curl -X DELETE http://localhost:3000/api/locations/3`<br/>
   -Successful Response: `{
  "message": "Location id '3' successfully deleted."
}`

## Proficiency Level Management<br/>
Operations to manager proficiencys in the Sync system, including creating, reading, updating, and deleting locations.<br/>
   -Endpoint: `/api/proficiency-levels/:name`<br/>
   -Method: `GET`<br/>
   -Description: Gets the details of the location by name.<br/>
   -Example Request: `curl -X GET http://localhost:3000/api/proficiency-levels/Novice`<br/>
   -Successful Response: `{"id":"1","name":"Novice","created_at":"2024-10-12T00:54:37.613Z","updated_at":"2024-10-12T00:54:37.613Z","deleted_at":null}%`<br/>

   -EndPoint: `/api/proficiency-levels/create`<br/>
   -Method: `POST`<br/>
   -Description: Posts a new proficiency level.<br/>
   -Example Request: `curl -X POST http://localhost:3000/api/proficiency-levels/ \
-H "Content-Type: application/json" \
-d '{"name": "Expert"}'`<br/>
   -Successful Response: `{"message":"Proficiency level created successfully"}`<br/>

   -EndPoint: `/api/proficiency-levels/`<br/>
   -Method: `PUT`<br/>
   -Description: Update a proficiency level.<br/>
   -Example Request: `curl -X PUT http://localhost:3000/api/proficiency-levels \
-H "Content-Type: application/json" \
-d '{"currentName": "Novice", "newName": "Beginner"}'`<br/>
   -Successful Response: `{"message":"Proficiency level updated from Beginner to Novice"}`

   -EndPoint: `/api/proficiency-levels/:name`<br/>
   -Method: `DELETE`<br/>
   -Description: Soft delete a roficiency levels by setting the deleted_at timestamp<br/>
   -Example Request: `curl -X DELETE http://localhost:3000/api/proficiency-levels/Expert`<br/>
   -Successful Response: `{"message":"Proficiency level 'Expert' successfully deleted."}`
