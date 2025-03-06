# TaskMaster

[![Live Demo](https://img.shields.io/badge/Live%20Demo-TaskMaster-blue?style=-for-the-badge&logo=netlify)](https://taskmastertracker.netlify.app/)

## Table of Contents
1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [Technical Details](#technical-details)
4. [Technologies Used](#technologies-used)
5. [User Guide](#user-guide)
6. [Organization Management](#organization-management)
7. [Registration with Organizations](#registration-with-organizations)
8. [Deployment Options](#deployment-options)
9. [Local Installation on Linux Server](#local-installation-on-linux-server)
10. [Support](#support)

## Introduction

TaskMaster is a web-based project management tool designed to help software development teams organize, track, and manage their tasks efficiently. The application is hosted on Netlify and accessible at [https://taskmastertracker.netlify.app/](https://taskmastertracker.netlify.app/).

## Getting Started

### System Requirements
- Modern web browser (Chrome, Firefox, Edge, Safari)
- Internet connection
- Screen resolution of 1024x768 or higher (optimized for both desktop and mobile)

### First Time Users
1. Visit [https://taskmastertracker.netlify.app/](https://taskmastertracker.netlify.app/)
2. Click "Register" to create a new account
3. Verify your email address
4. Log in with your credentials

### Demo Access
Want to try before creating an account? Use our demo feature:

1. Click "Login" on the homepage
2. Select "Sign in as a demo user"
3. Choose from available demo roles:
   - Admin
   - Project Manager
   - Developer
   - Submitter

## Technical Details

### Frontend
- **Framework**: React.js with TypeScript
- **Build Tool**: Vite
- **UI Library**: Bootstrap
- **State Management**: React Context API
- **Routing**: React Router

### Backend
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Authentication**: Passport.js
- **Search**: [MeiliSearch](https://www.meilisearch.com/)
- **Cron Jobs**: pg_cron

### Hosting
- **Frontend**: Netlify
- **Backend**: Docker container
- **Database**: Managed PostgreSQL service

## Technologies Used

### Frontend
- React 18.2.0
- React Router 6.23.1
- Axios 1.6.8
- Bootstrap 5.3.3
- Recharts 2.15.1
- Vite 5.2.0

### Backend
- Express 4.19.2
- PostgreSQL (pg 8.11.5)
- MeiliSearch 0.49.0 (Search Engine)
- bcrypt 5.1.1
- Passport 0.7.0

### Database
- PostgreSQL 14
- pg_cron extension

### Development & Deployment
- Node.js 18
- Docker
- Nginx (alpine)
- nodemon 3.1.7

## User Guide

### Authentication
- **Registration**: Create a new account with username, email, and password
- **Login**: Access your account with your credentials
- **Password Recovery**: Reset your password via email if forgotten

### Project Management
1. **Create Projects**
   - Click "Create Project" button
   - Enter project details (name, description)
   - Projects are automatically assigned to the creator
2. **View Projects**
   - View all projects in a sortable and searchable table
   - Filter projects by name or description
   - View detailed project information including creation date
3. **Project Details**
   - View complete project information
   - Manage assigned personnel
   - View and manage project tickets
   - Edit project details (name, description, active status)
4. **Assign Personnel**
   - Assign team members to projects
   - View assigned personnel and their roles
   - Manage team member assignments

### Ticket Management
1. **Create Tickets**
   - Click "Create New Ticket" button
   - Enter ticket details (title, description, priority, status)
   - Select associated project from dropdown
   - Tickets are automatically assigned to the creator
2. **View Tickets**
   - View all tickets in a sortable and searchable table
   - Filter tickets by status, priority, or project
   - View detailed ticket information including creation date
3. **Edit Tickets**
   - Update ticket details (title, description, priority, status)
   - Change associated project
   - View and manage ticket history
4. **Ticket Details**
   - View complete ticket information
   - Add and manage attachments
   - View and add comments
   - Track ticket history and changes
   - View assigned developer and submitter information

### Team Collaboration
- **Comments**: Add and reply to ticket comments
- **Attachments**: Upload relevant files to tickets
- **Notifications**: Receive updates on ticket changes
- **Role Management**: Admins can assign user roles (Admin, Manager, Developer)

### Search Functionality
The TaskMaster includes a powerful search feature that allows users to quickly find relevant information across the platform. The search functionality is powered by [MeiliSearch](https://www.meilisearch.com/), providing fast and relevant results.

#### How Search Works:
1. **Search Scope**
   - Searches across users, tickets, and projects
   - Filters results based on user's organization and permissions
   - Includes title, description, and other relevant fields

2. **Search Features**
   - Instant search results as you type
   - Filters results by type (users, tickets, projects)
   - Displays relevant information for each result
   - Direct links to the corresponding details page

3. **Search Results**
   - **Users**: Shows username, email, and profile link
   - **Tickets**: Displays title, description, and ticket details link
   - **Projects**: Shows project name, description, and project details link

4. **Search Limitations**
   - Only shows results the user has permission to view
   - Limited to 5 results per category
   - Searches within the user's organization only

## Organization Management

The MyOrganization component allows users to manage their organization membership, view organization details, and handle administrative tasks.

### Key Features

1. **Organization Overview**
   - View organization name and details
   - See current invite code with expiration timer
   - Copy invite code to clipboard

2. **Member Management**
   - View all organization members
   - Remove members (admin only)
   - View member profiles

3. **Join Requests**
   - View pending join requests (admin only)
   - Approve or reject requests
   - See request timestamps

4. **Organization Administration**
   - Delete organization (admin only)
   - Manage organization settings

### Usage Guide

#### For Organization Members
1. **View Organization Details**
   - Navigate to "My Organization" from the dashboard
   - See organization name, invite code, and member list

2. **Copy Invite Code**
   - Click "Copy Invite Code" button
   - Share the code with new members

3. **View Member Profiles**
   - Click "View Profile" next to any member
   - See member details and activity

#### For Organization Admins
1. **Manage Join Requests**
   - View pending requests in the "Pending Join Requests" section
   - Approve or reject requests using the buttons

2. **Remove Members**
   - Click "Remove" next to a member's name
   - Confirm removal in the modal

3. **Delete Organization**
   - Scroll to the "Danger Zone" section
   - Type "I understand" to confirm
   - Click "Confirm Deletion"

### Important Notes
- Only organization admins can manage join requests and delete the organization
- Demo accounts cannot be removed
- Organization deletion is permanent and cannot be undone
- Invite codes expire after a set time and automatically refresh

## Registration with Organizations

The registration process allows users to either join an existing organization or create a new one. This is handled through the RegisterWithOrganization component.

### Registration Steps

1. **Basic Information**
   - Enter username, email, and password
   - Username and email availability is checked in real-time
   - Passwords must match

2. **Organization Choice**
   - Choose between joining an existing organization or creating a new one

3. **Joining an Organization**
   - **Option 1: Join with Code**
     - Enter organization invite code
     - Code is validated before proceeding
   - **Option 2: Search and Request**
     - Search for organizations by name
     - Select an organization and request to join
     - Request must be approved by organization admin

4. **Creating an Organization**
   - Enter organization name
   - Automatically becomes admin of new organization

5. **Final Submission**
   - Account is created
   - If joining an organization, status depends on method:
     - With code: Immediate access if code is valid
     - With request: Pending admin approval
   - If creating organization: Immediate access as admin

### Key Features

- **Real-time Validation**
  - Username and email availability checked as you type
  - Organization code validation before submission

- **Search Functionality**
  - Search for organizations by name
  - View organization details before requesting to join

- **Security**
  - Password hashing
  - Email verification
  - Secure invite codes

- **User Experience**
  - Step-by-step process
  - Clear error messages
  - Progress indicators

### Important Notes

- Organization invite codes expire after a set time
- Join requests may take time to be approved
- Organization admins can manage join requests
- Demo accounts cannot create or join organizations

## Deployment Options

### Option 1: Full Deployment on Ubuntu Server
Follow the steps in the "Local Installation on Linux Server with DuckDNS and SSL" section for a complete deployment.

### Option 2: Frontend Deployment on Netlify

1. **Prepare Your Frontend Code**
   - Ensure your frontend code is in a separate directory (e.g., `frontEnd`)
   - Create a production build:
     ```bash
     cd frontEnd
     npm run build
     ```

2. **Create a Netlify Account**
   - Go to [https://app.netlify.com](https://app.netlify.com)
   - Sign up or log in with your preferred method (GitHub, GitLab, etc.)

3. **Deploy from Git Repository**
   - Click "New site from Git"
   - Connect your Git provider (GitHub, GitLab, etc.)
   - Select your TaskMaster repository
   - Configure build settings:
     - Build command: `npm run build`
     - Publish directory: `frontEnd/dist`
   - Click "Deploy site"

4. **Configure Environment Variables**
   - Go to "Site settings" > "Build & deploy" > "Environment"
   - Add required environment variable:
     - `VITE_API_URL`: https://your-domain.duckdns.org/api

5. **Configure Netlify TOML File**
   Create `frontEnd/netlify.toml` with these rules (replace domains with your own):
   ```toml
   [build]
     base = "frontEnd"
     publish = "dist"

   [[redirects]]
     from = "/api/*"
     to = "https://your-domain.duckdns.org/:splat"
     status = 200
     force = true
     headers = { "X-Forwarded-Host" = "your-netlify-app.netlify.app" }

   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```
   **Important for iOS Cookies**:
   - The `X-Forwarded-Host` header is required for proper cookie handling on iOS devices
   - Without this configuration, authentication may fail on Safari/iOS due to cross-domain cookie restrictions

6. **Set Up Custom Domain (Optional)**
   - Go to "Domain settings"
   - Add your custom domain
   - Follow Netlify's instructions to configure DNS

7. **Enable Automatic Deployments**
   - In "Build & deploy" settings, enable "Build hooks"
   - Set up automatic deployments on Git push

8. **Test Your Deployment**
   - Visit your Netlify site URL
   - Verify all frontend functionality is working

## Local Installation on Linux Server with DuckDNS and SSL

### Prerequisites
- Linux server (Ubuntu 20.04 or later recommended)
- Docker and Docker Compose installed
- Nginx installed
- Certbot installed
- DuckDNS account with your own configured subdomain (do not use taskmaster-app.duckdns.org as it's just an example)
- Port forwarding configured on your router (ports 80 and 443)

### Port Forwarding Setup

1. **Obtain Your Server's Local IP (Ubuntu)**
   - Open a terminal on your Ubuntu server
   - Run the following command:
     ```bash
     ip addr show | grep inet | grep -v inet6 | grep -v 127.0.0.1 | awk '{print $2}' | cut -d/ -f1
     ```
   - Note the IP address (e.g., 192.168.1.100)

2. **Access Your Router**
   - Open a web browser and enter your router's IP address (commonly 192.168.0.1 or 192.168.1.1)
   - Log in with your admin credentials

3. **Locate Port Forwarding Settings**
   - Navigate to the "Advanced" or "Network" section
   - Find "Port Forwarding" or "NAT Forwarding"

4. **Configure Port Forwarding Rules**
   - Add a new rule for HTTP (port 80):
     - External Port: 80
     - Internal IP: [Your server's local IP from step 1]
     - Protocol: TCP
   - Add a new rule for HTTPS (port 443):
     - External Port: 443
     - Internal IP: [Your server's local IP from step 1]
     - Protocol: TCP

5. **Save and Apply Changes**
   - Click "Save" or "Apply" to activate the port forwarding rules
   - Restart your router if necessary

6. **Verify Port Forwarding**
   - Use an online port checker tool
   - Test ports 80 and 443 to ensure they're open and forwarding correctly

### Step 1: Set Up DuckDNS for Dynamic IP Updates

1. **Choose Your Domain**
   - Log in to [duckdns.org](https://www.duckdns.org/)
   - Choose or create your own subdomain (do not use taskmaster-app, create your own)
   - Note your token

2. **Check for Cron and Curl**
   - Verify cron is running:
     ```bash
     ps -ef | grep cr[o]n
     ```
     If nothing is returned, install cron for your Linux distribution.
   - Verify curl is installed:
     ```bash
     curl
     ```
     If "command not found" appears, install curl for your distribution.

3. **Create DuckDNS Directory and Script**
   ```bash
   mkdir ~/duckdns
   cd ~/duckdns
   nano duck.sh
   ```

4. **Add Script Content**
   Copy and paste the following, replacing `your-domain` with your chosen DuckDNS subdomain and `your-duckdns-token` with your actual token:
   ```bash
   #!/bin/bash
   DOMAIN="your-domain"    # Replace with your DuckDNS subdomain
   TOKEN="your-duckdns-token"
   IP=$(curl -s ifconfig.me)
   echo "Updating DuckDNS with IP: $IP"
   echo url="https://www.duckdns.org/update?domains=$DOMAIN&token=$TOKEN&ip=$IP" | curl -k -o ~/duckdns/duck.log -K -
   ```
   Save and exit (CTRL+O, ENTER, CTRL+X)

5. **Make Script Executable**
   ```bash
   chmod 700 ~/duckdns/duck.sh
   ```

6. **Test the Script**
   ```bash
   ~/duckdns/duck.sh
   cat ~/duckdns/duck.log
   ```
   Should output "OK". If "KO", check your token and domain in the script.

7. **Set Up Cron Job**
   ```bash
   crontab -e
   ```   Add the following line at the bottom:
   ```bash
   */5 * * * * ~/duckdns/duck.sh >/dev/null 2>&1
   ```
   Save and exit (CTRL+O, ENTER, CTRL+X)

### Step 2: Install Required Tools

#### Docker Installation

**For Windows:**
1. Download Docker Desktop from [https://www.docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop)
2. Run the installer and follow the setup wizard
3. Enable WSL 2 backend (recommended) during installation
4. After installation, restart your computer
5. Verify installation by opening Command Prompt and running:
   ```bash
   docker --version
   ```

**For Linux (Ubuntu/Debian):**
1. Update your package list:
   ```bash
   sudo apt update
   ```
2. Install required dependencies:
   ```bash
   sudo apt install apt-transport-https ca-certificates curl software-properties-common
   ```
3. Add Docker's official GPG key:
   ```bash
   curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
   ```
4. Set up the stable repository:
   ```bash
   echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
   ```
5. Install Docker Engine:
   ```bash
   sudo apt update
   sudo apt install docker-ce docker-ce-cli containerd.io
   ```
6. Verify installation:
   ```bash
   sudo docker --version
   ```

**For other Linux distributions**, refer to the official Docker documentation: [https://docs.docker.com/engine/install/](https://docs.docker.com/engine/install/)

2. **Install Docker Compose**
   ```bash
   sudo apt install docker-compose -y
   ```

3. **Install Nginx**
   ```bash
   sudo apt install nginx -y
   ```

4. **Install Certbot**
   ```bash
   sudo apt install certbot -y
   ```

### Step 3: Configure Nginx with SSL
1. **Obtain SSL Certificates**
   ```bash
   sudo certbot certonly --standalone -d your-domain.duckdns.org --email your-email@example.com --agree-tos
   ```

2. **Copy Certificates**
   ```bash
   sudo cp /etc/letsencrypt/live/your-domain.duckdns.org/fullchain.pem ~/Workspaces/TaskMaster/nginx/ssl/
   sudo cp /etc/letsencrypt/live/your-domain.duckdns.org/privkey.pem ~/Workspaces/TaskMaster/nginx/ssl/
   sudo chown -R $USER:$USER ~/Workspaces/TaskMaster/nginx/ssl
   ```

3. **Create Nginx Configuration File**
   Create `nginx/conf/nginx.conf` with the following content (replace `your-domain.duckdns.org` with your actual domain):
   ```nginx
   events {
       worker_connections 1024;
   }

   http {
       # Redirect HTTP to HTTPS
       server {
           listen 80;
           server_name your-domain.duckdns.org;
           return 301 https://$host$request_uri;
       }

       # HTTPS server
       server {
           listen 443 ssl;
           server_name your-domain.duckdns.org;

           ssl_certificate /etc/nginx/ssl/fullchain.pem;
           ssl_certificate_key /etc/nginx/ssl/privkey.pem;
           ssl_protocols TLSv1.2 TLSv1.3;
           ssl_prefer_server_ciphers on;

           location / {
               proxy_pass http://backend:5000;
               proxy_set_header Host $host;
               proxy_set_header X-Real-IP $remote_addr;
               proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
               proxy_set_header X-Forwarded-Proto $scheme;
           }
  }
}
```

4. **Set Up Certbot Renewal**
   ```bash
   crontab -e
   ```
   Add:
   ```bash
   0 0,12 * * * certbot renew --quiet && docker restart $(docker ps -q -f name=nginx)
   ```

### Step 4: Deploy TaskMaster

1. **Clone the Repository**
   ```bash
   git clone https://github.com/jaco8060/TaskMaster.git
   cd TaskMaster
   ```

2. **Set Up Environment Variables**
   - Create a `.env` file in the root directory
   - Add the following required environment variables:

     ```bash
     # Database Configuration
     POSTGRES_USER=postgres
     POSTGRES_PASSWORD=your-secure-password
     POSTGRES_DB=taskmaster

     # MeiliSearch Configuration
     MEILISEARCH_API_KEY=your-meilisearch-api-key

     # Gmail Configuration (for Forgot Password Feature)
     GMAIL_USER=your-email@gmail.com
     GMAIL_PASS=your-16-digit-app-password

     # Application Configuration
     NODE_ENV=development  # Set to 'development' when using docker-compose.yml
                           # Set to 'production' when using docker-compose.prod.yml
     PORT=5000
     FRONTEND_URL=https://your-domain.duckdns.org  # Replace with your actual frontend URL else use http://localhost:5173 for development
     MEILISEARCH_HOST=http://meilisearch:7700
     ```

3. **Configure Gmail App Password**
   - Enable 2-Step Verification on your Google Account
   - Generate an App Password:
     1. Go to your [Google Account Security](https://myaccount.google.com/security) page
     2. Under "Signing in to Google," select **App passwords**
     3. Select **Mail** as the app and **Other (Custom name)** as the device
     4. Enter "TaskMaster" as the name and click **Generate**
     5. Copy the 16-digit app password and add it to `GMAIL_PASS` in your `.env` file

4. **Build and Start Docker Containers**
   - For **development** (with hot-reloading and debugging):
     ```bash
     docker-compose up --build
     ```
   - For **production** (optimized for deployment):
     ```bash
     docker-compose -f docker-compose.prod.yml up --build -d
     ```

### Step 5: Verify Installation
1. **Check Running Containers**
   ```bash
   docker ps
   ```

2. **Test Public Access**
   - Frontend: `https://your-domain.duckdns.org`
   - Backend API: `https://your-domain.duckdns.org/api`

### Maintenance
- **View Logs**
  ```bash
  docker-compose logs -f
  ```

- **Update the Application**
  ```bash
  git pull origin main
  docker-compose -f docker-compose.prod.yml up --build -d
  ```

### Support

Report issues on our [GitHub Issues page](https://github.com/jaco8060/TaskMaster/issues)




