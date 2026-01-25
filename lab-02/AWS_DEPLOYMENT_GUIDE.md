# Deploying Node.js Simple CRUD to AWS

This guide outlines the steps to deploy the `shop-crud` application using AWS EC2 (for the application) and AWS RDS (for the MySQL database).

## Prerequisites

1.  **AWS Account**: You must have an active AWS account.
2.  **SSH Client**: Terminal (Mac/Linux) or PuTTY (Windows) to connect to EC2.
3.  **Git**: Installed on your local machine.

---

## Step 1: Create an RDS MySQL Database

1.  Log in to the **AWS Management Console**.
2.  Navigate to **RDS** (Relational Database Service).
3.  Click **Create database**.
4.  **Choose a database creation method**: Standard create.
5.  **Engine options**: MySQL.
6.  **Templates**: Free tier (if eligible) or Dev/Test.
7.  **Settings**:
    - **DB instance identifier**: `shopdb-instance`
    - **Master username**: `admin`
    - **Master password**: `your_secure_password` (Remember this!)
8.  **Instance configuration**: `db.t3.micro` (or similar eligible for free tier).
9.  **Connectivity**:
    - **Public access**: **No** (for security, EC2 will connect internally).
    - **VPC security group**: Create new or select existing. Allow EC2 to connect later.
10. Click **Create database**.
11. Wait for the status to become **Available**. Note the **Endpoint** URL (e.g., `shopdb-instance.xxxxxx.region.rds.amazonaws.com`).

---

## Step 2: Launch an EC2 Instance

1.  Navigate to **EC2** in AWS Console.
2.  Click **Launch Instance**.
3.  **Name**: `NodeJS-Shop-Server`.
4.  **AMI**: Amazon Linux 2023 AMI or Ubuntu Server 22.04 LTS.
5.  **Instance Type**: `t2.micro` (Free tier eligible).
6.  **Key pair**: Create a new key pair (`shop-key.pem`), download and save it securely.
7.  **Network settings**:
    - **Allow SSH traffic** from **My IP**.
    - **Allow HTTP traffic** from the internet.
8.  Click **Launch instance**.

---

## Step 3: Configure Security Groups

1.  Go to **EC2** -> **Security Groups**.
2.  **EC2 Security Group**: Ensure Inbound rules allow:
    - SSH (Port 22) from your IP.
    - HTTP (Port 80) from Anywhere (0.0.0.0/0).
    - Custom TCP (Port 3000) from Anywhere (if running directly on 3000 without Nginx).
3.  **RDS Security Group**: Edit Inbound rules:
    - Type: **MYSQL/Aurora** (Port 3306).
    - Source: Select the **EC2 Security Group ID** (this links them safely).

---

## Step 4: Setup the Server (EC2)

1.  SSH into your EC2 instance:

    ```bash
    ssh -i "path/to/shop-key.pem" ec2-user@<EC2_PUBLIC_IP>
    # or for Ubuntu
    ssh -i "path/to/shop-key.pem" ubuntu@<EC2_PUBLIC_IP>
    ```

2.  Update system packages:

    ```bash
    sudo yum update -y  # Amazon Linux
    # or
    sudo apt update && sudo apt upgrade -y # Ubuntu
    ```

3.  Install Node.js and Git:

    ```bash
    # Amazon Linux
    curl -sL https://rpm.nodesource.com/setup_18.x | sudo bash -
    sudo yum install -y nodejs git

    # Ubuntu
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt install -y nodejs git
    ```

---

## Step 5: Deploy the Application

1.  Clone your repository (Push your local code to GitHub first!):

    ```bash
    git clone https://github.com/your-username/shop-crud.git
    cd shop-crud
    ```

2.  Install dependencies:

    ```bash
    npm install
    ```

3.  Configure Environment Variables:
    Create the `.env` file:

    ```bash
    nano .env
    ```

    Paste your configuration (use RDS Endpoint):

    ```env
    PORT=3000
    DB_HOST=shopdb-instance.xxxxxx.region.rds.amazonaws.com
    DB_USER=admin
    DB_PASSWORD=your_secure_password
    DB_NAME=shopdb
    ```

    Save and exit (Ctrl+O, Enter, Ctrl+X).

4.  Initialize the Database:
    You might need to connect to MySQL from EC2 to run `schema.sql`.
    ```bash
    sudo yum install mysql -y # Install MySQL client
    mysql -h <RDS_ENDPOINT> -u admin -p < schema.sql
    ```
    (Enter password when prompted).

---

## Step 6: Run the Application

1.  Test it simply:

    ```bash
    node server.js
    ```

    Visit `http://<EC2_PUBLIC_IP>:3000` in your browser.

2.  Run in background with PM2 (Production):

    ```bash
    sudo npm install pm2 -g
    pm2 start server.js --name "shop-app"
    pm2 startup
    pm2 save
    ```

3.  (Optional) Setup Nginx as Reverse Proxy (Port 80 -> 3000):
    - Install Nginx (`sudo yum install nginx` / `sudo apt install nginx`).
    - Configure `/etc/nginx/conf.d/shop.conf` to proxy pass to localhost:3000.
    - Start Nginx.

---

## Deliverables Checklist

- [x] Application Code (Node.js/Express/EJS)
- [x] Database Schema (MySQL)
- [x] Deployment Guide (This document)
