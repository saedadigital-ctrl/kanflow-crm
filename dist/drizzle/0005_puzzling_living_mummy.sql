CREATE TABLE `licenses` (
	`id` varchar(64) NOT NULL,
	`organizationId` varchar(64) NOT NULL,
	`licenseKey` varchar(255) NOT NULL,
	`status` enum('active','suspended','expired','cancelled') NOT NULL DEFAULT 'active',
	`startDate` timestamp NOT NULL,
	`expiryDate` timestamp NOT NULL,
	`renewalDate` timestamp,
	`lastAccessDate` timestamp,
	`accessCount` int DEFAULT 0,
	`reason` text,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `licenses_id` PRIMARY KEY(`id`),
	CONSTRAINT `licenses_licenseKey_unique` UNIQUE(`licenseKey`)
);
