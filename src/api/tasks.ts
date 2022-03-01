// Functions that call the tasks API

export const fetchTaskInstance = async (taskId: string) => {
  if (!taskId) return;
  const response = await fetch(`/api/v4/tasks/${taskId}/`, {
    credentials: "same-origin",
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  return response.json();
};
