import { MarkerType } from "@xyflow/react"

import {
  NODE_COLORS,
  SHAPE_DEFAULTS,
  type CanvasEdge,
  type CanvasNode,
  type CanvasNodeShape,
} from "@/types/canvas"

export interface CanvasTemplate {
  id: string
  name: string
  description: string
  nodes: CanvasNode[]
  edges: CanvasEdge[]
}

function templateNode(
  id: string,
  shape: CanvasNodeShape,
  x: number,
  y: number,
  label: string,
  colorIndex: number,
): CanvasNode {
  const colorPair = NODE_COLORS[colorIndex % NODE_COLORS.length]
  const defaults = SHAPE_DEFAULTS[shape]

  return {
    id,
    type: "canvasNode",
    position: { x, y },
    data: {
      label,
      shape,
      color: colorPair.background,
      textColor: colorPair.text,
    },
    width: defaults.width,
    height: defaults.height,
    style: { width: defaults.width, height: defaults.height },
  }
}

function templateEdge(
  id: string,
  source: string,
  target: string,
  label?: string,
): CanvasEdge {
  return {
    id,
    type: "canvasEdge",
    source,
    target,
    sourceHandle: "r",
    targetHandle: "l",
    markerEnd: { type: MarkerType.ArrowClosed },
    data: { label: label ?? "" },
  }
}

export const CANVAS_TEMPLATES: CanvasTemplate[] = [
  {
    id: "microservices-architecture",
    name: "Microservices Architecture",
    description: "Gateway, domain services, and shared data stores.",
    nodes: [
      templateNode("api-gateway", "pill", 20, 120, "API Gateway", 1),
      templateNode("auth-service", "rectangle", 260, 30, "Auth Service", 0),
      templateNode("orders-service", "rectangle", 260, 120, "Orders Service", 2),
      templateNode("billing-service", "rectangle", 260, 210, "Billing Service", 3),
      templateNode("message-bus", "hexagon", 520, 120, "Message Bus", 4),
      templateNode("orders-db", "cylinder", 760, 60, "Orders DB", 6),
      templateNode("billing-db", "cylinder", 760, 180, "Billing DB", 7),
    ],
    edges: [
      templateEdge("e-1", "api-gateway", "auth-service", "JWT"),
      templateEdge("e-2", "api-gateway", "orders-service", "REST"),
      templateEdge("e-3", "api-gateway", "billing-service", "REST"),
      templateEdge("e-4", "orders-service", "message-bus", "events"),
      templateEdge("e-5", "billing-service", "message-bus", "events"),
      templateEdge("e-6", "orders-service", "orders-db"),
      templateEdge("e-7", "billing-service", "billing-db"),
    ],
  },
  {
    id: "cicd-pipeline",
    name: "CI/CD Pipeline",
    description: "Source to production flow with automated quality gates.",
    nodes: [
      templateNode("commit", "circle", 20, 120, "Commit", 1),
      templateNode("build", "rectangle", 180, 120, "Build", 0),
      templateNode("test", "diamond", 340, 120, "Tests", 2),
      templateNode("scan", "rectangle", 500, 40, "Security Scan", 5),
      templateNode("package", "rectangle", 500, 200, "Package", 3),
      templateNode("staging", "pill", 700, 40, "Staging", 4),
      templateNode("production", "pill", 700, 200, "Production", 6),
    ],
    edges: [
      templateEdge("e-8", "commit", "build"),
      templateEdge("e-9", "build", "test"),
      templateEdge("e-10", "test", "scan", "pass"),
      templateEdge("e-11", "test", "package", "pass"),
      templateEdge("e-12", "scan", "staging"),
      templateEdge("e-13", "package", "production"),
    ],
  },
  {
    id: "event-driven-system",
    name: "Event-Driven System",
    description: "Producers and consumers connected through stream topics.",
    nodes: [
      templateNode("producer-a", "rectangle", 20, 40, "Producer A", 0),
      templateNode("producer-b", "rectangle", 20, 180, "Producer B", 1),
      templateNode("stream", "hexagon", 280, 110, "Event Stream", 4),
      templateNode("processor", "diamond", 520, 110, "Processor", 2),
      templateNode("analytics", "cylinder", 760, 20, "Analytics Store", 7),
      templateNode("notifications", "pill", 760, 190, "Notification Service", 3),
    ],
    edges: [
      templateEdge("e-14", "producer-a", "stream", "publish"),
      templateEdge("e-15", "producer-b", "stream", "publish"),
      templateEdge("e-16", "stream", "processor", "consume"),
      templateEdge("e-17", "processor", "analytics"),
      templateEdge("e-18", "processor", "notifications"),
    ],
  },
]
