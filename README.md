# TechInsights: https://techinsights-v1.vercel.app/

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

## Overview

TechInsights is a comprehensive full-stack web platform tailored for tech enthusiasts, offering valuable insights into the fast-paced world of technology. It provides users with access to expert tips, personal stories, and community-driven content, covering everything from solving everyday tech problems to discovering the latest in software, apps, gadgets, and digital innovations. Whether you're troubleshooting or exploring new tools, TechInsights is your go-to resource for staying ahead in the tech landscape.

## Features

- **User Authentication**: Secure registration and login with JWT-based authentication.
- **User Profiles**: Personalized profiles with the ability to update information and profile pictures.
- **Rich Content Creation**: Create and edit tech tips and tutorials using a powerful rich text editor.
- **Post Categories**: Easily categorize posts for better organization and discoverability.
- **Commenting System**: Engage in discussions through comments on posts.
- **PDF Generation**: Generate PDFs of tech guides for offline reference.
- **News Feed**: Dynamic feed with infinite scroll and sorting options.
- **Search & Filter**: Advanced search functionality with debouncing for optimal performance.
- **Following System**: Follow other tech enthusiasts to stay updated with their content.
- **Micro Animations**: Smooth transitions and effects for an engaging user experience.
- **Responsive Design**: Mobile-friendly interface adapting to various screen sizes.

## Technologies Used

- Frontend: Next.js
- Backend: Next.js API Route
- Database: MongoDB
- Authentication: JWT (JSON Web Tokens)
- Rich Text Editor: TinyMCE
- Styling: Tailwind CSS
- State Management: Redux / Context API
- API: RESTful API

## Getting Started

1. Clone the repository:

   ```
   git clone https://github.com/rejaulrasel/TechInsights.git
   ```

2. Install dependencies:

   ```
   cd TechInsights
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the necessary environment variables (database connection string, JWT secret, payment gateway credentials, etc.).

4. Start the development server:

   ```
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:3000` to see the application running.

## Project Structure

```
tech-tips-and-tricks-hub/
├── client/                 # Frontend React application
│   ├── components/         # Reusable React components
│   ├── pages/              # Next.js pages
│   ├── styles/             # CSS and styling files
│   └── utils/              # Utility functions and helpers
├── server/                 # Backend Node.js application
│   ├── controllers/        # Request handlers
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   └── middleware/         # Custom middleware functions
├── public/                 # Static files
├── config/                 # Configuration files
├── tests/                  # Test files
└── README.md               # Project documentation
```

## API Endpoints

- `/api/auth`: Authentication routes (register, login, logout)
- `/api/users`: User-related routes (profile management, following)
- `/api/posts`: Post-related routes (CRUD operations, upvoting)
- `/api/comments`: Comment-related routes
- `/api/categories`: Category management routes
- `/api/search`: Search functionality routes
