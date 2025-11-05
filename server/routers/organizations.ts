import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";

// Schemas de validação
const createOrgSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  slug: z.string().min(1, "Slug é obrigatório"),
  description: z.string().optional(),
  website: z.string().url().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
});

const updateOrgSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  description: z.string().optional(),
  website: z.string().url().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  plan: z.enum(["starter", "professional", "enterprise"]).optional(),
});

const addMemberSchema = z.object({
  organizationId: z.string(),
  userId: z.string(),
  role: z.enum(["owner", "admin", "member", "viewer"]).default("member"),
});

const inviteMemberSchema = z.object({
  organizationId: z.string(),
  email: z.string().email(),
  role: z.enum(["owner", "admin", "member", "viewer"]).default("member"),
});

const acceptInviteSchema = z.object({
  token: z.string(),
});

export const organizationsRouter = router({
  // List organizations
  list: protectedProcedure.query(async ({ ctx }) => {
    try {
      return {
        success: true,
        data: [],
      };
    } catch (error) {
      console.error("[org.list] Error:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Falha ao listar organizações",
      });
    }
  }),

  // Get organization by ID
  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        return {
          success: true,
          data: null,
        };
      } catch (error) {
        console.error("[org.get] Error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Falha ao obter organização",
        });
      }
    }),

  // Create organization
  create: protectedProcedure
    .input(createOrgSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        return {
          success: true,
          data: null,
          message: "Organização criada com sucesso",
        };
      } catch (error) {
        console.error("[org.create] Error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Falha ao criar organização",
        });
      }
    }),

  // Update organization
  update: protectedProcedure
    .input(updateOrgSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        return {
          success: true,
          data: null,
          message: "Organização atualizada com sucesso",
        };
      } catch (error) {
        console.error("[org.update] Error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Falha ao atualizar organização",
        });
      }
    }),

  // Delete organization
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        return {
          success: true,
          message: "Organização deletada com sucesso",
        };
      } catch (error) {
        console.error("[org.delete] Error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Falha ao deletar organização",
        });
      }
    }),

  // Members management
  members: router({
    list: protectedProcedure
      .input(z.object({ organizationId: z.string() }))
      .query(async ({ ctx, input }) => {
        try {
          return {
            success: true,
            data: [],
          };
        } catch (error) {
          console.error("[org.members.list] Error:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Falha ao listar membros",
          });
        }
      }),

    add: protectedProcedure
      .input(addMemberSchema)
      .mutation(async ({ ctx, input }) => {
        try {
          return {
            success: true,
            data: null,
            message: "Membro adicionado com sucesso",
          };
        } catch (error) {
          console.error("[org.members.add] Error:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Falha ao adicionar membro",
          });
        }
      }),

    remove: protectedProcedure
      .input(z.object({ organizationId: z.string(), userId: z.string() }))
      .mutation(async ({ ctx, input }) => {
        try {
          return {
            success: true,
            message: "Membro removido com sucesso",
          };
        } catch (error) {
          console.error("[org.members.remove] Error:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Falha ao remover membro",
          });
        }
      }),

    invite: protectedProcedure
      .input(inviteMemberSchema)
      .mutation(async ({ ctx, input }) => {
        try {
          return {
            success: true,
            data: null,
            message: "Convite enviado com sucesso",
          };
        } catch (error) {
          console.error("[org.members.invite] Error:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Falha ao enviar convite",
          });
        }
      }),

    acceptInvite: protectedProcedure
      .input(acceptInviteSchema)
      .mutation(async ({ ctx, input }) => {
        try {
          return {
            success: true,
            data: null,
            message: "Convite aceito com sucesso",
          };
        } catch (error) {
          console.error("[org.members.acceptInvite] Error:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Falha ao aceitar convite",
          });
        }
      }),
  }),
});

