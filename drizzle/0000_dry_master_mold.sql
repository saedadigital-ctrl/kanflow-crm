CREATE TABLE `contacts` (
	`id` varchar(64) NOT NULL,
	`name` varchar(255) NOT NULL,
	`phoneNumber` varchar(20) NOT NULL,
	`email` varchar(320),
	`avatarUrl` text,
	`notes` text,
	`stageId` varchar(64),
	`userId` varchar(64) NOT NULL,
	`lastMessageAt` timestamp,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `contacts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `messages` (
	`id` varchar(64) NOT NULL,
	`contactId` varchar(64) NOT NULL,
	`content` text NOT NULL,
	`direction` enum('inbound','outbound') NOT NULL,
	`status` enum('sent','delivered','read','failed') DEFAULT 'sent',
	`mediaUrl` text,
	`mediaType` varchar(50),
	`sentBy` varchar(64),
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `organization_invites` (
	`id` varchar(64) NOT NULL,
	`organizationId` varchar(64) NOT NULL,
	`email` varchar(320) NOT NULL,
	`role` varchar(50) NOT NULL DEFAULT 'member',
	`token` varchar(255) NOT NULL,
	`expiresAt` timestamp NOT NULL,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `organization_invites_id` PRIMARY KEY(`id`),
	CONSTRAINT `organization_invites_token_unique` UNIQUE(`token`)
);
--> statement-breakpoint
CREATE TABLE `organization_members` (
	`id` varchar(64) NOT NULL,
	`organizationId` varchar(64) NOT NULL,
	`userId` varchar(64) NOT NULL,
	`role` varchar(50) NOT NULL DEFAULT 'member',
	`status` varchar(50) DEFAULT 'active',
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `organization_members_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `organizations` (
	`id` varchar(64) NOT NULL,
	`name` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`description` text,
	`logoUrl` text,
	`website` varchar(255),
	`phone` varchar(20),
	`email` varchar(320),
	`address` text,
	`city` varchar(100),
	`state` varchar(100),
	`country` varchar(100),
	`postalCode` varchar(20),
	`plan` varchar(50) DEFAULT 'starter',
	`status` varchar(50) DEFAULT 'active',
	`maxUsers` int DEFAULT 5,
	`maxContacts` int DEFAULT 1000,
	`maxConversations` int DEFAULT 10000,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `organizations_id` PRIMARY KEY(`id`),
	CONSTRAINT `organizations_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `pipeline_stages` (
	`id` varchar(64) NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`order` int NOT NULL,
	`color` varchar(7) DEFAULT '#3b82f6',
	`userId` varchar(64) NOT NULL,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `pipeline_stages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` varchar(64) NOT NULL,
	`name` text,
	`email` varchar(320),
	`loginMethod` varchar(64),
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`createdAt` timestamp DEFAULT (now()),
	`lastSignedIn` timestamp DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`)
);
