export type PoolCategory = "Lending" | "Liquid Staking" | "Yield Aggregator";

export const POOL_IDS = {
  // Lending
  AAVE_V3: "db678df9-3281-4bc2-a8bb-01160ffd6d48",
  COMPOUND_V3: "c1ca08e4-d618-415e-ad63-fcec58705469",
  MAPLE: "8edfdf02-cdbb-43f7-bca6-954e5fe56813",

  // Liquid Staking
  LIDO: "747c1d2a-c668-4682-b9f9-296708a3dd90",
  BETH: "80b8bf92-b953-4c20-98ea-c9653ef2bb98",
  STADER: "90bfb3c2-5d35-4959-a275-ba5085b08aa3",

  // Yield Aggregator
  CIAN: "107fb915-ab29-475b-b526-d0ed0d3e6110",
  YEARN: "05a3d186-2d42-4e21-b1f0-68c079d22677",
  BEEFY: "1977885c-d5ae-4c9e-b4df-863b7e1578e6", // Note: provided ID has 863b7e..., keep as given when available
} as const;

export const CATEGORY_BY_ID: Record<string, PoolCategory> = {
  [POOL_IDS.AAVE_V3]: "Lending",
  [POOL_IDS.COMPOUND_V3]: "Lending",
  [POOL_IDS.MAPLE]: "Lending",
  [POOL_IDS.LIDO]: "Liquid Staking",
  [POOL_IDS.BETH]: "Liquid Staking",
  [POOL_IDS.STADER]: "Liquid Staking",
  [POOL_IDS.CIAN]: "Yield Aggregator",
  [POOL_IDS.YEARN]: "Yield Aggregator",
  [POOL_IDS.BEEFY]: "Yield Aggregator",
};

export const ALL_POOL_IDS: string[] = Object.values(POOL_IDS);
