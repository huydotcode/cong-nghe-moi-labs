const db = require("./mysql");

async function initDB() {
  try {
    // Products table
    const createProductsTableQuery = `
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        quantity INT NOT NULL
      );
    `;
    await db.query(createProductsTableQuery);
    console.log("Table 'products' checked/created.");

    // Users table
    const createUsersTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL
      );
    `;
    await db.query(createUsersTableQuery);
    console.log("Table 'users' checked/created.");

    // Insert dummy products if empty
    const [productRows] = await db.query(
      "SELECT COUNT(*) as count FROM products",
    );
    if (productRows[0].count === 0) {
      const insertProductsQuery = `
        INSERT INTO products (name, price, quantity) VALUES
        ('Laptop', 1200.00, 10),
        ('Mouse', 25.50, 50),
        ('Keyboard', 45.00, 30);
      `;
      await db.query(insertProductsQuery);
      console.log("Dummy products inserted.");
    }

    // Insert default admin user if empty
    const [userRows] = await db.query("SELECT COUNT(*) as count FROM users");
    if (userRows[0].count === 0) {
      await db.query(
        "INSERT INTO users (username, password) VALUES ('admin', '123456')",
      );
      console.log("Default admin user inserted.");
    }

    process.exit(0);
  } catch (err) {
    console.error("Error initializing database:", err);
    process.exit(1);
  }
}

initDB();
