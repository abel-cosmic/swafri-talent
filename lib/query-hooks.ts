"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { TalentStatus, type TalentProfile } from "@/generated/prisma/browser";

import {
  adminApproveTalent,
  adminDeleteTalent,
  adminRejectTalent,
  adminUpdateTalent,
  getTalentById,
  getTalents,
  submitTalent,
} from "@/actions/talent";
import { banUser, createAdminUser, deleteUser, listUsers, setUserRole } from "@/actions/users";
import { queryKeys } from "@/lib/query-keys";

type TalentListParams = {
  page?: number;
  search?: string;
  skill?: string;
  minYears?: number;
  maxYears?: number;
  hasResume?: boolean;
  hasImage?: boolean;
  sortBy?: "newest" | "oldest" | "experience_desc" | "experience_asc" | "name_asc" | "name_desc";
  status?: TalentStatus;
  adminView?: boolean;
};

type UsersParams = { search?: string; limit?: number; offset?: number };

export function useTalentsQuery(params: TalentListParams) {
  return useQuery({
    queryKey: queryKeys.talents({ ...params, status: params.status }),
    queryFn: async () => {
      const result = await getTalents(params);
      if (!result.success) throw new Error(result.error ?? "Failed to load talents.");
      return result.data ?? { items: [], total: 0 };
    },
  });
}

export function useTalentDetailQuery(id: string) {
  return useQuery({
    queryKey: queryKeys.talentDetail(id),
    queryFn: async () => getTalentById(id),
    enabled: Boolean(id),
  });
}

export function useUsersQuery(params: UsersParams = {}) {
  return useQuery({
    queryKey: queryKeys.users(params),
    queryFn: async () => {
      const result = await listUsers(params);
      if (!result.success) throw new Error(result.error ?? "Failed to load users.");
      return result.data ?? { users: [], total: 0 };
    },
  });
}

export function useTalentMutations() {
  const queryClient = useQueryClient();

  const invalidateTalents = async (id?: string) => {
    await queryClient.invalidateQueries({ queryKey: ["talents"] });
    if (id) await queryClient.invalidateQueries({ queryKey: queryKeys.talentDetail(id) });
  };

  return {
    submit: useMutation({
      mutationFn: submitTalent,
      onSuccess: async () => {
        await invalidateTalents();
      },
    }),
    approve: useMutation({
      mutationFn: adminApproveTalent,
      onSuccess: async (_data, id) => {
        await invalidateTalents(id);
      },
    }),
    reject: useMutation({
      mutationFn: adminRejectTalent,
      onSuccess: async (_data, id) => {
        await invalidateTalents(id);
      },
    }),
    remove: useMutation({
      mutationFn: adminDeleteTalent,
      onSuccess: async (_data, id) => {
        await invalidateTalents(id);
      },
    }),
    update: useMutation({
      mutationFn: ({ id, payload }: { id: string; payload: unknown }) => adminUpdateTalent(id, payload),
      onSuccess: async (_data, vars) => {
        await invalidateTalents(vars.id);
      },
    }),
  };
}

export function useUserMutations() {
  const queryClient = useQueryClient();
  const invalidateUsers = async () => queryClient.invalidateQueries({ queryKey: ["users"] });

  return {
    create: useMutation({
      mutationFn: createAdminUser,
      onSuccess: invalidateUsers,
    }),
    setRole: useMutation({
      mutationFn: setUserRole,
      onSuccess: invalidateUsers,
    }),
    ban: useMutation({
      mutationFn: banUser,
      onSuccess: invalidateUsers,
    }),
    remove: useMutation({
      mutationFn: deleteUser,
      onSuccess: invalidateUsers,
    }),
  };
}

export type TalentRow = TalentProfile;
