# Supabase Slack Clone 🚀

Welcome to the Supabase Slack Clone project! This open-source initiative is all about creating a feature-rich chat application inspired by Slack. Dive into a world powered by Next.js for the frontend and Supabase for the backend, designed for developers and by developers.

## 🌟 Features Checklist

Keep track of our progress with this detailed feature checklist:

### 🔐 Authentication and User Profile

- [ ] User Authentication
- [ ] Edit Profile

### 🎨 User Interface

- ✅ Dark Mode 🌑, Light Mode 🌕
  - ✅ Save theme preference
- [ ] Responsive Design
  - ✅ Resizable Panels
- [ ] Progressive Web App (PWA)

### 🔔 Notifications

- [ ] Push Notifications
- [ ] Desktop Notifications
- ✅ Toast Notifications

### 📱💻 Platform-Specific Versions

- [ ] Desktop App
- [ ] Mobile App

### 💬 Messaging

- ✅ Emoji Reactions
- [ ] User Mentions `@user`
- [ ] Channel Mentions `@everyone`
- ✅ Threads (reply in thread)
- ✅ Pin Messages
- ✅ Edit Messages
- ✅ Delete Messages
- ✅ Reply to Messages
- ✅ Forward Messages

### 🛠️ Advanced Messaging Features

- ✅ Markdown Support
- ✅ Code Block Formatting and Syntax Highlighting

### 🎥 Media and Integrations

- [ ] Multimedia (Image, Voice, Video) File Uploads
- [ ] Giphy Integration
- [ ] YouTube Integration
- [ ] Spotify Integration
- [ ] Twitter Integration
- [ ] GitHub Integration

### 🎤👥 Communication Features

- [ ] Peer to Peer Video Chat
- [ ] Group Video Chat
- [ ] Screen Sharing

### 🚀 User Experience Enhancements

- ✅ Typing Indicators
- ✅ Read Receipts
- ✅ Presence Indicators
- ✅ Unread Messages
- ✅ Unread Channels
- ✅ Unread Threads
- [ ] Unread Mentions
- [ ] Unread Reactions
- [ ] Search
- ✅ Infinite Scroll
- [ ] Date Grouped Message Indicators

### ⭐ Suggested Additional Features

- [ ] Voice Messages
- [ ] Custom Emoji Support
- [ ] Link Previews
- [ ] Message Reactions with Custom Emojis
- [ ] Calendar Integration for Event Scheduling
- [ ] Collaboration Tools (e.g., Shared Documents, Whiteboards)

## 🚀 Quick Start Guide

To get started, ensure you have `pnpm` installed to manage project dependencies.

### Setting up the project locally

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-repo/supabase-slack-clone.git
   ```

2. **Install dependencies:**

   ```bash
   make install
   ```

3. **Start the application (backend and frontend):**

   ```bash
   make local
   ```

4. **Navigate to the application:**
   Open your browser and visit `http://localhost:3000`.

## 🛠 Makefile Commands

Here are some handy commands provided in the `Makefile` to help you manage the project easily:

- `make install`: Installs all project dependencies.
- `make local`: Boots up both the backend and frontend servers.
- `make back-start`: Launches the backend server.
- `make back-stop`: Halts the backend server.
- `make front-dev`: Activates the frontend development server.
- `make supabase-status`: Checks the status of the Supabase server.
- `make supabase-reset`: Resets the Supabase database to its initial state (with confirmation).
- `make supabase-seed`: Seeds the database with initial data for development.

## 🤝 Contribution

We love community contributions! 🌍 From bug reports to feature suggestions or code contributions, your input is highly valued.

## 📄 License

This project is proudly licensed under the [MIT License](link-to-license-file).

## 🙌 Acknowledgments

Big shoutout to these fantastic projects and libraries that make our work possible:

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.com/)
- [Zustand](https://github.com/pmndrs/zustand)
- [TailwindCSS](https://tailwindcss.com/)
- [And many more...](.)

Join us in building the ultimate chat application—enhancing communication through collaborative development!
