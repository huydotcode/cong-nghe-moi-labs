const bcrypt = require("bcryptjs");
const userRepository = require("../repositories/userRepository");

const SALT_ROUNDS = 10;

/**
 * Hash a password
 */
const hashPassword = async (password) => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * Compare password with hash
 */
const comparePassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

/**
 * Authenticate user by username and password
 * @returns {Object|null} User object if authenticated, null otherwise
 */
const authenticate = async (username, password) => {
  const user = await userRepository.findByUsername(username);

  if (!user) {
    return null;
  }

  const isMatch = await comparePassword(password, user.password);

  if (!isMatch) {
    return null;
  }

  // Return user without password
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

/**
 * Create a new user with hashed password
 */
const createUser = async (userData) => {
  const { randomUUID } = require("crypto");

  const hashedPassword = await hashPassword(userData.password);

  const newUser = {
    userId: randomUUID(),
    username: userData.username,
    password: hashedPassword,
    role: userData.role || "staff",
  };

  return userRepository.create(newUser);
};

module.exports = {
  hashPassword,
  comparePassword,
  authenticate,
  createUser,
};
