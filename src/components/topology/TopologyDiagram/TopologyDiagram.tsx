import { useEffect, useRef } from "react";
import * as d3 from "d3";
import type { TopologyDiagramProps } from "./TopologyDiagram.types";
import { STATUS_COLORS } from "@/tokens/colors";

type SimNode = TopologyDiagramProps["nodes"][number] & d3.SimulationNodeDatum;
type SimLink = d3.SimulationLinkDatum<SimNode>;
export function TopologyDiagram({
  nodes,
  edges,
  width = 480,
  height = 320,
}: TopologyDiagramProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const simNodes: SimNode[] = nodes.map((n) => ({ ...n }));
    const simLinks: SimLink[] = edges.map((e) => ({ ...e }));

    const simulation = d3
      .forceSimulation(simNodes)
      .force(
        "link",
        d3
          .forceLink<SimNode, SimLink>(simLinks)
          .id((d) => d.id)
          .distance(120),
      )
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide(52));

    const link = svg
      .append("g")
      .selectAll<SVGLineElement, SimLink>("line")
      .data(simLinks)
      .join("line")
      .attr("stroke", "#334155")
      .attr("stroke-width", 1.5);

    const node = svg
      .append("g")
      .selectAll("g")
      .data(simNodes)
      .join("g")
      .call(
        d3.drag<SVGGElement, SimNode>().on("drag", (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        }),
      );

    node
      .append("circle")
      .attr("r", 24)
      .attr("fill", (d) => STATUS_COLORS[d.status])
      .attr("stroke", (d) => (d.isController ? "#e2e8f0" : "none"))
      .attr("stroke-width", 2);

    node
      .append("text")
      .text((d) => d.label)
      .attr("text-anchor", "middle")
      .attr("dy", 40)
      .attr("fill", "#e2e8f0")
      .attr("font-size", 11);

    node
      .selectAll("text.badge")
      .data((d) => d.badges ?? [])
      .join("text")
      .attr("class", "badge")
      .text((b) => `${b.label} ${b.value}`)
      .attr("text-anchor", "middle")
      .attr("dy", (_b, i) => 54 + i * 12)
      .attr("fill", "#94a3b8")
      .attr("font-size", 9);

    simulation.on("tick", () => {
      link
        .attr("x1", (d) => (d.source as SimNode).x ?? 0)
        .attr("y1", (d) => (d.source as SimNode).y ?? 0)
        .attr("x2", (d) => (d.target as SimNode).x ?? 0)
        .attr("y2", (d) => (d.target as SimNode).y ?? 0);
      node.attr("transform", (d) => `translate(${d.x},${d.y})`);
    });

    return () => {
      simulation.stop();
    };
  }, [nodes, edges, width, height]);

  return (
    <div className="flex justify-center">
      <svg ref={svgRef} width={width} height={height} />
    </div>
  );
}
