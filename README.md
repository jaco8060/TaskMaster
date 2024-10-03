# TaskMaster Application

## Introduction

### Purpose

The purpose of this document is to provide a detailed description of the TaskMaster application. TaskMaster is designed to manage and track tasks, bugs, or issues within various projects. It helps software development teams organize, assign, and monitor tasks efficiently.

### Scope

TaskMaster allows users to:

- Create and manage projects
- Create and manage tasks (bugs, defects, feature requests)
- Assign roles and manage user access
- Track the status and history of each task
- Upload and manage attachments related to tasks
- Provide comments on tasks for collaboration
- Reset passwords via email

### Audience

This application is designed for:

- Project managers
- Developers
- QA engineers
- Software development teams
- Potential employers

## Overall Description

### Product Perspective

TaskMaster is a standalone, web-based application accessible via any web browser. It demonstrates essential full-stack web development skills, including authentication, authorization, role management, and CRUD operations.

### Product Functions

- **User Authentication and Authorization**: Users can register, log in, and access the application based on their roles (Admin, Project Manager, Developer, Submitter).
- **Project Management**: Users can create, view, and manage multiple projects.
- **Task Management**: Users can create, view, update, and delete tasks. Tasks can be categorized and prioritized.
- **Role Assignment**: Admins can assign roles to users, managing access levels and permissions.
- **Comments and Collaboration**: Users can add comments to tasks for effective communication.
- **Attachments**: Users can upload and manage attachments like screenshots and documents.
- **Search and Filter**: Users can search and filter tasks and projects.
- **History Tracking**: The application tracks changes to tasks.
- **Password Reset**: Users can reset their passwords via email.

### User Roles

- **Admin**: Full access to all features, including user and role management.
- **Project Manager**: Can create and manage projects, assign users, and oversee task management.
- **Developer**: Can update task statuses, assign tasks to themselves, and add comments.
- **Submitter**: Can create new tasks and add comments.

### Technologies

- **Frontend**: TypeScript, React.js, Vite, Bootstrap
- **Backend**: Express.js, Node.js, Passport.js
- **Database**: PostgreSQL
- **Hosting**: Deployed on a live server accessible via a URL

### Design Constraints

- The application must be responsive and accessible on multiple devices.
- Security measures must be in place to protect user data and ensure proper authentication and authorization.

### Assumptions

- Users have access to a web browser.
- The application is hosted on a reliable server with proper uptime and maintenance.
- Email service is configured for sending notifications and password reset links.

## Functional Requirements

### User Authentication

- Users must be able to register and log in.
- Users can reset passwords via email.

### Project Management

- Users can create, view, update, and delete projects.

### Task Management

- Users can create, view, update, and delete tasks within projects.
- Tasks can be filtered and searched by various criteria.

### Role Assignment

- Admins can assign roles to users, controlling their access.

### Comments and Collaboration

- Users can add comments to tasks for discussion and collaboration.

### Attachments

- Users can upload and manage attachments related to tasks.

### History Tracking

- Changes to tasks, including status updates and reassignments, will be tracked.

## Non-Functional Requirements

### Performance

- The application should load within 3 seconds on standard internet connections.
- Search and filter operations should return results within 1 second.

### Security

- User data must be encrypted.
- Secure authentication and authorization mechanisms must be in place.

### Usability

- The application should be intuitive and easy to use with appropriate documentation.

### Reliability

- The application should have an uptime of 99.9%.
- Regular backups of the database should be maintained.

### Maintainability

- The codebase should be modular, follow best practices, and be well-documented.

## Functional Details

### User Authentication

- Users can register with a username, email, and password.
- Passwords are securely hashed before storage.
- Users can reset passwords via a reset link sent to their email.

### Project Management

- Users can create, view, and manage projects.

### Task Management

- Users can create tasks with attributes like title, description, type (bug, feature request), priority, and assignee.
- Tasks can be searched and filtered based on various criteria.

### Role Assignment

- Admins assign roles to users (Admin, Project Manager, Developer, Submitter).
- Roles control the level of access within the system.

### Comments and Collaboration

- Users can add comments to tasks.
- Comments are visible to all users within the project.

### Attachments

- Users can upload attachments (screenshots, documents) to tasks.
- Attachments can be viewed and downloaded.

### History Tracking

- Task changes, including status updates and modifications, will be tracked.
- A history log will include details such as old value, new value, date of change, and the user who made the change.

### Password Reset

- Users can request a password reset by providing their username.
- A reset link is sent to their email, allowing them to change their password.

## Glossary

- **Task**: An individual issue, bug, defect, or feature request within a project.
- **Role**: The access level assigned to a user, determining their permissions.
- **CRUD**: Create, Read, Update, Delete operations for managing data.
