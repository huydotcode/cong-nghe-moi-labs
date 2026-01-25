# FINAL DELIVERABLE: Node.js Shop CRUD Project

**Student Name**: [Your Name]
**Student ID**: [Your ID]
**Class**: [Your Class]

---

## 1. GitHub Repository

**Link**: [Insert your GitHub Repository Link Here]

_(Upload the code in this folder to your GitHub and paste the link above)_

---

## 2. Project Execution Screenshots

### Home Page (List Products)

_[Paste screenshot of http://localhost:3000/products here]_

- Shows the list of products fetched from MySQL.
- "Add New Product" button is visible.
- Edit/Delete buttons for each product.

### Create Product

_[Paste screenshot of http://localhost:3000/products/create here]_

- Form with Name, Price, Image URL, Description.

### Edit Product

_[Paste screenshot of http://localhost:3000/products/edit/<id> here]_

- Form pre-filled with existing product data.

### Database State (MySQL Workbench/Adminer)

_[Paste screenshot of your database table 'Product' showing data]_

---

## 3. Deployment Process on AWS

**(See full guide in `AWS_DEPLOYMENT_GUIDE.md`)**

### Brief Summary of Deployment Steps:

1.  **Database**: Created an RDS MySQL instance (`shopdb-instance`).
2.  **Server**: Launched an EC2 instance (Amazon Linux/Ubuntu).
3.  **Security**: Configured Security Groups to allow HTTP (80) and SSH (22) for EC2, and MySQL (3306) from EC2 to RDS.
4.  **Environment**: Installed Node.js, Git on EC2.
5.  **Code**: Cloned repository to EC2.
6.  **Config**: Created `.env` file with RDS credentials.
7.  **Run**: Started application using `pm2` for continuous uptime.

---

## 4. Run Instructions

1.  `npm install`
2.  Create `.env` file (see provided example).
3.  Import `schema.sql` to your MySQL server.
4.  Run `npm start`
