# Bug Tracker Application

## Introduction

### Purpose

The purpose of this document is to provide a detailed description of the Bug Tracker application. This application is designed to manage and track bugs or issues within various projects. It aims to help software development teams organize, assign, and monitor the status of issues efficiently.

### Scope

The Bug Tracker application will enable users to:

- Create and manage projects
- Create and manage tickets (bugs, defects, feature requests)
- Assign roles and manage user access
- Track the status and history of each ticket
- Upload and manage attachments related to tickets
- Provide comments on tickets for collaboration
- Reset passwords via email

### Audience

This document is intended for:

- Project managers
- Developers
- QA engineers
- Potential employers
- Software development teams

## Overall Description

### Product Perspective

The Bug Tracker application is a standalone web-based system accessible through a web browser. It is designed to demonstrate critical skills in full-stack web development, including authentication, authorization, role management, and CRUD operations.

### Product Functions

- **User Authentication and Authorization**: Users can register, log in, and access the application based on their roles (Admin, Project Manager, Developer, Submitter).
- **Project Management**: Users can create and manage multiple projects.
- **Ticket Management**: Users can create, view, update, and delete tickets within projects. Tickets can be categorized by type (bug, feature request, etc.) and prioritized.
- **Role Assignment**: Admins can assign roles to users, managing their access and permissions within the application.
- **Comments and Collaboration**: Users can add comments to tickets to facilitate collaboration and communication.
- **Attachments**: Users can upload and manage attachments (e.g., screenshots, documents) related to tickets.
- **Search and Filter**: Users can search and filter projects and tickets based on various criteria.
- **History Tracking**: The application tracks changes to tickets, including status updates, reassignments, and modifications.
- **Password Reset**: Users can reset their passwords via email if they forget them.

### User Classes and Characteristics

- **Admin**: Full access to all features, including user and role management.
- **Project Manager**: Can create and manage projects, assign users to projects, and oversee ticket management.
- **Developer**: Can update ticket statuses, assign tickets to themselves, and add comments.
- **Submitter**: Can create new tickets and add comments.

### Operating Environment

- **Frontend**: React.js, Vite, Bootstrap
- **Backend**: Express.js, Node.js, Passport.js
- **Database**: PostgreSQL
- **Hosting**: Deployed on a live server accessible via a URL

### Design and Implementation Constraints

- The application must be responsive and accessible on various devices (desktop, tablet, mobile).
- Security measures must be in place to protect user data and ensure proper authentication and authorization.

### Assumptions and Dependencies

- Users have access to a web browser.
- The application is hosted on a reliable server with proper uptime and maintenance.
- Email service is configured for sending notifications and reset links.

## Specific Requirements

### Functional Requirements

- **User Authentication**

  - Users must be able to register and log in.
  - Users must be able to reset their passwords via email.

- **Project Management**

  - Users can create new projects.
  - Users can view a list of all projects.
  - Users can update project details.
  - Users can delete projects.

- **Ticket Management**

  - Users can create new tickets within projects.
  - Users can view a list of tickets within a project.
  - Users can update ticket details (status, type, priority, assignee).
  - Users can delete tickets.
  - Users can search and filter tickets.

- **Role Assignment**

  - Admins can assign roles to registered users.
  - Users can be assigned to projects with specific roles.

- **Comments and Collaboration**

  - Users can add comments to tickets.
  - Comments are visible to all users assigned to the project.

- **Attachments**

  - Users can upload and manage attachments for tickets.

- **History Tracking**
  - The application tracks changes to tickets and maintains a history log.

### Non-Functional Requirements

- **Performance**

  - The application should load within 3 seconds on a standard internet connection.
  - Search and filter operations should return results within 1 second.

- **Security**

  - All user data must be encrypted.
  - Proper authentication and authorization mechanisms must be in place.
  - Regular security audits must be conducted.

- **Usability**

  - The application should be intuitive and easy to use.
  - Documentation and help features should be available.

- **Reliability**

  - The application should have an uptime of 99.9%.
  - Regular backups of the database should be maintained.

- **Maintainability**
  - The codebase should follow best practices and be well-documented.
  - The application should be modular to facilitate easy updates and maintenance.

## Functional Details

### User Authentication and Authorization

- Users can register with a username, email, and password.
- Users can log in with their credentials.
- Passwords are hashed before storage for security.
- Users can reset their password via a reset link sent to their registered email address.

### Project Management

- Users can create projects with a name and description.
- Users can view a list of all projects they have access to.
- Users can update project details such as name and description.
- Users can delete projects.

### Ticket Management

- Users can create tickets with details such as title, description, type (bug, feature request), priority, and assignee.
- Users can view a list of tickets within a project.
- Users can update ticket details such as status (open, in progress, closed), type, priority, and assignee.
- Users can delete tickets.
- Users can search and filter tickets based on various criteria such as status, type, and priority.

### Role Assignment

- Admins can assign roles to users (Admin, Project Manager, Developer, Submitter).
- Roles determine the access level and permissions within the application.
- Users can be assigned to projects with specific roles.

### Comments and Collaboration

- Users can add comments to tickets for collaboration.
- Comments are visible to all users assigned to the project.
- Users can view the history of comments on a ticket.

### Attachments

- Users can upload attachments such as screenshots and documents to tickets.
- Attachments can be viewed and downloaded by users assigned to the project.

### History Tracking

- The application tracks changes to tickets, including status updates, reassignments, and modifications.
- History includes details such as the property changed, old value, new value, date of change, and user who made the change.

### Password Reset

- Users can request a password reset by providing their username.
- If the username exists, a reset link is sent to the registered email address.
- Users can reset their password using the link, which includes a token for verification.

## Appendices

### Glossary

- **Ticket**: An individual issue, bug, defect, or feature request within a project.
- **Role**: The access level assigned to a user, determining their permissions within the application.
- **CRUD**: Create, Read, Update, Delete operations for managing data.
