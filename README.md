# StockImagePlatform

## Overview

StockImagePlatform is a web application that allows users to manage their stock images with features like user authentication, image uploading, and image management. It uses Django and Django Rest Framework (DRF) for the backend, and React with Redux Toolkit for the frontend.

## Live Demo

Visit the live application: [https://taskmanagement.site](https://taskmanagement.site)

## Repository

The source code is available on GitHub: [https://github.com/Arunkino/stock-image-platform](https://github.com/Arunkino/stock-image-platform)

## Features

### 1. User Authentication
- Register with email ID, phone number, and password
- Login functionality
- Password reset option

### 2. Image Management
- Add images with titles (bulk upload supported)
- View uploaded images with their titles
- Edit image details (both image and title)
- Delete uploaded images

### 3. Image Rearrangement
- Drag-and-drop functionality to rearrange selected images
- Save the new order of rearranged images

## Technologies Used

- Backend:
  - Django
  - Django Rest Framework (DRF)
- Frontend:
  - React.js
  - Redux Toolkit
- Database:
  - PostgreSQL

## Getting Started

### Prerequisites
- Python 3.x
- Node.js and npm

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/Arunkino/stock-image-platform.git
   cd stock-image-platform
   ```

2. Set up the backend:
   ```
   cd backend
   pip install -r requirements.txt
   ```

3. Configure the environment:
   - Rename `backend/backend/.env.example` to `backend/backend/.env`
   - Update the `.env` file with your specific settings

4. Set up the frontend:
   ```
   cd ../frontend
   npm install
   ```

5. Run the application:
   - Start the backend server
   - Start the frontend development server

## Configuration

Make sure to update the `backend/backend/.env` file with your specific settings, including:

- Database credentials
- Secret key

## Contributing

(Include guidelines for contributing to the project)

## License

(Specify the license under which the project is released)

## Contact

For support or inquiries, please (provide contact information or process).
