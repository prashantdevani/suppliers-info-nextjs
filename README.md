## Implementation Overview.

I worked on provided a pre-existing skeleton of a Next.js project to kickstart the development process. Opting for `MongoDB` as the database solution, I aimed to facilitate data storage for subsequent retrieval, search, and sorting functionalities within the GET `api/activities` endpoint. To accomplish this task, I took on the role of both UI and API development leveraging Next.js version 14. In order to fulfill the project requirements, I proceeded by installing the necessary dependencies listed below within the project environment.

| Dependency name    | version | description 
| -------- | ------- | ---- |
| mui  |   6  | Used for creating UI for task |
| mongoose  |  6  | Used for retrieve and search into mongodb data |
| axios  |  1.6  | Used on UI side for make API request call |

## what, why & how
I've implemented pagination with accompanying meta information to facilitate frontend design component creation. This approach is supported by most third-party UI design libraries.

I've chosen to utilize MongoDB for storing data, as it provides straightforward pagination, facilitates data aggregation, and offers scalable and maintainable solutions.

- Improvement areas
   
  1. Data should be serializes or sensitize in API login before performing query execution to prevent a injection from attackers.
  1. We can implement a filter for columns
  1. Caching the API response on server side to get data faster for same request
  1. Debounce should be implement on search to avoid multiples API call on UI side
------------------------------------------------------------------------------------------

## Api Overview
#### This api will provide details about activity data from MongoDB. Also, that data can be filter params 

 <summary><code>GET</code> <code></code> <code> api/activities</code></summary>

#### Parameters

> | name      |  type     | data type               | default |description                                                           |
> |-----------|-----------|-------------------------| ----| -----------------------------------------------------------------------|
> | page      |  optional | number  | 1 |  current page
> | limit      |  optional | number   | 5 | per page records 
> | sort      |  optional | string   | title | record sort by document felid 
> | sort_order      |  optional | asc \| desc  | asc | records is sort as asc or desc 
> | search      |  optional | string   | ''  | search in record's title



#### Responses
```json
{
  "data": [
    {
      "_id": "65d81fe1e42947823eeda8cb",
      "id": 25651,
      "title": "German Tour: Parliament Quarter & Reichstag glass dome",
      "price": 14,
      "currency": "$",
      "rating": 4.8,
      "specialOffer": false,
      "supplierId": 1,
      "supplierDetail": {
        "_id": "65d715430e8555af4baa4d66",
        "id": 1,
        "name": "John Doe",
        "address": "123 Main St",
        "zip": "12345",
        "city": "Anytown",
        "country": "USA"
      },
      "formattedPrice": "$14",
      "supplierName": "John Doe",
      "supplierAddress": "123 Main St, 12345, Anytown, USA"
    },
   ...other records
  ],
  "meta": {
    "total_count": 14,
    "total_page": 3,
    "limit": 5,
    "page": 2,
    "next_page": "/api/activities?page=3&limit=5&sort=title&sort_order=asc&search=e",
    "prev_page": "/api/activities?page=1&limit=5&sort=title&sort_order=asc&search=e"
  }
}
```


#### Example cURL

> ```javascript
>  curl -X GET -H "Content-Type: application/json" http://localhost:8080/api/activities?page=2&limit=5&sort=title&sort_order=asc&search=e
> ```


------------------------------------------------------------------------------------------

## Project setup & run instructions (Locally)
To navigate to your project folder and install Node.js modules while using <b>Node.js version 19</b> or later along with <b>npm version 9 or later</b>, follow these steps:

  1. First install MongoDB version 7 or later in your local system. Navigato your MongoDB terminal and create database with any name with two collections, first is `activities` and second si `suppliers`. Load a data from  `activities.json` and `suppliers.json` in to that relevant collection.
  1. Next, add your MongoDB connection url into environment file `env.local`
      ```
      MONGODB_URI=mongodb://127.0.0.1:27017/[your database name]
      ```
  1. Next, install the required Node.js modules. Let's say you want to install a module named express as an example. You would run:
      ```
        npm install
      ```
  1. After installing the necessary modules, you can start your development server.
      ```
        npm run dev
      ```
## Docker
  1. Execute the following command in your terminal to create a Docker image and container. Ensure that Docker is installed on your local system.  
    <sub><em>**This command will take a longer time to execute. please wait for sometimes**</em></sub>
      ```
        docker compose up --build
      ```
  1. Execute the following command for start docker container
        ```
        docker run -d -p 8080:8080 --name se-fullstack-task se-fullstack-task-next-app:latest
        ```