"use client";

import * as React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listUsers, inviteUser, updateUserRole, disableUser } from "@/lib/admin/data";
import type { ClientAppUser, Role } from "@/lib/types";
import { useAdminAuth } from "@/components/admin/AdminAuthContext";
import { useAdminToast } from "@/components/admin/AdminProviders";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatusChip } from "@/components/admin/StatusChip";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { EmptyState } from "@/components/admin/EmptyState";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { formatDate } from "@/lib/utils";
import { UserPlus, UserX, UserCheck, AlertCircle } from "lucide-react";

export default function UsersAdminPage() {
  const queryClient = useQueryClient();
  const { user: currentUser, isAdmin } = useAdminAuth();
  const { showToast } = useAdminToast();

  const [inviteOpen, setInviteOpen] = React.useState(false);
  const [inviteEmail, setInviteEmail] = React.useState("");
  const [inviteName, setInviteName] = React.useState("");
  const [inviteRole, setInviteRole] = React.useState<Role>("staff");
  const [confirmDisableTarget, setConfirmDisableTarget] = React.useState<ClientAppUser | null>(null);

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["admin", "users"],
    queryFn: listUsers,
  });

  // Invite user mutation
  const inviteMutation = useMutation({
    mutationFn: async () => {
      if (!inviteEmail.trim() || !inviteName.trim()) {
        throw new Error("Name and Email are required.");
      }
      return inviteUser({
        email: inviteEmail.trim(),
        name: inviteName.trim(),
        role: inviteRole,
      });
    },
    onSuccess: (newUser) => {
      showToast(`Invited ${newUser.name} as ${newUser.role}`);
      setInviteOpen(false);
      setInviteEmail("");
      setInviteName("");
      setInviteRole("staff");
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
    onError: (err: Error) => {
      showToast(err.message, "error");
    },
  });

  // Update role mutation
  const changeRoleMutation = useMutation({
    mutationFn: ({ uid, role }: { uid: string; role: Role }) => updateUserRole(uid, role),
    onSuccess: (updated) => {
      showToast(`Updated ${updated.name}'s role to ${updated.role}`);
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
    onError: (err: Error) => {
      showToast(err.message, "error");
    },
  });

  // Disable/enable mutation
  const disableMutation = useMutation({
    mutationFn: ({ uid, disabled }: { uid: string; disabled: boolean }) =>
      disableUser(uid, disabled),
    onSuccess: (updated) => {
      showToast(
        `User ${updated.name} ${updated.status === "disabled" ? "disabled" : "re-enabled"}`
      );
      setConfirmDisableTarget(null);
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });

  if (!isAdmin) {
    return (
      <EmptyState
        title="Admin Access Required"
        description="Only clinic administrators can view and manage staff accounts."
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Staff & User Management"
        description="Invite clinic receptionists and coordinators, assign permission roles, and control portal access."
        badge={
          <span className="rounded-full bg-primary-container px-3 py-1 text-xs font-bold text-on-primary-container">
            {users.length} Team Members
          </span>
        }
        actions={
          <Button
            type="button"
            variant="filled"
            size="sm"
            onClick={() => setInviteOpen(true)}
            leftIcon={<UserPlus className="h-4 w-4" />}
          >
            Invite Staff Member
          </Button>
        }
      />

      {/* Users Table / Card List */}
      <div className="rounded-2xl border border-outline-variant/60 bg-surface divide-y divide-outline-variant/40 overflow-hidden shadow-2xs">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="p-4 h-20 animate-pulse bg-surface" />
          ))
        ) : users.length > 0 ? (
          users.map((u) => {
            const isSelf = u.uid === currentUser.uid || u.email === currentUser.email;

            return (
              <div
                key={u.uid}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-surface-container-low transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary-container text-on-primary-container font-bold text-sm">
                    {u.name.charAt(0)}
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-on-surface">{u.name}</span>
                      {isSelf && (
                        <span className="rounded-full bg-primary/10 text-primary px-2 py-0.5 text-[10px] font-bold">
                          You
                        </span>
                      )}
                      <StatusChip status={u.status} size="sm" />
                    </div>
                    <p className="text-xs text-on-surface-variant font-mono">{u.email}</p>
                    <p className="text-[11px] text-on-surface-variant/70">
                      Added {formatDate(u.createdAt, { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                  {/* Role Selector */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-on-surface-variant">Role:</span>
                    <select
                      value={u.role}
                      disabled={isSelf}
                      onChange={(e) =>
                        changeRoleMutation.mutate({
                          uid: u.uid,
                          role: e.target.value as Role,
                        })
                      }
                      title={isSelf ? "You cannot modify your own administrator role" : undefined}
                      className="rounded-xl border border-outline-variant bg-surface px-3 py-1.5 text-xs font-semibold text-on-surface disabled:opacity-60 disabled:cursor-not-allowed focus:border-primary focus:outline-none"
                    >
                      <option value="admin">Admin</option>
                      <option value="staff">Staff</option>
                    </select>
                  </div>

                  {/* Disable / Enable Button */}
                  {!isSelf && (
                    <button
                      type="button"
                      onClick={() => {
                        if (u.status === "active") {
                          setConfirmDisableTarget(u);
                        } else {
                          disableMutation.mutate({ uid: u.uid, disabled: false });
                        }
                      }}
                      className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                        u.status === "active"
                          ? "bg-rose-50 text-rose-700 hover:bg-rose-100"
                          : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                      }`}
                    >
                      {u.status === "active" ? (
                        <>
                          <UserX className="h-3.5 w-3.5" />
                          <span>Disable</span>
                        </>
                      ) : (
                        <>
                          <UserCheck className="h-3.5 w-3.5" />
                          <span>Enable</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <EmptyState title="No Users Found" description="Invite team members to help manage appointments." />
        )}
      </div>

      {/* Invite User Dialog */}
      {inviteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setInviteOpen(false)} />
          <div className="relative w-full max-w-md rounded-3xl bg-surface border border-outline-variant p-6 shadow-xl z-10 space-y-4">
            <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-primary" />
              <span>Invite New Team Member</span>
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1">
                  Full Name *
                </label>
                <Input
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  placeholder="e.g. Ramesh Joshi"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1">
                  Email Address *
                </label>
                <Input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="ramesh.desk@ayurvedaclinic.com"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1">
                  Permission Role
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as Role)}
                  className="w-full rounded-2xl border border-outline-variant bg-surface px-4 py-2.5 text-sm text-on-surface focus:border-primary focus:outline-none"
                >
                  <option value="staff">Staff (Appointments & Messages only)</option>
                  <option value="admin">Admin (Full content & user control)</option>
                </select>
              </div>

              <div className="rounded-xl bg-surface-container-low p-3 text-[11px] text-on-surface-variant flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>
                  The user will be created with active status and can immediately log in to the portal using this email.
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-outline-variant/40">
              <Button type="button" variant="text" size="sm" onClick={() => setInviteOpen(false)}>
                Cancel
              </Button>
              <Button
                type="button"
                variant="filled"
                size="sm"
                onClick={() => inviteMutation.mutate()}
                isLoading={inviteMutation.isPending}
              >
                Send Invite
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Disable User Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(confirmDisableTarget)}
        onClose={() => setConfirmDisableTarget(null)}
        onConfirm={() =>
          confirmDisableTarget &&
          disableMutation.mutate({ uid: confirmDisableTarget.uid, disabled: true })
        }
        title="Disable User Account?"
        description={`Are you sure you want to disable ${confirmDisableTarget?.name}? They will no longer be able to log in to the clinic admin portal.`}
        confirmLabel="Disable Account"
        isLoading={disableMutation.isPending}
      />
    </div>
  );
}
