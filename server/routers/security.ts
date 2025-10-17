import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import {
  upsertConsent,
  getUserConsents,
  hasAcceptedConsents,
  createAuditLog,
  getAuditLogs,
  createLgpdRequest,
  getLgpdRequests,
  updateLgpdRequest,
} from "../db";
import { nanoid } from "nanoid";

export const securityRouter = router({
  // Check if user has accepted consents
  checkConsents: protectedProcedure.query(async ({ ctx }) => {
    const hasAccepted = await hasAcceptedConsents(ctx.user.id);
    return { hasAccepted };
  }),

  // Get user consents
  getConsents: protectedProcedure.query(async ({ ctx }) => {
    return await getUserConsents(ctx.user.id);
  }),

  // Accept consents (terms, privacy)
  acceptConsents: protectedProcedure
    .input(
      z.object({
        terms: z.boolean(),
        privacy: z.boolean(),
        marketing: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const now = new Date();
      const ipAddress = ctx.req.ip || ctx.req.socket.remoteAddress || "unknown";
      const userAgent = ctx.req.headers["user-agent"] || "unknown";

      // Create consent records
      if (input.terms) {
        await upsertConsent({
          id: nanoid(),
          userId: ctx.user.id,
          type: "terms",
          accepted: true,
          acceptedAt: now,
          ipAddress,
          userAgent,
          version: "1.0",
        });
      }

      if (input.privacy) {
        await upsertConsent({
          id: nanoid(),
          userId: ctx.user.id,
          type: "privacy",
          accepted: true,
          acceptedAt: now,
          ipAddress,
          userAgent,
          version: "1.0",
        });
      }

      if (input.marketing) {
        await upsertConsent({
          id: nanoid(),
          userId: ctx.user.id,
          type: "marketing",
          accepted: true,
          acceptedAt: now,
          ipAddress,
          userAgent,
          version: "1.0",
        });
      }

      // Log the action
      await createAuditLog({
        id: nanoid(),
        userId: ctx.user.id,
        action: "accept_consents",
        resource: "consent",
        resourceId: ctx.user.id,
        ipAddress,
        userAgent,
        details: JSON.stringify({ terms: input.terms, privacy: input.privacy, marketing: input.marketing }),
      });

      return { success: true };
    }),

  // Get audit logs (user can see their own)
  getMyAuditLogs: protectedProcedure
    .input(
      z.object({
        limit: z.number().optional(),
        offset: z.number().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await getAuditLogs({
        userId: ctx.user.id,
        limit: input.limit,
        offset: input.offset,
      });
    }),

  // Request data deletion (LGPD Art. 18)
  requestDeletion: protectedProcedure
    .input(
      z.object({
        reason: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const ipAddress = ctx.req.ip || ctx.req.socket.remoteAddress || "unknown";
      const userAgent = ctx.req.headers["user-agent"] || "unknown";

      await createLgpdRequest({
        id: nanoid(),
        userId: ctx.user.id,
        type: "deletion",
        status: "pending",
        reason: input.reason,
        requestedAt: new Date(),
      });

      // Log the action
      await createAuditLog({
        id: nanoid(),
        userId: ctx.user.id,
        action: "request_deletion",
        resource: "user",
        resourceId: ctx.user.id,
        ipAddress,
        userAgent,
        details: JSON.stringify({ reason: input.reason }),
      });

      return { success: true, message: "Sua solicitação foi recebida e será processada em até 7 dias úteis." };
    }),

  // Request data export (LGPD Art. 18 - Portability)
  requestExport: protectedProcedure.mutation(async ({ ctx }) => {
    const ipAddress = ctx.req.ip || ctx.req.socket.remoteAddress || "unknown";
    const userAgent = ctx.req.headers["user-agent"] || "unknown";

    await createLgpdRequest({
      id: nanoid(),
      userId: ctx.user.id,
      type: "portability",
      status: "pending",
      requestedAt: new Date(),
    });

    // Log the action
    await createAuditLog({
      id: nanoid(),
      userId: ctx.user.id,
      action: "request_export",
      resource: "user",
      resourceId: ctx.user.id,
      ipAddress,
      userAgent,
    });

    return { success: true, message: "Seus dados serão exportados e enviados por email em breve." };
  }),

  // Get my LGPD requests
  getMyRequests: protectedProcedure.query(async ({ ctx }) => {
    return await getLgpdRequests({ userId: ctx.user.id });
  }),
});

