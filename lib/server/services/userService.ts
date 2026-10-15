import "server-only";
import * as repo from "@/lib/server/repositories/userRepository";
import type { Role } from "@/lib/types";
import { AppError } from "@/lib/server/errors";

export async function listUsers() {
  return repo.listUsers();
}

export async function inviteUser(data: { email: string; role: Role; name?: string }) {
  // TODO(step-6): Wire Firebase Admin Auth user creation and custom claims in Step 6
  const existingUsers = await repo.listUsers();
  if (existingUsers.some((u) => u.email.toLowerCase() === data.email.toLowerCase())) {
    throw new AppError("USER_EXISTS", `User with email '${data.email}' already exists`, 400);
  }

  const uid = `usr_${crypto.randomUUID().slice(0, 8)}`;
  return repo.createUserRecord({
    uid,
    email: data.email,
    name: data.name || data.email.split("@")[0],
    role: data.role,
    status: "active",
  });
}

export async function updateUserRole(
  targetUid: string,
  newRole: Role,
  actorUid: string
) {
  if (targetUid === actorUid) {
    throw new AppError(
      "SELF_ROLE_CHANGE_FORBIDDEN",
      "You cannot change your own administrative role",
      400
    );
  }

  return repo.updateUserRole(targetUid, newRole);
}

export async function disableUser(
  targetUid: string,
  disabled: boolean,
  actorUid: string
) {
  if (targetUid === actorUid) {
    throw new AppError(
      "SELF_DISABLE_FORBIDDEN",
      "You cannot disable your own administrator account",
      400
    );
  }

  return repo.disableUser(targetUid, disabled);
}
