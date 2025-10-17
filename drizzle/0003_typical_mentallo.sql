CREATE TABLE `organization_members` (
	`id` varchar(64) NOT NULL,
	`organizationId` varchar(64) NOT NULL,
	`userId` varchar(64) NOT NULL,
	`role` enum('owner','admin','member') NOT NULL DEFAULT 'member',
	`joinedAt` timestamp DEFAULT (now()),
	CONSTRAINT `organization_members_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `organizations` (
	`id` varchar(64) NOT NULL,
	`name` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`ownerId` varchar(64) NOT NULL,
	`email` varchar(320),
	`phone` varchar(20),
	`cnpj` varchar(18),
	`address` text,
	`status` enum('active','suspended','cancelled') NOT NULL DEFAULT 'active',
	`maxUsers` int NOT NULL DEFAULT 5,
	`currentUsers` int NOT NULL DEFAULT 1,
	`maxContacts` int NOT NULL DEFAULT 1000,
	`maxWhatsappNumbers` int NOT NULL DEFAULT 1,
	`trialEndsAt` timestamp,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `organizations_id` PRIMARY KEY(`id`),
	CONSTRAINT `organizations_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `payments` (
	`id` varchar(64) NOT NULL,
	`organizationId` varchar(64) NOT NULL,
	`subscriptionId` varchar(64) NOT NULL,
	`amount` int NOT NULL,
	`status` enum('pending','paid','failed','refunded') NOT NULL DEFAULT 'pending',
	`paymentMethod` varchar(50),
	`transactionId` varchar(255),
	`paidAt` timestamp,
	`dueDate` timestamp,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `payments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `subscription_plans` (
	`id` varchar(64) NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`price` int NOT NULL,
	`billingCycle` enum('monthly','quarterly','yearly') NOT NULL DEFAULT 'monthly',
	`maxUsers` int NOT NULL,
	`maxContacts` int NOT NULL,
	`maxWhatsappNumbers` int NOT NULL,
	`features` text,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `subscription_plans_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `subscriptions` (
	`id` varchar(64) NOT NULL,
	`organizationId` varchar(64) NOT NULL,
	`planId` varchar(64) NOT NULL,
	`status` enum('active','past_due','cancelled','expired') NOT NULL DEFAULT 'active',
	`currentPeriodStart` timestamp NOT NULL,
	`currentPeriodEnd` timestamp NOT NULL,
	`cancelAtPeriodEnd` boolean NOT NULL DEFAULT false,
	`cancelledAt` timestamp,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `subscriptions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `usage_logs` (
	`id` varchar(64) NOT NULL,
	`organizationId` varchar(64) NOT NULL,
	`metric` varchar(100) NOT NULL,
	`value` int NOT NULL,
	`date` timestamp NOT NULL,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `usage_logs_id` PRIMARY KEY(`id`)
);
