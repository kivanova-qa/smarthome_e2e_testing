import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '..', '..', 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const LIGHTS_FILE = path.join(DATA_DIR, 'lights.json');

function ensureDataFiles() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2));
  }
  
  if (!fs.existsSync(LIGHTS_FILE)) {
    fs.writeFileSync(LIGHTS_FILE, JSON.stringify({}, null, 2));
  }
}

export function getUserByEmail(email) {
  ensureDataFiles();
  const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
  return users.find(user => user.email === email) || null;
}

export function createUser(email, hashedPassword, confirmationToken) {
  ensureDataFiles();
  const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
  
  const newUser = {
    id: uuidv4(),
    email,
    password: hashedPassword,
    confirmationToken,
    verified: false,
    createdAt: new Date().toISOString()
  };
  
  users.push(newUser);
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  
  initUserLights(newUser.id);
  
  return newUser;
}

export function verifyUser(token) {
  ensureDataFiles();
  const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
  
  const userIndex = users.findIndex(user => user.confirmationToken === token);
  if (userIndex === -1) {
    return null;
  }
  
  users[userIndex].verified = true;
  delete users[userIndex].confirmationToken;
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  
  return users[userIndex];
}

export function getUserById(userId) {
  ensureDataFiles();
  const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
  return users.find(user => user.id === userId) || null;
}

export function initiateAccountDeletion(userId, deleteToken) {
  ensureDataFiles();
  const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
  
  const userIndex = users.findIndex(user => user.id === userId);
  if (userIndex === -1) {
    throw new Error('User not found');
  }
  
  users[userIndex].deleteToken = deleteToken;
  users[userIndex].deleteTokenCreatedAt = new Date().toISOString();
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  
  return users[userIndex];
}

export function confirmAccountDeletion(token) {
  ensureDataFiles();
  const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
  const lightsData = JSON.parse(fs.readFileSync(LIGHTS_FILE, 'utf-8'));
  
  const userIndex = users.findIndex(user => user.deleteToken === token);
  if (userIndex === -1) {
    return null;
  }
  
  const deletedUser = users[userIndex];
  
  // Delete user
  users.splice(userIndex, 1);
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  
  // Delete user's lights
  delete lightsData[deletedUser.id];
  fs.writeFileSync(LIGHTS_FILE, JSON.stringify(lightsData, null, 2));
  
  return deletedUser;
}

export function deleteUser(userId) {
  ensureDataFiles();
  const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
  const lightsData = JSON.parse(fs.readFileSync(LIGHTS_FILE, 'utf-8'));
  
  const userIndex = users.findIndex(user => user.id === userId);
  if (userIndex === -1) {
    return null;
  }
  
  const deletedUser = users[userIndex];
  
  // Delete user
  users.splice(userIndex, 1);
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  
  // Delete user's lights
  delete lightsData[userId];
  fs.writeFileSync(LIGHTS_FILE, JSON.stringify(lightsData, null, 2));
  
  return deletedUser;
}

// Generate random color
function randomColor() {
  const colors = [
    '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7',
    '#dda15e', '#ff85a1', '#6c9a8b', '#a8dadc', '#ffd60a',
    '#e63946', '#f1faee', '#a8dadc', '#457b9d', '#1d3557'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

function initUserLights(userId) {
  ensureDataFiles();
  const lightsData = JSON.parse(fs.readFileSync(LIGHTS_FILE, 'utf-8'));
  
  const initialLights = [
    { id: uuidv4(), name: 'Living Room Light', isOn: false, color: randomColor() },
    { id: uuidv4(), name: 'Bedroom Light', isOn: false, color: randomColor() },
    { id: uuidv4(), name: 'Kitchen Light', isOn: false, color: randomColor() }
  ];
  
  lightsData[userId] = initialLights;
  fs.writeFileSync(LIGHTS_FILE, JSON.stringify(lightsData, null, 2));
}

export function getUserLights(userId) {
  ensureDataFiles();
  const lightsData = JSON.parse(fs.readFileSync(LIGHTS_FILE, 'utf-8'));
  return lightsData[userId] || [];
}

export function updateLight(userId, lightId, updates) {
  ensureDataFiles();
  const lightsData = JSON.parse(fs.readFileSync(LIGHTS_FILE, 'utf-8'));
  const userLights = lightsData[userId] || [];
  
  const lightIndex = userLights.findIndex(light => light.id === lightId);
  if (lightIndex === -1) {
    throw new Error('Light not found');
  }
  
  userLights[lightIndex] = { ...userLights[lightIndex], ...updates };
  lightsData[userId] = userLights;
  
  fs.writeFileSync(LIGHTS_FILE, JSON.stringify(lightsData, null, 2));
}

export function addLight(userId, lightName) {
  ensureDataFiles();
  const lightsData = JSON.parse(fs.readFileSync(LIGHTS_FILE, 'utf-8'));
  const userLights = lightsData[userId] || [];
  
  const newLight = {
    id: uuidv4(),
    name: lightName,
    isOn: false,
    color: randomColor()
  };
  
  userLights.push(newLight);
  lightsData[userId] = userLights;
  
  fs.writeFileSync(LIGHTS_FILE, JSON.stringify(lightsData, null, 2));
  return newLight;
}

export function deleteLight(userId, lightId) {
  ensureDataFiles();
  const lightsData = JSON.parse(fs.readFileSync(LIGHTS_FILE, 'utf-8'));
  const userLights = lightsData[userId] || [];
  
  const lightIndex = userLights.findIndex(light => light.id === lightId);
  if (lightIndex === -1) {
    throw new Error('Light not found');
  }
  
  userLights.splice(lightIndex, 1);
  lightsData[userId] = userLights;
  
  fs.writeFileSync(LIGHTS_FILE, JSON.stringify(lightsData, null, 2));
}

