CREATE TABLE `notification_preferences` (
	`userId` varchar(64) NOT NULL,
	`enableSound` boolean NOT NULL DEFAULT true,
	`muteFrom` varchar(5),
	`muteTo` varchar(5),
	`whatsappMessage` boolean NOT NULL DEFAULT true,
	`kanbanMove` boolean NOT NULL DEFAULT true,
	`contactUpdate` boolean NOT NULL DEFAULT false,
	`channels` text DEFAULT ('["websocket"]'),
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `notification_preferences_userId` PRIMARY KEY(`userId`)
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` varchar(64) NOT NULL,
	`userId` varchar(64) NOT NULL,
	`type` enum('WHATSAPP_MESSAGE','KANBAN_MOVE','CONTACT_CREATED','CONTACT_UPDATED','DEAL_CREATED','DEAL_UPDATED') NOT NULL,
	`title` varchar(255) NOT NULL,
	`body` text NOT NULL,
	`entityType` varchar(50),
	`entityId` varchar(64),
	`channel` varchar(50) DEFAULT 'websocket',
	`readAt` timestamp,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
