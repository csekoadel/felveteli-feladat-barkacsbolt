import { randomUUID } from 'node:crypto';

export const TOOL_NAMES_BY_CATEGORY = Object.freeze({
  PAINTING: Object.freeze(['PAINT_ROLLER', 'PAINT_BRUSH', 'PAINT_TRAY', 'PAINT_SCRAPER']),
  ROOF_BUILDING: Object.freeze(['ROOFING_HAMMER', 'ROOFING_NAILER', 'ROOFING_SHOVEL', 'ROOFING_HATCHET']),
  ELECTRIC: Object.freeze(['VOLTAGE_TESTER', 'WIRE_STRIPPER', 'MULTIMETER', 'CABLE_CUTTER']),
  WATER: Object.freeze(['PIPE_WRENCH', 'PIPE_CUTTER', 'PLUNGER', 'BASIN_WRENCH']),
  GAS: Object.freeze(['GAS_LEAK_DETECTOR', 'GAS_PRESSURE_GAUGE', 'GAS_PIPE_CUTTER', 'GAS_PIPE_WRENCH']),
  GENERAL: Object.freeze(['TAPE_MEASURE', 'HAMMER', 'SCREWDRIVER', 'SPIRIT_LEVEL']),
});

export const CATEGORIES = Object.freeze(Object.keys(TOOL_NAMES_BY_CATEGORY));
export const TOOL_NAMES = Object.freeze(Object.values(TOOL_NAMES_BY_CATEGORY).flat());

const INITIAL_TOOLS = [
  { name: 'PAINT_ROLLER', category: 'PAINTING', stock: 15 },
  { name: 'ROOFING_HAMMER', category: 'ROOF_BUILDING', stock: 8 },
  { name: 'VOLTAGE_TESTER', category: 'ELECTRIC', stock: 12 },
  { name: 'PIPE_WRENCH', category: 'WATER', stock: 10 },
  { name: 'GAS_LEAK_DETECTOR', category: 'GAS', stock: 5 },
  { name: 'TAPE_MEASURE', category: 'GENERAL', stock: 20 },
];

export class ApiError extends Error {
  constructor(status, code, message, details) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

function isRecord(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

export function createStore() {
  const tools = INITIAL_TOOLS.map((tool) => ({ id: randomUUID(), ...tool }));

  function listTools() {
    return tools.map((tool) => ({ ...tool }));
  }

  function addTool(input) {
    if (!isRecord(input) || !TOOL_NAMES.includes(input.name)) {
      throw new ApiError(400, 'INVALID_TOOL', 'name must be one of the supported tool name codes.');
    }
    if (!CATEGORIES.includes(input.category)) {
      throw new ApiError(400, 'INVALID_TOOL', 'category must be one of the supported category codes.');
    }
    if (!TOOL_NAMES_BY_CATEGORY[input.category].includes(input.name)) {
      throw new ApiError(400, 'INVALID_TOOL', 'name must belong to the selected category.');
    }
    if (!Number.isSafeInteger(input.stock) || input.stock < 0) {
      throw new ApiError(400, 'INVALID_TOOL', 'stock must be a non-negative safe integer.');
    }

    const tool = { id: randomUUID(), name: input.name, category: input.category, stock: input.stock };
    tools.push(tool);
    return { ...tool };
  }

  function addStock(toolId, input) {
    if (!isRecord(input) || !Number.isSafeInteger(input.quantity) || input.quantity <= 0) {
      throw new ApiError(400, 'INVALID_STOCK', 'quantity must be a positive safe integer.');
    }
    const tool = tools.find((entry) => entry.id === toolId);
    if (!tool) {
      throw new ApiError(404, 'TOOL_NOT_FOUND', 'The requested tool was not found.', { toolId });
    }
    const stock = tool.stock + input.quantity;
    if (!Number.isSafeInteger(stock)) {
      throw new ApiError(400, 'INVALID_STOCK', 'The resulting stock is too large.');
    }
    tool.stock = stock;
    return { ...tool };
  }

  function deleteTool(toolId) {
    const index = tools.findIndex((entry) => entry.id === toolId);
    if (index === -1) {
      throw new ApiError(404, 'TOOL_NOT_FOUND', 'The requested tool was not found.', { toolId });
    }
    const tool = tools[index];
    if (tool.stock > 0) {
      throw new ApiError(409, 'STOCK_NOT_EMPTY', 'A tool with stock cannot be deleted.', {
        toolId,
        stock: tool.stock,
      });
    }
    tools.splice(index, 1);
  }

  function purchase(input) {
    if (!isRecord(input) || !Array.isArray(input.items) || input.items.length === 0) {
      throw new ApiError(400, 'INVALID_PURCHASE', 'items must be a non-empty array.');
    }

    const quantities = new Map();
    for (const item of input.items) {
      if (!isRecord(item) || typeof item.toolId !== 'string' || item.toolId.length === 0 ||
          !Number.isSafeInteger(item.quantity) || item.quantity <= 0) {
        throw new ApiError(400, 'INVALID_PURCHASE', 'Each item must have a toolId and a positive safe integer quantity.');
      }
      const quantity = (quantities.get(item.toolId) ?? 0) + item.quantity;
      if (!Number.isSafeInteger(quantity)) {
        throw new ApiError(400, 'INVALID_PURCHASE', 'The combined quantity for a tool is too large.');
      }
      quantities.set(item.toolId, quantity);
    }

    const updates = [];
    for (const [toolId, quantity] of quantities) {
      const tool = tools.find((entry) => entry.id === toolId);
      if (!tool) {
        throw new ApiError(404, 'TOOL_NOT_FOUND', 'A requested tool was not found.', { toolId });
      }
      if (quantity > tool.stock) {
        throw new ApiError(409, 'INSUFFICIENT_STOCK', 'Not enough stock is available.', {
          toolId,
          requested: quantity,
          available: tool.stock,
        });
      }
      updates.push({ tool, quantity });
    }

    for (const { tool, quantity } of updates) {
      tool.stock -= quantity;
    }
    return updates.map(({ tool }) => ({ ...tool }));
  }

  return { listTools, addTool, addStock, deleteTool, purchase };
}
