import { useEffect, useRef } from "react";
import * as d3 from "d3";
import type { TopologyDiagramProps } from "./TopologyDiagram.types";
import { STATUS_COLORS } from "@/tokens/colors";

type SimNode = TopologyDiagramProps["nodes"][number] & d3.SimulationNodeDatum;
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
    const simLinks = edges.map((e) => ({ ...e }));

    const simulation = d3
      .forceSimulation(simNodes)
      .force(
        "link",
        d3
          .forceLink(simLinks)
          .id((d: SimNode) => d.id)
          .distance(120),
      )
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2));

    const link = svg
      .append("g")
      .selectAll("line")
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

    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);
      node.attr("transform", (d) => `translate(${d.x},${d.y})`);
    });

    return () => {
      simulation.stop();
    };
  }, [nodes, edges, width, height]);

  return <svg ref={svgRef} width={width} height={height} />;
}
