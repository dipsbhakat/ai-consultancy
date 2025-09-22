-- CreateTable
CREATE TABLE "analytics_events" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "eventType" TEXT NOT NULL,
    "eventData" TEXT NOT NULL,
    "sessionId" TEXT,
    "userId" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "referrer" TEXT,
    "pageUrl" TEXT,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "leadScore" INTEGER,
    "conversionValue" REAL
);

-- CreateTable
CREATE TABLE "lead_scores" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "contactId" TEXT NOT NULL,
    "demandScore" INTEGER NOT NULL DEFAULT 0,
    "engagementScore" INTEGER NOT NULL DEFAULT 0,
    "qualityScore" INTEGER NOT NULL DEFAULT 0,
    "urgencyScore" INTEGER NOT NULL DEFAULT 0,
    "totalScore" INTEGER NOT NULL DEFAULT 0,
    "grade" TEXT NOT NULL DEFAULT 'C',
    "lastCalculated" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "calculatedBy" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "lead_scores_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "contact_submissions" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "conversion_funnel" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionId" TEXT NOT NULL,
    "stage" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sourceStage" TEXT,
    "pageUrl" TEXT,
    "eventTrigger" TEXT,
    "trafficSource" TEXT,
    "campaign" TEXT,
    "medium" TEXT
);

-- CreateTable
CREATE TABLE "business_metrics" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "metricDate" DATETIME NOT NULL,
    "totalVisitors" INTEGER NOT NULL DEFAULT 0,
    "uniqueVisitors" INTEGER NOT NULL DEFAULT 0,
    "pageViews" INTEGER NOT NULL DEFAULT 0,
    "avgSessionTime" REAL NOT NULL DEFAULT 0,
    "bounceRate" REAL NOT NULL DEFAULT 0,
    "totalContacts" INTEGER NOT NULL DEFAULT 0,
    "qualifiedLeads" INTEGER NOT NULL DEFAULT 0,
    "avgLeadScore" REAL NOT NULL DEFAULT 0,
    "conversionRate" REAL NOT NULL DEFAULT 0,
    "estimatedValue" REAL NOT NULL DEFAULT 0,
    "topTrafficSource" TEXT,
    "topLeadSource" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "campaign_tracking" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "campaignName" TEXT NOT NULL,
    "utmSource" TEXT,
    "utmMedium" TEXT,
    "utmCampaign" TEXT,
    "utmTerm" TEXT,
    "utmContent" TEXT,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "visitors" INTEGER NOT NULL DEFAULT 0,
    "contacts" INTEGER NOT NULL DEFAULT 0,
    "conversions" INTEGER NOT NULL DEFAULT 0,
    "cost" REAL NOT NULL DEFAULT 0,
    "costPerClick" REAL NOT NULL DEFAULT 0,
    "costPerLead" REAL NOT NULL DEFAULT 0,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "analytics_events_eventType_timestamp_idx" ON "analytics_events"("eventType", "timestamp");

-- CreateIndex
CREATE INDEX "analytics_events_sessionId_timestamp_idx" ON "analytics_events"("sessionId", "timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "lead_scores_contactId_key" ON "lead_scores"("contactId");

-- CreateIndex
CREATE INDEX "conversion_funnel_sessionId_timestamp_idx" ON "conversion_funnel"("sessionId", "timestamp");

-- CreateIndex
CREATE INDEX "conversion_funnel_stage_timestamp_idx" ON "conversion_funnel"("stage", "timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "business_metrics_metricDate_key" ON "business_metrics"("metricDate");
