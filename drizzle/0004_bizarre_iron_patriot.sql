CREATE TABLE `whatsapp_accounts` (
	`id` varchar(64) NOT NULL,
	`organizationId` varchar(64) NOT NULL,
	`phoneNumber` varchar(20) NOT NULL,
	`displayName` varchar(255),
	`accessToken` text,
	`businessAccountId` varchar(255),
	`phoneNumberId` varchar(255),
	`status` enum('connected','disconnected','expired') NOT NULL DEFAULT 'disconnected',
	`isDefault` boolean NOT NULL DEFAULT false,
	`lastSyncedAt` timestamp,
	`expiresAt` timestamp,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `whatsapp_accounts_id` PRIMARY KEY(`id`),
	CONSTRAINT `whatsapp_accounts_phoneNumber_unique` UNIQUE(`phoneNumber`)
);
--> statement-breakpoint
CREATE TABLE `whatsapp_conversations` (
	`id` varchar(64) NOT NULL,
	`organizationId` varchar(64) NOT NULL,
	`whatsappAccountId` varchar(64) NOT NULL,
	`contactId` varchar(64) NOT NULL,
	`waContactId` varchar(255),
	`status` enum('active','archived','closed') NOT NULL DEFAULT 'active',
	`lastMessageAt` timestamp,
	`unreadCount` int NOT NULL DEFAULT 0,
	`assignedTo` varchar(64),
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `whatsapp_conversations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `whatsapp_messages` (
	`id` varchar(64) NOT NULL,
	`organizationId` varchar(64) NOT NULL,
	`conversationId` varchar(64) NOT NULL,
	`whatsappAccountId` varchar(64) NOT NULL,
	`waMessageId` varchar(255),
	`direction` enum('inbound','outbound') NOT NULL,
	`messageType` enum('text','image','document','audio','video','template') NOT NULL DEFAULT 'text',
	`content` text,
	`mediaUrl` text,
	`status` enum('sent','delivered','read','failed') NOT NULL DEFAULT 'sent',
	`senderPhone` varchar(20),
	`senderName` varchar(255),
	`isFromBot` boolean NOT NULL DEFAULT false,
	`automationId` varchar(64),
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `whatsapp_messages_id` PRIMARY KEY(`id`),
	CONSTRAINT `whatsapp_messages_waMessageId_unique` UNIQUE(`waMessageId`)
);
--> statement-breakpoint
CREATE TABLE `whatsapp_templates` (
	`id` varchar(64) NOT NULL,
	`organizationId` varchar(64) NOT NULL,
	`whatsappAccountId` varchar(64) NOT NULL,
	`name` varchar(255) NOT NULL,
	`category` enum('marketing','authentication','utility') NOT NULL DEFAULT 'utility',
	`language` varchar(10) NOT NULL DEFAULT 'pt_BR',
	`headerText` text,
	`bodyText` text NOT NULL,
	`footerText` text,
	`buttons` text,
	`status` enum('approved','pending','rejected') NOT NULL DEFAULT 'pending',
	`waTemplateId` varchar(255),
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `whatsapp_templates_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `whatsapp_webhooks` (
	`id` varchar(64) NOT NULL,
	`organizationId` varchar(64) NOT NULL,
	`whatsappAccountId` varchar(64) NOT NULL,
	`webhookUrl` text NOT NULL,
	`verifyToken` varchar(255) NOT NULL,
	`isActive` boolean NOT NULL DEFAULT true,
	`lastReceivedAt` timestamp,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `whatsapp_webhooks_id` PRIMARY KEY(`id`)
);
