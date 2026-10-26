import { apiPost } from "./api";
import { queryClient } from "./queryClient";

export async function beginSession(): Promise<void> {
  queryClient.clear();
}

export async function endSession(): Promise<void> {
  try {
    await apiPost("/auth/logout");
  } finally {
    queryClient.clear();
  }
}
