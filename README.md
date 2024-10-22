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

## Git flow

The team procedures for git:

1. Pull main into your main branch:<br/>
   -`git checkout main`<br/>
   -`git pull origin main`<br/>
2. Make a branch off of main with the following template, using that to seperate pull request<br/>
   -Backend:`git checkout -b backend/[your feature information here]`
   -Frontend:`git checkout -b frontend/[your feature information here]`
   -Tests:`git checkout -b tests/[your feature information here]`
   -Infrastucture:`git checkout -b infra/[your feature information here]`
3. When you are ready to push up your code:<br/>
   -`git status` To see what files you have changed<br/>
   -`git diff [filename[` Check the differences in your files from main<br/>
   -`git add [file names, files names, etc]` Try to do one file at a time while checking the diff, will cut down on errors<br/>
   -`git commit -m "Your Message Here, try to be descriptive about what it does"` Commit message to inform what pull request does<br/>
   -`git push [your branch name]` Please make sure this is your branch name<br/>
4. At this point message the team on Discord you need a Pull Request Reviewed, and they will pull it down and check it.
   
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

Operations to manage locations in the Sync system, including creating, reading, updating, and deleting locations.<br/>
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

## Match Management<br/>

Operations to manage matches in the Sync system, including creating, reading, updating, and deleting matches.<br/>
   -Endpoint: `/api/matches/:id`<br/> 
   -Method: `GET`<br/>
   -Description: Gets the details of the match by id.<br/>
   -Example Request: `curl http://localhost:3000/api/matches/3`<br/>
   -Successful Response: `{
  "id": 3,
  "user_id_one":"1",
  "user_id_two":"2",
  "status":0,
  "created_at": "2023-01-01T00:00:00.000Z",
  "updated_at": "2023-01-01T00:00:00.000Z",
  "deleted_at": null
}`<br/>

   -EndPoint: `/api/matches/create`<br/>
   -Method: `POST`<br/>
   -Description: Posts a new match.<br/>
   -Example Request: `curl -X POST http://localhost:3000/api/matches/create \
-H "Content-Type: application/json" \
-d '{"user_id_one": 1, "user_id_two": 2, "status": 0}'`<br/>
   -Successful Response: `{
  "message": "Match created successfully.",
  "match": {
    "id": "3",
    "user_id_one": "1",
    "user_id_two": "2",
    "status": 0,
    "created_at": "2023-01-01T00:00:00.000Z",
    "updated_at": "2023-01-01T00:00:00.000Z"
  }
}`<br/>

   -EndPoint: `/api/matches/:id`<br/>
   -Method: `PUT`<br/>
   -Description: Update a match.<br/>
   -Example Request: `curl -X PUT http://localhost:3000/api/matches/1 \
-H "Content-Type: application/json" \
-d '{"status": 1}''`<br/>
   -Successful Response: `{
  "message": "Match updated successfully."
  "match": {
   "id":"1",
   "user_id_one":"1",
   "user_id_two":"2",
   "status":1,
   "created_at":"2023-01-01T00:00:00.000Z",
   "updated_at":"2023-01-01T00:00:00.000Z",
   "deleted_at":null
  }
}`<br/>

-EndPoint: `/api/matches/:id`<br/>
   -Method: `DELETE`<br/>
   -Description: Soft delete a match by setting the deleted_at timestamp<br/>
   -Example Request: `curl -X DELETE http://localhost:3000/api/matches/3`<br/>
   -Successful Response: `{
  "message": "Match id '3' successfully deleted."
}`

## Instrument Management<br/>

Operations to manage instruments in the Sync system, including creating, reading, updating, and deleting instruments.<br/>
   -Endpoint: `/api/instruments/:id`<br/> 
   -Method: `GET`<br/>
   -Description: Gets the details of the instrument by id.<br/>
   -Example Request: `curl http://localhost:3000/api/instruments/1`<br/>
   -Successful Response: `{
   "id": 1,
   "name":"Guitar",
   "created_at": "2023-01-01T00:00:00.000Z",
   "updated_at": "2023-01-01T00:00:00.000Z",
   "deleted_at": null
}`<br/>

   -EndPoint: `/api/instruments/create`<br/>
   -Method: `POST`<br/>
   -Description: Posts a new instrument.<br/>
   -Example Request: `curl -X POST http://localhost:3000/api/instruments/create \
-H "Content-Type: application/json" \
-d '{"name": "Guitar"}'`<br/>
   -Successful Response: `{
   "id": "1",
   "name":"Guitar",
   "created_at": "2023-01-01T00:00:00.000Z",
   "updated_at": "2023-01-01T00:00:00.000Z",
   "deleted_at":null
}`<br/>

   -EndPoint: `/api/instruments/:id`<br/>
   -Method: `PUT`<br/>
   -Description: Update an existing instrument.<br/>
   -Example Request: `curl -X PUT http://localhost:3000/api/instruments/4 \
-H "Content-Type: application/json" \
-d '{"name": "Tamborine"}''`<br/>
   -Successful Response: `{
    "id":4,
    "name":"Tamborine",
    "created_at": "2023-01-01T00:00:00.000Z",
    "updated_at": "2023-01-01T00:00:00.000Z",
    "deleted_at":null
}`<br/>

-EndPoint: `/api/instruments/:id`<br/>
   -Method: `DELETE`<br/>
   -Description: Soft delete a location by setting the deleted_at timestamp<br/>
   -Example Request: `curl -X DELETE http://localhost:3000/api/instruments/4`<br/>
   -Successful Response: `{
   "message": "Instrument soft deleted successfully",
   "deletedInstrument":{
      "id": 4,
      "name": "Tamborine",
      "created_at": "2023-01-01T00:00:00.000Z",
      "updated_at": "2023-01-01T00:00:00.000Z",
      "deleted_at": "2024-01-01T00:00:00.000Z"
   }
}`

## Proficiency Level Management<br/>
Operations to manager proficiencys in the Sync system, including creating, reading, updating, and deleting locations.<br/>
   -Endpoint: `/api/proficiency-levels/:name`<br/>
   -Method: `GET`<br/>
   -Description: Gets the details of the proficiency level by name.<br/>
   -Example Request: `curl -X GET http://localhost:3000/api/proficiency-levels/Novice`<br/>
   -Successful Response: `{"id":"1","name":"Novice","created_at":"2024-10-12T00:54:37.613Z","updated_at":"2024-10-12T00:54:37.613Z","deleted_at":null}`<br/>

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
   -Description: Soft delete a proficiency levels by setting the deleted_at timestamp<br/>
   -Example Request: `curl -X DELETE http://localhost:3000/api/proficiency-levels/Expert`<br/>
   -Successful Response: `{"message":"Proficiency level 'Expert' successfully deleted."}`

## Genre Management<br/>
Operations to manager genres in the Sync system, including creating, reading, updating, and deleting locations.<br/>
   -Endpoint: `/api/genres/:name`<br/>
   -Method: `GET`<br/>
   -Description: Gets the details of the genre by name.<br/>
   -Example Request: `curl -X GET http://localhost:3000/api/genres/Rock`<br/>
   -Successful Response: `{"id":"1","name":"Rock","created_at":"2024-10-17T02:34:31.092Z","updated_at":"2024-10-17T02:34:31.092Z","deleted_at":null}`<br/>
   
   -EndPoint: `/api/genre/create`<br/>
   -Method: `POST`<br/>
   -Description: Posts a new genre.<br/>
   -Example Request: `curl -X POST http://localhost:3000/api/genres/ \
-H "Content-Type: application/json" \
-d '{"name": "Pop"}'`<br/>
   -Successful Response: `{"message":"Genre created successfully"}`<br/>

   -EndPoint: `/api/genres/`<br/>
   -Method: `PUT`<br/>
   -Description: Update a proficiency level.<br/>
   -Example Request: `curl -X PUT http://localhost:3000/api/genres \
-H "Content-Type: application/json" \
-d '{"currentName": "EDM", "newName": "Techno"}'`<br/>
   -Successful Response: `{"message":"Genre updated from EDM to Techno"}`

   
   -EndPoint: `/api/genres/:name`<br/>
   -Method: `DELETE`<br/>
   -Description: Soft delete a genres by setting the deleted_at timestamp<br/>
   -Example Request: `curl -X DELETE http://localhost:3000/api/genres/Techno`<br/>
   -Successful Response: `{"message":"Genre 'Techno' successfully deleted."}`

## User Management<br/>
Operations to manager users in the Sync system, including creating, reading, updating, and deleting locations.<br/>
   -Endpoint: `/api/users/:id`<br/>
   -Method: `GET`<br/>
   -Description: Gets the details of the user by id.<br/>
   -Example Request: `curl http://localhost:3000/api/users/3`<br/>
   -Successful Response: `{"id":"7","email":"testmusician5@example.com","password":"hashedpassword","first_name":"John","last_name":"Musican","birthdate":"1990-01-01T06:00:00.000Z","user_type":2,"created_at":"2024-10-19T00:45:49.238Z","updated_at":"2024-10-19T00:45:49.238Z","deleted_at":null}`<br/>
   
   -EndPoint: `/api/users/create`<br/>
   -Method: `POST`<br/>
   -Description: Posts a new user.<br/>
   -Example Request: `curl -X POST http://localhost:3000/api/genres/ \
-H "Content-Type: application/json" \
-d '{"name": "Pop"}'`<br/>
   -Successful Response: `curl -X POST http://localhost:3000/api/users \
-H "Content-Type: application/json" \
-d '{
  "email": "testmusician5@example.com",
  "password": "hashedpassword",
  "first_name": "John",
  "last_name": "Musican",
  "birthday": "1990-01-01",
  "user_type": 2
}'
`<br/>

-EndPoint: /api/users/
-Method: PUT
-Description: Update a user.
-Example Request: `curl -X PUT http://localhost:3000/api/users/2 \
-H "Content-Type: application/json" \
-d '{
  "email": "newemail2@example.com",
  "first_name": "NewFirstName",
  "last_name": "NewLastName"
}'`<br/>
-Successful Response: `{"id":"2","email":"newemail2@example.com","password":"hashedpassword","first_name":"NewFirstName","last_name":"NewLastName","birthdate":"1990-01-01T06:00:00.000Z","user_type":2,"created_at":"2024-10-19T00:35:56.021Z","updated_at":"2024-10-20T01:39:58.550Z","deleted_at":null}`<br/>

-EndPoint: /api/users/:id</br>
-Method: DELETE</br>
-Description: Soft delete a user by setting the deleted_at timestamp</br>
-Example Request: `curl -X DELETE http://localhost:3000/api/users/3`</br>
-Successful Response: `{ "message": "User id '3' successfully deleted." }`</br>

## Profile Management<br/>
Operations to manager profiles in the Sync system, including creating, reading, updating, and deleting profiles.<br/>
   -Endpoint: `/api/profiles/:id`<br/>
   -Method: `GET`<br/>
   -Description: Gets the details of the profile by id.<br/>
   -Example Request: `curl http://localhost:3000/api/profiles/1`<br/>
   -Successful Response: `{"id":"1","gender":"Male","instruments":[1],"proficiency_level":"Novice","genres":[{"id":1,"name":"Rock"}],"created_at":"2024-10-21T22:49:24.612Z","user_id":"4","first_name":"John","last_name":"Musican"}`<br/>

   -EndPoint: `/api/profiles/`<br/>
   -Method: `POST`<br/>
   -Description: Posts a new location.<br/>
   -Example Request: `curl -X POST http://localhost:3000/api/profiles \
-H "Content-Type: application/json" \
-d '{
  "user_id": 1,
  "gender": "male",
  "instruments": [1, 2],
  "proficiency_level": 3,
  "genres": [1, 2, 3]
}''`<br/>
   -Successful Response: `{"id":"2","user_id":"1","gender":"male","instruments":[1,2],"proficiency_level":3,"genres":[1,2,3],"created_at":"2024-10-21T23:21:03.549Z","updated_at":"2024-10-21T23:21:03.549Z","deleted_at":null}`<br/>

   -EndPoint: `/api/locations/:id`<br/>
   -Method: `PUT`<br/>
   -Description: Update a location.<br/>
   -Example Request: `curl -X PUT http://localhost:3000/api/profiles/2 \
-H "Content-Type: application/json" \
-d '{
  "gender": "female",
  "instruments": [3, 4],
  "proficiency_level": 4,
  "genres": [1, 3]
}'
`<br/>
   -Successful Response: `{
  {"id":"2","user_id":"1","gender":"female","instruments":[3,4],"proficiency_level":4,"genres":[1,3],"created_at":"2024-10-21T23:21:03.549Z","updated_at":"2024-10-21T23:42:49.407Z","deleted_at":null}`<br/>

  -EndPoint: `/api/profiles/:id`<br/>
   -Method: `DELETE`<br/>
   -Description: Soft delete a location by setting the deleted_at timestamp<br/>
   -Example Request: `curl -X DELETE http://localhost:3000/api/profiles/2 `<br/>
   -Successful Response: `{"message":"Profile id '2' successfully deleted."}`
