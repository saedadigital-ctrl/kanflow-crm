CREATE TABLE `conversations` (
	`id` varchar(64) NOT NULL,
	`organizationId` varchar(64) NOT NULL,
	`contactId` varchar(64) NOT NULL,
	`lastSnippet` text,
	`unreadCount` int DEFAULT 0,
	`status` varchar(50) DEFAULT 'active',
	`lastMessageAt` timestamp,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `conversations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `whatsapp_configs` (
	`id` varchar(64) NOT NULL,
	`organizationId` varchar(64) NOT NULL,
	`phoneNumber` varchar(20) NOT NULL,
	`displayName` varchar(255),
	`accessToken` text,
	`businessAccountId` varchar(255),
	`phoneNumberId` varchar(255),
	`connected` boolean DEFAULT false,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `whatsapp_configs_id` PRIMARY KEY(`id`)
);
