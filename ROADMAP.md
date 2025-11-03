# 🎯 Project Roadmap

Track feature implementation progress. Check off items as you complete them!

---

## ✅ Phase 1: Core Setup (Completed)
- [x] User authentication with JWT
- [x] Project CRUD operations
- [x] Task CRUD operations
- [x] Dashboard statistics
- [x] User-Project-Task relations

---

## 🚀 Phase 2: Task Enhancements (Quick Wins)

### Task Status & Priority
- [ ] Add task status field (TODO, IN_PROGRESS, DONE)
- [ ] Add task priority field (LOW, MEDIUM, HIGH, CRITICAL)
- [ ] Update DTOs and controllers for status/priority
- [ ] Add filters for status and priority

### Task Scheduling
- [ ] Add task due date field
- [ ] Add filter for overdue tasks
- [ ] Add filter for "due today" and "due this week"

---

## 👥 Phase 3: Collaboration Features

### Task Assignment
- [ ] Add assignedToUserId field to tasks
- [ ] Update task creation to support assignment
- [ ] Add "My Tasks" filter endpoint
- [ ] Add "Assigned by Me" filter

### Comments System
- [ ] Create Comment model (text, userId, taskId)
- [ ] POST /api/tasks/:id/comments endpoint
- [ ] GET /api/tasks/:id/comments endpoint
- [ ] DELETE /api/comments/:id endpoint

### Activity Tracking
- [ ] Create ActivityLog model
- [ ] Log task creation, updates, completion
- [ ] GET /api/tasks/:id/activity endpoint

---

## 🏷️ Phase 4: Organization Features

### Labels & Tags
- [ ] Create Label model (name, color)
- [ ] Create Task-Label many-to-many relation
- [ ] POST /api/labels endpoint
- [ ] GET /api/labels endpoint
- [ ] Add/remove labels from tasks
- [ ] Filter tasks by label

### Project Members
- [ ] Create ProjectMember join table
- [ ] Add users to projects (many-to-many)
- [ ] POST /api/projects/:id/members endpoint
- [ ] GET /api/projects/:id/members endpoint
- [ ] Check ownership before CRUD operations

---

## 📊 Phase 5: Enhanced Dashboard

### Statistics & Reports
- [ ] Add "Tasks completed this week" stat
- [ ] Add "My tasks vs Team tasks" breakdown
- [ ] Add project progress calculation (completed/total)
- [ ] Add user productivity stats

### Project Progress
- [ ] Calculate project completion percentage
- [ ] Show progress bar on project list
- [ ] Add "Projects near deadline" section

---

## 👤 Phase 6: User Experience

### User Profile
- [ ] Add avatarUrl field to User model
- [ ] GET /api/user/profile endpoint (own profile)
- [ ] PUT /api/user/profile endpoint (update profile)
- [ ] Add change password endpoint

### Favorites & Bookmarks
- [ ] Add isFavorite field to Project
- [ ] POST /api/projects/:id/favorite endpoint
- [ ] GET /api/projects/favorites endpoint
- [ ] Add same for tasks

---

## 📧 Phase 7: Notifications

### Email Notifications
- [ ] Setup email service (SendGrid/Mailgun)
- [ ] Send OTP email on signup
- [ ] Send password reset OTP email
- [ ] Send email on task assignment
- [ ] Send email on task comment (optional)

---

## 🔍 Phase 8: Advanced Features

### Enhanced Search
- [ ] Add full-text search for tasks
- [ ] Search across projects and tasks
- [ ] Advanced filter combinations

### Task Notes
- [ ] Add notes field to Task (long text)
- [ ] Support markdown formatting (frontend)

### Recurring Tasks
- [ ] Add isRecurring field to Task
- [ ] Add recurrencePattern field
- [ ] Auto-create recurring tasks (cron job)

---

## 📝 Notes

- Focus on completing one phase before moving to the next
- Test each feature thoroughly before marking as complete
- Update database schema first, then generate Prisma client
- Don't forget to update API documentation as you add features

---

**Last Updated:** December 2024

