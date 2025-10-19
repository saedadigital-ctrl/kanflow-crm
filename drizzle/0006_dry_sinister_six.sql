ALTER TABLE `audit_logs` MODIFY COLUMN `userId` varchar(64);--> statement-breakpoint
ALTER TABLE `audit_logs` ADD `eventType` varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE `audit_logs` ADD `severity` enum('info','warning','error','critical') NOT NULL;--> statement-breakpoint
ALTER TABLE `audit_logs` ADD `organizationId` varchar(64);--> statement-breakpoint
ALTER TABLE `audit_logs` ADD `metadata` text;--> statement-breakpoint
ALTER TABLE `audit_logs` ADD `timestamp` timestamp DEFAULT (now()) NOT NULL;--> statement-breakpoint
ALTER TABLE `audit_logs` DROP COLUMN `action`;--> statement-breakpoint
ALTER TABLE `audit_logs` DROP COLUMN `resource`;--> statement-breakpoint
ALTER TABLE `audit_logs` DROP COLUMN `resourceId`;--> statement-breakpoint
ALTER TABLE `audit_logs` DROP COLUMN `details`;