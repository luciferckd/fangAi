/**
 * @copyright 2024 FangAI
 * @license MIT
 * @author FangAI
 * 
 * Local Mock Storage Provider for Appwrite.
 * Emulates Appwrite Account, Databases, and Avatars using localStorage
 * so users can create accounts, log in, chat, and manage conversations
 * without being blocked by paused/offline Appwrite Cloud projects.
 */

const STORAGE_KEYS = {
  USERS: 'fang_users',
  SESSION: 'fang_session',
  CONVERSATIONS: 'fang_conversations',
  CHATS: 'fang_chats',
};

const getStorage = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (err) {
    console.warn(`[LocalMock] Failed to read ${key}:`, err);
    return fallback;
  }
};

const setStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`[LocalMock] Failed to write ${key}:`, err);
  }
};

const removeStorage = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (err) {
    console.warn(`[LocalMock] Failed to remove ${key}:`, err);
  }
};

/**
 * Mock Appwrite Account API
 */
export const mockAccount = {
  /**
   * Create a new user account
   */
  async create(userId, email, password, name) {
    const users = getStorage(STORAGE_KEYS.USERS, []);
    const existing = users.find(
      (u) => u.email.toLowerCase() === (email || '').toLowerCase()
    );

    if (existing) {
      throw new Error('A user with the same email already exists in your project.');
    }

    const newUser = {
      $id: userId || 'user_' + Date.now(),
      name: name || (email ? email.split('@')[0] : 'User'),
      email,
      password,
      $createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    setStorage(STORAGE_KEYS.USERS, users);

    return {
      $id: newUser.$id,
      name: newUser.name,
      email: newUser.email,
    };
  },

  /**
   * Log in user with email & password
   */
  async createEmailPasswordSession(email, password) {
    const users = getStorage(STORAGE_KEYS.USERS, []);
    let user = users.find(
      (u) => u.email.toLowerCase() === (email || '').toLowerCase()
    );

    if (!user) {
      // If user registered earlier or logs in directly, auto-create to ensure smooth onboarding
      user = {
        $id: 'user_' + Date.now(),
        name: email.split('@')[0] || 'User',
        email,
        password,
        $createdAt: new Date().toISOString(),
      };
      users.push(user);
      setStorage(STORAGE_KEYS.USERS, users);
    } else if (user.password && user.password !== password) {
      throw new Error('Invalid credentials. Please check the email and password.');
    }

    const session = {
      userId: user.$id,
      user: {
        $id: user.$id,
        name: user.name,
        email: user.email,
      },
      expire: new Date(Date.now() + 86400000 * 30).toISOString(),
    };

    setStorage(STORAGE_KEYS.SESSION, session);
    return session;
  },

  /**
   * Get currently authenticated user
   */
  async get() {
    const session = getStorage(STORAGE_KEYS.SESSION, null);
    if (!session || !session.user) {
      throw new Error('User (role: guests) missing scope (account)');
    }
    return session.user;
  },

  /**
   * Delete current session (logout)
   */
  async deleteSession() {
    removeStorage(STORAGE_KEYS.SESSION);
    return { status: true };
  },

  /**
   * Password recovery mocks
   */
  async createRecovery() {
    return { status: true };
  },

  async updateRecovery(userId, secret, password) {
    const session = getStorage(STORAGE_KEYS.SESSION, null);
    if (session?.user) {
      const users = getStorage(STORAGE_KEYS.USERS, []);
      const user = users.find((u) => u.$id === session.user.$id);
      if (user) {
        user.password = password;
        setStorage(STORAGE_KEYS.USERS, users);
      }
    }
    return { status: true };
  },
};

/**
 * Mock Appwrite Databases API
 */
export const mockDatabases = {
  /**
   * List documents from collection
   */
  async listDocuments(databaseId, collectionId, queries = []) {
    const normalized = (collectionId || '').toLowerCase();
    const session = getStorage(STORAGE_KEYS.SESSION, null);
    const currentUserId = session?.user?.$id;

    if (normalized === 'conversation') {
      const conversations = getStorage(STORAGE_KEYS.CONVERSATIONS, []);
      let filtered = currentUserId
        ? conversations.filter((c) => c.user_id === currentUserId)
        : conversations;

      filtered.sort((a, b) => new Date(b.$createdAt) - new Date(a.$createdAt));

      return {
        total: filtered.length,
        documents: filtered.map((c) => ({
          $id: c.$id,
          title: c.title,
          $createdAt: c.$createdAt,
          user_id: c.user_id,
        })),
      };
    }

    return { total: 0, documents: [] };
  },

  /**
   * Get single document
   */
  async getDocument(databaseId, collectionId, documentId) {
    const normalized = (collectionId || '').toLowerCase();

    if (normalized === 'conversation') {
      const conversations = getStorage(STORAGE_KEYS.CONVERSATIONS, []);
      const conv = conversations.find((c) => c.$id === documentId);
      if (!conv) {
        throw new Error(`Document with ID "${documentId}" could not be found.`);
      }

      const allChats = getStorage(STORAGE_KEYS.CHATS, []);
      const chats = allChats.filter((c) => c.conversation === documentId);
      chats.sort((a, b) => new Date(a.$createdAt) - new Date(b.$createdAt));

      return {
        ...conv,
        chats,
      };
    }

    if (normalized === 'chats') {
      const chats = getStorage(STORAGE_KEYS.CHATS, []);
      const chat = chats.find((c) => c.$id === documentId);
      if (!chat) {
        throw new Error(`Document with ID "${documentId}" could not be found.`);
      }
      return chat;
    }

    return {};
  },

  /**
   * Create document
   */
  async createDocument(databaseId, collectionId, documentId, data) {
    const normalized = (collectionId || '').toLowerCase();
    const now = new Date().toISOString();

    if (normalized === 'conversation') {
      const conversations = getStorage(STORAGE_KEYS.CONVERSATIONS, []);
      const newConv = {
        $id: documentId,
        title: data.title || 'New Chat',
        user_id: data.user_id,
        $createdAt: now,
      };
      conversations.unshift(newConv);
      setStorage(STORAGE_KEYS.CONVERSATIONS, conversations);
      return newConv;
    }

    if (normalized === 'chats') {
      const chats = getStorage(STORAGE_KEYS.CHATS, []);
      const newChat = {
        $id: documentId,
        user_prompt: data.user_prompt,
        ai_response: data.ai_response,
        conversation: data.conversation,
        $createdAt: now,
      };
      chats.push(newChat);
      setStorage(STORAGE_KEYS.CHATS, chats);
      return newChat;
    }

    return { $id: documentId, ...data, $createdAt: now };
  },

  /**
   * Delete document
   */
  async deleteDocument(databaseId, collectionId, documentId) {
    const normalized = (collectionId || '').toLowerCase();

    if (normalized === 'conversation') {
      const conversations = getStorage(STORAGE_KEYS.CONVERSATIONS, []);
      setStorage(
        STORAGE_KEYS.CONVERSATIONS,
        conversations.filter((c) => c.$id !== documentId)
      );

      const chats = getStorage(STORAGE_KEYS.CHATS, []);
      setStorage(
        STORAGE_KEYS.CHATS,
        chats.filter((c) => c.conversation !== documentId)
      );
    }

    return { status: true };
  },
};

/**
 * Mock Appwrite Avatars API
 */
export const mockAvatars = {
  getInitials(name = 'User', width = 48, height = 48) {
    const cleanName = (name || 'User').trim();
    const parts = cleanName.split(/\s+/);
    const initials = (
      parts.length > 1 ? parts[0][0] + parts[1][0] : cleanName.slice(0, 2)
    ).toUpperCase() || 'U';

    const fontSize = Math.floor(width * 0.42);

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <defs>
        <linearGradient id="avatarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#33FFBB"/>
          <stop offset="100%" stop-color="#2BD19A"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" rx="50%" fill="url(#avatarGrad)"/>
      <text x="50%" y="54%" font-family="system-ui, -apple-system, sans-serif" font-size="${fontSize}px" font-weight="700" fill="#171D1B" text-anchor="middle" dominant-baseline="middle">${initials}</text>
    </svg>`;

    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  },
};
