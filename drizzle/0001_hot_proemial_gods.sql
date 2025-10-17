CREATE TABLE `ai_agents` (
	`id` varchar(64) NOT NULL,
	`userId` varchar(64) NOT NULL,
	`name` varchar(255) NOT NULL,
	`systemPrompt` text NOT NULL,
	`temperature` int DEFAULT 70,
	`isActive` boolean DEFAULT true,
	`autoReply` boolean DEFAULT false,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `ai_agents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `automations` (
	`id` varchar(64) NOT NULL,
	`userId` varchar(64) NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`trigger` varchar(100) NOT NULL,
	`triggerConfig` text,
	`action` varchar(100) NOT NULL,
	`actionConfig` text,
	`isActive` boolean DEFAULT true,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `automations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `contacts` (
	`id` varchar(64) NOT NULL,
	`name` varchar(255) NOT NULL,
	`phoneNumber` varchar(20) NOT NULL,
	`email` varchar(320),
	`avatarUrl` text,
	`notes` text,
	`tags` text,
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
CREATE TABLE `whatsapp_integrations` (
	`id` varchar(64) NOT NULL,
	`userId` varchar(64) NOT NULL,
	`phoneNumber` varchar(20) NOT NULL,
	`businessAccountId` varchar(255),
	`accessToken` text,
	`webhookVerifyToken` varchar(255),
	`isActive` boolean DEFAULT true,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `whatsapp_integrations_id` PRIMARY KEY(`id`)
);
