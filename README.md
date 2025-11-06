# Prosora Deep Research Business Report

This project is a multi-step research agent that uses the Motia framework to conduct research and generate a business report.

## Prerequisites

- Node.js (v20.x or higher)
- npm

## Installation

1.  Install Motia CLI globally:

    ```bash
    npm install -g motia
    ```

2.  Install project dependencies:

    ```bash
    npm install
    ```

## Running the Application

1.  Start the development server:

    ```bash
    motia dev
    ```

2.  The server will start on port 3000. You can access the Motia workbench at `http://localhost:3000`.

## API Endpoints

-   `POST /research`

    Starts a new research task.

    **Request Body:**

    ```json
    {
      "query": "Your research query",
      "depth": "basic"
    }
    ```

    -   `depth` can be one of `"basic"`, `"detailed"`, or `"comprehensive"`.

    **Response:**

    ```json
    {
      "requestId": "a-unique-request-id"
    }
    ```

-   `GET /research/status?requestId=<requestId>`

    Checks the status of a research task.

-   `GET /research/report?requestId=<requestId>`

    Retrieves the generated report.