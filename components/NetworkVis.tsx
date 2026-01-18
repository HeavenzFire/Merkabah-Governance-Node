import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { UserNode, Link, SystemState } from '../types';

interface NetworkVisProps {
  nodes: UserNode[];
  links: Link[];
  systemState: SystemState;
}

export const NetworkVis: React.FC<NetworkVisProps> = ({ nodes, links, systemState }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = svgRef.current.clientWidth;
    const height = 400;

    // Clear previous render
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current)
      .attr("viewBox", [0, 0, width, height]);

    // Color scale based on state
    const getNodeColor = (status: string) => {
        if (systemState === SystemState.HALTED) return "#ef4444"; // All red in halted state
        if (status === 'flagged') return "#ef4444";
        return "#6366f1"; // Indigo-500
    };

    // Simulation setup
    const simulation = d3.forceSimulation(nodes as d3.SimulationNodeDatum[])
      .force("link", d3.forceLink(links).id((d: any) => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide().radius(20));

    // Links
    const link = svg.append("g")
      .attr("stroke", "#475569")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", (d) => Math.sqrt(d.strength) * 2);

    // Node groups
    const node = svg.append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .selectAll("g")
      .data(nodes)
      .join("g")
      .call(d3.drag<SVGGElement, any>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended)
      );

    // Node shapes (Merkabah stylized as circles with internal structure suggestion)
    node.append("circle")
      .attr("r", 15)
      .attr("fill", (d: any) => getNodeColor(d.status));
    
    // Simple geometric overlay (triangle suggestion)
    node.append("path")
      .attr("d", "M 0 -8 L 7 4 L -7 4 Z")
      .attr("fill", "none")
      .attr("stroke", "white")
      .attr("stroke-width", 1)
      .attr("opacity", 0.5);

    // Labels
    node.append("text")
      .text((d: any) => d.name)
      .attr("x", 20)
      .attr("y", 5)
      .attr("stroke", "none")
      .attr("fill", "#cbd5e1")
      .style("font-size", "12px")
      .style("pointer-events", "none");

    // Ticker
    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node
        .attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: any, d: any) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    return () => {
      simulation.stop();
    };
  }, [nodes, links, systemState]);

  return (
    <svg ref={svgRef} className="w-full h-[400px] bg-slate-900 rounded-lg shadow-inner border border-slate-700"></svg>
  );
};