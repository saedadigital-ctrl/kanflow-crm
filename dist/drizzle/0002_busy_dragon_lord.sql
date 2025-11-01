CREATE TABLE `audit_logs` (
	`id` varchar(64) NOT NULL,
	`userId` varchar(64) NOT NULL,
	`action` varchar(100) NOT NULL,
	`resource` varchar(100) NOT NULL,
	`resourceId` varchar(64),
	`ipAddress` varchar(45),
	`userAgent` text,
	`details` text,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `audit_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `consents` (
	`id` varchar(64) NOT NULL,
	`userId` varchar(64) NOT NULL,
	`type` enum('terms','privacy','marketing') NOT NULL,
	`accepted` boolean NOT NULL DEFAULT false,
	`acceptedAt` timestamp,
	`revokedAt` timestamp,
	`ipAddress` varchar(45),
	`userAgent` text,
	`version` varchar(20) DEFAULT '1.0',
	CONSTRAINT `consents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `lgpd_requests` (
	`id` varchar(64) NOT NULL,
	`userId` varchar(64) NOT NULL,
	`type` enum('deletion','portability','correction') NOT NULL,
	`status` enum('pending','processing','completed','rejected') NOT NULL DEFAULT 'pending',
	`reason` text,
	`requestedAt` timestamp DEFAULT (now()),
	`completedAt` timestamp,
	`completedBy` varchar(64),
	`notes` text,
	CONSTRAINT `lgpd_requests_id` PRIMARY KEY(`id`)
);
