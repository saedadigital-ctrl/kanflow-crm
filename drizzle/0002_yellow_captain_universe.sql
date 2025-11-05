CREATE TABLE `invoices` (
	`id` varchar(64) NOT NULL,
	`organizationId` varchar(64) NOT NULL,
	`subscriptionId` varchar(64),
	`stripeInvoiceId` varchar(255),
	`amount` int NOT NULL,
	`currency` varchar(3) DEFAULT 'USD',
	`status` varchar(50) DEFAULT 'draft',
	`paidAt` timestamp,
	`dueDate` timestamp,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `invoices_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `payment_methods` (
	`id` varchar(64) NOT NULL,
	`organizationId` varchar(64) NOT NULL,
	`stripePaymentMethodId` varchar(255) NOT NULL,
	`type` varchar(50) NOT NULL,
	`brand` varchar(50),
	`last4` varchar(4),
	`expiryMonth` int,
	`expiryYear` int,
	`isDefault` boolean DEFAULT false,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `payment_methods_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `subscriptions` (
	`id` varchar(64) NOT NULL,
	`organizationId` varchar(64) NOT NULL,
	`plan` varchar(50) NOT NULL,
	`status` varchar(50) DEFAULT 'active',
	`stripeSubscriptionId` varchar(255),
	`stripeCustomerId` varchar(255),
	`currentPeriodStart` timestamp,
	`currentPeriodEnd` timestamp,
	`canceledAt` timestamp,
	`trialEndsAt` timestamp,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `subscriptions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `usage` (
	`id` varchar(64) NOT NULL,
	`organizationId` varchar(64) NOT NULL,
	`month` varchar(7) NOT NULL,
	`contactsCount` int DEFAULT 0,
	`messagesCount` int DEFAULT 0,
	`conversationsCount` int DEFAULT 0,
	`usersCount` int DEFAULT 0,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `usage_id` PRIMARY KEY(`id`)
);
