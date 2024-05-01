# Supabase Slack Clone 🚀

Welcome to the Supabase Slack Clone project! This open-source initiative is dedicated to creating a feature-rich chat application inspired by Slack, utilizing Next.js for the frontend and Supabase for the backend. This project is part of the [docsplus project](https://github.com/docs-plus/docs.plus), demonstrating integrated solutions and collaborative features.

## Why Build Another Chat App?

Our primary aim is to explore and demonstrate the capabilities of Supabase, showcasing the potential of this platform as a backend service. This project serves as a real-world test to evaluate the power of PostgreSQL through Supabase's interface, addressing numerous challenges along the way.

### Challenges and Innovations

Throughout the development, we encountered several limitations with Supabase's real-time features. However, these obstacles led us to devise innovative solutions that not only work around these hurdles but also enhance our application's functionality.

### Focus on Performance

Performance is a key concern for us. We strive to ensure that our application runs efficiently with minimal server resources. One of the decisions we made to boost performance was to disable Row Level Security (RLS), as it introduced latency in requests. This choice was made to prioritize responsiveness and speed, making our chat application swift and lightweight.

This initiative is an extension of the broader [docsplus project](https://github.com/docs-plus/docs.plus), which provides a suite of tools for real-time collaboration and information management. By connecting these projects, we aim to enrich the functionality and demonstrate the seamless integration possible with Supabase and other open-source technologies.

Join us in building the ultimate chat application—enhancing communication through collaborative development while pushing the limits of what Supabase can do!

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
