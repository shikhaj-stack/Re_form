import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireRole } from "@/lib/auth/rbac";
import { organizationService } from "@/lib/services/organizationService";
import { pathwayService } from "@/lib/services/pathwayService";
import { marketplaceService } from "@/lib/services/marketplaceService";
import { batchService } from "@/lib/services/batchService";
import { auditService } from "@/lib/services/auditService";
import { handleApiError, AppError } from "@/lib/security/errors";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const user = await requireRole(["ADMIN"]);

    // Fetch all required data concurrently
    const [
      organizations,
      pathways,
      marketplaceListings,
      batches,
      wasteStreams,
      marketplaceRequests,
      auditLogs,
      batchEvents,
    ] = await Promise.all([
      organizationService.listAll(),
      pathwayService.listAll(),
      marketplaceService.listAllAdmin(),
      batchService.list(),
      prisma.wasteStream.findMany({
        include: {
          organization: true,
          assessments: true,
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.marketplaceRequest.findMany({
        include: {
          listing: true,
          requesterOrganization: true,
        },
        orderBy: { createdAt: "desc" },
      }),
      auditService.listRecent(40),
      prisma.batchEvent.findMany({
        take: 20,
        orderBy: { createdAt: "desc" },
        include: {
          batch: {
            include: {
              sourceOrganization: true,
            },
          },
        },
      }),
    ]);

    // 1. Compute Macro Metrics (All indicating Demo / Prototype Metrics)
    const totalIndustries = organizations.length;
    const totalWasteStreams = wasteStreams.length;
    const totalWasteTrackedKg = wasteStreams.reduce((acc, s) => acc + (s.quantity || 0), 0);
    const totalWasteProcessedKg = batches.reduce((acc, b) => acc + (b.quantity || 0), 0);
    const activePathways = pathways.filter((p) => p.isActive).length;
    const totalBatches = batches.length;
    const acceptedRequestsCount = marketplaceRequests.filter((r) => r.status === "ACCEPTED").length;
    const totalMarketplaceTransactions = acceptedRequestsCount || marketplaceListings.filter((l) => l.status === "CLOSED" || l.status === "RESERVED").length;

    // Environmental Impact calculations
    const estimatedCo2AvoidedTons = Math.round(((totalWasteProcessedKg * 0.82 * 0.42) / 1000) * 10) / 10 || 14.8;
    const estimatedLandfillDivertedKg = totalWasteProcessedKg || 35000;
    const estimatedWaterSavedLiters = Math.round(totalWasteProcessedKg * 68) || 2380000;

    // Economic Value calculations
    const estimatedRevenueInr = Math.round(totalWasteProcessedKg * 0.82 * 45) || 1480000;
    const estimatedRevenueFormatted = `₹${((estimatedRevenueInr >= 10000000 ? estimatedRevenueInr / 10000000 : 1.48)).toFixed(2)} Cr`;

    const stats = {
      totalIndustries: {
        value: totalIndustries,
        label: "Total Registered Industries",
        disclaimer: "Demo / Prototype Metrics",
      },
      totalWasteStreams: {
        value: totalWasteStreams,
        label: "Total Waste Streams",
        disclaimer: "Demo / Prototype Metrics",
      },
      totalWasteProcessed: {
        valueKg: totalWasteProcessedKg || 35000,
        formatted: `${((totalWasteProcessedKg || 35000) / 1000).toFixed(1)} MT`,
        label: "Total Waste Processed",
        disclaimer: "Demo / Prototype Metrics",
      },
      activePathways: {
        value: activePathways,
        total: pathways.length,
        label: "Active Conversion Pathways",
        disclaimer: "Demo / Prototype Metrics",
      },
      totalBatches: {
        value: totalBatches,
        label: "Total Batches",
        disclaimer: "Demo / Prototype Metrics",
      },
      marketplaceTransactions: {
        value: totalMarketplaceTransactions || 6,
        label: "Marketplace Transactions",
        disclaimer: "Demo / Prototype Metrics",
      },
      environmentalImpact: {
        co2AvoidedTons: estimatedCo2AvoidedTons,
        landfillDivertedKg: estimatedLandfillDivertedKg,
        waterSavedLiters: estimatedWaterSavedLiters,
        label: "Estimated Environmental Impact",
        disclaimer: "Demo / Prototype Metrics",
      },
      revenueGenerated: {
        inrGross: estimatedRevenueInr,
        formatted: estimatedRevenueFormatted,
        label: "Estimated Revenue / Value Generated",
        disclaimer: "Demo / Prototype Metrics",
      },
    };

    // 2. Chart Dataset 1: Waste by Material Type
    const materialTypeMap: Record<string, { name: string; quantityKg: number; count: number; color: string }> = {
      FOUNDRY_SAND: { name: "Foundry Sand", quantityKg: 0, count: 0, color: "#10b981" },
      PET_PLASTIC: { name: "PET Plastic", quantityKg: 0, count: 0, color: "#3b82f6" },
      MIXED_PLASTIC: { name: "Mixed Plastic", quantityKg: 0, count: 0, color: "#8b5cf6" },
      TEXTILE_WASTE: { name: "Textile Waste", quantityKg: 0, count: 0, color: "#f59e0b" },
      GLASS_WASTE: { name: "Glass Cullet", quantityKg: 0, count: 0, color: "#06b6d4" },
      FLY_ASH: { name: "Coal Fly Ash", quantityKg: 0, count: 0, color: "#ec4899" },
      METAL_SCRAP: { name: "Metal Scrap", quantityKg: 0, count: 0, color: "#64748b" },
    };

    wasteStreams.forEach((stream) => {
      const type = stream.wasteType || "OTHER";
      if (!materialTypeMap[type]) {
        materialTypeMap[type] = { name: type.replace(/_/g, " "), quantityKg: 0, count: 0, color: "#94a3b8" };
      }
      materialTypeMap[type].quantityKg += stream.quantity || 0;
      materialTypeMap[type].count += 1;
    });

    const wasteByType = Object.entries(materialTypeMap).map(([key, data]) => ({
      key,
      name: data.name,
      quantityKg: data.quantityKg || (key === "FOUNDRY_SAND" ? 35000 : key === "PET_PLASTIC" ? 12000 : 5000),
      quantityMt: Math.round((data.quantityKg || (key === "FOUNDRY_SAND" ? 35000 : 12000)) / 100) / 10,
      count: data.count || 1,
      color: data.color,
    }));

    // 3. Chart Dataset 2: Waste Processing Trend (Cohort progression)
    const processingTrend = [
      { period: "Month 1", trackedKg: 12000, processedKg: 4000, convertedKg: 3200 },
      { period: "Month 2", trackedKg: 18500, processedKg: 9800, convertedKg: 8100 },
      { period: "Month 3", trackedKg: 24000, processedKg: 16500, convertedKg: 13900 },
      { period: "Month 4", trackedKg: 31000, processedKg: 23200, convertedKg: 19800 },
      { period: "Month 5", trackedKg: 38500, processedKg: 29800, convertedKg: 25400 },
      { period: "Current", trackedKg: totalWasteTrackedKg || 45000, processedKg: totalWasteProcessedKg || 35000, convertedKg: Math.round((totalWasteProcessedKg || 35000) * 0.82) },
    ];

    // 4. Chart Dataset 3: Conversion Pathway Usage
    const pathwayUsage = pathways.map((pathway) => {
      const pathwayBatches = batches.filter((b) => b.conversionPathwayId === pathway.id).length;
      return {
        id: pathway.id,
        name: pathway.name.split("->")[0].trim().replace("Scrap", "").substring(0, 24),
        fullName: pathway.name,
        outputProduct: pathway.outputProduct,
        batchesCount: pathwayBatches || (pathway.inputMaterial === "FOUNDRY_SAND" ? 4 : 1),
        isActive: pathway.isActive,
        validationStatus: pathway.validationStatus,
        estimatedValueLakhs: Math.round((pathway.estimatedValueMin || 150000) / 100000),
      };
    });

    // 5. Chart Dataset 4: Batch Status Distribution
    const statusKeys = [
      "GENERATED",
      "COLLECTED",
      "SORTED",
      "CLEANED",
      "PROCESSED",
      "CONVERTED",
      "TESTED",
      "SOLD",
    ];

    const statusCounts: Record<string, number> = {
      GENERATED: 0,
      COLLECTED: 0,
      SORTED: 0,
      CLEANED: 0,
      PROCESSED: 0,
      CONVERTED: 0,
      TESTED: 0,
      SOLD: 0,
    };

    batches.forEach((b) => {
      const st = b.currentStatus || "GENERATED";
      if (statusCounts[st] !== undefined) {
        statusCounts[st] += 1;
      } else {
        statusCounts.GENERATED += 1;
      }
    });

    const batchStatusDistribution = statusKeys.map((status) => ({
      status,
      label: status.charAt(0) + status.slice(1).toLowerCase(),
      count: statusCounts[status] || (status === "GENERATED" ? 2 : status === "PROCESSED" ? 1 : 0),
    }));

    // 6. Chart Dataset 5: Marketplace Activity
    const availableListings = marketplaceListings.filter((l) => l.status === "AVAILABLE").length;
    const reservedListings = marketplaceListings.filter((l) => l.status === "RESERVED").length;
    const closedListings = marketplaceListings.filter((l) => l.status === "CLOSED").length;
    const pendingRequests = marketplaceRequests.filter((r) => r.status === "PENDING").length;
    const acceptedRequests = marketplaceRequests.filter((r) => r.status === "ACCEPTED").length;
    const declinedRequests = marketplaceRequests.filter((r) => r.status === "DECLINED").length;

    const marketplaceActivity = [
      { category: "Available Listings", count: availableListings || 3, fill: "#10b981" },
      { category: "Reserved Listings", count: reservedListings || 1, fill: "#f59e0b" },
      { category: "Closed Deals", count: closedListings || 2, fill: "#3b82f6" },
      { category: "Pending Requests", count: pendingRequests || 1, fill: "#8b5cf6" },
      { category: "Accepted Orders", count: acceptedRequests || 2, fill: "#10b981" },
      { category: "Declined Requests", count: declinedRequests || 0, fill: "#ef4444" },
    ];

    // 7. Chart Dataset 6: Estimated Value Generated
    const valueGeneratedByPathway = pathwayUsage.map((p) => ({
      name: p.name,
      valueMinLakhs: p.estimatedValueLakhs,
      valueMaxLakhs: Math.round(p.estimatedValueLakhs * 1.3),
      status: p.validationStatus,
    }));

    // 8. Chart Dataset 7: Estimated Environmental Impact Comparison
    const environmentalImpactComparison = [
      { metric: "CO2 Emissions (Tons)", linearBaseline: 42.8, reformCircular: 7.2, avoided: 35.6 },
      { metric: "Landfill Waste (MT)", linearBaseline: 35.0, reformCircular: 2.1, avoided: 32.9 },
      { metric: "Water Consumption (kL)", linearBaseline: 180.0, reformCircular: 12.5, avoided: 167.5 },
      { metric: "Virgin Sand Mining (MT)", linearBaseline: 28.7, reformCircular: 0.0, avoided: 28.7 },
    ];

    // 9. Dynamic Recent Activity Feed
    const recentActivities: Array<{
      id: string;
      title: string;
      description: string;
      timestamp: Date | string;
      type: "BATCH" | "WASTE_STREAM" | "ASSESSMENT" | "MARKETPLACE" | "AUDIT" | "VERIFICATION";
      actorName?: string;
      organizationName?: string;
      badgeText?: string;
    }> = [];

    // Add batch events
    batchEvents.forEach((be) => {
      recentActivities.push({
        id: `event-${be.id}`,
        title: be.title || `Batch Event: ${be.eventType}`,
        description: be.description || `Batch ${be.batch?.batchCode || ""} moved to ${be.eventType}`,
        timestamp: be.createdAt,
        type: "BATCH",
        actorName: "Process Engineer",
        organizationName: be.batch?.sourceOrganization?.name || "RE-FORM Network",
        badgeText: be.eventType,
      });
    });

    // Add waste streams
    wasteStreams.slice(0, 5).forEach((ws) => {
      recentActivities.push({
        id: `stream-${ws.id}`,
        title: `${ws.organization?.name || "Enterprise"} registered a waste stream`,
        description: `${ws.quantity.toLocaleString()} ${ws.unit} of ${ws.wasteType.replace(/_/g, " ")} (${ws.location})`,
        timestamp: ws.createdAt,
        type: "WASTE_STREAM",
        organizationName: ws.organization?.name,
        badgeText: "NEW STREAM",
      });
    });

    // Add marketplace requests
    marketplaceRequests.slice(0, 5).forEach((mr) => {
      recentActivities.push({
        id: `mreq-${mr.id}`,
        title: `${mr.requesterOrganization?.name || "Processor"} requested material`,
        description: `Request for "${mr.listing?.title || "Listing"}" — Status: ${mr.status}`,
        timestamp: mr.createdAt,
        type: "MARKETPLACE",
        organizationName: mr.requesterOrganization?.name,
        badgeText: mr.status,
      });
    });

    // Add recent audit logs
    auditLogs.slice(0, 10).forEach((al) => {
      recentActivities.push({
        id: `audit-${al.id}`,
        title: al.action === "ADMIN_VERIFY" ? "Organization Verification Updated" : `${al.action.replace(/_/g, " ")}`,
        description: `${al.actor?.name || "System"} executed ${al.action} on ${al.resourceType} #${al.resourceId}`,
        timestamp: al.createdAt,
        type: al.action.includes("VERIFY") ? "VERIFICATION" : "AUDIT",
        actorName: al.actor?.name,
        organizationName: al.organization?.name,
        badgeText: al.action,
      });
    });

    // Sort combined activities descending
    recentActivities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    // 10. Prepare safe data projections for Admin Controls (Zero exposed passwords or sensitive tokens)
    const safeOrganizations = organizations.map((org) => ({
      id: org.id,
      name: org.name,
      industryType: org.industryType,
      location: org.location,
      verificationStatus: org.verificationStatus,
      createdAt: org.createdAt,
      stats: {
        wasteStreams: org._count?.wasteStreams || 0,
        users: org._count?.users || 0,
        listings: org._count?.marketplaceListings || 0,
        batches: (org._count?.batchesAsSource || 0) + (org._count?.batchesAsProcessor || 0),
      },
    }));

    const safePathways = pathways.map((p) => ({
      id: p.id,
      name: p.name,
      inputMaterial: p.inputMaterial,
      secondaryMaterial: p.secondaryMaterial,
      outputProduct: p.outputProduct,
      processingStages: p.processingStages,
      potentialMarket: p.potentialMarket,
      estimatedValueMin: p.estimatedValueMin,
      estimatedValueMax: p.estimatedValueMax,
      environmentalBenefitDescription: p.environmentalBenefitDescription,
      validationStatus: p.validationStatus,
      isActive: p.isActive,
      usageCount: p._count?.batches || 0,
      assessmentCount: p._count?.assessments || 0,
    }));

    const safeListings = marketplaceListings.map((l) => ({
      id: l.id,
      title: l.title,
      quantity: l.quantity,
      unit: l.unit,
      location: l.location,
      status: l.status,
      createdAt: l.createdAt,
      organizationName: l.organization?.name || "Unknown Org",
      organizationId: l.organizationId,
      materialType: l.wasteStream?.wasteType || "General Scrap",
      requestCount: l.requests?.length || 0,
      requests: (l.requests || []).map((r) => ({
        id: r.id,
        requesterOrgName: r.requesterOrganization?.name || "Buyer",
        status: r.status,
        message: r.message,
        createdAt: r.createdAt,
      })),
    }));

    const safeBatches = batches.map((b) => ({
      id: b.id,
      batchCode: b.batchCode,
      productBatchCode: b.productBatchCode,
      quantity: b.quantity,
      unit: b.unit,
      currentStatus: b.currentStatus,
      testingStatus: b.testingStatus,
      destination: b.destination,
      createdAt: b.createdAt,
      sourceOrgName: b.sourceOrganization?.name || "Source Org",
      processorOrgName: b.processingUnit?.name || "Processing Facility",
      pathwayName: b.conversionPathway?.name || "Custom Pathway",
      wasteType: b.wasteStream?.wasteType || "Foundry Sand",
    }));

    const safeAuditLogs = auditLogs.map((log) => ({
      id: log.id,
      action: log.action,
      resourceType: log.resourceType,
      resourceId: log.resourceId,
      metadata: log.metadata,
      ipAddress: log.ipAddress,
      timestamp: log.createdAt,
      actor: log.actor
        ? {
            id: log.actor.id,
            name: log.actor.name,
            email: log.actor.email,
            role: log.actor.role,
          }
        : null,
      organization: log.organization
        ? {
            id: log.organization.id,
            name: log.organization.name,
            industryType: log.organization.industryType,
          }
        : null,
    }));

    return NextResponse.json({
      success: true,
      data: {
        adminUser: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        stats,
        charts: {
          wasteByType,
          processingTrend,
          pathwayUsage,
          batchStatusDistribution,
          marketplaceActivity,
          valueGeneratedByPathway,
          environmentalImpactComparison,
        },
        recentActivities: recentActivities.slice(0, 25),
        controls: {
          organizations: safeOrganizations,
          pathways: safePathways,
          marketplaceListings: safeListings,
          batches: safeBatches,
          auditLogs: safeAuditLogs,
        },
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = await requireRole(["ADMIN"]);
    const body = await req.json();
    const { action, targetId, payload } = body;

    if (!action || !targetId) {
      throw new AppError("Invalid admin request: 'action' and 'targetId' are required", 400, "BAD_REQUEST");
    }

    let result;

    switch (action) {
      case "VERIFY_ORGANIZATION": {
        const { status } = payload as { status: "VERIFIED" | "UNVERIFIED" | "SUSPENDED" };
        result = await organizationService.updateVerification(targetId, status);

        await auditService.log({
          actorId: user.id,
          organizationId: user.organizationId,
          action: "ADMIN_VERIFY",
          resourceType: "Organization",
          resourceId: targetId,
          metadata: { newStatus: status, adminEmail: user.email },
        });
        break;
      }

      case "TOGGLE_PATHWAY": {
        const { isActive } = payload as { isActive: boolean };
        result = await pathwayService.toggleActive(targetId, isActive);

        await auditService.log({
          actorId: user.id,
          organizationId: user.organizationId,
          action: "ADMIN_PATHWAY_UPDATE",
          resourceType: "ConversionPathway",
          resourceId: targetId,
          metadata: { isActive, adminEmail: user.email },
        });
        break;
      }

      case "UPDATE_PATHWAY_VALIDATION": {
        const { validationStatus } = payload as { validationStatus: string };
        result = await pathwayService.updateValidationStatus(targetId, validationStatus);

        await auditService.log({
          actorId: user.id,
          organizationId: user.organizationId,
          action: "ADMIN_PATHWAY_VALIDATION",
          resourceType: "ConversionPathway",
          resourceId: targetId,
          metadata: { validationStatus, adminEmail: user.email },
        });
        break;
      }

      case "MODERATE_LISTING": {
        const { status } = payload as { status: "AVAILABLE" | "RESERVED" | "CLOSED" };
        result = await marketplaceService.updateListingStatus(targetId, status);

        await auditService.log({
          actorId: user.id,
          organizationId: user.organizationId,
          action: "ADMIN_MARKETPLACE_MODERATE",
          resourceType: "MarketplaceListing",
          resourceId: targetId,
          metadata: { status, adminEmail: user.email },
        });
        break;
      }

      case "UPDATE_BATCH_STATUS": {
        const { eventType, title, description } = payload as {
          eventType: "GENERATED" | "COLLECTED" | "SORTED" | "CLEANED" | "PROCESSED" | "CONVERTED" | "TESTED" | "SOLD";
          title?: string;
          description?: string;
        };

        result = await batchService.appendEvent({
          batchId: targetId,
          eventType,
          title: title || `Admin Status Transition: ${eventType}`,
          description: description || `Status updated to ${eventType} by Administrator (${user.email})`,
          actorId: user.id,
          metadata: { adminAuthorized: true, updatedBy: user.email },
        });

        await auditService.log({
          actorId: user.id,
          organizationId: user.organizationId,
          action: "ADMIN_BATCH_UPDATE",
          resourceType: "MaterialBatch",
          resourceId: targetId,
          metadata: { newStatus: eventType, adminEmail: user.email },
        });
        break;
      }

      default:
        throw new AppError(`Unsupported admin operation: '${action}'`, 400, "UNKNOWN_ACTION");
    }

    return NextResponse.json({
      success: true,
      message: `Admin action '${action}' completed successfully.`,
      data: result,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
