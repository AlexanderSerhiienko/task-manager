export const taskAssigneeSelect = {
  id: true,
  email: true,
  name: true,
  image: true,
} as const;

export const taskIncludeAssignee = {
  assignee: {
    select: taskAssigneeSelect,
  },
} as const;

export const workspaceMemberForTasksSelect = {
  userId: true,
  role: true,
  user: {
    select: taskAssigneeSelect,
  },
} as const;
