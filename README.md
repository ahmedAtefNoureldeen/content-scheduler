# Social Scheduler

## Project Overview

Social Scheduler is a web application designed to help users manage and schedule social media content efficiently. Built using Laravel (PHP backend) and React (frontend), the application provides a robust platform for content planning and scheduling.

## Technology Stack

- **Backend:** Laravel 10.x
- **Frontend:** React 18.x
- **Database:** SQLite (configured in the project)
- **Build Tools:** Vite
- **Styling:** Tailwind CSS

## Project Structure

The project is divided into two main directories:
- `social-scheduler/`: Laravel backend
- `social-scheduler-front/`: React frontend

## Prerequisites

Before installation, ensure you have the following installed:
- PHP 8.1+
- Composer
- Node.js 16+
- npm

## Installation Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/social-scheduler.git
cd social-scheduler
```

### 2. Backend Setup

#### Install PHP Dependencies
```bash
cd social-scheduler
composer install
```

#### Configure Environment
```bash
cp .env.example .env
php artisan key:generate
```

#### Database Setup
```bash
php artisan migrate
php artisan db:seed
```

### 3. Frontend Setup

```bash
cd ../social-scheduler-front
npm install
```

### 4. Run the Application

#### Start Backend Server
```bash
cd ../social-scheduler
php artisan serve
```

#### Start Frontend Development Server
```bash
cd ../social-scheduler-front
npm run dev
```

## Database Migrations and Seeders

### Migrations
Located in `social-scheduler/database/migrations/`, these define the database schema:
- User authentication tables
- Social media post scheduling tables
- Platform connection configurations

### Seeders
Located in `social-scheduler/database/seeders/`, these provide initial data:
- Sample user accounts
- Default platform configurations
- Example scheduled posts

## Architectural Approach and Trade-offs

### Backend Architecture
- **Framework:** Laravel provides robust routing, ORM, and security features
- **Authentication:** Laravel Sanctum for API token authentication
- **Queue Management:** Handles scheduled post publishing

### Frontend Architecture
- **Framework:** React for dynamic, component-based UI
- **Routing:** React Router for single-page application navigation
- **State Management:** Considering lightweight state management solutions

### Key Trade-offs

1. **SQLite vs. MySQL/PostgreSQL**
   - **Pros:** Lightweight, no separate server required
   - **Cons:** Limited concurrent write performance, less scalable

2. **Monolithic vs. Microservices**
   - **Current Approach:** Monolithic architecture for simplicity
   - **Future Consideration:** Potential microservices for scalability

3. **Real-time vs. Scheduled Posting**
   - **Current Focus:** Scheduled posting
   - **Future Enhancement:** Potential real-time posting capabilities

## Security Considerations

- Laravel's built-in CSRF protection
- Sanctum for API authentication
- Input validation and sanitization
- Environment-based configuration management

## Future Roadmap

- Multi-platform support
- Advanced analytics
- Collaborative content planning
- Enhanced scheduling options

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

[Specify your license, e.g., MIT]

## Contact

[Your contact information or project maintainer details]
```