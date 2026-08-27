import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 [PART 2] Seeding RE-FORM Database Models, Multi-Tenant Architecture & Provenance Events...");

  // Purge existing data
  await prisma.auditLog.deleteMany();
  await prisma.impactRecord.deleteMany();
  await prisma.economicCalculation.deleteMany();
  await prisma.marketplaceRequest.deleteMany();
  await prisma.marketplaceListing.deleteMany();
  await prisma.processorProfile.deleteMany();
  await prisma.batchEvent.deleteMany();
  await prisma.materialBatch.deleteMany();
  await prisma.wasteAssessment.deleteMany();
  await prisma.conversionPathway.deleteMany();
  await prisma.wasteStream.deleteMany();
  await prisma.user.deleteMany();
  await prisma.organization.deleteMany();

  const defaultPasswordHash = await bcrypt.hash("Demo1234!", 10);
  const adminPasswordHash = await bcrypt.hash("Admin1234!", 10);

  // 1. Seed 6 Conversion Pathways
  console.log(" -> Seeding Conversion Pathways...");
  const paverPathway = await prisma.conversionPathway.create({
    data: {
      name: "Foundry Sand + Suitable Plastic -> Recycled Construction Pavers",
      inputMaterial: "FOUNDRY_SAND",
      secondaryMaterial: "PET_PLASTIC",
      outputProduct: "Recycled Construction Pavers",
      processingStages: JSON.stringify([
        "Intake & Magnetic Screening",
        "Non-Aqueous Surface Scrubbing",
        "Plastic Micro-Granulation",
        "Twin-Screw Thermal Compounding (185°C)",
        "Hydraulic Compression Moulding (45 MPa)",
        "IS 15658 Compressive Testing",
      ]),
      potentialMarket: "National Highway Authority & Municipal Paving",
      estimatedValueMin: 350000,
      estimatedValueMax: 420000,
      environmentalBenefitDescription: "Avoids 0.42 kg CO2e per kg concrete displaced; zero water effluent.",
      validationStatus: "PROTOTYPE",
      isActive: true,
    },
  });

  const plasticLumberPathway = await prisma.conversionPathway.create({
    data: {
      name: "Plastic Scrap -> Composite Structural Lumber",
      inputMaterial: "PET_PLASTIC",
      secondaryMaterial: "MIXED_PLASTIC",
      outputProduct: "Composite Structural Profiles",
      processingStages: "Optical sorting, shredding, thermal profile extrusion",
      potentialMarket: "Civil Infrastructure & Rail",
      estimatedValueMin: 120,
      estimatedValueMax: 150,
      environmentalBenefitDescription: "Offsets 2.1 kg CO2e per kg virgin plastic displaced.",
      validationStatus: "PROTOTYPE",
      isActive: true,
    },
  });

  const textilePathway = await prisma.conversionPathway.create({
    data: {
      name: "Textile Waste -> Acoustic Insulation Panels",
      inputMaterial: "TEXTILE_WASTE",
      secondaryMaterial: null,
      outputProduct: "High-Density Acoustic Panels",
      processingStages: "Rotary shredding, air-laying, thermo-bonding",
      potentialMarket: "Architecture & Automotive Interiors",
      estimatedValueMin: 400,
      estimatedValueMax: 600,
      environmentalBenefitDescription: "Zero-water dry mechanical process.",
      validationStatus: "REQUIRES_VALIDATION",
      isActive: true,
    },
  });

  const glassPathway = await prisma.conversionPathway.create({
    data: {
      name: "Glass Waste -> Fine Construction Aggregate Sand Substitute",
      inputMaterial: "GLASS_WASTE",
      secondaryMaterial: null,
      outputProduct: "Engineered Concrete Aggregate",
      processingStages: "Impact crushing, screening, dust filtration",
      potentialMarket: "Civil Ready-Mix Concrete",
      estimatedValueMin: 80,
      estimatedValueMax: 100,
      environmentalBenefitDescription: "Conserves natural riverbed ecosystems.",
      validationStatus: "REQUIRES_VALIDATION",
      isActive: true,
    },
  });

  const flyAshPathway = await prisma.conversionPathway.create({
    data: {
      name: "Fly Ash -> Geopolymer Building Materials & Green Cement",
      inputMaterial: "FLY_ASH",
      secondaryMaterial: null,
      outputProduct: "Zero-Clinker Green Cement",
      processingStages: "Alkaline activation, geopolymer synthesis, curing",
      potentialMarket: "Heavy Infrastructure & Ports",
      estimatedValueMin: 200,
      estimatedValueMax: 250,
      environmentalBenefitDescription: "80% embodied carbon reduction vs Portland cement.",
      validationStatus: "REQUIRES_VALIDATION",
      isActive: true,
    },
  });

  const metalPathway = await prisma.conversionPathway.create({
    data: {
      name: "Metal Scrap -> High-Purity Secondary Raw Alloys",
      inputMaterial: "METAL_SCRAP",
      secondaryMaterial: null,
      outputProduct: "High-Purity Secondary Cast Billets",
      processingStages: "Magnetic separation, induction refining, casting",
      potentialMarket: "Automotive & Casting Foundries",
      estimatedValueMin: 180,
      estimatedValueMax: 220,
      environmentalBenefitDescription: "95% energy saved vs virgin bauxite smelting.",
      validationStatus: "PROTOTYPE",
      isActive: true,
    },
  });

  // 2. Organizations
  console.log(" -> Seeding Organizations...");
  const demoFoundry = await prisma.organization.create({
    data: {
      name: "Demo Foundry Pvt. Ltd.",
      industryType: "Heavy Metal Casting & Forging",
      location: "Indore, Madhya Pradesh",
      verificationStatus: "VERIFIED",
    },
  });

  const ecoMatProcessor = await prisma.organization.create({
    data: {
      name: "EcoMat Converters Ltd.",
      industryType: "Polymer & Mineral Matrix Upcycling",
      location: "Bhopal, Madhya Pradesh",
      verificationStatus: "VERIFIED",
    },
  });

  const greenTextileProcessor = await prisma.organization.create({
    data: {
      name: "GreenTextile Upcycling Hub",
      industryType: "Textile Fibre Reclamation",
      location: "Vidisha, Madhya Pradesh",
      verificationStatus: "VERIFIED",
    },
  });

  const systemAdminOrg = await prisma.organization.create({
    data: {
      name: "RE-FORM System Authority",
      industryType: "Ecosystem Regulatory Sandbox Node",
      location: "National Node",
      verificationStatus: "VERIFIED",
    },
  });

  // 3. Processor Profiles
  console.log(" -> Seeding Processor Profiles...");
  await prisma.processorProfile.create({
    data: {
      organizationId: ecoMatProcessor.id,
      acceptedMaterials: JSON.stringify(["FOUNDRY_SAND", "PET_PLASTIC", "MIXED_PLASTIC", "FLY_ASH"]),
      processingCapabilities: "Twin-Screw Thermal Compounding, Dry Abrasive Scrubbing, Hydraulic Compression",
      capacity: 25000,
      location: "Bhopal, Madhya Pradesh",
      verificationStatus: "VERIFIED",
      description: "Regional hub equipped with ISO 14001 and IS 15658 compression testing facilities.",
    },
  });

  await prisma.processorProfile.create({
    data: {
      organizationId: greenTextileProcessor.id,
      acceptedMaterials: JSON.stringify(["TEXTILE_WASTE", "GLASS_WASTE"]),
      processingCapabilities: "Rotary Fibre Shredding, Air-Laying Thermo-Bonding",
      capacity: 15000,
      location: "Vidisha, Madhya Pradesh",
      verificationStatus: "VERIFIED",
      description: "Specialized in non-aqueous dry textile acoustic panel fabrication.",
    },
  });

  // 4. Users
  console.log(" -> Seeding Users...");
  const factoryUser = await prisma.user.create({
    data: {
      name: "Rajesh Sharma (Plant Ops)",
      email: "factory@demofoundry.com",
      passwordHash: defaultPasswordHash,
      role: "FACTORY",
      organizationId: demoFoundry.id,
    },
  });

  const processorUser = await prisma.user.create({
    data: {
      name: "Vikram Mehta (Lead Metallurgist)",
      email: "processor@ecomat.com",
      passwordHash: defaultPasswordHash,
      role: "PROCESSOR",
      organizationId: ecoMatProcessor.id,
    },
  });

  const adminUser = await prisma.user.create({
    data: {
      name: "Devi Prasad (Ecosystem Auditor)",
      email: "admin@reform.eco",
      passwordHash: adminPasswordHash,
      role: "ADMIN",
      organizationId: systemAdminOrg.id,
    },
  });

  // 5. Waste Streams
  console.log(" -> Seeding Primary Waste Streams...");
  const foundrySandStream = await prisma.wasteStream.create({
    data: {
      organizationId: demoFoundry.id,
      wasteType: "FOUNDRY_SAND",
      quantity: 10000,
      unit: "KG",
      generationFrequency: "MONTHLY",
      contaminationLevel: "MEDIUM",
      currentDisposalMethod: "Landfill / External Disposal",
      location: "Indore, Madhya Pradesh",
      status: "ACTIVE",
    },
  });

  const plasticStream = await prisma.wasteStream.create({
    data: {
      organizationId: demoFoundry.id,
      wasteType: "PET_PLASTIC",
      quantity: 5000,
      unit: "KG",
      generationFrequency: "MONTHLY",
      contaminationLevel: "LOW",
      currentDisposalMethod: "Outsourced Hauling",
      location: "Bhopal, Madhya Pradesh",
      status: "ACTIVE",
    },
  });

  const glassStream = await prisma.wasteStream.create({
    data: {
      organizationId: demoFoundry.id,
      wasteType: "GLASS_WASTE",
      quantity: 3200,
      unit: "KG",
      generationFrequency: "MONTHLY",
      contaminationLevel: "LOW",
      currentDisposalMethod: "Landfill / External Disposal",
      location: "Vidisha, Madhya Pradesh",
      status: "ACTIVE",
    },
  });

  // 6. Waste Assessment
  console.log(" -> Seeding Waste Assessment...");
  await prisma.wasteAssessment.create({
    data: {
      wasteStreamId: foundrySandStream.id,
      recoverabilityEstimate: 0.82, // 82%
      recommendedPathwayId: paverPathway.id,
      potentialProduct: "Recycled Construction Pavers",
      confidenceLevel: "PROTOTYPE_CONFIDENCE",
      disclaimer: "Prototype Estimate — Requires Material Testing",
    },
  });

  // 7. Material Batch RF-2026-001 with 8 Append-Only BatchEvents
  console.log(" -> Seeding Material Batch RF-2026-001 & Provenance Timeline...");
  const batch = await prisma.materialBatch.create({
    data: {
      batchCode: "RF-2026-001",
      wasteStreamId: foundrySandStream.id,
      sourceOrganizationId: demoFoundry.id,
      quantity: 10000,
      unit: "KG",
      collectionDate: new Date(),
      processingUnitId: ecoMatProcessor.id,
      conversionPathwayId: paverPathway.id,
      productBatchCode: "PAVER-IS15658-001",
      testingStatus: "PASSED_IS_15658",
      destination: "National Highway Authority Project Sector 4",
      currentStatus: "PROCESSED",
    },
  });

  // 8 Events: GENERATED, COLLECTED, SORTED, CLEANED, PROCESSED, CONVERTED, TESTED, SOLD
  const events = [
    { type: "GENERATED", title: "Foundry Sand Byproduct Ingested", desc: "Batch of 10,000 kg foundry silica sand generated from casting line 2.", hash: "0x8f4c39e2d1a7b05c" },
    { type: "COLLECTED", title: "Chain-of-Custody Logistics Pickup", desc: "Hopper trailer sealed and dispatched from Indore plant.", hash: "0x1a2b3c4d5e6f7a8b" },
    { type: "SORTED", title: "Magnetic Rare-Earth Separation", desc: "Purged 99.8% ferrous tramp contaminants and oversized slag.", hash: "0x9c8b7a6f5e4d3c2b" },
    { type: "CLEANED", title: "Non-Aqueous Surface Scrubbing", desc: "Organic resin binder coating scrubbed dry without water effluent.", hash: "0x5d4e3f2a1b0c9d8e" },
    { type: "PROCESSED", title: "Polymer Matrix Granulation", desc: "2,500 kg PET polymer micro-granules (2mm) compounded.", hash: "0x3a2b1c0d9e8f7a6b" },
    { type: "CONVERTED", title: "Twin-Screw Thermal Compression", desc: "Moulded into 2,450 interlocking paver blocks at 45 MPa (185°C).", hash: "0x7e6d5c4b3a2f1e0d" },
    { type: "TESTED", title: "IS 15658 Mechanical Audit", desc: "Compressive load tested: 48.2 MPa. Water absorption: 1.1%. Grade A cleared.", hash: "0x2c3d4e5f6a7b8c9d" },
    { type: "SOLD", title: "Dispatched to Commercial Infrastructure", desc: "Palletized and delivered to NHAI Highway Development Sector 4.", hash: "0x4f5e6d7c8b9a0b1c" },
  ];

  for (const ev of events) {
    await prisma.batchEvent.create({
      data: {
        batchId: batch.id,
        eventType: ev.type,
        title: ev.title,
        description: ev.desc,
        actorId: processorUser.id,
        metadata: JSON.stringify({ sha256Signature: ev.hash, timestamp: new Date().toISOString() }),
      },
    });
  }

  // 8. Marketplace Listings
  console.log(" -> Seeding Marketplace Listings...");
  const listing1 = await prisma.marketplaceListing.create({
    data: {
      organizationId: demoFoundry.id,
      wasteStreamId: plasticStream.id,
      title: "PET Plastic Scrap (High Purity Flakes)",
      quantity: 5000,
      unit: "KG",
      location: "Bhopal, Madhya Pradesh",
      status: "AVAILABLE",
    },
  });

  const listing2 = await prisma.marketplaceListing.create({
    data: {
      organizationId: demoFoundry.id,
      wasteStreamId: glassStream.id,
      title: "Industrial Glass Waste (Cullet)",
      quantity: 3200,
      unit: "KG",
      location: "Vidisha, Madhya Pradesh",
      status: "AVAILABLE",
    },
  });

  // Sample Request from processor to listing
  await prisma.marketplaceRequest.create({
    data: {
      listingId: listing1.id,
      requesterOrganizationId: ecoMatProcessor.id,
      message: "EcoMat has rated capacity to convert 5,000 kg PET into composite pavers this month.",
      status: "PENDING",
    },
  });

  // 9. Economic Calculation Record
  console.log(" -> Seeding Economic Calculation...");
  await prisma.economicCalculation.create({
    data: {
      organizationId: demoFoundry.id,
      wasteStreamId: foundrySandStream.id,
      batchId: batch.id,
      wasteQuantity: 10000,
      disposalCost: 150000, // 15 INR/kg
      processingCost: 80000, // 8 INR/kg
      expectedProductOutput: 8500, // 85% yield
      sellingPrice: 45, // 45 INR/kg
      estimatedRevenue: 382500,
      estimatedNetValue: 302500,
      estimatedValueRecovered: 452500,
      assumptions: JSON.stringify({
        baselineSurchargePerKg: 15,
        overheadPerKg: 8,
        yieldMultiplier: 0.85,
        paverPricePerUnit: 45,
      }),
      disclaimer: "Illustrative Prototype Calculation — Not a commercial valuation quote",
    },
  });

  // 10. Impact Record
  console.log(" -> Seeding Impact Record...");
  await prisma.impactRecord.create({
    data: {
      organizationId: demoFoundry.id,
      batchId: batch.id,
      wasteDiverted: 10000,
      materialRecovered: 8200,
      estimatedCo2Reduction: 3444, // in kg CO2e
      productsProduced: 2450,
      methodology: "Comparative Life Cycle Analysis vs Landfill Linear Baseline",
      confidenceLevel: "PROTOTYPE_ESTIMATE",
      disclaimer: "Environmental data is a prototype estimate. Requires validated lifecycle analysis (LCA).",
    },
  });

  // 11. Audit Logs
  console.log(" -> Seeding Audit Logs...");
  await prisma.auditLog.create({
    data: {
      actorId: factoryUser.id,
      organizationId: demoFoundry.id,
      action: "CREATE_BATCH",
      resourceType: "Batch",
      resourceId: batch.id,
      metadata: JSON.stringify({ batchCode: "RF-2026-001", quantity: 10000 }),
    },
  });

  console.log("✅ [PART 2] Database successfully seeded with all models, pathways, and provenance events!");
  console.log("Default Credentials:");
  console.log(" - Factory:   factory@demofoundry.com / Demo1234!");
  console.log(" - Processor: processor@ecomat.com    / Demo1234!");
  console.log(" - Admin:     admin@reform.eco        / Admin1234!");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
