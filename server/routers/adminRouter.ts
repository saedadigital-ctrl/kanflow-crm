import { z } from "zod";
import { adminProcedure, publicProcedure, router } from "../_core/trpc";
import {
  getAllOrganizations,
  getOrganizationWithLicense,
  getAdminDashboardStats,
  suspendOrganization,
  activateOrganization,
  cancelOrganization,
  createLicense,
  updateLicense,
  getOrganizationLicense,
  createAuditLog,
} from "../db";

export const adminRouter = router({
  /**
   * Get admin dashboard statistics
   */
  getDashboardStats: adminProcedure.query(async () => {
    return await getAdminDashboardStats();
  }),

  /**
   * Get all organizations with pagination
   */
  listOrganizations: adminProcedure
    .input(
      z.object({
        status: z.enum(["active", "suspended", "cancelled"]).optional(),
        limit: z.number().min(1).max(100).default(50),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ input }) => {
      return await getAllOrganizations({
        status: input.status,
        limit: input.limit,
        offset: input.offset,
      });
    }),

  /**
   * Get organization details with license and subscription
   */
  getOrganization: adminProcedure
    .input(z.object({ organizationId: z.string() }))
    .query(async ({ input }) => {
      return await getOrganizationWithLicense(input.organizationId);
    }),

  /**
   * Suspend organization license
   */
  suspendOrganization: adminProcedure
    .input(
      z.object({
        organizationId: z.string(),
        reason: z.string().min(1, "Reason is required"),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await suspendOrganization(input.organizationId, input.reason);

      // Log the action
      await createAuditLog({
        id: `audit_${Date.now()}_${Math.random()}`,
        userId: ctx.user?.id || "system",
        action: "suspend_organization",
        resource: "organization",
        resourceId: input.organizationId,
        ipAddress: ctx.req.ip,
        userAgent: ctx.req.headers.get("user-agent") || undefined,
        details: JSON.stringify({ reason: input.reason }),
      });

      return { success: true };
    }),

  /**
   * Activate organization license
   */
  activateOrganization: adminProcedure
    .input(z.object({ organizationId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await activateOrganization(input.organizationId);

      // Log the action
      await createAuditLog({
        id: `audit_${Date.now()}_${Math.random()}`,
        userId: ctx.user?.id || "system",
        action: "activate_organization",
        resource: "organization",
        resourceId: input.organizationId,
        ipAddress: ctx.req.ip,
        userAgent: ctx.req.headers.get("user-agent") || undefined,
        details: JSON.stringify({}),
      });

      return { success: true };
    }),

  /**
   * Cancel organization
   */
  cancelOrganization: adminProcedure
    .input(
      z.object({
        organizationId: z.string(),
        reason: z.string().min(1, "Reason is required"),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await cancelOrganization(input.organizationId, input.reason);

      // Log the action
      await createAuditLog({
        id: `audit_${Date.now()}_${Math.random()}`,
        userId: ctx.user?.id || "system",
        action: "cancel_organization",
        resource: "organization",
        resourceId: input.organizationId,
        ipAddress: ctx.req.ip,
        userAgent: ctx.req.headers.get("user-agent") || undefined,
        details: JSON.stringify({ reason: input.reason }),
      });

      return { success: true };
    }),

  /**
   * Create or renew license for organization
   */
  createLicense: adminProcedure
    .input(
      z.object({
        organizationId: z.string(),
        licenseKey: z.string().min(1),
        startDate: z.date(),
        expiryDate: z.date(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Check if license already exists
      const existingLicense = await getOrganizationLicense(input.organizationId);

      if (existingLicense) {
        // Update existing license
        await updateLicense(existingLicense.id, {
          licenseKey: input.licenseKey,
          startDate: input.startDate,
          expiryDate: input.expiryDate,
          status: "active",
        });
      } else {
        // Create new license
        await createLicense({
          id: `lic_${Date.now()}_${Math.random()}`,
          organizationId: input.organizationId,
          licenseKey: input.licenseKey,
          status: "active",
          startDate: input.startDate,
          expiryDate: input.expiryDate,
          accessCount: 0,
        });
      }

      // Log the action
      await createAuditLog({
        id: `audit_${Date.now()}_${Math.random()}`,
        userId: ctx.user?.id || "system",
        action: "create_license",
        resource: "license",
        resourceId: input.organizationId,
        ipAddress: ctx.req.ip,
        userAgent: ctx.req.headers.get("user-agent") || undefined,
        details: JSON.stringify({
          licenseKey: input.licenseKey,
          expiryDate: input.expiryDate,
        }),
      });

      return { success: true };
    }),

  /**
   * Get audit logs
   */
  getAuditLogs: adminProcedure
    .input(
      z.object({
        organizationId: z.string().optional(),
        limit: z.number().min(1).max(100).default(50),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ input }) => {
      // TODO: Implement getAuditLogs with filters
      return [];
    }),
});

