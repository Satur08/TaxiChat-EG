import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { City } from '../types';

interface RouteVisualizerProps {
  city: City;
  pickup: string;
  destination: string;
  dataSaver?: boolean;
}

interface Coord {
  x: number;
  y: number;
}

// Fixed coordinates for popular neighborhoods to guarantee realistic, stable layouts
const MALABO_COORDS: Record<string, Coord> = {
  'Centro Ciudad (Plaza de España)': { x: 70, y: 45 },
  'Ela Nguema': { x: 115, y: 55 },
  'Caracolas': { x: 100, y: 20 },
  'Paraíso': { x: 80, y: 75 },
  'Hassan II': { x: 110, y: 95 },
  'Sampaka': { x: 20, y: 110 },
  'Banapá': { x: 45, y: 95 },
  'Campo Yaundé': { x: 75, y: 95 },
  'Aeropuerto de Malabo (SSG)': { x: 25, y: 40 },
  'Fishtown': { x: 120, y: 35 },
  'Alcaide': { x: 55, y: 65 }
};

const BATA_COORDS: Record<string, Coord> = {
  'Centro Ciudad (Bata)': { x: 70, y: 65 },
  'Ngolo': { x: 110, y: 95 },
  'Comandachina': { x: 90, y: 40 },
  'Mondoasi': { x: 45, y: 90 },
  'Ndong Ndong': { x: 95, y: 115 },
  'Asonga': { x: 85, y: 15 },
  'Ikunde': { x: 30, y: 110 },
  'Aeropuerto de Bata (BSG)': { x: 30, y: 35 },
  'Miyobo': { x: 115, y: 65 }
};

// Deterministic coordinate generation for custom inputs so they are stable
const getCoordinate = (name: string, city: City): Coord => {
  const normalized = name.trim();
  if (!normalized) return { x: 70, y: 70 };

  const coordsMap = city === 'Malabo' ? MALABO_COORDS : BATA_COORDS;
  
  // Exact match
  if (coordsMap[normalized]) {
    return coordsMap[normalized];
  }

  // Handle "Mi ubicación actual 📍"
  if (normalized.includes('ubicación') || normalized.includes('📍')) {
    return city === 'Malabo' 
      ? { x: 70, y: 45 } // Fallback to Centro Ciudad 
      : { x: 70, y: 65 };
  }

  // Partial match
  const foundKey = Object.keys(coordsMap).find(k => 
    k.toLowerCase().includes(normalized.toLowerCase()) || 
    normalized.toLowerCase().includes(k.toLowerCase())
  );
  if (foundKey) {
    return coordsMap[foundKey];
  }

  // Deterministic hash coordinate
  let hash = 0;
  for (let i = 0; i < normalized.length; i++) {
    hash = (hash << 5) - hash + normalized.charCodeAt(i);
    hash |= 0;
  }
  
  const x = 20 + Math.abs((hash + 123) % 100);
  const y = 20 + Math.abs((hash * 7 + 456) % 100);
  return { x, y };
};

export const RouteVisualizer: React.FC<RouteVisualizerProps> = ({ city, pickup, destination, dataSaver = false }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 140;
    const height = 140;
    const svg = d3.select(svgRef.current);
    
    // Clear previous drawing
    svg.selectAll('*').remove();

    // 1. Draw Modern Street Grid (GPS Navigation Style) instead of circular radar
    const gridGroup = svg.append('g').attr('class', 'gps-street-grid').style('opacity', 0.22);
    
    // Draw background road lines (vertical and horizontal streets)
    const roadsX = [20, 50, 80, 110];
    const roadsY = [25, 55, 85, 115];
    
    roadsX.forEach((rx) => {
      gridGroup.append('line')
        .attr('x1', rx)
        .attr('y1', 5)
        .attr('x2', rx)
        .attr('y2', height - 5)
        .attr('stroke', '#38bdf8') // Sky-400 street line
        .attr('stroke-width', 0.8);
        
      gridGroup.append('line')
        .attr('x1', rx)
        .attr('y1', 5)
        .attr('x2', rx)
        .attr('y2', height - 5)
        .attr('stroke', '#ffffff')
        .attr('stroke-dasharray', '2,2')
        .attr('stroke-width', 0.3);
    });

    roadsY.forEach((ry) => {
      gridGroup.append('line')
        .attr('x1', 5)
        .attr('y1', ry)
        .attr('x2', width - 5)
        .attr('y2', ry)
        .attr('stroke', '#38bdf8') // Sky-400 street line
        .attr('stroke-width', 0.8);
        
      gridGroup.append('line')
        .attr('x1', 5)
        .attr('y1', ry)
        .attr('x2', width - 5)
        .attr('y2', ry)
        .attr('stroke', '#ffffff')
        .attr('stroke-dasharray', '2,2')
        .attr('stroke-width', 0.3);
    });

    // Draw some diagonal highways to make it look like a real GPS routing map
    gridGroup.append('line')
      .attr('x1', 10)
      .attr('y1', 10)
      .attr('x2', width - 10)
      .attr('y2', height - 10)
      .attr('stroke', '#f59e0b') // Amber primary highway
      .attr('stroke-width', 0.8)
      .attr('opacity', 0.5);

    // Street names/labels on map
    const labelGroup = svg.append('g').attr('class', 'street-labels').style('font-size', '5.5px').style('font-weight', '500').style('fill', '#475569');
    labelGroup.append('text').attr('x', 52).attr('y', 13).text('Av. Independencia');
    labelGroup.append('text').attr('x', 82).attr('y', 125).text('Av. Hassan II');
    labelGroup.append('text').attr('x', width - 42).attr('y', 42).text('C. Rey Boncoro');

    // 2. Draw all other neighborhood dots faintly to make it look like a full-scale dispatch map
    const coordsMap = city === 'Malabo' ? MALABO_COORDS : BATA_COORDS;
    const nodeGroup = svg.append('g').attr('class', 'neighborhood-nodes');
    
    Object.entries(coordsMap).forEach(([name, coord]) => {
      // Don't draw if it's the active pickup or destination
      const isPickup = pickup.trim().toLowerCase() === name.toLowerCase();
      const isDestination = destination.trim().toLowerCase() === name.toLowerCase();
      
      if (!isPickup && !isDestination) {
        nodeGroup.append('circle')
          .attr('cx', coord.x)
          .attr('cy', coord.y)
          .attr('r', 1.8)
          .attr('fill', '#64748b')
          .attr('opacity', 0.4)
          .append('title')
          .text(name);
      }
    });

    // 3. Draw Active Route if both points are entered
    if (pickup && destination) {
      const p1 = getCoordinate(pickup, city);
      const p2 = getCoordinate(destination, city);

      // Avoid drawing overlap if they are identical
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > 2) {
        // Compute Quadratic Bezier curve control point
        const offset = dist * 0.25; // curve factor
        const nx = -dy / dist;
        const ny = dx / dist;
        const cx = (p1.x + p2.x) / 2 + nx * offset;
        const cy = (p1.y + p2.y) / 2 + ny * offset;

        // Path generator for Quadratic Bezier
        const pathData = `M ${p1.x} ${p1.y} Q ${cx} ${cy} ${p2.x} ${p2.y}`;

        // Draw dynamic glowing path background
        svg.append('path')
          .attr('d', pathData)
          .attr('fill', 'none')
          .attr('stroke', '#34d399')
          .attr('stroke-width', 3)
          .attr('stroke-linecap', 'round')
          .attr('opacity', 0.15);

        // Draw main path line
        const routePath = svg.append('path')
          .attr('d', pathData)
          .attr('fill', 'none')
          .attr('stroke', '#059669')
          .attr('stroke-width', 1.5)
          .attr('stroke-linecap', 'round')
          .attr('stroke-dasharray', '3,3');

        // Animate the path line moving (flow animation)
        let timer: any = null;
        if (!dataSaver) {
          let offsetShift = 0;
          timer = d3.interval(() => {
            offsetShift = (offsetShift - 0.5) % 12;
            routePath.attr('stroke-dashoffset', offsetShift);
          }, 30);
        }

        // Draw animated taxi moving along the path
        const pathEl = routePath.node();
        if (pathEl) {
          const pathLength = pathEl.getTotalLength();
          
          const taxiGroup = svg.append('g')
            .attr('class', 'animated-taxi')
            .attr('transform', `translate(${p1.x}, ${p1.y})`);

          if (!dataSaver) {
            // Golden taxi pulsing ring
            taxiGroup.append('circle')
              .attr('r', 5)
              .attr('fill', '#f59e0b')
              .attr('opacity', 0.3)
              .append('animate')
              .attr('attributeName', 'r')
              .attr('values', '4;7;4')
              .attr('dur', '1.5s')
              .attr('repeatCount', 'indefinite');
          }

          // Core taxi marker
          taxiGroup.append('circle')
            .attr('r', 3)
            .attr('fill', '#f59e0b')
            .attr('stroke', '#ffffff')
            .attr('stroke-width', 0.7);

          if (!dataSaver) {
            // Custom loop transition to move taxi along the path
            const runTransition = () => {
              taxiGroup
                .transition()
                .duration(Math.max(2500, pathLength * 45)) // dynamic speed based on length
                .ease(d3.easeQuadInOut)
                .tween('pathTween', () => {
                  return (t) => {
                    const point = pathEl.getPointAtLength(t * pathLength);
                    taxiGroup.attr('transform', `translate(${point.x}, ${point.y})`);
                  };
                })
                .on('end', () => {
                  // Loop back from origin after short delay
                  setTimeout(() => {
                    if (svgRef.current) runTransition();
                  }, 800);
                });
            };

            runTransition();
          } else {
            // Place taxi at the center of path static
            const midpoint = pathEl.getPointAtLength(0.5 * pathLength);
            taxiGroup.attr('transform', `translate(${midpoint.x}, ${midpoint.y})`);
          }
        }

        // Cleanup timer on unmount
        return () => {
          if (timer) timer.stop();
        };
      }
    }

    // 4. Draw Beacons
    if (pickup) {
      const p1 = getCoordinate(pickup, city);
      
      if (!dataSaver) {
        // Pulse ring
        svg.append('circle')
          .attr('cx', p1.x)
          .attr('cy', p1.y)
          .attr('r', 6)
          .attr('fill', 'none')
          .attr('stroke', '#10b981')
          .attr('stroke-width', 1.5)
          .attr('opacity', 0.8)
          .append('animate')
          .attr('attributeName', 'r')
          .attr('values', '4;10;4')
          .attr('dur', '2s')
          .attr('repeatCount', 'indefinite');
      }

      svg.append('circle')
        .attr('cx', p1.x)
        .attr('cy', p1.y)
        .attr('r', 4.5)
        .attr('fill', '#10b981')
        .attr('stroke', '#ffffff')
        .attr('stroke-width', 1);

      // Label "A"
      svg.append('text')
        .attr('x', p1.x)
        .attr('y', p1.y - 8)
        .attr('text-anchor', 'middle')
        .style('font-size', '8px')
        .style('font-weight', '900')
        .style('fill', '#047857')
        .text('Origen 📍');
    }

    if (destination) {
      const p2 = getCoordinate(destination, city);

      if (!dataSaver) {
        // Pulse ring
        svg.append('circle')
          .attr('cx', p2.x)
          .attr('cy', p2.y)
          .attr('r', 6)
          .attr('fill', 'none')
          .attr('stroke', '#ef4444')
          .attr('stroke-width', 1.5)
          .attr('opacity', 0.8)
          .append('animate')
          .attr('attributeName', 'r')
          .attr('values', '4;10;4')
          .attr('dur', '2s')
          .attr('repeatCount', 'indefinite');
      }

      svg.append('circle')
        .attr('cx', p2.x)
        .attr('cy', p2.y)
        .attr('r', 4.5)
        .attr('fill', '#ef4444')
        .attr('stroke', '#ffffff')
        .attr('stroke-width', 1);

      // Label "B"
      svg.append('text')
        .attr('x', p2.x)
        .attr('y', p2.y - 8)
        .attr('text-anchor', 'middle')
        .style('font-size', '8px')
        .style('font-weight', '900')
        .style('fill', '#b91c1c')
        .text('Destino 🏁');
    }

  }, [city, pickup, destination]);

  return (
    <div className="bg-slate-950 rounded-2xl p-2.5 border border-slate-800 shadow-inner flex flex-col items-center justify-center relative select-none w-[140px] h-[140px]" id="d3-route-visualizer-container">
      {/* Small tech overlay lines */}
      <div className="absolute top-1 left-2 text-[8px] font-mono font-bold text-sky-400 tracking-wider">GPS GE</div>
      <div className="absolute bottom-1 right-2 text-[7px] font-mono font-medium text-slate-500 uppercase">{city}</div>
      
      {/* SVG Canvas for D3 */}
      <svg
        ref={svgRef}
        width="140"
        height="140"
        className="w-[140px] h-[140px] relative z-10"
      />
    </div>
  );
};
